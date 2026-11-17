---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
date: 2024-06-19
submitted: 2024-05-20T16:30:35.847Z
bounty_usd: null
votes: 104
cve: []
program: "[[programs/security|HackerOne]]"
reporter: "v0id1"
source: "https://hackerone.com/reports/2513082"
title: "Program Member Could Duplicate Report To A Non Related Program Original Report "
---
# Program Member Could Duplicate Report To A Non Related Program Original Report 

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 104 | **Program:** HackerOne | **Disclosed:** 2024-06-19

- Report: [https://hackerone.com/reports/2513082](https://hackerone.com/reports/2513082)
- CWE: Improper Access Control - Generic
- Submitted: 2024-05-20T16:30:35.847Z

## Timeline

- **Report Filed**
- **2024-05-20** @v0id1: Hello team, I just doing a test again and found that I also able to add original reporter to the report. For example you can check my report here #2305497. In that report I add @demo-hacker as `external user` even though I don't have access to do it. It just require me to change `add_reporter_to_original` from `false` to `true`
████████
{F3284827}

I also have another attack scenario that i would test but I think still need your confirmation to prevent me from accessing confidential information. 

So as `external-user` we would be able to access the report with default permission
{F3284830}
My attack scenario is since we able to set duplicate to any report that we have access to, including public report with limited disclosure (only showing summaries). I think it would be possible to duplicate a report and add the reporter (myself) to the report that was limited disclosure. I would have given `external-user` default permission to access the comment and report information that could leads to information disclosure and this could be used for any public/private disclosure.

Waiting to hear a good news !

Regards,
@v0id1
- **2024-05-20** @v0id1: Forget to mention, if the attack scenario has been tested and approved I think we also need to raise the severity :D
- **2024-05-27** @v0id1: Any updates?
- **2024-05-30** @v0id1: Sorry for pinging again, It' been 9 days since the initial report. Any update about this report?
- **Report Needs More Info**
- **Report New**
- **2024-06-03** @v0id1: Any updates @h1_analyst_dmitry ?
- **Report Pending Program Review**
- **2024-06-09** @v0id1: any updates ??
- **Report Triaged**
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Retesting**
- **2024-06-12** @zahra_h1: Hi @v0id1,

In the interest of transparency, we would like to add that there is a similar report (https://hackerone.com/reports/2516250) that described the same vulnerability as your finding. This report was submitted after yours, but due to a minor issue in our internal process, it was handled first until we resolved the report. However, since your report was technically submitted first, we believe it is only fair to treat your report the same way as the other one that has already been resolved. In an ideal situation, one report would have been closed as a duplicate of the other.

Thank you for your understanding.
- **2024-06-12** @v0id1: Hi @zahra_h1,

Thank you for your transparency and fairness in handling this situation. I appreciate you taking the time to explain the process and informing me of the other report. I understand that sometimes there can be minor issues in internal processes, and I am glad that you were able to resolve them quickly. I believe that this is the right way to handle these situations, and I appreciate your commitment to fairness and transparency

Regards,
@v0id1
- **User Completed Retest**
- **Report Retest Approved**
- **Report Resolved**
- **Agreed On Going Public**
- **2024-06-17** @z0x01: Hello @v0id1, 

Can I redact **all** images? If not can you let me know which contain sensitive information?
- **2024-06-18** @v0id1: Hello @z0x01,

I think we can redact the ██████ and █████████ from me and this █████████ was sent from h1 triager that contain some cookie and referer url, i think we need to redact it too

Thanks
- **Agreed On Going Public**
- **Report Became Public**
