#!/usr/bin/env node
'use strict';

/**
 * tag_report_lang.js
 * Detects smart contract languages by fetching GitHub report sources and
 * injecting lang/ tags into matching vault findings.
 * Re-run safe: only adds tags that are not already present.
 */

const fs    = require('fs');
const path  = require('path');
const https = require('https');

const VAULT_ROOT   = path.resolve(__dirname, '../..');
const FINDINGS_DIR = path.join(VAULT_ROOT, 'findings');
const DELAY_MS     = 250;

// ── HTTP helper ───────────────────────────────────────────────────────────────

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function fetchUrl(url) {
  return new Promise((resolve) => {
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve);
      }
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => resolve(res.statusCode === 200 ? data : null));
    });
    req.on('error', () => resolve(null));
    req.setTimeout(10000, () => { req.destroy(); resolve(null); });
  });
}

// ── GitHub URL → raw URL ──────────────────────────────────────────────────────

function toRawUrls(reportUrl) {
  if (!reportUrl.includes('github.com')) return [];
  if (reportUrl.includes('.pdf')) return [];
  const url = reportUrl.split('#')[0];

  const blobMatch = url.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)$/);
  if (blobMatch) {
    const [, user, repo, branch, filePath] = blobMatch;
    return [`https://raw.githubusercontent.com/${user}/${repo}/${branch}/${filePath}`];
  }
  if (url.includes('sherlock-audit') && url.includes('-judging')) {
    const base = url.replace('-judging', '').replace('github.com', 'raw.githubusercontent.com');
    return [`${base}/main/README.md`, `${base}/master/README.md`];
  }
  if (url.match(/^https:\/\/github\.com\/[^/]+\/[^/]+$/)) {
    const raw = url.replace('github.com', 'raw.githubusercontent.com');
    return [`${raw}/main/README.md`, `${raw}/master/README.md`];
  }
  return [];
}

// ── Language detector ─────────────────────────────────────────────────────────

function detectLangs(content) {
  if (!content) return [];
  const langs = new Set();
  const c     = content.toLowerCase();

  if (/\b\w[\w./]*\.sol\b/.test(content) || /```solidity|pragma solidity/.test(c)) langs.add('lang/solidity');
  if (/\b\w[\w./]*\.vy\b/.test(content)  || /```vyper|@external[\s\n]|@internal[\s\n]/.test(c)) langs.add('lang/vyper');
  if (/\b\w[\w./]*\.rs\b/.test(content)  || /```rust/.test(c)) langs.add('lang/rust');
  if (/\b\w[\w./]*\.move\b/.test(content) || /```move/.test(c)) langs.add('lang/move');
  if (/\b\w[\w./]*\.cairo\b/.test(content) || /```cairo/.test(c)) langs.add('lang/cairo');
  if (/\b\w[\w./]*\.tact\b/.test(content) || /```tact/.test(c)) langs.add('lang/tact');
  if (/\b\w[\w./]*\.fc\b|\b\w[\w./]*\.func\b/.test(content)) langs.add('lang/func');

  if (langs.has('lang/rust') && /#\[account|#\[program\]|anchor_lang|use anchor|seeds::program|solana_program/.test(c)) {
    langs.add('lang/anchor');
  }

  return [...langs];
}

// ── Tag injector ──────────────────────────────────────────────────────────────

function addTagToFile(content, tag) {
  return content.replace(/(tags:[\s\S]*?)(\n---)/m, (match, tagBlock, rest) => {
    if (tagBlock.includes(`- ${tag}`)) return match;
    const block = tagBlock.endsWith('\n') ? tagBlock : tagBlock + '\n';
    return block + `  - ${tag}` + rest;
  });
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const files = fs.readdirSync(FINDINGS_DIR).filter(f => f.endsWith('.md'));

  // Group files by report URL (skip PDFs and non-GitHub)
  const reportToFiles = {};
  for (const f of files) {
    const c = fs.readFileSync(path.join(FINDINGS_DIR, f), 'utf8');
    const r = (c.match(/^report:\s*"?(.+?)"?\s*$/m) || [])[1];
    if (!r || !r.includes('github.com') || r.includes('.pdf')) continue;
    if (!reportToFiles[r]) reportToFiles[r] = [];
    reportToFiles[r].push(f);
  }

  const reportUrls = Object.keys(reportToFiles);
  console.log(`Unique fetchable reports: ${reportUrls.length}`);

  let fetched = 0, failed = 0;
  const cache = {};

  for (const reportUrl of reportUrls) {
    const rawUrls = toRawUrls(reportUrl);
    if (!rawUrls.length) { failed++; continue; }

    let content = null;
    for (const rawUrl of rawUrls) {
      await sleep(DELAY_MS);
      content = await fetchUrl(rawUrl);
      if (content) break;
    }
    if (!content) { failed++; continue; }

    cache[reportUrl] = detectLangs(content);
    fetched++;
    if (fetched % 25 === 0) process.stdout.write(`\r${fetched}/${reportUrls.length} fetched...`);
  }
  console.log(`\nFetch: ${fetched} ok, ${failed} failed`);

  const added = {};
  let filesUpdated = 0;

  for (const [reportUrl, reportLangs] of Object.entries(cache)) {
    if (!reportLangs.length) continue;
    for (const fname of reportToFiles[reportUrl]) {
      const fp = path.join(FINDINGS_DIR, fname);
      let c    = fs.readFileSync(fp, 'utf8');
      const existingLangs = (c.match(/  - lang\/\w+/g) || []).map(l => l.trim());
      const toAdd         = reportLangs.filter(l => !existingLangs.includes(l));
      if (!toAdd.length) continue;
      for (const lang of toAdd) {
        const newC = addTagToFile(c, lang);
        if (newC === c) { console.warn(`Replace failed: ${fname} ${lang}`); continue; }
        c = newC;
        added[lang] = (added[lang] || 0) + 1;
      }
      fs.writeFileSync(fp, c);
      filesUpdated++;
    }
  }

  console.log(`Files updated: ${filesUpdated}`);
  console.log('Added:', added);
}

main().catch(err => { console.error(err); process.exit(1); });
