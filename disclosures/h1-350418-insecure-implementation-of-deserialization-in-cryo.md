---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/code-injection
  - env/web
  - stack/node
  - vuln/command-injection
  - vuln/code-injection
  - vuln/deserialization
  - vuln/dos
substate: "resolved"
weakness: "Code Injection"
enriched: true
body: true
date: 2018-06-19
submitted: 2018-05-11T12:05:58.528Z
bounty_usd: null
votes: 8
cve: "CVE-2018-3784"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "greendog"
source: "https://hackerone.com/reports/350418"
title: "Insecure implementation of deserialization in cryo"
---
# Insecure implementation of deserialization in cryo

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 8 | **Program:** Node.js third-party modules | **Disclosed:** 2018-06-19

- Report: [https://hackerone.com/reports/350418](https://hackerone.com/reports/350418)
- CWE: Code Injection | CVE: CVE-2018-3784
- Submitted: 2018-05-11T12:05:58.528Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report code injection in serialization package cryo
It allows execute arbitrary code using custom prototype.

# Module

**module name:** cryo
**version:** 0.0.6
**npm page:** `https://www.npmjs.com/package/cryo`

## Module Description

JSON on steroids.
Built for node.js and browsers. Cryo is inspired by Python's pickle and works similarly to JSON.stringify() and JSON.parse(). Cryo.stringify() and Cryo.parse() improve on JSON in these circumstances:

## Module Stats

37 downloads in the last week

# Vulnerability

## Vulnerability Description

If an application uses "cryo" package to deserialize JSON into an object and interacts with the object later in the code (convert to sting, for example) and if an attacker controls this JSON, then the attacker can get arbitrary code execution in the application.

To reconstruct an object from JSON, cryo uses square bracket notation ( `obj[key]=value` ). So there is an opportunity for an attacker to change `__proto__` property for a new object. Also Cryo supports serialization of functions, so the attacker can set their own methods (toString, valueOf) for the new object.
It means that if later in the code the application interacts with the new object in the way which leads to invocation of the object's prototype functions, then the attacker malicious code are executed.


## Steps To Reproduce:

PoC:
```
var Cryo = require('cryo');
var frozen = '{"root":"_CRYO_REF_3","references":[{"contents":{},"value":"_CRYO_FUNCTION_function () {console.log(\\"defconrussia\\"); return 1111;}"},{"contents":{},"value":"_CRYO_FUNCTION_function () {console.log(\\"defconrussia\\");return 2222;}"},{"contents":{"toString":"_CRYO_REF_0","valueOf":"_CRYO_REF_1"},"value":"_CRYO_OBJECT_"},{"contents":{"__proto__":"_CRYO_REF_2"},"value":"_CRYO_OBJECT_"}]}'
var hydrated = Cryo.parse(frozen);
console.log(hydrated);
```
console.log internally calls hydrated's vauleOf method, so an attacker's code are executed and we can see "defconrussia" in console.

## Patch

I suggest to blacklist "__proto__" property in deserialization process.

## Supporting Material/References:

- Ubuntu 16.04
- node v6.11.3
- npm 5.5.1

# Wrap up

- I contacted the maintainer to let them know: N
- I opened an issue in the related repository: N


> Hunter's comments and funny memes goes here
Also I found a couple of other modules (for example, https://www.npmjs.com/package/kaiser)  which use square bracket notation too, so it's possible to rewrite `__proto__` with them too. But us they don't support serialization of functions, we cannot use the same attack as described here. Still we can set wrong values for prototype's methods, so if an application tries to convert a new object (deserialized from JSON) to string, it may crash with a TypeError exception.
It could be a kind of DoS.  What do you think if I should create similar reports for such cases?

## Impact

An attacker can craft a special JSON file with malicious code which rewrites `__proto__` of a new object. In some circumstances it may lead to execution of the code, so the attacker can achieve OS command execution.

## Timeline

- **Report Filed**
- **2018-05-20** @lirantal: Hi @greendog,  

Thanks a lot for reporting the vulnerability.
I invited the maintainers team to join the conversation and triage the issue.
- **Report Triaged**
- **Report Severity Updated**
- **2018-05-31** @lirantal: @greendog I haven't been able to reproduce the result from the POC you provided. I just get a log output for an empty object.
- **2018-05-31** @lirantal: Nevermind, that's actually reproduced in earlier Node.js versions up until 8.9.4
- **Changed Scope**
- **2018-05-31** @greendog: @lirantal Do you know what has changed in the newer version? May be `__proto__` is not supported anymore?
I need to check it.
- **2018-05-31** @lirantal: I believe there was a similar issue related to __proto__ handling indeed but not sure it's affecting this or not. Let me know what you come up with.
- **2018-06-06** @greendog: I've checked it. Actually, deserialization works in the same way in newer versions. `__proto__` is supported and accessible and it is changed after deserialization. The only difference is that `console.log(hydrated);` doesn't call `valueOf()` internally. But if there is a concatenation or something similar, then `valueOf()` is called and our code is executed. For example, `console.log(hydrated + " - anything");`
- **2018-06-06** @lirantal: ahh interesting.
I opened an issue in the repo to see if we can get attention from maintainers to join the discussion. Otherwise I'll go proceed with a public disclosure.
- **2018-06-06** @greendog: Ok!
And what about other modules which use square bracket notation too (look at "Hunter's comments" paragraph)? Do you think it's a security issue? Because I'm not sure if there is impact or not
- **2018-06-06** @lirantal: We might end up with a lot of modules like that and it would probably fall under a category of bad coding practices than pure security so I'm not sure I'd hunt these stuff at the moment.
- **2018-06-06** @greendog: I fully agree. Btw, i'm going to write an article about that, to give more attention to `__proto__`-stuff.
- **2018-06-06** @lirantal: Sounds great!
Ping me when you do and I'll do my best to share it in social media and promote awareness.
- **Report Resolved**
- **Agreed On Going Public**
- **2018-06-19** @greendog: @lirantal Ok! And here is the article https://www.acunetix.com/blog/web-security-zone/deserialization-vulnerabilities-attacking-deserialization-in-js/
- **Agreed On Going Public**
- **Report Became Public**
