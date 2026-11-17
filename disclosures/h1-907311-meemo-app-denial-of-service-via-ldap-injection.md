---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/ldap-injection
  - env/web
  - stack/node
substate: "resolved"
weakness: "LDAP Injection"
enriched: true
date: 2020-08-22
submitted: 2020-06-24T22:00:27.123Z
bounty_usd: null
votes: 2
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "d3lla"
source: "https://hackerone.com/reports/907311"
title: "[meemo-app] Denial of Service via LDAP Injection"
---
# [meemo-app] Denial of Service via LDAP Injection

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 2 | **Program:** Node.js third-party modules | **Disclosed:** 2020-08-22

- Report: [https://hackerone.com/reports/907311](https://hackerone.com/reports/907311)
- CWE: LDAP Injection
- Submitted: 2020-06-24T22:00:27.123Z

## Timeline

- **Report Filed**
- **2020-06-27** @d3lla: Hi,
I hope everyone is staying safe :)

Is there any update?

Thank you for your patience and have a nice day,
d3lla
- **2020-08-02** @bbe8482aecd24374d13c5de15a0a6: Thanks for reporting this @d3lla. I will do the next steps today.
- **External User Joined**
- **2020-08-16** @nebulon: Thanks for reporting and inviting me here. I have fixed this now with https://github.com/nebulade/meemo/commit/be31ad3da7d4f8653d6813e84125bb4d25b5658b
- **2020-08-17** @bbe8482aecd24374d13c5de15a0a6: Thanks for providing a patch @nebulon.
@d3lla can you confirm that this resolves the issue?
- **2020-08-21** @d3lla: Hi @nebulon and @danielruf,

Sorry for my late reply.

@nebulon thanks for your prompt reply and for the fix.

Your changes seems to fix the problem.
I run the previous steps of the PoC and I was not able to reproduce the previous reported result.
I attached a PoC video.
{F958379}

Thank you for your time and have a nice day,
d3lla

I tested using the following configurations:
- OPERATING SYSTEM VERSION: Ubuntu 18.04.4 LTS
- NODEJS VERSION: v14.2.0
- NPM VERSION: 6.14.4
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
