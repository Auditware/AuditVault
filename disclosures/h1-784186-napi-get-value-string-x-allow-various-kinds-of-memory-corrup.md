---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/memory-corruption-generic
  - env/web
  - stack/node
substate: "resolved"
weakness: "Memory Corruption - Generic"
enriched: true
date: 2020-07-02
submitted: 2020-01-27T16:49:36.768Z
bounty_usd: 250
votes: 7
cve: "CVE-2020-8174"
program: "[[programs/nodejs|Node.js]]"
reporter: "tniessen"
source: "https://hackerone.com/reports/784186"
title: "napi_get_value_string_X allow various kinds of memory corruption"
---
# napi_get_value_string_X allow various kinds of memory corruption

> **Severity:** High | **Bounty:** 250 USD | **Votes:** 7 | **Program:** Node.js | **Disclosed:** 2020-07-02

- Report: [https://hackerone.com/reports/784186](https://hackerone.com/reports/784186)
- CWE: Memory Corruption - Generic | CVE: CVE-2020-8174
- Submitted: 2020-01-27T16:49:36.768Z

## Timeline

- **Report Filed**
- **2020-01-27** @addaleax: I’m not too worried about this being a common case, as most usage of these functions will first figure out the length of the buffer based on the length of the string (like e.g. the node-addon-api code does), but I’m okay with treating this as a security issue.

Would you be okay opening PRs that fix this in the private repository? It should be fairly straightforward to do so.

I think this also means that we’d want to push out new releases for node-addon-api@v1.x and @v2.x? Maybe ping Gabriel when you open the PRs?
- **2020-01-27** @tniessen: > I’m not too worried about this being a common case

I am also convinced that it is not common. But it might still affect real applications, and from my perspective, the implementation violates the general contract of not writing to a zero-length buffer in a dangerous way that can potentially allow targeted memory corruption, up to remote code execution.

> most usage of these functions will first figure out the length of the buffer based on the length of the string

I agree, but even then, OOB access is possible: Assume that `len(string) == 0`. The application probably allocates the buffer using `malloc(0)`, which is not guaranteed to return `NULL`, and may in fact return any pointer, that `napi_get_value_string_*` will then write at least one byte to, even though the string is empty.

> Would you be okay opening PRs that fix this in the private repository? It should be fairly straightforward to do so.

Sure, I can do that.
- **2020-01-27** @mhdawson: @addaleax,   I assume the suggestion to push out new releases of node-addon-api@v1.x and @v2.x is because they included a copy of the related code that was used for version of Node.js that did not yet provide N-API ?  If so we should probalby loop in Nicola Del Gobbo (@NickNaso) as he's being helping with publishing the recent node-addon-api releases.
- **Report Triaged**
- **Report Title Updated**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
- **Bounty Awarded**
