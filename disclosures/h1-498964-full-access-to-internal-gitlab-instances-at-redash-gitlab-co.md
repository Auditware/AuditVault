---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/incorrect-authorization
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Incorrect Authorization"
enriched: true
body: true
date: 2019-04-19
submitted: 2019-02-21T00:34:23.084Z
bounty_usd: null
votes: 306
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "rijalrojan"
source: "https://hackerone.com/reports/498964"
title: "Full access to internal Gitlab instances at redash.gitlab.com, dashboards.gitlab.com, prometheus.gitlab.com"
---
# Full access to internal Gitlab instances at redash.gitlab.com, dashboards.gitlab.com, prometheus.gitlab.com

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 306 | **Program:** GitLab | **Disclosed:** 2019-04-19

- Report: [https://hackerone.com/reports/498964](https://hackerone.com/reports/498964)
- CWE: Incorrect Authorization
- Submitted: 2019-02-21T00:34:23.084Z

## Report summary

Read about the test here: https://sites.google.com/securifyinc.com/secblogs/scary-tickets

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
Lack of proper ticket trick security leads to internal access on Gitlab instances. **I did not use support.gitlab.com instead just using support@gitlab.com email was suffice. 

**Description:**

*Getting a support@gitlab.com Google Account*

After the Ticket Trick attack that Inti reported and disclosed, many companies including Gitlab added proper security measures to prevent this kind of attack. What companies did not realize is that Zendesk has a feature that can be exploited by attackers other than the CC feature. 

In this case, Gitlab has blocked sending emails to support+*@gitlab.com which prevents Ticket Trick that Inti came up with. However, the CC feature along with the Zendesk's feature can lead to further exploitation. 

To begin with, I sent an email to support@gitlab.com. After this, an automated reply was sent by Gitlab with confirmation that my ticket went through. Next, I went to accounts.google.com and registered support@gitlab.com. For the firstname and last name I copied a special hash for the ticket. Zendesk as a feature has a special hash for each ticket that is generated in the system This hash is like the key in a dictionary and can be used to add more content to the ticket. So by getting that hash and sending the request, Google allegedly sends an email to verify.

What happened here was due to Zendesk's own security measures, the first email from Google will be set as private because they are not CCed to my ticket. So then, I replied to the support ticket from Gitlab and in CC put noreply@google.com. Once this was done, I replayed the request in Google and again tried to verify `support@gitlab.com` this time the ticket had the verification code public. 

{F427388}

If you check the image on the top right corner you can see the hash repeated twice because I put that as a first and last name. 

Once this was done, I had a verified support@gitlab.com email. 

{F427390}

Next, I went to crt.sh to search for gitlab.com domains and found 3 domains that stood out: 

* prometheus.gitlab.com
{F427391}

* redash.gitlab.com 
{F427393}

* dashboards.gitlab.com
{F427395}

## Impact

Getting access to internal applications.

## Timeline

- **Report Filed**
- **Report Collaborator Invited**
- **Report Collaborator Joined**
- **2019-02-21** @gitlab-securitybot: Hi @rijalrojan,

Thank you for submitting this report. We will investigate the issue as soon as possible.
Due to our current workload, we will get back within 20 business days with an update.

Please refrain from submitting your report or inquiring about its status through
additional channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **2019-02-21** @rijalrojan: alerts.gitlab.com is also possible btw.
- **2019-02-21** @rijalrojan: Because I don't know all the internal domains or websites used by Gitlab, feel free to use the account I got to check what privileges I have. For example, I think gitlab.net and gitlap.com might also be some areas where this email might work: 

```
support@gitlab.com
██████
```

Use the creds on accounts.google.com to login.
- **Report Triaged**
- **Report Vulnerability Types Updated**
- **2019-02-21** @rijalrojan: Cool, thanks for the triage @asaba
- **2019-02-28** @rijalrojan: Hi @asaba,
Curious if you guys had any update in regards to this report :) 

Also please let me know if you have **any** questions. I am here to help and will try my best to help. 
Cheers,
@rijalrojan
- **2019-03-04** @dappelt: Hi @rijalrojan,

we changed the configuration of our ZenDesk so that only agents can add CCs. We believe this fixes the vulnerability you reported. Please let us know if you think the vulnerability is not yet fixed.

We also took control over the account that you created. Thank you for sharing the credentials.

I will come back to you soon with a bounty decision.

Best regards,
Dennis
- **2019-03-04** @rijalrojan: Hi @dappelt,
Yup that fixes it :) 
Cheers,
@rijalrojan
- **Bounty Awarded**
- **Bounty Awarded**
- **Report Resolved**
- **2019-03-06** @rijalrojan: @dappelt,
Can we disclose this after **40-50 days**? This is a research paper that will be completed on mid-April and I don't want disclosure of any research details before that.
- **2019-03-06** @dappelt: Hi @rijalrojan,

absolutely, we can synchronize publishing your report and our internal discussion of it with the publication of your research paper. Please let us know once you are ready.

Best regards,
Dennis
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2019-04-19** @rijalrojan: @dappelt,
We presented the research at our class recently. Here is a technical blog on it: https://sites.google.com/securifyinc.com/secblogs/scary-tickets
