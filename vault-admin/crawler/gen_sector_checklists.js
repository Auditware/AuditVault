#!/usr/bin/env node
'use strict';

// Generate per-sector audit checklists from tagged findings.
//
// For every sector, aggregates the bug-class / trigger / fix taxonomy across
// all findings in that sector, ranks each axis by frequency, and emits a
// data-driven checklist at `checklists/{sector}.md`.
//
// Re-run safe: only overwrites files it generates (all carry `generated: true`).

const fs   = require('fs');
const path = require('path');

const VAULT_ROOT     = path.resolve(__dirname, '../..');
const FINDINGS_DIR   = path.join(VAULT_ROOT, 'findings');
const CHECKLISTS_DIR = path.join(VAULT_ROOT, 'checklists');

// Sectors with fewer than this many findings are skipped (too little signal).
const MIN_FINDINGS_PER_SECTOR = 5;
// Cap list lengths so checklists stay scannable.
const MAX_ITEMS_PER_AXIS = 15;
// How many example findings to link per checklist.
const MAX_EXAMPLES = 8;

// ── Parsing ────────────────────────────────────────────────────────────────

/** Extract the YAML frontmatter block (between the first two `---` lines). */
function frontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  return match ? match[1] : '';
}

/** Collect all `- {axis}/{value}` tag values from a frontmatter block. */
function tagValues(fm, axis) {
  const re = new RegExp(`^\\s*- ${axis}/([a-z0-9/_-]+)\\s*$`, 'gm');
  return [...fm.matchAll(re)].map(m => m[1]);
}

/** First markdown H1 after the frontmatter, used as a human-readable title. */
function title(content) {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : '';
}

// ── Aggregation ──────────────────────────────────────────────────────────────

function newSector() {
  return { total: 0, tagged: 0, vuln: {}, trigger: {}, fix: {}, impact: {}, examples: [] };
}

function bump(counts, key) {
  return { ...counts, [key]: (counts[key] || 0) + 1 };
}

function indexFindings() {
  const sectors = {};

  for (const file of fs.readdirSync(FINDINGS_DIR).filter(f => f.endsWith('.md'))) {
    const content = fs.readFileSync(path.join(FINDINGS_DIR, file), 'utf8');
    const fm = frontmatter(content);

    const findingSectors = [...new Set(tagValues(fm, 'sector'))];
    if (!findingSectors.length) continue;

    const vulns    = tagValues(fm, 'vuln');
    const triggers = tagValues(fm, 'trigger');
    const fixes    = tagValues(fm, 'fix');
    const impacts  = tagValues(fm, 'impact');
    const hasBugTags = vulns.length > 0;

    for (const sector of findingSectors) {
      const s = sectors[sector] || newSector();
      s.total  += 1;
      s.tagged += hasBugTags ? 1 : 0;
      for (const v of vulns)    s.vuln    = bump(s.vuln, v);
      for (const t of triggers) s.trigger = bump(s.trigger, t);
      for (const f of fixes)    s.fix     = bump(s.fix, f);
      for (const i of impacts)  s.impact  = bump(s.impact, i);
      if (hasBugTags && s.examples.length < MAX_EXAMPLES) {
        s.examples.push({ file: file.replace(/\.md$/, ''), title: title(content), vuln: vulns[0] });
      }
      sectors[sector] = s;
    }
  }

  return sectors;
}

// ── Formatting ───────────────────────────────────────────────────────────────

function ranked(counts, limit) {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

function titleCase(s) {
  return s.replace(/[-/]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

/** `reentrancy/single-function` → "Reentrancy: Single Function" */
function readableVuln(tag) {
  const [head, ...rest] = tag.split('/');
  return rest.length ? `${titleCase(head)}: ${titleCase(rest.join('/'))}` : titleCase(head);
}

function checklistSection(heading, blurb, entries, render) {
  if (!entries.length) return '';
  const lines = entries.map(render).join('\n');
  return `\n## ${heading}\n${blurb}\n\n${lines}\n`;
}

function renderChecklist(sector, data) {
  const vulns    = ranked(data.vuln, MAX_ITEMS_PER_AXIS);
  const triggers = ranked(data.trigger, MAX_ITEMS_PER_AXIS);
  const fixes    = ranked(data.fix, MAX_ITEMS_PER_AXIS);
  const impacts  = ranked(data.impact, MAX_ITEMS_PER_AXIS);

  const header =
    `---\ntags:\n  - checklist\n  - sector/${sector}\ngenerated: true\n---\n` +
    `# ${titleCase(sector)} — Audit Checklist\n\n` +
    `> Auto-generated from **${data.total}** findings in this sector ` +
    `(**${data.tagged}** with bug-class tags), ranked by frequency.\n` +
    `> Regenerate with \`node vault-admin/crawler/gen_sector_checklists.js\`. ` +
    `Do not edit by hand.\n`;

  const vulnSection = checklistSection(
    '⚠️ Top vulnerability classes',
    'What actually goes wrong in this sector, most common first. Tick each as you rule it out.',
    vulns,
    ([tag, n]) => `- [ ] **${readableVuln(tag)}** — ${n} finding${n > 1 ? 's' : ''} \`vuln/${tag}\``,
  );

  const triggerSection = checklistSection(
    '🎯 Common triggers',
    'The conditions attackers use to set these bugs off — check each path is constrained.',
    triggers,
    ([tag, n]) => `- [ ] \`trigger/${tag}\` — ${n}`,
  );

  const impactSection = checklistSection(
    '💥 Typical impact',
    'Where it hurts when these bugs land.',
    impacts,
    ([tag, n]) => `- \`impact/${tag}\` — ${n}`,
  );

  const fixSection = checklistSection(
    '🛠️ Recommended mitigations',
    'The fixes auditors most often recommended in this sector.',
    fixes,
    ([tag, n]) => `- \`fix/${tag}\` — ${n}`,
  );

  const examples = data.examples.length
    ? `\n## 📚 Study these findings\n\n` +
      data.examples
        .map(e => `- [[${e.file}|${e.title || e.file}]]${e.vuln ? ` — \`vuln/${e.vuln}\`` : ''}`)
        .join('\n') + '\n'
    : '';

  return header + vulnSection + triggerSection + impactSection + fixSection + examples;
}

function renderIndex(sectors) {
  const rows = Object.entries(sectors)
    .filter(([, d]) => d.total >= MIN_FINDINGS_PER_SECTOR)
    .sort((a, b) => b[1].total - a[1].total)
    .map(([name, d]) => `| [[${name}-checklist\\|${titleCase(name)}]] | ${d.total} | ${d.tagged} |`)
    .join('\n');

  return (
    `---\ntags:\n  - checklist\ngenerated: true\n---\n` +
    `# Sector Audit Checklists\n\n` +
    `Data-driven checklists of what tends to go wrong per sector, ranked by ` +
    `frequency across AuditVault findings. Start here when auditing a protocol — ` +
    `open the checklist for its sector before reading a line of code.\n\n` +
    `| Sector | Findings | With bug tags |\n| --- | ---: | ---: |\n${rows}\n`
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────

function main() {
  if (!fs.existsSync(CHECKLISTS_DIR)) fs.mkdirSync(CHECKLISTS_DIR, { recursive: true });

  const sectors = indexFindings();
  let written = 0;

  for (const [sector, data] of Object.entries(sectors)) {
    if (data.total < MIN_FINDINGS_PER_SECTOR) continue;
    fs.writeFileSync(path.join(CHECKLISTS_DIR, `${sector}-checklist.md`), renderChecklist(sector, data));
    written++;
  }

  fs.writeFileSync(path.join(CHECKLISTS_DIR, 'Sector Checklists.md'), renderIndex(sectors));

  const skipped = Object.values(sectors).filter(d => d.total < MIN_FINDINGS_PER_SECTOR).length;
  console.log(`Wrote ${written} sector checklists (skipped ${skipped} with < ${MIN_FINDINGS_PER_SECTOR} findings).`);
}

main();
