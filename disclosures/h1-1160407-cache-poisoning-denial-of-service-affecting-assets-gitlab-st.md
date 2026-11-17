---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/uncontrolled-resource-consumption
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
date: 2021-12-22
submitted: 2021-04-10T19:53:30.325Z
bounty_usd: null
votes: 83
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "youstin"
source: "https://hackerone.com/reports/1160407"
title: "Cache poisoning Denial of Service affecting assets.gitlab-static.net"
---
# Cache poisoning Denial of Service affecting assets.gitlab-static.net

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 83 | **Program:** GitLab | **Disclosed:** 2021-12-22

- Report: [https://hackerone.com/reports/1160407](https://hackerone.com/reports/1160407)
- CWE: Uncontrolled Resource Consumption
- Submitted: 2021-04-10T19:53:30.325Z

## Report summary

For more details about the vulnerability, check out:
https://youst.in/posts/cache-poisoning-at-scale/

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Report New**
- **2021-04-15** @youstin: I'd also like to mention that this also affects about.gitlab.com. Since the website is hosted on GCP itself, there is no need to take down js files, you can just take down `/`. While the specific subdomain is out of scope, Gitlab should also fix this one.
- **2021-04-17** @h1_analyst_jack: Hello @youstin I hope all is well and thank you for your message. I am checking with the GitLab team about some doubt that I have and I will be sure to try to give you an update when I have some news from the GitLab team. Till then, please remain patient.

Thanks and regards,
@golden__retriever
- **Report Vulnerability Types Updated**
- **Report Triaged**
- **Bounty Awarded**
- **2021-05-19** @gitlab-securitybot: ETA for fix:

Hi @youstin,

The issue you reported is currently scheduled to be fixed by 2021-07-31.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **Bounty Awarded**
- **2021-10-25** @dcouture: Just leaving a note here to mention that the impact to gitlab.com fixed on June 10th but this remains open because it's still possible to exploit it on about.gitlab.com and that's why the issue is still opened.
- **2021-10-27** @gitlab-securitybot: ETA for fix:

Hi @youstin,

The issue you reported is currently scheduled to be fixed by 2021-10-31.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **External User Joined**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
