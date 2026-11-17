---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/classic-buffer-overflow
  - env/web
substate: "resolved"
weakness: "Classic Buffer Overflow"
enriched: true
date: 2020-11-09
submitted: 2019-03-04T12:21:44.897Z
bounty_usd: 1500
votes: 2
cve: "CVE-2019-9675"
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "jordyzomer"
source: "https://hackerone.com/reports/504761"
title: "phar_tar_writeheaders_int() buffer overflow"
---
# phar_tar_writeheaders_int() buffer overflow

> **Severity:** High | **Bounty:** 1,500 USD | **Votes:** 2 | **Program:** Internet Bug Bounty | **Disclosed:** 2020-11-09

- Report: [https://hackerone.com/reports/504761](https://hackerone.com/reports/504761)
- CWE: Classic Buffer Overflow | CVE: CVE-2019-9675
- Submitted: 2019-03-04T12:21:44.897Z

## Timeline

- **Report Filed**
- **2019-03-04** @jordyzomer: A CVE has been requested, will update ticket once it's available :)

Kind Regards,

Jordy
- **2019-03-06** @h1_analyst_leon: Hey @jordyzomer - Thanks for the submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.
- **2019-03-07** @jordyzomer: Thanks @tuxedo ! As you can see the patch has officially gone live today:

http://www.php.net/ChangeLog-7.php#7.1.27
http://www.php.net/ChangeLog-7.php#7.3.3

Best Regards,

Jordy
- **2019-03-11** @jordyzomer: The CVE has been assigned, the number CVE-2019-9675.
- **2019-03-26** @jordyzomer: Hey @tuxedo,

Are there any updates regarding this report? 

Kind Regards,

Jordy
- **2019-05-06** @jordyzomer: Hi @tuxedo , 

It's been over 2 months ago since your last response. Is there any status update or anything I can do to help?

Kind Regards,

Jordy
- **Report Severity Updated**
- **Report Triaged**
- **Cve Id Added**
- **2019-07-11** @jordyzomer: Hello @tuxedo are there any updates regarding this  ticket? Is any more info needed?

Kind Regards,

Jordy
- **2019-07-16** @h1_analyst_leon: Hi @jordyzomer - Unfortunately, I do not have any updates for you at this time, but you will be updated as soon as there is additional information to share. Thanks for your patience!
- **2019-09-25** @jordyzomer: @tuxedo I was wondering what we are depending on right now as the issue is fully resolved already, patches are live and CVE's are assigned. Could you enlighten me, it's been over 7 months now :)
- **Hacker Requested Mediation**
- **2019-12-23** @h1_analyst_leon: Hi @jordyzomer - The IBB programs are volunteer-run. Unfortunately, I do not have an update for you at this time, but you will be updated as soon as there is new information to share. Thanks for your patience!
- **2020-07-14** @jordyzomer: Any updates? :p
- **2020-07-14** @h1_analyst_leon: Hi @jordyzoomer - Thanks for your patience! Unfortunately, I do not have any updates for you at this time, but you will be updated as soon as there is additional information to share.
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **2020-10-10** @jordyzomer: Thank you a lot for the bounty!
- **Report Became Public**
