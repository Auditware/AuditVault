---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2022-04-07
submitted: 2022-02-27T10:19:35.571Z
bounty_usd: null
votes: 12
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "lubak"
source: "https://hackerone.com/reports/1493007"
title: "Broken access control, can lead to legitimate user data loss"
---
# Broken access control, can lead to legitimate user data loss

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 12 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2022-04-07

- Report: [https://hackerone.com/reports/1493007](https://hackerone.com/reports/1493007)
- CWE: Improper Access Control - Generic
- Submitted: 2022-02-27T10:19:35.571Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi team,
During testing the security of ██████████ I found another possible attack vector:
(There are two reports preceding this one -  https://hackerone.com/reports/1489470 and  https://hackerone.com/reports/1489744)

I will try to explain:
When an user need access to that information system he fills a request form at:
https://█████████/████████
or
https://█████████/██████
After submitting the form the server response contains a █████████ which identifies this user request.
Then  the request is reviewed by an administrator, and he decides if user access will be granted or rejected.
The vulnerability I found is that unauthorized person can access the end point responsible for deleting user requests - █████████ and by providing just the ███ parameter he can delete any request.

## References

## Impact

An attacker can delete  legitimate user requests, disturbing the normal operation  of the system and causing data loss.
The user request ids are sequential numbers - my requests were given ids - ████████, so the attacker can delete all requests in the system by accessing the ████ end point with each ██████ from ██████████.

## System Host(s)
███████

## Affected Product(s) and Version(s)
██████████

## CVE Numbers


## Steps to Reproduce
1.  Activate Burp proxy, go to https://███/██████████, fill and submit the form (screenshot1)
2. Inspect server response in Burp and take a note of the returned █████ (screenshot2) which is number, referencing this user access request
3. (optional) we can confirm our request is in the system by performing the attack described in the other report I made (https://hackerone.com/reports/1489470) - resulting in our request being exfiltrated from the database:
execute following command, and replace the █████ parameter with the one you noted on step 2 (screenshot)
curl https://██████/██████████ -X POST -data="url=%2F████&██████████=████████" -k

4. Deleting the request - CAUTION - execute this step only by referencing ██████████ for requests, you made otherwise you will delete legitimate user request!(sceenshot4)
the command abusing the delete request endpoint is:
curl https://██████/███████████████ -X POST -data="url=%2F███████&███████=██████" -k

5. (optional) to confirm request is deleted you can execute again Step 3, which now responds with empty body - the request is no longer present in the database.

## Suggested Mitigation/Remediation Actions
The ██████████ endpoint should perform check if the user is logged in and authorized to use it.

## Timeline

- **Report Filed**
- **2022-02-27** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

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
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
