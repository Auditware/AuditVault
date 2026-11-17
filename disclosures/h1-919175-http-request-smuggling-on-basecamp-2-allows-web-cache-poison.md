---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/http-request-smuggling
  - env/web
substate: "resolved"
weakness: "HTTP Request Smuggling"
enriched: true
date: 2020-10-28
submitted: 2020-07-08T18:38:41.851Z
bounty_usd: null
votes: 28
cve: []
program: "[[programs/basecamp|Basecamp]]"
reporter: "hazimaslam"
source: "https://hackerone.com/reports/919175"
title: "HTTP request smuggling on Basecamp 2 allows web cache poisoning"
---
# HTTP request smuggling on Basecamp 2 allows web cache poisoning

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 28 | **Program:** Basecamp | **Disclosed:** 2020-10-28

- Report: [https://hackerone.com/reports/919175](https://hackerone.com/reports/919175)
- CWE: HTTP Request Smuggling
- Submitted: 2020-07-08T18:38:41.851Z

## Timeline

- **Report Filed**
- **Report Title Updated**
- **Bounty Awarded**
- **Report Triaged**
- **2020-07-11** @hazimaslam: Thank you for the award!
- **2020-07-13** @georgeclaghorn: We’ve deployed a fix for this. The desync is between our load balancers and next-hop nginx servers. The load balancers now reject requests with both Content-Length and Transfer-Encoding headers with a 400 Bad Request response. This is technically a spec violation, but it’s our best option for now.

Mind confirming, @hazimaslam?
- **2020-07-14** @hazimaslam: Yes, confirming it is fixed.

{F907375}
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
