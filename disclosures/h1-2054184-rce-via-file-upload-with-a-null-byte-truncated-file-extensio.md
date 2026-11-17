---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/command-injection-generic
  - env/web
substate: "resolved"
weakness: "Command Injection - Generic"
enriched: true
date: 2023-12-21
submitted: 2023-07-06T22:08:16.576Z
bounty_usd: null
votes: 33
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "pizzapower"
source: "https://hackerone.com/reports/2054184"
title: "RCE via File Upload  with a Null Byte Truncated File Extension at https://██████/"
---
# RCE via File Upload  with a Null Byte Truncated File Extension at https://██████/

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 33 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2023-12-21

- Report: [https://hackerone.com/reports/2054184](https://hackerone.com/reports/2054184)
- CWE: Command Injection - Generic
- Submitted: 2023-07-06T22:08:16.576Z

## Timeline

- **Draft Started**
- **Report Filed**
- **2023-07-06** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2023-07-07** @pizzapower: Oh, and the `500` response when uploading the file is normal. The file still uploads.
- **Report Needs More Info**
- **Report New**
- **2023-07-07** @pizzapower: I've uploaded a video. The shell is live at 'https://██████████/savefiles/poc.asp` for testing. Please let me know when I can delete it. 

██████████
- **Report Severity Updated**
- **Report Triaged**
- **2023-07-07** @pizzapower: Thanks! RCE is not a critical? Hahaha
- **Report Severity Updated**
- **Report Resolved**
- **2023-07-31** @agent-p1: Greetings!
@pizzapower  Because of this report  and your other two Jenkins admin submissions you have been selected as our Researcher of the Month. Would you like your name to be on the certificate that is tweeted out? If so, would you provide me your name for that? Do you have a twitter handle for us to tag you in? If you do not, or would not like to, then we would use you Hackerone username. Thank you!
Regards,
The DoD VDP team
- **2023-07-31** @pizzapower: Hey, obviously this finding is mine, but I didn't report any Jenkins admin findings from what I remember.  I had an SQLi, an XSS or three, and a zip file thingy from this month. I think you must have me confused with another person, lol. But if you did mean me, you can use my name and twitter.

Matt Moreschi
pizzap0w3r on twitter

Have a good one!
- **2023-07-31** @agent-p1: Yes we meant you apologies that was a typo. We will get your cert written up immediately. Thank you for your quick response
- **2023-07-31** @pizzapower: Awesome! Thanks a bunch!
- **2023-11-22** @pizzapower: Good morning! No hurry, but when someone gets a chance, can we disclose this one please? Thanks!
- **2023-11-22** @agent-z1: Greetings @pizzapower ,

Please request the disclosure of the report through the H1 interface.  You should have the option to request disclosure when viewing this report.  That will drop it in a queue where we can redact the necessary information and approve it for public release.  If you have any questions please let us know.

Regards,
The VDP Team
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
