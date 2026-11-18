---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/web
  - vuln/authentication-bypass
  - fix/authentication-hardening
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
body: true
date: 2025-03-14
submitted: 2024-12-06T07:48:31.063Z
bounty_usd: null
votes: 207
cve: []
program: "[[programs/drugs_com|Drugs.com]]"
reporter: "d3do"
source: "https://hackerone.com/reports/2885636"
title: "2FA Bypass leads to  impersonation of legimate users"
---
# 2FA Bypass leads to  impersonation of legimate users

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 207 | **Program:** Drugs.com | **Disclosed:** 2025-03-14

- Report: [https://hackerone.com/reports/2885636](https://hackerone.com/reports/2885636)
- CWE: Improper Authentication - Generic
- Submitted: 2024-12-06T07:48:31.063Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Hello team,
I have discovered a logic flaw in the authentication system that allows an attacker (User A) to impersonate a legitimate user (User B) who has not yet registered. By abusing the email change functionality and bypassing 2FA, the attacker can retain access to the account until the legitimate user resets their password.

## Steps to re-produce
1. Go to https://www.drugs.com/account/register/ and create an account using an email you own.

██████

2. Complete OTP verification and select "Trust this device for 1 month". This gives you a valid session that does not require 2FA for one month.

3. Go to https://www.drugs.com/account/details/ and change the email to the victim's email (User B)
   - Now, the attacker has a valid session associated with User B's email for one month, bypassing 2FA.

███

4. Log out and log back in to confirm that the application doesn't prompt for OTP.

### To maintain this bypass indefinitely (until the original user resets the password):
1. Change the email back to the attacker's email.

2. Re-verify the new email by completing OTP verification and selecting "Trust this device for 1 month".
3. Change the email back to the victim's email (or any other arbitrary email).

By repeating this process, the attacker can retain access without triggering 2FA.
Note that the platform only notifying the attacker to activate the account , but not Terminating the session after the email has changed successfully 

## From victim POV
1. Go to Sign Up page 
2. try to Sign up with the victim's email
3. Note that  the platform says that email's already used (while the original Owner of the email didn't  create the account) 

███████

## Impact

## Summary:

1. ** Loss of Trust:** Users will lose confidence in the platform's security if they learn attackers had  impersonated them.

2. **Impersonation Risk:** Attackers can impersonate legitimate users and interact with the platform.

3. **Email Ownership Not Protected:** The platform fails to verify the original owner of the email, allowing attackers to use it.

## Timeline

- **Report Filed**
- **2024-12-08** @vsrana: Hi @dedoxd2 , Thanks for finding and reporting this issue to us. It's being reviewed by the team at the moment. 
We will respond back to you once it's verified.

Cheers
- **2024-12-18** @d3do: Hi @vsrana,
I noticed it has been a while since I reported the issue, and I wanted to check if you're facing any challenges in reviewing or confirming it.
Would a PoC video or any additional details help in speeding up the process? I'd be happy to provide further assistance.

Looking forward to your response!

Best regards,
@dedoxd2
- **2024-12-19** @vsrana: Hi @dedoxd2, A ticket has been assigned to the dev to look into it. We will reach back to you soon once the issue has been verified.

Thanks for the follow back.

Regards
- **2025-01-06** @vsrana: Hi @dedoxd2 , Thanks for reporting this issue once again. We have deployed the fix in the production. 

This issue will be marked resolved now.
- **Report Resolved**
- **2025-01-16** @d3do: happy to help ^^
- **2025-02-09** @d3do: Hi @vsrana ,

I have came across ` https://www.drugs.com/support/security-hall-of-fame.html` , and i'm asking if i will be added there 

and is there any bounty or  swag ?

best regards,
@dedoxd2
- **2025-02-09** @vsrana: Hi @dedoxd2 , Sorry we missed that. Would you like your real name or just your Hackerone username on the HoF?

Cheers
V.
- **2025-02-10** @d3do: Hi @vsrana ,

You can use `Abdullah Ahmed` for the HoF

Kind Regards,
@dedoxd2
- **Agreed On Going Public**
- **2025-02-12** @vsrana: @dedoxd2 , There you go mate - `https://www.drugs.com/support/security-hall-of-fame.html`

Cheers
V.
- **2025-02-13** @d3do: thanks @vsrana  <3 ,
can we remove the images and disclose the report ?
- **Report Became Public**
- **2025-03-14** @d3do: Hi @vsrana,
Can u remove the images from the report ? 
It's disclosing my emails, and there is a guy trying to create a h1 account with my email xD
- **2025-03-16** @redshiftone: A team member has permanently deleted all attachments from this report.
- **2025-03-16** @redshiftone: Hi @duk3_ , the attachments have been deleted from the report. Thank you again for your submission.
