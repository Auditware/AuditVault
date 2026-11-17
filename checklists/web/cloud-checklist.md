---
tags:
  - checklist
  - env/cloud
generated: true
---
# Cloud — Web Audit Checklist

> **Surface:** `env/cloud` (where the bug lives (web app, mobile, cloud, desktop, appliance, network)) | **Disclosures:** 78 | **Critical:** 31 | **Total known bounty:** $83,878 (21 disclosed)
> Auto-generated from **disclosures/** in this surface, ranked by frequency. Regenerate with `node vault-admin/crawler/gen_web_checklists.js`. Do not edit by hand.

## ⚠️ Top CWE classes on this surface

What actually goes wrong here, most common first. Tick each class as you rule it out - open the linked CWE page for every known disclosure of that class.

- [ ] [[cwe/information-disclosure|Information Disclosure]] - 12 disclosures
- [ ] [[cwe/server-side-request-forgery-ssrf|Server Side Request Forgery Ssrf]] - 9 disclosures
- [ ] [[cwe/privilege-escalation|Privilege Escalation]] - 9 disclosures
- [ ] [[cwe/code-injection|Code Injection]] - 9 disclosures
- [ ] [[cwe/os-command-injection|Os Command Injection]] - 5 disclosures
- [ ] [[cwe/improper-authentication-generic|Improper Authentication Generic]] - 4 disclosures
- [ ] [[cwe/improper-access-control-generic|Improper Access Control Generic]] - 3 disclosures
- [ ] [[cwe/use-of-hard-coded-credentials|Use Of Hard Coded Credentials]] - 3 disclosures
- [ ] [[cwe/command-injection-generic|Command Injection Generic]] - 3 disclosures
- [ ] [[cwe/information-exposure-through-directory-listing|Information Exposure Through Directory Listing]] - 2 disclosures
- [ ] [[cwe/misconfiguration|Misconfiguration]] - 2 disclosures
- [ ] [[cwe/cleartext-storage-of-sensitive-information|Cleartext Storage Of Sensitive Information]] - 1 disclosure
- [ ] [[cwe/business-logic-errors|Business Logic Errors]] - 1 disclosure
- [ ] [[cwe/cryptographic-issues-generic|Cryptographic Issues Generic]] - 1 disclosure
- [ ] [[cwe/cross-site-request-forgery-csrf|Cross Site Request Forgery Csrf]] - 1 disclosure

## 🏢 Most affected programs

Where this surface class shows up most: `Kubernetes` (16), `AWS VDP` (12), `U.S. Dept Of Defense` (8), `Semmle` (4), `Internet Bug Bounty` (3), `IBM` (2), `Nextcloud` (2), `GitLab` (2), `Vimeo` (2), `Ruby` (2), `Evernote` (1), `Reddit` (1), `Flickr` (1), `8x8` (1), `Acronis` (1)

## 📚 Study these disclosures

The highest-voted disclosures on this surface - their linked reports are the canonical writeups for how these bugs were found and exploited.

- [[disclosures/h1-455645-exposed-kubernetes-api-rce-exposed-creds|"Exposed Kubernetes API - RCE/Exposed Creds"]] - `critical`, $25,000, 1191 votes, [[programs/snapchat|Snapchat]]
- [[disclosures/h1-1342088-flickr-account-takeover-using-aws-cognito-api|"Flickr Account Takeover using AWS Cognito API"]] - `critical`, undisclosed, 440 votes, [[programs/flickr|Flickr]]
- [[disclosures/h1-404822-aws-bucket-leading-to-ios-test-build-code-and-configuration-|"AWS bucket leading to iOS test build code and configuration exposure"]] - `critical`, $1,500, 321 votes, [[programs/slack|Slack]]
- [[disclosures/h1-549882-ssrf-leaking-internal-google-cloud-data-through-upload-funct|"SSRF  leaking internal google cloud data through upload function [SSH Keys, etc..]"]] - `critical`, undisclosed, 276 votes, [[programs/vimeo|Vimeo]]
- [[disclosures/h1-1189367-full-read-ssrf-in-www-evernote-com-that-can-leak-aws-metadat|"Full read SSRF in www.evernote.com that can leak aws metadata and local file inclusion"]] - `critical`, undisclosed, 264 votes, [[programs/evernote|Evernote]]
- [[disclosures/h1-2107680-aws-keys-and-user-cookie-leakage-via-uninitialized-memory-le|"AWS keys and user cookie leakage via uninitialized memory leak in outdated librsvg version in Basecamp"]] - `high`, $8,868, 248 votes, [[programs/basecamp|Basecamp]]
- [[disclosures/h1-508459-ssrf-in-webhooks-leads-to-aws-private-keys-disclosure|"SSRF in webhooks leads to AWS private keys disclosure"]] - `high`, undisclosed, 214 votes, [[programs/omise|Omise]]
- [[disclosures/h1-692603-privilege-escalation-in-workers-container|"Privilege escalation in workers container "]] - `high`, $1,500, 206 votes, [[programs/semmle|Semmle]]
