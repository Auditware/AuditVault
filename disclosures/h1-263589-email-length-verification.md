---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
substate: "spam"
weakness: null
enriched: true
date: 2017-08-26
submitted: 2017-08-26T12:36:33.068Z
bounty_usd: null
votes: 14
cve: []
program: "[[programs/legalrobot|Legal Robot]]"
reporter: "husnainiqbal01"
source: "https://hackerone.com/reports/263589"
title: "Email Length Verification "
---
# Email Length Verification 

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 14 | **Program:** Legal Robot | **Disclosed:** 2017-08-26

- Report: [https://hackerone.com/reports/263589](https://hackerone.com/reports/263589)
- CWE: N/A
- Submitted: 2017-08-26T12:36:33.068Z

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **Report Spam**
- **2017-08-26** @husnainiqbal01: Why are you closing this as a spam its a valid report. review this @danrubins
- **2017-08-26** @husnainiqbal01: If you didnt undestand my point please check this reproducing steps:
1.Make an account with email like iqbal01+aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@gmail.com
2.Account successfully registered.
3. And you will recieve a registration email at iqbal01@gmail.com because the other part gets truncated. 
This is not the expected behaviour mostly when i visit different sites they have an email rate limit. i hope you are understood @danrubins  
And take a look at this report: https://hackerone.com/reports/2224 the hacker was rewarded with $1000 for the same vulnerability and closing this as a spam that's not fair :)
- **2017-08-26** @danrubins: 1) Your report describes a fairly well-known feature of Gmail, not a security issue with our domain. https://lifehacker.com/144397/instant-disposable-gmail-addresses
2) The business about VARCHAR(128) and MySQL tells me you certainly didn't read our policy or even attempt this on our site.
3) That's great that another security researcher was able to get a $1,000 bounty for this issue on ***a completely different*** bug bounty program; that has *no* bearing on this report.

Publicly disclosing this report for the sake of transparency so the community can see how we handled this issue.
- **Agreed On Going Public**
- **Manually Disclosed**
- **Comments Closed**
