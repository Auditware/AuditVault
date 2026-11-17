---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
substate: "resolved"
weakness: "Path Traversal"
enriched: true
date: 2019-09-10
submitted: 2019-02-07T16:09:07.914Z
bounty_usd: 500
votes: 7
cve: "CVE-2019-5484"
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "skyn3t"
source: "https://hackerone.com/reports/492512"
title: "[bower] Arbitrary File Write through improper validation of symlinks while package extraction"
---
# [bower] Arbitrary File Write through improper validation of symlinks while package extraction

> **Severity:** High | **Bounty:** 500 USD | **Votes:** 7 | **Program:** Internet Bug Bounty | **Disclosed:** 2019-09-10

- Report: [https://hackerone.com/reports/492512](https://hackerone.com/reports/492512)
- CWE: Path Traversal | CVE: CVE-2019-5484
- Submitted: 2019-02-07T16:09:07.914Z

## Timeline

- **Report Filed**
- **2019-02-07** @skyn3t: Oh and worth mentioning #270072 served as a primary inspiration in finding this vulnerability.
- **2019-02-11** @h1_analyst_leon: Hey @skyn3t - Thanks for the submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.
- **2019-02-15** @skyn3t: Hi @tuxedo ,
Thanks for the response. Has the ibb team seen this report yet?
- **2019-04-01** @skyn3t: Hey there, was the ibb team able to take a look at this report?
- **Report Informative**
- **2019-04-16** @skyn3t: Hey @antenna - Thanks for your response. Curious to ask if this was IBB team's decision or is it your (h1 staff) analysis? Asking because ibb has previously rewarded similar vulnerability for rubygems BBP based on the severity of impact (report here #270072).
- **2019-04-16** @skyn3t: For the sake of argument though this wasn't a novel or new technique of exploitation, the span of impact (about 2 Million monthly downloads of the Bower package itself) cannot be overlooked.
- **2019-04-16** @antenna: Hi @skyn3t,

This was based off my analysis as a triager, not IBB. My initial assumption is that is does not classify as novel technique, due to it being a derivative of Zip-Slip vulnerabilities. Based on the previous report you provided, I'll send it to the IBB team for their evaluation.

Thanks,
@antenna
- **2019-04-16** @skyn3t: Hey @antenna,
That sounds fair. Thanks a lot for reconsidering.
Besides the policy states that - "vulnerabilities should meet **most** of the criterias" and not not all of them which led me to submit this report here.
Cheers
- **2019-04-17** @skyn3t: @antenna ,
Would you mind changing the report status back to open so it doesn't go unnoticed?
Thanks
- **Report Reopened**
- **Report Triaged**
- **2019-07-20** @skyn3t: Hi there, I was wondering there was an update on this
- **Report Needs More Info**
- **Report New**
- **2019-09-02** @skyn3t: @reed what next?
- **Report Needs More Info**
- **Report New**
- **Cve Id Added**
- **2019-09-10** @reed: This has been assigned CVE-2019-5484.
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
