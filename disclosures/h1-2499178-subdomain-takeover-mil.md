---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2024-06-27
submitted: 2024-05-10T13:23:09.111Z
bounty_usd: null
votes: 64
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "martinvw"
source: "https://hackerone.com/reports/2499178"
title: "Subdomain takeover ████████.mil"
---
# Subdomain takeover ████████.mil

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 64 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2024-06-27

- Report: [https://hackerone.com/reports/2499178](https://hackerone.com/reports/2499178)
- CWE: Improper Access Control - Generic
- Submitted: 2024-05-10T13:23:09.111Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Description:**

The subdomain `█████.mil` is pointing to `peosol-lg.███████.`, the domain `██████` is currently available for registration as can be seen at https://www.godaddy.com/nl-nl/domainsearch/find?domainToCheck=█████

Given the rules, residency of the US, of the `us`-tld I decided not to register the domain, also I do believe the output to be enough.

## References

## Impact

Using this vulnerability an attacker can:
- host unwanted/malicious content under your domain
- receive email on subdomains mentioned above
- effectively execute cross-site scripting attacks
- in some cases, steal cookie data
- in some cases, trick password managers into filling passwords

## System Host(s)
██████████.mil

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
See the DIG output:

```
√ martinvw@denali:~/src > dig █████.mil

; <<>> DiG 9.10.6 <<>> ████.mil
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NXDOMAIN, id: 44977
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 1, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 512
;; QUESTION SECTION:
;█████████.mil.			IN	A

;; ANSWER SECTION:
██████████.mil.		3600	IN	CNAME	peosol-lg.███.

;; AUTHORITY SECTION:
us.			900	IN	SOA	a.cctld.us. admin.tldns.godaddy. 1715345748 1800 300 604800 1800

;; Query time: 166 msec
;; SERVER: 8.8.8.8#53(8.8.8.8)
;; WHEN: Fri May 10 15:06:32 CEST 2024
;; MSG SIZE  rcvd: 148
```

And the GoDaddy page: https://www.godaddy.com/nl-nl/domainsearch/find?domainToCheck=███

And whois:

```
√ martinvw@denali:~/src > whois ████████.
% IANA WHOIS server
% for more information on IANA, visit http://www.iana.org
% This query returned 1 object

refer:        whois.nic.us

domain:       US

organisation: Registry Services, LLC
address:      100 S. Mill Ave, Suite 1600
address:      Tempe AZ 85281
address:      United States of America (the)

contact:      administrative
name:         IANA Contact
organisation: Registry Services, LLC
address:      100 S. Mill Ave, Suite 1600
address:      Tempe AZ 85281
address:      United States of America (the)
phone:        +1 480 505 8800
fax-no:       +1 480 393 4275
e-mail:       iana@about.us

contact:      technical
name:         IANA Contact
organisation: Registry Services, LLC
address:      100 S. Mill Ave, Suite 1600
address:      Tempe AZ 85281
address:      United States of America (the)
phone:        +1 480 505 8800
fax-no:       +1 480 393 4275
e-mail:       iana@about.us

nserver:      B.CCTLD.US 156.154.125.70 2001:502:ad09:0:0:0:0:29
nserver:      F.CCTLD.US 2001:500:3682:0:0:0:0:11 209.173.58.70
nserver:      K.CCTLD.US 156.154.128.70 2001:503:e239:0:0:0:3:1
nserver:      W.CCTLD.US 2001:dcd:1:0:0:0:0:15 37.209.192.15
nserver:      X.CCTLD.US 2001:dcd:2:0:0:0:0:15 37.209.194.15
nserver:      Y.CCTLD.US 2001:dcd:3:0:0:0:0:15 37.209.196.15
ds-rdata:     59017 8 2 7daf469d42b5d8e5537fd4dd4b6057710e9a61f72c32eb7fb6526f52277ec2b0

whois:        whois.nic.us

status:       ACTIVE
remarks:      Registration information: http://www.nic.us

created:      1985-02-15
changed:      2024-04-16
source:       IANA

# whois.nic.us

No Data Found
URL of the ICANN Whois Inaccuracy Complaint Form: https://www.icann.org/wicf/
>>> Last update of WHOIS database: 2024-05-10T13:10:37Z <<<
```

## Suggested Mitigation/Remediation Actions
Remove CNAME record █████████.mil

## Timeline

- **Report Filed**
- **2024-05-10** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **Report Vulnerability Types Updated**
- **Report Resolved**
- **Agreed On Going Public**
- **2024-05-30** @agent-p1: Greetings!
@martinvw  Because of this report you have been selected as our Researcher of the Month. Would you like your name to be on the certificate that is tweeted out? If so, would you provide me your name for that? Do you have a twitter handle for us to tag you in? If you do not, or would not like to, then we would use you Hackerone username. Thank you!
Regards,
The DoD VDP team
- **2024-05-30** @martinvw: Thanks!

My real name is Martin van Wingerden and have the same twitter handle so @martinvw should work.
- **2024-06-07** @martinvw: @agent-p1 just out of curiosity when will the twee be sent out? Thanks again for the nomination.
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
