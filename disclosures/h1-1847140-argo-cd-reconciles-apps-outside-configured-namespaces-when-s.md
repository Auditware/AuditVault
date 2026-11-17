---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
date: 2023-03-05
submitted: 2023-01-25T19:04:04.357Z
bounty_usd: 2000
votes: 18
cve: "CVE-2023-22736"
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "czchen"
source: "https://hackerone.com/reports/1847140"
title: "Argo CD reconciles apps outside configured namespaces when sharding is enabled"
---
# Argo CD reconciles apps outside configured namespaces when sharding is enabled

> **Severity:** High | **Bounty:** 2,000 USD | **Votes:** 18 | **Program:** Internet Bug Bounty | **Disclosed:** 2023-03-05

- Report: [https://hackerone.com/reports/1847140](https://hackerone.com/reports/1847140)
- CWE: Improper Access Control - Generic | CVE: CVE-2023-22736
- Submitted: 2023-01-25T19:04:04.357Z

## Report summary

Controller reconciles apps outside configured namespaces when sharding is enabled

Impact
All Argo CD versions starting with 2.5.0-rc1 are vulnerable to an authorization bypass bug which allows a malicious Argo CD user to deploy Applications outside the configured allowed namespaces.

Description of exploit
Reconciled Application namespaces are specified as a comma-delimited list of glob patterns. When sharding is enabled on the Application controller, it does not enforce that list of patterns when reconciling Applications. For example, if Application namespaces are configured to be argocd-*, the Application controller may reconcile an Application installed in a namespace called other, even though it does not start with argocd-.

Reconciliation of the out-of-bounds Application is only triggered when the Application is updated, so the attacker must be able to cause an update operation on the Application resource.

Credits
Thanks to ChangZhuo Chen (@czchen) for finding the issue and for contributing the fix!

Full GHSA: https://github.com/argoproj/argo-cd/security/advisories/GHSA-6p4m-hw2h-6gmw

## Timeline

- **Report Filed**
- **Cve Id Added**
- **Report Triaged**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
