---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/insecure-storage-of-sensitive-information
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Insecure Storage of Sensitive Information"
enriched: true
date: 2022-07-11
submitted: 2020-09-11T13:48:44.894Z
bounty_usd: null
votes: 103
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "sateeshn"
source: "https://hackerone.com/reports/979787"
title: "Able to view hackerone reports attachments"
---
# Able to view hackerone reports attachments

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 103 | **Program:** GitLab | **Disclosed:** 2022-07-11

- Report: [https://hackerone.com/reports/979787](https://hackerone.com/reports/979787)
- CWE: Insecure Storage of Sensitive Information
- Submitted: 2020-09-11T13:48:44.894Z

## Report summary

The reporter found a way to get access to all attachments imported from HackerOne reports with our automation. This included proofs of concept for unpatched vulnerabilities and was rewarded as a critical severity finding given the possibility of leaking unpatched critical severity vulnerabilities.

Note that it is intended that https://gitlab.com/gitlab-org/gitlab/-/issues?label_name%5B%5D=HackerOne still shows many fixed vulnerabilities as well as unfixed issues that were deemed low severity enough to be made public. You can learn more about this in the `Disclosure` section of our bug bounty program's policy.

## Timeline

- **2020-09-11** @sateeshn: Hi,

I also found that some gitlab related open reports can be accessed from the gitlab issues section.

For ex: try accessing below url's
https://hackerone.com/reports/952786  (access denied)
https://gitlab.com/gitlab-org/gitlab/-/issues/239343 (you will able to view report details like reporter name, attachments, conversations etc.)


You can also view all issues related to hackerone by label:
https://gitlab.com/gitlab-org/gitlab/-/issues?label_name%5B%5D=HackerOne

These issues should be confidential and should not be accessible by public.
- **Report Filed**
- **2020-09-11** @gitlab-securitybot: Hi @sateeshn,

Thank you for submitting this report! We will investigate the issue as soon as
possible, and should get back within a week.

Please do not submit your report or ask about its status through additional
channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **Report Triaged**
- **Bounty Awarded**
- **2020-09-12** @sateeshn: Hi,

Thanks for triage.

Until the fix, if possible can you make the below listed report and other related reports private or hide the comment which have link to the internal issue tracking system (i.e https://gitlab.com/gitlab-org/gitlab-ce/issues/XXXXX). 

Because usually lot of people read the public reports and there is a high chance they to able to find private issues like i found in this report. 
 
https://hackerone.com/reports/446238
- **Report Severity Updated**
- **2020-09-14** @sateeshn: @dcouture any updates on this?
- **2020-09-14** @dcouture: Hi @sateeshn,

> I also found that some gitlab related open reports can be accessed from the gitlab issues section.

This is intended and explained in our program policy:

> All Resolved reports will be made public via issues on GitLab.com 30 days after releasing a fix. We will redact all information we consider sensitive (such as cookies or tokens), but do not hesitate to let us know if additional content should be hidden. If you also want the report to be disclosed via HackerOne, please request disclosure.

Public listing of the storage bucket wasn't intended however and this is why we triaged this report. We will update you when the report is ready to be resolved and awarded a bounty.

Best regards,
Dominic
GitLab Security Team
- **2020-09-14** @sateeshn: @dcouture thanks for the updates.
- **2020-09-16** @dcouture: Hi @sateeshn,

Just to keep you updated we have quickly patched the immediate security flaw you reported, however we're still doing some work on a better "long term" fix. We will resolve the issue once that is deployed.

Best regards,
Dominic
GitLab Security Team
- **2020-09-18** @sateeshn: @dcouture Thanks for the information.
- **2020-09-27** @sateeshn: Hi @dcouture,

Any updates?
- **2020-09-27** @dcouture: Hi @sateeshn,

No updates. We will let you know where there are any, you will get the rest of the bounty payment as per policy:

> For reports with critical or high severity we pay $1000 at the time the report is triaged, and for medium severity reports we pay $500. The remainder, if any, will be paid when the report is resolved or 45 days after triage, whichever happens earlier.

Best regards,
Dominic
GitLab Security Team
- **2020-09-28** @sateeshn: Thanks! @dcouture
- **Report Resolved**
- **Bounty Awarded**
- **2020-10-14** @sateeshn: Hi @dcouture,

It is Fixed. Thanks for the bounty!
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
