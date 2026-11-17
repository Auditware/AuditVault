#!/usr/bin/env node
'use strict';

/**
 * gen_program_pages.js
 * programs/<handle>.md from disclosures/ - per-program stats pages.
 *
 * Bounty programs are the web2 analog of web3 protocols: the vendor running
 * the surface. One page per program handle, aggregating every disclosure
 * card in the vault for that program across platforms (platform tags are
 * collected from the cards). Re-run safe: pages carry `generated: true`
 * and are rebuilt from scratch each run.
 */

const fs   = require('fs');
const path = require('path');

const VAULT_ROOT = path.resolve(__dirname, '../..');
const DISC_DIR    = path.join(VAULT_ROOT, 'disclosures');
const PROGRAMS_DIR = path.join(VAULT_ROOT, 'programs');
const PROTOCOLS_DIR = path.join(VAULT_ROOT, 'protocols'); // web3 cross-links

const MAX_TOP = 20; // top disclosures listed per program, ranked by votes

/** Normalize a name for web2<->web3 overlap matching. */
function norm(s) {
  return String(s == null ? '' : s).toLowerCase().replace(/[^a-z0-9]/g, '');
}

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

function title(content) {
  const m = content.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : '';
}

function money(n) {
  return n == null ? 'undisclosed' : `$${Number(n).toLocaleString()}`;
}

function slug(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 50);
}

function esc(s) { return String(s == null ? '' : s).replace(/\|/g, '\\|'); }

function renderProgram(handle, cards) {
  const name = cards[0].name || handle;
  const platforms = [...new Set(cards.flatMap(c => c.platforms))].sort();
  const high     = cards.filter(c => c.severity === 'high').length;
  const critical = cards.filter(c => c.severity === 'critical').length;
  const totalBounty = cards.reduce((s, c) => s + (c.bounty || 0), 0);
  const bountied    = cards.filter(c => c.bounty != null).length;

  const top = [...cards].sort((a, b) => b.votes - a.votes).slice(0, MAX_TOP);
  const list = top
    .map(c => `- [[disclosures/${c.file}|${esc(c.title)}]] - \`${c.severity}\`, ${money(c.bounty)}, ${c.votes} votes`)
    .join('\n');

  // Web3 overlap: this bounty program is also tracked as a smart-contract
  // protocol (exact normalized name match, e.g. metamask -> MetaMask).
  let protoNote = '';
  if (fs.existsSync(PROTOCOLS_DIR)) {
    const hit = fs.readdirSync(PROTOCOLS_DIR)
      .find(d => norm(d) === norm(handle) || norm(d) === norm(name));
    if (hit) {
      protoNote = `\n## Web3 protocol page\n\nAlso tracked as a smart-contract protocol: [[${hit}]]\n`;
    }
  }

  return `---
tags:
  - type/program
${platforms.map(p => `  - platform/${p}`).join('\n')}
generated: true
---
# ${name}

> **Handle:** \`${handle}\` | **Disclosures in vault:** ${cards.length} | **Critical:** ${critical} | **High:** ${high} | **Total known bounty:** ${money(totalBounty)} (${bountied} disclosed)

## Top disclosures

${list}
${protoNote}
> Auto-generated from \`disclosures/\` by \`node vault-admin/crawler/gen_program_pages.js\`. Do not edit by hand.
`;
}

function main() {
  if (!fs.existsSync(DISC_DIR)) {
    console.log('disclosures/ not found - nothing to generate from.');
    return;
  }
  fs.mkdirSync(PROGRAMS_DIR, { recursive: true });

  const byHandle = {};
  for (const file of fs.readdirSync(DISC_DIR).filter(f => f.endsWith('.md'))) {
    const content = fs.readFileSync(path.join(DISC_DIR, file), 'utf8');
    const fm      = fmBlock(content);
    const program = fmField(fm, 'program');
    const pm = program.match(/^"?\[\[programs\/([^|\]]+)(?:\|([^\]]*))?\]\]"?$/);
    if (!pm) continue;
    // Raw handle as filename (handles are h1 slugs: lowercase [a-z0-9_]) -
    // cards link [[programs/<handle>]] verbatim, so the page must match.
    // slug() here would rewrite underscores to dashes and break every link.
    const handle = pm[1].replace(/[/\\]/g, '-');
    const name   = pm[2] || pm[1];
    byHandle[handle] = byHandle[handle] || [];
    byHandle[handle].push({
      file: file.replace(/\.md$/, ''),
      name,
      title: fmField(fm, 'title') || title(content),
      severity: (fmTags(fm, 'severity')[0] || ''),
      bounty: (() => { const b = fmField(fm, 'bounty_usd'); return b === 'null' || b === '' ? null : Number(b); })(),
      votes: Number(fmField(fm, 'votes') || 0),
      platforms: fmTags(fm, 'platform'),
    });
  }

  let written = 0;
  for (const [handle, cards] of Object.entries(byHandle)) {
    fs.writeFileSync(path.join(PROGRAMS_DIR, `${handle}.md`), renderProgram(handle, cards));
    written++;
  }

  console.log(`Wrote ${written} program pages.`);
}

main();