---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
  - vuln/subdomain-takeover
  - impact/credential-theft
  - trigger/social-engineering
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2018-02-17
submitted: 2017-10-09T17:46:08.293Z
bounty_usd: null
votes: 51
cve: []
program: "[[programs/starbucks|Starbucks]]"
reporter: "dpgribkov"
source: "https://hackerone.com/reports/275714"
title: "Subdomain takeover on developer.openapi.starbucks.com"
---
# Subdomain takeover on developer.openapi.starbucks.com

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 51 | **Program:** Starbucks | **Disclosed:** 2018-02-17

- Report: [https://hackerone.com/reports/275714](https://hackerone.com/reports/275714)
- CWE: Improper Access Control - Generic
- Submitted: 2017-10-09T17:46:08.293Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi team,

### Summary: 
Subdomain `developer.openapi.starbucks.com` is vulnerable to subdomain takeover via Mashery service. The reason why it's worked unfortunately not fully clear to me.

### Details:
Doing my recent research on starbucks.com subdomains, I stumbled upon http://developer.openapi.starbucks.com/ The server returned 200 response with the following {F227581} The `Server` header of HTTP responce was `Mashery Proxy` so it gave me an idea, that I should go and try register an trial account at https://www.mashery.com/

After registering an account and confirming it, I got access to the dashboard. Under the `Portal Settings` menu there was an option to add your own domain name. I added developer.openapi.starbucks.com as my domain and I get no error. After I went to the http://developer.openapi.starbucks.com/ and saw welcome page {F227586} which gave me understanding that I can serve my own content under developer.openapi.starbucks.com

### PoC:
I added simple js code to the Welcome page `alert(document.domain)` for this proof-of-concept.
To confirm it just click this link http://developer.openapi.starbucks.com/

### Impact:
As I can serve my own content without any restrictions, with this webpage I can set up a campaign to steal user cookie sessions, or use it to steal credentials, or for phishing purposes. 

Please let me know, if you need more information!

Thanks,
Danil

## Timeline

- **Report Filed**
- **2017-10-09** @joystick: Hi,

Thank you for your submission. We are investigating your report, and will let you know if we have any questions. We appreciate your assistance and cooperation. 

Regards.
- **Report Triaged**
- **2017-10-12** @coldbr3w: Hello @danilg,

Thank you for the submission. We have notified Mashery of this issue and we are currently awaiting resolution. In the meantime, could you please take down your PoC message/warning?
- **2017-10-12** @dpgribkov: Hi @coldbr3w,

Sure, not a problem! I deleted `developer.openapi.starbucks.com` from `Domain Names` at the Mashery Dashboard. It should remove this PoC.
- **Bounty Awarded**
- **Report Resolved**
- **2017-11-20** @dpgribkov: Thanks for the bounty @starbucks! Always a pleasure to work with you!
- **Agreed On Going Public**
- **Report Became Public**
- **Changed Scope**
