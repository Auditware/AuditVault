---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/misconfiguration
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Misconfiguration"
enriched: true
body: true
date: 2021-03-17
submitted: 2020-07-20T21:34:45.676Z
bounty_usd: null
votes: 221
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "hx01"
source: "https://hackerone.com/reports/928255"
title: "Ability To Delete User(s) Account Without User Interaction"
---
# Ability To Delete User(s) Account Without User Interaction

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 221 | **Program:** GitLab | **Disclosed:** 2021-03-17

- Report: [https://hackerone.com/reports/928255](https://hackerone.com/reports/928255)
- CWE: Misconfiguration
- Submitted: 2020-07-20T21:34:45.676Z

## Report summary

Research Paper: https://hx01.me/Abusing_Data_Protection_Laws_For_D0xing_and_Account_Takeovers.pdf

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

### Summary:
Gitlab allows its user to exercise their GDPR rights (Right to Access/Delete) user data by sending an email to gdpr-request@gitlab.com however gitlab team doesn't ask for security question(i.e Date Of Birth) before deleting the user account moreover doesn't authenticate the incoming emails from their  instance which allows an attacker to delete user accounts without user interaction :
██████

### Steps to reproduce
1. Send an spoofed email from victim's email address to gdpr-request@gitlab.com from a reputable SMTP (e.g: Sendgrid):
███████
2. Victim will receive the following  confirmation email:

{F914565}
3. In the next few days victim's account will be deleted :

██████

### Fix :
* Add second verification i.e ask for DOB,Government ID.

## Impact

Since Gitlab doesn't verify the request with an Valid ID before triggering Right to Access/Deletion this breaches the GDPR Law(Article 15) & moreover allows an attacker to delete User Accounts without user interaction.

## Timeline

- **Report Filed**
- **2020-07-20** @gitlab-securitybot: Hi @hx01,

Thank you for submitting this report! We will investigate the issue as soon as
possible, and should get back within a week.

Please do not submit your report or ask about its status through additional
channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **Report Severity Updated**
- **Report Vulnerability Types Updated**
- **2020-07-21** @hx01: Hey @rchan, Why was it changed to medium,this vuln can't be lower than High as the vulnerability did not require user interaction & could've lead to account deletion.
{F915878}
also, can you please @ifrahiman as a collaborator?
- **Report Triaged**
- **Report Severity Updated**
- **Report Resolved**
- **Bounty Awarded**
- **2021-03-07** @hx01: Hello There,
I'm writing a research paper on GDPR flaws, Do you mind if I include this report as an example?

Best,
hx01
- **2021-03-08** @rchan: Hi @hx01,

That's okay! Before you publish the paper, do you mind providing the link/document and let our team run it through first to see if everything is alright?

 I'm excited to see your research paper, look forward to hearing from you!

Thanks,
Ron
GitLab Security Team
- **2021-03-08** @hx01: Please check the attachment :)
- **2021-03-08** @rchan: Hi @hx01,

Thank you for the link, the paper looks good to me.

Thanks,
Ron
GitLab Security Team
- **Agreed On Going Public**
- **2021-03-17** @hx01: Hey, 
can we do a limited disclosure instead :), I'm not comfortable sharing the full report as few screenshots reveal my real identity?
- **2021-03-17** @dcouture: Hey @hx01,

If we remove the screenshots does that work with you? If you can give me the file names I'll redact them.

Thanks
Dominic
GitLab Security Team
- **2021-03-17** @hx01: Thanks 😊 that works :
██████
█████

would appreciate if you could redact the pdf as well ,as some of the organisations have backed out of disclosure.
- **2021-03-17** @dcouture: Done @hx01,

Give it another look and if it looks good to you, you can accept the disclosure!

Best regards,
Dominic
GitLab Security Team
- **2021-03-17** @dcouture: I see the other screenshots contain your email as well, should they be removed?
- **2021-03-17** @hx01: Hey @dcouture , those are aliases , so i guess we’re fine.
- **Agreed On Going Public**
- **Report Became Public**
