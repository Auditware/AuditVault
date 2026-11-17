---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/uncontrolled-resource-consumption
  - env/web
  - stack/node
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
date: 2018-06-27
submitted: 2018-02-26T15:11:42.082Z
bounty_usd: null
votes: 11
cve: "CVE-2018-3767"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "chalker"
source: "https://hackerone.com/reports/319809"
title: "`memjs` allocates and stores buffers on typed input, resulting in DoS and uninitialized memory usage"
---
# `memjs` allocates and stores buffers on typed input, resulting in DoS and uninitialized memory usage

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 11 | **Program:** Node.js third-party modules | **Disclosed:** 2018-06-27

- Report: [https://hackerone.com/reports/319809](https://hackerone.com/reports/319809)
- CWE: Uncontrolled Resource Consumption | CVE: CVE-2018-3767
- Submitted: 2018-02-26T15:11:42.082Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **2018-03-10** @lirantal: Hi @chalker ,

Thanks for reporting this issue.

I was able to reproduce and confirm the issue as you described and will triage this report as vulnerability.
I will invite the package maintainer to this issue.
- **2018-03-10** @lirantal: @chalker I do see the memory and CPU spikes but I also see a message in my console "MemJS SET: Value too large"
- **Report Severity Updated**
- **2018-03-10** @chalker: @lirantal Yes, this is what happens when `.set(… 2e9 …)` is invoked:
1. A large Buffer is allocated
2. memjs tries to set it asynchronously with a callback
3. set fails, the callback displays the error

Between 1 and 3 the Buffer still exists, so if multiple `.set` operations are performed sequentially, it is easy to exhaust all the available memory.
- **2018-03-10** @lirantal: yeah I saw the rise was just wondering if it had any effect.
let's wait for an update from Amit.
- **2018-04-24** @lirantal: @chalker looks like there's a newer version (1.2.0) and it's been already 2 months since we triaged.
How do you feel with disclosing this report?
- **External User Joined**
- **2018-05-11** @lirantal: @o-sl thank you for joining, can you review @chalker's report?
- **2018-05-20** @lirantal: @chalker looks like low activity on this report that's been idle for 3 months.
should we go ahead and disclose?
- **2018-06-15** @lirantal: @chalker another ping on this one
- **2018-06-26** @chalker: @lirantal This is applicable to 1.2.0, nothing looks to be changed in that aspect.
If the maintainers are unresponsive, I am fine with disclosing this.
- **Changed Scope**
- **2018-06-27** @lirantal: Will continue forward with public disclosure then
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
