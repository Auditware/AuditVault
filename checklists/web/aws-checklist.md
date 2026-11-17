---
tags:
  - checklist
  - stack/aws
generated: true
---
# Aws — Web Audit Checklist

> **Surface:** `stack/aws` (technology stack involved (kubernetes, aws, nginx, ...)) | **Disclosures:** 37 | **Critical:** 15 | **Total known bounty:** $15,368 (5 disclosed)
> Auto-generated from **disclosures/** in this surface, ranked by frequency. Regenerate with `node vault-admin/crawler/gen_web_checklists.js`. Do not edit by hand.

## ⚠️ Top CWE classes on this surface

What actually goes wrong here, most common first. Tick each class as you rule it out - open the linked CWE page for every known disclosure of that class.

- [ ] [[cwe/information-disclosure|Information Disclosure]] - 7 disclosures
- [ ] [[cwe/server-side-request-forgery-ssrf|Server Side Request Forgery Ssrf]] - 6 disclosures
- [ ] [[cwe/os-command-injection|Os Command Injection]] - 3 disclosures
- [ ] [[cwe/improper-authentication-generic|Improper Authentication Generic]] - 2 disclosures
- [ ] [[cwe/use-of-hard-coded-credentials|Use Of Hard Coded Credentials]] - 2 disclosures
- [ ] [[cwe/information-exposure-through-directory-listing|Information Exposure Through Directory Listing]] - 2 disclosures
- [ ] [[cwe/business-logic-errors|Business Logic Errors]] - 1 disclosure
- [ ] [[cwe/privilege-escalation|Privilege Escalation]] - 1 disclosure
- [ ] [[cwe/improper-access-control-generic|Improper Access Control Generic]] - 1 disclosure
- [ ] [[cwe/command-injection-generic|Command Injection Generic]] - 1 disclosure
- [ ] [[cwe/reflected-xss|Reflected Xss]] - 1 disclosure
- [ ] [[cwe/using-components-with-known-vulnerabilities|Using Components With Known Vulnerabilities]] - 1 disclosure
- [ ] [[cwe/incorrect-privilege-assignment|Incorrect Privilege Assignment]] - 1 disclosure
- [ ] [[cwe/cross-site-scripting-xss-reflected|Cross Site Scripting Xss Reflected]] - 1 disclosure
- [ ] [[cwe/sql-injection|Sql Injection]] - 1 disclosure

## 🏢 Most affected programs

Where this surface class shows up most: `AWS VDP` (12), `U.S. Dept Of Defense` (6), `Kubernetes` (3), `Ruby` (2), `Evernote` (1), `Reddit` (1), `Flickr` (1), `8x8` (1), `Glovo` (1), `Khan Academy` (1), `Basecamp` (1), `Mozilla` (1), `DuckDuckGo` (1), `Slack` (1), `Omise` (1)

## 📚 Study these disclosures

The highest-voted disclosures on this surface - their linked reports are the canonical writeups for how these bugs were found and exploited.

- [[disclosures/h1-1342088-flickr-account-takeover-using-aws-cognito-api|"Flickr Account Takeover using AWS Cognito API"]] - `critical`, undisclosed, 440 votes, [[programs/flickr|Flickr]]
- [[disclosures/h1-404822-aws-bucket-leading-to-ios-test-build-code-and-configuration-|"AWS bucket leading to iOS test build code and configuration exposure"]] - `critical`, $1,500, 321 votes, [[programs/slack|Slack]]
- [[disclosures/h1-1189367-full-read-ssrf-in-www-evernote-com-that-can-leak-aws-metadat|"Full read SSRF in www.evernote.com that can leak aws metadata and local file inclusion"]] - `critical`, undisclosed, 264 votes, [[programs/evernote|Evernote]]
- [[disclosures/h1-2107680-aws-keys-and-user-cookie-leakage-via-uninitialized-memory-le|"AWS keys and user cookie leakage via uninitialized memory leak in outdated librsvg version in Basecamp"]] - `high`, $8,868, 248 votes, [[programs/basecamp|Basecamp]]
- [[disclosures/h1-508459-ssrf-in-webhooks-leads-to-aws-private-keys-disclosure|"SSRF in webhooks leads to AWS private keys disclosure"]] - `high`, undisclosed, 214 votes, [[programs/omise|Omise]]
- [[disclosures/h1-2083771-remote-code-execution-and-aws-iam-credentials-exfiltration-i|" Remote Code Execution and AWS IAM Credentials Exfiltration in https://████████/"]] - `critical`, undisclosed, 114 votes, [[programs/deptofdefense|U.S. Dept Of Defense]]
- [[disclosures/h1-3637898-os-command-injection-in-aws-cdk-lib-nodejsfunction-via-unsan|"OS Command Injection in `aws-cdk-lib` NodejsFunction via Unsanitized `OsCommand` Helper (Supply Chain RCE)"]] - `high`, undisclosed, 111 votes, [[programs/aws_vdp|AWS VDP]]
- [[disclosures/h1-1285598-s3-bucket-takeover-presented-in-https-github-com-reddit-rpan|"s3 bucket takeover presented in https://github.com/reddit/rpan-studio/blob/e1782332c75ecb2f774343258ff509788feab7ce/CI/full-build-macos.sh"]] - `high`, undisclosed, 96 votes, [[programs/reddit|Reddit]]
