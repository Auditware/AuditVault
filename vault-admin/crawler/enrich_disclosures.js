#!/usr/bin/env node
'use strict';

/**
 * enrich_disclosures.js
 * Append the publicly-readable report detail to disclosures/ cards:
 *
 *   - researcher summary markdown   (report.summaries)          - when written
 *   - full triage timeline          (report.activities)        - state changes
 *     + comment messages with @actor and timestamps
 *   - weakness name + substate      -> frontmatter fields
 *
 * Anonymous read-only GraphQL (same endpoint as scrape_hacktivity.js).
 * NOT fetched, deliberately: `vulnerability_information` (the full report
 * body / repro steps) - that field is permission-gated and returns null to
 * every anonymous client (probed 2026-11-17: API null, SSR shell empty,
 * fresh browsers blocked). Ingesting it would need a logged-in session =
 * explicit owner go.
 *
 * Re-run safe: cards carrying `enriched: true` in frontmatter are skipped.
 *
 * H1_ENRICH_MAX=<n> caps cards for a test run (default: unlimited).
 */

const fs   = require('fs');
const path = require('path');
const { postJson, pause } = require('./lib/http');

const VAULT_ROOT = path.resolve(__dirname, '../..');
const DISC_DIR    = path.join(VAULT_ROOT, 'disclosures');

const GQL      = 'https://hackerone.com/graphql';
const DELAY_MS = 2000;
const MAX_ACTIVITIES = 50;
const MAX_CARDS  = Number(process.env.H1_ENRICH_MAX || 0);

const HDRS = {
  'Accept':  'application/json',
  'Origin':  'https://hackerone.com',
  'Referer': 'https://hackerone.com/hacktivity',
};

const DETAIL_QUERY = `
  query CardDetail($id: Int!) {
    report(id: $id) {
      _id
      substate
      weakness { name }
      summaries { content }
      activities(first: ${MAX_ACTIVITIES}, order_by: { field: created_at, direction: ASC }) {
        total_count
        nodes {
          __typename
          ... on ActivitiesComment {
            message
            created_at
            actor { ... on User { username } ... on Team { name } }
          }
        }
      }
    }
  }`;

function esc(s) { return String(s == null ? '' : s).replace(/"/g, "'"); }

function humanizeType(t) {
  return String(t)
    .replace(/^Activities/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/\bBug\b/, 'Report');
}

function fmtDate(iso) {
  if (!iso) return '';
  const m = String(iso).match(/^(\d{4}-\d{2}-\d{2})/);
  return m ? m[1] : String(iso).slice(0, 10);
}

function renderTimeline(activities, totalCount) {
  if (!activities || !activities.length) return '';
  const lines = activities.map(n => {
    const type = humanizeType(n.__typename || 'activity');
    if (n.__typename === 'ActivitiesComment') {
      const who = n.actor && (n.actor.username || n.actor.name);
      const when = fmtDate(n.created_at);
      const msg = String(n.message || '').trim();
      return `- **${when}** ${who ? `@${who}` : ''}: ${msg}`;
    }
    return `- **${type}**`;
  });
  const more = totalCount > activities.length
    ? `\n\n> ${totalCount - activities.length} more activity entries not fetched (cap ${MAX_ACTIVITIES}).`
    : '';
  return `## Timeline\n\n${lines.join('\n')}${more}\n`;
}

function renderSummary(summaries) {
  const md = (summaries || []).map(s => String(s.content || '').trim()).filter(Boolean).join('\n\n');
  if (!md) return '';
  return `## Report summary\n\n${md}\n`;
}

function enrichCard(fpath, id, detail) {
  const content = fs.readFileSync(fpath, 'utf8');
  const lines = content.split('\n');
  const t = lines.indexOf('tags:');
  let end = t + 1;
  while (end < lines.length && /^ {2}- /.test(lines[end])) end++;
  const existing = new Set(lines.slice(t + 1, end).map(l => l.replace(/^ {2}- /, '')));

  const add = [];
  for (const tag of ['type/disclosure', 'platform/hackerone']) if (!existing.has(tag)) add.push(tag);
  if (add.length) lines.splice(end, 0, ...add.map(x => `  - ${x}`)), end += add.length;

  const fm = lines.slice(0, end).join('\n');
  const body = lines.slice(end).join('\n');
  const fmLines = fm.split('\n');
  const field = (name, val) => {
    if (!fmLines.some(l => l.startsWith(name + ':'))) {
      const tagsEnd = fmLines.length; // append after existing fields (still frontmatter)
      fmLines.splice(tagsEnd, 0, `${name}: ${val}`);
    }
  };
  field('substate', `"${esc(detail.substate)}"`);
  field('weakness', detail.weakness && detail.weakness.name ? `"${esc(detail.weakness.name)}"` : 'null');
  field('enriched', 'true');

  const summary = renderSummary(detail.summaries);
  const timeline = renderTimeline(detail.activities && detail.activities.nodes,
    detail.activities ? detail.activities.total_count : 0);

  const out = fmLines.join('\n') + '\n' + body.replace(/\s+$/, '') + '\n\n' +
    (summary ? summary + '\n' : '') + timeline;
  fs.writeFileSync(fpath, out);
}

async function gqlDetail(id) {
  const body = await postJson(GQL, { query: DETAIL_QUERY, variables: { id } }, HDRS,
    { label: ` (report ${id})`, retries: 4 });
  if (body && Array.isArray(body.errors) && body.errors.length) {
    throw new Error(`GraphQL: ${body.errors[0].message}`);
  }
  const report = body && body.data && body.data.report;
  if (!report) throw new Error('report not found (null)');
  return report;
}

async function main() {
  const files = fs.readdirSync(DISC_DIR).filter(f => f.endsWith('.md')).sort();
  const pending = [];
  let already = 0;
  for (const f of files) {
    const c = fs.readFileSync(path.join(DISC_DIR, f), 'utf8');
    const fm = c.split('\n---\n', 1)[0];
    if (/^enriched:\s*true\s*$/m.test(fm)) { already++; continue; }
    const m = f.match(/^h1-(\d+)-/);
    if (m) pending.push({ f, id: Number(m[1]) });
  }
  console.log(`Cards: ${files.length} | already enriched: ${already} | pending: ${pending.length}`);
  if (!pending.length) return;

  const queue = MAX_CARDS ? pending.slice(0, MAX_CARDS) : pending;
  let ok = 0, failed = 0;
  const errs = [];
  for (let i = 0; i < queue.length; i++) {
    const { f, id } = queue[i];
    try {
      const detail = await gqlDetail(id);
      enrichCard(path.join(DISC_DIR, f), id, detail);
      ok++;
    } catch (e) {
      failed++;
      if (errs.length < 30) errs.push(`${id}: ${e.message.slice(0, 100)}`);
    }
    process.stdout.write(`\r${i + 1}/${queue.length} | ok ${ok} | failed ${failed}   `);
    await pause(DELAY_MS);
  }
  console.log(`\nDONE - enriched: ${ok}  failed: ${failed}`);
  if (errs.length) { console.log('First errors:'); errs.slice(0, 10).forEach(e => console.log(' ', e)); }
}

main().catch(err => { console.error(err); process.exit(1); });