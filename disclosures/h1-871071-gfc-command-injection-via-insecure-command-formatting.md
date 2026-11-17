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
date: 2020-10-27
submitted: 2020-05-11T20:02:14.558Z
bounty_usd: null
votes: 3
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "d3lla"
source: "https://hackerone.com/reports/871071"
title: "[gfc] Command Injection via insecure command formatting"
---
# [gfc] Command Injection via insecure command formatting

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 3 | **Program:** Node.js third-party modules | **Disclosed:** 2020-10-27

- Report: [https://hackerone.com/reports/871071](https://hackerone.com/reports/871071)
- CWE: Command Injection - Generic
- Submitted: 2020-05-11T20:02:14.558Z

## Timeline

- **Report Filed**
- **2020-05-11** @nochnoidozor: Hi @d3lla,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@nochnoidozor
- **Report Triaged**
- **2020-07-26** @bbe8482aecd24374d13c5de15a0a6: The maintainer answered me via email and wrote the following:

> Feel free to submit a patch.

Do you plan to submit a patch / PR for the repository of the package @d3lla?
- **2020-08-02** @d3lla: Hi @danielruf ,

at the moment I am quite busy, so unfortunately I will be not be able to submit a patch / PR within the next days.

Again, I am really sorry.

Thanks for your time and have a nice day,
d3lla
- **2020-08-02** @bbe8482aecd24374d13c5de15a0a6: Hi @d3lla,

no problem. Please let us know when there is an update or if we should try to invest some time to provide a patch.
- **2020-09-12** @bbe8482aecd24374d13c5de15a0a6: Hi @d3lla,

any updates from your side?
- **2020-09-13** @d3lla: Hi @danielruf,
thanks for the message.
Unfortunately, not. I didn't have so much time to look at it and provide a patch.
From my side, if you (or any other member of the team) want to provide a patch, it's totally fine.

Again, I am really sorry.
Thanks for your time and have a nice day,
d3lla
- **2020-09-26** @bbe8482aecd24374d13c5de15a0a6: I think we should disclose this. Personally I do not have the time to work on a patch. What do you think @d3lla?
- **2020-09-27** @d3lla: Hi @danielruf ,
if you all agree, from my side it is ok to disclose this report.
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
