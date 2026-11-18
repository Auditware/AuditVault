---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/privilege-escalation
  - env/web
  - vuln/subdomain-takeover
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
body: true
date: 2020-03-24
submitted: 2017-08-30T01:51:35.882Z
bounty_usd: null
votes: 90
cve: []
program: "[[programs/roblox|Roblox]]"
reporter: "jackb898"
source: "https://hackerone.com/reports/264494"
title: "Subdomain Takeover at creatorforum.roblox.com"
---
# Subdomain Takeover at creatorforum.roblox.com

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 90 | **Program:** Roblox | **Disclosed:** 2020-03-24

- Report: [https://hackerone.com/reports/264494](https://hackerone.com/reports/264494)
- CWE: Privilege Escalation
- Submitted: 2017-08-30T01:51:35.882Z

## Report summary

creatorforum.roblox.com was pointing to a nonexistent Discourse website allowing for a subdomain takeover to occur. Thank you to the roblox team for quickly resolving this and awarding me a bounty.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello.

A few days ago, I was looking at Roblox subdomains, and I noticed an unusual one called creatorforum.roblox.com. Upon further investigation, I visited it and saw that creatorforum.roblox.com's CNAME was a nonexistant Discourse website.
 I immediately reported to info@roblox.com, and eventually talked to Antek Baranski on the bugbounty@roblox.com email address. The issue has been fixed since reporting, but I was told to send a report here.

If I had a Discourse account, I could've taken over the CNAME for creatorforum.roblox.com and then it would've been a full subdomain takeover on that subdomain.

As mentioned earlier in the report, the issue has been resolved and as you can see the subdomain creatorforum.roblox.com no longer exists.


Thanks,
Jack

## Timeline

- **Report Filed**
- **2017-08-30** @jackb898: Sorry, I didn't mention the problems with having a subdomain takeover. Obviously as you know subdomain takeovers are a very critical vulnerability, and for a few distinct reasons.

Subdomain takeovers allow you to upload any content to the taken over CNAME, and that content will be shown on creatorforum.roblox.com. This allows extreme phishing, because everyone trusts the .roblox.com domain name. Also I didn't check for this, but a lot of times the cookies for the domain are also on the subdomain, allowing clickjacking and stealing of cookies.
- **Report Triaged**
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
