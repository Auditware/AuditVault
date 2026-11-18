---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - env/web
  - vuln/info-disclosure
substate: "resolved"
weakness: null
enriched: true
body: true
date: 2020-04-09
submitted: 2019-09-14T18:01:00.202Z
bounty_usd: null
votes: 17
cve: []
program: "[[programs/equifax|Equifax-vdp]]"
reporter: "zifrox"
source: "https://hackerone.com/reports/694931"
title: "Information Leak (Github)"
---
# Information Leak (Github)

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 17 | **Program:** Equifax-vdp | **Disclosed:** 2020-04-09

- Report: [https://hackerone.com/reports/694931](https://hackerone.com/reports/694931)
- CWE: N/A
- Submitted: 2019-09-14T18:01:00.202Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

In Github I found some credentials to use in a webservice that exposes very sensitive information of people, family group, financial situation, and more.

Github:
https://github.com/geraldincg/proyecto/blob/9c89787deb1d217f58b58786d90bfb3eab290237/Proyecto/ViewModels/WebService/ConexionWS.cs

The  webservice is subdomain for Costa Rica:
Change "referencia" identification number to obtain different results.
Example:

https://webservices.equifax.cr/webservices/efx_consultas.asmx/Estudio_360_Fisico?referencia=891550&Cedula=&Usuario=&Clave=EKJH1QF2IXL3FSI4APWSD5XWFGX63KLK76JFXU80RTCQWS&Usuario_Datum=

https://webservices.equifax.cr/webservices/efx_consultas.asmx/Estudio_360_Fisico?referencia=891547&Cedula=&Usuario=&Clave=EKJH1QF2IXL3FSI4APWSD5XWFGX63KLK76JFXU80RTCQWS&Usuario_Datum=

https://webservices.equifax.cr/webservices/efx_consultas.asmx/Estudio_360_Fisico?referencia=891543&Cedula=&Usuario=&Clave=EKJH1QF2IXL3FSI4APWSD5XWFGX63KLK76JFXU80RTCQWS&Usuario_Datum=

## Impact

An attacker can extract information any people in the system.

## Timeline

- **Report Filed**
- **2019-09-15** @ktistai: Hi @lijhazo 

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@ktistai
- **Report Triaged**
- **Report Severity Updated**
- **Report Severity Updated**
- **2019-09-16** @5ly: Hi, @lijhazo 

We deeply appreciate your hard work, this is very critical for us and we're inmediatly working to remediate it, please stand by while we find owners and shutdown this, thank you again !!
- **Report Resolved**
- **2019-09-16** @zifrox: Hi @axo107, Thanks for your reply, I could verify that the repository in github  is not accessible.
- **2019-09-16** @zifrox: Hi @5ly, thanks for your replies. I have a question, this report has no reward?.
Thank you very much, nice to have collaborated with you
- **Agreed On Going Public**
- **Report Became Public**
