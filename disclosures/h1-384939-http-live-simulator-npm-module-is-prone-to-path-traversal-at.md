---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
  - stack/node
substate: "resolved"
weakness: "Path Traversal"
enriched: true
date: 2018-09-18
submitted: 2018-07-21T12:34:12.401Z
bounty_usd: null
votes: 5
cve: "CVE-2019-5423"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "lirantal"
source: "https://hackerone.com/reports/384939"
title: "http-live-simulator npm module is prone to path traversal attacks"
---
# http-live-simulator npm module is prone to path traversal attacks

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 5 | **Program:** Node.js third-party modules | **Disclosed:** 2018-09-18

- Report: [https://hackerone.com/reports/384939](https://hackerone.com/reports/384939)
- CWE: Path Traversal | CVE: CVE-2019-5423
- Submitted: 2018-07-21T12:34:12.401Z

## Timeline

- **Report Filed**
- **2018-07-21** @api_xmgchqhv69rw1zem6733xop0tz: Hello,
Thanks for reporting this to us. Someone will quickly look at this report and triage it.
- **2018-07-25** @marcinhoppe: Hi @lirantal 

I was able to reproduce and confirm the issue as you described and will triage this report as vulnerability. I will reach out to the package maintainer to join.
- **Report Triaged**
- **External User Joined**
- **2018-07-25** @prahladyeri: @marcinhoppe As discussed, if you can send me a CR on github, I can merge it and release the updated version on npm. Please let me know how to proceed.
- **2018-07-25** @marcinhoppe: @prahladyeri We usually ask maintainers to fix those vulnerabilities and the Security WG coordinates the responsible disclosure once the fix is available on NPM. Will you be able to provide a fix?
- **2018-07-25** @prahladyeri: Yep, I can do that. I'll update here once its done so that you can test and confirm.
- **2018-07-25** @prahladyeri: Hi, I've just published the latest version 1.0.6 that takes care of this. I've fixed this by replacing any reference to back folders by a "" (blank), so it returns 404 error in your case:

`pathname = pathname.replace("/../",""); //fix for path traversal bug`

[github link to commit #8e85a1be562248d0d616c0e5092a3d71bbf5fe5f](https://github.com/prahladyeri/http-live-simulator/commit/8e85a1be562248d0d616c0e5092a3d71bbf5fe5f)

Please test and let me know. Thanks again for your contribution to http-live-simulator.
- **2018-07-26** @marcinhoppe: @prahladyeri Thanks, I can no longer reproduce the issue.

@lirantal Can you verify the fix so that we could proceed with disclosure?
- **2018-07-27** @lirantal: Confirming that I can't reproduce anymore.
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
- **Changed Scope**
