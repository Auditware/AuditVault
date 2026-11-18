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
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

After numerous attempts and understanding, I was able to take over existing user accounts through SCIM provisioning.

When using SCIM provisioning, the following must be met:
* Verified domain.
* Working SSO configuration.

Initially, I thought this would automatically be a certain loophole. In my first attempt, this was the procedure used for testing:
1. Import organisation users into Okta.
2. Receive an error stating that existing users don't have matching email domains to the verified one on file.
3. Change the email.
4. Instead, a new user is created in the organisation's users page.

After many attempts, I figured out how to change the sequence to:
1. In Okta, create a user whose email I control, say `attacker@verifed.com`
2. Import organisation users into Okta.
3. Assign the victim account to the created user in step 1.
4. Change the email parameter field to `attacker@verified.com`
5. Change password.
6. Bingo!

I then thought this looked too easy, so I assigned the user access to Okta and tried to log in via SSO, but it failed and did not work. Why?

Two fields in Okta are of importance: `username` and `email`. 

{F4416609}

{F4416611}

* If the attacker with verified domain as `verified.com` adds a victim as `victim@ato.com` to Okta, you will get an error that `ato.com` does not match the H1 verified domain settings.
* If the attacker with a verified domain as `verified.com` adds a victim as `victim@ato.com` to Okta and then changes the username and email to `victim@verified.com`, it will instead create a new user in the H1 organisation.
* If the attacker with verified domain as `verified.com` adds a victim as `victim@ato.com` to Okta, with the username as `victim@ato.com`  and email field as `victim@verifed.com`, the victim's email will be changed, AND no notification will be sent to the victim (issue 2)
* Now the attacker wants to log in. If the attacker wants to do so via the SSO provider (Okta), they can't add the victim to the Okta directory since the username `victim@ato.com` has already been imported and is in use.

{F4416607}

* So the attacker sets a password reset, which also does not send a notification to the user! (issue 3) Rather, the new email is controlled by the attacker.


##Setup:
Before you proceed, have the following setup:
1. A sandbox program setup from [here](https://hackerone.com/teams/new/sandbox) and don't delete the demo members.
2. Contact HackerOne support to activate SSO and SCIM provisioning for your sandbox program.
3. [Set up SSO with Okta](https://docs.hackerone.com/en/articles/8490526-okta-sso-setup-via-saml)
4. [Set up SCIM in Okta](https://docs.hackerone.com/en/articles/9250705-scim-provisioning-for-okta)
5. Added users.

## Steps To Reproduce
1. Go to the Okta directory and add a user with an email you have access to.
2. Go to the Okta application configured for Hackerone SCIM provisioning and import users.
3. In your imported users, assign the user `demo-member@hackerone.com` ( or any other user if the demo member is deleted)
4. Under the Okta application configured for Hackerone SCIM provisioning, tap on the **Assignments** tab, then the pencil icon to edit.

{F4416681}

5. Look for the email field and change it to what you control and in line with your verified domain.

{F4416680}

6. Save.
7. It will automatically sync.
6. Reset the user password, and you should be in.

### Proof of concept:
███

## Impact

Why I think this is so critical is that apart from taking over user accounts, take note of EVERY new organisation,  sandbox alike, there are two users present by default:
 
* Demo Triager `demo-triager@hackerone.com`
* Demo Member `demo-member@hackerone.com`

The above are always present and already members of the sandbox, private, and public organisations unless removed. (I tested on an old sandbox I own, wish I didn't delete them.)

All the attacker has to do is import these default members, leave the username unchanged, change the email, password reset, and they are in!.

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
