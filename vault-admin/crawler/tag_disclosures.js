#!/usr/bin/env node
'use strict';

/**
 * tag_disclosures.js
 * Adds env/, stack/ and os/ tags to disclosures/ cards - fills missing axes
 * only (re-run safe). This is the web2 analog of tag_bugs.js:
 *
 *   env/     where the bug lives (web, mobile, cloud, desktop, appliance,
 *            network) - env/web is the default when no other signal matches,
 *            since the overwhelming majority of HackerOne disclosures are
 *            web apps
 *   stack/   technology stack involved (kubernetes, aws, nginx, ...)
 *   os/      operating system where relevant (ios, android, windows, ...)
 *
 * Detected from title + program name + CWE label.
 */

const fs   = require('fs');
const path = require('path');

const VAULT_ROOT = path.resolve(__dirname, '../..');
const DISC_DIR    = path.join(VAULT_ROOT, 'disclosures');

const ENV_RULES = [
  ['env/mobile',     /\b(ios|iphone|ipad|android|apk|mobile app|play store|app store)\b/i],
  ['env/cloud',      /\b(kubernetes|k8s|kubectl|helm|docker|container|aws|ec2|lambda|s3|gcp|azure|serverless|cloud)\b/i],
  ['env/appliance', /\b(firewall|router|appliance|firmware|embedded|iot)\b/i],
  ['env/desktop',    /\b(windows|macos|os x|linux)\b.{0,20}\b(app|application|client|software|installer|binary|driver|desktop)\b/i],
  ['env/network',    /\b(network|packet|tcp|udp|vpn|dns|smtp|gateway|protocol)\b/i],
];
const ENV_WEB = /\b(xss|cross.site|csrf|ssrf|html|http|https|url|uri|domain|subdomain|website|web app|webapp|session|cookie|clickjack|cors|login|password reset|oauth|webhook|endpoint|api)\b/i;

const STACK_RULES = [
  ['stack/kubernetes', /\b(kubernetes|k8s|kubectl|helm)\b/i],
  ['stack/docker',     /\b(docker|containerd)\b/i],
  ['stack/aws',        /\b(aws|s3|iam|ec2|lambda|route ?53)\b/i],
  ['stack/gcp',        /\b(gcp|google cloud)\b/i],
  ['stack/azure',      /\bazure\b/i],
  ['stack/nginx',      /\bnginx\b/i],
  ['stack/apache',     /\bapache\b/i],
  ['stack/cloudflare', /\bcloudflare\b/i],
  ['stack/wordpress',  /\b(wordpress|wp-admin)\b/i],
  ['stack/node',       /\b(node\.?js|express)\b/i],
  ['stack/php',        /\bphp\b/i],
  ['stack/java',       /\b(java|tomcat|jenkins|struts)\b/i],
  ['stack/python',     /\b(python|django|flask)\b/i],
  ['stack/ruby',       /\b(ruby|rails)\b/i],
  ['stack/gitlab',     /\bgitlab\b/i],
  ['stack/firebase',   /\bfirebase\b/i],
];

const OS_RULES = [
  ['os/ios',     /\b(ios|iphone|ipad)\b/i],
  ['os/android',  /\bandroid\b/i],
  ['os/windows',  /\bwindows\b/i],
  ['os/macos',    /\b(macos|os x)\b/i],
  ['os/linux',    /\b(linux|ubuntu|debian)\b/i],
];

// ── Frontmatter helpers ────────────────────────────────────────────────────────

/** Insert new `  - tag` lines at the end of the frontmatter tags block. */
function insertTags(content, newTags) {
  const lines = content.split('\n');
  const t = lines.indexOf('tags:');
  if (t === -1) return { content, added: [] };
  let end = t + 1;
  while (end < lines.length && /^ {2}- /.test(lines[end])) end++;
  const existing = new Set(lines.slice(t + 1, end).map(l => l.replace(/^ {2}- /, '')));
  const toAdd = newTags.filter(x => !existing.has(x));
  if (!toAdd.length) return { content, added: [] };
  lines.splice(end, 0, ...toAdd.map(x => `  - ${x}`));
  return { content: lines.join('\n'), added: toAdd };
}

function fmField(content, name) {
  const m = content.match(new RegExp(`^${name}:\\s*(.*)$`, 'm'));
  return m ? m[1].trim() : '';
}

// ── Main ──────────────────────────────────────────────────────────────────────

function main() {
  if (!fs.existsSync(DISC_DIR)) {
    console.log('disclosures/ not found - nothing to tag.');
    return;
  }

  const files = fs.readdirSync(DISC_DIR).filter(f => f.endsWith('.md'));
  let tagged = 0, untouched = 0;
  const axisCounts = {};

  for (const file of files) {
    const fpath  = path.join(DISC_DIR, file);
    const content = fs.readFileSync(fpath, 'utf8');

    const program = fmField(content, 'program').replace(/^"?\[\[programs\/([^|\]]+).*\]\]"?$/, '$1');
    const name    = fmField(content, 'program').replace(/^"?\[\[programs\/[^|]*\|(.*)\]\]"?$/, '$1');
    const title   = fmField(content, 'title') || content.match(/^#\s+(.+)$/m)?.[1] || '';
    const cwe     = (content.match(/^ {2}- (cwe\/[a-z0-9-]+)\s*$/m)?.[1] || '')
      .replace(/^cwe\//, '').replace(/-/g, ' ');

    const text = `${title}\n${name}\n${program}\n${cwe}`;

    const envs = ENV_RULES.filter(([, rx]) => rx.test(text)).map(([t]) => t);
    if (!envs.length && ENV_WEB.test(text)) envs.push('env/web');
    if (!envs.length) envs.push('env/web'); // default: hackerone disclosures are overwhelmingly web
    const stacks = STACK_RULES.filter(([, rx]) => rx.test(text)).map(([t]) => t);
    const oss    = OS_RULES.filter(([, rx]) => rx.test(text)).map(([t]) => t);

    const newTags = [...envs, ...stacks, ...oss];
    const { content: updated, added } = insertTags(content, newTags);
    if (added.length) {
      fs.writeFileSync(fpath, updated);
      tagged++;
      for (const t of added) axisCounts[t.split('/')[0]] = (axisCounts[t.split('/')[0]] || 0) + 1;
    } else {
      untouched++;
    }
  }

  console.log(`Tagged ${tagged} cards (${untouched} already had all axes).`);
  console.log('Axis additions:', JSON.stringify(axisCounts));
}

main();