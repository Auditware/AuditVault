---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/insecure-storage-of-sensitive-information
  - env/web
substate: "resolved"
weakness: "Insecure Storage of Sensitive Information"
enriched: true
date: 2019-10-10
submitted: 2019-07-16T12:00:00.066Z
bounty_usd: null
votes: 14
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "alyssa_herrera"
source: "https://hackerone.com/reports/644358"
title: "PII leakage-Full SSN on ███"
---
# PII leakage-Full SSN on ███

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 14 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2019-10-10

- Report: [https://hackerone.com/reports/644358](https://hackerone.com/reports/644358)
- CWE: Insecure Storage of Sensitive Information
- Submitted: 2019-07-16T12:00:00.066Z

## Report summary

This was a simple Google dork search as well as checking other search engines to discover sensitive documents.

## Timeline

- **Report Filed**
- **2019-07-16** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2019-07-16** @alyssa_herrera: https://███████/wp-content/uploads/2016/12/██████ 
https://█████/wp-content/uploads/2016/12/██████████
https://████████/wp-content/uploads/2016/12/████

Is another example. Although the SSN is blanked out, everything else there is breach of personal information.
- **Report Title Updated**
- **2019-07-16** @alyssa_herrera: I found full SSN, Home address, mother/father name as well on the server. https://███████/wp-content/uploads/2018/12/██████
- **2019-07-16** @w0lv3rin3: Thanks Alyssa, that file has the full SS#.
- **Report Title Updated**
- **2019-07-16** @alyssa_herrera: I just noticed it actually. I'm still looking for other files on the server
- **Report Severity Updated**
- **Report Triaged**
- **2019-07-16** @alyssa_herrera: https://██████████/wp-content/uploads/2016/12/██████████ 
This has a social security on it
- **2019-07-16** @alyssa_herrera: Oh quick question. Is there any severity to having credentials to a test instance ?
https://███/wp-content/uploads/2016/12/███████ 
lists out credentials and locations to use them in.
- **2019-07-16** @alyssa_herrera: https://███████/wp-content/uploads/2019/04/██████ this also has PII. There's a screen capture on the 13th slide which you can faintly make out the last 4 digit's of an SSN even if the rest are redacted.
- **2019-07-18** @alyssa_herrera: https://████████/wp-content/uploads/2018/12/█████████ 
This also looks to be SSN as well.


I'm going to keep it all in this report instead of filing new ones unless other wise told by the way
- **2019-07-18** @alyssa_herrera: https://██████████/wp-content/uploads/2018/12/██████

At this rate, the entire server will need to be take down and looked through /scrubbed of documents. I'll keep digging to see what else I can uncover on the server. I noticed a lot of stuffed that is marked with HR docs on it, tended to contain legitimate PII
- **2019-07-18** @ag3nt-j1: Thanks for digging around on the server.  At this point I don't think you need to keep going, we've already tagged the report as critical and I will be reaching out internally to try and get more traction.  I've made requests to shut down sites before but at the end of the day it's up to the digression of the system and data owner.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
