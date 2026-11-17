---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - stack/node
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
date: 2018-07-18
submitted: 2018-05-08T19:20:45.876Z
bounty_usd: null
votes: 7
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "misterch0c"
source: "https://hackerone.com/reports/349146"
title: "Stored XSS in Node-Red"
---
# Stored XSS in Node-Red

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 7 | **Program:** Node.js third-party modules | **Disclosed:** 2018-07-18

- Report: [https://hackerone.com/reports/349146](https://hackerone.com/reports/349146)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2018-05-08T19:20:45.876Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **External User Joined**
- **2018-05-11** @knolleary: Thanks for the issue report. I have just pushed a fix for this issue: https://github.com/node-red/node-red/commit/d49c7a3adb19b6f9a834135741572331702f23a8 - and also identified a couple of other places where a similar behaviour was exposed.

Whilst there, I have gone through and removed all unnecessary uses of jquery's `.html()` function where the safer `.text()` will do. Almost all of those were benign, but best to be sure.

The fix will be available in the next maintenance release.
- **2018-05-11** @misterch0c: That was fast @knolleary (:
Thank you
- **2018-05-11** @marcinhoppe: Thanks @knolleary! When do you expect to have the maintenance release?

@misterch0c @knolleary Do you both agree we can disclose this vulnerability right after the release with the fix is out?
- **2018-05-12** @knolleary: We'll do a release in the next week - we only just published one on Thursday. Happy for you to disclose we we've published.
- **2018-05-12** @misterch0c: Ok for me too. 

Cheers
- **2018-05-12** @marcinhoppe: Great! We will disclose this when the patch has been released.
- **2018-05-28** @marcinhoppe: @knolleary Can you confirm that 0.18.7 contains fixes the issues mentioned in this report?
- **2018-05-31** @knolleary: Apologies for the delay in responding - the 0.18.6 release, published on May 18th, addressed this issue.
- **2018-07-04** @marcinhoppe: @knolleary @misterch0c Thanks! Do you both agree we are good to disclose this vulnerability now?
- **2018-07-06** @misterch0c: Yes
- **2018-07-18** @marcinhoppe: @misterch0c Thanks! I will proceed with the disclosure now.
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
- **Changed Scope**
