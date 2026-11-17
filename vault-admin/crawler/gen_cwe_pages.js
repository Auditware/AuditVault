#!/usr/bin/env node
'use strict';

/**
 * gen_cwe_pages.js
 * cwe/<slug>.md from disclosures/ - per-CWE reference pages.
 *
 * The web2 analog of classifications/bug/ taxonomy pages, but generated:
 * for each CWE label seen on disclosure cards, one page listing every
 * vault disclosure of that class, ranked by community votes (the highest-
 * voted reports are the canonical "how this class actually lands" writeups).
 * No hand-written prose - the vault has metadata cards only (report bodies
 * are login-walled), so these pages stay data: counts, severity split,
 * known bounty, affected programs, and the ranked report list.
 *
 * Re-run safe: pages carry `generated: true` and are rebuilt each run.
 */

const fs   = require('fs');
const path = require('path');

const VAULT_ROOT = path.resolve(__dirname, '../..');
const DISC_DIR   = path.join(VAULT_ROOT, 'disclosures');
const CWE_DIR    = path.join(VAULT_ROOT, 'cwe');

function fmBlock(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---/);
  return m ? m[1] : '';
}

function fmField(fm, name) {
  const m = fm.match(new RegExp(`^${name}:\\s*(.*)$`, 'm'));
  return m ? m[1].trim() : '';
}

function fmTags(fm, prefix) {
  const re = new RegExp(`^ {2}- ${prefix}/([a-z0-9/_-]+)\\s*$`, 'gm');
  return [...fm.matchAll(re)].map(m => m[1]);
}

function h1(content) {
  const m = content.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : '';
}

function money(n) {
  return n == null ? 'undisclosed' : `$${Number(n).toLocaleString()}`;
}

function esc(s) { return String(s == null ? '' : s).replace(/\|/g, '\\|'); }

function titleCase(s) {
  return s.replace(/[-/]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function renderCwe(slug, cards) {
  const name = titleCase(slug);
  const critical = cards.filter(c => c.severity === 'critical').length;
  const high     = cards.filter(c => c.severity === 'high').length;
  const bounty   = cards.reduce((s, c) => s + (c.bounty || 0), 0);
  const bountied = cards.filter(c => c.bounty != null).length;
  const programs = {};
  for (const c of cards) programs[c.programName || c.program] = (programs[c.programName || c.program] || 0) + 1;
  const topPrograms = Object.entries(programs).sort((a, b) => b[1] - a[1]).slice(0, 10)
    .map(([n, k]) => `\`${n}\` (${k})`).join(', ');

  const rows = cards
    .map(c => `- [[disclosures/${c.file}|${esc(c.title)}]] - \`${c.severity}\`, ${money(c.bounty)}, ${c.votes} votes${c.program ? `, ${esc(c.programName || c.program)}` : ''}`)
    .join('\n');

  return `---
tags:
  - type/cwe
generated: true
---
# ${name}

> **Disclosures in vault:** ${cards.length} | **Critical:** ${critical} | **High:** ${high} | **Total known bounty:** ${money(bounty)} (${bountied} disclosed) | **Top programs:** ${topPrograms}

## All disclosures of this class

Ranked by community votes - the top of this list is the canonical writeup set for how this class actually lands.

${rows}

> Auto-generated from \`disclosures/\` by \`node vault-admin/crawler/gen_cwe_pages.js\`. Do not edit by hand.
`;
}

function main() {
  if (!fs.existsSync(DISC_DIR)) {
    console.log('disclosures/ not found - nothing to generate from.');
    return;
  }
  fs.mkdirSync(CWE_DIR, { recursive: true });

  const byCwe = {};
  for (const file of fs.readdirSync(DISC_DIR).filter(f => f.endsWith('.md'))) {
    const content = fs.readFileSync(path.join(DISC_DIR, file), 'utf8');
    const fm = fmBlock(content);
    const slugs = fmTags(fm, 'cwe');
    if (!slugs.length) continue;
    const programField = fmField(fm, 'program');
    const pm = programField.match(/^"?\[\[programs\/([^|\]]+)(?:\|([^\]]*))?\]\]"?$/);
    const bountyField = fmField(fm, 'bounty_usd');
    const card = {
      file: file.replace(/\.md$/, ''),
      title: fmField(fm, 'title') || h1(content),
      severity: (fmTags(fm, 'severity')[0] || ''),
      bounty: bountyField === 'null' || bountyField === '' ? null : Number(bountyField),
      votes: Number(fmField(fm, 'votes') || 0),
      program: pm ? pm[1] : '',
      programName: pm ? (pm[2] || pm[1]) : '',
    };
    for (const slug of slugs) {
      byCwe[slug] = byCwe[slug] || [];
      byCwe[slug].push(card);
    }
  }

  let written = 0;
  for (const [slug, cards] of Object.entries(byCwe)) {
    cards.sort((a, b) => b.votes - a.votes);
    fs.writeFileSync(path.join(CWE_DIR, `${slug}.md`), renderCwe(slug, cards));
    written++;
  }

  console.log(`Wrote ${written} CWE reference pages.`);
}

main();