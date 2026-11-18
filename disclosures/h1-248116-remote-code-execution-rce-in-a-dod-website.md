---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/code-injection
  - env/web
  - vuln/code-injection
  - impact/rce
substate: "resolved"
weakness: "Code Injection"
enriched: true
body: true
date: 2019-10-04
submitted: 2017-07-10T22:22:00.839Z
bounty_usd: null
votes: 84
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "manoelt"
source: "https://hackerone.com/reports/248116"
title: "Remote Code Execution (RCE) in a DoD website"
---
# Remote Code Execution (RCE) in a DoD website

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 84 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2019-10-04

- Report: [https://hackerone.com/reports/248116](https://hackerone.com/reports/248116)
- CWE: Code Injection
- Submitted: 2017-07-10T22:22:00.839Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
One of the DoD applications uses a java library which is vulnerable to expression language injection. Using only an URL I was able to inject java code. I made a simple PoC that requests a name resolution to a DNS server.

**Description:**
The application at https://███ uses Primefaces version 5.3 which is vulnarable to Expression Language injection through DynamicContent generator.

To prove the injection I made a PoC that tries to submit a HTTP request, but the server blocks the outgoing packets on port 80, on the other hand the server still try to resolve the requested domain and so I receive DNS requests from DoD server. Also, I can delete and maybe read files using the File Java class, but I decided not to try to avoid leak of some private data.

## Impact
Critical.

## Step-by-step Reproduction Instructions

First you need to execute the program attached to generate the payload. To do that you just need the Primefaces-5.3.jar (https://www.primefaces.org/downloads/ ) in your class path.

1. With the code attached generate the payload encrypted with the default key "primefaces". Change the domain (String remoteMalJarUrl) to one that you have control or use one from http://dnsbin.zhack.ca/
2. With the payload from #1, append to the URL: https://████/javax.faces.resource/dynamiccontent.properties.xhtml?pfdrt=sc&ln=primefaces&pfdrid=
3. Send a GET request using curl (curl -vk https://████/javax.faces.resource/dynamiccontent.properties.xhtml?pfdrt=sc&ln=primefaces&pfdrid=<YOUR_PAYLOAD_HERE>
4. You will receive a name resolution request for remoteMalJarUrl from the DoD application

We could use this DNS request to exfiltrate data from the server. And as I said, theoretically I could also delete files from the server using the File class.

## Product, Version, and Configuration (If applicable)
Primefaces 5.3

## Suggested Mitigation/Remediation Actions
- Update Primefaces
- Alternatively by filtering incoming requests with pfdrid parameter (value longer than 16bytes and Base64 encoded) and "pfdrt=sc" is possible to mitigate the attack: "pfdrt=sc" calls the vulnerable StreamedContent Method and pfdrid contains the exploit payload. 

## References
http://blog.mindedsecurity.com/2016/02/rce-in-oracle-netbeans-opensource.html
https://github.com/primefaces/primefaces/issues/1152

## Timeline

- **Report Filed**
- **2017-07-10** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **2017-09-13** @opimentelsei: @manoelt 
Greetings,

We have been advised that the vulnerability you reported has been resolved. Before we close this report, we would appreciate it if you could confirm that the vulnerability no longer exists.

If we do not receive a response within two weeks, we will send you a second request. If we do not receive a response from you within two weeks of the second notice, we will close this report as resolved.

If you do not believe this vulnerability has been effectively resolved or if you have any questions, please let us know.

Thank you for your time and effort to improve the security of the DoD information network.

Regards,

The VDP Team
- **2017-09-27** @opimentelsei: @manoelt 
Greetings,

We previously sent a request asking you to confirm that the vulnerability you reported has been resolved. We would like your confirmation before closing this report.

If we do not receive a response to this second request within two weeks, we will close this report as resolved.

If you do not believe this vulnerability has been effectively resolved or if you have any questions, please let us know.

Thank you for your time and effort to improve the security of the DoD information network.

Regards,

The VDP Team
- **2017-09-30** @manoelt: @opimentelsei 
I think it is fixed now. I can't reproduce anymore.
- **2017-10-02** @opimentelsei: @manoelt 
How did you find out the version it was running?
- **2017-10-02** @manoelt: @opimentelsei 
Just look at source code: view-source:https://██████/users/forgotPassword.xhtml

You will see: <script type="text/javascript" src="/javax.faces.resource/jquery/jquery.js.xhtml?ln=primefaces&amp;v=6.0">

"v=6.0" is the Primefaces version.
- **Report Resolved**
- **Agreed On Going Public**
- **2017-11-21** @manoelt: @opimentelsei Could we disclose this report publicly?
- **2018-04-18** @manoelt: Could we disclose this report publicly?
- **2018-04-18** @agent-0g: @manoelt Unfortunately, not yet.  We are in the final steps to standardize the disclosure process and working through the researchers requests, including your report.  Thanks again for your patience.
- **2019-06-26** @manoelt: Could we disclose this report publicly?
- **2019-06-26** @agent-0g: @manoelt Right now we have an enourmous backlog of disclosures to process and, looking at the list, your's will probably be processed by sometime next week. Sorry for the huge delay but, your patience is appreciated.
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
