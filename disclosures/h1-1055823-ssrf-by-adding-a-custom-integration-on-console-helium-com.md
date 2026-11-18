---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/server-side-request-forgery-ssrf
  - env/web
substate: "resolved"
weakness: "Server-Side Request Forgery (SSRF)"
enriched: true
body: true
date: 2021-05-26
submitted: 2020-12-10T14:38:28.190Z
bounty_usd: null
votes: 54
cve: []
program: "[[programs/helium|Helium]]"
reporter: "th0roid"
source: "https://hackerone.com/reports/1055823"
title: "SSRF By adding a custom integration on console.helium.com"
---
# SSRF By adding a custom integration on console.helium.com

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 54 | **Program:** Helium | **Disclosed:** 2021-05-26

- Report: [https://hackerone.com/reports/1055823](https://hackerone.com/reports/1055823)
- CWE: Server-Side Request Forgery (SSRF)
- Submitted: 2020-12-10T14:38:28.190Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

A Server Side Request Forgery vulnerability was found in the *Add a custom Integration* feature on *console.helium.com*. By creating a custom HTTP integration, and setting the integration endpoint to http://169.254.169.254/latest/meta-data private meta-data from the AWS EC2 instance running can be retrieved.

{F1111768}

{F1111767}

The server makes the HTTP request and sets the response body  as the integration message every time that the device sends a packet. As the endpoint input is not validated, this makes the application vulnerable to a critical SSRF.

{F1111779}

{F1111780}

Endpoint set as: http://169.254.169.254/latest/meta-data/ami-id

{F1111781}

## Impact

By exploiting this vulnerability an attacker can get access to the server internal network and access private and critical information.

## Timeline

- **2020-12-11** @h1_analyst_ava: Hi @th0roid, 

Thank you for the report! Unfortunately, we need a little more information from you before we can fully validate this report. Please provide a detailed proof of concept that includes the following:

* How to find the vulnerable functionality
* Steps to reproduce the issue
* Any code snippets/curl commands/request and response headers that will help reproduce the issue
* Any additional content such as screenshots/videos that will help demonstrate the vulnerability

Providing this information when submitting new reports will help us to quickly determine the validity of your report. Thank you for your help!

Regards, 
@sodacan
- **2020-12-11** @th0roid: In order to reproduce this issue, the following is needed:
   - An **active organization** on console.helium.com and an **administrator user**
   - A **Lorawan device** in this organization.

The Helium console has a functionality where **integrations** can be configured. Integrations allow the devices to connect to cloud-based applications and send data over HTTP or MQTT.
These vulnerability arises in the **add a custom integration** feature. When creating a custom HTTP integration, an endpoint can be specified. If this integration is connected to a device, when the device transfers a packet the Helium server will make an **HTTP request to the specified endpoint** and the **HTTP response will be returned in the application**. This makes the server vulnerable to a SSRF vulnerability.


Steps to reproduce
----------------------------------------------------------------
 1 - Log in as a Administrator user on an Organization that has a device on https://console.helium.com .
 2 - go to **integrations** and click on **add a custom HTTP integration** . 

   {F1113446}

 3 - Set the integration endpoint to http://169.254.169.254/latest/meta-data and the HTTP request method to GET. When this endpoint is accesed by the server on a EC2 instance, it returns private metadata of the instance, that's why this endpoint works as a proof of concept on the criticality of this vulnerability.

   {F1113455}

 4 - Add a label to this integration and save it.

  {F1113460}

 5 - Add this label to the device configured on the organization. This associates the integration with the device, and the SSRF will be triggered when the device transfers a packet.

  {F1113474}

6 - When the device sends a packet, the private data will be retrieved by the server and made visible to the attacker in the uplink message of the device section.

  {F1113489}
- **Report Filed**
- **Report Triaged**
- **2020-12-16** @th0roid: Great, anything you need just ask me.

Here you can read about mitigation in this possible case: https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html#case-2-application-can-send-requests-to-any-external-ip-address-or-domain-name

The most important thing is to **block the endpoint if it is or resolves to any IP address on the private network ranges, and in this case the AWS Instance Metadata endpoints.** This way an integration will not be used to get unauthorized access to helium systems.
- **Bounty Awarded**
- **2021-02-24** @abhay-helium: @jdgemm close as Resolved?
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
