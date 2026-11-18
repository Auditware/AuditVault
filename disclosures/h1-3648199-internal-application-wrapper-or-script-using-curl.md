---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/code-injection
  - env/web
substate: "not-applicable"
weakness: "Code Injection"
enriched: true
body: true
date: 2026-04-03
submitted: 2026-04-03T19:15:29.933Z
bounty_usd: null
votes: 29
cve: []
program: "[[programs/curl|curl]]"
reporter: "rougerseven7"
source: "https://hackerone.com/reports/3648199"
title: "Internal application wrapper or script using curl"
---
# Internal application wrapper or script using curl

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 29 | **Program:** curl | **Disclosed:** 2026-04-03

- Report: [https://hackerone.com/reports/3648199](https://hackerone.com/reports/3648199)
- CWE: Code Injection
- Submitted: 2026-04-03T19:15:29.933Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

While -guid is not a standard or documented curl command,  a Command Injection or Argument Injection vulnerability within a specific application that wraps curl.

Security Analysis: curl -guid -url  example.com

1. Status of the "-guid" FlagUndocumented/Non-existent: The official curl binary does not recognize a -guid flag. Standard versions will return an "unrecognized option" error.Custom Wrappers: This flag likely belongs to a custom internal script or a specialized wrapper (e.g., a "curl-guid" alias or a corporate security wrapper) that processes GUIDs for tracking requests.Injection Vector: If an application takes user input to fill this -guid field without sanitization, an attacker can break out of the intended command structure.
2. Attack Mechanism (Argument Injection)In a vulnerable system, the command might be constructed like this: system("curl -guid " + user_input + " -url example.com").The Payload: An attacker could provide a "GUID" like 123 -o /etc/shadow.Resulting Command: curl -guid 123 -o /etc/shadow -url example.com
Consequence: Instead of just passing a GUID, curl is instructed to overwrite a sensitive system file (like the password shadow file) with the contents of example.com.

## Impact

## Summary:
Potential ImpactsSetting/Resetting Passwords: By using the -o (output) flag, an attacker can overwrite authentication files (e.g., .htpasswd or /etc/passwd) with their own known values.Information Disclosure: Attackers can use flags like -d to send local secret files to their own server.Remote Code Execution (RCE): On some systems, injecting --engine can load a malicious shared object file, granting full control over the host.RecommendationsStrict Input Validation: Use a regular expression to ensure the input is a valid GUID format (e.g., ^[0-9a-fA-F-]{36}$).Avoid Shell Execution: Do not use system() or shell wrappers. Use language-specific libraries (like libcurl bindings for Python or C) that pass arguments as a safe array.Use the -- Terminator: If you must use a shell, place -- before user-provided URLs to stop curl from interpreting following inputs as flags

## Timeline

- **Report Filed**
- **Report Not Applicable**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
