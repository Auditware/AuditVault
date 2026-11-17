#!/usr/bin/env node
'use strict';

/**
 * scrape_hacktivity.js
 * HackerOne public Hacktivity -> disclosures/h1-<report id>-<slug>.md
 *
 * Anonymous public GraphQL endpoint (no auth, read-only queries). HIGH and
 * CRITICAL severity only, per vault standard. Cards carry metadata only -
 * report bodies require a logged-in session and are deliberately NOT fetched.
 *
 * Endpoint facts (probed 2026-11-17):
 *   - server-side severity filter NOT supported (TermsFilterInput rejects it)
 *   - `filter` combined with `sort` + `report` fields crashes the endpoint
 *   - `disclosed_at` IS sortable (newest first); `submitted_at` is NOT
 *   - `pageInfo.hasNextPage` is unreliable (false with more pages available)
 *     -> page on `endCursor` with a stuck-cursor guard
 *   So: sort-only query, severity filtered client-side, cursor pagination.
 *
 * Transport: crawlee GotScrapingHttpClient via lib/http.js (browser TLS
 * fingerprint + browser-like headers; hackerone.com is Cloudflare-fronted -
 * gentle pacing only, no raw http clients).
 *
 * Incremental: watermark = oldest disclosed_at walked this run, saved to
 * hacktivity_progress.json (gitignored) after EVERY page, so a killed run
 * resumes correctly. Stops at the first page entirely older than the
 * watermark. Re-run safe: existing report files are skipped.
 *
 * H1_MAX_PAGES=<n> caps pages for a test run (default: unlimited).
 */

const fs   = require('fs');
const path = require('path');
const { postJson, pause } = require('./lib/http');

const VAULT_ROOT = path.resolve(__dirname, '../..');
const DISC_DIR    = path.join(VAULT_ROOT, 'disclosures');
const PROGRESS    = path.join(__dirname, 'hacktivity_progress.json');

const GQL        = 'https://hackerone.com/graphql';
const PAGE       = 50;
const DELAY_MS   = 2000;          // gentle: Cloudflare-fronted site
const PLATFORM   = 'hackerone';
const KEEP       = new Set(['high', 'critical']);
const MAX_PAGES  = Number(process.env.H1_MAX_PAGES || 0);

const HDRS = {
  'Accept':  'application/json',
  'Origin':  'https://hackerone.com',
  'Referer': 'https://hackerone.com/hacktivity',
};

const DOC_FIELDS = [
  'id',
  'severity_rating',
  'total_awarded_amount',
  'currency',
  'cwe',
  'cve_ids',
  'votes',
  'disclosed_at',
  'submitted_at',
  'team { handle name }',
  'reporter { username }',
  'report { _id title url }',
].join('\n  ');

function pageQuery(after) {
  const args = [`first: ${PAGE}`];
  if (after) args.push(`after: "${after}"`);
  args.push('sort: {field: "disclosed_at", direction: DESC}');
  return `{ search(index: CompleteHacktivityReportIndex, query: {bool: {}}, ${args.join(', ')}) `
    + `{ nodes { ... on HacktivityDocument { ${DOC_FIELDS} } } pageInfo { endCursor hasNextPage } } }`;
}

async function gql(query) {
  const body = await postJson(GQL, { query }, HDRS, { label: ' (hackerone graphql)' });
  if (body && Array.isArray(body.errors) && body.errors.length) {
    throw new Error(`GraphQL: ${body.errors[0].message}`);
  }
  const data = body && body.data;
  if (!data || !data.search) throw new Error('GraphQL response missing search');
  return data.search;
}

function slugify(s) {
  return String(s == null ? '' : s).toLowerCase().replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '').slice(0, 60);
}

function esc(s) { return String(s == null ? '' : s).replace(/"/g, "'"); }

function renderCard(n) {
  const rep   = n.report || {};
  const team  = n.team || {};
  const title = rep.title || 'Untitled';
  const sev   = (n.severity_rating || '').toLowerCase();
  const tags  = ['type/disclosure', `platform/${PLATFORM}`, `severity/${sev}`];
  if (n.cwe) tags.push(`cwe/${slugify(n.cwe)}`);

  const bounty = n.total_awarded_amount == null
    ? 'undisclosed'
    : `${Number(n.total_awarded_amount).toLocaleString()} ${n.currency || 'USD'}`;

  return `---
tags:
${tags.map(t => `  - ${t}`).join('\n')}
date: ${n.disclosed_at || ''}
submitted: ${n.submitted_at || ''}
bounty_usd: ${n.total_awarded_amount == null ? 'null' : n.total_awarded_amount}
votes: ${n.votes == null ? 0 : n.votes}
cve: ${(n.cve_ids || []).length ? n.cve_ids.map(c => `"${c}"`).join(', ') : '[]'}
program: "[[programs/${team.handle || 'unknown'}|${esc(team.name || team.handle)}]]"
reporter: "${esc((n.reporter || {}).username || '')}"
source: "${rep.url || ''}"
title: "${esc(title)}"
---
# ${title}

> **Severity:** ${n.severity_rating || 'N/A'} | **Bounty:** ${bounty} | **Votes:** ${n.votes || 0} | **Program:** ${team.name || team.handle || 'N/A'} | **Disclosed:** ${n.disclosed_at || 'N/A'}

- Report: ${rep.url ? `[${rep.url}](${rep.url})` : 'N/A'}
- CWE: ${n.cwe || 'N/A'}${(n.cve_ids || []).length ? ` | CVE: ${n.cve_ids.join(', ')}` : ''}
- Submitted: ${n.submitted_at || 'N/A'}
`;
}

async function main() {
  fs.mkdirSync(DISC_DIR, { recursive: true });

  let progress = { watermark: null };
  try { progress = JSON.parse(fs.readFileSync(PROGRESS, 'utf8')); } catch {}
  const oldWatermark = progress.watermark || '';
  console.log(`Watermark: ${oldWatermark || 'none (full sweep)'}`);

  let after = null, page = 0;
  let written = 0, skippedExisting = 0, skippedSeverity = 0, seen = 0;
  let oldestRun = '';   // oldest disclosed_at walked this run

  while (true) {
    const search = await gql(pageQuery(after));
    const nodes  = search.nodes || [];
    page++;
    seen += nodes.length;

    for (const n of nodes) {
      const da = n.disclosed_at || '';
      if (da && (!oldestRun || da < oldestRun)) oldestRun = da;

      const rep = n.report || {};
      if (!rep._id) continue;
      const fname = `h1-${rep._id}-${slugify(rep.title) || 'report'}.md`;
      const fpath = path.join(DISC_DIR, fname);
      if (fs.existsSync(fpath)) { skippedExisting++; continue; }
      const sev = (n.severity_rating || '').toLowerCase();
      if (!KEEP.has(sev)) { skippedSeverity++; continue; }
      fs.writeFileSync(fpath, renderCard(n));
      written++;
    }

    // Watermark: everything newer than this is walked. Keep the previous
    // watermark if this run stopped before reaching it (no new reports).
    const newWatermark = (oldWatermark && oldestRun < oldWatermark) ? oldWatermark : (oldestRun || oldWatermark);
    fs.writeFileSync(PROGRESS, JSON.stringify({ watermark: newWatermark }));

    process.stdout.write(`\rPage ${page}: total ${seen} | written ${written} | existing ${skippedExisting} | other severity ${skippedSeverity}   `);

    if (oldWatermark && nodes.length && nodes.every(n => (n.disclosed_at || '') < oldWatermark)) {
      console.log(`\nReached watermark (${oldWatermark}) - incremental stop.`);
      break;
    }
    if (!nodes.length) break;
    const pi = search.pageInfo || {};
    if (!pi.endCursor) break;
    if (after && pi.endCursor === after) break;
    after = pi.endCursor;
    if (MAX_PAGES && page >= MAX_PAGES) {
      console.log(`\nPage cap (${MAX_PAGES}) reached - test stop (watermark NOT final).`);
      break;
    }
    await pause(DELAY_MS);
  }

  console.log(`\nDONE - Written: ${written}  Existing: ${skippedExisting}  Other severity: ${skippedSeverity}`);
  console.log(`Watermark saved: ${JSON.parse(fs.readFileSync(PROGRESS, 'utf8')).watermark}`);
}

main().catch(err => { console.error(err); process.exit(1); });