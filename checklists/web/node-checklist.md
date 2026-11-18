---
tags:
  - checklist
  - stack/node
generated: true
---
# Node — Web Audit Checklist

> **Surface:** `stack/node` (technology stack involved (kubernetes, aws, nginx, ...)) | **Disclosures:** 241 | **Critical:** 66 | **Total known bounty:** $7,325 (7 disclosed)
> Auto-generated from **disclosures/** in this surface, ranked by frequency. Regenerate with `node vault-admin/crawler/gen_web_checklists.js`. Do not edit by hand.

## ⚠️ Top CWE classes on this surface

What actually goes wrong here, most common first. Tick each class as you rule it out - open the linked CWE page for every known disclosure of that class.

- [ ] [[cwe/path-traversal|Path Traversal]] - 53 disclosures
- [ ] [[cwe/uncontrolled-resource-consumption|Uncontrolled Resource Consumption]] - 27 disclosures
- [ ] [[cwe/command-injection-generic|Command Injection Generic]] - 26 disclosures
- [ ] [[cwe/code-injection|Code Injection]] - 18 disclosures
- [ ] [[cwe/cross-site-scripting-xss-stored|Cross Site Scripting Xss Stored]] - 9 disclosures
- [ ] [[cwe/modification-of-assumed-immutable-data-maid|Modification Of Assumed Immutable Data Maid]] - 9 disclosures
- [ ] [[cwe/privilege-escalation|Privilege Escalation]] - 8 disclosures
- [ ] [[cwe/os-command-injection|Os Command Injection]] - 7 disclosures
- [ ] [[cwe/sql-injection|Sql Injection]] - 7 disclosures
- [ ] [[cwe/improper-access-control-generic|Improper Access Control Generic]] - 6 disclosures
- [ ] [[cwe/information-exposure-through-directory-listing|Information Exposure Through Directory Listing]] - 6 disclosures
- [ ] [[cwe/improper-certificate-validation|Improper Certificate Validation]] - 4 disclosures
- [ ] [[cwe/cryptographic-issues-generic|Cryptographic Issues Generic]] - 3 disclosures
- [ ] [[cwe/out-of-bounds-read|Out Of Bounds Read]] - 3 disclosures
- [ ] [[cwe/cross-site-scripting-xss-generic|Cross Site Scripting Xss Generic]] - 3 disclosures

## 🏢 Most affected programs

Where this surface class shows up most: `Node.js third-party modules` (174), `Node.js` (63), `Internet Bug Bounty` (3), `AWS VDP` (1)

## 📚 Study these disclosures

The highest-voted disclosures on this surface - their linked reports are the canonical writeups for how these bugs were found and exploited.

- [[disclosures/h1-922597-http-request-smuggling-due-to-cr-to-hyphen-conversion|"HTTP Request Smuggling due to CR-to-Hyphen conversion"]] - `high`, undisclosed, 134 votes, [[programs/nodejs|Node.js]]
- [[disclosures/h1-735748-http-request-smuggling-using-malformed-transfer-encoding-hea|"HTTP request smuggling using malformed Transfer-Encoding header"]] - `critical`, undisclosed, 105 votes, [[programs/nodejs|Node.js]]
- [[disclosures/h1-2319584-assertion-failed-in-node-http2-http2session-http2session-lea|"'Assertion failed' in node::http2::Http2Session::~Http2Session() leads to HTTP/2 server crash"]] - `high`, undisclosed, 65 votes, [[programs/nodejs|Node.js]]
- [[disclosures/h1-3556769-incomplete-fix-for-cve-2026-21637-loadsni-in-tls-wrap-js-lac|"Incomplete fix for CVE-2026-21637: loadSNI() in _tls_wrap.js lacks try/catch leading to Remote DoS"]] - `high`, undisclosed, 59 votes, [[programs/nodejs|Node.js]]
- [[disclosures/h1-3131758-hashdos-in-v8|"HashDoS in V8"]] - `high`, undisclosed, 53 votes, [[programs/nodejs|Node.js]]
- [[disclosures/h1-3558713-command-injection-via-unsanitized-bundling-options-in-aws-cd|"Command Injection via Unsanitized Bundling Options in `aws-cdk-lib/aws-lambda-nodejs`"]] - `high`, undisclosed, 48 votes, [[programs/aws_vdp|AWS VDP]]
- [[disclosures/h1-2256167-path-traversal-through-path-stored-in-uint8array-in-node-js-|"Path traversal through path stored in Uint8Array in Node.js 20"]] - `high`, $3,495, 44 votes, [[programs/ibb|Internet Bug Bounty]]
- [[disclosures/h1-3736889-null-pointer-dereference-in-node-sqlite-databasesync-applych|"NULL pointer dereference in node:sqlite DatabaseSync#applyChangeset() via malformed SQLite changeset"]] - `high`, undisclosed, 44 votes, [[programs/nodejs|Node.js]]

## ⚠️ Top bug classes (vuln/)

- `path-traversal` - 58
- `dos` - 52
- `code-injection` - 48
- `command-injection` - 44
- `xss` - 23
- `xss-stored` - 9
- `sql-injection` - 8
- `info-disclosure` - 8
- `ssrf` - 6
- `broken-access-control` - 4
- `file-upload` - 4
- `privilege-escalation` - 3

## 🎯 Exploit triggers (trigger/)

- `victim-interaction` - 5
- `dns-rebinding` - 3
- `social-engineering` - 3
- `session-cookie` - 2
- `one-click` - 2
- `race-window` - 2
- `low-priv-user` - 1
- `file-upload` - 1

## 💥 Demonstrated impact (impact/)

- `rce` - 57
- `dos-impact` - 6
- `unauthorized-write` - 4
- `credential-theft` - 2
- `sensitive-data` - 2
- `internal-network` - 1
- `persistence` - 1
- `account-takeover` - 1

## 🛠️ Recommended fixes (fix/)

- `input-validation` - 8
- `patch-upstream` - 6
- `file-validation` - 5
- `parameterized-query` - 1
