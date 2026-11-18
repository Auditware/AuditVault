---
tags:
  - checklist
  - stack/gitlab
generated: true
---
# Gitlab — Web Audit Checklist

> **Surface:** `stack/gitlab` (technology stack involved (kubernetes, aws, nginx, ...)) | **Disclosures:** 104 | **Critical:** 31 | **Total known bounty:** $520,360 (54 disclosed)
> Auto-generated from **disclosures/** in this surface, ranked by frequency. Regenerate with `node vault-admin/crawler/gen_web_checklists.js`. Do not edit by hand.

## ⚠️ Top CWE classes on this surface

What actually goes wrong here, most common first. Tick each class as you rule it out - open the linked CWE page for every known disclosure of that class.

- [ ] [[cwe/cross-site-scripting-xss-stored|Cross Site Scripting Xss Stored]] - 26 disclosures
- [ ] [[cwe/improper-access-control-generic|Improper Access Control Generic]] - 10 disclosures
- [ ] [[cwe/server-side-request-forgery-ssrf|Server Side Request Forgery Ssrf]] - 9 disclosures
- [ ] [[cwe/command-injection-generic|Command Injection Generic]] - 9 disclosures
- [ ] [[cwe/information-disclosure|Information Disclosure]] - 6 disclosures
- [ ] [[cwe/path-traversal|Path Traversal]] - 5 disclosures
- [ ] [[cwe/insecure-direct-object-reference-idor|Insecure Direct Object Reference Idor]] - 5 disclosures
- [ ] [[cwe/improper-authentication-generic|Improper Authentication Generic]] - 3 disclosures
- [ ] [[cwe/cross-site-scripting-xss-generic|Cross Site Scripting Xss Generic]] - 3 disclosures
- [ ] [[cwe/privilege-escalation|Privilege Escalation]] - 3 disclosures
- [ ] [[cwe/code-injection|Code Injection]] - 2 disclosures
- [ ] [[cwe/uncontrolled-resource-consumption|Uncontrolled Resource Consumption]] - 2 disclosures
- [ ] [[cwe/resource-injection|Resource Injection]] - 2 disclosures
- [ ] [[cwe/os-command-injection|Os Command Injection]] - 2 disclosures
- [ ] [[cwe/business-logic-errors|Business Logic Errors]] - 2 disclosures

## 🏢 Most affected programs

Where this surface class shows up most: `GitLab` (100), `U.S. Dept Of Defense` (2), `HackerOne` (1), `RATELIMITED` (1)

## 📚 Study these disclosures

The highest-voted disclosures on this surface - their linked reports are the canonical writeups for how these bugs were found and exploited.

- [[disclosures/h1-827052-arbitrary-file-read-via-the-uploadsrewriter-when-moving-and-|"Arbitrary file read via the UploadsRewriter when moving and issue"]] - `critical`, $20,000, 1503 votes, [[programs/gitlab|GitLab]]
- [[disclosures/h1-2293343-account-takeover-via-password-reset-without-user-interaction|"Account Takeover via Password Reset without user interactions"]] - `critical`, $35,000, 991 votes, [[programs/gitlab|GitLab]]
- [[disclosures/h1-658013-git-flag-injection-local-file-overwrite-to-remote-code-execu|"Git flag injection - local file overwrite to remote code execution"]] - `critical`, $12,000, 777 votes, [[programs/gitlab|GitLab]]
- [[disclosures/h1-446585-exfiltrate-and-mutate-repository-and-project-data-through-in|"Exfiltrate and mutate repository and project data through injected templated service"]] - `critical`, $11,000, 762 votes, [[programs/gitlab|GitLab]]
- [[disclosures/h1-526325-stored-xss-in-wiki-pages|"Stored XSS in Wiki pages"]] - `high`, undisclosed, 633 votes, [[programs/gitlab|GitLab]]
- [[disclosures/h1-587854-local-files-could-be-overwritten-in-gitlab-leading-to-remote|"Local files could be overwritten in GitLab, leading to remote command execution"]] - `critical`, $12,000, 542 votes, [[programs/gitlab|GitLab]]
- [[disclosures/h1-1154542-rce-when-removing-metadata-with-exiftool|"RCE when removing metadata with ExifTool"]] - `critical`, $20,000, 508 votes, [[programs/gitlab|GitLab]]
- [[disclosures/h1-689314-project-template-functionality-can-be-used-to-copy-private-p|"Project Template functionality can be used to copy private project data, such as repository, confidential issues, snippets, and merge requests"]] - `critical`, $12,000, 457 votes, [[programs/gitlab|GitLab]]

## ⚠️ Top bug classes (vuln/)

- `xss` - 37
- `xss-stored` - 23
- `code-injection` - 12
- `ssrf` - 11
- `path-traversal` - 11
- `command-injection` - 7
- `dos` - 5
- `csrf` - 5
- `privilege-escalation` - 4
- `sql-injection` - 3
- `race-condition` - 3
- `subdomain-takeover` - 2

## 🎯 Exploit triggers (trigger/)

- `auth-required` - 8
- `victim-interaction` - 5
- `social-engineering` - 5
- `file-upload` - 4
- `admin-required` - 3
- `cors-origin` - 2
- `low-priv-user` - 2
- `brute-force` - 1

## 💥 Demonstrated impact (impact/)

- `rce` - 17
- `account-takeover` - 5
- `credential-theft` - 4
- `sensitive-data` - 3
- `unauthorized-write` - 2

## 🛠️ Recommended fixes (fix/)

- `csp` - 19
- `authentication-hardening` - 1
- `input-validation` - 1
- `file-validation` - 1
