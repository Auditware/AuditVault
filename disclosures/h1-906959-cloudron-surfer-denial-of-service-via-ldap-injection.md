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
submitted: 2020-06-24T17:12:07.769Z
bounty_usd: null
votes: 8
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "d3lla"
source: "https://hackerone.com/reports/906959"
title: "[cloudron-surfer] Denial of Service via LDAP Injection"
---
# [cloudron-surfer] Denial of Service via LDAP Injection

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 8 | **Program:** Node.js third-party modules | **Disclosed:** 2020-08-22

- Report: [https://hackerone.com/reports/906959](https://hackerone.com/reports/906959)
- CWE: LDAP Injection
- Submitted: 2020-06-24T17:12:07.769Z

## Timeline

- **Report Filed**
- **2020-06-27** @d3lla: Hi,
I hope everyone is staying safe :)

Is there any update?

Thank you for your patience and have a nice day,
d3lla
- **2020-07-10** @d3lla: Hi,
I hope everyone is staying safe :)

Is there any update?

Thank you for your patience and have a nice day,
d3lla
- **2020-08-02** @bbe8482aecd24374d13c5de15a0a6: Thanks for reporting this. I will do the next steps.
- **External User Joined**
- **2020-08-16** @nebulon: Hi, thanks for inviting me here. I also got the same issue with my meemo app so I will apply the same fix there.
- **2020-08-16** @nebulon: This has now been fixed with https://git.cloudron.io/cloudron/surfer/-/commit/060805d087712d5d7d82f0a0b948cbb2526ac907

It is the first time I am using hackerone, so I am not sure how to proceed further here.
- **2020-08-17** @bbe8482aecd24374d13c5de15a0a6: Thanks for providing a patch @nebulon.
@d3lla can you confirm that this resolves the issue?
- **2020-08-21** @d3lla: Hi @nebulon and @danielruf,

Sorry for my late reply.

@nebulon thanks for your prompt reply and for the fix.

Your changes seems to fix the problem.
I run the previous steps of the PoC and I was not able to reproduce the previous reported result.
I attached a PoC video.
{F958371}

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
