---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-access-control-generic
  - env/web
  - vuln/dos
  - vuln/jwt
  - impact/account-takeover
  - impact/credential-theft
  - trigger/victim-interaction
  - trigger/password-reset
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
A 0-click Account Takeover vulnerability was identified in the password reset functionality of the target website. This flaw allows an attacker to reset the victim's password without any interaction or consent from the victim, leading to a complete compromise of the victim's account.


## Operating System
WINDOWS


## do you use a vpn? if so which one?
NO
## Browser
FIRFOX FOR ATTACKER
Burp Browser for victim


## Steps To Reproduce:
1-----Go to the Password Reset Page:

2-----Navigate to the "Forgot Password" or "Reset Password" section on the website.
         Initiate Password Reset for Both the Victim and the Attacker Account:

3----Enter the victim's email address in the password reset form.
       Also, enter your email address (attacker's email) to initiate a password reset.
         Capture the Password Reset Request:

4-----Intercept the HTTP request using a proxy tool like Burp Suite or OWASP ZAP when submitting the password reset request.


            Analyze the Leaked Information:

To clarify:

Endpoint: /orchestrator/v1/password_reset/start

You need to obtain the JWT token from this specific endpoint.
There are two endpoints with the same name:
One endpoint does not include a JWT token in its response.
The other endpoint includes a JWT token, which is necessary for the attack.
Make sure to target the correct endpoint that provides the JWT token during the password reset process.

Any JWT token belonging to the victim from any other endpoint will not work.

Download a tool for Burp Suite called JSON Web Token. It will make your work easier as it highlights the requests containing the JWT token in green, helping you easily identify the correct endpoint

Only the mentioned 
endpoint /orchestrator/v1/password_reset/start is valid and works for obtaining the necessary JWT for the attack.

This endpoint may not appear on the first attempt; you may need to repeat the process.
As you can see in the recorded video, it appeared for me on the second attempt.





Check the intercepted request and identify sensitive parameters such as:
     AMP_d0cf3ed24c: Contains user information like deviceId, userId, and sessionId.
JWT: JSON Web Token containing the user's email and other information.



save this 2 paramter




5------Enter the One-Time Password (OTP) received on your email or phone to proceed with the password reset.-->>  attacker account
         Modify the HTTP Request:

6------Before sending the password reset request, replace your session data with the victim's session data in the HTTP request:
         Replace the """"AMP_d0cf3ed24c and JWT""""" values with the victim's values obtained from the leaked request.


7--------- Send the Modified Request:


8---Access the Victim's Account:

If successful, you will be able to reset the victim’s password without any interaction from the victim.
Log in using the victim's email address and the new password you have set.



## POC
████
█████

## Impact

##Summary:
The vulnerability discovered allows an attacker to reset the password of a victim's account without requiring any user interaction or special privileges. By intercepting the password reset request and modifying it with the victim's session data, the attacker can successfully take over the account. Additionally, the site allows money transfers, and by exploiting this vulnerability, the attacker can potentially steal funds from victims' accounts.

##Requirements:
Access to the victim's password reset request: Intercepted via tools like Burp Suite or OWASP ZAP.
Knowledge of the victim's session information: This includes tokens such as AMP_d0cf3ed24c and JWT, which are available in the intercepted requests.
Access to the attacker’s own OTP (One-Time Password): The attacker needs their own OTP for the password reset.
Ability to modify HTTP requests: The attacker needs the ability to replace their own session data with the victim’s session data to perform the attack.
##Gained Privilege:
By exploiting this vulnerability, the attacker gains the following privileges:

Full Account Control: The attacker can reset the victim’s password and log in to the account without needing the victim’s credentials.

Access to Confidential Data: The attacker gains access to sensitive information within the victim’s account, including personal details, emails, and other private data.

Manipulation of Account Settings: The attacker can modify account settings, change the email address associated with the account, or perform other actions that would typically require user consent.

Potential to Lock Out the Victim: The attacker can change the password and prevent the victim from accessing their own account, leading to a potential denial of service.

Stealing Funds: Since the site allows money transfers, the attacker can transfer all funds from the compromised accounts to their own, effectively stealing money from the victims.

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
