---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/insecure-direct-object-reference-idor
  - env/web
substate: "resolved"
weakness: "Insecure Direct Object Reference (IDOR)"
enriched: true
date: 2020-11-09
submitted: 2020-10-10T18:58:15.648Z
bounty_usd: null
votes: 17
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "silentbreach"
source: "https://hackerone.com/reports/1004750"
title: "IDOR + Account Takeover  [UNAUTHENTICATED]"
---
# IDOR + Account Takeover  [UNAUTHENTICATED]

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 17 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2020-11-09

- Report: [https://hackerone.com/reports/1004750](https://hackerone.com/reports/1004750)
- CWE: Insecure Direct Object Reference (IDOR)
- Submitted: 2020-10-10T18:58:15.648Z

## Timeline

- **Report Filed**
- **2020-10-10** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **2020-10-26** @silentbreach: Hello,

I've checked the vulnerability and see it's fixed. A session mechanism has been added to the system. Please update the vulnerability as fixed?

Have a nice day
- **Report Resolved**
- **2020-11-06** @agent-1: @silentbreach,
Thank you for your submission! Due to the high quality and impact of your report you have been selected at the VDP's Researcher of the Month for October. Well done!

However, we noticed that you have publicly disclosed a vulnerability without first receiving our written authorization.
https://twitter.com/SilentBreach/status/1323634986810040324
https://silentbreach.com/News/silent-breach-finds-critical-security-flaws-on-dod-network/

This is a violation of our policy which is found at https://hackerone.com/deptofdefense
"You do not publicly disclose any details of the vulnerability, indicator of vulnerability, or the content of information rendered available by a vulnerability, except upon receiving explicit written authorization from DoD."

Please take down both the tweet and the news article, and follow the process to request the disclosure of this report. If you have any questions please contact us at VDP-Questions@DC3.mil.

-DoD VDP Team
- **2020-11-06** @silentbreach: Dear VDP Team,

Thank you for our nomination as researcher of the month, this is greatly appreciated. 

Apologies for violating your policy, we were under the impression that the issue had been mitigated and hence, was not a vulnerability anymore, allowing us to disclose the information. Please note that no technical data has been publicly shared. 

We are happy to remove all public references until we get your explicit authorization. Can you please share the procedure so we can share this finding? As a private company, we allocate resources to 0-day research programs from our marketing budget, so that we can get exposure while providing quality findings to our partners/clients. We hope this can be a win/win situation for both the DoD and SB. 

Thank you for bringing this issue to our attention, please let us know if any other material needs to be taken down.

All the best,
Sient Breach team
- **Agreed On Going Public**
- **2020-11-09** @agent-j5: To get publix disclosure please click on the comment drop-down and request disclosure. This will be added to our queue based on the time it was requested. We will review and redact the report as needed, and if there are no issues we will release it for public consumption. At that point you may share the redacted report. Thanks!
- **2020-11-09** @silentbreach: Sounds good, we've requested public disclosure. Any idea what the typical waiting time looks like? Marketing is after me..  thank you!
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
- **2020-11-09** @ag3nt-j1: @silentbreach you're good to go!
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
