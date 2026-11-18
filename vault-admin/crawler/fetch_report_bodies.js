#!/usr/bin/env node
'use strict';

/**
 * fetch_report_bodies.js
 * Fetch the full public report body into every disclosures/ card.
 *
 * Source: `GET https://hackerone.com/reports/<id>.json` - the site's own
 * public JSON route (Rails .json), verified 2026-11-17 to serve the complete
 * `vulnerability_information` markdown (Summary/Affected/Reproduce/Impact/
 * Suggested fix) anonymously, through lib/http.js (crawlee transport).
 * The GraphQL `report(id)` field by contrast is permission-gated (null to
 * anonymous) - use this route, not GraphQL, for report bodies.
 *
 * Re-run safe: cards carrying `body: true` (or `body: none` for reports
 * with no public body) in frontmatter are skipped.
 *
 * H1_BODY_MAX=<n> caps cards for a test run (default: unlimited).
 */

const fs   = require('fs');
const path = require('path');
const { getText, pause } = require('./lib/http');

const VAULT_ROOT = path.resolve(__dirname, '../..');
const DISC_DIR    = path.join(VAULT_ROOT, 'disclosures');

const BASE     = 'https://hackerone.com/reports/';
const DELAY_MS = 2000;          // gentle: Cloudflare-fronted site
const MAX_CARDS = Number(process.env.H1_BODY_MAX || 0);

/**
 * Redact real credential values from fetched bodies (labels/structure kept).
 * Policy: PoC bodies of disclosed reports often embed the researcher's own
 * leaked-sample credentials - dead, but real-format, and GitHub push
 * protection blocks pushes on them (2026-11-17). Inert material is kept:
 * commit SHAs, version hashes, dead-CTF tokens, password hashes.
 */
const REDACT = '[REDACTED - see source report]';
const BODY_REDACTIONS = [
  [/\b(?:ASIA|AKIA)[0-9A-Z]{16}\b/g, REDACT],
  [/("SecretAccessKey"\s*[:=]\s*")[A-Za-z0-9/+=]{30,}(")/g, '$1' + REDACT + '$2'],
  [/("Token"\s*:\s*")Fwo[A-Za-z0-9+/=]{100,}(")/g, '$1[REDACTED AWS session token]$2'],
  [/(X-Amz-Security-Token=)IQoJ[A-Za-z0-9%/+=]{100,}/g, '$1[REDACTED]'],
  [/\bGHSAT0[A-Za-z0-9_]{20,}\b/g, REDACT],
  [/\bEA[A-Za-z0-9]{40,}\b/g, REDACT], // facebook access tokens
  [/\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/g, '[REDACTED-JWT]'],
  [/-----BEGIN ([A-Z ]*)PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g,
    (m, alg) => `-----BEGIN ${alg}PRIVATE KEY-----\n[REDACTED KEY BODY - see source report]\n-----END ${alg}PRIVATE KEY-----`],
];

function redactBody(md) {
  let out = md;
  for (const [rx, rep] of BODY_REDACTIONS) out = out.replace(rx, rep);
  return out;
}

async function fetchReport(id) {
  const raw = String(await getText(BASE + id + '.json', {
    Accept:  'application/json',
    Referer: BASE + id,
  }, { label: ` (report ${id})`, retries: 4 }));
  let data;
  try { data = JSON.parse(raw); }
  catch { throw new Error(`non-JSON body (${raw.slice(0, 60)})`); }
  if (!data || typeof data.id === 'undefined') throw new Error('malformed report JSON');
  return data;
}

/** Add the `## Report body` section before `## Timeline`. */
function insertBody(content, bodyMd) {
  const bodySection = `\n## Report body\n\nPublic report body - fetched from \`${BASE}<id>.json\` (the site's own disclosed-report data route).\n\n${bodyMd.trim()}\n`;
  if (content.includes('\n## Timeline')) {
    return content.replace('\n## Timeline', bodySection + '\n## Timeline');
  }
  return content.replace(/\s+$/, '') + '\n' + bodySection;
}

function markBody(content, val) {
  if (/^body: /m.test(content.split('\n---\n')[0])) return content;
  return content.replace(/^enriched: true$/m, `enriched: true\nbody: ${val}`);
}

async function main() {
  const files = fs.readdirSync(DISC_DIR).filter(f => f.endsWith('.md')).sort();

  const pending = [];
  let done = 0;
  for (const f of files) {
    const c = fs.readFileSync(path.join(DISC_DIR, f), 'utf8');
    const fm = c.split('\n---\n')[0];
    if (/^body: (true|none)\s*$/m.test(fm)) { done++; continue; }
    const m = f.match(/^h1-(\d+)-/);
    if (m) pending.push({ f, id: Number(m[1]) });
  }
  console.log(`Cards: ${files.length} | body already in: ${done} | pending: ${pending.length}`);
  if (!pending.length) return;

  const queue = MAX_CARDS ? pending.slice(0, MAX_CARDS) : pending;
  let ok = 0, none = 0, failed = 0;
  const errs = [];

  for (let i = 0; i < queue.length; i++) {
    const { f, id } = queue[i];
    try {
      const rep = await fetchReport(id);
      const body = redactBody((rep.vulnerability_information || '').trim());
      const fpath = path.join(DISC_DIR, f);
      if (body) {
        fs.writeFileSync(fpath, markBody(insertBody(fs.readFileSync(fpath, 'utf8'), body), 'true'));
        ok++;
      } else {
        fs.writeFileSync(fpath, markBody(fs.readFileSync(fpath, 'utf8'), 'none'));
        none++;
      }
    } catch (e) {
      failed++;
      if (errs.length < 30) errs.push(`${id}: ${e.message.slice(0, 100)}`);
    }
    process.stdout.write(`\r${i + 1}/${queue.length} | bodies ${ok} | no-body ${none} | failed ${failed}   `);
    await pause(DELAY_MS);
  }

  console.log(`\nDONE - bodies written: ${ok}  no public body: ${none}  failed: ${failed}`);
  if (errs.length) { console.log('First errors:'); errs.slice(0, 10).forEach(e => console.log(' ', e)); }
}

main().catch(err => { console.error(err); process.exit(1); });