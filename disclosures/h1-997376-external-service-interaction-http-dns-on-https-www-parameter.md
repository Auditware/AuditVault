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
date: 2021-04-02
submitted: 2020-10-03T23:36:38.631Z
bounty_usd: null
votes: 12
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "fiveguyslover"
source: "https://hackerone.com/reports/997376"
title: "External Service Interaction (HTTP/DNS) on https://www.███  (██████████ parameter)"
---
# External Service Interaction (HTTP/DNS) on https://www.███  (██████████ parameter)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 12 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2021-04-02

- Report: [https://hackerone.com/reports/997376](https://hackerone.com/reports/997376)
- CWE: Server-Side Request Forgery (SSRF)
- Submitted: 2020-10-03T23:36:38.631Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Greetings, i've find a External service interaction (HTTP/DNS) on https://www.███████

```
External service interaction arises when it is possible to induce an application to interact with an arbitrary external service, 
such as a web or mail server. 
The ability to trigger arbitrary external service interactions does not constitute a vulnerability in its own right, 
and in some cases might even be the intended behavior of the application. 
However, in many cases, it can indicate a vulnerability with serious consequences.

In cases where DNS-based interactions can be triggered, it is normally possible to trigger interactions using other service types, 
and these are reported as separate issues.
 If a payload that specifies a particular service type (e.g. a URL) triggers only a DNS-based interaction, 
then this strongly indicates that the application attempted to connect using that other service, 
but was prevented from doing so by egress filters in place at the network layer. 
The ability to send requests to other systems can allow the vulnerable server to be used as an attack proxy. 
By submitting suitable payloads, an attacker can cause the application server to attack other systems that it can interact with. 
This may include public third-party systems, internal systems within the same organization, 
or services available on the local loopback adapter of the application server itself. Depending on the network architecture, 
this may expose highly vulnerable internal services that are not otherwise accessible to external attackers.
```
https://portswigger.net/kb/issues/00300200_external-service-interaction-dns

Full link  : https://www.██████/█████

POST Request : 

```
████████&MONTH=01&LNAME=frenchvlad&PHONE=555-555-0199&EDULVL=10&STATE=AL&EMAILFLAG=on&submitButton=Submit+Audition+Request&EMAIL=frenchvlad@example.com&ADD1=555-555-0199@frenchvlad.com&██████=http://bcrxn9tx1eboqdat33ghligdv41upj.burpcollaborator.net/?Winterville&ADD2=555-555-0199@frenchvlad.com&INST1MOS=Bass+Guitar&CITY=Winterville&YEAR=2003&INST1YRS=2+TO+5&DAY=01&CITIZEN=R
```

my payload : `█████████=http://bcrxn9tx1eboqdat33ghligdv41upj.burpcollaborator.net/?Winterville`

Proof (DNS) : 

██████

Proof (HTTP) : 

█████

best regards, 
frenchvlad

## Impact

We can use the weakness as a attack proxy to DDOS all Internal/external web conatiners, also could be amplified too

## Timeline

- **Report Filed**
- **2020-10-03** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2020-10-03** @fiveguyslover: on https://www.███████ (sorry)
- **Report Needs More Info**
- **Report New**
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
