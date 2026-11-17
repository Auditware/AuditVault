---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/server-side-request-forgery-ssrf
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Server-Side Request Forgery (SSRF)"
enriched: true
date: 2019-12-12
submitted: 2019-04-17T09:18:36.964Z
bounty_usd: null
votes: 72
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "ajxchapman"
source: "https://hackerone.com/reports/541169"
title: "GitLab::UrlBlocker validation bypass leading to full Server Side Request Forgery"
---
# GitLab::UrlBlocker validation bypass leading to full Server Side Request Forgery

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 72 | **Program:** GitLab | **Disclosed:** 2019-12-12

- Report: [https://hackerone.com/reports/541169](https://hackerone.com/reports/541169)
- CWE: Server-Side Request Forgery (SSRF)
- Submitted: 2019-04-17T09:18:36.964Z

## Timeline

- **Report Filed**
- **2019-04-17** @gitlab-securitybot: Hi @ajxchapman,

Thank you for submitting this report. We will investigate the issue as soon as possible.
Due to our current workload, we will get back within 20 business days with an update.

Please refrain from submitting your report or inquiring about its status through
additional channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **Report Duplicate**
- **2019-04-18** @ajxchapman: Thanks for the quick response @dappelt. I've not observed any way of getting at the GCP metadata service on gitlab.com at this time, to my understanding that requires a specific HTTP header to be set as well. If I come across any way of accessing this I'll let you know.

Thanks
- **2019-04-18** @dappelt: The endpoint /v1beta1 does not require the GCP header, i.e. http://metadata.google.internal/computeMetadata/v1beta1

Happy hunting
- **Report Reopened**
- **Bounty Awarded**
- **Report Resolved**
- **2019-06-05** @ajxchapman: Hi Team,  thank you for the update and reconsideration of this issue.

My initial attempts to attempt to access the GCP endpoints failed, I'm really glad you were able to build on this and further secure the GitLab platform.

Cheers
- **Agreed On Going Public**
- **2019-12-12** @dappelt: Hi @ajxchapman - the attachments of your report might contain sensitive data. For example, the response from the metadata endpoint, IP addresses etc. Do you want to redact these or are you fine with disclosing the report as is?
- **2019-12-12** @ajxchapman: Hi @dappelt, thanks for checking. I have reviewed the report and attachments and am happy for them to be disclosed as is. Thanks!
- **Agreed On Going Public**
- **Report Became Public**
