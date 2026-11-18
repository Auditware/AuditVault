---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/heap-overflow
  - env/web
  - stack/node
substate: "resolved"
weakness: "Heap Overflow"
enriched: true
body: true
date: 2020-02-13
submitted: 2018-04-10T15:22:13.135Z
bounty_usd: null
votes: 3
cve: []
program: "[[programs/nodejs|Node.js]]"
reporter: "jzebor"
source: "https://hackerone.com/reports/335495"
title: "Out of order TLS handshake / application data messages lead to segmentation fault"
---
# Out of order TLS handshake / application data messages lead to segmentation fault

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 3 | **Program:** Node.js | **Disclosed:** 2020-02-13

- Report: [https://hackerone.com/reports/335495](https://hackerone.com/reports/335495)
- CWE: Heap Overflow
- Submitted: 2018-04-10T15:22:13.135Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:** 
IMPORTANT NOTE: I have already been working with the NodeJS core security team on this issue and have provided core files, POC and many other pieces of information. I was told by James Snell to report via Hackerone to make it official however all the relevant details on this issue have already been provided to NodeJS team. This report will be minimal since all details are already with the team which needs them.

**Description:** Sending interleaved handshake messages in the TLS handshake OR sending TLS handshake messages AFTER the handshake has completed (after finished msg) causes a segmentation fault of the NodeJS process. This is present in v9 and v10, using TLS module. The issue can be exposed with servers which use TLS in normal "server authentication" mode AND servers which require mutual authentication (client certificates).


## Steps To Reproduce:

  1. Setup TLS server with node. 
  2. Perform a normal handshake but insert a Client Key Exchange message AFTER the TLS handshake finished message.
  3. Observe segmentation fault of node process.

Stacktrace, core file and reproduction script(s) have all been provided to Anna Henningsen on the NodeJS core team.

## Impact: Denial of service, seg fault leads to the node instance inability to service additional clients.

## Supporting Material/References: All of this has already been provided to Core NodeJS security team.

  * List any additional material (e.g. screenshots, logs, references, commits, code examples, etc.).

## Impact

Segmentation fault of the process leads to denial of service.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2018-05-01** @jzebor: James, hope you are doing well. I just found out from my company HR team that I will be unable to accept any cash bounty for this bug. While it's not my favorite decision, I understand and accept the reasoning.

This bug report is free and does not request any cash bounty.

Take care,
Jordan
- **2018-05-24** @jzebor: James, hope you are doing well. Can you please let me know the disclosure timeline for this issue and #335533 ? It's been roughly a month since I've heard from you. 

Let me know,

Thanks
Jordan
- **2018-05-24** @jasnell: My sorry for the delay. We have the fixes ready to go (and have for a few weeks) but we had a delay on coordinating the release for the Node.js 8.x release line. I'm still not 100% certain when the release is scheduled for but I *will* follow up and get this figured out.

I did want to follow up with you and ask if you had a chance to clarify if you were able to receive the bounty on these reports?
- **2018-05-24** @jasnell: Ok, I'm going to push for the release to go out week after next. We need to publish an announcement giving folks a heads up that a security release is coming... those usually go out a week in advance of the actual disclosure and release.
- **2018-05-24** @jzebor: Re: Bounty -- See my message from May 1st. I cannot accept the bounty. This one is free.

Thanks and take care.
- **Report Resolved**
- **Not Eligible For Bounty**
- **Agreed On Going Public**
- **Report Became Public**
