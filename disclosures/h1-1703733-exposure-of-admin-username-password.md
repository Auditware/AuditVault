---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/insecure-storage-of-sensitive-information
  - env/web
substate: "resolved"
weakness: "Insecure Storage of Sensitive Information"
enriched: true
date: 2022-12-25
submitted: 2022-09-18T10:24:40.552Z
bounty_usd: null
votes: 48
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "coyemerald"
source: "https://hackerone.com/reports/1703733"
title: "Exposure Of Admin Username & Password"
---
# Exposure Of Admin Username & Password

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 48 | **Program:** MTN Group | **Disclosed:** 2022-12-25

- Report: [https://hackerone.com/reports/1703733](https://hackerone.com/reports/1703733)
- CWE: Insecure Storage of Sensitive Information
- Submitted: 2022-09-18T10:24:40.552Z

## Timeline

- **Report Filed**
- **2022-09-19** @incognito4: Hi ████ there seems to be a redirect from this URL, please see some of the pages it's redirecting me to.{F1940623}{F1940626}
- **2022-09-19** @coyemerald: Kindly, and firstly visit ███ and you'll be redirected to █████████ {F1940666}
- **2022-09-19** @coyemerald: I believe that you should be able to redirect to the correct ██████ █████████

while on this subdomain ███ click on CTRL+U

or copy and paste this   view-source:██████  inside the URL bar of your browser and press on CTRL+F to search for uid, password.

let me know if you still encounter issue in reproducing this.
- **Report Triaged**
- **Report Resolved**
- **2022-11-25** @coyemerald: For education purpose, and since this has been resolved, can it be disclosed ?
- **Agreed On Going Public**
- **2022-12-06** @coyemerald: Can I disclose this?
- **Report Became Public**
