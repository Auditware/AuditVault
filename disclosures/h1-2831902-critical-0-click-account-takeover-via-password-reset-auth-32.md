---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
date: 2025-07-21
submitted: 2024-11-10T14:56:28.557Z
bounty_usd: null
votes: 291
cve: []
program: "[[programs/remitly|Remitly]]"
reporter: "db3wy"
source: "https://hackerone.com/reports/2831902"
title: "[CRITICAL] 0-Click Account Takeover via Password Reset [AUTH-3243] /orchestrator/v1/password_reset/start"
---
# [CRITICAL] 0-Click Account Takeover via Password Reset [AUTH-3243] /orchestrator/v1/password_reset/start

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 291 | **Program:** Remitly | **Disclosed:** 2025-07-21

- Report: [https://hackerone.com/reports/2831902](https://hackerone.com/reports/2831902)
- CWE: Improper Access Control - Generic
- Submitted: 2024-11-10T14:56:28.557Z

## Timeline

- **Report Filed**
- **2024-11-11** @c-alvaroc: Hi @db3awy 
I cannot reproduce the video PoC that you uploaded, can you please check and upload again?
Thanks

CC @francoisd11
- **2024-11-11** @db3wy: Hi @francoisd11
"I truly apologize for that. I thought you were going to upload the videos, but I will upload them for you."
████
█████████
- **2024-11-11** @db3wy: "Sir, please note that I performed all the steps on my own account as a hacker and used the OTP from my own account as a hacker. After changing the data I mentioned, which I took from the leaked requests of the victim's account, I was able to change the victim's account password.

I have included all of this in the reproduction steps and in the video, but I wanted to clarify once again so that you can understand the steps smoothly."
- **2024-11-12** @db3wy: hi, 
@francoisd11
First, my greetings to you. I have been diligently working for a while on securing your website.

To save your time:

The request that leaks the JWT used for the attack is only triggered when the website requires CAPTCHA during the password recovery process.

I have a method to force the site to request CAPTCHA from me during the password recovery process, which is as follows:

1-Enter the email address in the password recovery function. `victim account`
██████████
2-This will trigger the following request: `POST /orchestrator/v1/mfa/start`.
{F3755309}{F3755310}
3-In this request, there is a CAPTCHA token. Remove most of the CAPTCHA token value.
{F3755313}
4-By doing this, you will force the site to display the CAPTCHA, and it must be solved correctly.
{F3755316}
5-Send the request again.
6-You will receive a new request from this endpoint: `POST /orchestrator/v1/mfa/start`
{F3755318}
7-However, this time the request includes the state_token necessary for the attack.
{F3755320}
8-Complete the reproduction steps I mentioned, and you will be able to take over any user account on the site.
##POC
█████████
Best regards,
db3wy
- **Report Needs More Info**
- **Report New**
- **Report Triaged**
- **Report Title Updated**
- **Report Title Updated**
- **Report Title Updated**
- **2024-11-14** @db3wy: hi,  francoisd11
"I understand, Sir, that I cannot share this matter.
Thank you for the clarification.
I hope this security vulnerability can be resolved quickly due to its severity.
I am here to help."
best regared, 
db3awy
- **Report Retesting**
- **User Completed Retest**
- **2024-11-15** @db3wy: I don't know why the video is not working.

I will upload it again, and here it is:

█████████
- **Report Retest Approved**
- **Report Resolved**
- **2024-11-15** @db3wy: hi, @francoisd11 
Sir,
 I haven't received the bounty for the vulnerability. I would like an update regarding this.
- **2024-11-15** @db3wy: "Where is the bounty?"
- **2024-11-15** @francoisd11: Thank you for your message.

Because of the amount involved, additional verifications are in place. 
It will take approximatively 35 days for us to issue this bounty.
- **2024-11-15** @francoisd11: Thank you for making Remitly’s products more secure.
We look forward to your next submissions!
- **2024-11-15** @db3wy: "Alright, sir, I will wait patiently.
Thank you for the clarification.
It is an honor for me to have contributed to the protection of Remitly’s products,
and it's an honor to know a respectable man like you.
Thank you."
- **2024-12-17** @db3wy: Is there any update regarding the bounty? It has now been 32 days.
- **2024-12-22** @db3wy: @francoisd11 
any update about  bounty???
- **Bounty Awarded**
- **2024-12-23** @db3wy: "Thank you for recognizing my efforts and rewarding me with this bounty. I’m glad my work contributed to enhancing the security of your products, and I look forward to submitting more in the future. Thanks to the Remitly team for the support and trust!"
- **2024-12-23** @db3wy: "Thank you for recognizing my efforts and rewarding me with this bounty. I’m glad my work contributed to enhancing the security of your products, and I look forward to submitting more in the future. Thanks to the Remitly team for the support and trust!"
- **Agreed On Going Public**
- **Report Became Public**
