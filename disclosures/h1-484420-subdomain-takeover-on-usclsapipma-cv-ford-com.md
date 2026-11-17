---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/privilege-escalation
  - env/web
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
date: 2019-03-24
submitted: 2019-01-23T05:09:30.817Z
bounty_usd: null
votes: 105
cve: []
program: "[[programs/ford|Ford]]"
reporter: "march"
source: "https://hackerone.com/reports/484420"
title: "Subdomain takeover on usclsapipma.cv.ford.com"
---
# Subdomain takeover on usclsapipma.cv.ford.com

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 105 | **Program:** Ford | **Disclosed:** 2019-03-24

- Report: [https://hackerone.com/reports/484420](https://hackerone.com/reports/484420)
- CWE: Privilege Escalation
- Submitted: 2019-01-23T05:09:30.817Z

## Timeline

- **Report Filed**
- **2019-01-23** @march: My bad, i've made a mistake on this report, on "detail" section. here is the corrected part

##Detail 
[...]
After registering the Cloud App Virtual Machine in Azure portal, the person doing so has full control over traffic on ~~dynatraceppeast01.cf.ford.com~~  **usclsapipma.cv.ford.com** (so, not only HTTP/HTTPS but also mails traffic, etc, since we have full control over the virtual machine and it's OS).
- **2019-01-23** @lasagna: Hi @march,

Thanks for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@lasagna
- **Report Needs More Info**
- **Report New**
- **Report Triaged**
- **Report Severity Updated**
- **2019-01-23** @march: Hello @lasagna ! Can you provide me the CVSS parameters you used to re-calculate From critical to high (if you have set via CVSS calculator, of course) ?
It's because i'm no totally sure at first how to classify this type of vulnerability and I want to improve the quality of my future report and correctly set the CVSS score at first post :)

Same for "Weakness" also, since i'm not really sure that "privilege escalation" is the most appropriate weakness, since the "Subdomain takeover" (or at least "DNS misconfiguration", or something like that) are not available choice.

Thanks to you !

Cheers,

March
- **Report Resolved**
- **2019-02-22** @march: Hello ! It's fixed ! Entry got deleted from ford's dns.
- **Agreed On Going Public**
- **Report Became Public**
