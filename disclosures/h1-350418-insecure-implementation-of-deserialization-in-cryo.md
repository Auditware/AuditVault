---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/code-injection
  - env/web
  - stack/node
substate: "resolved"
weakness: "Code Injection"
enriched: true
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
