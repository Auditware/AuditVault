---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/privilege-escalation
  - env/web
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
body: true
date: 2022-12-17
submitted: 2022-07-14T08:35:48.817Z
bounty_usd: null
votes: 42
cve: []
program: "[[programs/khanacademy|Khan Academy]]"
reporter: "shuvam321"
source: "https://hackerone.com/reports/1636552"
title: "Email Verification Bypass Allows Users to Add & verify Any Email  As Guardians Email "
---
# Email Verification Bypass Allows Users to Add & verify Any Email  As Guardians Email 

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 42 | **Program:** Khan Academy | **Disclosed:** 2022-12-17

- Report: [https://hackerone.com/reports/1636552](https://hackerone.com/reports/1636552)
- CWE: Privilege Escalation
- Submitted: 2022-07-14T08:35:48.817Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

1. Go to https://www.khanacademy.org/signup and signup as learner keeping date of birth below 13 years.
{F1821117}
2. Now keep victims email as parent's email for example here I am keeping info@khanacademy.org as parents email and click on signup.
████
3. Now you will see a following message "Your parent or guardian must approve your account or it will be deleted in 7 days".
██████
4. Now go to https://www.khanacademy.org/settings/account and update your email to temporary email or any email you have access to.
██████████
██████
5. Now, you will receive a verification email in your temporary email you have access to. But don't click on the email. Now again change the email to info@khanacademy.org.

{F1821137} ███████
6. Now open the verification email you received in your temporary email account in an incognito tab and refresh your child's account. We have successfully tied info@khanacademy.org as parent account with email verification.

This is the account that I created : Username : ██████ Password : ██████████ Email : ████

█████████

## Impact

Attacker is able to bypass email verification.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2022-07-15** @shuvam321: Dear @drosile ,
Happy to hear it!. Below is my Khan Academy username. If you have any query related to vulnerability, I would be glad to help.

http://www.khanacademy.org/profile/WHOISsuvam

Kind Regards,
@shuvam321
- **2022-07-19** @drosile: Thanks, the badge should be added to your account today!
- **Report Resolved**
- **2022-11-17** @shuvam321: Dear @jeremyspangler ,

This has been fixed now. Thanks for your prompt support.

Kind Regards,
@shuvam321
- **Agreed On Going Public**
- **2022-11-17** @shuvam321: Please redact the account credentials in the report before disclosing 😇.
- **2022-11-29** @jeremyspangler: Hi @shuvam321,

I just wanted to confirm for you that the report has been redacted, and that the redacted report will be disclosed. Thanks again!

Best,
Jeremy
- **2022-11-29** @shuvam321: Dear @jeremyspangler ,

The credentials have been redacted. You may disclose the report.

Kind Regards,
@shuvam321
- **Report Became Public**
