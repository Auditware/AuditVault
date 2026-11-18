---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/server-side-request-forgery-ssrf
  - env/network
substate: "resolved"
weakness: "Server-Side Request Forgery (SSRF)"
enriched: true
body: true
date: 2026-06-11
submitted: 2025-10-22T05:23:48.094Z
bounty_usd: null
votes: 27
cve: []
program: "[[programs/rocket_chat|Rocket.Chat]]"
reporter: "button142857"
source: "https://hackerone.com/reports/3393664"
title: "SSRF via improper validation after DNS name resolution in the link-preview feature"
---
# SSRF via improper validation after DNS name resolution in the link-preview feature

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 27 | **Program:** Rocket.Chat | **Disclosed:** 2026-06-11

- Report: [https://hackerone.com/reports/3393664](https://hackerone.com/reports/3393664)
- CWE: Server-Side Request Forgery (SSRF)
- Submitted: 2025-10-22T05:23:48.094Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

This is a different report from the one I submitted before: #3383079
 
### Summary
In Rocket.Chat version 7.11.0, the  link-preview is a feature that displays a preview of a linked page when a link is sent in the chat, and it is enabled by default.
On the server side, the hostname of the posted URL is initially checked to see if it is a local IP address. Then if it's a local one, link-preview doesn't work.
 However, there is no validation of the IP address after DNS resolution. Therefore, By obtaining some domain and pointing it to a local IP address, an attacker can trigger SSRF and access internal hosts that would otherwise be unreachable.

### Details
In my test environment, I set up an httpbin server on the same LAN as the Rocket.Chat server to verify whether SSRF was possible.
The httpbin server is running at 192.168.100.14:80, and the attacker cannot reach this server directly. 
 
Step 1. An attacker obtains a domain from a domain registration service. In this example, I got " *.conamikan.servegame.com " via https://www.noip.com/
 (now disabled).
{F4918625}
 
Step 2. The attacker posts " http://test.conamikan.servegame.com " to any channel or DM. Then the Rocket.Chat server sends a GET request to the httpbin server on the internal network, resulting in SSRF. Additionally, the attacker can view parts of the httpbin server’s web page via the link-preview feature. 
 
### PoC
In the attached PoC video (PoC_SSRF_2.mp4), I performed the following three attempts. 
 
・Posting http://example.com
　Because this is a valid URL, a preview was displayed. 
 
・Posting http://192.168.100.14
　Because this is a host on the internal network, the SSRF protection prevented a preview from being displayed. 
 
・Posting http://test.conamikan.servegame.com
　This domain is associated with the local IP address 192.168.100.14. Rocket.Chat server finally accessed http://192.168.100.14 and displayed a preview.
{F4918614}

## Impact

### Impact
This enables an attacker to reach internal network resources that would normally be inaccessible and to perform network scanning. Because an attacker can receive parts of responses from internal hosts, the risk of data leakage is very high and requires immediate remediation. The same technique can also be used to access cloud services and metadata endpoints, potentially exposing sensitive cloud-side data and credentials, so there is a significant risk of cloud information leakage.
To fix this issue, the IP address obtained after DNS resolution must also be validated.

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Resolved**
- **2026-02-19** @button142857: Hi Julio

Thank you for the fix.
I'm sorry to add another task to your plate, but would you mind handling the CVE request for this vulnerability?
- **2026-06-11** @button142857: Hi Julio
Thank you for the fix.
I'm sorry to add another task to your plate, but would you mind handling the CVE request for this vulnerability?
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
