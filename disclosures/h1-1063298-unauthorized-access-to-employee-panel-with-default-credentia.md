---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/authentication-bypass-using-an-alternate-path-or-channel
  - env/web
substate: "resolved"
weakness: "Authentication Bypass Using an Alternate Path or Channel"
enriched: true
date: 2021-11-13
submitted: 2020-12-21T09:30:04.359Z
bounty_usd: null
votes: 22
cve: []
program: "[[programs/gsa_vdp|U.S. General Services Administration]]"
reporter: "7azimo"
source: "https://hackerone.com/reports/1063298"
title: "Unauthorized access to employee panel with default credentials."
---
# Unauthorized access to employee panel with default credentials.

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 22 | **Program:** U.S. General Services Administration | **Disclosed:** 2021-11-13

- Report: [https://hackerone.com/reports/1063298](https://hackerone.com/reports/1063298)
- CWE: Authentication Bypass Using an Alternate Path or Channel
- Submitted: 2020-12-21T09:30:04.359Z

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **2020-12-21** @7azimo: Hey @lugtag,

Now the website is back and i wanted to clarify more things in POC.

Here's a picture for the panel i had access to:
{F1124034}

POC :

1. Go to https://cars.fas.gsa.gov/cars/carlogin/
2. Fire up Developer Panel (F12)
3. Type in : document.forms[0].scSelCen.value = "admin"
4. Click on Button "CARS"
5. The form would prompt an error and would ask you to select LID.
6. Click on Select and chose any value. I chosed "1BTK"
7. Click again on "CARS"
8. Voila , you'll get a wonderful access panel for the employees.

If you need any additional info , ask me.
- **Report Needs More Info**
- **Report New**
- **Report Triaged**
- **Report Resolved**
- **2021-01-05** @7azimo: @gsa_vpd_commander , I'm glad you have resolved the issue and I'm honored for working with you.

Looking more forward for working with you!

Have great day.
- **Agreed On Going Public**
- **Report Became Public**
