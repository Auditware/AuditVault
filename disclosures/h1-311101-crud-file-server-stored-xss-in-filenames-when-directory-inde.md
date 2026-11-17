---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - stack/node
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
date: 2018-02-17
submitted: 2018-01-31T20:38:25.774Z
bounty_usd: null
votes: 4
cve: "CVE-2018-3726"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "bl4de"
source: "https://hackerone.com/reports/311101"
title: "[crud-file-server] Stored XSS in filenames when directory index is served by crud-file-server"
---
# [crud-file-server] Stored XSS in filenames when directory index is served by crud-file-server

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 4 | **Program:** Node.js third-party modules | **Disclosed:** 2018-02-17

- Report: [https://hackerone.com/reports/311101](https://hackerone.com/reports/311101)
- CWE: Cross-site Scripting (XSS) - Stored | CVE: CVE-2018-3726
- Submitted: 2018-01-31T20:38:25.774Z

## Timeline

- **Report Filed**
- **2018-01-31** @lirantal: Hi @bl4de 

Thanks a lot for reporting this to us.
A member of the team will look at your report and triage it shortly!
- **2018-02-02** @lirantal: Hi @bl4de,

Thanks for reporting this issue to us.

I was able to reproduce and confirm the issue as you described and will triage this report as vulnerability.
I will invite the package maintainer to this issue.
- **Report Triaged**
- **Report Severity Updated**
- **Changed Scope**
- **Cve Id Added**
- **2018-02-14** @lirantal: Since the author didn't join the report I opened a security issue in the repo.
- **External User Joined**
- **2018-02-15** @omphalos: @bl4de you mentioned there is another issue related to crud-file-server - I'm not sure how to find it on this site.  Can you point me to it please?
- **2018-02-15** @bl4de: @omphalos 

Sure, that's this report:

https://hackerone.com/reports/310690

But I believe to be able to see one, some of triage team has to invite you to join it (I can't do this as reporter).
- **2018-02-15** @omphalos: Thanks @bl4de!

@lirantal if there is a remaining issue with crud-file-server I will be happy to help with it.
- **2018-02-15** @lirantal: @omphalos thanks for jumping in!
I invited you to the other issue as well where you will collaborate on it with my colleague @vdeturckheim.
Goodluck and thank you for your pro-active attitude!

With regards to this issue, is there a fix added already that @bl4de can verify?
- **2018-02-16** @omphalos: @lirantal, @bl4de stated he verified the fix for this issue in the github thread.
- **2018-02-16** @bl4de: @lirantal - I can confirm issue is fixed and not reproducible anymore.

@omphalos - thanks for quick fixes, I am happy I was able to help :)
- **2018-02-16** @lirantal: Oh great, awesome work!

Are you guys ok if I go ahead and fully public disclose the report now?
- **2018-02-16** @bl4de: @lirantal Yep, I'm fine, as always :)
- **2018-02-16** @lirantal: @omphalos ?
- **2018-02-16** @omphalos: @lirantal yes that would be great, thank you.
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
