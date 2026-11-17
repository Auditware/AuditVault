---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
date: 2021-07-12
submitted: 2021-02-14T17:05:15.425Z
bounty_usd: 3000
votes: 27
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "taraszelyk"
source: "https://hackerone.com/reports/1103258"
title: "Stored DOM XSS via Mermaid chart"
---
# Stored DOM XSS via Mermaid chart

> **Severity:** High | **Bounty:** 3,000 USD | **Votes:** 27 | **Program:** GitLab | **Disclosed:** 2021-07-12

- Report: [https://hackerone.com/reports/1103258](https://hackerone.com/reports/1103258)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2021-02-14T17:05:15.425Z

## Timeline

- **Report Filed**
- **2021-02-14** @gitlab-securitybot: Hi @taraszelyk,

Thank you for submitting this report! We will investigate the issue as soon as
possible, and should get back within a week.

Please do not submit your report or ask about its status through additional
channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **Report Needs More Info**
- **Report New**
- **Report Triaged**
- **Bounty Awarded**
- **2021-02-19** @gitlab-securitybot: ETA for fix:

Hi @taraszelyk,

The issue you reported is currently scheduled to be fixed by 2021-05-31.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2021-04-24** @taraszelyk: Hello @dcouture,
I can confirm that this issue was fixed by upgrading to Mermaid 8.9.2 which includes a patch for this vulnerability.  It is no longer reproducible on gitlab.com.
- **Report Resolved**
- **2021-04-28** @taraszelyk: Hello @dcouture,
Sorry, but I disagree with your decision that these two reports are duplicates. 
They are separate issues, though in one library. I've spent time to find both of them. And spent time to make them work in Gitlab environment. And yes, one "fix"(Mermaid upgrade) from your side was required to patch them. But it's only because I've disclosed two vulnerabilities at once to the maintainer of the library so he fixed them together. And even in the library, they were not patched by the same patch.

By your logic, I should have submitted one issue, wait till the patch, get bounty and then submit another to be sure that I will be rewarded for all work that was done. I don't want to do such things and I think that it's wrong, but I find it unfair to the researcher to say that they are duplicates and reward for only one issue. So, I believe, you should reconsider your decision.
- **2021-04-28** @dcouture: Hello @taraszelyk,

I understand your point of view and completely understand that this was two different issues in mermaid, but we are not the mermaid project. With that said I'll bring your comment back to the team and we'll discuss about how to handle such issues.

Thank you for your patience, I'll give you an update when we take a decision.
Dominic
GitLab Security Team
- **2021-04-28** @taraszelyk: Thank you in advance.
- **2021-04-30** @dcouture: Hello @taraszelyk,

I'm having trouble finding where the issues were fixed, I only see that one issue where the maintainer mentions both bugs. Do you happen to have a reference to the commits?

Thanks,
Dominic
GitLab Security Team
- **2021-04-30** @taraszelyk: Sure, here is the issue https://github.com/mermaid-js/mermaid/issues/1940 and commit with fixes https://github.com/mermaid-js/mermaid/commit/0f31471b2ee3c7451485953d549fca7e2df1fb01
- **Bounty Awarded**
- **2021-05-04** @taraszelyk: Thank you for your decision!
- **Report Severity Updated**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
