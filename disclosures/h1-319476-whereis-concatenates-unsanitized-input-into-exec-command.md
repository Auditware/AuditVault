---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/command-injection-generic
  - env/web
  - stack/node
substate: "resolved"
weakness: "Command Injection - Generic"
enriched: true
date: 2018-03-28
submitted: 2018-02-25T06:53:14.046Z
bounty_usd: null
votes: 9
cve: "CVE-2018-3772"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "chalker"
source: "https://hackerone.com/reports/319476"
title: "`whereis` concatenates unsanitized input into exec() command"
---
# `whereis` concatenates unsanitized input into exec() command

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 9 | **Program:** Node.js third-party modules | **Disclosed:** 2018-03-28

- Report: [https://hackerone.com/reports/319476](https://hackerone.com/reports/319476)
- CWE: Command Injection - Generic | CVE: CVE-2018-3772
- Submitted: 2018-02-25T06:53:14.046Z

## Timeline

- **Report Filed**
- **2018-03-10** @lirantal: Hi @chalker,

Thanks for reporting this issue.

I was able to reproduce and confirm the issue as you described and will triage this report as vulnerability.
I will invite the package maintainer to this issue.
- **Report Severity Updated**
- **Report Triaged**
- **External User Joined**
- **2018-03-11** @vvo: Hey hi, I am fine fixing anything or giving you access to this module I created four years ago and never touched again since then.

Just let me know what's the proper way to fix this.

Also I guess nowadays we could just deprecate the module for `which`: https://github.com/npm/node-which from isaacs, wdyt?
- **2018-03-11** @chalker: @vvo, I propose:
1. Release a new patch version whereis@0.4.1, using use any other method than `child_process.exec()` — i.e. anything that accepts an *array* of arguments. Alternatively, proper escaping can also help, but I suggest passing in array of args. Older branches look not used in the wild, so just ignore them.
2. Release whereis@0.5.0 which is a wrapper to `which` (if the functionality is equivalent) and deprecate all versions of `whereis`, promoting migration to `which` in the deprecation message
3. After this issue is dislosed — deprecate whereis <= 0.4.0 with a security issue in the deprecation message.

This should solve both issues (security and unsupported).
- **2018-03-26** @vvo: Just done all of that, thanks
- **2018-03-26** @chalker: @vvo Thanks!
@lirantal Looks fixed and partially disclosed to me, could we disclose?
- **2018-03-26** @lirantal: @vvo are you ok with us doing a full public disclosure of the report?
@chalker also waiting on a CVE assigned
- **Report Resolved**
- **Changed Scope**
- **Agreed On Going Public**
- **2018-03-27** @vvo: Completely fine that we disclose this. Bravo for the process which is super smooth :)
- **2018-03-28** @lirantal: Thanks for the kind words :-)
Will proceed with a public disclosure then.
- **Manually Disclosed**
