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
date: 2021-06-03
submitted: 2021-04-25T09:38:03.622Z
bounty_usd: null
votes: 27
cve: "CVE-2017-11317", "CVE-2019-18935"
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "z32"
source: "https://hackerone.com/reports/1174185"
title: "Remote Code Execution via Insecure Deserialization in Telerik UI (CVE-2019-18935)"
---
# Remote Code Execution via Insecure Deserialization in Telerik UI (CVE-2019-18935)

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 27 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2021-06-03

- Report: [https://hackerone.com/reports/1174185](https://hackerone.com/reports/1174185)
- CWE: Deserialization of Untrusted Data | CVE: CVE-2017-11317, CVE-2019-18935
- Submitted: 2021-04-25T09:38:03.622Z

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **2021-04-27** @z32: @agent-l8,

Looks like my thoughts about execution being blocked out of `██████████\` were right, I was able to make it sleep by dropping the file in `███` using the following command:
```
python3 CVE-2019-18935.py -u https://█████████/███/Telerik.Web.UI.WebResource.axd?type=rau -v ███ -f '█████' -p <sleep_dll_here>
```

I've attached another .dll for you to test.

█████
████████

Regards,
@un4gi i
- **Report Severity Updated**
- **Report Triaged**
- **2021-04-27** @agent-l8: Thanks for the extra info as always- good stuff!
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
