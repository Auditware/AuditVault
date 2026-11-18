---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/misconfiguration
  - env/cloud
  - vuln/subdomain-takeover
substate: "resolved"
weakness: "Misconfiguration"
enriched: true
body: true
date: 2021-01-14
submitted: 2020-05-14T21:39:08.263Z
bounty_usd: null
votes: 18
cve: []
program: "[[programs/insulet_corporation|Insulet Corporation]]"
reporter: "kumarp16"
source: "https://hackerone.com/reports/874482"
title: "Subdomain Takeover due to unclaimed domain pointing to Acquia Cloud"
---
# Subdomain Takeover due to unclaimed domain pointing to Acquia Cloud

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 18 | **Program:** Insulet Corporation | **Disclosed:** 2021-01-14

- Report: [https://hackerone.com/reports/874482](https://hackerone.com/reports/874482)
- CWE: Misconfiguration
- Submitted: 2020-05-14T21:39:08.263Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

ssue Details

The consultant identified that subdomain http:// or https://qa.myomnipod.com 

Web Site Not Found

Sorry, we could not find any content for this web address. Please check the URL.

If you are an Acquia Cloud customer and expect to see your site at this address, you'll need to add this domain name to your site via the Acquia Network management console.

Error Is displayed.

How did you come across this bug ?

Using enumeration, I was able to discover this domain and determined it

NOTE: The hostname was not claimed by me also because i need to pay certain amount to host a website.

## Impact

Sub-domain take over attacks can happen when a company creates a dns entry that points to a third party service, however forgets about the third party application leaving it vulnerable to be hijacked by another party. Hackers can claim subdomains with the help of external services. This attack is practically non-traceable.

## Timeline

- **Report Filed**
- **2020-05-15** @h1_analyst_caesar: Hi @pk_prem,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@turtle_shell
- **2020-05-15** @h1_analyst_caesar: Hi @pk_prem - I'm discussing this submission internally with the Insulet Corporation team. You will be updated as soon as there is additional information to share. Thanks for your patience!
- **2020-05-17** @kumarp16: Hey! @turtle_shell 

Any uptades ?!
- **2020-05-18** @h1_analyst_caesar: Hello  @pk_prem,

Thanks for your patience! The Insulet Corporation team is still working on this internally, and you will be updated once there is more information to share.

Regards,
@turtle_shell
- **2020-05-23** @kumarp16: Hey! 

Any updates ?!
- **2020-05-30** @kumarp16: Hey !
just wanna update that, there are other unclaimed subdomains  pointing to Acquia Cloud.
- **2020-05-30** @kumarp16: They are,

https://training.myomnipod.com/
https://contact.myomnipod.com/
https://dev.myomnipod.com/
https://stage.myomnipod.com/
- **2020-06-01** @kumarp16: Hey ! @turtle_shell 

Any updates ?
- **Report Triaged**
- **Changed Scope**
- **Report Vulnerability Types Updated**
- **Report Severity Updated**
- **2020-06-11** @kumarp16: Hey ! @turtle_shell 

would mind if you look at other comments, there i given you some more subdomain.

i wanna make sure they resolve under in one ticket.

Regards,
@pk_prem
- **2020-06-24** @kumarp16: Hey 👋 
Any updates ?!
- **Report Resolved**
- **2020-06-26** @kumarp16: Thanks @turtle_shell .....

Can we disclose it.
- **Agreed On Going Public**
- **Report Became Public**
