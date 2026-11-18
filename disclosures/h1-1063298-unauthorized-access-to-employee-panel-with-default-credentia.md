---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/authentication-bypass-using-an-alternate-path-or-channel
  - env/web
  - vuln/privilege-escalation
  - vuln/misconfiguration
  - trigger/admin-required
substate: "resolved"
weakness: "Authentication Bypass Using an Alternate Path or Channel"
enriched: true
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Hello, 
When hunting for your web application.

I have managed to go https://cars.fas.gsa.gov/cars/cars and get displayed with a form.
I have already tried to login to Cars and without success.
However i've noticed the loginChk() function and change the value of the form hence bypassing it and logging in succesfuly.

## Steps To Reproduce:


  1. go to https://cars.fas.gsa.gov/cars/cars
  2. type loginChk()  function in console. 
  3. It would return false. 
  4. Now  type in console ( can be opened using F12). 
       document.forms[0].scSelCen.value = "admin"
  5. Now try to login by clicking on CARS button.

## Supporting Material/References:
Navigator used : google chrome.

If you need any additional information. feel free to ask me.

PS :  I think the website went for a maintenance right now.
Even though i didn't use anything of that panel.

## Impact

Any attacker would have the access to admin panel and do whatever he wants.
As i can see , it's a platform for reporting accidents.

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
