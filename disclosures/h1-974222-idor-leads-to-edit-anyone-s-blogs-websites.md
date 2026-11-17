---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/insecure-direct-object-reference-idor
  - env/web
substate: "resolved"
weakness: "Insecure Direct Object Reference (IDOR)"
enriched: true
date: 2020-11-18
submitted: 2020-09-03T17:41:58.243Z
bounty_usd: null
votes: 177
cve: []
program: "[[programs/automattic|Automattic]]"
reporter: "ali"
source: "https://hackerone.com/reports/974222"
title: "IDOR leads to Edit Anyone's Blogs / Websites"
---
# IDOR leads to Edit Anyone's Blogs / Websites

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 177 | **Program:** Automattic | **Disclosed:** 2020-11-18

- Report: [https://hackerone.com/reports/974222](https://hackerone.com/reports/974222)
- CWE: Insecure Direct Object Reference (IDOR)
- Submitted: 2020-09-03T17:41:58.243Z

## Report summary

If you want to follow me, here is my linkedin & twitter accounts:
https://twitter.com/alicanact60
https://tr.linkedin.com/in/alicanact60

@mygf

## Timeline

- **Report Filed**
- **2020-09-04** @xknown: Thank you for your submission. Your report will be reviewed and we'll get back to you shortly.
- **Report Triaged**
- **2020-09-08** @ali: Thanks! @donncha 

Best Regards,
@mygf
- **2020-09-08** @jgcaruso: Hi there. We've deployed a fix, please try it again and let us know if its resolved.
- **2020-09-08** @ali: Hello @jgcaruso,
It's still working.   
{F980478}

Best Regards,
@mygf
- **2020-09-09** @jgcaruso: Hey, sorry about that. I missed in your initial report that there were 2 parameters that could be attacked, not just 1.

I've patched the second one now. Please give it another try.
- **2020-09-09** @ali: Hello @jgcaruso,
It's fixed. :)

Best Regards,
@mygf
- **2020-09-14** @ali: Hey there, @jgcaruso @donncha @xknown
Is there any update?

Best Regards,
@mygf
- **2020-09-16** @ali: Hey there, @jgcaruso @donncha @xknown
Is there any update?

Best Regards,
@mygf
- **Report Resolved**
- **Bounty Awarded**
- **2020-09-16** @ali: Thank you for bounty + bonus @xknown :)

Best Regards,
@mygf
- **2020-09-16** @ali: Also can I ask why did you pay it as Low? That's why I earned only 15 reputations. If you pay it as medium, I earn 25 reputations,  If you pay it as high, I earn 50 reputations. As you know, reputation is very important for hackers @xknown.

Best Regards,
@mygf
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
