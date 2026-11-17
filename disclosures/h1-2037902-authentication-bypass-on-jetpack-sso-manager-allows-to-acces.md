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
