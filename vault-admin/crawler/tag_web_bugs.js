#!/usr/bin/env node
'use strict';

/**
 * tag_web_bugs.js
 * Deep bug-class tagging for web2 disclosure cards - the web2 analog of
 * web3's tag_bugs.js. Runs over the `## Report body` text (public report
 * markdown fetched by fetch_report_bodies.js) + title + timeline.
 *
 * Axes (web-tuned regex rules, client-side only):
 *   vuln/     bug class (access-control, sqli, xss, ssrf, path-traversal,
 *             deserialization, rce, rce-unsafe-deserialization, auth-bypass,
 *             idor, privesc, info-disclosure, icsrf, xxe, dos, ...) - may add
 *             multiple classes per card when each matches independently
 *   impact/    what it costs (account-takeover, data-exposure, rce-impact,
 *             dos-impact, monetary, ...) - what the report demonstrably yields
 *   trigger/   exploit prerequisite (unauthenticated, auth-required,
 *             admin-required, one-click, victim-interaction, file-upload,
 *             password-reset, session-cookie, dns-rebinding, ...)
 *   fix/       what the program did or should do (input-validation, allowlist,
 *             parameterized-query, csp, sanitize, escape-output, patch,
 *             secrets-rotation, ...)
 *
 * Re-run safe: only ADDS axes a card is missing (existing tags kept);
 * cards without a Report body are skipped (no text to match).
 *
 * WEB_BUGS_MAX=<n> caps cards for a test run.
 */

const fs   = require('fs');
const path = require('path');

const VAULT_ROOT = path.resolve(__dirname, '../..');
const DISC_DIR    = path.join(VAULT_ROOT, 'disclosures');

const MAX_CARDS = Number(process.env.WEB_BUGS_MAX || 0);

// ── Rules ────────────────────────────────────────────────────────────────────
// Matched against: report body + title (vuln/trigger), body (impact/fix).
// Patterns are anchored on language real reporters use; multi-word phrases
// take precedence (checked first) so "sql injection" beats generic "injection".

const VULN_RULES = [
  ['vuln/sql-injection',               /sql\s?injection|sqli\b|union\s+select|'\s*or\s*'?=?\s*'?1|sleep\(\s*\d|benchmark\(\s*\d|information_schema|time[- ]based\b.{0,20}inject/i],
  ['vuln/xss-stored',                 /stored\s+xss|persistent\s+xss|second[- ]order\s+xss/i],
  ['vuln/xss-reflected',              /reflected\s+xss/i],
  ['vuln/xss',                        /\bxss\b|cross[- ]site\s+scripting|html\s+inject|<script/i],
  ['vuln/csrf',                       /\bcsrf\b|cross[- ]site\s+request\s+forgery/i],
  ['vuln/ssrf',                       /\bssrf\b|server[- ]side\s+request\s+forgery|internal\s+network\s+(scan|access)|metadata\s+(endpoint|service|api)/i],
  ['vuln/path-traversal',             /path\s+traversal|directory\s+traversal|\.\.\/|lfi\b|local\s+file\s+(inclusion|read)|file\s+read\s+outside/i],
  ['vuln/rfi',                        /remote\s+file\s+inclusion/i],
  ['vuln/command-injection',          /command\s+(injection|execut)|os\s+command\s+inject|system\s*\(|exec\s*\(|shell\s+execut|popen\s*\(/i],
  ['vuln/code-injection',             /code\s+(injection|execut)|eval\s*\(|dynamic\s+code\s+eval|template\s+inject/i],
  ['vuln/deserialization',           /(unsafe|insecure)\s+deserializ|deserializ\w*\s+(of|untrusted)|object\s+injection|java\s+deserializ|pickle\b|marshal\b|unserialize\s*\(/i],
  ['vuln/rce-unsafe-deserialization', /(rce|remote\s+code\s+execution).{0,60}(deserializ|gadget|object\s+injection)/i],
  ['vuln/xxe',                        /\bxxe\b|xml\s+external\s+entity|external\s+entity\s+(injection|process)/i],
  ['vuln/idor',                       /\bidor\b|insecure\s+(direct\s+)?object\s+reference|object\s+level\s+(authorization|authorisation)|bola\b|horizontal\s+privilege/i],
  ['vuln/broken-access-control',      /(broken|improper|missing)\s+(access\s+control|authorization|authorisation)|access\s+control\s+(flaw|issue|bypass|weak)|privilege.{0,20}(escalat|bypass)|unrestricted\s+(api|access)|authorization\s+bypass/i],
  ['vuln/bola',                      /broken\s+(function\s+level\s+)?object\s+level\s+authorization|\bbola\b/i],
  ['vuln/authentication-bypass',      /auth(entication)?\s+bypass|bypass\w*\s+auth|login\s+bypass|password\s+reset\s+(flaw|bypass|vulnerab)|2fa\s+(bypass|bypassed)|otp\s+bypass|mfa\s+bypass|session\s+(fixation|hijack)/i],
  ['vuln/privilege-escalation',      /privilege\s+escalation|privesc\b|(un)?authorized\s+admin|admin\s+(access|panel|panel\s+access)\b/i],
  ['vuln/info-disclosure',           /information\s+(disclosure|leak|exposure)|sensitive\s+(data|information)\s+(disclosure|leak|exposure|reveal)|\bpii\b|secret\s+(key|token)s?\s+(leak|exposed|disclos)/i],
  ['vuln/open-redirect',             /open\s+(redirect|redirects)|redirect\s+bypass|url\s+redirect\s+(flaw|vulnerab)/i],
  ['vuln/cors-misconfig',            /\bcors\b|cross[- ]origin\s+resource\s+sharing\s+(flaw|misconfig|issue)/i],
  ['vuln/race-condition',           /race\s+condition|toctou\b|time[- ]of[- ]check/i],
  ['vuln/dos',                       /\bdos\b|denial[- ]of[- ]service|resource\s+exhaust|crash\b|heap\s+(exhaust|overflow)|stack\s+overflow|buffer\s+overflow|use[- ]after[- ]free|memory\s+corruption|out[- ]of[- ]bounds|integer\s+(overflow|underflow)/i],
  ['vuln/subdomain-takeover',        /subdomain\s+take[- ]?over|dangling\s+dns/i],
  ['vuln/secrets-leak',             /(hard[- ]?coded|leaked?|exposed)\s+(secret|api\s?key|credential|token|password)/i],
  ['vuln/business-logic',           /business\s+logic\s+(flaw|error|issue|vulnerab)|logic\s+bypass|negative\s+(price|balance|amount)/i],
  ['vuln/file-upload',              /unrestricted\s+file\s+upload|file\s+upload\s+(bypass|flaw|vulnerab)|arbitrary\s+file\s+(upload|write)|web\s?shell\s+upload/i],
  ['vuln/misconfiguration',         /misconfigur\w+|default\s+(credentials|password|config)|unauthenticated\s+access\s+to\s+(admin|dashboard|panel)/i],
  ['vuln/session-management',      /session\s+management|cookie\s+(security|flags|flaw)|http\s?only\b.{0,30}(missing|absent)/i],
  ['vuln/jwt',                       /\bjwt\b|json\s+web\s+token/i],
];

// Impact: what the writeup demonstrates as consequence (not just words in title).
const IMPACT_RULES = [
  ['impact/account-takeover',        /account\s+take[- ]?over|\bato\b|full\s+control\s+(of|over).{0,30}account|take\s?over.{0,20}(any|every|user|account)/i],
  ['impact/rce',                     /remote\s+code\s+execution|remote\s+command\s+execution|server\s+code\s+execution|\brce\b/i],
  ['impact/data-exposure',           /(read|access|dump|retriev|exfiltrat|leak)\w*\s+(the\s+)?(entire\s+)?(database|user\s+data|customer\s+data|database\s+records|db\b)|dump\s+.{0,20}tables/i],
  ['impact/credential-theft',        /credential\s+(theft|leak|steal)|password\s+(leak|theft|reset.{0,25}victim)|steal.{0,30}(session|cookie|token|password)/i],
  ['impact/financial',              /financial\s+(loss|impact|damage)|monetary\s+(loss|impact)|fraud\b|\$\d[\d,.]*\s*(worth\s+of\s+)?(lost|stolen|damage)/i],
  ['impact/sensitive-data',         /(social\s+security|credit\s+card|passport|health|medical|driver'?s?\s+license)\b|pii\b|phi\b|hipaa\b|gdpr\b/i],
  ['impact/internal-network',       /internal\s+(network|systems?|services?)\s+(access|reach)|pivot\w*\s+to\s+(internal|other)|lateral\s+movement/i],
  ['impact/dos-impact',             /(service|site|server|api)\s+(down|crash|unavailable|unresponsive)|knock\w*\s+(it|the)\s+offline|took\s+down\s+(the\s+)?(site|server)/i],
  ['impact/unauthorized-write',    /arbitrary\s+(file\s+write|write\s+to|delete)|delete\s+(any|other)?\s*(user'?s?\s+)?(account|data|record)/i],
  ['impact/persistence',            /(persistent|permanent)\s+(access|presence|shell|foothold)|backdoor\s+install|survives?\s+reboot/i],
];

// Trigger: the prerequisite/entry vector.
const TRIGGER_RULES = [
  ['trigger/unauthenticated',       /unauthenticated\s+(access|request)|no\s+authentication\s+(required|needed)|without\s+(auth|login|any\s+credentials)|pre[- ]?auth\b/i],
  ['trigger/auth-required',        /authenticated\s+(user|request|attacker)|requires?\s+authentication|logged[- ]in\s+(user|attacker)/i],
  ['trigger/low-priv-user',        /low[- ]privilege\s+(user|account)|normal\s+(user|account|subscriber)|any\s+(user|member)\s+account/i],
  ['trigger/admin-required',      /admin\s+(privilege|access|panel|account|interface|dashboard)/i],
  ['trigger/one-click',           /one[- ]click|\b1[- ]click\b|single\s+click|victim\s+clicks?\b|drive[- ]by\b/i],
  ['trigger/victim-interaction',  /victim.{0,30}(click|visit|open|interact)|user\s+interaction\s+required|requires?\s+(a\s+)?victim/i],
  ['trigger/password-reset',      /password\s+reset\s+(link|token|flow|email|request)/i],
  ['trigger/session-cookie',      /session\s+(cookie|token|id)|leak\w*\s+(the\s+)?(session|cookie)/i],
  ['trigger/file-upload',         /file\s+upload\s+(endpoint|feature|function|via)|upload\w*\s+(a|an|any)\s+(file|image|avatar)/i],
  ['trigger/dns-rebinding',       /dns\s+rebind/i],
  ['trigger/cors-origin',        /\bcors\b|origin\s+allowlist?\s+flaw|origin\s+reflection/i],
  ['trigger/social-engineering',  /social\s+(engineer|engineering)|phish\w*|convinc\w*\s+(a|the)\s+(user|victim)/i],
  ['trigger/race-window',        /race\s+(condition|window)|concurrent\s+(request|execut)|timing\s+attack/i],
  ['trigger/brute-force',        /brute[- ]force|dictionary\s+attack|credential\s+stuffing|enumerat\w*\s+(user|account)/i],
];

// Fix: what was/is done (references in bodies + suggested-fix sections).
const FIX_RULES = [
  ['fix/parameterized-query',      /(parameterized|prepared)\s+(quer|statement)|bound\s+parameters?\s|orm\s+escap/i],
  ['fix/input-validation',        /input\s+(validation|sanitiz)|validat\w*\s+(the\s+)?(user\s+)?input|allow\s+?list\s+(based)?\s+(validation|check)|whitelist\s+valid/i],
  ['fix/escape-output',           /(escape|encod)\w*\s+(on\s+)?(output|render)|contextual\s+escap|sanitize\s+.{0,20}(render|output|html)/i],
  ['fix/csp',                      /\bcsp\b|content\s+security\s+policy/i],
  ['fix/authorization-checks',   /(authorization|authorization\s+checks|access\s+control\s+check)s?\s+(on|for|added|enforce)|enforce\w*\s+authorization|check\w*\s+(the\s+)?(object|record)\s+(owner|level)|centrali[sz]\w*\s+authoriz/i],
  ['fix/authentication-hardening',/rate[- ]?limit\w*\s+(the\s+)?(login|auth|reset)|lock\s+out\s+.{0,15}attempts|captcha\b|2fa\s+(on|for|enable)|mfa\s+(on|for|enable)|session\s+invalidat/i],
  ['fix/secrets-rotation',       /(rotat\w*|revoke\w*|revoke)\s+(the\s+)?(secret|token|key|credential)|remove\w*\s+.{0,15}(secret|credential|key)\s+from\s+.{0,20}(code|repo|source)/i],
  ['fix/patch-upstream',         /(patch|fix)\w*\s+(in|via|upstream|upstream)?\s*(pull\s+request|pr\b|commit|release)|upstream\s+(fix|patch|release)|backport\w*/i],
  ['fix/network-isolation',      /(restrict|limit|block)\w*\s+(the\s+)?(internal|metadata|link[- ]local)\s+(network|endpoint|service|access)|internal\s+network\s+(isolat|restrict)|deny\s+by\s+default/i],
  ['fix/file-validation',        /(validate|verify|check)\w*\s+(the\s+)?(file\s+)?(type|extension|content)|magic\s+bytes?\s+(check|validat)|store\w*\s+.{0,20}(outside|s3|object\s+storage)/i],
];

// ── Corpus access ─────────────────────────────────────────────────────────────

function fmBlock(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---/);
  return m ? m[1] : '';
}

function bodySection(content) {
  const m = content.match(/\n## Report body\n([\s\S]*?)(?=\n## (?:Timeline|Report summary))/);
  return m ? m[1] : '';
}

function summarySection(content) {
  const m = content.match(/\n## Report summary\n([\s\S]*?)(?=\n## (?:Timeline|Report body))/);
  return m ? m[1] : '';
}

function title(content) {
  const m = content.match(/^#\s+(.+)$/m);
  return m ? m[1] : (content.match(/^title:\s*"(.*)"/m) || [])[1] || '';
}

function tagsIn(fm, prefixes) {
  const out = [];
  const re = /^ {2}- ([a-z0-9/_-]+)\s*$/gm;
  for (const m of fm.matchAll(re)) {
    if (prefixes.some(p => m[1].startsWith(p))) out.push(m[1]);
  }
  return out;
}

function hasAxis(fm, axis) {
  return new RegExp(`^ {2}- ${axis}/`, 'm').test(fm);
}

/** Insert `  - tag` lines at the end of the tags block. */
function addTags(content, newTags) {
  const lines = content.split('\n');
  const t = lines.indexOf('tags:');
  if (t === -1) return content;
  let end = t + 1;
  while (end < lines.length && /^ {2}- /.test(lines[end])) end++;
  const existing = new Set(lines.slice(t + 1, end).map(l => l.replace(/^ {2}- /, '')));
  const add = newTags.filter(x => !existing.has(x));
  if (!add.length) return content;
  lines.splice(end, 0, ...add.map(x => `  - ${x}`));
  return lines.join('\n');
}

function matchRules(rules, text) {
  return rules.filter(([, rx]) => rx.test(text)).map(([tag]) => tag);
}

// ── Main ──────────────────────────────────────────────────────────────────────

function main() {
  const files = fs.readdirSync(DISC_DIR).filter(f => f.endsWith('.md')).sort();
  let tagged = 0, skipped = 0, noBody = 0;
  const queue = [];
  const counts = { vuln: 0, impact: 0, trigger: 0, fix: 0 };

  // First pass: which cards need which axes
  const jobs = [];
  for (const f of files) {
    const content = fs.readFileSync(path.join(DISC_DIR, f), 'utf8');
    const fm = fmBlock(content);
    const body = bodySection(content);
    if (!body && !summarySection(content)) { noBody++; continue; }
    const needs = [];
    for (const axis of ['vuln', 'impact', 'trigger', 'fix']) {
      if (!hasAxis(fm, axis)) needs.push(axis);
    }
    if (needs.length) jobs.push({ f, needs, content, fm });
    else skipped++;
  }

  const run = MAX_CARDS ? jobs.slice(0, MAX_CARDS) : jobs;
  console.log(`Cards: ${files.length} | complete: ${skipped} | no body: ${noBody} | to tag: ${run.length}`);

  for (const job of run) {
    const { f, needs } = job;
    const content = job.content;
    const body = bodySection(content);
    const summary = summarySection(content);
    const text = `${title(content)}\n${body}`;
    const textAll = `${text}\n${summary}`;

    const add = [];
    if (needs.includes('vuln')) {
      const t = matchRules(VULN_RULES, text);
      if (t.length) { add.push(...t); counts.vuln += t.length; }
    }
    if (needs.includes('impact')) {
      const t = matchRules(IMPACT_RULES, text);
      if (t.length) { add.push(...t); counts.impact += t.length; }
    }
    if (needs.includes('trigger')) {
      const t = matchRules(TRIGGER_RULES, text);
      if (t.length) { add.push(...t); counts.trigger += t.length; }
    }
    if (needs.includes('fix')) {
      const t = matchRules(FIX_RULES, textAll);
      if (t.length) { add.push(...t); counts.fix += t.length; }
    }

    if (add.length) {
      fs.writeFileSync(path.join(DISC_DIR, f), addTags(content, add));
      tagged++;
    } else {
      skipped++;
    }
    if ((tagged + skipped) % 500 === 0) process.stdout.write(`\rprocessed ${tagged + skipped}/${run.length}  `);
  }

  console.log(`\nDONE - cards tagged: ${tagged} | unchanged: ${skipped - (files.length - run.length - noBody)} | tag additions: ${JSON.stringify(counts)}`);
}

main();