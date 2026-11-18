---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/uncontrolled-resource-consumption
  - env/network
  - stack/node
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
body: true
date: 2020-12-16
submitted: 2020-11-12T18:32:25.903Z
bounty_usd: 250
votes: 2
cve: "CVE-2020-8277"
program: "[[programs/nodejs|Node.js]]"
reporter: "zeus1999"
source: "https://hackerone.com/reports/1033107"
title: "DNS Max Responses for DOS"
---
# DNS Max Responses for DOS

> **Severity:** High | **Bounty:** 250 USD | **Votes:** 2 | **Program:** Node.js | **Disclosed:** 2020-12-16

- Report: [https://hackerone.com/reports/1033107](https://hackerone.com/reports/1033107)
- CWE: Uncontrolled Resource Consumption | CVE: CVE-2020-8277
- Submitted: 2020-11-12T18:32:25.903Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

See Github (my issue): https://github.com/nodejs/node/issues/36063


When i try to fetch the A Dns records of following domain: ticbrasil.com.br I dont get any response.
I think thats the case because there are over 1300 responses.

Version: v12.18.4, v14.15.0
Platform: 64-bit Windows 10 Pro & Enterprise

What steps will reproduce the bug?
var dns = require('dns'); dns.resolve4('ticbrasil.com.br', function (err, addresses, family) { console.log(err); console.log(addresses); console.log(family); });

How often does it reproduce? Is there a required condition?
It happends everytime

What is the expected behavior?
https://pastebin.com/Tv53Na89

What do you see instead?
Nothing/No output

## Impact

mmomtchev commented 3 hours ago
@mhdawson someone should contact Mitre or whoever you usually contact, this is a confirmed remote security vulnerability. If an attacker can trigger a DNS resolution for an address chosen by him, then it is exploitable for DoS. It is a very high-risk vulnerability. I don't think a remote access is possible, but this should probably be evaluated by an expert.

@jasnell
 
Member
jasnell commented 2 hours ago
We can look into this further but I have to point out: we have a defined process for properly reporting and investigating potential security vulnerabilities. As soon as this issue was suspected as being a security issue, that process should have been followed with investigation and fixes investigated in the private Node.js repo we use for that purpose, otherwise this ends up risking a zero-day for all Node.js users.

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **2020-11-12** @mhdawson: @zeus1999 do you have some scenarios in mind where an attacker could drigger DNS resolution for an address of their choosing? It would be good to understand how hard/practical this is.
- **2020-11-12** @mhdawson: drigger -> trigger
- **2020-11-12** @mcollina: I don't really understand how this is a security vulnerability, or how it could be exploited.

Running the code I get:

```
\Error: queryA ENODATA ticbrasil.com.br
    at QueryReqWrap.onresolve [as oncomplete] (node:dns:203:19) {
  errno: undefined,
  code: 'ENODATA',
  syscall: 'queryA',
  hostname: 'ticbrasil.com.br'
}
```

Where is the Denial of Service attack?

It is a bug, I just do not see the exploit.
- **2020-11-12** @mhdawson: I can recreate a crash on Linux with 14.10.0 from the Download site, about 1/4 runs with the test provided.

user1@user1-VirtualBox:~/testvuln/node-v14.15.0-linux-x64/bin$ ./node ../../test.js
Segmentation fault (core dumped)
- **2020-11-12** @mhdawson: Sorry that should have  been Linux with v14.15.0
- **2020-11-13** @mhdawson: @zeus1999 as an FYI I moved your issue to a private repo to limit visibility while we line up fixes/release. We an restore one we've got releases out.
- **2020-11-16** @mhdawson: This was part of the recent security releases: https://nodejs.org/en/blog/vulnerability/november-2020-security-releases/
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
- **Bounty Awarded**
