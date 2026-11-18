---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/privacy-violation
  - env/web
substate: "resolved"
weakness: "Privacy Violation"
enriched: true
body: true
date: 2018-08-12
submitted: 2018-08-12T08:11:13.442Z
bounty_usd: null
votes: 380
cve: []
program: "[[programs/ed|Ed]]"
reporter: "h1_analyst_everton"
source: "https://hackerone.com/reports/393615"
title: "Physical Laptop Takeover"
---
# Physical Laptop Takeover

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 380 | **Program:** Ed | **Disclosed:** 2018-08-12

- Report: [https://hackerone.com/reports/393615](https://hackerone.com/reports/393615)
- CWE: Privacy Violation
- Submitted: 2018-08-12T08:11:13.442Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

At 6:16PM of August 11th of 2018, during H1-702, right before the sand storm beat the shit out of the rooftop party, we managed to perform a critical attack on Ed's infrastructure.
{F332214}

## Report Summary

During our analysis and reconnaissance of how Ed program worked during the h1-702 event, we realized there was a critical flaw on how the program was setup. 

## Report Description

During the process, we realized that the program manager had tendency to leave secrets open in the wild. While analyzing this, we decided to look into hardware hacking. So as we looked around, we found that the owner of the program left their computer open. What was worse is that it allowed us to to use this to exploit this and get root access into multiple services. 

{F332215}

After we had access to the laptop, we decided to start the first exploiting for PoC by taking a screenshot of our team. This helps to prove that we could do anything we wanted.

## Impact

Access to internal documentations, Ed program statistics and internal details.

##MOST IMPORTANT IMPACT

Shame Ed on the company Slack

{F332216}

**_The Triage send their regards!_**

## Timeline

- **Report Filed**
- **Report Collaborator Invited**
- **Report Collaborator Invited**
- **Report Collaborator Invited**
- **Report Collaborator Invited**
- **Report Collaborator Invited**
- **Report Collaborator Invited**
- **Report Severity Updated**
- **Report Collaborator Joined**
- **Report Collaborator Joined**
- **Report Collaborator Joined**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Report Collaborator Joined**
- **Report Collaborator Joined**
