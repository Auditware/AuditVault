---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-access-control-generic
  - env/web
  - impact/unauthorized-write
  - trigger/admin-required
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2025-03-02
submitted: 2024-10-24T16:17:34.689Z
bounty_usd: null
votes: 81
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "tinopreter"
source: "https://hackerone.com/reports/2801787"
title: "Admin Dashboard Access Leads to Updating Merchant Info"
---
# Admin Dashboard Access Leads to Updating Merchant Info

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 81 | **Program:** MTN Group | **Disclosed:** 2025-03-02

- Report: [https://hackerone.com/reports/2801787](https://hackerone.com/reports/2801787)
- CWE: Improper Access Control - Generic
- Submitted: 2024-10-24T16:17:34.689Z

## Report summary

A hidden registration endpoint allowed an attacker to sign up for an admin portal, granting access to all registered merchant information. With administrative control over this data, the attack possibilities were endless. The MTN team quickly responded and restricted access to internal users only.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
The ███████ application provides access to 3(Merchant, Supervisor, Admin) classes of users. Looking at the Admin side, its clear only permitted admins can login to the portal since nothing on the UI indicates a register feature. However I was able to find a registration endpoint to sign up. Now I have access to the Admin dashboard. Based on the functionalities there, it's evident an outsider shouldn't have access to this.

## Steps To Reproduce:
[add details for how we can reproduce the issue]

  1. Visit ████████ and signup
  2. Login at ██████ and you will be redirected to the admin dashboard where you can approve or decline transactions.
██████   
  3. At ███████, you can see a list of registered Merchant accounts in the application.    
███████  

  You can edit their data, 
`Change their account credentials`
`change their account number to an attacker's: thereby 
  receiving payments made to them`,  
`disable` or `delete` their account, etc.  
██████    
█████████

##!EDIT

Initially my report focused on the merchants, however it affects, Cashiers, Stations and Supervisors also. You can edit and delete their data also by navigating the the URLs below:  

███████
█████████
█████████   

#IMPORTANT
You can see the passcode for various supervisor accounts at
███   
█████████

## Impact

Direct access to admin functionalities, where an attacker can modify merchant financial account information, disable and delete account of MTN clients. An outsider like myself shouldn't have access to this.

## Timeline

- **Report Filed**
- **Report Vulnerability Information Updated**
- **Report Vulnerability Information Updated**
- **Report Vulnerability Information Updated**
- **Report Severity Updated**
- **Report Pending Program Review**
- **2024-12-09** @tinopreter: Hi ████████ 

Any update so far? This is the main vulnerability, a subsidiary of it #2833942 has already been triaged. Have they responded to this? At least it can be in the triage state.
- **2024-12-09** @h1_analyst_bjorn: Hi ███,

Unfortunately I have not heard from the MTN Group team yet. Hope to have an update for you soon.

Kind regards,
████████
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
