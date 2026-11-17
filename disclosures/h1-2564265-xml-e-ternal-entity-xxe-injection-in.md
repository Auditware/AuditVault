---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/xml-external-entities-xxe
  - env/web
substate: "resolved"
weakness: "XML External Entities (XXE)"
enriched: true
date: 2026-01-12
submitted: 2024-06-20T01:33:27.763Z
bounty_usd: null
votes: 8
cve: "CVE-2022-2414"
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "maskedpersian"
source: "https://hackerone.com/reports/2564265"
title: "XML E██████ternal Entity (XXE) Injection in ███"
---
# XML E██████ternal Entity (XXE) Injection in ███

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 8 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2026-01-12

- Report: [https://hackerone.com/reports/2564265](https://hackerone.com/reports/2564265)
- CWE: XML External Entities (XXE) | CVE: CVE-2022-2414
- Submitted: 2024-06-20T01:33:27.763Z

## Timeline

- **Report Filed**
- **2024-06-20** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Vulnerability Information Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2024-06-20** @maskedpersian: Could you please provide the reasoning behind changing the severity of CVE-2022-2414 to Medium?
- **2024-06-22** @maskedpersian: How do you pay for bugs in some reports? Can I be invited to that program?
for e████ample this report ███████ ████
- **2024-06-26** @maskedpersian: I was able to read the etc/passwd file , If possible, please change the sensitivity to high
```
HTTP/1.1 400 Bad Request
Date██████ ██████ █████ GMT
Server████████ Apache
Content-Type█████████ application/██████████ml
Content-Length███ 4920
Connection███████ close

<?████████ml version="1.0" encoding="UTF-8" standalone="yes"?><PKIE██████████ception><Attributes/><ClassName>com.netscape.certsrv.base.BadRequestE███████ception</ClassName><Code>400</Code><Message>Profile root████████████████████0██████0███root███████/root███/bin/bash\nbin████████████████1███████1█████████bin█████/bin████/sbin/nologin\ndaemon██████2███████2██████daemon████████/sbin█████████/sbin/nologin\nadm█████████████3█████████4████adm███/var/adm█████████/sbin/nologin\nmail██████████████████████████mail██████████/var/spool/mail████████/sbin/nologin\noperator████████11██████████0████operator█████/root██████████/sbin/nologin\nnobody██████████████Nobody█████████/██████/sbin/nologin\navahi-autoipd████████████████████████Avahi IPv4LL Stack█████/var/lib/avahi-autoipd████/sbin/nologin\ndbus████████████System message bus███/████/sbin/nologin\nabrt████████████████etc/abrt███████/sbin/nologin\n███████████████████9██████████8███████User for ████████████/████████/sbin/nologin\nunbound████████████998███997██████████Unbound DNS resolver████/etc/unbound█████/sbin/nologin\nlibstoragemgmt█████████████████997██████996████████daemon account for libstoragemgmt████████/var/run/lsm██████████/sbin/nologin\ntss███████████████████████████Account used by the trousers package to sandbo█████ the tcsd daemon██████████/dev/null█████/sbin/nologin\nntp███████etc/ntp██████/sbin/nologin\npostfi█████████████████var/spool/postfi███████████████/sbin/nologin\nsshd██████████████74███74██████████Privilege-separated SSH██████████/var/empty/sshd████████/sbin/nologin\nchrony████████var/lib/chrony██████/sbin/nologin\nsystemd-bus-pro█████y████████████████████████████systemd Bus Pro██████y████████/████/sbin/nologin\nsystemd-network████████████████████systemd Network Management████████/██████████/sbin/nologin\nrpc█████████████████Rpcbind Daemon████████/var/lib/rpcbind███████/sbin/nologin\npuppet██████████████████████Puppet█████/var/lib/puppet███████/sbin/nologin\nnagios█████████home/nagios████████/bin/bash\n█████████████home/████████████/sbin/nologin\███home/██████████████████/sbin/nologin\n████████home/███████/sbin/nologin\█████home/███████████████/sbin/nologin\███████████████████████home/██████████/sbin/nologin\██████████home/███████████/sbin/nologin\nsssd████████████████████████████990██████User for sssd█████████/██████/sbin/nologin\n██████████████████████PIZZULLO.JOSEPH.T.1264435060██████████/home/█████████████/bin/bash\n██████████████████████████home/███████████████/sbin/nologin\nwstark██████████home/wstark█████████/sbin/nologin\newinters████████████████████/home/ewinters██████/sbin/nologin\n██████████████████████████████/home/█████████████████/sbin/nologin\n█████████home/█████████/sbin/nologin\n█████████████████████████████████ACAS Scanner██████/home/████████████/bin/bash\n███████████████████████████████████SANCHEZ.DIANA.L.1040930155█████/home/████████/bin/bash\nnfast████████████992████████989██████nfast driver service account█████████/opt/nfast███/bin/bash\napache█████████████Apache████████/usr/share/httpd███/sbin/nologin\nhsqldb█████████var/lib/hsqldb███████/sbin/nologin\ntomcat████████████Apache Tomcat██████████/usr/share/tomcat█████████/bin/nologin\n███████████████████████████████████████Certificate System██████/usr/share/████████/sbin/nologin\n███████████████home/████████/sbin/nologin\n████████████████████████████home/███████████/sbin/nologin\n████-sw-██████████████████████████████████████████PKI user account for instance sw-ca-54█████/home/████████-sw-ca-54████/sbin/nologin\n████████-sw-ca-56███████████████PKI user account for instance sw-ca-56██████████/home/█████-sw-ca-56███████/sbin/nologin\n████████-sw-███████PKI user account for instance sw-ca-58█████/home/███-sw-ca-58██████████/sbin/nologin\n█████████████████ALEXANDER.BRYAN.DOUGLAS.1165971600█████/home/█████████████/bin/bash\n██████████████████████████████home/█████████████████/sbin/nologin\n█████████████████████home/██████████████████/sbin/nologin\n████████████home/███████████/sbin/nologin\nrlamotte█████████home/rlamotte█████████/sbin/nologin\ngdunn███home/gdunn████████/sbin/nologin\n███████home/████████/sbin/nologin\n█████████tech███home/████████tech███████/bin/bash\ninsights████████████████████████Red Hat Insights████/var/lib/insights█████/sbin/nologin\nafederico███████home/afederico███████/sbin/nologin\n█████████████home/████████████/sbin/nologin\n████████████████████████/home/████████████████/sbin/nologin\n████████-email-██████████'Certificate System'█████/usr/share/████████████/sbin/nologin\n██████████-id-███████████████'Certificate System'██████████/usr/share/██████████████/sbin/nologin\n███-sw-████████'Certificate System'██████████/usr/share/████████/sbin/nologin\n██████-sw-███████████'Certificate System'██████/usr/share/███████/sbin/nologin\naes████████████1043███████1043███Account used to host DTM OCSP certificates███████/home/aes█████/bin/bash\nredhat██████1044█████1044████Account used to run AES webserver█████████/home/redhat███████/bin/bash\nmagency██████████████1045█████1045█████████Service Account████████/home/magency██████████/bin/bash\n█████████████████████████████████████████/home/████████████████/sbin/nologin\n████████████████████████████████████████████████/home/███████████████████/sbin/nologin\n████████████████████████████████████████████████/home/████████████████████/sbin/nologin\n███████████████████████/home/█████████████/sbin/nologin\n██████████████████████████████████████MULLIN.TIMOTHY.HUGH.1180218110█████████/home/█████████████/bin/bash\n██████████████████████████████████████████/home/███████████/sbin/nologin\n██████████████████████████NOVACK.BARRY.FRANCISE.1027795079███████/home/████████████/bin/bash\n██████████████████████████████████POWELL.JAY.A.1162634875████████/home/████████/bin/bash\n██████████████████████████████████DOWNUM.ALEXANDER.JEFFERY.1257465523███████/home/███████████████/bin/bash\nncsnmpd███████████1055██████1055█████████nCipher crypto management██████/opt/nfast██████/bin/bash\n█████████████████████SUBIA.JOSE.A.1264627598████/home/███████████████/bin/bash\n██████████12345███████████/home/████████████/bin/false\n Not Found</Message></PKIE█████████ception>
```
- **Report Severity Updated**
- **2024-06-26** @marmelade321: Greetings,

We typically only offer bounties when we are running an event. The report that you referenced was apart of a sponsored event. I would suggest monitoring our twitter page ███████ and hackerone for upcoming events.

Regards.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
