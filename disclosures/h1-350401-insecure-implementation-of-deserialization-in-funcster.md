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
date: 2018-06-15
submitted: 2018-05-11T10:44:16.888Z
bounty_usd: null
votes: 7
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "greendog"
source: "https://hackerone.com/reports/350401"
title: "Insecure implementation of deserialization in funcster"
---
# Insecure implementation of deserialization in funcster

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 7 | **Program:** Node.js third-party modules | **Disclosed:** 2018-06-15

- Report: [https://hackerone.com/reports/350401](https://hackerone.com/reports/350401)
- CWE: Code Injection
- Submitted: 2018-05-11T10:44:16.888Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **2018-05-20** @lirantal: Hi @greendog , 

Thanks a lot for reporting the vulnerability.
I invited the maintainers for the project to join the issue and help triage the report.
- **Report Severity Updated**
- **External User Joined**
- **2018-05-27** @lirantal: Hi @jeffomatic,

Thanks for joining.
Can you confirm the vulnerability described here?
- **2018-05-28** @jeffomatic: Thanks for the heads-up. I agree with the analysis in the bug report...funcster basically does an `eval`, and as with anything of that nature it's going to be susceptible to abuse of the kind detailed in the report. The intent behind this library was to run the deserialize function on output of the serialize function, as opposed to consuming arbitrary user-provided input.

I think the best I can do here is post a warning in the README...this library hasn't been touched in at least five years and I haven't used it for any projects since it was originally written.
- **2018-05-31** @lirantal: @jeffomatic I think that makes sense. Can you add that warning in a visible place, preferably at the top of the README?

@greendog are you ok with this not being disclosed as a vulnerability?
- **Changed Scope**
- **2018-05-31** @greendog: Yeah, it is fine.
- **2018-05-31** @lirantal: Ok thanks.

@jeffomatic can you please move forward with the change and I'll close the report once you updated the README?
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
