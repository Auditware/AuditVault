---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/http-request-smuggling
  - env/web
  - stack/node
substate: "resolved"
weakness: "HTTP Request Smuggling"
enriched: true
date: 2020-10-17
submitted: 2020-07-13T14:57:33.146Z
bounty_usd: null
votes: 134
cve: "CVE-2020-8201"
program: "[[programs/nodejs|Node.js]]"
reporter: "amitklein"
source: "https://hackerone.com/reports/922597"
title: "HTTP Request Smuggling due to CR-to-Hyphen conversion"
---
# HTTP Request Smuggling due to CR-to-Hyphen conversion

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 134 | **Program:** Node.js | **Disclosed:** 2020-10-17

- Report: [https://hackerone.com/reports/922597](https://hackerone.com/reports/922597)
- CWE: HTTP Request Smuggling | CVE: CVE-2020-8201
- Submitted: 2020-07-13T14:57:33.146Z

## Timeline

- **Report Filed**
- **2020-07-13** @indutny: Thank you for reporting this. Could you please attach a sample code that reproduces the issue?

To the best of my knowledge Node.js doesn't convert CR to hyphens and would treat this header as it is `Content\rLength` (and not as `Content-Length`), which is compliant to specification. When there is no `Content-Length` header on GET requests - an HTTP server must assume that the request has no body and just start parsing the next request as soon as possible. This behavior is dictated by specification too.
- **2020-07-13** @amitklein: Hi
everything you said is correct in theory. But if you run the above stream through node.js (I have 13.12.0) you will (I believe) observe the described (non-RFC) behavior. I attach a Perl script that demonstrates the issue.
- **2020-07-13** @amitklein: Wrong version. Please use this one.
- **2020-07-13** @indutny: Thank you for the test case. I confirm that there is an issue indeed.

Will post an update here once I'll get it fixed.
- **2020-07-13** @indutny: Just a quick update: we have a tentative fix for the issue. Will let you know once it will get reviewed.
- **2020-07-15** @indutny: The patch was reviewed and we are in the process of scheduling the release.
- **2020-07-20** @amitklein: Any update on when this patch will be released?
- **2020-07-20** @indutny: We are still in the process of scheduling the release. Please stay tuned. I'll send you the estimates as soon as possible.

Thank you for your patience!
- **Report Severity Updated**
- **Report Triaged**
- **2020-08-05** @amitklein: Any update on the fix?
- **2020-08-06** @mcollina: We are currently preparing the security release, currently working on another fix that will be part of the same release.
- **2020-09-07** @amitklein: Hi

Can you please update me on the progress of the security release?

Thanks,
-Amit
- **2020-09-08** @mhdawson: @amitklein would you like attribution when this goes out in a security release and if so could you provide what you'd like in terms of

Thank you to X who works at Y for reporting this vulnerability.
- **2020-09-08** @amitklein: Sure. 
X = Amit Klein
Y = Safebreach

Thanks!
- **2020-09-17** @mhdawson: Resolved in September security releases, https://nodejs.org/en/blog/vulnerability/september-2020-security-releases/
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
- **Bounty Awarded**
