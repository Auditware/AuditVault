---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/unrestricted-upload-of-file-with-dangerous-type
  - env/web
substate: "resolved"
weakness: "Unrestricted Upload of File with Dangerous Type"
enriched: true
body: true
date: 2022-11-08
submitted: 2022-04-22T12:20:17.422Z
bounty_usd: 5000
votes: 56
cve: []
program: "[[programs/aiven_ltd|Aiven Ltd]]"
reporter: "jarij"
source: "https://hackerone.com/reports/1547877"
title: "[Kafka Connect] [JdbcSinkConnector][HttpSinkConnector] RCE by leveraging file upload via SQLite JDBC driver and SSRF to internal Jolokia"
---
# [Kafka Connect] [JdbcSinkConnector][HttpSinkConnector] RCE by leveraging file upload via SQLite JDBC driver and SSRF to internal Jolokia

> **Severity:** Critical | **Bounty:** 5,000 USD | **Votes:** 56 | **Program:** Aiven Ltd | **Disclosed:** 2022-11-08

- Report: [https://hackerone.com/reports/1547877](https://hackerone.com/reports/1547877)
- CWE: Unrestricted Upload of File with Dangerous Type
- Submitted: 2022-04-22T12:20:17.422Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
The Aiven JDBC sink includes the SQLite JDBC Driver. This JDBC driver can be used to upload SQLite database files onto the server. The HTTP sink connector allows sending HTTP requests to localhost. There is unprotected Jolokia listening on `localhost:6725`.  JMX exports the `com.sun.management:type=DiagnosticCommand` MBean, which contains the `jvmtiAgentLoad` operation. This operation can be used to execute the SQLite database as JVM Agent by embedding the JVM Agent JAR file inside the SQLite database as an BLOB field in a table.

## Steps To Reproduce:

{F1703051}

  1. Login into my VPS: `ssh ████`, password: `█████████@`
  1. Execute `nc -nlvp 4446`
  1. cd to `jdbc-sqlite-jolokia-rce` and run `python3 poc.py` (if running locally, install kafka-python using pip first).
  1. Reverse shell connection should now be established to my test instance

## Impact

RCE on the Kafka Connect server

## Timeline

- **Report Filed**
- **2022-04-25** @h1_analyst_indy: Hi @jarij,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@chapeau
- **Report Needs More Info**
- **Report New**
- **Report Pending Program Review**
- **Report Triaged**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
