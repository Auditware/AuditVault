---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/violation-of-secure-design-principles
  - env/web
substate: "resolved"
weakness: "Violation of Secure Design Principles"
enriched: true
body: true
date: 2024-06-18
submitted: 2023-10-01T20:01:57.349Z
bounty_usd: null
votes: 35
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "ezequielpuig"
source: "https://hackerone.com/reports/2188240"
title: "Subdomain Takeover via Host Header Injection on www.█████"
---
# Subdomain Takeover via Host Header Injection on www.█████

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 35 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2024-06-18

- Report: [https://hackerone.com/reports/2188240](https://hackerone.com/reports/2188240)
- CWE: Violation of Secure Design Principles
- Submitted: 2023-10-01T20:01:57.349Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Vulnerability Overview

**_Reported By_**: Ezequiel \[@ezequielpuig\]
**_Reported Date_**: 01/October/2023
**_Reported To_**: U.S. Department Of Defense
**_Vulnerability Type_**: Subdomain Takeover
**_Affected URL_**: www\.███████

Hello U.S. Department Of Defense Security Team, I hope this report finds you well. 

I want to bring to your attention a serious security issue that poses a significant risk to www\.████████. This is related to a subdomain takeover vulnerability, which could allow malicious individuals to gain control over the subdomain and potentially misuse it for malicious purposes.

_Overview:
The affected subdomain is www\.███, which currently points to an unclaimed CNAME record on the ████████.netlify.app. This situation allows anyone to potentially take ownership of the subdomain and manipulate its content. Since www\.█████████ has a CNAME record pointing to ██████████.netlify.app, by changing the Host header to www\.██████████, it is possible to visualize the malicious content hosted on █████████.netlify.app.

Here are a few scenarios where the Host header can be modified:

Proxy Servers: If you control a proxy server, you can intercept incoming requests and modify the Host header before forwarding the request to the intended destination. This is often done for load balancing, content caching, or security purposes.

DNS Spoofing: In a malicious context, an attacker might attempt DNS spoofing to redirect requests to a different server with a modified Host header.

Server-Side Scripting: If you have control over the server-side code that processes incoming requests, you can modify the Host header as part of your application logic.

Browser Extensions: Malicious browser extensions installed can modify the Host header for all outgoing requests.

_Proof of Concept (PoC):
This vulnerability materializes when an HTTP request is sent to www\.██████████ with a manipulated Host header.

PoC via curl:
`curl -skS https://www.███████ --header "Host: ███.netlify.app"`

PoC via Burp Suite:
█████████

_Impact:
Subdomain takeover can be exploited for various malicious purposes, including:

Malware distribution
Phishing / Spear phishing attacks
Cross-Site Scripting (XSS) attacks
Authentication bypass
And more.

_Mitigation:
To address this issue and prevent potential abuse, I recommend taking the following steps:

Remove the CNAME record from the DNS zone for www\.█████████.
Reclaim and register the affected subdomain (███.netlify.app) in the Netlify portal to prevent takeover by unauthorized entities.
I urge you to take swift action to remediate this vulnerability to safeguard the security and reputation of U.S. Department Of Defense.

//

Please feel free to reach out to me if you need any further information or assistance in resolving this matter.

Best regards,
Ezequiel Puig

HackerOne: https://hackerone.com/ezequielpuig
LinkedIn: https://linkedin.com/in/ezequielpuig
Mail: puigezequiel@gmail.com

## Impact

Impact detailed above.

## System Host(s)
www.██████████

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
Steps to reproduce detailed above.

## Suggested Mitigation/Remediation Actions

## Timeline

- **Draft Started**
- **Report Filed**
- **2023-10-01** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

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
- **Report Vulnerability Types Updated**
- **Report Triaged**
- **2023-10-02** @agent-p1: We will converse as a team tomorrow to either raise the severity or keep it the same.
- **Report Severity Updated**
- **2023-10-03** @ezequielpuig: Great @agent-p1, I appreciate the agile responses and the professional approach.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
