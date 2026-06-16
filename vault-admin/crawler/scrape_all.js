#!/usr/bin/env node
'use strict';

const https    = require('https');
const fs       = require('fs');
const path     = require('path');

const VAULT_ROOT    = path.resolve(__dirname, '../..');
const FINDINGS_DIR  = path.join(VAULT_ROOT, 'findings');
const PROGRESS_FILE = path.join(__dirname, 'scrape_progress.json');
const DELAY_MS      = 800; // ms between requests

// ── Solodit tRPC request builder ─────────────────────────────────────────────

function buildInput(page) {
  const inner = [
    { filters: 1, page: 19 },                          // 0
    {
      keywords: 2, firms: 3, tags: 4, forked: 5, impact: 6, user: -1, protocol: -1,
      reported: 9, reportedAfter: -1, protocolCategory: 12, languages: 13,
      minFinders: 2, maxFinders: 2, rarityScore: -1, qualityScore: -1,
      bookmarked: 15, read: 16, unread: 16, sortField: 17, sortDirection: 18,
    },                                                  // 1
    '',                                                 // 2  keywords
    [],                                                 // 3  firms
    [],                                                 // 4  tags
    [],                                                 // 5  forked
    [7],                                                // 6  impact → [HIGH]
    'HIGH',                                             // 7
    'GAS',                                              // 8  (unreferenced)
    { label: 10, value: 11 },                           // 9  reported
    'All time',                                         // 10
    'alltime',                                          // 11
    [],                                                 // 12 protocolCategory
    [],                                                 // 13 languages
    5,                                                  // 14 (unreferenced)
    false,                                              // 15 bookmarked
    true,                                               // 16 unread
    'Recency',                                          // 17 sortField
    'Desc',                                             // 18 sortDirection
    page,                                               // 19 page
  ];
  return JSON.stringify({ '0': '-1', '1': JSON.stringify(inner) });
}

// ── HTTP helper ───────────────────────────────────────────────────────────────

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function fetchPage(page) {
  return new Promise((resolve, reject) => {
    const input = encodeURIComponent(buildInput(page));
    const url   = `https://solodit.cyfrin.io/api/trpc/trialRouter.get,findings.get?batch=1&input=${input}`;
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        Accept:       'application/json',
        Referer:      'https://solodit.cyfrin.io/',
      },
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// ── Response parser ───────────────────────────────────────────────────────────

function extractStr(str, fieldName) {
  const marker = `${fieldName}:"`;
  const start  = str.indexOf(marker);
  if (start === -1) return '';
  let pos = start + marker.length;
  let result = '';
  while (pos < str.length) {
    if (str[pos] === '\\' && str[pos + 1] === '"')  { result += '"';  pos += 2; continue; }
    if (str[pos] === '\\' && str[pos + 1] === 'n')  { result += '\n'; pos += 2; continue; }
    if (str[pos] === '\\' && str[pos + 1] === 'r')  { pos += 2; continue; }
    if (str[pos] === '\\' && str[pos + 1] === 't')  { result += '\t'; pos += 2; continue; }
    if (str[pos] === '\\' && str[pos + 1] === '\\') { result += '\\'; pos += 2; continue; }
    if (str[pos] === '\\' && str[pos + 1] === 'u') {
      result += String.fromCharCode(parseInt(str.slice(pos + 2, pos + 6), 16));
      pos += 6; continue;
    }
    if (str[pos] === '"') break;
    result += str[pos]; pos++;
  }
  return result;
}

function parseFindings(dataStr) {
  const findings = [];
  let pos = 0;
  while (true) {
    const idIdx = dataStr.indexOf('{id:', pos);
    if (idIdx === -1) break;
    const idEnd = dataStr.indexOf('n,', idIdx);
    if (idEnd === -1) { pos = idIdx + 1; continue; }
    const id = dataStr.slice(idIdx + 4, idEnd);
    if (!/^\d+$/.test(id) || parseInt(id) < 10000) { pos = idIdx + 1; continue; }
    const chunk = dataStr.slice(idIdx, idIdx + 25000);
    const slug  = extractStr(chunk, 'slug');
    if (!slug) { pos = idIdx + 1; continue; }
    findings.push({
      id,
      title:    extractStr(chunk, 'title'),
      content:  extractStr(chunk, 'content'),
      summary:  extractStr(chunk, 'summary'),
      source:   extractStr(chunk, 'source_link'),
      slug,
      firm:     extractStr(chunk, 'firm_name'),
      protocol: extractStr(chunk, 'protocol_name'),
      impact:   extractStr(chunk, 'impact'),
      reporter: extractStr(chunk, 'handle'),
    });
    pos = idIdx + 1;
  }
  return findings;
}

// ── Markdown renderer ─────────────────────────────────────────────────────────

function toMarkdown(f) {
  const byline = f.firm && f.reporter !== f.firm
    ? `${f.reporter || f.firm} (${f.firm})`
    : (f.reporter || f.firm);
  return `# ${f.title}

- id: ${f.id}
- impact: ${f.impact}
- protocol: ${f.protocol}
- reporter: ${byline}
- source: ${f.source || 'N/A'}

## Summary

${f.summary || '_No summary available._'}

## Details

${f.content || '_No content available._'}
`;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  let progress = { lastPage: 0, totalPages: 813, written: 0, skipped: 0 };
  if (fs.existsSync(PROGRESS_FILE)) {
    progress = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
    console.log(`Resuming from page ${progress.lastPage + 1}`);
  }

  const existing  = new Set(fs.readdirSync(FINDINGS_DIR).map(f => f.split('-')[0]));
  console.log(`Vault has ${existing.size} existing files`);

  for (let page = progress.lastPage + 1; page <= progress.totalPages; page++) {
    try {
      const raw   = await fetchPage(page);
      let outer;
      try { outer = JSON.parse(raw); } catch {
        console.error(`Page ${page}: JSON parse error`); continue;
      }

      const dataStr = outer[1]?.result?.data || '';
      if (!dataStr) { console.error(`Page ${page}: no data`); continue; }

      if (page === progress.lastPage + 1) {
        const pagesM = dataStr.match(/pages:(\d+)/);
        if (pagesM) {
          progress.totalPages = parseInt(pagesM[1]);
          console.log(`Total pages: ${progress.totalPages}`);
        }
      }

      for (const f of parseFindings(dataStr)) {
        if (existing.has(f.id)) { progress.skipped++; continue; }
        const slugShort = f.slug.slice(0, 60).replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/-$/, '');
        const filepath  = path.join(FINDINGS_DIR, `${f.id}-${slugShort}.md`);
        fs.writeFileSync(filepath, toMarkdown(f));
        existing.add(f.id);
        progress.written++;
      }

      progress.lastPage = page;
      fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress));

      const pct = ((page / progress.totalPages) * 100).toFixed(1);
      process.stdout.write(`\rPage ${page}/${progress.totalPages} (${pct}%) | written: ${progress.written} skipped: ${progress.skipped}  `);

      await sleep(DELAY_MS);
    } catch (e) {
      console.error(`\nPage ${page} error:`, e.message);
      await sleep(3000);
    }
  }

  console.log(`\n\nDone! Written: ${progress.written}, Skipped: ${progress.skipped}`);
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify({ ...progress, done: true }));
}

main().catch(err => { console.error(err); process.exit(1); });
