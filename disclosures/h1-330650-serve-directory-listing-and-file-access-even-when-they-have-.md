---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/information-exposure-through-directory-listing
  - env/web
  - stack/node
substate: "resolved"
weakness: "Information Exposure Through Directory Listing"
enriched: true
date: 2018-05-31
submitted: 2018-03-28T06:51:07.059Z
bounty_usd: null
votes: 5
cve: "CVE-2018-3809"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "tungpun"
source: "https://hackerone.com/reports/330650"
title: "[serve] Directory listing and File access even when they have been set to be ignored"
---
# [serve] Directory listing and File access even when they have been set to be ignored

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 5 | **Program:** Node.js third-party modules | **Disclosed:** 2018-05-31

- Report: [https://hackerone.com/reports/330650](https://hackerone.com/reports/330650)
- CWE: Information Exposure Through Directory Listing | CVE: CVE-2018-3809
- Submitted: 2018-03-28T06:51:07.059Z

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **External User Joined**
- **2018-04-08** @lirantal: Hi @tungpun,

Thanks for reporting this issue.

I was able to reproduce and confirm the issue as you described and will triage this report as vulnerability.
I will invite the package maintainer to this issue.
- **Report Triaged**
- **2018-04-24** @lirantal: @notquiteleo can you help us with more information about the issue?
- **2018-05-11** @lirantal: Pinged Zeit on twitter too trying to reach out to them.
- **2018-05-20** @lirantal: @tungpun no response yet from the maintainers.
can you check if a recent version is fixed or still has this issue?
- **2018-05-21** @tungpun: I did a check on the latest version of **serve** (6.5.7), and saw that the issue still exists.
- **2018-05-21** @lirantal: Ok, I reached out once more. Hopefully we'll get someone to join soon.
- **2018-05-21** @tungpun: @lirantal Yes. Thanks for your help!
- **2018-05-27** @lirantal: @tungpun I received an update from the Zeit team that they are going to release a new serve version which will address this. Since this is a very high visibility module I wouldn't want to disclose without a patch or new version released.

There was a release 5 days ago, can you confirm if that includes the fix for this issue?
- **2018-05-28** @tungpun: @lirantal Thanks for your update. I updated to version `serve@6.5.8` and tried to reproduce the issue again and see that the proposed issue still exists.
- **2018-05-28** @lirantal: Alright. This is the same communication update that we have on https://hackerone.com/bugs?report_id=330724 so we're waiting on a new serve release this week and can re-test then.
- **2018-05-28** @notquiteleo: 7.0.0 and 7.0.1 are out!

https://github.com/zeit/serve
- **2018-05-29** @tungpun: It should be okay now. I can't reproduce the issue anymore.
- **2018-05-29** @lirantal: Great.

I'll release a full public disclosure by the weekend to give some time now for new clients to update to the newer version with the fix.
- **2018-05-29** @tungpun: @lirantal No problem. Thanks for your kind cooperation.
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
- **Report Severity Updated**
