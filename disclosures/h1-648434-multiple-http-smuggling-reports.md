---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/http-request-smuggling
  - env/web
substate: "resolved"
weakness: "HTTP Request Smuggling"
enriched: true
date: 2019-11-12
submitted: 2019-07-17T22:47:10.824Z
bounty_usd: null
votes: 20
cve: "CVE-2017-7658", "CVE-2018-8004", "CVE-2017-7656", "CVE-2017-7657", "CVE-2016-8743", "CVE-2015-3183", "CVE-2016-10711", "CVE-2016-2086", "CVE-2016-2216", "CVE-2016-6816", "CVE-2015-8852", "CVE-2015-5739", "CVE-2015-5740"
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "regilero"
source: "https://hackerone.com/reports/648434"
title: "Multiple HTTP Smuggling reports"
---
# Multiple HTTP Smuggling reports

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 20 | **Program:** Internet Bug Bounty | **Disclosed:** 2019-11-12

- Report: [https://hackerone.com/reports/648434](https://hackerone.com/reports/648434)
- CWE: HTTP Request Smuggling | CVE: CVE-2017-7658, CVE-2018-8004, CVE-2017-7656, CVE-2017-7657, CVE-2016-8743, CVE-2015-3183, CVE-2016-10711, CVE-2016-2086, CVE-2016-2216, CVE-2016-6816, CVE-2015-8852, CVE-2015-5739, CVE-2015-5740
- Submitted: 2019-07-17T22:47:10.824Z

## Timeline

- **Report Filed**
- **2019-07-18** @h1_analyst_leon: Hey @regilero - Thanks for the submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.
- **2019-08-08** @regilero: A few news:

* I havecurrently some activity on Squid on this subject. Soon to be released I hope.
* there is a big Defcon+Blackhat conference on HTTP Smuggling by James Kettle, with a new report "HTTP Desync Attacks: Request Smuggling Reborn" https://portswigger.net/blog/http-desync-attacks-request-smuggling-reborn
- **Cve Id Added**
- **Report Severity Updated**
- **Report Triaged**
- **2019-08-27** @antenna: Hello @regilero,

Thank you for your submission! We were able to validate your report, and have submitted it to the appropriate remediation team for review. They will let us know the final ruling on this report, and when/if a fix will be implemented. Please note that the status and severity are subject to change.

Regards,
@antenna
- **2019-08-27** @reed: Part of the IBB's charter (https://internetbugbounty.org/charter.html) includes "Mind the Gap":

> In order to most efficiently allocate funds, the Panel should be cognizant of what software is already covered by other efforts, and how. For example, if another organization rewards for providing patches to open source projects or funds secure development, the IBB should not duplicate this effort, but instead serve in a complementary fashion by rewarding researchers that identify and disclose vulnerabilities to the maintainers. The IBB should proactively identify software that has a gap in rewards for vulnerability research; in conjunction with other criteria, this is a good indicator that the software should be moved into scope.

As this bug was bountied via various companies, our Mind the Gap stipulation may cause this to not be awarded.

We'll be back in touch once we discuss this among the panel.
- **2019-09-03** @regilero: I had some bounties, on seome of the issues, that's right. But the main part of my work on this subject was mostly trying to convince Open Source project to fix the issues even if the consequences are not directly tied to their project. This field problematic is that real problems occurs when different actors react in different ways on the same messages list. And this is usually not a security problem in a mono-project point of view. That's more a systemic security problem.
So I have the hope that a project looking at the "big picture" can see how fixing details in various projects and even just making developers aware of interactions consequences has some value for the ecosystem.
- **Not Eligible For Bounty**
- **Report Resolved**
- **Agreed On Going Public**
- **2019-10-14** @regilero: References to Squid should stay hidden for now. Or hide the comment from Aug 8th.
- **Report Became Public**
