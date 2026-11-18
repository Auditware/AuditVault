---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/uncontrolled-resource-consumption
  - env/web
  - vuln/dos
  - impact/dos-impact
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
body: true
date: 2024-04-22
submitted: 2024-01-25T12:51:51.084Z
bounty_usd: 4860
votes: 42
cve: "CVE-2024-24549"
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "bart"
source: "https://hackerone.com/reports/2334401"
title: "Denial of Service caused by HTTP/2 CONTINUATION Flood"
---
# Denial of Service caused by HTTP/2 CONTINUATION Flood

> **Severity:** High | **Bounty:** 4,860 USD | **Votes:** 42 | **Program:** Internet Bug Bounty | **Disclosed:** 2024-04-22

- Report: [https://hackerone.com/reports/2334401](https://hackerone.com/reports/2334401)
- CWE: Uncontrolled Resource Consumption | CVE: CVE-2024-24549
- Submitted: 2024-01-25T12:51:51.084Z

## Report summary

CVE-2024-24549 Apache Tomcat - Denial of Service
Severity: Important

Vendor: The Apache Software Foundation

Versions Affected:
Apache Tomcat 11.0.0-M1 to 11.0.0-M16
Apache Tomcat 10.1.0-M1 to 10.1.18
Apache Tomcat 9.0.0-M1 to 9.0.85
Apache Tomcat 8.5.0 to 8.5.98

Description:
When processing an HTTP/2 request, if the request exceeded any of the
configured limits for headers, the associated HTTP/2 stream was not
reset until after all of the headers had been processed.

Mitigation:
Users of the affected versions should apply one of the following
mitigations:
- Upgrade to Apache Tomcat 11.0.0-M17 or later
- Upgrade to Apache Tomcat 10.1.19 or later
- Upgrade to Apache Tomcat 9.0.86 or later
- Upgrade to Apache Tomcat 8.5.99 or later

Credit:
This vulnerability was reported responsibly to the Tomcat security team
by Bartek Nowotarski (https://nowotarski.info/).

Full Security Advisory: https://lists.apache.org/thread/4c50rmomhbbsdgfjsgwlb51xdwfjdcvg

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I sent the following report to Apache Tomcat Security Team. They confirmed the report and assigned CVE-2024-24549. I'd like to ask if this is eligible for a bounty.

I'd like to report a DoS vulnerability in Tomcat. I tested 10.1.18 and 11.0 (tomcat:latest and tomcat:11.0 docker images respectively) and it seems that both are vulnerable.

An attacker can send headers using HTTP/2 CONTINUATION frames up to the limit of header bytes, header size and connection overhead so that connection is not dropped by a server (GOAWAY/ENHANCE_YOUR_CALM). Once frames are sent a connection is left intact and a new connection starts. After a few connections like these the server crashes with (java.lang.OutOfMemoryError: Java heap space) in the code connected to HPackHuffman decoding.

The lack of experience with Java does not allow me to debug this properly to give you a definitive answer what is causing the problem however here is my best guess:
* When sending HEADERS + N * CONTINUATION frames are sent the actual headers are stored in memory.
* When TCP connection is idle (and possibly when connection is dropped) the headers stay in memory.
* Because of this even a small number of connections are able to occupy hundreds of MB of server memory.

I'm attaching an exploit (in Golang) with reproduction steps:
* Start tomcat docker container (-m 800m limits memory to 800MB just to prove the point faster):
    `docker run -m 800m -d -p 7777:8080 --name tomcat tomcat:latest`
* SSH into a container to enable HTTP/2 (https://tomcat.apache.org/tomcat-8.5-doc/config/http.html#HTTP/2_Support).
* Stop and start container to pick up new config:
    `docker stop tomcat`
    `docker start tomcat`
* Run exploit:
    `go run exploit.go -address "[ip]:7777" -connections 50`

To test it I started a remote EC2 server. After a few seconds after the exploit starts the server becomes unresponsive, CPU goes to 100% and memory usage fills quickly (observe with docker stats). After a few seconds you'll see OOM errors in catalina log (see attachment). While the CPU will drop to 0% soon, no new connections will be processed by the server even when the exploit is not running anymore.

Here's how exploit.go works:
* It pregenerates 100 headers, each 10 chars long.
* It starts connections (-connections flag means how many active connections can be running at a time). Each connection:
    * Sends HEADERS frame.
    * Sends 8 CONTINUATION frames, each consists of 100 random headers (10 chars name and 10 chars value). These params are almost reaching the header size limits but not exceeding them so connection is not dropped.
    * Once headers are sent, connection is left intact and new connection starts.

It seems that finding a reason why the server is crashing can be challenging for the server admin because even a single full HTTP request is not made (note that the last CONTINUATION frame doesn't have END_HEADERS flag) so they won't see HTTP requests in the logs. I'm not aware of any configuration params that can prevent this attack. Thus, it seems the only mitigation is turning off HTTP/2 support (or code fix).

## Impact

It causes a server crash so complete availability loss.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2024-01-26** @bart: Thanks for quick response. All I know is response from Tomcat team below. It was confirmed yesterday.

> We have reviewed your report and we agree that there is a DoS
vulnerability here.
>
>We have allocated CVE-2024-24549.
>
>We are evaluating a fix and expect to include the fix in the February
release round.
- **2024-01-26** @kunderkoffler: Got it! Thank you for the additional notes. This will be eligible for payout when the team releases the CVE details and a security advisory! To keep us on top of things, please attach the security advisory to the report when the team releases it.

Looking forward to getting this rewarded for you.
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Nmi Reminder Comment**
- **Nmi Reminder Comment**
- **Report New**
- **Report Needs More Info**
- **Report New**
- **Report Triaged**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
