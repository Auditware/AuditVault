---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
date: 2020-05-27
submitted: 2020-02-14T02:36:19.299Z
bounty_usd: null
votes: 8
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "hunt4p1zza"
source: "https://hackerone.com/reports/796379"
title: "[Critical] Insufficient Access Control On Registration Page of Webapps Website Allows Privilege Escalation to Administrator "
---
# [Critical] Insufficient Access Control On Registration Page of Webapps Website Allows Privilege Escalation to Administrator 

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 8 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2020-05-27

- Report: [https://hackerone.com/reports/796379](https://hackerone.com/reports/796379)
- CWE: Improper Access Control - Generic
- Submitted: 2020-02-14T02:36:19.299Z

## Timeline

- **Report Filed**
- **2020-02-14** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2020-02-14** @hunt4p1zza: One of the accounts I had created with `user_type`=1 appeared to be of applicant level while trying to investigate this. However, I tried logging in with this later to test other functionalities and to my surprise I was super system administrator. I was really confused by this, but there may be some delay when the site applies permissions as I tried playing with the `user_type` a lot to verify it.
 
I am attaching a new PoC video showing how I was able to access the site with my super admin account: ██████ 

Please let me know if you need me to provide you with the credentials.
- **Report Severity Updated**
- **Report Triaged**
- **2020-02-14** @ag3nt-j1: @hunt4p1zza good report man.  Do me a favor in the future though and try not to upload anything that has PII in it.  No big deal, I reached out to H1 to have the 2nd video deleted.
- **2020-02-14** @hunt4p1zza: Hi @ag3nt-j1 thank you. What you say makes perfect sense, duly noted! I will only be uploading sanitized images and we will see on case per case if you guys need a video which is more difficult to edit.

Appreciate the feedback!
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
