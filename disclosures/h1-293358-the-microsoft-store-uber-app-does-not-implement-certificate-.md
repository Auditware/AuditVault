---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-certificate-validation
  - env/web
substate: "duplicate"
weakness: "Improper Certificate Validation"
enriched: true
body: true
date: 2017-12-24
submitted: 2017-11-28T03:18:23.439Z
bounty_usd: null
votes: 7
cve: []
program: "[[programs/uber|Uber]]"
reporter: "gregoryvperry"
source: "https://hackerone.com/reports/293358"
title: "The Microsoft Store Uber App Does Not Implement Certificate Pinning"
---
# The Microsoft Store Uber App Does Not Implement Certificate Pinning

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 7 | **Program:** Uber | **Disclosed:** 2017-12-24

- Report: [https://hackerone.com/reports/293358](https://hackerone.com/reports/293358)
- CWE: Improper Certificate Validation
- Submitted: 2017-11-28T03:18:23.439Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary
The Microsoft Store Uber App (Windows Phone Architecture) does not properly implement certificate pinning.

## Security Impact
Layer-2+ network traffic transmitted from and received by the app can be surreptitiously intercepted and transparently modified by an attacker, with no warnings or errors presented to the app user.

## Reproduction Steps
A transparent Layer-2 MITM proxy was configured between a device running the most recent release of the Uber app for Windows Phone Architecture and an Internet gateway. Self-signed certificates were asserted on behalf of the remote systems that the app communicated with. All traffic transmitted and received by the Uber app was able to be captured and then modified transparently, without any notifications or certificate warnings sent to the app user.

## Specifics
* Account GregPerry804@gmail.com was used for testing
* It appears that the apps for iOS and Android properly implement certificate pinning, with only the Windows Phone Architecture Uber App affected by this vulnerability.

## Impact

In this scenario an attacker has the ability to modify a rider's profile, to access previous trip histories, to schedule and/or cancel Uber driver dispatches, and the ability to access and/or modify stored payment information.

Driver functionality was not tested. If the Uber Driver role is also implemented within the Microsoft Phone Architecture Uber App, then all functionality encapsulated within the app as relates to driver functionality could be surreptitiously observed and/or transparently modified as well.

This particular vulnerability can be implemented as an ARP cache poisoning attack, making it especially relevant to Uber riders who utilize wireless access points at public hotspots to dispatch Uber rides.

## Timeline

- **Report Filed**
- **2017-11-28** @fletcher: @gregperry,

Awesome, glad to see your account got whitelisted!

We'll take a look and follow-up ASAP when we have more details.

Thanks,
Rob
- **Report Duplicate**
- **2017-12-11** @gregoryvperry: Cute. Big surprise.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **External User Joined**
