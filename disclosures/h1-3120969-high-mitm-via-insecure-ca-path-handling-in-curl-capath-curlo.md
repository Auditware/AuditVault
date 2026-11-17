---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/reliance-on-untrusted-inputs-in-a-security-decision
  - env/web
substate: "not-applicable"
weakness: "Reliance on Untrusted Inputs in a Security Decision"
enriched: true
date: 2025-06-30
submitted: 2025-05-01T05:57:31.765Z
bounty_usd: null
votes: 10
cve: "CVE-2022-32221"
program: "[[programs/curl|curl]]"
reporter: "oicus"
source: "https://hackerone.com/reports/3120969"
title: "[High] MITM via Insecure CA Path Handling in cURL (--capath, CURLOPT_CAPATH) (CWE-494: Download of Code Without Integrity Check)"
---
# [High] MITM via Insecure CA Path Handling in cURL (--capath, CURLOPT_CAPATH) (CWE-494: Download of Code Without Integrity Check)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 10 | **Program:** curl | **Disclosed:** 2025-06-30

- Report: [https://hackerone.com/reports/3120969](https://hackerone.com/reports/3120969)
- CWE: Reliance on Untrusted Inputs in a Security Decision | CVE: CVE-2022-32221
- Submitted: 2025-05-01T05:57:31.765Z

## Timeline

- **Report Filed**
- **2025-05-01** @dfandrich: I don't understand the issue. If the user provides a CA path, curl uses it. If the user puts good certificates in the CA path, curl uses them. If the user puts bad certificates in the CA path, curl uses them. Are you saying that somehow curl is somehow supposed to second guess the user?
- **Report Not Applicable**
- **2025-05-02** @jimfuller2024: this falls into the 'dont do that' bucket ... the expectation hat curl should not ever use world writeable file paths is a wrong one.
- **Agreed On Going Public**
- **Manually Disclosed**
