---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/information-disclosure
  - env/web
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
date: 2018-09-11
submitted: 2018-08-21T05:01:49.087Z
bounty_usd: null
votes: 145
cve: []
program: "[[programs/grab|Grab]]"
reporter: "xsam"
source: "https://hackerone.com/reports/397527"
title: "Leaking sensitive information on Github lead full access to all Grab Slack channels "
---
# Leaking sensitive information on Github lead full access to all Grab Slack channels 

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 145 | **Program:** Grab | **Disclosed:** 2018-09-11

- Report: [https://hackerone.com/reports/397527](https://hackerone.com/reports/397527)
- CWE: Information Disclosure
- Submitted: 2018-08-21T05:01:49.087Z

## Report summary

The researcher @xsam reported leakage of two access tokens, one belonging to Slack and the other belonging to Google API’s. Researcher identified a public github repository with no source code but an electron package app in releases, interestingly he went on to downloaded the package and reverse engineer the electron app which lead him to identify the access tokens.

Within few minutes of receiving the report, the bug report was triaged and validated, access tokens were revoked and public repository was removed. Any valid HackerOne bug report submission triggers an internal incident investigation. In this case, a thorough investigation was conducted to identify any prior abuse and overall impact. Investigation concluded that these tokens weren't abused in the past.

We appreciate @xsam's contribution to our bug bounty program, @xsam displayed creative thinking and submitted detailed report which allowed us to quickly reproduce and validate the submission. We look forward to see more of his creative bug reports to our program.

## Timeline

- **Report Filed**
- **2018-08-21** @prakhar-prasad: Thank you for participating in our Grab Bug Bounty Program.

We are currently reviewing your bug report, we would request you give us some time while we validate your bug report.

Thanks you for your patience.
- **Report Triaged**
- **2018-08-21** @prakhar-prasad: Hi @samidrif,

We have revoked the affected Slack and Google tokens. Please help us verify whether the revocation has been correctly performed and you're no longer able to reproduce the behaviour.
- **2018-08-21** @xsam: Hi @prakhar-prasad,

I can confirm that the token is revoked right now as shown below

{F335979}

The same thing for Google tokens.

{F335980}

And the repo is no longer exists, a great turn-around from you as always. +2 points for Grab bounty program if we count the point from the previous report :).
Cheers,
- **Report Resolved**
- **Bounty Awarded**
- **2018-08-24** @xsam: Thank you for the reward as well as the bonus, it is a pleasure working with your program.
- **2018-08-26** @xsam: Hi @prakhar-prasad, I noticed that you deleted the sensitive parts from the report as well as I think it is worth disclosing to share knowledge with other researchers :), so what do you think and if possible you need to remove the link to LinkedIn profile and the first screenshot as well as the screenshot from Burp request since it contains the token in headers. Thank you.
- **2018-08-26** @prakhar-prasad: Hey @samidrif,

Thanks for your message. We've already raised a request for removal of certain attachments with HackerOne; this process takes a bit of time. Nevertheless, we appreciate your help and concern.
- **Agreed On Going Public**
- **2018-09-06** @xsam: Hello, @prakhar-prasad is there any problems because the report will be disclosed after 21 days.
- **2018-09-06** @grabsecurity: Hi @xsam,

Thank you for following up on this.  It's under review and will be disclosed soon.

We appreciate your patience.

- Grab Security Team
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
