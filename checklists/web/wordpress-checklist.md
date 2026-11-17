---
tags:
  - checklist
  - stack/wordpress
generated: true
---
# Wordpress — Web Audit Checklist

> **Surface:** `stack/wordpress` (technology stack involved (kubernetes, aws, nginx, ...)) | **Disclosures:** 44 | **Critical:** 14 | **Total known bounty:** $1,000 (1 disclosed)
> Auto-generated from **disclosures/** in this surface, ranked by frequency. Regenerate with `node vault-admin/crawler/gen_web_checklists.js`. Do not edit by hand.

## ⚠️ Top CWE classes on this surface

What actually goes wrong here, most common first. Tick each class as you rule it out - open the linked CWE page for every known disclosure of that class.

- [ ] [[cwe/cross-site-scripting-xss-stored|Cross Site Scripting Xss Stored]] - 9 disclosures
- [ ] [[cwe/information-disclosure|Information Disclosure]] - 7 disclosures
- [ ] [[cwe/improper-access-control-generic|Improper Access Control Generic]] - 5 disclosures
- [ ] [[cwe/path-traversal|Path Traversal]] - 3 disclosures
- [ ] [[cwe/cross-site-request-forgery-csrf|Cross Site Request Forgery Csrf]] - 2 disclosures
- [ ] [[cwe/uncontrolled-resource-consumption|Uncontrolled Resource Consumption]] - 2 disclosures
- [ ] [[cwe/cross-site-scripting-xss-reflected|Cross Site Scripting Xss Reflected]] - 2 disclosures
- [ ] [[cwe/code-injection|Code Injection]] - 2 disclosures
- [ ] [[cwe/privilege-escalation|Privilege Escalation]] - 1 disclosure
- [ ] [[cwe/misconfiguration|Misconfiguration]] - 1 disclosure
- [ ] [[cwe/sql-injection|Sql Injection]] - 1 disclosure
- [ ] [[cwe/cross-site-scripting-xss-generic|Cross Site Scripting Xss Generic]] - 1 disclosure
- [ ] [[cwe/deserialization-of-untrusted-data|Deserialization Of Untrusted Data]] - 1 disclosure
- [ ] [[cwe/cryptographic-issues-generic|Cryptographic Issues Generic]] - 1 disclosure
- [ ] [[cwe/ui-redressing-clickjacking|Ui Redressing Clickjacking]] - 1 disclosure

## 🏢 Most affected programs

Where this surface class shows up most: `WordPress` (30), `Automattic` (5), `MTN Group` (3), `U.S. Dept Of Defense` (2), `Nextcloud` (2), `Autodesk` (1), `Stripo Inc` (1)

## 📚 Study these disclosures

The highest-voted disclosures on this surface - their linked reports are the canonical writeups for how these bugs were found and exploited.

- [[disclosures/h1-643908-stored-xss-vulnerability|"Stored XSS Vulnerability"]] - `high`, undisclosed, 403 votes, [[programs/wordpress|WordPress]]
- [[disclosures/h1-733248-stored-xss-in-wordpress-com|"Stored XSS in wordpress.com"]] - `high`, undisclosed, 356 votes, [[programs/automattic|Automattic]]
- [[disclosures/h1-487081-stored-xss-in-private-message-component-buddypress|"Stored XSS in Private Message component (BuddyPress)"]] - `critical`, undisclosed, 337 votes, [[programs/wordpress|WordPress]]
- [[disclosures/h1-436928-rce-as-admin-defeats-wordpress-hardening-and-file-permission|"RCE as Admin defeats WordPress hardening and file permissions"]] - `critical`, undisclosed, 164 votes, [[programs/wordpress|WordPress]]
- [[disclosures/h1-1626205-wordpress-takeover-using-setup-configuration-at-http-edu-htu|"Wordpress Takeover using setup configuration at http://████.edu [HtUS]"]] - `critical`, $1,000, 102 votes, [[programs/deptofdefense|U.S. Dept Of Defense]]
- [[disclosures/h1-659419-reflected-xss-on-https-make-wordpress-org-via-channel-parame|"Reflected XSS on https://make.wordpress.org via 'channel' parameter"]] - `high`, undisclosed, 97 votes, [[programs/wordpress|WordPress]]
- [[disclosures/h1-428019-csrf-to-html-injection-in-comments|"CSRF to HTML Injection in Comments"]] - `high`, undisclosed, 95 votes, [[programs/wordpress|WordPress]]
- [[disclosures/h1-1107282-privilege-escalation-via-rest-api-to-administrator-leads-to-|"Privilege Escalation via REST API to Administrator leads to RCE"]] - `high`, undisclosed, 92 votes, [[programs/wordpress|WordPress]]
