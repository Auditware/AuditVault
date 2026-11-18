---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-access-control-generic
  - env/web
  - vuln/misconfiguration
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2022-10-21
submitted: 2022-09-15T01:23:29.457Z
bounty_usd: null
votes: 17
cve: []
program: "[[programs/gsa_vdp|U.S. General Services Administration]]"
reporter: "ahmed0x0mahmoud"
source: "https://hackerone.com/reports/1700896"
title: "access nagios dashboard using default credentials in ** omon1.fpki.gov, 3.220.248.203**"
---
# access nagios dashboard using default credentials in ** omon1.fpki.gov, 3.220.248.203**

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 17 | **Program:** U.S. General Services Administration | **Disclosed:** 2022-10-21

- Report: [https://hackerone.com/reports/1700896](https://hackerone.com/reports/1700896)
- CWE: Improper Access Control - Generic
- Submitted: 2022-09-15T01:23:29.457Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
when i performing recon on fpki.gov i found nagios dashboard in ** omon1.fpki.gov, 3.220.248.203**  and i accessed it using default credentials

username:  ** nagiosadmin **
password :  ** nagiosadmin **

## Steps To Reproduce:


  1. visit these urls : 
        **  https://omon1.fpki.gov/nagios/side.php **
        ** https://3.220.248.203/nagios/side.php **
  2. he will ask to put your credentials in basic authentication enter these credentials 
       
         username:  ** nagiosadmin **
         password :  ** nagiosadmin **

##POC:

look at poc pic

## Impact

attacker can make any action like an admin he has full control on your panal.

thanks , have a nice day :)

## Timeline

- **Report Filed**
- **Report Triaged**
- **2022-09-20** @issamy11: @ahmed0x0mahmoud Thank you very much for your report. Currently, we are reviewing the finding. We will inform you if there are any updates.
- **2022-09-20** @ahmed0x0mahmoud: hi @issamy11 ,

thanks for your fast response ,
have a nice day :)
- **2022-09-20** @ahmed0x0mahmoud: and thank for @bassguitar  for fast triaged :)
have a nice day
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
