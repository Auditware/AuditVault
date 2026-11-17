---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
substate: "resolved"
weakness: null
enriched: true
date: 2020-04-10
submitted: 2020-01-18T22:11:41.539Z
bounty_usd: null
votes: 15
cve: []
program: "[[programs/stripo|Stripo Inc]]"
reporter: "codeslayer1337"
source: "https://hackerone.com/reports/777651"
title: "HTTP Request Smuggling on my.stripo.email"
---
# HTTP Request Smuggling on my.stripo.email

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 15 | **Program:** Stripo Inc | **Disclosed:** 2020-04-10

- Report: [https://hackerone.com/reports/777651](https://hackerone.com/reports/777651)
- CWE: N/A
- Submitted: 2020-01-18T22:11:41.539Z

## Report summary

HTTP request smuggling vulnerabilities arise when websites route HTTP requests through webservers with inconsistent HTTP parsing.
By supplying a request that gets interpreted as being different lengths by different servers, an attacker can poison the back-end TCP/TLS socket and prepend arbitrary data to the next request. Depending on the website's functionality, this can be used to bypass front-end security rules, access internal systems, poison web caches, and launch assorted attacks on users who are actively browsing the site.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2020-02-20** @artem_nefedov: @codeslayer137 our developers and DevOps have reviewed this report and didn't really get what we can do with this. Could you please suggest some mitigation?
- **2020-02-25** @artem_nefedov: @codeslayer137 can you help us?
- **2020-02-28** @codeslayer1337: sorry I was late to reply, I was a few weeks so busy, can be seen in the following url 
https://paper.seebug.org/1049/
- **2020-02-28** @artem_nefedov: @codeslayer137 thank you man!
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
