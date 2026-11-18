---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/web
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
body: true
date: 2020-01-29
submitted: 2020-01-03T19:32:55.361Z
bounty_usd: null
votes: 30
cve: []
program: "[[programs/starbucks|Starbucks]]"
reporter: "zude"
source: "https://hackerone.com/reports/767829"
title: "Account take over of 'light' starbuckscardb2b users"
---
# Account take over of 'light' starbuckscardb2b users

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 30 | **Program:** Starbucks | **Disclosed:** 2020-01-29

- Report: [https://hackerone.com/reports/767829](https://hackerone.com/reports/767829)
- CWE: Improper Authentication - Generic
- Submitted: 2020-01-03T19:32:55.361Z

## Report summary

zude discovered that 'light' accounts on https://www.starbuckscardb2b.com could be taken over by registering a new account with the same email address. 'Light' accounts were defined as those that had been created but not used to add a payment method or complete a checkout.

@zude — thank you for reporting this vulnerability and confirming the resolution.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

This issue was found on https://www.starbuckscardb2b.com, this website belongs to starbucks and its is a critical vulnerability so I am reporting this.

```Issue:``` An attacker can takeover the account of the victim by creating a new account by using victim's (who is already registered) email address. 

Steps to reproduce are as follows:
1. Open https://www.starbuckscardb2b.com and go to create account.
2. for example user successfully created the account with ```abc@xyz.com``` and password ```12345678```
3. Now attacker will create the account with the email used in step 2  ```abc@xyz.com``` with different password.
4. After completion of step 3 the password for the  ```abc@xyz.com``` user will be set to the password used by attacker.
5. This will result in the account take over by attacker.

## Impact

An attacker can take over the control of any/all registered users.

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **Not Eligible For Bounty**
- **Report Triaged**
- **2020-01-10** @zude: @tealeaf any update on this?
- **Report Severity Updated**
- **2020-01-13** @tealeaf: Hi there, @zude - updated information we have as of now is:
* The development team is aware of this issue, and is working on possible fixes
* The account takeover potential of this vulnerability is limited to "light" accounts - those that have not yet registered a credit card or ordered any rewards cards. Since the main point of the web site is to facilitate the ordering of rewards cards, any damage is limited to these few light accounts, only a few of which have address or phone number data.
* Several of these accounts appear to be from people pen-testing the system, either through specific pen-tests, or the HackerOne program.
I'm downgrading this to a High because of the small number of affected accounts, and the limited nature of their capabilities. The CVSS scoring doesn't seem to apply as "High" loss of Confidentiality or Integrity.
- **Report Resolved**
- **2020-01-19** @zude: @tealeaf this issue can be marked as fixed.
- **Agreed On Going Public**
- **Report Title Updated**
- **Report Title Updated**
- **Agreed On Going Public**
- **Report Became Public**
