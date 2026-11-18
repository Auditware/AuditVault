---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cleartext-storage-of-sensitive-information
  - env/web
  - vuln/info-disclosure
substate: "resolved"
weakness: "Cleartext Storage of Sensitive Information"
enriched: true
body: true
date: 2022-09-01
submitted: 2021-11-10T19:03:13.636Z
bounty_usd: null
votes: 13
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "dh0pe"
source: "https://hackerone.com/reports/1397788"
title: "Sensitive Information Disclosure Through Config File"
---
# Sensitive Information Disclosure Through Config File

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 13 | **Program:** MTN Group | **Disclosed:** 2022-09-01

- Report: [https://hackerone.com/reports/1397788](https://hackerone.com/reports/1397788)
- CWE: Cleartext Storage of Sensitive Information
- Submitted: 2021-11-10T19:03:13.636Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
An attacker could gain access to sensitive information about usernames, encrypted passwords, internal IP addresses and configuration data of internal services.

## Steps To Reproduce:
- Go to https://zik.mtncameroon.net/common/queryconfig.action

## Remediation
Configure the application to not reveal sensitive information to client.

## References
https://cwe.mitre.org/data/definitions/200.html

## Impact

A malicious user is able to gain sensitive information usernames, encrypted passwords, internal IP addresses and configuration data of internal services.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2022-01-19** @dh0pe: Hello, do you have an update on this issue?
- **2022-04-28** @dh0pe: Hello, do you have an update on this issue?
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
