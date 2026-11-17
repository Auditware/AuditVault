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
date: 2025-07-17
submitted: 2025-06-05T11:26:25.515Z
bounty_usd: null
votes: 232
cve: []
program: "[[programs/security|HackerOne]]"
reporter: "boy_child_"
source: "https://hackerone.com/reports/3178999"
title: "Account takeover of existing HackerOne accounts through SCIM provisioning"
---
# Account takeover of existing HackerOne accounts through SCIM provisioning

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 232 | **Program:** HackerOne | **Disclosed:** 2025-07-17

- Report: [https://hackerone.com/reports/3178999](https://hackerone.com/reports/3178999)
- CWE: Improper Access Control - Generic
- Submitted: 2025-06-05T11:26:25.515Z

## Timeline

- **Report Filed**
- **Report Vulnerability Information Updated**
- **2025-06-05** @h1_analyst_ace: Hello @boy_child_,

Thank you for your submission! 

Your report has passed the preliminary analyst review and is now being assessed in depth. Our team is working to validate and reproduce the issue, evaluating its accuracy and security impact. 

Please note that this does not confirm validation - the status may change after further review. 

We’ll keep you updated as the process moves forward. Have a great day!
Thanks,
@h1_analyst_jay
- **2025-06-05** @boy_child_: Hi,

I also found out that when I try to replicate this exploit in other bug bounty programs, it fails because the SCIM provisioning program requires both the username and email parameters in Okta to be from a verified domain within the organisation. 

It might be a misconfiguration on HackerOne that only verifies if the username is correct, but not the email address.

Regards,
@boy_child_
- **2025-06-10** @boy_child_: Greetings Hackerone Team,

Thank you for the recent update regarding my report, which has now passed the preliminary analyst review and is undergoing an in-depth assessment. I appreciate your team's efforts in validating and reproducing the issue, as well as evaluating its accuracy and security impact.

Could you please provide an update on the current status of the findings' validation? I'm keen to learn about any progress made since the last notification.

Thanks again for your time and continued review.

Kind regards,
@boy_child_
- **Report Severity Updated**
- **Report Pending Program Review**
- **Report Triaged**
- **Report Severity Updated**
- **Changed Scope**
- **Bounty Awarded**
- **2025-06-16** @boy_child_: Hi @hendrik_hv01h,

Thank you for the explanation of the CVSS 4.0 updated scoring. I also appreciate the bounty very much.

Kind regards,
@boy_child_
- **2025-06-16** @boy_child_: Greetings @hendrik_hv01h,

May I ask? In your reproduction, were you able to change the email of `demo-triager@hackerone.com` or `demo-member@hackerone.com`? Because I thought these default users are present in all sandbox programs, would that mean account takeover of any of those would give you access to other sandbox programs?

Could you please verify this on your end?

Thanks,
@boy_child_
- **2025-06-17** @hendrik_hv01h: Hey @boy_child_,

I didn't try taking over those accounts in our production environment - seemed too risky, and setting up a proper SSO implementation would've been quite a hassle.

Looking at the code though, I'm pretty sure your vulnerability would've worked. While you couldn't reset passwords for these SSO-enabled org accounts, changing the email to another SSO-controlled domain would make logging in through Okta pretty straightforward.

We went with high severity ratings on confidentiality and integrity since these accounts exist in many orgs with more than just read-only permissions.

Kind regards,
@hendrik_hv01h
- **Report Retesting**
- **User Completed Retest**
- **Report Retest Approved**
- **Report Resolved**
- **Agreed On Going Public**
- **2025-07-10** @boy_child_: Greetings Hackerone,

I received a notification that my report will be public soon so I formally request please redact the entire proof-of-concept video attached and all attached screenshots (in case one sliped through) since my testing emails are seen in plain view. 

Regards,
@boy_child_
- **2025-07-11** @h1_analyst_aaron: Hello @boy_child_,
I hope you are doing well.

Thank you for the information.
I've converted the video POC to internal only, could you please point out the exact sensitive information that you would like to redact ?

Thanks,
@h1_analyst_aaron
- **2025-07-11** @boy_child_: Hello @h1_analyst_aaron,

Thanks for redacting the video. That will be sufficient.

Thanks,
@boy_child_
- **Report Became Public**
- **Report Vulnerability Types Updated**
