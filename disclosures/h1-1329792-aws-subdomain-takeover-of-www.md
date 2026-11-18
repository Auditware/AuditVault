---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/cloud
  - stack/aws
  - vuln/ssrf
  - vuln/cors-misconfig
  - vuln/subdomain-takeover
  - impact/credential-theft
  - trigger/cors-origin
  - fix/csp
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2021-10-28
submitted: 2021-09-03T17:41:46.506Z
bounty_usd: null
votes: 10
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "al-madjus"
source: "https://hackerone.com/reports/1329792"
title: "AWS subdomain takeover of www.███████"
---
# AWS subdomain takeover of www.███████

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 10 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2021-10-28

- Report: [https://hackerone.com/reports/1329792](https://hackerone.com/reports/1329792)
- CWE: Improper Access Control - Generic
- Submitted: 2021-09-03T17:41:46.506Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Description:**
The AWS bucket hosted on `www.████████` was vulnerable to a subdomain takeover. It has a DNS record pointing to an unclaimed bucket that I was able to register and serve a PoC on. 

## References
Output of `dig`:
```
;; QUESTION SECTION:
;www.███████.		IN	A

;; ANSWER SECTION:
www.████.	1833	IN	CNAME	██████████.
███. 60 IN	A	███████
█████. 60 IN	A	███
█████████. 60 IN	A	████████
█████. 60 IN	A	███

;; AUTHORITY SECTION:
█████. 1831 IN	NS	████.
███. 1831 IN	NS	█████████.
███████. 1831 IN	NS	██████.
██████. 1831 IN	NS	██████████.

;; ADDITIONAL SECTION:
█████████.	151098	IN	A	████
████.	153636	IN	A	████████
█████.	132552	IN	A	█████
███████. 6009	IN	A	███
████.	56631	IN	AAAA	███

```

## Impact

The impact for a subdomain takeover can be varied and wide: potentially steal cookies, bypass CSP and CORS policies, bypass domain whitelisting for SSRF, spy on legitimate requests sent to that domain, phising vector, etc.

## System Host(s)
www.█████████

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
Go to https://www.███████/█████████████████ which is the PoC I have hosted.

## Suggested Mitigation/Remediation Actions
Please remove all dangling DNS records if they are not needed, or claim the buckets if they are.

## Timeline

- **Report Filed**
- **2021-09-03** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Duplicate**
- **Report Reopened**
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Severity Updated**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
