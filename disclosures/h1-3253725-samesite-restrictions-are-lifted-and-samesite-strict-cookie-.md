---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-certificate-validation
  - env/web
substate: "resolved"
weakness: "Improper Certificate Validation"
enriched: true
date: 2025-10-15
submitted: 2025-07-15T13:33:26.798Z
bounty_usd: null
votes: 73
cve: "CVE-2018-12402", "CVE-2022-29912", "CVE-2022-45410", "CVE-2022-45413", "CVE-2023-30674", "CVE-2025-48980"
program: "[[programs/brave|Brave Software]]"
reporter: "mingijung"
source: "https://hackerone.com/reports/3253725"
title: "SameSite restrictions are lifted, and SameSite:Strict cookie are being sent."
---
# SameSite restrictions are lifted, and SameSite:Strict cookie are being sent.

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 73 | **Program:** Brave Software | **Disclosed:** 2025-10-15

- Report: [https://hackerone.com/reports/3253725](https://hackerone.com/reports/3253725)
- CWE: Improper Certificate Validation | CVE: CVE-2018-12402, CVE-2022-29912, CVE-2022-45410, CVE-2022-45413, CVE-2023-30674, CVE-2025-48980
- Submitted: 2025-07-15T13:33:26.798Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **2025-07-28** @diracdeltas: @mingijung This issue occurs in Chromium's split view implementation as well which we are migrating to. Could you report it to their bug bounty and let us know what they say? you can test it by enabling #side-by-side in chrome://flags in Chrome beta.
- **2025-07-30** @mingijung: Thanks for letting me know! I’ll report this to Google’s bug bounty program and share any updates I receive.
- **Report Resolved**
- **Bounty Awarded**
- **2025-08-09** @mingijung: Hello, sorry for the late reply. I have reported the issue to Google. I found an additional issue besides SameSite, so I ended up reporting it to Google later, and I have confirmed that the issue is currently being patched in Chrome. Once the patch is completed, you will probably be able to view the issue here: https://issues.chromium.org/issues/436444612.
  
Also, would it be possible to receive a CVE for this issue?

Thank you.
- **2025-08-09** @diracdeltas: Thanks, I am on parental leave but please ping me again in 2 weeks about the CVE. We do not issue those anyway until the fix is out in release usually.
- **2025-08-20** @artem_chaikin: @mingijung did Google give an estimate when the fix will be merged? We unfortunately don't have access to the issue you linked
- **2025-08-20** @mingijung: Since this wasn't an official feature before Chrome version M141, earlier browser versions will likely remain unpatched.
This appears to be fixed in version M141, and the issue tracker shows its status as FIXED

https://chromium-review.googlesource.com/c/chromium/src/+/6838198
- **2025-08-20** @artem_chaikin: Thanks!
- **2025-08-26** @mingijung: Hello, Brave team

May I request a CVE assignment for this issue?
- **2025-08-26** @diracdeltas: I submitted the CVE request, and it will be published once this report is disclosed. However we need to wait until the fix lands in Stable before disclosing.
- **2025-08-27** @mingijung: I understand. Thank you very much.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2025-10-22** @mingijung: Hello,

As the report has now been disclosed, I wanted to kindly ask if the CVE has been officially assigned and published.

Thank you for your help.
