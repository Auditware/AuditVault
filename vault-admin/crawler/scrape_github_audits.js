#!/usr/bin/env node
'use strict';

/**
 * scrape_github_audits.js
 * GitHub audit repo scraper.
 * Sources: Frankcastleauditor/public-audits, Auditware/audits
 * Severity filter: HIGH / CRITICAL only.
 * Dedup: hash of (protocol | title) - skips already-written files.
 */

const https  = require('https');
const fs     = require('fs');
const path   = require('path');
const crypto = require('crypto');

const VAULT_ROOT   = path.resolve(__dirname, '../..');
const FINDINGS_DIR = path.join(VAULT_ROOT, 'findings');

const REPOS = [
  { owner: 'Frankcastleauditor', repo: 'public-audits', reportsPath: 'reports', auditor: 'FrankCastle' },
  { owner: 'Auditware',          repo: 'audits',         reportsPath: '',        auditor: 'Auditware' },
];

const GH_TOKEN = process.env.GITHUB_TOKEN || '';

// ── HTTP helpers ──────────────────────────────────────────────────────────────

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function get(url, extraHeaders = {}) {
  return new Promise((resolve, reject) => {
    const headers = { 'User-Agent': 'Mozilla/5.0', ...extraHeaders };
    if (GH_TOKEN) headers['Authorization'] = `token ${GH_TOKEN}`;
    require('https').get(url, { headers }, res => {
      if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location) {
        return get(res.headers.location, extraHeaders).then(resolve, reject);
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks) }));
    }).on('error', reject);
  });
}

async function ghList(owner, repo, repoPath = '') {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${repoPath}`;
  const { status, body } = await get(url, { Accept: 'application/vnd.github.v3+json' });
  if (status !== 200) throw new Error(`GitHub API ${status} for ${url}`);
  return JSON.parse(body.toString());
}

async function ghDownload(url) {
  const { status, body } = await get(url);
  if (status !== 200) throw new Error(`Download ${status} for ${url}`);
  return body;
}

// ── Repo walker ───────────────────────────────────────────────────────────────

async function* walkRepo(owner, repo, repoPath = '') {
  let items;
  try {
    items = await ghList(owner, repo, repoPath);
  } catch (e) {
    console.warn(`  WARN walk ${repoPath}: ${e.message}`);
    return;
  }
  if (!Array.isArray(items)) return;

  // Group by stem to prefer .md over .pdf
  const byStem = {};
  for (const item of items) {
    if (item.type === 'file') {
      const stem = path.basename(item.name, path.extname(item.name));
      const ext  = path.extname(item.name).toLowerCase();
      if (!byStem[stem]) byStem[stem] = {};
      byStem[stem][ext] = item;
    } else if (item.type === 'dir') {
      yield* walkRepo(owner, repo, item.path);
    }
  }

  for (const exts of Object.values(byStem)) {
    const item = exts['.md'] || exts['.pdf'];
    if (!item) continue;
    yield { name: item.name, url: item.download_url, ext: path.extname(item.name).toLowerCase() };
  }
}

// ── PDF extraction ────────────────────────────────────────────────────────────

async function pdfToText(buf) {
  try {
    const pdfParse = require('pdf-parse');
    const data     = await pdfParse(buf);
    return data.text;
  } catch {
    return '';
  }
}

// ── Finding extraction ────────────────────────────────────────────────────────

const SEVERITY_LINE = /(?:severity|impact)[:\s*]+\*{0,2}(high|critical|medium|low)\b/i;

const MD_FINDING_RE = /^(#{1,4})\s+(?:<[^>]+>)*\*{0,2}((?:[A-Z]{1,6}-)?[HC]-\d+[.:)\s]+.{5,150})\*{0,2}\s*(?:\{#[^}]*\})?\s*$/mg;
const PDF_FINDING_RE = /^\[?([HC]-\d+)\]?\s+(.{5,150})$/mg;
const SECTION_RE    = /^#{1,3}\s+(High|Critical)\s*(?:Risk\s*)?Findings?/img;
const CODEHAWKS_RE  = /^#{2,4}\s+(?:<[^>]*>)*([HC]-\d+)[.:\s]+(.{5,150})$/mg;

function extractFindings(text, reportName, auditor) {
  const lines = text.split('\n');
  const cands = [];

  // Pass 1: explicit finding ID in markdown heading
  for (const m of text.matchAll(MD_FINDING_RE)) {
    let raw = m[2].replace(/<[^>]+>/g, '').replace(/[*#\s]+$/, '').replace(/^\s*[*#]+/, '').trim();
    raw = raw.replace(/\s*\{#[^}]+\}/g, '').trim();
    const sev = /-C-\d+|\bCRIT/i.test(raw) ? 'critical' : 'high';
    const li  = text.slice(0, m.index).split('\n').length - 1;
    cands.push([li, raw, sev]);
  }

  // Pass 2: section-scoped
  let sectionSev = null;
  for (let i = 0; i < lines.length; i++) {
    const sm = lines[i].match(/^#{1,3}\s+(High|Critical)\s*(?:Risk\s*)?Findings?/i);
    if (sm) { sectionSev = sm[1].toLowerCase(); continue; }
    if (sectionSev) {
      const ck = lines[i].match(/^#{2,4}\s+(?:<[^>]*>)*([HC]-\d+)[.:\s]+(.{5,150})$/i);
      if (ck) {
        const title = `${ck[1]}. ${ck[2].trim()}`.replace(/<[^>]+>/g, '').trim();
        cands.push([i, title, sectionSev]);
      } else if (/^#{1,2}\s+\w/.test(lines[i]) && !sm) {
        sectionSev = null;
      }
    }
  }

  // Pass 3: PDF bracket style
  for (const m of text.matchAll(PDF_FINDING_RE)) {
    const sev = m[1].startsWith('C-') ? 'critical' : 'high';
    const li  = text.slice(0, m.index).split('\n').length - 1;
    if (!cands.some(([c]) => Math.abs(c - li) < 3)) {
      cands.push([li, `${m[1]} ${m[2].trim()}`, sev]);
    }
  }

  // Pass 4: Cantina decimal format
  for (let i = 0; i < lines.length - 2; i++) {
    if (!/^\d+\.\d+\.\d+\s*$/.test(lines[i])) continue;
    const titleLine = lines[i + 1].trim();
    const sevLine   = lines[i + 2].trim();
    if (titleLine.length <= 10 || titleLine.length >= 160) continue;
    const sm = sevLine.match(/^Severity:\s*(Critical|High)/i);
    if (sm && !cands.some(([c]) => Math.abs(c - i) < 5)) {
      cands.push([i, titleLine, sm[1].toLowerCase()]);
    }
  }

  // Pass 5: Accretion format
  for (let i = 0; i < lines.length - 2; i++) {
    const idm = lines[i].trim().match(/^(ACC-[CH]\d+)\s*$/i);
    if (!idm) continue;
    let j = i + 1;
    while (j < lines.length && ['', 'Title'].includes(lines[j].trim())) j++;
    const titleLine = lines[j]?.trim() || '';
    let sev = null;
    for (let k = j + 1; k < Math.min(j + 6, lines.length); k++) {
      if (/^(critical|high)\s*$/i.test(lines[k].trim())) { sev = lines[k].trim().toLowerCase(); break; }
    }
    if (sev && titleLine.length > 10 && titleLine.length < 160 && !cands.some(([c]) => Math.abs(c - i) < 5)) {
      cands.push([i, `${idm[1].toUpperCase()}: ${titleLine}`, sev]);
    }
  }

  // Deduplicate
  const seenIds  = new Set();
  const seenKeys = new Set();
  const unique   = [];
  for (const [li, title, sev] of cands.sort((a, b) => a[0] - b[0])) {
    const idm = title.match(/([A-Z]{0,6}-?[HC]-\d+)/i);
    const fid = idm?.[1]?.toUpperCase();
    if (fid && seenIds.has(fid)) continue;
    const key = title.toLowerCase().slice(0, 60).replace(/\s+/g, ' ');
    if (seenKeys.has(key)) continue;
    if (fid) seenIds.add(fid);
    seenKeys.add(key);
    unique.push([li, title, sev]);
  }

  // Extract bodies, filter medium/low overrides
  const findings = [];
  for (let idx = 0; idx < unique.length; idx++) {
    const [li, title, sev] = unique[idx];
    const end  = unique[idx + 1]?.[0] ?? Math.min(li + 100, lines.length);
    const body = lines.slice(li, end).join('\n');
    const bsm  = body.slice(0, 400).match(SEVERITY_LINE);
    if (bsm && ['medium', 'low'].includes(bsm[1].toLowerCase())) continue;
    findings.push({ title: title.trim(), severity: sev, body, report: reportName, auditor });
  }
  return findings;
}

// ── Slug / hash helpers ───────────────────────────────────────────────────────

function slugify(s) {
  return s.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);
}

function extractProtocol(reportName) {
  let name = path.basename(reportName, path.extname(reportName));
  name = name.replace(/[-_](audit|security.review|report|final|v\d+).*/i, '');
  name = name.replace(/[-_]+/g, ' ').trim();
  return name.replace(/\b\w/g, c => c.toUpperCase());
}

function dedupHash(dedupText) {
  return crypto.createHash('md5').update(dedupText).digest('hex').slice(0, 6);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  // Pre-index existing vault hashes to skip duplicates
  const existingHashes = new Set(
    fs.readdirSync(FINDINGS_DIR)
      .filter(f => f.startsWith('gh-') && f.endsWith('.md'))
      .map(f => f.slice(3, 9))  // extract the 6-char hash
  );

  let written = 0, skippedDup = 0, errors = 0;

  for (const { owner, repo, reportsPath, auditor } of REPOS) {
    console.log(`\n=== ${owner}/${repo} ===`);

    for await (const { name, url, ext } of walkRepo(owner, repo, reportsPath)) {
      process.stdout.write(`  ${name} `);
      let data;
      try {
        data = await ghDownload(url);
      } catch (e) {
        console.log(`ERROR download: ${e.message}`);
        errors++;
        continue;
      }

      let text;
      if (ext === '.pdf') {
        text = await pdfToText(data);
      } else {
        text = data.toString('utf8');
      }

      const protocol = extractProtocol(name);
      const findings = extractFindings(text, name, auditor);
      console.log(`→ ${findings.length} high/critical candidates`);

      for (const f of findings) {
        const dedupText = `${protocol} | ${f.title}`;
        const hash      = dedupHash(dedupText);

        if (existingHashes.has(hash)) {
          skippedDup++;
          continue;
        }

        const slug  = slugify(`${protocol}-${f.title}`);
        const fname = `gh-${hash}-${slug}.md`;
        const fpath = path.join(FINDINGS_DIR, fname);

        if (fs.existsSync(fpath)) { skippedDup++; continue; }

        const fm = `---\ntags:\n  - severity/high\nprotocol: "${protocol}"\nauditors:\n  - "[[${auditor}]]"\n---\n`;
        fs.writeFileSync(fpath, fm + f.body);
        existingHashes.add(hash);
        written++;
        console.log(`    NEW: ${f.title.slice(0, 60)}`);
      }

      await sleep(100);
    }
  }

  console.log('\n=== DONE ===');
  console.log(`Written: ${written}  Deduped: ${skippedDup}  Errors: ${errors}`);
}

main().catch(err => { console.error(err); process.exit(1); });
