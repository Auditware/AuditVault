#!/usr/bin/env node
'use strict';

/**
 * gen_web_checklists.js
 * checklists/web/<value>-checklist.md from disclosures/ - per-surface
 * web attack-surface checklists, the web2 analog of gen_sector_checklists.js.
 *
 * For every env/ (where the bug lives), stack/ (technology) and os/ value
 * with enough disclosures, one data-driven checklist:
 *   - top CWE classes ranked by frequency - the actual "what goes wrong
 *     here" tick-list, straight from what HackerOne disclosures did
 *   - top affected programs
 *   - "Study these disclosures" - the highest-voted example cards, whose
 *     linked reports are the canonical methodology writeups for the surface
 *
 * Honest data ceiling (unlike web3 checklists): cards carry metadata only -
 * no trigger/fix/impact axes, no methodology text. Frequency + canonical
 * examples is the full signal; prose methodology per class would need
 * hand curation or owner-approved logged-in body fetches.
 *
 * Re-run safe: pages carry `generated: true` and are rebuilt each run.
 */

const fs   = require('fs');
const path = require('path');

const VAULT_ROOT = path.resolve(__dirname, '../..');
const DISC_DIR    = path.join(VAULT_ROOT, 'disclosures');
const WEB_CHECKS  = path.join(VAULT_ROOT, 'checklists', 'web');

const MIN_CARDS  = 10;  // skip axes with fewer disclosures (too little signal)
const MAX_CWES   = 15;  // cap the ranked CWE list per checklist
const MAX_TOP    = 15;  // cap affected programs per checklist
const MAX_EXAMPLES = 8; // study-these links per checklist

const AXES = [
  { axis: 'env',   blurb: 'where the bug lives (web app, mobile, cloud, desktop, appliance, network)' },
  { axis: 'stack', blurb: 'technology stack involved (kubernetes, aws, nginx, ...)' },
  { axis: 'os',    blurb: 'operating system where relevant (ios, android, windows, ...)' },
];

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

/** Map a CWE tag slug to its reference page (or plain text if no page exists). */
function cweLink(slug) {
  const title = titleCase(slug);
  return fs.existsSync(path.join(VAULT_ROOT, 'cwe', `${slug}.md`))
    ? `[[cwe/${slug}|${title}]]`
    : title;
}

function newAxis() {
  return { cards: [], cwes: {}, programs: {}, vuln: {}, trigger: {}, impact: {}, fix: {} };
}

function renderChecklist({ axis, value, blurb }, data) {
  const cards = data.cards;
  const critical = cards.filter(c => c.severity === 'critical').length;
  const bounty   = cards.reduce((s, c) => s + (c.bounty || 0), 0);
  const bountied = cards.filter(c => c.bounty != null).length;

  const cwes = Object.entries(data.cwes).sort((a, b) => b[1] - a[1]).slice(0, MAX_CWES);
  const cweList = cwes.length
    ? cwes.map(([slug, n]) => `- [ ] ${cweLink(slug)} - ${n} disclosure${n > 1 ? 's' : ''}`).join('\n')
    : '- [ ] _no CWE labels on these disclosures_';

  const programs = Object.entries(data.programs).sort((a, b) => b[1] - a[1]).slice(0, MAX_TOP)
    .map(([name, n]) => `\`${esc(name)}\` (${n})`).join(', ');

  const examples = [...cards].sort((a, b) => b.votes - a.votes).slice(0, MAX_EXAMPLES)
    .map(c => `- [[disclosures/${c.file}|${esc(c.title)}]] - \`${c.severity}\`, ${money(c.bounty)}, ${c.votes} votes${c.programName ? `, [[programs/${c.program}|${esc(c.programName)}]]` : ''}`)
    .join('\n');

  // Deep axes (from tag_web_bugs.js): what goes wrong / how / what to check.
  const fmtAxis = (title, counts, limit = 10) => {
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, limit);
    if (!entries.length) return '';
    return `\n## ${title}\n\n` + entries.map(([v, n]) => `- \`${v}\` - ${n}`).join('\n') + '\n';
  };
  const vulnSection  = fmtAxis('⚠️ Top bug classes (vuln/)', data.vuln, 12);
  const trigSection  = fmtAxis('🎯 Exploit triggers (trigger/)', data.trigger, 8);
  const impactSection = fmtAxis('💥 Demonstrated impact (impact/)', data.impact, 8);
  const fixSection   = fmtAxis('🛠️ Recommended fixes (fix/)', data.fix, 8);

  return `---
tags:
  - checklist
  - ${axis}/${value}
generated: true
---
# ${titleCase(value)} — Web Audit Checklist

> **Surface:** \`${axis}/${value}\` (${blurb}) | **Disclosures:** ${cards.length} | **Critical:** ${critical} | **Total known bounty:** ${money(bounty)} (${bountied} disclosed)
> Auto-generated from **disclosures/** in this surface, ranked by frequency. Regenerate with \`node vault-admin/crawler/gen_web_checklists.js\`. Do not edit by hand.

## ⚠️ Top CWE classes on this surface

What actually goes wrong here, most common first. Tick each class as you rule it out - open the linked CWE page for every known disclosure of that class.

${cweList}

## 🏢 Most affected programs

Where this surface class shows up most: ${programs || 'N/A'}

## 📚 Study these disclosures

The highest-voted disclosures on this surface - their linked reports are the canonical writeups for how these bugs were found and exploited.

${examples}
${vulnSection}${trigSection}${impactSection}${fixSection}`;
}

function renderIndex(entries, skipped) {
  const byAxis = {};
  for (const e of entries) (byAxis[e.axis] = byAxis[e.axis] || []).push(e);
  const sections = AXES.map(({ axis, blurb }) => {
    const rows = (byAxis[axis] || [])
      .sort((a, b) => b.total - a.total)
      .map(e => `| [[${e.value}-checklist\\|${titleCase(e.value)}]] | ${e.total} | ${e.critical} | ${e.cweCount} |`)
      .join('\n');
    if (!rows) return '';
    return `### ${axis}/ - ${blurb}\n\n| Checklist | Disclosures | Critical | Distinct CWEs |\n| --- | ---: | ---: | ---: |\n${rows}\n`;
  }).filter(Boolean).join('\n');

  const skipNote = skipped.length
    ? `\n> Skipped (fewer than ${MIN_CARDS} disclosures): ${skipped.map(s => `\`${s}\``).join(', ')}\n`
    : '';

  return `---
tags:
  - checklist
generated: true
---
# Web Audit Checklists

Data-driven checklists of what tends to go wrong per web2 attack surface (env/stack/os), ranked by frequency across AuditVault disclosures. Start here when auditing a web property - open the checklist for its surface before reading a line of code.

${sections}${skipNote}
> Generated pages only: frequency + canonical example reports. No trigger/fix/impact axes - disclosure cards carry metadata (report bodies are login-walled). Prose methodology per class would need hand curation.
`;
}

function main() {
  if (!fs.existsSync(DISC_DIR)) {
    console.log('disclosures/ not found - nothing to generate from.');
    return;
  }
  if (!fs.existsSync(path.join(DISC_DIR)) || fs.readdirSync(DISC_DIR).length === 0) {
    console.log('disclosures/ is empty - nothing to generate from.');
    return;
  }
  fs.mkdirSync(WEB_CHECKS, { recursive: true });

  const byAxisValue = {};
  for (const { axis } of AXES) byAxisValue[axis] = {};

  let untagged = 0;
  for (const file of fs.readdirSync(DISC_DIR).filter(f => f.endsWith('.md'))) {
    const content = fs.readFileSync(path.join(DISC_DIR, file), 'utf8');
    const fm = fmBlock(content);
    const cwes = fmTags(fm, 'cwe');
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
      cwes,
    };

    let tagged = false;
    const axesOnCard = { vuln: fmTags(fm, 'vuln'), trigger: fmTags(fm, 'trigger'),
                         impact: fmTags(fm, 'impact'), fix: fmTags(fm, 'fix') };
    for (const { axis } of AXES) {
      for (const value of fmTags(fm, axis)) {
        const key = `${axis}/${value}`;
        const d = (byAxisValue[axis][value] = byAxisValue[axis][value] || newAxis());
        d.cards.push(card);
        for (const s of cwes) d.cwes[s] = (d.cwes[s] || 0) + 1;
        if (card.programName) d.programs[card.programName] = (d.programs[card.programName] || 0) + 1;
        for (const ax of ['vuln', 'trigger', 'impact', 'fix']) {
          for (const v of axesOnCard[ax]) d[ax][v] = (d[ax][v] || 0) + 1;
        }
        tagged = true;
      }
    }
    if (!tagged) untagged++;
  }

  if (untagged === fs.readdirSync(DISC_DIR).filter(f => f.endsWith('.md')).length) {
    console.log('No disclosure carries env/stack/os tags - run tag_disclosures.js first.');
    return;
  }

  const entries = [];
  const skipped = [];
  let written = 0;
  for (const { axis, blurb } of AXES) {
    for (const [value, data] of Object.entries(byAxisValue[axis])) {
      const key = `${axis}/${value}`;
      if (data.cards.length < MIN_CARDS) { skipped.push(key); continue; }
      fs.writeFileSync(path.join(WEB_CHECKS, `${value}-checklist.md`),
        renderChecklist({ axis, value, blurb }, data));
      entries.push({ axis, value, total: data.cards.length,
        critical: data.cards.filter(c => c.severity === 'critical').length,
        cweCount: Object.keys(data.cwes).length });
      written++;
    }
  }

  fs.writeFileSync(path.join(WEB_CHECKS, 'Web Checklists.md'), renderIndex(entries, skipped));
  console.log(`Wrote ${written} web checklists (skipped ${skipped.length} surfaces with < ${MIN_CARDS} disclosures).`);
}

main();