---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/leftover-debug-code-backdoor
  - env/web
  - vuln/xss-stored
  - vuln/xss
  - trigger/unauthenticated
  - trigger/auth-required
substate: "resolved"
weakness: "Leftover Debug Code (Backdoor)"
enriched: true
body: true
date: 2021-05-11
submitted: 2020-12-02T00:29:58.668Z
bounty_usd: null
votes: 19
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "skarsom"
source: "https://hackerone.com/reports/1048571"
title: "███ on https://████ enable ███ scraping, injection, stored XSS"
---
# ███ on https://████ enable ███ scraping, injection, stored XSS

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 19 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2021-05-11

- Report: [https://hackerone.com/reports/1048571](https://hackerone.com/reports/1048571)
- CWE: Leftover Debug Code (Backdoor)
- Submitted: 2020-12-02T00:29:58.668Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
An open ████████ at the ████████ system enables quick and easy scraping of ███ without authentication nor authorization.

**Description:**
The █████ includes an open set of ██████endpoints at https://██████████. Any individual can execute requests on these endpoints without authorization nor authentication. These include the ability to view ████

Some of these endpoints are legitimately used in the ██████████ of the website, such as the one to ███████.

## Impact
An external, unauthorized, and unauthenticated attacker can scrape data of █████ by date on the ██████.

An external actor may also be able to perform injections against the database service through maliciously crafted attacks.

An external, unauthorized, and unauthenticated attacker can perform a stored XSS attack using on an ████████. 

## Step-by-step Reproduction Instructions

Data Extraction:
███████. Navigate to https://█████████.
████. Navigate to the "██████" ████ (https://████?████████████)
3. Enter the year ███████████████████████████████, the month █████████████, and the day █████████████, then press Invoke.
4. Success (█████████).
5. For further extraction, take one of the user IDs present in the JSON reply and paste it into the ███ ███████ (https://██████████?███████████).
6. For further extraction, take one of the profile IDs present in the JSON reply and paste it into the █████████ ██████ (also set "dbName" to "███") (https://█████████?███████). 

Stored XSS/Information Modification:
███. Navigate to the ███████ █████████ (https://█████████?███).
██████. Parameters: dbName = `██████████`, OUid = `█████████`, lngDesc = `████████`, modDesc = `███████`, wrkPLid = `███████`, clngPLid = `██████`, prfDate = `████████████/█████████/██████████████████████ ███████████████████:█████████████:███████████████████`, timeString = `Tue Dec ████████████ ██████████8:█████9:56 ███████████████████████████`, prfLink = `demofromskarsom`, CData = `<iframe onload="alert(██████)" style="display:none"></iframe>`, sessionID = `██████`
3. Click "Invoke".
4. Navigate to the following page, replacing `(GENSTRING)` with the integer that was returned from invoking the █████ request: `https://█████(GENSTRING)&B=███████&C=████████&D=demofromskarsom&view=true`
5. Success.

## Supporting Material
Navigate to████?A=███9█████98&B=██████&C=██████████&D=dodvdpdemo&view=true to see a stored XSS POC that I uploaded.
#███
#█████████
#████
#███████

## Suggested Mitigation/Remediation Actions
All endpoints unused by the frontend UI (based on a cursory search, this appears to be all but ███Plink) should be removed or guarded by authorization checks.

## Impact

Third-party actors can easily scrape language proficiency, testing, and student information through the ODA's debug UI and endpoints.

Third-party actors may also be able to perform injections against the database service through maliciously crafted strings within the INSERT and UPDATE ███s on the WS endpoints (did not attempt to prevent damage).

Third-party actors can further generate a page with a stored XSS attack within the "██████" of an inserted profile through█████.

## Timeline

- **Report Filed**
- **2020-12-02** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

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
