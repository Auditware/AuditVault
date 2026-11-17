---
tags:
  - checklist
  - stack/php
generated: true
---
# Php — Web Audit Checklist

> **Surface:** `stack/php` (technology stack involved (kubernetes, aws, nginx, ...)) | **Disclosures:** 49 | **Critical:** 17 | **Total known bounty:** $43,700 (12 disclosed)
> Auto-generated from **disclosures/** in this surface, ranked by frequency. Regenerate with `node vault-admin/crawler/gen_web_checklists.js`. Do not edit by hand.

## ⚠️ Top CWE classes on this surface

What actually goes wrong here, most common first. Tick each class as you rule it out - open the linked CWE page for every known disclosure of that class.

- [ ] [[cwe/sql-injection|Sql Injection]] - 13 disclosures
- [ ] [[cwe/code-injection|Code Injection]] - 9 disclosures
- [ ] [[cwe/information-disclosure|Information Disclosure]] - 5 disclosures
- [ ] [[cwe/uncontrolled-resource-consumption|Uncontrolled Resource Consumption]] - 3 disclosures
- [ ] [[cwe/server-side-request-forgery-ssrf|Server Side Request Forgery Ssrf]] - 3 disclosures
- [ ] [[cwe/improper-access-control-generic|Improper Access Control Generic]] - 2 disclosures
- [ ] [[cwe/cross-site-scripting-xss-stored|Cross Site Scripting Xss Stored]] - 2 disclosures
- [ ] [[cwe/cross-site-scripting-xss-reflected|Cross Site Scripting Xss Reflected]] - 2 disclosures
- [ ] [[cwe/deserialization-of-untrusted-data|Deserialization Of Untrusted Data]] - 2 disclosures
- [ ] [[cwe/php-local-file-inclusion|Php Local File Inclusion]] - 1 disclosure
- [ ] [[cwe/command-injection-generic|Command Injection Generic]] - 1 disclosure
- [ ] [[cwe/heap-overflow|Heap Overflow]] - 1 disclosure
- [ ] [[cwe/information-exposure-through-directory-listing|Information Exposure Through Directory Listing]] - 1 disclosure
- [ ] [[cwe/path-traversal|Path Traversal]] - 1 disclosure
- [ ] [[cwe/os-command-injection|Os Command Injection]] - 1 disclosure

## 🏢 Most affected programs

Where this surface class shows up most: `U.S. Dept Of Defense` (11), `Revive Adserver` (9), `Eternal` (4), `VK.com` (3), `Automattic` (2), `ExpressionEngine` (2), `Internet Bug Bounty` (2), `Valve` (2), `MTN Group` (1), `ImpressCMS` (1), `BlockDev Sp. Z o.o` (1), `Invision Power Services, Inc.` (1), `Rockstar Games` (1), `GSA Bounty` (1), `CodeIgniter` (1)

## 📚 Study these disclosures

The highest-voted disclosures on this surface - their linked reports are the canonical writeups for how these bugs were found and exploited.

- [[disclosures/h1-383127-sql-injection-in-report-xml-php-through-countryfilter-parame|"SQL Injection in report_xml.php through countryFilter[] parameter"]] - `critical`, $25,000, 410 votes, [[programs/valve|Valve]]
- [[disclosures/h1-403616-www-zomato-com-sqli-php-item-id|"[www.zomato.com] SQLi - /php/██████████ - item_id"]] - `critical`, $4,500, 326 votes, [[programs/eternal|Eternal]]
- [[disclosures/h1-268382-nginx-misconfiguration-leading-to-direct-php-source-code-dow|"Nginx misconfiguration leading to direct PHP source code download"]] - `high`, undisclosed, 145 votes, [[programs/gsa_bbp|GSA Bounty]]
- [[disclosures/h1-746024-ssrf-on-music-line-me-through-getxml-php|"SSRF on music.line.me through getXML.php"]] - `high`, $4,500, 135 votes, [[programs/line|LY Corporation]]
- [[disclosures/h1-210741-unserialize-leading-to-arbitrary-php-function-invoke|"Unserialize leading to arbitrary PHP function invoke"]] - `critical`, undisclosed, 119 votes, [[programs/rockstargames|Rockstar Games]]
- [[disclosures/h1-3395221-error-based-time-based-sql-injection-in-keyword-parameter-of|"Error-Based & Time-Based SQL Injection in 'keyword' Parameter of admin-search.php Allowing Full Database Access in Revive Adserver v6.0.0"]] - `high`, undisclosed, 93 votes, [[programs/revive_adserver|Revive Adserver]]
- [[disclosures/h1-1042746-intensedebate-com-sql-injection-time-based-on-changereplaceo|"[intensedebate.com] SQL Injection Time Based on /changeReplaceOpt.php"]] - `critical`, undisclosed, 80 votes, [[programs/automattic|Automattic]]
- [[disclosures/h1-838855-www-zomato-com-blind-sql-injection-in-php-geto2banner|"[www.zomato.com] Blind SQL Injection in /php/geto2banner"]] - `critical`, $2,000, 68 votes, [[programs/eternal|Eternal]]
