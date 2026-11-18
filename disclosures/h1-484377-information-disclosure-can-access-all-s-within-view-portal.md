---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2019-10-08
submitted: 2019-01-23T01:42:53.755Z
bounty_usd: null
votes: 7
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "archang31"
source: "https://hackerone.com/reports/484377"
title: "Information Disclosure (can access all ███s) within ███████ view █████████ Portal"
---
# Information Disclosure (can access all ███s) within ███████ view █████████ Portal

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 7 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2019-10-08

- Report: [https://hackerone.com/reports/484377](https://hackerone.com/reports/484377)
- CWE: Information Disclosure
- Submitted: 2019-01-23T01:42:53.755Z

## Report summary

An information disclosure vulnerability was discovered on a DoD system.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:** Once ███████ authenticated (I did not mess around to see if I could reproduce without authentication), any user can view any ██████████ simply by changing the offasgid HTTP GET parameter value in the ██████ view █████████ portal link.

**Description:**
I was looking through my previous ███████s and noticed I was receiving urls like https://█████████/portal/viewrfo.aspx?offasgid=MjAwODAyMTg1Nw== . This url is clearly expecting a HTTP GET parameter offasgid with some base64 encoded value. Decoding this value, you get 2008021857 . The █████ in question was my first █████ from February 2008. From testing several IDs, I determined the format is {year}{██████████ #} so 2008, ████████ # 021857.  I simply incremented this value to 2008021858, base64 encoded this value, and browsed to https://███/portal/viewrfo.aspx?offasgid=MjAwODAyMTg1Ng==  . Here, I was able to see ███████.  I also tested the next value ( https://███/portal/viewrfo.aspx?offasgid=MjAwODAyMTg1NQ== ) and got █████. Finally, I opened a new private browser window (so no cookies) and browsed directly to that last link. I had to reauthenticate, but I then was able to directly assess ██████████. At this point, I stopped interacting with the website to submit this vulnerability. 

NOTE: I did not save any record of these ███████s outside except the single attached screenshot.
NOTE2: I tried a couple more values during this write-up to better understand the ID. I initially thought the 02 from 2008021858 was the month {year}{month}{id} but its just {year}{id}. I used 2018000001 and ended up with an ████████ from 20171001 (the very first day of the 2018 fiscal year). I also tested a couple IDs to see how far back the data goes. I used 1999000001 to pull an ██████ from 19980327. I believe this is the very first █████ in the system. I tried 1997000001 as well, and it simply returned a blank ████ (i.e. the ID does not exist).

## Impact
In a relatively simple and predictable manner (due to the sequential IDs), any user with access to █████ can incrementally view every ███ issued by ████████ dating back to 1998. This data includes SSN last 4, EFMP information, branch, and assignment information. From this data, one can extract all sorts of information about the U.S. █████████ personnel including total ██████████ strength, ████ strength by branch, assignment history, strength by base, etc.

## Step-by-step Reproduction Instructions

1. Log into ██████████ (https://███.██████████.███████.mil/)
2. Browse to any █████████ you want to view like https://████/portal/viewrfo.aspx?offasgid=MjAxOTAxMDg2NQ== if you want to view my most recent ███.
3. Modify offasgid value as desired to view any other ███████ (they seem to be incrementing IDs by year)

## Product, Version, and Configuration (If applicable)

## Suggested Mitigation/Remediation Actions
First, the offasgid needs to be random and not a predictable value. Secondly, there needs to be some access check based on the provided cookie (user credentials) to ensure that user should be able to access that record.

## Impact

In a relatively simple and predictable manner (due to the sequential IDs), any user with access to ████ can incrementally view every ███████ issued by ██████ dating back to 1998. This data includes SSN last 4, EFMP information, branch, and assignment information. From this data, one can extract all sorts of information about U.S. ████ personnel including total ███ strength, ████████ strength by branch, assignment history, strength by base, etc.

## Timeline

- **Report Filed**
- **2019-01-23** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **Report Needs More Info**
- **Report New**
- **2019-01-29** @ag3nt-j1: Not a problem, thanks for taking a second look for me.  Looked like it was resolved but as you have a record in there I wanted to make sure you couldn't pivot from that point.  Usually high and critical findings get pretty fast turnaround.  Low level stuff, like low STIG and SRG findings tend to take much longer.
- **Report Triaged**
- **Report Resolved**
- **2019-02-01** @archang31: Can I have permission to disclose this vulnerability? I would like to share it with some of my peers to remind them of the vuln program and to show how quickly issues get fixed when reported.
- **2019-02-01** @ag3nt-j1: Damn straight you can and I'd recommend it.  Well written reports like yours are good to share with your peers but also other researcher that are just starting out.
- **2019-02-01** @ag3nt-j1: Did it for you.  Expect this to get processed beginning of next week, I'll need to review and redact.
- **2019-02-06** @archang31: I did not realize agreeing on my end would fully disclose it immediately. The report still contains some names and PII (last 4) that should be redacted.
- **2019-02-07** @ag3nt-j1: @archang31, I had no idea initiating the disclosure request on my end would give you an option to accept and have the full report published.  Report was placed in limited disclosure while we get this straightened out.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
