---
tags:
  - checklist
  - env/web
generated: true
---
# Web — Web Audit Checklist

> **Surface:** `env/web` (where the bug lives (web app, mobile, cloud, desktop, appliance, network)) | **Disclosures:** 2669 | **Critical:** 912 | **Total known bounty:** $2,010,802 (437 disclosed)
> Auto-generated from **disclosures/** in this surface, ranked by frequency. Regenerate with `node vault-admin/crawler/gen_web_checklists.js`. Do not edit by hand.

## ⚠️ Top CWE classes on this surface

What actually goes wrong here, most common first. Tick each class as you rule it out - open the linked CWE page for every known disclosure of that class.

- [ ] [[cwe/improper-access-control-generic|Improper Access Control Generic]] - 210 disclosures
- [ ] [[cwe/information-disclosure|Information Disclosure]] - 183 disclosures
- [ ] [[cwe/cross-site-scripting-xss-stored|Cross Site Scripting Xss Stored]] - 168 disclosures
- [ ] [[cwe/path-traversal|Path Traversal]] - 143 disclosures
- [ ] [[cwe/sql-injection|Sql Injection]] - 140 disclosures
- [ ] [[cwe/code-injection|Code Injection]] - 123 disclosures
- [ ] [[cwe/improper-authentication-generic|Improper Authentication Generic]] - 112 disclosures
- [ ] [[cwe/privilege-escalation|Privilege Escalation]] - 100 disclosures
- [ ] [[cwe/insecure-direct-object-reference-idor|Insecure Direct Object Reference Idor]] - 98 disclosures
- [ ] [[cwe/uncontrolled-resource-consumption|Uncontrolled Resource Consumption]] - 89 disclosures
- [ ] [[cwe/command-injection-generic|Command Injection Generic]] - 88 disclosures
- [ ] [[cwe/server-side-request-forgery-ssrf|Server Side Request Forgery Ssrf]] - 81 disclosures
- [ ] [[cwe/business-logic-errors|Business Logic Errors]] - 63 disclosures
- [ ] [[cwe/cross-site-scripting-xss-reflected|Cross Site Scripting Xss Reflected]] - 52 disclosures
- [ ] [[cwe/cross-site-request-forgery-csrf|Cross Site Request Forgery Csrf]] - 51 disclosures

## 🏢 Most affected programs

Where this surface class shows up most: `U.S. Dept Of Defense` (372), `Node.js third-party modules` (172), `Internet Bug Bounty` (148), `curl` (112), `GitLab` (98), `h1-ctf` (87), `MTN Group` (69), `Node.js` (57), `Starbucks` (53), `Nextcloud` (51), `Valve` (48), `HackerOne` (48), `Rocket.Chat` (44), `Automattic` (36), `Uber` (35)

## 📚 Study these disclosures

The highest-voted disclosures on this surface - their linked reports are the canonical writeups for how these bugs were found and exploited.

- [[disclosures/h1-867513-takeover-an-account-that-doesn-t-have-a-shopify-id-and-more|"Takeover an account that doesn't have a Shopify ID and more"]] - `critical`, undisclosed, 3006 votes, [[programs/shopify|Shopify]]
- [[disclosures/h1-510152-bypass-for-488147-enables-stored-xss-on-https-paypal-com-sig|"Bypass for #488147 enables stored XSS on https://paypal.com/signin again"]] - `high`, $20,000, 2688 votes, [[programs/paypal|PayPal]]
- [[disclosures/h1-791775-email-confirmation-bypass-in-myshop-myshopify-com-that-leads|"Email Confirmation Bypass in myshop.myshopify.com that Leads to Full Privilege Escalation to Any Shop Owner by Taking Advantage of the Shopify SSO"]] - `critical`, undisclosed, 1924 votes, [[programs/shopify|Shopify]]
- [[disclosures/h1-745324-account-takeover-via-leaked-session-cookie|"Account takeover via leaked session cookie"]] - `high`, $20,000, 1643 votes, [[programs/security|HackerOne]]
- [[disclosures/h1-1087489-github-access-token-exposure|"Github access token exposure"]] - `critical`, $50,000, 1602 votes, [[programs/shopify|Shopify]]
- [[disclosures/h1-827052-arbitrary-file-read-via-the-uploadsrewriter-when-moving-and-|"Arbitrary file read via the UploadsRewriter when moving and issue"]] - `critical`, $20,000, 1503 votes, [[programs/gitlab|GitLab]]
- [[disclosures/h1-739737-token-leak-in-security-challenge-flow-allows-retrieving-vict|"Token leak in security challenge flow allows retrieving victim's PayPal email and plain text password"]] - `high`, $15,300, 1410 votes, [[programs/paypal|PayPal]]
- [[disclosures/h1-470520-rce-on-steam-client-via-buffer-overflow-in-server-info|"RCE on Steam Client via buffer overflow in Server Info"]] - `critical`, undisclosed, 1289 votes, [[programs/valve|Valve]]

## ⚠️ Top bug classes (vuln/)

- `xss` - 383
- `code-injection` - 294
- `dos` - 275
- `path-traversal` - 235
- `info-disclosure` - 188
- `command-injection` - 150
- `sql-injection` - 146
- `xss-stored` - 119
- `privilege-escalation` - 117
- `ssrf` - 117
- `broken-access-control` - 116
- `csrf` - 97

## 🎯 Exploit triggers (trigger/)

- `auth-required` - 130
- `social-engineering` - 89
- `admin-required` - 89
- `session-cookie` - 72
- `cors-origin` - 64
- `brute-force` - 61
- `unauthenticated` - 60
- `victim-interaction` - 59

## 💥 Demonstrated impact (impact/)

- `rce` - 313
- `account-takeover` - 146
- `credential-theft` - 97
- `sensitive-data` - 94
- `data-exposure` - 28
- `unauthorized-write` - 26
- `internal-network` - 19
- `dos-impact` - 16

## 🛠️ Recommended fixes (fix/)

- `input-validation` - 60
- `csp` - 54
- `file-validation` - 25
- `authentication-hardening` - 22
- `patch-upstream` - 20
- `parameterized-query` - 19
- `authorization-checks` - 11
- `secrets-rotation` - 3
