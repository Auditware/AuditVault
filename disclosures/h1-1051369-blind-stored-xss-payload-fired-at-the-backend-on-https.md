---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - vuln/xss-stored
  - vuln/xss
  - impact/credential-theft
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2021-03-24
submitted: 2020-12-05T21:27:52.228Z
bounty_usd: null
votes: 33
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "nagli"
source: "https://hackerone.com/reports/1051369"
title: "Blind Stored XSS Payload fired at the backend on https://█████████/"
---
# Blind Stored XSS Payload fired at the backend on https://█████████/

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 33 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2021-03-24

- Report: [https://hackerone.com/reports/1051369](https://hackerone.com/reports/1051369)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2020-12-05T21:27:52.228Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
I have just gotten an email notification from my XSSHunter payload that my blind stored XSS has been triggered by an administrator on the █████████ site, in the following URL:

```javascript
https://█████/████
```

Admin IP address: 
████████

User-Agent:
█████████

Cookies:
```javascript
██████
```
Injection Image:

███████

DB Creds exposed:

██████████.█████\█████a

## Suggested Mitigation/Remediation Actions

Sanitizing the input on the back-end as well

##Best Regards
nagli

## Impact

Ability to capture administrator action when preforming activities on the back-end.
Extractions of DB credentials.
Access to private information.
Stealing the cookies of the administrator.

## Timeline

- **Report Filed**
- **2020-12-05** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Title Updated**
- **2020-12-05** @nagli: The injection point was from an exam that I have taken here:
https://███████/
- **Report Needs More Info**
- **Report New**
- **2020-12-07** @nagli: @agent-j5

You could just ask the administrator to go again to 

https://████/████

And my payload will trigger.
- **2020-12-07** @agent-j5: @nagli   Just wanted to give you a quick update, I am attempting to reproduce your findings but when submitting the evaluation it fails to submit.  I will attempt it again later in the day to see if I get different results.
- **2020-12-07** @nagli: @agent-j5 
Can you share the video / do you have a point of contact to access the internal page?
- **2020-12-07** @agent-j5: This is a screenshot of what I get when I submit the evaluation.  We do not have direct contact with the page admins as we only validate the reports.  I will continue trying to submit later in the day but have to do the eval all over and as you know you can't copy and paste the answers in on the site.
- **2020-12-07** @nagli: I see,
But anyway I have supplied enough information that should be valid for triage I assume.
- **2020-12-07** @agent-j5: @nagli , I just wanted to let you know I was finally able to submit my eval.  Just waiting on them to hit my xsshunter.  With this being a high severity I wanted to do my due diligence before passing it forward.
- **2020-12-07** @nagli: @agent-j5

Sweet, just for you to know that it took 2 month for my payload to fire.

And if escelation with the creds I dumped could be made with the owners I think the severity could rise to critical.

Thanks 🕵️
- **2020-12-07** @agent-j5: @nagli 
If it doesn't fire for me by end of today I will check with managers to see if I can forward it based on what you have posted here.  I don't want to hold it up if it took that long to fire for you.
- **2020-12-07** @nagli: @agent-j5

Sure, I really doubt it.
I have supplied the exact affected URI,so reproducing it should be easy.

Thanks.
- **Report Severity Updated**
- **Report Triaged**
- **2020-12-14** @nagli: Just to let you know it fired again from the same location, different ip.

█████
- **2020-12-23** @nagli: @agent-j5
Hi, it fired another 15 times today.
And it showed me a new endpoint where you can actually see my payloads:

https://██████/████

I think this is authentication bypass as well because i can see all the surveys ever taken in an endpoint which should be authenticated.
Should I report it as another issue?
- **2020-12-23** @nagli: There is also probably SQLI on that page

{█████████:}
- **2020-12-23** @agent-j5: Thank you for the updates, it has yet to fire for me but as you said it took a long time for you.  As you know it can take a long time for them to fix this issue but you will be updated as soon as it is resolved.
- **2020-12-23** @nagli: @agent-j5
Now with the new endpoint you can verify for yourself, just complete any test and inject it on the notes, go to the https://█████/███████ and you can execute it.
- **2020-12-23** @agent-j5: Thank you, it is already triaged and when they work on it this will make testing easier.
- **Report Informative**
- **2020-12-23** @nagli: @agent-j5
You made a mistake
- **Report Reopened**
- **Report Triaged**
- **Report Needs More Info**
- **Report New**
- **Report Resolved**
- **Agreed On Going Public**
- **2021-03-19** @agent-l8: we get it, we are often used as a platform to get invited to paid- but much appreciated when good hunters come back to us :) disclosure added to queue
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
