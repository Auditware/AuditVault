---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
date: 2019-07-03
submitted: 2019-02-27T08:48:36.089Z
bounty_usd: null
votes: 351
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "yashrs"
source: "https://hackerone.com/reports/502593"
title: "Attacker is able to access commit title and team member comments which are supposed to be private"
---
# Attacker is able to access commit title and team member comments which are supposed to be private

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 351 | **Program:** GitLab | **Disclosed:** 2019-07-03

- Report: [https://hackerone.com/reports/502593](https://hackerone.com/reports/502593)
- CWE: Improper Access Control - Generic
- Submitted: 2019-02-27T08:48:36.089Z

## Timeline

- **Report Title Updated**
- **Report Filed**
- **2019-02-27** @gitlab-securitybot: Hi @yashrs,

Thank you for submitting this report. We will investigate the issue as soon as possible.
Due to our current workload, we will get back within 20 business days with an update.

Please refrain from submitting your report or inquiring about its status through
additional channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **Report Triaged**
- **2019-03-01** @yashrs: Thanks @asaba for triaging this. I wanted to follow-up on this with some more info. It also works on discussions and not only comments:
{F433247}

Also, the attacker@gmail.com is able to reply to that comment/discussion by sending a reply to the mail received. I think this further widens the impact:
███
{F433249}

Thanks,
Yash
- **2019-03-07** @gitlab-securitybot: ETA for fix:

Hi @yashrs,

The GitLab issue created from your report is currently scheduled for 2019-04-22.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2019-04-04** @gitlab-securitybot: ETA for fix:

Hi @yashrs,

The GitLab issue created from your report is currently scheduled for 2019-05-22.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2019-04-04** @yashrs: Hi team,

I am just curious as to why the issue is being prolonged for so long(I see now the date is 22nd May)? The fix is seems simple and easy and lies in just the permissions when the mail is triggered :)

Thanks,
Yash
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **2019-07-03** @yashrs: Hi @asaba @gitlab,

Can we please disclose this one?

Thanks,
Yash
- **2019-07-03** @asaba: Hello @yashrs,

Please confirm that the information in the screenshots is OK to release publicly. If any need to be redacted, I'll remove them from the linked GitLab issue before opening it up as well.

Regards,
- **2019-07-03** @yashrs: Hi @asaba,

Thanks for your reply! I saw all the screenshots and I don't see any of my sensitive info except in █████████. Removing that will be good!

Thanks,
Yash
- **Agreed On Going Public**
- **Report Became Public**
