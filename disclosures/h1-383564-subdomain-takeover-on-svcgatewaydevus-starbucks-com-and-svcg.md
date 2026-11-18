---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/privilege-escalation
  - env/web
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
body: true
date: 2018-07-23
submitted: 2018-07-19T03:32:35.559Z
bounty_usd: null
votes: 35
cve: []
program: "[[programs/starbucks|Starbucks]]"
reporter: "blurbdust"
source: "https://hackerone.com/reports/383564"
title: "Subdomain takeover on svcgatewaydevus.starbucks.com and svcgatewayloadus.starbucks.com"
---
# Subdomain takeover on svcgatewaydevus.starbucks.com and svcgatewayloadus.starbucks.com

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 35 | **Program:** Starbucks | **Disclosed:** 2018-07-23

- Report: [https://hackerone.com/reports/383564](https://hackerone.com/reports/383564)
- CWE: Privilege Escalation
- Submitted: 2018-07-19T03:32:35.559Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello,

This is fairly close to [this report](https://hackerone.com/reports/325336) however these are different subdomains than the one in the report.

This can be pretty serious since I can server virtually anything I want. In the 45 minutes I've held the domain I have served to 341 unique IP addresses. 

Two starbucks.com subdomains are pointed to Azure with an unclaimed CNAME record. Anyone would be able to serve content on these subdomains.

##svcgatewayloadus.starbucks.com
```
;; Server: 1.1.1.1:53
;; Size: 191
;; Unix time: 1531965036
;; ->>HEADER<<- opcode: QUERY, status: NXDOMAIN, id: 3697
;; flags: qr rd ra ; QUERY: 1, ANSWER: 1, AUTHORITY: 1, ADDITIONAL: 0

;; QUESTION SECTION:
svcgatewayloadus.starbucks.com. IN A

;; ANSWER SECTION:
svcgatewayloadus.starbucks.com. 600 IN CNAME s00197tmp0crdfulload0.trafficmanager.net.

;; AUTHORITY SECTION:
trafficmanager.net. 30 IN SOA tm1.msft.net. hostmaster.trafficmanager.net. 2003080800 900 300 2419200 30

```

##svcgatewaydevus.starbucks.com
```
;; Server: 9.9.9.9:53
;; Size: 156
;; Unix time: 1531965036
;; ->>HEADER<<- opcode: QUERY, status: NXDOMAIN, id: 47788
;; flags: qr rd ra ; QUERY: 1, ANSWER: 1, AUTHORITY: 1, ADDITIONAL: 0

;; QUESTION SECTION:
svcgatewaydevus.starbucks.com. IN A                                                                                                                                                            

;; ANSWER SECTION:
svcgatewaydevus.starbucks.com. 600 IN CNAME s00197tmp0crdfuldev0.trafficmanager.net.                                                                                                           

;; AUTHORITY SECTION:
trafficmanager.net. 30 IN SOA tm1.msft.net. hostmaster.trafficmanager.net. 2003080800 900 300 2419200 30
```

#PoC:
http://svcgatewayloadus.starbucks.com/
http://svcgatewaydevus.starbucks.com/

##Mitigation:
Remove the CNAME record from the starbucks.com DNS zone
Claim it in Azure once I release it

## Impact

Subdomain takeover can be used for several purposes:

* Malware
* Phishing / Spear phishing
* XSS
* Authentication bypass

## Timeline

- **2018-07-19** @blurbdust: Whoops, I forgot the access log has a timestamp. 1603 requests but only 29 unique IPs.
- **Report Filed**
- **2018-07-19** @chemex: Thank you for your submission! Your report has been validated, and it has been submitted to the appropriate remediation team for review. They will let the HackerOne triage team know the final ruling on this report, and if/when a fix will be implemented. The HackerOne triage team will follow-up after the remediation team has assessed the impact of this report. Please note that the status and severity are subject to change.
- **Report Triaged**
- **Report Severity Updated**
- **Bounty Awarded**
- **2018-07-19** @blurbdust: Wow, thank you so much for the huge bounty! I'll keep an eye on this page and release it whenever instructed.
- **Report Resolved**
- **2018-07-20** @blurbdust: Released! Do you need anything else from me? Also would it be possible to disclose this publicly?
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
