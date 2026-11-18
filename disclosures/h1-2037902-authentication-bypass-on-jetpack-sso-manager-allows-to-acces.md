---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
  - stack/wordpress
substate: "resolved"
weakness: null
enriched: true
body: true
date: 2023-12-28
submitted: 2023-06-25T19:28:53.048Z
bounty_usd: null
votes: 41
cve: []
program: "[[programs/automattic|Automattic]]"
reporter: "hundredpercent"
source: "https://hackerone.com/reports/2037902"
title: "Authentication bypass on JetPack SSO manager - Allows to access the administration panel of wordpress without user interaction"
---
# Authentication bypass on JetPack SSO manager - Allows to access the administration panel of wordpress without user interaction

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 41 | **Program:** Automattic | **Disclosed:** 2023-12-28

- Report: [https://hackerone.com/reports/2037902](https://hackerone.com/reports/2037902)
- CWE: N/A
- Submitted: 2023-06-25T19:28:53.048Z

## Report summary

The main issue in this report was that someone could invite an arbitrary email to a site, and then also verify that email address.

If someone was using that email on a Jetpack site, SSO and "Match accounts using email addresses" was enabled, the attacker could gain access to that site where account with that arbitrary email existed.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello team,

## Summary:
The JetPack SSO manager is plugin that allows any user to log into their wordpress using the same log-in credentials you use for WordPress.com, then they’ll now be able to register for and sign in to self-hosted WordPress.org sites quickly, example :

User creates their wordpress instance at host.com, they install and enable  JetPack SSO
They later can login into their wordpress instance at host.com using wordpress.com, users are also can make other users register/login with the same company email (@host.com) and access the administration panel of the host


## Description :
The user anyways when he tries to authenticate into his wordpress instance via wordpress.com he gotta have his email confirmed, otherwise it won't work, interstingly there is a way that bypasses the email confirmation when a user invites you to his account and you accept his invite your account will be confirmed, chaining those issues the following scenario can result for the authentication bypass of any wordpress  instance when these circumestances are met :

* wordpress installed on host.com have jetpack installed and "Match accounts using email addresses" enabled (IDK if this is necessary anyways) 
* wordpress instance have a user with specific email, that email does not exist on wordpress.com

You can access this host.com wordpress panel via

## Steps To Reproduce:
**Setup**

  1. Install Jetpack latest version, once installed go to plugins>Jetpack>settings>"Match accounts using email addresses">enable (I'm not sure if this is intended or not)
  2. Add user into your wordpress (host.com) with their email (says something@company.com)


* **As attacker (email confirmation bypass)** :
  1. Create two accounts at Wordpress.com 
        A/. One with your personal email and confirm it 
        B/.  Second with the victim's existed user at host.com email (something@company.com)

  2. At your confirmed wordpress.com account go to settings >users invite your second account (something@company.com)
  3. At your second account go to notifications at the top right, see the invitation and accept it 
  4. See that your Wordpress.com account’s email has been verified (email confirmation bypass )

* **access the wordpress admin panel**
  1. Now at the same browser where the (something@company.com) Wordpress.com account 
  2. go to host.com wordpress panel 
  3. Click on sign in with wordpress.com
  4. Forward 
  5. See yourself logged in as admin on host.com wordpress

## Platform(s) Affected:
JetPack latest version




## Supporting Material/References:
As example I bypass ███████ 

██████

## Impact

* Bypass authentication of websites that runs wordpress with JetPack plugin without any user inteaction


Regards,

Adam

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **Report Triaged**
- **2023-06-25** @hundredpercent: Hi @ehtis ,

Thanks for your time, but this should be critical as there is no user interaction required and this leads to RCE (uploading a malicious plugin later ...etc)

Also is it possible to request for CVE for this, as the plugin also should have confirmation from the user email and not trusting wordpress.com directly !

Regards,

Adam
- **Report Resolved**
- **2023-06-28** @ehtis: >Also is it possible to request for CVE for this,

Sure, can get a CVE number for this. Will update you once that is done.
- **2023-06-28** @ehtis: @sodium_ Apologies for the confusion - as this bug was not in Jetpack, I don't believe there's any reason for updates to be pushed out in the plugin or have CVE IDs.
- **2023-06-29** @hundredpercent: @ehtis ,

Thanks for your assistance !
I'm not able to reproduce it anymore, the issue is fixed

Is there any update about the severity and the bounty yet ?
- **2023-06-30** @hundredpercent: ping @ehtis
- **2023-06-30** @ehtis: Hi @sodium_,

This issue is about the bypass of email verification process. I'm going to keep it as High in the report, though arguably it can also be classified as medium severity because the Jetpack functionality is working as expected.

Following up with the bounty. Thanks for the responsible disclosure and you're welcome to continue researching into our products!
- **Bounty Awarded**
- **2023-12-24** @hundredpercent: Hello @ehtis ,

I hope all is good, Can we have a disclosure here !
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
