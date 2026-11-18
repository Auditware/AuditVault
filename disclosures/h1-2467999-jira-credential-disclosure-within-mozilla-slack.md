---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/information-disclosure
  - env/web
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2024-04-23
submitted: 2024-04-17T17:46:50.781Z
bounty_usd: 1000
votes: 65
cve: []
program: "[[programs/mozilla|Mozilla]]"
reporter: "griffinf"
source: "https://hackerone.com/reports/2467999"
title: "Jira Credential Disclosure within Mozilla Slack"
---
# Jira Credential Disclosure within Mozilla Slack

> **Severity:** Critical | **Bounty:** 1,000 USD | **Votes:** 65 | **Program:** Mozilla | **Disclosed:** 2024-04-23

- Report: [https://hackerone.com/reports/2467999](https://hackerone.com/reports/2467999)
- CWE: Information Disclosure
- Submitted: 2024-04-17T17:46:50.781Z

## Report summary

The reporter who is an NDA'd contributor with access to internal Mozilla slack instance found a Jira admin API token hard-coded in a script which was shared in a public slack channel. The API key was revoked and the script was deleted from the public channel.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
I was able to find Jira Admin API Keys disclosed within Mozilla's #███ Slack channel which was posted by a staff member of Mozilla.

## Steps To Reproduce:
  1.Navigate to the following file -█████
  2.Observe the exposed credentials on line 310-312 of the Python Script.
  3. Verify Groups with the following CURL request - `curl -u "██████:ATATT3xFfGF0V99l_█████████551CCC5D" -H "Content-Type: application/json" https://mozilla-hub.atlassian.net/rest/api/3/user/groups?accountId=████████`
 
4. Observe the following output which shows that the user is a Jira Administrator, Administrator and  Jira Service Desk user etc.

[{"name":"jira-servicedesk-users","groupId":"███","self":"███████:"jira-administrators","groupId":"████████","self":██████:"jira-software-users","groupId":"███","self":██████████:"jira-servicemanagement-customers-mozilla-hub","groupId":"██████████","self":███:"site-admins","groupId":"████████","self":██████:"administrators","groupId":"██████████","self":██████:"Managers","groupId":"█████","self":██████"}]

## Impact

## Summary:

Admin API credentials provide elevated privileges that can grant access to all projects, user accounts, configurations, and other sensitive data stored in Jira.

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **Changed Scope**
- **Report Resolved**
- **Bounty Awarded**
- **2024-04-22** @griffinf: Mind publicly disclosing this report? Very happy with Mozilla's quick time to fix on this issue.
- **Agreed On Going Public**
- **Report Title Updated**
- **Agreed On Going Public**
- **Report Became Public**
- **Report Vulnerability Types Updated**
