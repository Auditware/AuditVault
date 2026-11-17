---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/deserialization-of-untrusted-data
  - env/web
substate: "resolved"
weakness: "Deserialization of Untrusted Data"
enriched: true
date: 2020-05-07
submitted: 2020-04-03T14:48:45.089Z
bounty_usd: null
votes: 45
cve: "CVE-2017-11317", "CVE-2019-18935"
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "sw33tlie"
source: "https://hackerone.com/reports/838196"
title: "Remote Code Execution via Insecure Deserialization in Telerik UI "
---
# Remote Code Execution via Insecure Deserialization in Telerik UI 

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 45 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2020-05-07

- Report: [https://hackerone.com/reports/838196](https://hackerone.com/reports/838196)
- CWE: Deserialization of Untrusted Data | CVE: CVE-2017-11317, CVE-2019-18935
- Submitted: 2020-04-03T14:48:45.089Z

## Timeline

- **Report Filed**
- **2020-04-03** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Triaged**
- **Report Severity Updated**
- **Report Triaged**
- **2020-04-10** @sw33tlie: Hey @agentt2 , did you want to triage #845685? 
With all these similar reports it's very easy to miss the right one to write at :)
- **2020-04-10** @agentt2: Hello,
sw33tie  report #845685 has been submitted back to you for more information.  We were unable to recreate your PoC with the provided dlls.  We will require you to revisit this report.  Thanks
- **2020-04-10** @agentt2: **Updated**

Hello,
@sw33tlie report #845685 has been submitted back to you for more information. We were unable to recreate your PoC with the provided dlls. We will require you to revisit this report. Thanks
- **2020-04-10** @sw33tlie: Hi, i'm looking into it...there seem to be some kind of WAF that limits the successful attempts.
It worked before for sure and it has to work again, i'll let you know as soon as i figure this out :)
- **Report Vulnerability Types Updated**
- **2020-05-04** @agent-l8: @sw33tlie this one appears fixed as well. Quick confirm?
- **2020-05-04** @sw33tlie: Yep, it looks that it's fixed.
I tried to bruteforce all the Telerik versions again and I was unable to detect it (and this happens only when the target is not vulnerable).
Nice job!
- **Report Resolved**
- **Agreed On Going Public**
- **2020-05-07** @agent-r5: We will add it to the queue.
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
