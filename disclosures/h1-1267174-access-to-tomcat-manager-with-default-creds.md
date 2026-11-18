---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/web
  - stack/java
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
body: true
date: 2023-02-05
submitted: 2021-07-17T23:24:05.276Z
bounty_usd: null
votes: 24
cve: []
program: "[[programs/jetblue|JetBlue]]"
reporter: "0xjackal"
source: "https://hackerone.com/reports/1267174"
title: "Access to tomcat-manager with default creds"
---
# Access to tomcat-manager with default creds

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 24 | **Program:** JetBlue | **Disclosed:** 2023-02-05

- Report: [https://hackerone.com/reports/1267174](https://hackerone.com/reports/1267174)
- CWE: Improper Authentication - Generic
- Submitted: 2021-07-17T23:24:05.276Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Hi jetblue Security Team.

I Found that this domain `█████████` using Apache Tomcat/6.0.35 , And i was able to login to https://██████████/manager/html With default credentials `tomcat:tomcat`
See the following Screenshots:-

██████████

███

## Steps To Reproduce:
1. Go To https://███████/manager/html
2. Login with default creds `tomcat:tomcat`

## Supporting Material/References:
- https://book.hacktricks.xyz/pentesting/pentesting-web/tomcat

## Impact

Improper Authentication
Default Credentials lead to access admin manager.

##Fix:-
- Change default creds.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2021-07-20** @ashitkumar: Hello @doosec101 ,

Thank you for your valid submission. This is an important issue you have discovered and coincidently we are already working on remediating it. We will keep you updated on our progress. We value your support and hope you will continue to test our systems and help us provide a more secure service to our customers. 

Regards

Ash
- **2021-07-20** @0xjackal: Hi @ashitkumar , Thank you for your response , Hope you are well.

Regards.
Adham.
- **2021-07-23** @0xjackal: Hello @ashitkumar , I Confirm It's fixed now,  I couldn't login with default creds, Well done.

Best Regards.
@doosec101
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
