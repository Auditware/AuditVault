---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/violation-of-secure-design-principles
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Violation of Secure Design Principles"
enriched: true
body: true
date: 2019-12-13
submitted: 2019-06-18T07:51:06.730Z
bounty_usd: null
votes: 55
cve: "CVE-2019-5486"
program: "[[programs/gitlab|GitLab]]"
reporter: "ngalog"
source: "https://hackerone.com/reports/617896"
title: "Bypass Email Verification using Salesforce -- Reproducible in gitlab.com"
---
# Bypass Email Verification using Salesforce -- Reproducible in gitlab.com

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 55 | **Program:** GitLab | **Disclosed:** 2019-12-13

- Report: [https://hackerone.com/reports/617896](https://hackerone.com/reports/617896)
- CWE: Violation of Secure Design Principles | CVE: CVE-2019-5486
- Submitted: 2019-06-18T07:51:06.730Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

### Summary
The salesforce login integration allows attacker to bypass email verification -- user is able to signup with any email domain they want, effectively bypass all email domain whitelist/blacklist restriction or any other 3rd party using gitlab instance's email address.

It is possible because salesforce allow admin to create user with arbitrary email, and I believe this is what gitlab engineer forgot to consider while implementing salesforce integration.

Please follow along to see how I was able to create an account `███████` in gitlab.com

### Steps to reproduce
- Visit https://bugcrowd-ngalog-3.oktapreview.com/
- Enter creds `██████████`:`██████████`
- Click salesforce to login salesforce
- Open new tab and visit https://gitlab.com/users/sign_in
- Click login with salesforce
- you will be logged in as `████` by visiting `https://gitlab.com/profile/emails`



### Impact
Bypass email domain restriction and able to signup with arbitrary email domain

### What is the current *bug* behavior?
Able to signup with any email domain

### What is the expected *correct* behavior?
should need email verification


### Relevant logs and/or screenshots
{F511255}

## Impact

described above

## Timeline

- **Report Filed**
- **2019-06-18** @gitlab-securitybot: Hi @ngalog,

Thank you for submitting this report. We will investigate the issue as soon as possible.
Due to our current workload, we will get back within 20 business days with an update.

Please refrain from submitting your report or inquiring about its status through
additional channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **Report Triaged**
- **2019-07-27** @gitlab-securitybot: ETA for fix:

Hi @ngalog,

The GitLab issue created from your report is currently scheduled for 2019-09-22.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2019-08-21** @ngalog: Hi @jmatos_bgtvf 

Could you please add @intidc to this report? Cause I think he has a much better exploit explanation then mine. And split the bounty 5050 please?

Thanks,
Ron
- **External User Joined**
- **2019-08-22** @jmatos_bgtvf: Hello @ngalog,

We have added @intidc to this report and you to https://hackerone.com/reports/678427. We are glad to share as requested the bounty 50/50.

Thank you to both of you for producing such quality reports for GitLab.

Best regards,
GitLab Security Team
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2020-05-12** @intidc: Dear team / @jmatos_bgtvf,

I was selected as a speaker for VirSecCon (https://virseccon.com/). A virtual conference with speakers and organisers from all major bug bounty platforms. In my 20-minute slot, I would love to discuss e-mail (address) security and give some practical examples of real-world bug bounty findings.

I would love to highlight this particular example, amongst others, in this short talk.

What I would like to disclose:
- The vulnerability itself  #678427 included (with screenshots)
- The company name as a reference

What I wouldn't disclose:
- The bounty paid
- Comments on the program, team or anything else. Just the vulnerability as an example, amongst other examples from major bug bounty programs, and nothing more than that.

The sole reason of giving these examples would be to make it more tangible for the audience and show that e-mail related bugs can be interesting to look for in bug bounty programs.

Would you agree with me disclosing the above information during this talk?

Thanks for your response!

Cheers,

Inti
- **2020-05-14** @jmatos_bgtvf: Hello @intidc,

Thank you for contacting us.
No problem because [transparency](https://about.gitlab.com/handbook/values/#transparency) is an important value at GitLab and Ron is now part of our appsec team. Anyhow https://gitlab.com/gitlab-org/gitlab/-/issues/31453 is public.

Best regards,
Security Team | GitLab Inc.
