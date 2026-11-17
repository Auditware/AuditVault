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
date: 2026-09-01
submitted: 2022-04-07T19:37:11.643Z
bounty_usd: null
votes: 66
cve: []
program: "[[programs/rockstargames|Rockstar Games]]"
reporter: "recon_ninja"
source: "https://hackerone.com/reports/1534465"
title: "Ticket Trick Attack allows access to ████████' workspaces"
---
# Ticket Trick Attack allows access to ████████' workspaces

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 66 | **Program:** Rockstar Games | **Disclosed:** 2026-09-01

- Report: [https://hackerone.com/reports/1534465](https://hackerone.com/reports/1534465)
- CWE: Improper Access Control - Generic
- Submitted: 2022-04-07T19:37:11.643Z

## Timeline

- **Report Filed**
- **2022-04-07** @recon_ninja: On subsequent logins  an "email verification code" is sent. Since I am logged into range from an incognito tab in my phone, I can't take screenshot. However if you login on ████████ as "████████", you will see I have set the name as  "H1-PoC Ticket Trick". I have also invited my h1 alias "████████" to the workspace.
Please let me know if you have any questions on impact. Please also refer to the original research on this vulnerability by ████████ at ████████
- **Report Needs More Info**
- **Report New**
- **2022-04-08** @jmarshall: Thank you ████████ , we appreciate the confirmation.

Is there any way you can provide either a screenshot, password, or login link for us to use as verification of your ownership of the ████████ account? We are going to share this information with our Support staff and it would be useful to have that as evidence of the problem. Thanks!

████████ Security
- **2022-04-08** @recon_ninja: Hi, please find the screenshot attached.
Thanks
- **2022-04-08** @jmarshall: Thank you ████████ ,

We are discussing this with the Support site team now, and will let you know as soon as we have any updates or information we can share.

████████ Security
- **Report Triaged**
- **Bounty Awarded**
- **2022-04-16** @recon_ninja: hi , thanks for the bounty. I have a concern: this is the base bounty for high severity . 
Thanks
- **Report Severity Updated**
- **2022-04-18** @jmarshall: Hi ████████ ,

We discussed this vulnerability with our Support staff team. They do not use the '████████' address as a credential for any service or application, so there is no risk of an attacker utilizing this vulnerability to hijack one of our legitimate accounts. The only type of attack possible here is for attackers to sign up new accounts on other services as "████████" and masquerade as us. We do acknowledge this could be somewhat damaging to our brand, so we settled on a Medium-High severity for this attack. I hope that clears up why we landed on this bounty range.

Currently we are discussing solutions to this problem. The most straightforward solution seems to be to require users to verify their accounts before they can access their Support Dashboard, so we are investigating that option now. Once we have pushed out a fix for this vulnerability, we will use the Request Retest feature to give you the opportunity to retest this for a $50 bonus.

Thank you for your continued patience while we work on this!

████████ Security
- **2022-04-19** @recon_ninja: hi ████████ , thanks for the additional information. Please check for  "domain based trust" too because that will allow "████████" to access a workspace of which it is not a member currently.
Thanks
- **2024-01-16** @recon_ninja: Hi ████████ , this issue looks fixed now. Please request a retest as discussed earlier.

Thanks
- **Report Retesting**
- **User Completed Retest**
- **Report Retest Approved**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
