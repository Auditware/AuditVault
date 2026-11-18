---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2019-10-10
submitted: 2019-08-15T22:24:37.289Z
bounty_usd: null
votes: 25
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "masonhck357"
source: "https://hackerone.com/reports/674741"
title: "Examples directory is PUBLIC on https://████████mil, leading to multiple vulns"
---
# Examples directory is PUBLIC on https://████████mil, leading to multiple vulns

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 25 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2019-10-10

- Report: [https://hackerone.com/reports/674741](https://hackerone.com/reports/674741)
- CWE: Improper Access Control - Generic
- Submitted: 2019-08-15T22:24:37.289Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Description:**
Hello, 

In an effort to consolidate reporting. I have located 4 issues with having the Examples Directory open(my require just 1 solution to mitigate) The following URLs that show concern are the following:

1. https://█████mil/examples/servlets/servlet/SessionExample <--Will lead to Session Manipulation and potential Account Takeover

2. https://██████mil/examples/servlets/servlet/RequestHeaderExample <---Internal IP disclosure

3. https://██████████mil/examples/servlets/ <---Source Code Disclosure and an "Execute" option(did not press Execute button so I am not sure the impact of it.

4. https://████mil/examples/servlets/servlet/CookieExample <----Insecure Cookie Handling



## Step-by-step Reproduction Instructions

1. Please visit the above links
2.
3.


## Suggested Mitigation/Remediation Actions

Disable public access to the examples directory as soon as possible!

## Impact

Ordered by Highest Impact:

1. https://██████mil/examples/servlets/servlet/SessionExample <--Will lead to Session Manipulation and potential Account Takeover. Because the session is global this servlet poses a big security risk as an attacker can potentially become an administrator by manipulating its session.

2. https://██████████mil/examples/servlets/servlet/CookieExample <----Insecure Cookie Handling

3. https://███████mil/examples/servlets/ <---Source Code Disclosure and an "Execute" option

4. https://██████mil/examples/servlets/servlet/RequestHeaderExample <---Internal IP disclosure

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **Report Triaged**
- **2019-08-26** @masonhck357: Hello, 

Following up
- **2019-08-26** @agent-0g: @mason357 Nothing to report yet.
- **2019-08-27** @masonhck357: Thanks, This looks like it was remidiated. I cannot get into any of the files.
- **2019-08-27** @masonhck357: Following up. I cannot replicate the bug. What are the next steps?
- **2019-08-28** @masonhck357: Following up, Bug has been fixed? Will this be changed to resolved??
- **Report Resolved**
- **2019-08-30** @masonhck357: Thank you!!
- **Agreed On Going Public**
- **2019-10-10** @ag3nt-j1: I think it'll happen a little quicker than 84 years lol.
- **2019-10-10** @masonhck357: LOL, I know you guys are busy as all hell so I get it :D
- **Agreed On Going Public**
- **Report Became Public**
- **2019-10-10** @masonhck357: Thank you my friend, Have a great day :D
