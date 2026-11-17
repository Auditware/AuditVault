---
tags:
  - checklist
  - stack/ruby
generated: true
---
# Ruby — Web Audit Checklist

> **Surface:** `stack/ruby` (technology stack involved (kubernetes, aws, nginx, ...)) | **Disclosures:** 28 | **Critical:** 2 | **Total known bounty:** $16,250 (8 disclosed)
> Auto-generated from **disclosures/** in this surface, ranked by frequency. Regenerate with `node vault-admin/crawler/gen_web_checklists.js`. Do not edit by hand.

## ⚠️ Top CWE classes on this surface

What actually goes wrong here, most common first. Tick each class as you rule it out - open the linked CWE page for every known disclosure of that class.

- [ ] [[cwe/deserialization-of-untrusted-data|Deserialization Of Untrusted Data]] - 3 disclosures
- [ ] [[cwe/path-traversal|Path Traversal]] - 3 disclosures
- [ ] [[cwe/code-injection|Code Injection]] - 2 disclosures
- [ ] [[cwe/information-disclosure|Information Disclosure]] - 2 disclosures
- [ ] [[cwe/crlf-injection|Crlf Injection]] - 1 disclosure
- [ ] [[cwe/http-response-splitting|Http Response Splitting]] - 1 disclosure
- [ ] [[cwe/privilege-escalation|Privilege Escalation]] - 1 disclosure
- [ ] [[cwe/reliance-on-cookies-without-validation-and-integrity-checkin|Reliance On Cookies Without Validation And Integrity Checkin]] - 1 disclosure
- [ ] [[cwe/uncontrolled-resource-consumption|Uncontrolled Resource Consumption]] - 1 disclosure
- [ ] [[cwe/server-side-request-forgery-ssrf|Server Side Request Forgery Ssrf]] - 1 disclosure
- [ ] [[cwe/command-injection-generic|Command Injection Generic]] - 1 disclosure
- [ ] [[cwe/information-exposure-through-directory-listing|Information Exposure Through Directory Listing]] - 1 disclosure
- [ ] [[cwe/open-redirect|Open Redirect]] - 1 disclosure

## 🏢 Most affected programs

Where this surface class shows up most: `Ruby on Rails` (12), `Ruby` (9), `Internet Bug Bounty` (5), `Homebrew` (1), `GitLab` (1)

## 📚 Study these disclosures

The highest-voted disclosures on this surface - their linked reports are the canonical writeups for how these bugs were found and exploited.

- [[disclosures/h1-519220-file-writing-by-directory-traversal-at-actionpack-page-cachi|"File writing by Directory traversal at actionpack-page_caching and RCE by it"]] - `high`, $1,000, 80 votes, [[programs/rails|Ruby on Rails]]
- [[disclosures/h1-1929567-redos-ruby-time|"ReDoS( Ruby, Time)"]] - `high`, $4,000, 51 votes, [[programs/ibb|Internet Bug Bounty]]
- [[disclosures/h1-1167608-broken-parsing-of-git-diff-allows-an-attacker-to-inject-arbi|"Broken parsing of Git diff allows an attacker to inject arbitrary Ruby scripts to Casks on official taps"]] - `critical`, undisclosed, 49 votes, [[programs/homebrew|Homebrew]]
- [[disclosures/h1-473888-rce-which-may-occur-due-to-activesupport-messageverifier-or-|"RCE which may occur due to `ActiveSupport::MessageVerifier` or `ActiveSupport::MessageEncryptor` (especially Active storage)"]] - `high`, $1,500, 41 votes, [[programs/rails|Ruby on Rails]]
- [[disclosures/h1-2334455-path-traversal-in-acitvestorage-and-lead-rce|"Path traversal in AcitveStorage, and lead RCE"]] - `high`, undisclosed, 37 votes, [[programs/rails|Ruby on Rails]]
- [[disclosures/h1-299473-evaluating-ruby-code-by-injecting-rescue-job-on-the-system-h|"Evaluating Ruby code by injecting Rescue job on the system_hook_push queue through web hook"]] - `high`, $750, 36 votes, [[programs/gitlab|GitLab]]
- [[disclosures/h1-1464396-ruby-cve-2021-41819-cookie-prefix-spoofing-in-cgi-cookie-par|"Ruby CVE-2021-41819: Cookie Prefix Spoofing in CGI::Cookie.parse"]] - `high`, $2,000, 31 votes, [[programs/ibb|Internet Bug Bounty]]
- [[disclosures/h1-3553340-active-storage-vips-transformer-missing-validate-transformat|"Active Storage Vips Transformer Missing validate_transformation — CVE-2025-24293 Incomplete Fix"]] - `high`, undisclosed, 30 votes, [[programs/rails|Ruby on Rails]]
