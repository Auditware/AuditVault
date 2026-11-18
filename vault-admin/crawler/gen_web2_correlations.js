#!/usr/bin/env node
'use strict';

/**
 * gen_web2_correlations.js
 * Cross-axis correlation analysis over disclosures/ -> Web2 Correlations.md
 *
 * The web2 analog of what the web3 layer gets from checklists + tags: computed
 * statistics across the web2 axes (cwe/, env/, stack/, os/, severity/, platform/,
 * program, reporter, date). Tables are static (regenerated per run); the page
 * also embeds native Obsidian `query` blocks so the same correlations can be
 * explored live in Obsidian without any plugin.
 *
 * Re-run safe: page carries `generated: true` and is rebuilt each run.
 */

const fs   = require('fs');
const path = require('path');

const VAULT_ROOT = path.resolve(__dirname, '../..');
const DISC_DIR    = path.join(VAULT_ROOT, 'disclosures');
const OUT_FILE    = path.join(VAULT_ROOT, 'checklists', 'web', 'Web2 Correlations.md');

const TOP_CWES   = 12;
const TOP_TREND  = 8;
const TOP_STACKS = 12;
const TOP_PROGS  = 12;
const TOP_REPS   = 12;

function fmBlock(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---/);
  return m ? m[1] : '';
}

function fmTags(fm, prefix) {
  const re = new RegExp(`^ {2}- ${prefix}/([a-z0-9/_-]+)\\s*$`, 'gm');
  return [...fm.matchAll(re)].map(m => m[1]);
}

function fmField(fm, name) {
  const m = fm.match(new RegExp(`^${name}:\\s*(.*)$`, 'm'));
  return m ? m[1].trim() : '';
}

function stripQuotes(s) { return String(s == null ? '' : s).replace(/^"|"$/g, ''); }

function programField(fm) {
  const raw = stripQuotes(fmField(fm, 'program'));
  const m = raw.match(/^\[\[programs\/([^|\]]+)(?:\|([^\]]*))?\]\]$/);
  return m ? { handle: m[1], name: m[2] || m[1] } : { handle: '', name: '' };
}

function median(a) {
  if (!a.length) return 0;
  const s = [...a].sort((x, y) => x - y);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

function mean(a) { return a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0; }

function titleCase(s) {
  return String(s).replace(/[-/]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function esc(s) { return String(s == null ? '' : s).replace(/\|/g, '\\|'); }

function pct(n, d) { return d ? `${(100 * n / d).toFixed(1)}%` : '0%'; }

// ── Index the corpus ──────────────────────────────────────────────────────────

function indexCards() {
  const cards = [];
  for (const file of fs.readdirSync(DISC_DIR).filter(f => f.endsWith('.md'))) {
    const content = fs.readFileSync(path.join(DISC_DIR, file), 'utf8');
    const fm = fmBlock(content);
    if (!fmField(fm, 'source')) continue; // skip non-card pages
    const prog = programField(fm);
    cards.push({
      file: file.replace(/\.md$/, ''),
      cwe: fmTags(fm, 'cwe'),
      env: fmTags(fm, 'env'),
      stack: fmTags(fm, 'stack'),
      os: fmTags(fm, 'os'),
      severity: fmTags(fm, 'severity')[0] || '',
      program: prog.name || prog.handle,
      handle: prog.handle,
      reporter: stripQuotes(fmField(fm, 'reporter')),
      year: (fmField(fm, 'date') || '').slice(0, 4),
      votes: Number(fmField(fm, 'votes') || 0),
    });
  }
  return cards;
}

// ── Statistics ───────────────────────────────────────────────────────────────

function stats(cards) {
  const cweCount = {};
  const envs = {};         // env -> [total, critical]
  const cweEnv = {};       // cwe -> { env -> n }
  const cweYear = {};      // cwe -> { year -> n }
  const yearStats = {};    // year -> [total, critical]
  const stackCwe = {};     // stack -> { cwe -> n }
  const progCwe = {};      // program -> { cwe -> n }
  const repCount = {};     // reporter -> n
  const repProgs = {};     // reporter -> Set(program)
  const votesBySev = {};   // severity -> [votes]

  for (const c of cards) {
    const isCrit = c.severity === 'critical';
    for (const e of c.env) {
      (envs[e] = envs[e] || [0, 0]);
      envs[e][0]++; if (isCrit) envs[e][1]++;
    }
    if (c.year) {
      (yearStats[c.year] = yearStats[c.year] || [0, 0]);
      yearStats[c.year][0]++; if (isCrit) yearStats[c.year][1]++;
    }
    for (const w of c.cwe) {
      cweCount[w] = (cweCount[w] || 0) + 1;
      for (const e of c.env) { (cweEnv[w] = cweEnv[w] || {})[e] = (cweEnv[w][e] || 0) + 1; }
      if (c.year) { (cweYear[w] = cweYear[w] || {})[c.year] = (cweYear[w][c.year] || 0) + 1; }
      for (const s of c.stack) { (stackCwe[s] = stackCwe[s] || {})[w] = (stackCwe[s][w] || 0) + 1; }
      const p = c.program || '(unknown)';
      (progCwe[p] = progCwe[p] || {})[w] = (progCwe[p][w] || 0) + 1;
    }
    for (const s of c.stack) {
      for (const w of c.cwe) { /* counted above */ }
    }
    if (c.reporter) {
      repCount[c.reporter] = (repCount[c.reporter] || 0) + 1;
      (repProgs[c.reporter] = repProgs[c.reporter] || new Set()).add(c.program);
    }
    (votesBySev[c.severity] = votesBySev[c.severity] || []).push(c.votes);
  }

  const topCwes = Object.entries(cweCount).sort((a, b) => b[1] - a[1]).slice(0, TOP_CWES);
  const envOrder = Object.entries(envs).sort((a, b) => b[1][0] - a[1][0]).map(([e]) => e);
  const years = Object.keys(yearStats).sort();

  return { cweCount, envs, cweEnv, cweYear, yearStats, stackCwe, progCwe, repCount, repProgs, votesBySev, topCwes, envOrder, years };
}

// ── Render ───────────────────────────────────────────────────────────────────

function crossTabTable(s) {
  const envCols = s.envOrder.slice(0, 6);
  const head = `| CWE class | ${envCols.map(titleCase).join(' | ')} |\n| --- | ${envCols.map(() => '---:').join(' | ')} |`;
  const rows = s.topCwes.map(([w]) => {
    const cells = envCols.map(e => (s.cweEnv[w] && s.cweEnv[w][e]) || 0);
    return `| [[cwe/${w}\\|${esc(titleCase(w))}]] | ${cells.join(' | ')} |`;
  });
  return `${head}\n${rows.join('\n')}`;
}

function yearTable(s) {
  const trendCwes = s.topCwes.slice(0, TOP_TREND).map(([w]) => w);
  const years = s.years;
  const head = `| CWE class | ${years.join(' | ')} |\n| --- | ${years.map(() => '---:').join(' | ')} |`;
  const rows = trendCwes.map(w => {
    const cells = years.map(y => (s.cweYear[w] && s.cweYear[w][y]) || 0);
    return `| [[cwe/${w}\\|${esc(titleCase(w))}]] | ${cells.join(' | ')} |`;
  });
  const totals = years.map(y => s.yearStats[y][0]);
  const crits = years.map(y => s.yearStats[y][1]);
  const totalRow = `| **All disclosures** | ${totals.join(' | ')} |`;
  const critRow = `| **Critical** | ${crits.join(' | ')} |`;
  return `${head}\n${totalRow}\n${critRow}\n${rows.join('\n')}`;
}

function envShareTable(s) {
  const rows = Object.entries(s.envs).sort((a, b) => b[1][0] - a[1][0])
    .map(([e, [n, k]]) => `| ${titleCase(e)} | ${n} | ${k} | ${pct(k, n)} |`);
  return `| Surface | Disclosures | Critical | Critical share |\n| --- | ---: | ---: | ---: |\n${rows.join('\n')}`;
}

function stackTable(s) {
  const rows = Object.entries(s.stackCwe)
    .sort((a, b) => Object.values(b[1]).reduce((x, y) => x + y, 0) - Object.values(a[1]).reduce((x, y) => x + y, 0))
    .slice(0, TOP_STACKS)
    .map(([st, cc]) => {
      const top = Object.entries(cc).sort((a, b) => b[1] - a[1]).slice(0, 3)
        .map(([w, n]) => `[[cwe/${w}\\|${esc(titleCase(w))}]] (${n})`).join(', ');
      return `| ${esc(titleCase(st))} | ${Object.values(cc).reduce((x, y) => x + y, 0)} | ${top} |`;
    });
  return `| Stack | CWE-tagged disclosures | Dominant classes |\n| --- | ---: | --- |\n${rows.join('\n')}`;
}

function programTable(s) {
  const rows = Object.entries(s.progCwe)
    .map(([p, cc]) => [p, Object.values(cc).reduce((x, y) => x + y, 0), cc])
    .sort((a, b) => b[1] - a[1]).slice(0, TOP_PROGS)
    .map(([p, , cc]) => {
      const top = Object.entries(cc).sort((a, b) => b[1] - a[1]).slice(0, 3)
        .map(([w, n]) => `[[cwe/${w}\\|${esc(titleCase(w))}]] (${n})`).join(', ');
      return `| ${esc(p)} | ${top} |`;
    });
  return `| Program | Dominant CWE classes |\n| --- | --- |\n${rows.join('\n')}`;
}

function reporterTable(s) {
  const rows = Object.entries(s.repCount).sort((a, b) => b[1] - a[1]).slice(0, TOP_REPS)
    .map(([r, n]) => `| ${esc(r)} | ${n} | ${s.repProgs[r].size} |`);
  return `| Researcher | Disclosures | Distinct programs |\n| --- | ---: | ---: |\n${rows.join('\n')}`;
}

function votesTable(s) {
  const rows = ['critical', 'high'].map(sev => {
    const v = s.votesBySev[sev] || [];
    return `| ${titleCase(sev)} | ${v.length} | ${median(v).toFixed(0)} | ${mean(v).toFixed(1)} |`;
  });
  return `| Severity | Cards | Median votes | Mean votes |\n| --- | ---: | ---: | ---: |\n${rows.join('\n')}`;
}

/** Derive the highest-signal live-query examples from the corpus. */
function queryBlocks(s) {
  // top cwe+env pairs worth exploring
  const pairs = [];
  for (const [w, envs] of Object.entries(s.cweEnv)) {
    for (const [e, n] of Object.entries(envs)) pairs.push({ w, e, n, tot: s.cweCount[w] });
  }
  pairs.sort((a, b) => b.n - a.n);
  const top = pairs.filter(p => p.n >= 5).slice(0, 6);
  const blocks = top.map(p =>
    `#### ${titleCase(p.w)} on ${titleCase(p.e)} surfaces (${p.n} of ${p.tot} disclosures of this class)\n\n\`\`\`query\ntag:#cwe/${p.w} tag:#env/${p.e}\n\`\`\``);
  const cross = `#### Anything touching both web and cloud surfaces\n\n\`\`\`query\ntag:#env/web tag:#env/cloud path:disclosures\n\`\`\`\n\n#### Critical RCE-adjacent classes on web surfaces\n\n\`\`\`query\ntag:#severity/critical (tag:#cwe/code-injection OR tag:#cwe/command-injection-generic OR tag:#cwe/os-command-injection) path:disclosures\n\`\`\`\n\n#### The MetaMask program web2 <-> web3 bridge\n\n\`\`\`query\ntag:#platform/hackerone "MetaMask"\n\`\`\``;
  return blocks.join('\n\n') + '\n\n' + cross;
}

function render(cards, s) {
  const yearsSpan = s.years.length ? `${s.years[0]}-${s.years[s.years.length - 1]}` : '-';
  const distinct = {
    cwe: Object.keys(s.cweCount).length,
    programs: new Set(cards.map(c => c.program).filter(Boolean)).size,
    reporters: Object.keys(s.repCount).length,
  };

  return `---
tags:
  - type/insights
generated: true
---
# Web2 Correlations

> Cross-axis analysis over **${cards.length}** disclosures (${yearsSpan}, ${distinct.cwe} CWE classes, ${distinct.programs} programs, ${distinct.reporters} researchers).
> Auto-generated by \`node vault-admin/crawler/gen_web2_correlations.js\` - regenerate after any scrape/tag/enrich run. Do not edit by hand.
> Live exploration: the embedded \`query\` blocks below run natively in Obsidian (no plugin needed) - click into a query to open its results as a search.

## Where classes land: CWE x surface

${crossTabTable(s)}

## Attack trends by year

${yearTable(s)}

## Critical share by surface

${envShareTable(s)}

## Dominant class per technology stack

${stackTable(s)}

## Program CWE profiles

${programTable(s)}

## Top researchers

${reporterTable(s)}

## Community signal: votes by severity

${votesTable(s)}

## Live correlation queries

${queryBlocks(s)}

## Reading the network graph

The global graph colors this layer: **disclosures** amber, **programs** purple, **cwe** green, **checklists/web** teal (web3 paths keep their colors). Each card node connects to its \`[[programs/<handle>]]\` page; programs that overlap web3 protocols cross-link into the protocol cluster (\`metamask\` <-> \`MetaMask\` is the one real bridge today). Filter \`path:disclosures\` in graph settings to see the web2 network alone.
`;
}

function main() {
  if (!fs.existsSync(DISC_DIR)) {
    console.log('disclosures/ not found - nothing to correlate.');
    return;
  }
  const cards = indexCards();
  if (!cards.length) { console.log('No disclosure cards - nothing to correlate.'); return; }
  const s = stats(cards);
  fs.writeFileSync(OUT_FILE, render(cards, s));
  console.log(`Wrote Web2 Correlations.md from ${cards.length} cards.  (CWE x env, year trends, stacks, programs, reporters, votes)`);
}

main();