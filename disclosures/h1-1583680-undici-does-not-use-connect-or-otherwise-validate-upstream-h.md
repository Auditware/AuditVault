---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-certificate-validation
  - env/web
  - stack/node
substate: "resolved"
weakness: "Improper Certificate Validation"
enriched: true
date: 2022-07-13
submitted: 2022-05-27T17:49:21.996Z
bounty_usd: null
votes: 4
cve: "CVE-2022-32210"
program: "[[programs/nodejs|Node.js]]"
reporter: "pimterry"
source: "https://hackerone.com/reports/1583680"
title: "Undici does not use CONNECT or otherwise validate upstream HTTPS certificates when using a proxy"
---
# Undici does not use CONNECT or otherwise validate upstream HTTPS certificates when using a proxy

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 4 | **Program:** Node.js | **Disclosed:** 2022-07-13

- Report: [https://hackerone.com/reports/1583680](https://hackerone.com/reports/1583680)
- CWE: Improper Certificate Validation | CVE: CVE-2022-32210
- Submitted: 2022-05-27T17:49:21.996Z

## Timeline

- **Report Filed**
- **2022-05-27** @mcollina: Thanks for reporting. This is undici specific as Node.js does not ship with the ProxyAgent implementation (yet) and it’s the right kind of feedback that we are aiming to receive. Keep it up! We’ll investigate this shortly.
- **Report Triaged**
- **2022-06-07** @pimterry: Sorry, I've been away over the weekend. Back now - I've seen the PR & notification, I am indeed @pimterry on GitHub as you've guessed, and I'll review that PR today.
- **Cve Id Added**
- **Report Resolved**
- **Agreed On Going Public**
- **2022-06-13** @mcollina: You can request a bounty at https://hackerone.com/ibb. Feel free to include my contacts.
From my point of view it should be eligible.
- **2022-06-13** @pimterry: Great, will do! Thanks for the quick work on getting this fixed 👍
- **Report Became Public**
