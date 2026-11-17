#!/usr/bin/env node
'use strict';

/**
 * gen_proto_data.js
 * Synthesize data/proto_data.json from the vault itself, for tag_protocols.js.
 *
 * proto_data shape (consumed by tag_protocols.js):
 *   { "<ProtocolName>": { "finding_tags": [...], "desc": "..." } }
 *
 * Sources, per protocol:
 *   - finding_tags: union of blockchain/ lang/ sdk/ web3-sector/ tags across
 *     findings/ cards linked to that protocol (frontmatter protocol: field),
 *     MERGED with the tags already on the protocol page - monotonic, so
 *     running tag_protocols.js over the result never drops existing tags.
 *   - desc: first paragraph of the protocol page body (skipping headings/
 *     quotes), capped - feeds the keyword inference rules.
 *
 * Replaces the old "generate proto_data.json externally" step (it was
 * originally built from Solodit data, which is not always reachable).
 */

const fs   = require('fs');
const path = require('path');

const VAULT_ROOT     = path.resolve(__dirname, '../..');
const FINDINGS_DIR   = path.join(VAULT_ROOT, 'findings');
const PROTOCOLS_DIR  = path.join(VAULT_ROOT, 'protocols');
const DATA_DIR       = path.join(__dirname, 'data');
const DATA_FILE      = path.join(DATA_DIR, 'proto_data.json');

const AXES = ['blockchain/', 'lang/', 'sdk/', 'web3-sector/'];

function fmBlock(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---/);
  return m ? m[1] : '';
}

function fmField(fm, name) {
  const m = fm.match(new RegExp(`^${name}:\\s*(.*)$`, 'm'));
  return m ? m[1].trim() : '';
}

function fmTags(fm, prefixes) {
  const out = [];
  const re = /^ {2}- ([a-z0-9/_-]+)\s*$/gm;
  for (const m of fm.matchAll(re)) {
    if (prefixes.some(p => m[1].startsWith(p))) out.push(m[1]);
  }
  return out;
}

/** protocol: field -> plain name: "[[Aave]]", "[[Aave|aave]]", "Aave", '"Aave"'. */
function protocolName(field) {
  const raw = String(field || '').replace(/^"|"$/g, '').trim();
  const wl = raw.match(/^\[\[([^|\]]+)(?:\|[^\]]*)?\]\]$/);
  return (wl ? wl[1] : raw).trim();
}

function bodyDesc(content) {
  const body = content.replace(/^---[\s\S]*?---\s*?\n/, '');
  for (const line of body.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#') || t.startsWith('>')) continue;
    return t.slice(0, 500);
  }
  return '';
}

function main() {
  if (!fs.existsSync(PROTOCOLS_DIR)) {
    console.log('protocols/ not found - nothing to generate.');
    return;
  }

  // Protocol dir names and their page files.
  const protoDirs = fs.readdirSync(PROTOCOLS_DIR).filter(d =>
    fs.existsSync(path.join(PROTOCOLS_DIR, d, `${d}.md`)));
  const byDir = new Map(protoDirs.map(d => [d.toLowerCase(), d]));

  // 1. Aggregate finding tags per linked protocol.
  const findingTags = {};
  let linked = 0, unlinked = 0;
  for (const file of fs.readdirSync(FINDINGS_DIR).filter(f => f.endsWith('.md'))) {
    const content = fs.readFileSync(path.join(FINDINGS_DIR, file), 'utf8');
    const fm = fmBlock(content);
    const proto = protocolName(fmField(fm, 'protocol'));
    if (!proto) continue;
    const dir = byDir.get(proto.toLowerCase());
    if (!dir) { unlinked++; continue; }
    linked++;
    findingTags[dir] = findingTags[dir] || new Set();
    for (const t of fmTags(fm, AXES)) findingTags[dir].add(t);
  }

  // 2. Merge with tags already on each protocol page + take desc from body.
  const data = {};
  let withDesc = 0;
  for (const dir of protoDirs) {
    const fpath = path.join(PROTOCOLS_DIR, dir, `${dir}.md`);
    const content = fs.readFileSync(fpath, 'utf8');
    const fm = fmBlock(content);
    const tags = new Set([...(findingTags[dir] || []), ...fmTags(fm, AXES)]);
    const desc = bodyDesc(content);
    if (desc) withDesc++;
    data[dir] = {
      finding_tags: [...tags],
      desc,
    };
  }

  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

  console.log(`proto_data.json written: ${protoDirs.length} protocols`
    + ` (${linked} findings linked, ${unlinked} to unknown protocols,`
    + ` ${withDesc} with a desc paragraph).`);
}

main();