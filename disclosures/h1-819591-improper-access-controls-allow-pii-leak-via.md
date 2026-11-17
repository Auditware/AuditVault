---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/privacy-violation
  - env/web
substate: "resolved"
weakness: "Privacy Violation"
enriched: true
date: 2021-02-18
submitted: 2020-03-15T10:52:24.953Z
bounty_usd: null
votes: 5
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "z32"
source: "https://hackerone.com/reports/819591"
title: "Improper Access Controls Allow PII Leak via ████"
---
# Improper Access Controls Allow PII Leak via ████

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 5 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2021-02-18

- Report: [https://hackerone.com/reports/819591](https://hackerone.com/reports/819591)
- CWE: Privacy Violation
- Submitted: 2020-03-15T10:52:24.953Z

## Timeline

- **Report Filed**
- **2020-03-15** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **Report Triaged**
- **2020-03-16** @z32: Hey @agentt2 thanks for the quick triage. 

Just wondering, is there a reason these were set as Medium when #808338 was marked as critical? They all effect the same server and leak the same data. The severity doesn't affect me one way or another as this is a VDP, but I figure it may effect how seriously the system owner takes the report.

Thanks,
@un4gi
- **Report Triaged**
- **2020-03-16** @z32: Hey @agentt2,

The PII can be found as shown in the screenshot below or step 9 above:
███

This can be exported as well, which shows the following (note - this was pulled from my other test account, not the account shown):
█████
- **Report Severity Updated**
- **2020-03-16** @agent-l8: @un4gi these findings are currently (usually) at a HIGH level, and we adjusted it to reflect that. The previous one you submitted that was critical, was pushed up an extra level based on something we found based off of your PoC, but that you hadnt actually reported. Usually these will be high' though. Thanks!
- **2020-03-16** @z32: @agent-l8,

No worries, thanks for the update/explanation!
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
