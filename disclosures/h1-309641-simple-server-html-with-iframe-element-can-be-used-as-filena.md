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
date: 2018-03-01
submitted: 2018-01-26T21:38:57.170Z
bounty_usd: null
votes: 6
cve: "CVE-2018-3717"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "bl4de"
source: "https://hackerone.com/reports/309641"
title: "[simple-server] HTML with iframe element can be used as filename, which might lead to load and execute malicious JavaScript "
---
# [simple-server] HTML with iframe element can be used as filename, which might lead to load and execute malicious JavaScript 

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 6 | **Program:** Node.js third-party modules | **Disclosed:** 2018-03-01

- Report: [https://hackerone.com/reports/309641](https://hackerone.com/reports/309641)
- CWE: Cross-site Scripting (XSS) - Stored | CVE: CVE-2018-3717
- Submitted: 2018-01-26T21:38:57.170Z

## Timeline

- **Report Filed**
- **2018-01-29** @vdeturckheim: Hey @bl4de thanks you for this report! We will shortly look at it!
- **2018-01-30** @lirantal: Hi @bl4de,

Thanks for reporting this issue to us.

I was able to reproduce and confirm the issue as you described and will triage this report as vulnerability.
I will invite the package maintainer to this issue.
- **Report Triaged**
- **External User Joined**
- **2018-01-30** @balupton: Author here. This is a package for quick and dirty local dev from 2011 that has unsupported and outdated labels on its github page.
- **2018-01-30** @balupton: Argh. Seem people use it despite the above: https://github.com/balupton/simple-server/network/dependents

Will push up something better.
- **2018-01-30** @lirantal: Hey @balupton,

Happy you joined us, and appreciate the quick response! :-)
I already requested a CVE assigned so we'll also have that coming in soon.
- **2018-01-30** @balupton: Alright. New version released that just aliases `zeit/serve`. Hopefully the dependents will upgrade.
- **2018-01-30** @lirantal: This was swift, thanks @balupton!
@bl4de can you confirm?

@balupton are you ok with a full public disclosure for this report? we'll publicly disclose it within 45 days since it was triaged per the policy (https://github.com/nodejs/security-wg/blob/master/processes/third_party_vuln_process.md)
- **2018-01-30** @bl4de: Hi @lirantal , @balupton 

I can't reproduce this issue anymore, seems to be fixed :)

bl4de
- **2018-01-30** @balupton: > are you ok with a full public disclosure for this report? we'll publicly disclose it within 45 days since it was triaged per the policy (https://github.com/nodejs/security-wg/blob/master/processes/third_party_vuln_process.md)

Sure thing.
- **Cve Id Added**
- **Cve Id Added**
- **2018-01-30** @lirantal: Great. Thanks a lot to both of you working on this!
- **Cve Id Added**
- **Report Resolved**
- **Agreed On Going Public**
- **2018-01-30** @balupton: I've sent PRs to the most popular dependents to remove simple-server or swap it out for serve directly.

- https://github.com/noflo/noflo-ui/pull/846
- https://github.com/jonnor/projects/pull/2
- https://github.com/babakhani/pwt.datepicker/pull/206
- https://github.com/FabModules/fabmodules-html5/pull/32
- **2018-01-31** @lirantal: @balupton thanks for the pro-active attitude!
- **Report Became Public**
- **Changed Scope**
- **Report Severity Updated**
