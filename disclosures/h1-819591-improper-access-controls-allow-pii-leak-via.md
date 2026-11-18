---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/privacy-violation
  - env/web
  - vuln/broken-access-control
  - vuln/info-disclosure
  - impact/sensitive-data
substate: "resolved"
weakness: "Privacy Violation"
enriched: true
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
Dashboards in `██████████` allow a user to add widgets and obtain large amounts of information to include PII and diagnostic information. Additionally, a user is able to make changes to certain catalogs via these widgets.

**Description:**

## Impact
An adversary can gain access to PII to include full names, e-mail addresses, physical addresses, phone numbers, etc., as well as modifying fields within the underlying system. Additionally, the adversary could identify information such as the number/type of incidents, as well as diagnostic information such as memory usage.

## Step-by-step Reproduction Instructions

1. Create an account on `███████/` and browse to `███████` once your account has been verified. 
██████
2. If this is your first time accessing this page, you will need to create a dashboard.
██████
3. Using the `Add Widgets` feature, an adversary can gain access to various information as shown in the picture below. This is just a small glimpse of what an adversary has access to through this panel.
████
4. Clicking on the `All(22)` text in the third widget above, an adversary can access various configuration items.
██████████
5. These can then be modified by the adversary as shown below:
████
6. If an adversary browses to `███/home`, they get a slightly different interface:
████
7. By clicking `Add Content` in the top left corner, the adversary can add widgets similar to before. This dashboard seems to contain a little more functionality..
████████
8. By adding `███████`, the adversary can access PII of many of the users of the website.
█████
█████
9. The `███` account shown below does not contain much sensitive information, but the fields for the other accounts are highly populated. The ████████ account was used instead in effort to prevent showing real user information.
████████

## Suggested Mitigation/Remediation Actions
Restrict access to these widgets to only those users that need this functionality. Regular users should not have access to this data, especially when the account creation process is so easy.

## Impact

An adversary can gain access to PII to include full names, e-mail addresses, physical addresses, phone numbers, etc., as well as modifying fields within the underlying system. Additionally, the adversary could identify information such as the number/type of incidents, as well as diagnostic information such as memory usage.

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
