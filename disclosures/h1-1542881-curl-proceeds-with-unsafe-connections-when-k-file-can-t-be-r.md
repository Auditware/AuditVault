---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-check-or-handling-of-exceptional-conditions
  - env/web
substate: "informative"
weakness: "Improper Check or Handling of Exceptional Conditions"
enriched: true
date: 2022-04-21
submitted: 2022-04-17T03:11:27.320Z
bounty_usd: null
votes: 1
cve: []
program: "[[programs/curl|curl]]"
reporter: "medianmedianstride"
source: "https://hackerone.com/reports/1542881"
title: "curl proceeds with unsafe connections when -K file can't be read"
---
# curl proceeds with unsafe connections when -K file can't be read

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 1 | **Program:** curl | **Disclosed:** 2022-04-21

- Report: [https://hackerone.com/reports/1542881](https://hackerone.com/reports/1542881)
- CWE: Improper Check or Handling of Exceptional Conditions
- Submitted: 2022-04-17T03:11:27.320Z

## Timeline

- **Report Filed**
- **2022-04-17** @bagder: Thank you for your report!

We will take some time and investigate your reports and get back to you with details and possible follow-up questions as soon as we can!
- **2022-04-17** @bagder: I'm inclined to say that while this is a bug we should address and fix, **this is not a security vulnerability**.

1. There is no documentation that says curl will consider a non-readable `-K`
   file to be a fatal error.
2. curl is handling the case consistently with a warning, so in lack of (1)
   a user can easily check how curl behaves for this situation. It can also be
   discovered when it happens.
3. Because of (2), I do not think a user can claim ignorance or to be totally
   unaware of how curl works for this situation. It is easy to figure out.
4. This behavior when failing to read a file is also found and done for
   several other curl options (like for example `-b`), so it seems rather
   consistent and unsurprising.

An argument could be made that in spite of all the above, this is still such a bad behavior and functionality that it leads to security problems even for well educated and well meaning users. I find that difficult to see. 

The described attack against this imaginary `-K` user is extremely convoluted and requires an attacker present on the local network (that can "nuke" a file system on demand and on the right time), a weirdly specific NFS mounted file system from which only the `-K` file is accessed and so on.
- **Report Informative**
- **Agreed On Going Public**
- **2022-04-21** @medianmedianstride: Thank you for looking at this report, and thank you for all of your work on curl!
- **Agreed On Going Public**
- **Report Became Public**
