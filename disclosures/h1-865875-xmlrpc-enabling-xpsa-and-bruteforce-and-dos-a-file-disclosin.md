---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/uncontrolled-resource-consumption
  - env/web
  - vuln/dos
  - trigger/brute-force
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
body: true
date: 2021-06-14
submitted: 2020-05-04T17:15:07.880Z
bounty_usd: null
votes: 24
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "bb4661ba0c0dc601b01ec343277a7"
source: "https://hackerone.com/reports/865875"
title: "XMLRPC, Enabling XPSA and Bruteforce and DOS + A file disclosing installer-logs."
---
# XMLRPC, Enabling XPSA and Bruteforce and DOS + A file disclosing installer-logs.

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 24 | **Program:** MTN Group | **Disclosed:** 2021-06-14

- Report: [https://hackerone.com/reports/865875](https://hackerone.com/reports/865875)
- CWE: Uncontrolled Resource Consumption
- Submitted: 2020-05-04T17:15:07.880Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
[XMLRPC+Installer_logs+Backup_Filename+Admin_username+disclosure]

## Steps To Reproduce:

  1. I was able to successfully exploit XMLRPC with the traditional method, the brute-force was done the username was there in the Installer Logs
  2. path to XMLRPC is http://13.92.255.102/xmlrpc.php + the username is in https://lonestarcell.com/installer-log.txt 
  3. Pingback ping can be used to dos the target server when mishandled
## Supporting Material/References:
I was able to reproduce this whole https://www.netsparker.com/blog/web-security/xml-rpc-protocol-ip-disclosure-attacks/

## Impact

1)Automated once from multiple hosts and be used to cause a mass DDOS attack on the victim.
2) This method is also used for brute force attacks to stealing the admin credentials and other important credentials
3) File disclosure is causing most harm as internal criticals are popping out

## Timeline

- **Report Filed**
- **Report Triaged**
- **2020-05-14** @bb4661ba0c0dc601b01ec343277a7: Thanks, Vancora.
- **2020-06-03** @bb4661ba0c0dc601b01ec343277a7: Update, Please.
- **2020-06-08** @bb4661ba0c0dc601b01ec343277a7: @vancora Updates ?
- **2020-06-18** @bb4661ba0c0dc601b01ec343277a7: Hey H1 jedi, update dude.
- **2020-06-24** @vancora: This is resolved, kindly validate on your side.
- **2020-06-24** @bb4661ba0c0dc601b01ec343277a7: https://lonestarcell.com/installer-log.txt 
This is still there and is showing internal paths and wps username
- **2020-07-21** @bb4661ba0c0dc601b01ec343277a7: Resolve.
- **Report Resolved**
- **Agreed On Going Public**
- **Cancelled Disclosure Request**
- **Agreed On Going Public**
- **Cancelled Disclosure Request**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
