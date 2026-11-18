---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/information-exposure-through-debug-information
  - env/web
  - vuln/csrf
  - vuln/info-disclosure
  - impact/sensitive-data
  - trigger/session-cookie
substate: "resolved"
weakness: "Information Exposure Through Debug Information"
enriched: true
body: true
date: 2019-08-19
submitted: 2019-04-01T03:58:40.320Z
bounty_usd: null
votes: 29
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "arinerron2"
source: "https://hackerone.com/reports/519418"
title: "Trace.axd page leaks sensitive information"
---
# Trace.axd page leaks sensitive information

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 29 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2019-08-19

- Report: [https://hackerone.com/reports/519418](https://hackerone.com/reports/519418)
- CWE: Information Exposure Through Debug Information
- Submitted: 2019-04-01T03:58:40.320Z

## Report summary

See the writeup at https://aaronesau.com/blog/posts/5

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary

`Trace.axd` leaks sensitive information on `██████████` by allowing signed in users to view previous requests sent to the webserver.

## Impact

Information leaked includes (but is not limited to):
- full names
- email addresses
- social security numbers
- dates of birth
- plaintext passwords
- cookies, session tokens, and CSRF tokens
- IP addresses and headers
- application specific information (endpoints, files and directories on the filesystem, software versions, )

## Step-by-step Reproduction Instructions

1. Visit https://████████/Gateway/sso.aspx and sign in. Note that any user can create a user (and any privilege level works for this vulnerability as long as a user is signed in), so this should be considered an unauthenticated vulnerability.
2. Visit https://██████████/████/Trace.axd
3. Click on `View Details` for any request that seems interesting. You can find social security numbers by visiting any of the `/candidate_app/dspstatus.aspx` pages and then Ctrl+F'ing for `app_ssn`.

## Suggested Mitigation/Remediation Actions

Disable `Trace.axd`. https://docs.microsoft.com/en-us/previous-versions/dotnet/articles/ms972204(v=msdn.10)

## Impact

Any attacker can potentially access the following information of current or future Navy personnel:
- full names
- email addresses
- social security numbers
- dates of birth
- plaintext passwords
- cookies, session tokens, and CSRF tokens
- IP addresses and headers
- application specific information (endpoints, files and directories on the filesystem, software versions, )

## Timeline

- **Report Filed**
- **2019-04-01** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **2019-05-06** @agent-1: @arinerron2 Thank you for your submission on this critical vulnerability! You have been chosen by our team as a researcher to highlight on our Twitter page @DC3VDP. Do you have a Twitter handle, name, or URL that you would like us to use in our post? Please let us know.
- **2019-05-06** @arinerron2: Thank you! And, I have a blog post written and ready for when this report is disclosed.

Twitter (preferred): @arinerron
Name: Aaron E.
URL: https://ww.arinerron.com/
- **2019-07-01** @arinerron2: Hi @ag3nt-j1, I'm not sure about the disclosure policy here. Is it possible for these reports to be publicly disclosed? I noticed that the DoD does disclose few, although some, reports.
- **2019-07-02** @ag3nt-j1: Sure, you'll have to request disclosure on the report.  I'll go in and redact any identifying information that could tie the report to a website and have the attachments deleted before I disclose the report.  I have a backlog of disclosure request I need to work through so it might take a little bit of time.
- **Agreed On Going Public**
- **Report Became Public**
- **2019-08-19** @arinerron2: Thank you @ag3nt-j1! I published the writeup here: https://arinerron.com/blog/posts/5
- **2021-08-02** @agent-bk1: As a previous winner of Researcher of the Month we'd like to ask some questions to give you a voice in the program. If you have time we'd love your input. Thank you.

1.      Are you happy with the current point system of DoD VDP (7 points for
triage, 2 points for duplicate)?
2.      Are there any recommendations or suggestions you have for the
Researcher of the Month tweet?
3.      Are there any items in our policy that should be better defined for
participants?
4.      As an award winner, would you like to be interviewed and tell the
story of how you got into Vulnerability Disclosures and Bug Bounties?
5.      Did you use this program to "practice" before moving on to another?
6.      Are you happy with the level of communication you get from the
validators?
7.      It's been communicated that the researchers would like educational
opportunities with regards to the program, what types of opportunities would
you implement?
8.      What is the one thing you like most about our program?
9.      What is the one thing you like least about our program?
