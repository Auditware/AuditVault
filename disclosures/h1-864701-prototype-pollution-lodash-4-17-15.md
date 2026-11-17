---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/uncontrolled-resource-consumption
  - env/web
  - stack/node
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
date: 2020-08-21
submitted: 2020-05-02T11:10:22.062Z
bounty_usd: null
votes: 9
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "awarau"
source: "https://hackerone.com/reports/864701"
title: "Prototype Pollution lodash 4.17.15"
---
# Prototype Pollution lodash 4.17.15

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 9 | **Program:** Node.js third-party modules | **Disclosed:** 2020-08-21

- Report: [https://hackerone.com/reports/864701](https://hackerone.com/reports/864701)
- CWE: Uncontrolled Resource Consumption
- Submitted: 2020-05-02T11:10:22.062Z

## Timeline

- **Report Filed**
- **2020-05-02** @awarau: sorry, it should be <twounderscores>proto<twounderscores> 
I haven't worked out the code formatting here yet lol.
- **2020-05-02** @nochnoidozor: Hi @awarau,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@nochnoidozor
- **Report Needs More Info**
- **Report New**
- **2020-05-03** @awarau: I believe you couldn't reproduce it because I'm an idiot and didn't format the PoC correctly. Please try the most recent PoC - with correct formatting. Thank you.
- **2020-05-03** @awarau: If this proves valid, can you also please change the severity from medium to high, to reflect the related bugs and their severity on other reports? Thanks
- **Report Severity Updated**
- **Report Triaged**
- **2020-05-06** @awarau: Awesome. Thanks a bunch @nochnoidozor
- **2020-05-26** @awarau: Is there any update on this? Cheers
- **2020-05-26** @marcinhoppe: @awarau we really appreciate your patience. We are currently working with the maintainer on planning the fix.
- **2020-05-26** @awarau: @marcinhoppe no problem at all! :)
- **2020-07-06** @awarau: Hey is there any plan for a fix? :)
- **2020-07-20** @marcinhoppe: @awarau I can no longer reproduce this with 4.17.19. Can you verify this vulnerability has been properly fixed?
- **2020-07-22** @awarau: Yes! It is indeed fixed. 

```
console.log(test)
            ^

ReferenceError: test is not defined
    at Object.<anonymous> (/Users/apple/Desktop/Programming/bruh.js:4:13)
    at Module._compile (internal/modules/cjs/loader.js:1138:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1158:10)
    at Module.load (internal/modules/cjs/loader.js:986:32)
    at Function.Module._load (internal/modules/cjs/loader.js:879:14)
    at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:71:12)
    at internal/main/run_main_module.js:17:47
```
- **Report Resolved**
- **Agreed On Going Public**
- **2020-07-22** @awarau: Awesome work. May I ask, was this eligible for a bounty?
Cheers
- **Bounty Awarded**
- **Report Became Public**
