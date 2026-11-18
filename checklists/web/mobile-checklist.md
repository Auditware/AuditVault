---
tags:
  - checklist
  - env/mobile
generated: true
---
# Mobile — Web Audit Checklist

> **Surface:** `env/mobile` (where the bug lives (web app, mobile, cloud, desktop, appliance, network)) | **Disclosures:** 29 | **Critical:** 9 | **Total known bounty:** $11,460 (8 disclosed)
> Auto-generated from **disclosures/** in this surface, ranked by frequency. Regenerate with `node vault-admin/crawler/gen_web_checklists.js`. Do not edit by hand.

## ⚠️ Top CWE classes on this surface

What actually goes wrong here, most common first. Tick each class as you rule it out - open the linked CWE page for every known disclosure of that class.

- [ ] [[cwe/information-disclosure|Information Disclosure]] - 5 disclosures
- [ ] [[cwe/path-traversal|Path Traversal]] - 3 disclosures
- [ ] [[cwe/improper-authentication-generic|Improper Authentication Generic]] - 3 disclosures
- [ ] [[cwe/cross-site-scripting-xss-generic|Cross Site Scripting Xss Generic]] - 3 disclosures
- [ ] [[cwe/client-side-enforcement-of-server-side-security|Client Side Enforcement Of Server Side Security]] - 2 disclosures
- [ ] [[cwe/improper-access-control-generic|Improper Access Control Generic]] - 2 disclosures
- [ ] [[cwe/improper-export-of-android-application-components|Improper Export Of Android Application Components]] - 1 disclosure
- [ ] [[cwe/code-injection|Code Injection]] - 1 disclosure
- [ ] [[cwe/insufficient-session-expiration|Insufficient Session Expiration]] - 1 disclosure
- [ ] [[cwe/cross-site-scripting-xss-stored|Cross Site Scripting Xss Stored]] - 1 disclosure
- [ ] [[cwe/privilege-escalation|Privilege Escalation]] - 1 disclosure
- [ ] [[cwe/use-of-hard-coded-credentials|Use Of Hard Coded Credentials]] - 1 disclosure
- [ ] [[cwe/forced-browsing|Forced Browsing]] - 1 disclosure
- [ ] [[cwe/command-injection-generic|Command Injection Generic]] - 1 disclosure
- [ ] [[cwe/privacy-violation|Privacy Violation]] - 1 disclosure

## 🏢 Most affected programs

Where this surface class shows up most: `VK.com` (3), `Slack` (3), `Cloudflare Public Bug Bounty` (2), `Grab` (2), `X / xAI` (2), `Zego` (1), `TikTok` (1), `Mattermost` (1), `Evernote` (1), `Reddit` (1), `KAYAK` (1), `MetaMask` (1), `Brave Software` (1), `Eternal` (1), `Tor` (1)

## 📚 Study these disclosures

The highest-voted disclosures on this surface - their linked reports are the canonical writeups for how these bugs were found and exploited.

- [[disclosures/h1-401793-grab-android-ios-insecure-deeplink-leads-to-sensitive-inform|"[Grab Android/iOS] Insecure deeplink leads to sensitive information disclosure"]] - `high`, undisclosed, 552 votes, [[programs/grab|Grab]]
- [[disclosures/h1-1065500-multiple-bugs-leads-to-rce-on-tiktok-for-android|"Multiple bugs leads to RCE on TikTok for Android"]] - `critical`, undisclosed, 371 votes, [[programs/tiktok|TikTok]]
- [[disclosures/h1-404822-aws-bucket-leading-to-ios-test-build-code-and-configuration-|"AWS bucket leading to iOS test build code and configuration exposure"]] - `critical`, $1,500, 321 votes, [[programs/slack|Slack]]
- [[disclosures/h1-1667998-1-click-account-takeover-via-deeplink-in-com-kayak-android|"1 click Account takeover via deeplink in [com.kayak.android]"]] - `critical`, undisclosed, 173 votes, [[programs/kayak|KAYAK]]
- [[disclosures/h1-499348-twitter-lite-android-vulnerable-to-local-file-steal-javascri|"Twitter lite(Android): Vulnerable to local file steal, Javascript injection, Open redirect "]] - `critical`, undisclosed, 95 votes, [[programs/x|X / xAI]]
- [[disclosures/h1-1751333-metamask-browser-url-and-transaction-origin-spoofing-metamas|"MetaMask Browser URL and Transaction Origin Spoofing - Metamask wallet Android & Metamask wallet iOS"]] - `high`, undisclosed, 87 votes, [[programs/metamask|MetaMask]]
- [[disclosures/h1-205000-authorization-bypass-using-login-by-phone-option-horizontal-|"Authorization bypass using login by phone option+horizontal escalation possible on Grab Android App"]] - `high`, undisclosed, 68 votes, [[programs/grab|Grab]]
- [[disclosures/h1-1115864-persistant-arbitrary-code-execution-in-mattermost-android|"Persistant Arbitrary code execution in mattermost android"]] - `high`, undisclosed, 67 votes, [[programs/mattermost|Mattermost]]

## ⚠️ Top bug classes (vuln/)

- `path-traversal` - 3
- `misconfiguration` - 2
- `code-injection` - 2
- `dos` - 2
- `xss` - 2
- `authentication-bypass` - 2
- `command-injection` - 2
- `idor` - 1
- `broken-access-control` - 1
- `open-redirect` - 1

## 🎯 Exploit triggers (trigger/)

- `victim-interaction` - 2
- `auth-required` - 1
- `low-priv-user` - 1
- `session-cookie` - 1
- `social-engineering` - 1

## 💥 Demonstrated impact (impact/)

- `account-takeover` - 2
- `rce` - 1
- `credential-theft` - 1

## 🛠️ Recommended fixes (fix/)

- `patch-upstream` - 1
