---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/server-side-request-forgery-ssrf
  - env/web
  - stack/node
substate: "resolved"
weakness: "Server-Side Request Forgery (SSRF)"
enriched: true
date: 2020-03-02
submitted: 2020-01-31T16:31:11.869Z
bounty_usd: null
votes: 22
cve: "CVE-2020-8135"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "3sl4m-s4l3m"
source: "https://hackerone.com/reports/786956"
title: "Server Side Request Forgery in Uppy npm module"
---
# Server Side Request Forgery in Uppy npm module

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 22 | **Program:** Node.js third-party modules | **Disclosed:** 2020-03-02

- Report: [https://hackerone.com/reports/786956](https://hackerone.com/reports/786956)
- CWE: Server-Side Request Forgery (SSRF) | CVE: CVE-2020-8135
- Submitted: 2020-01-31T16:31:11.869Z

## Timeline

- **Report Filed**
- **2020-01-31** @nochnoidozor: Hi @eslam-shieldfy,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@nochnoidozor
- **Report Needs More Info**
- **Report New**
- **2020-02-05** @3sl4m-s4l3m: Any updates on the issue ?
- **2020-02-05** @nasr0x01: Thanks for the input @eslam-shieldfy, I am now taking a second look and will get back to you as soon as possible.

Regards,
@nasr0x01
- **Report Needs More Info**
- **Report New**
- **2020-02-10** @3sl4m-s4l3m: Any updates ??
- **Report Severity Updated**
- **Report Triaged**
- **2020-02-14** @3sl4m-s4l3m: Any updates ?
- **External User Joined**
- **2020-02-18** @ifedapoolarewaju: Hello, member of the Uppy team here,

Thank you for letting us know about this issue! I am currently investigating on my side and discussing with the team. I'll follow up with the next steps from our side asap.
- **External User Joined**
- **2020-02-19** @3sl4m-s4l3m: Thanks for the updates, Please keep me in the loop. 
If you want any help don't hesitate to ask.
- **2020-02-19** @marcinhoppe: @ifedapoolarewaju thanks for a quick update! Let us know if we can help in getting the fix tested. After the patch has been made available, we will coordinate responsible disclosure.
- **2020-02-19** @ifedapoolarewaju: @marcinhoppe @eslam-shieldfy Update: A PR has been submitted to mitigate this issue https://github.com/transloadit/uppy/pull/2083 .

It's still awaiting review from the Uppy team, but maybe you can also test from that branch already? This would mean copying the contents of this `src` directory https://github.com/transloadit/uppy/tree/validate-url/packages/%40uppy/companion/src into your `node_modules/@uppy/companion/lib/` and running the library as you were already doing.

PS: when `debug` is set to `true` from the options listed here https://hackerone.com/reports/786956#activity-6942808, Companion will assume the library is being run in a dev environment, hence it will allow download URLs like `http://localhost:3000` or `http://127.0.0.1:3000/file-name`
- **2020-02-20** @3sl4m-s4l3m: @ifedapoolarewaju I was about to point DNS pinning but @ Acconut already mention it on the PR.
I proposed a solution for it in the PR. 
Also I'm happy to help anytime here or on the PR.
- **2020-02-26** @marcinhoppe: @eslam-shieldfy the PR has been merged. Can you confirm that this vulnerability has been fixed?
- **2020-02-26** @ifedapoolarewaju: @marcinhoppe @eslam-shieldfy Also the patch has been released to npm https://github.com/transloadit/uppy/blob/a88d564962a44959236206e8ea689d8d91a05279/CHANGELOG.md#193
- **2020-02-27** @3sl4m-s4l3m: @ifedapoolarewaju
Great work, I can confirm that the vulnerability is not fixed.

@marcinhoppe 
lets coordinate the disclosure for the issue, release the advisory and requesting the CVE. 

Thanks
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
- **2020-03-02** @marcinhoppe: I requested a CVE.
- **2020-03-03** @3sl4m-s4l3m: Thanks @marcinhoppe
- **Changed Scope**
