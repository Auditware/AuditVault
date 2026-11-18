---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2020-09-22
submitted: 2020-01-21T23:27:10.964Z
bounty_usd: null
votes: 11
cve: []
program: "[[programs/lab45|Lab45]]"
reporter: "hundredpercent"
source: "https://hackerone.com/reports/779908"
title: "Stored-Xss at connect.topcoder.com/projects/ affected on project chat members"
---
# Stored-Xss at connect.topcoder.com/projects/ affected on project chat members

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 11 | **Program:** Lab45 | **Disclosed:** 2020-09-22

- Report: [https://hackerone.com/reports/779908](https://hackerone.com/reports/779908)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2020-01-21T23:27:10.964Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi team ,
I'm sorry for my bad report and english ,
but i wish you understand the impact of that bug here , if it well performed the sers may lose their access to their sso accounts 

## Summary:
While a developer at connect.topcoder.com can manage a messages about his/her project with someonelse ,
This conversation was not fully protected from XSS , if some user join in the same chat he'd be affected by that xss and his ==SSO== account possibly will be token over 

## Steps To Reproduce:
After you register to topcoder.com go to connect.topcoder.com and sign on with your sso account ,
After that Go to https://connect.topcoder.com/new-project/ and add new project

**NOTE** : The discussion will not be accessible publicult efore the administratirs manages it , So after the adiministrators accept it the bug will be accessible publiculy █████

  1. GO TO https://connect.topcoder.com/projects/<your_project_id>/messages
  2. Add message with random title and this `<script>alert()</script>` as content , then submit
  3. You'll get a fully JS code injected 

If an attacker inject a Javascript code that steal cookies/csrf-token... he'll be able to fully access to the victim account

## Supporting Material/References:
Tested on
* Chrome Browser .
* Windows 7_64x 
Note : That bug is affect to every machine/browser

## Impact

Xss

## Timeline

- **Report Filed**
- **2020-01-21** @hundredpercent: If you didn't get what i meant ,
Here's a full poc of the exploit :
████

##How it could attack other users ?
Well that question comes to mind too ,but as i mentioned before after the administrators accept the project it'll be publivuly this discussion acceble (anyone join this discussion will be affected )
+ there's an invation button which mean the attacker can send invitation to the target victim to this project and fool him to accesss his account ██████
- **2020-01-22** @h1_analyst_layla: Hi @refvtfvd,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@bassguitar
- **Report Needs More Info**
- **Report Triaged**
- **2020-01-22** @hundredpercent: Hi @bassguitar ,@0xcain
Thanks for the great news , 
if you nedd smth i'll be here asap

Regards ,
- **2020-02-01** @jwheeler: @ninty9ine
I'd like to reward you for your report. Please create an account on topcoder.com and provide me your handle.
- **2020-02-01** @hundredpercent: Hey @jwheeler ,
Already have a one :) 
█████
- **External User Joined**
- **2020-08-25** @hundredpercent: @jwheeler is there any update on this !!!

and sorry for being annoying
- **2020-08-26** @h1_analyst_layla: Hello  @sodium_,

Thanks for your patience! The Topcoder team is still working on this internally, and you will be updated once there is more information to share.

Regards,
@bassguitar
- **2020-08-26** @hundredpercent: Thank you @bassguitar for your attention,
Really apperciate your help
- **2020-09-22** @jwheeler: @sodium_  I believe this is fixed. Please confirm.
- **2020-09-22** @hundredpercent: yeah fixed,

██████████ , 

Thanks for your time
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2020-09-22** @hundredpercent: Almost forgot
@jwheeler please redact the  pictures/video
- **2020-09-22** @jwheeler: Done.
- **2020-09-24** @hundredpercent: thank you
