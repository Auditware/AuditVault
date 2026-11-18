---
tags:
  - checklist
  - env/appliance
generated: true
---
# Appliance — Web Audit Checklist

> **Surface:** `env/appliance` (where the bug lives (web app, mobile, cloud, desktop, appliance, network)) | **Disclosures:** 12 | **Critical:** 3 | **Total known bounty:** $0 (0 disclosed)
> Auto-generated from **disclosures/** in this surface, ranked by frequency. Regenerate with `node vault-admin/crawler/gen_web_checklists.js`. Do not edit by hand.

## ⚠️ Top CWE classes on this surface

What actually goes wrong here, most common first. Tick each class as you rule it out - open the linked CWE page for every known disclosure of that class.

- [ ] [[cwe/insecure-direct-object-reference-idor|Insecure Direct Object Reference Idor]] - 2 disclosures
- [ ] [[cwe/buffer-over-read|Buffer Over Read]] - 2 disclosures
- [ ] [[cwe/command-injection-generic|Command Injection Generic]] - 1 disclosure
- [ ] [[cwe/privilege-escalation|Privilege Escalation]] - 1 disclosure
- [ ] [[cwe/cross-site-request-forgery-csrf|Cross Site Request Forgery Csrf]] - 1 disclosure
- [ ] [[cwe/path-traversal|Path Traversal]] - 1 disclosure
- [ ] [[cwe/cross-site-scripting-xss-dom|Cross Site Scripting Xss Dom]] - 1 disclosure
- [ ] [[cwe/embedded-malicious-code|Embedded Malicious Code]] - 1 disclosure
- [ ] [[cwe/improper-null-termination|Improper Null Termination]] - 1 disclosure

## 🏢 Most affected programs

Where this surface class shows up most: `Ubiquiti Inc.` (4), `HackerOne` (2), `Internet Bug Bounty` (2), `Slack` (1), `Shopify` (1), `Node.js third-party modules` (1), `Node.js` (1)

## 📚 Study these disclosures

The highest-voted disclosures on this surface - their linked reports are the canonical writeups for how these bugs were found and exploited.

- [[disclosures/h1-422043-h1514-domxss-on-embedded-sdk-via-shopify-api-setwindowlocati|"H1514 DOMXSS on Embedded SDK via Shopify.API.setWindowLocation abusing cookie Stuffing"]] - `high`, undisclosed, 195 votes, [[programs/shopify|Shopify]]
- [[disclosures/h1-1034346-security-email-forwarding-and-embedded-submission-drafts-can|"Security@ email forwarding and Embedded Submission drafts can be used to obtain copy of deleted attachments from other HackerOne users"]] - `high`, undisclosed, 91 votes, [[programs/security|HackerOne]]
- [[disclosures/h1-447930-embedded-submission-form-uuids-can-be-enumerated-through-gra|"Embedded submission form UUIDs can be enumerated through GraphQL node interface, exposing sensitive program details"]] - `high`, undisclosed, 54 votes, [[programs/security|HackerOne]]
- [[disclosures/h1-323852-firmware-download-install-vulnerable-to-csrf|"Firmware download/install vulnerable to CSRF"]] - `high`, undisclosed, 35 votes, [[programs/ui|Ubiquiti Inc.]]
- [[disclosures/h1-200427-access-of-android-protected-components-via-embedded-intent|"Access of Android protected components via embedded intent"]] - `critical`, undisclosed, 31 votes, [[programs/slack|Slack]]
- [[disclosures/h1-240098-csrf-replacing-the-router-configuration-backup-having-an-ope|"CSRF: Replacing the router configuration backup having an 'operator' user and bypassing the 'Referer:' whitelist protection"]] - `critical`, undisclosed, 14 votes, [[programs/ui|Ubiquiti Inc.]]
- [[disclosures/h1-450006-flatmap-stream-malicious-package-distributed-via-the-popular|"flatmap-stream malicious package (distributed via the popular events-stream)"]] - `critical`, undisclosed, 13 votes, [[programs/nodejs-ecosystem|Node.js third-party modules]]
- [[disclosures/h1-330051-unifi-video-server-web-interface-admin-user-firmware-update-|"UniFi Video Server web interface admin user Firmware Update path traversal leading to local system compromise"]] - `high`, undisclosed, 11 votes, [[programs/ui|Ubiquiti Inc.]]

## ⚠️ Top bug classes (vuln/)

- `info-disclosure` - 2
- `xss` - 1
- `csrf` - 1

## 🎯 Exploit triggers (trigger/)

- `auth-required` - 2
- `session-cookie` - 1
- `brute-force` - 1

## 💥 Demonstrated impact (impact/)

- `rce` - 1

## 🛠️ Recommended fixes (fix/)

- `input-validation` - 1
