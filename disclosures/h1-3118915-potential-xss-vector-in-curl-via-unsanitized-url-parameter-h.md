---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/code-injection
  - env/web
  - vuln/xss
  - impact/credential-theft
  - trigger/session-cookie
  - trigger/social-engineering
  - fix/input-validation
substate: "not-applicable"
weakness: "Code Injection"
enriched: true
body: true
date: 2025-06-30
submitted: 2025-04-30T01:08:42.590Z
bounty_usd: null
votes: 8
cve: []
program: "[[programs/curl|curl]]"
reporter: "redfoxsec"
source: "https://hackerone.com/reports/3118915"
title: "Potential XSS vector in curl via unsanitized URL parameter handling"
---
# Potential XSS vector in curl via unsanitized URL parameter handling

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 8 | **Program:** curl | **Disclosed:** 2025-06-30

- Report: [https://hackerone.com/reports/3118915](https://hackerone.com/reports/3118915)
- CWE: Code Injection
- Submitted: 2025-04-30T01:08:42.590Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Description
 Summary:
During the analysis of the curl source code, a possible vector for Cross-Site Scripting (XSS) was identified through the glob_url() function and how URL input is handled via urlnode->url. Improper input validation or escaping could result in untrusted data being processed insecurely.

Affected version:
Latest GitHub clone of curl/curl.
Tested on: Kali Linux (VirtualBox)
Version command:

curl -v 

 Steps To Reproduce:
Clone the repository:

git clone https://github.com/curl/curl.git  
cd curl  

Search vulnerable code references:

grep -rn "glob_url" src/  
grep -rn "urlnode" src/  
grep -rn "strcpy" src/  

Try payloads in real requests using encoded XSS strings:

curl "http://test.com?param=%3Cscript%3Ealert(1)%3C/script%3E" -w "%{url_effective}"

Observe the failure behavior and how the payload is processed or rejected (301 redirect, malformed input, reflected parts, etc.).

Supporting Material/References:
Terminal output with code search and payload attempts:

glob_url() usage and unsafe patterns

Attempts to inject payloads with curl

Screenshots attached for reference

## Impact

Impact
If successfully exploited, this flaw could lead to XSS through insecure processing of user-controlled URLs.
An attacker could:

Steal session cookies or tokens

Redirect victims to malicious sites

Execute code in the browser context

Perform phishing or social engineering attacks

This issue becomes critical in contexts where curl is embedded in user-facing applications, CLI tools processing user input, or CI pipelines consuming untrusted URLs.

## Timeline

- **Report Filed**
- **2025-04-30** @dfandrich: It's not clear exactly what you're alleging is an issue with curl, but it appears that you're confusing the difference between HTTP client and HTTP server. curl lets you send whatever you want to the server; if the server returns code susceptible to  a XSS issue, that's not curl's fault. And if curl returns a string that can be used in a XSS attack, once again it's not a curl problem but rather a problem of whatever is consuming that data.
- **Report Not Applicable**
- **Agreed On Going Public**
- **Manually Disclosed**
