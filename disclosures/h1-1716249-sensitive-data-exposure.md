---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/insecure-storage-of-sensitive-information
  - env/web
substate: "not-applicable"
weakness: "Insecure Storage of Sensitive Information"
enriched: true
body: true
date: 2022-11-10
submitted: 2022-09-29T04:04:17.013Z
bounty_usd: null
votes: 5
cve: []
program: "[[programs/reddit|Reddit]]"
reporter: "saibalaji143_"
source: "https://hackerone.com/reports/1716249"
title: "sensitive data exposure"
---
# sensitive data exposure

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 5 | **Program:** Reddit | **Disclosed:** 2022-11-10

- Report: [https://hackerone.com/reports/1716249](https://hackerone.com/reports/1716249)
- CWE: Insecure Storage of Sensitive Information
- Submitted: 2022-09-29T04:04:17.013Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
[A Password hash entry was found in /etc/passwd. This is a major vulnerability since /etc/passwd is a world-readable file by default. Once the password hash is found, an attacker may extract the password using a program like crack.]

## Impact:
it is high impact vulnerability .once hacker found password hash it may be leads to develop a program like crack

## Steps To Reproduce:
[https://www.reddit.com/etc%2fpasswd]

  1. [add step]
  1. [add step]
  1. [add step]

## Supporting Material/References:
[list any additional material (e.g. screenshots, logs, etc.)]

  * [attachment / reference]

## Impact

A Password hash entry was found in /etc/passwd. This is a major vulnerability since /etc/passwd is a world-readable file by default. Once the password hash is found, an attacker may extract the password using a program like crack.

## Timeline

- **Report Filed**
- **Report Not Applicable**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
