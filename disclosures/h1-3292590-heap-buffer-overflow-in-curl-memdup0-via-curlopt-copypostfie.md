---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/buffer-over-read
  - env/web
substate: "not-applicable"
weakness: "Buffer Over-read"
enriched: true
date: 2025-08-09
submitted: 2025-08-09T02:32:38.906Z
bounty_usd: null
votes: 19
cve: []
program: "[[programs/curl|curl]]"
reporter: "geeknik"
source: "https://hackerone.com/reports/3292590"
title: "Heap Buffer Overflow in Curl_memdup0() via CURLOPT_COPYPOSTFIELDS/CURLOPT_POSTFIELDSIZE Mismatch"
---
# Heap Buffer Overflow in Curl_memdup0() via CURLOPT_COPYPOSTFIELDS/CURLOPT_POSTFIELDSIZE Mismatch

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 19 | **Program:** curl | **Disclosed:** 2025-08-09

- Report: [https://hackerone.com/reports/3292590](https://hackerone.com/reports/3292590)
- CWE: Buffer Over-read
- Submitted: 2025-08-09T02:32:38.906Z

## Report summary

This report demonstrates a heap buffer overflow in `Curl_memdup0()` triggered when `CURLOPT_COPYPOSTFIELDS` is called after `CURLOPT_POSTFIELDSIZE` is set to a value larger than the actual buffer length.

While this may be considered an API contract violation, the resulting behavior is not merely “undefined”, it is predictably exploitable memory corruption in a widely deployed network library. In practice, `POST` data length values can originate from untrusted sources such as:
	->	Length fields in higher-layer protocols
	->	User-controlled input in proxying or gateway scenarios
	->	Data marshalled between disparate components where size and buffer are provided separately

A malicious actor does not need to be the developer to exploit this; they only need influence over the size parameter in an integration that uses `CURLOPT_COPYPOSTFIELDS`.

Robust, security-conscious libraries defend against common misuse, especially when the misuse is trivially detectable at runtime. Adding a bounds check in `Curl_memdup0()` (e.g., verifying the buffer length before memcpy) would prevent heap memory disclosure, application crashes, or potential code execution, and would not break correct API usage.

In security terms:
	->	Bug class: Heap Buffer Overflow
	->	Impact: Information disclosure, DoS, potential RCE with heap shaping
	-> Root cause: No bounds validation in Curl_memdup0() when size parameter is larger than provided data
	-> Fix class: Defensive length validation before memcpy

*A caller bug should not translate into an attacker-controlled heap overflow in a security-critical library.*

## Timeline

- **Report Filed**
- **Report Vulnerability Information Updated**
- **2025-08-09** @bagder: This is an API violation. Also, curl cannot know the "real" size.
- **Report Not Applicable**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
