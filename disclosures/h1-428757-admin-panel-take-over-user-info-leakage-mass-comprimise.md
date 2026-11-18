---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/authentication-bypass-using-an-alternate-path-or-channel
  - env/web
substate: "resolved"
weakness: "Authentication Bypass Using an Alternate Path or Channel"
enriched: true
body: true
date: 2019-10-08
submitted: 2018-10-25T15:49:34.515Z
bounty_usd: null
votes: 11
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "bigchonk"
source: "https://hackerone.com/reports/428757"
title: "Admin panel take over | User info leakage | Mass Comprimise"
---
# Admin panel take over | User info leakage | Mass Comprimise

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 11 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2019-10-08

- Report: [https://hackerone.com/reports/428757](https://hackerone.com/reports/428757)
- CWE: Authentication Bypass Using an Alternate Path or Channel
- Submitted: 2018-10-25T15:49:34.515Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

> NOTE! Thanks for submitting a report! Please replace *all* the [square] sections below with the pertinent details. Remember, the more detail you provide, the easier it is for us to triage and respond quickly, so be sure to take your time filling out the report!

**Summary:** [add summary of the vulnerability]
I'm able to take over the admin panel, allowing me to viewing the entire ticket database's PII (DOD ID, email, name by changing the URL and bypassing authentication
**Description:** [add more details about this vulnerability]

## Steps To Reproduce:
1: Go to
████████?x-app=itsm&x-urlpath=/arsys/shared/login.jsp&x-redir=%2Farsys%2Fforms%2Fedgelb-itsm-ar%2FRKM%253AKnowledgeArticleManager%2FDisplay%2BView%2F%3Feid%3DKBA000000024701%26cacheid%3Ddf8e1567

2: Change URL to 
█████?x-app=itsm&x-urlpath=../../../../../../../../passwd
3) 
LFI fails, click login
4) Enjoy full admin panel access

5 (Leak PII)
In the left hand corner, applications -> quick links -> AR system report console
Bottom left, click run


## Supporting Material/References:

  * List any additional material (e.g. screenshots, logs, etc.)
Proof of PII:
██████████

Proof of admin panel:
█████████

## Impact

I can steal users DOD IDs, pretty much anything I want because I'm the websites admin
Change tickets
Change user info
Change permission
Steal PII

## Timeline

- **Report Filed**
- **2018-10-25** @coffeecup: @thermaltpp - Excellent report! Please delete the screenshots from Gyazo and upload them here - you can click on this button at the bottom of the page where you write a comment: 

█████████
- **Report Triaged**
- **2019-01-12** @bigchonk: Hey, can I get an update or an ETA on a fix?
- **2019-01-15** @coffeecup: HI @thermaltpp - We are still working on getting this to the proper remediation team. Thanks for your patience so far, we should have an update soon.
- **Report Needs More Info**
- **Report New**
- **2019-01-25** @ag3nt-j1: Crap, I see now.  I wasn't trying to pass my CAC credentials through.  Yep, still broken.  Reason the system owner doesn't see an issue is that they probably have access to the system.
- **Report Triaged**
- **2019-01-25** @bigchonk: Would this qualify for a bounty?
- **2019-01-25** @ag3nt-j1: Sorry to say but DoD VDP is not a bounty program.  https://hackerone.com/deptofdefense
- **2019-03-09** @bigchonk: Any update on a fix? I'd love to do a write-up or a blog post about this if that's allowed.
- **Report Needs More Info**
- **Report New**
- **Report Resolved**
- **Agreed On Going Public**
- **2019-05-02** @bigchonk: Any update on the disclosure?
- **2019-05-03** @agent-0g: @thermaltpp 	Nothing to report yet but we will keep you posted. Thanks for checking in!
- **2019-07-17** @bigchonk: Any update on disclosure?
- **Agreed On Going Public**
- **Report Became Public**
- **Report Vulnerability Types Updated**
