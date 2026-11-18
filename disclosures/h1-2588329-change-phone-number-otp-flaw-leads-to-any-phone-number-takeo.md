---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/business-logic-errors
  - env/web
  - impact/account-takeover
substate: "resolved"
weakness: "Business Logic Errors"
enriched: true
body: true
date: 2024-10-09
submitted: 2024-07-07T03:16:49.461Z
bounty_usd: 2000
votes: 241
cve: []
program: "[[programs/indrive|inDrive]]"
reporter: "polem4rch"
source: "https://hackerone.com/reports/2588329"
title: "Change phone number OTP flaw leads to any phone number takeover"
---
# Change phone number OTP flaw leads to any phone number takeover

> **Severity:** Critical | **Bounty:** 2,000 USD | **Votes:** 241 | **Program:** inDrive | **Disclosed:** 2024-10-09

- Report: [https://hackerone.com/reports/2588329](https://hackerone.com/reports/2588329)
- CWE: Business Logic Errors
- Submitted: 2024-07-07T03:16:49.461Z

## Report summary

Subscribe to our telegram channel with updates https://t.me/indrive_bbp

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:

Dear Indrive,

Ive found another valid report, the app allows any user to change the app phone number, but a flaw within the otp allows any number to be added into the account!

When an user requests a phone number change inside the app, it will send a 4 digit code but if you place 0000, it will accept any number and update it into the app!!

## Steps To Reproduce:

  1. Click setting in the account
  2. Click into the phone number and change for a new one
  3. Input 0000 as the otp code

  Phone number added!!


VIDEO POC

████████

At the end you can see  i was trying to pick a number from my contacts but instead i  just use a random phone number and works!!



Remediation: Make sure the otp doesnt accept 0000 or other invalid codes

Let me know if anything,

Regards,

Polem4rch

## Impact

Any attacker can use the phone number for an account takeover or delete anyone account, or cancelling trips

## Timeline

- **Report Filed**
- **Report Triaged**
- **2024-07-07** @polem4rch: Awesome!

Thanks!
- **Bounty Awarded**
- **2024-07-15** @polem4rch: Dear indrive,

Thanks for the bounty!

Can we disclose this?

Polem4rch
- **2024-07-15** @polem4rch: @majesttic can we disclose this one?

Regards,

Polem4rch
- **2024-07-16** @majesttic: Hey @polem4rch! 

We will be able to disclose this report at a later date. Stay tuned for updates.
- **2024-07-16** @polem4rch: @majesttic when the disclosure comes, can you remove the video poc as it contains personal data like my phone contact list names?

Thanks
- **2024-09-25** @polem4rch: @majesttic Hi, id like to ask if the report will be disclosed shortly, in november 12th theres a cyber security conference here in Argentina called Ekoparty, we also have a bug bounty village and ill be giving a talk about my  bug bounty process, is it possible this will be disclosed publicly so i can share my findings?

Thanks
- **Report Resolved**
- **Agreed On Going Public**
- **2024-09-30** @polem4rch: @majesttic the vulnerability has been fixed, can you also remove the video from the disclosure as ive asked previously as its shows my personal contacts?

Thanks
- **2024-09-30** @majesttic: Hi @polem4rch! 

The platform doesn't allow you to delete the video, instead it's converted internally, which means it's only visible to you, us and the platform itself. 

The video is not available to external users.
- **2024-09-30** @polem4rch: @majesttic 

Awesome thanks, ill wait for disclosure!
- **2024-10-08** @polem4rch: @majesttic 

Do i need to wait till the report is disclosed to talk about it?

Regards,

Polem4rch
- **Manually Disclosed**
- **2024-10-09** @polem4rch: @majesttic Thanks
- **2024-10-09** @majesttic: You're welcome 🫡
