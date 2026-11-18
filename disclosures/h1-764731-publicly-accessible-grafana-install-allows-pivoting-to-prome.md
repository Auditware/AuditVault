---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2020-05-14
submitted: 2019-12-26T12:27:07.725Z
bounty_usd: null
votes: 1
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "gnarlygoat"
source: "https://hackerone.com/reports/764731"
title: "Publicly accessible Grafana install allows pivoting to Prometheus datasource"
---
# Publicly accessible Grafana install allows pivoting to Prometheus datasource

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 1 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2020-05-14

- Report: [https://hackerone.com/reports/764731](https://hackerone.com/reports/764731)
- CWE: Information Disclosure
- Submitted: 2019-12-26T12:27:07.725Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
A publicly accessible Grafana install exposes semi sensitive Dashboards. This also exposes the Prometheus proxied datasources which allow direct queries to a Prometheus instance which reveals sensitive data an opens the instance up to potential DoS via crafted requests.

**Description:**

## Impact
Medium-Low

## Step-by-step Reproduction Instructions

1. Grafana instance - https://████████/stats/
2. Example semi sensitive dashboard: https://████████/stats/d/███/
3. This dashboard reveals an unrestricted Prometheus proxy API at https://███/stats/api/datasources/proxy/1/api/v1/
4. This API can be queried in many ways to include resource intensive queries which could result in a DoS. An example of exposed datasets:
https://██████/stats/api/datasources/proxy/1/api/v1/label/__name__/values. A query crafted to require high resource usage would result in a denial of service.
5. This can reveal much more sensitive data as well such as internal ip addresess assigned to interfaces https://████/stats/api/datasources/proxy/1/api/v1/query?query=node_network_address_assign_type

 or

`curl -s 'https://██████/stats/api/datasources/proxy/1/api/v1/query?query=node_network_address_assign_type' |     python2 -c "import sys, json; print json.load(sys.stdin)['data']['result'][0]"`
 (Ip addresses are in decimal)

## Product, Version, and Configuration (If applicable)
 Grafana v6.4.4 
## Suggested Mitigation/Remediation Actions
Implement controls to disallow public access

## Impact

Denial of Service
Utilize exposed network and device data for network reconnaissance

## Timeline

- **Report Filed**
- **2019-12-26** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
