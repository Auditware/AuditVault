---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/privilege-escalation
  - env/web
  - stack/node
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
date: 2018-08-15
submitted: 2018-07-25T20:41:49.826Z
bounty_usd: null
votes: 12
cve: "CVE-2018-3783"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "becojo"
source: "https://hackerone.com/reports/386807"
title: "[flintcms] Account takeover due to blind MongoDB injection in password reset"
---
# [flintcms] Account takeover due to blind MongoDB injection in password reset

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 12 | **Program:** Node.js third-party modules | **Disclosed:** 2018-08-15

- Report: [https://hackerone.com/reports/386807](https://hackerone.com/reports/386807)
- CWE: Privilege Escalation | CVE: CVE-2018-3783
- Submitted: 2018-07-25T20:41:49.826Z

## Timeline

- **Report Title Updated**
- **Report Filed**
- **2018-07-25** @api_xmgchqhv69rw1zem6733xop0tz: Hello,
Thanks for reporting this to us. Someone will quickly look at this report and triage it.
- **2018-07-27** @lirantal: Hi @becojo,

Thanks for your report!
I'll go ahead and invite the module author to join the discussion and evaluate the vulnerability with you.
- **Report Severity Updated**
- **Report Triaged**
- **2018-08-07** @becojo: Nevermind. I thought I found something easier to exploit the vulnerability but turns out you still need the original script.
- **2018-08-10** @lirantal: Due to inactivity from the maintainer I opened an issue in the repository: https://github.com/JasonEtco/flintcms/issues/77
- **External User Joined**
- **2018-08-10** @jasonetco: Hey folks - thanks for opening the issue @lirantal, I hadn't seen this before, and thhans for reporting @becojo! I'll go ahead and convert to string as you've suggested, and cut a new release immediately.
- **2018-08-10** @jasonetco: [Version 1.1.10 has been released](https://www.npmjs.com/package/flintcms/v/1.1.10) - I intentionally chose not to do this in a PR, but you can still [see the diff here](https://github.com/JasonEtco/flintcms/compare/49e4b6a49e8ba378313845162cd32ba06a2681d6...14dc0724a031f285e0cc057608937bfde8e39c90).
- **2018-08-11** @lirantal: @jasonetco great, thank you for the prompt reply!
@becojo can you verify the fix please?
- **2018-08-14** @becojo: Yes the fix works. Thank you @jasonetco
- **2018-08-15** @lirantal: Great work guys!
I'll go ahead and fully disclose this report, let me know if you prefer otherwise to avoid it.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Changed Scope**
