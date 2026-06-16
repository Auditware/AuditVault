#!/usr/bin/env node
'use strict';

const fs   = require('fs');
const path = require('path');

const VAULT_ROOT    = path.resolve(__dirname, '../..');
const FINDINGS_DIR  = path.join(VAULT_ROOT, 'findings');
const AUDITORS_DIR  = path.join(VAULT_ROOT, 'auditors');

// ── Index findings by auditor ─────────────────────────────────────────────────

const index = {};

for (const file of fs.readdirSync(FINDINGS_DIR).filter(f => f.endsWith('.md'))) {
  const content = fs.readFileSync(path.join(FINDINGS_DIR, file), 'utf8');

  const auditorMatches = [...content.matchAll(/^\s*- "\[\[(.+?)\]\]"/gm)];
  if (!auditorMatches.length) continue;

  const auditors = auditorMatches.map(m => m[1].replace(/\\/g, ''));
  const protocol = (content.match(/^protocol:\s*"?(.+?)"?\s*$/m) || [])[1] || '';
  const sectors  = [...content.matchAll(/  - sector\/(.+)/g)].map(m => m[1]);
  const platforms = [...content.matchAll(/  - platform\/(.+)/g)].map(m => m[1]);
  const severity  = (content.match(/  - severity\/(.+)/) || [])[1] || 'high';

  for (const auditor of auditors) {
    if (!index[auditor]) index[auditor] = [];
    index[auditor].push({ file, protocol, sectors, platforms, severity, totalAuditors: auditors.length });
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function topN(arr, n) {
  const counts = {};
  for (const x of arr) counts[x] = (counts[x] || 0) + 1;
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(e => e[0]);
}

function titleCase(s) {
  return s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// ── Write profiles ────────────────────────────────────────────────────────────

let written = 0;

for (const auditorFile of fs.readdirSync(AUDITORS_DIR).filter(f => f.endsWith('.md'))) {
  const auditorName = auditorFile.replace(/\.md$/, '');
  const findings    = index[auditorName];
  if (!findings?.length) continue;

  const total      = findings.length;
  const soloFinds  = findings.filter(f => f.totalAuditors === 1).length;
  const protocols  = [...new Set(findings.map(f => f.protocol).filter(Boolean))];
  const topSectors  = topN(findings.flatMap(f => f.sectors), 3);
  const topPlatforms = topN(findings.flatMap(f => f.platforms), 3);

  const platformStr = topPlatforms.map(titleCase).join(' + ') || 'Unknown';
  const sectorStr   = topSectors.map(titleCase).join(', ');
  const soloStr     = soloFinds > 0 ? ` ${soloFinds} solo find${soloFinds > 1 ? 's' : ''}.` : '';
  const specialStr  = sectorStr ? ` Specializes in ${sectorStr}.` : '';

  const summary =
    `${total} finding${total > 1 ? 's' : ''} across ${protocols.length} protocol${protocols.length > 1 ? 's' : ''}. ` +
    `Mainly ${platformStr}.` +
    soloStr +
    specialStr;

  const body = `# ${auditorName}\n\n${summary}\n\n**Protocols:** ${protocols.slice(0, 8).join(', ')}\n`;

  fs.writeFileSync(path.join(AUDITORS_DIR, auditorFile), body);
  written++;
}

console.log(`Wrote profiles for ${written} auditors.`);
