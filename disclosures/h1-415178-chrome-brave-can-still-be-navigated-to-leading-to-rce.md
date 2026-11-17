---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/code-injection
  - env/web
substate: "resolved"
weakness: "Code Injection"
enriched: true
date: 2018-10-23
submitted: 2018-09-27T06:37:47.407Z
bounty_usd: null
votes: 12
cve: []
program: "[[programs/brave|Brave Software]]"
reporter: "qab"
source: "https://hackerone.com/reports/415178"
title: "chrome://brave can still be navigated to, leading to RCE"
---
# chrome://brave can still be navigated to, leading to RCE

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 12 | **Program:** Brave Software | **Disclosed:** 2018-10-23

- Report: [https://hackerone.com/reports/415178](https://hackerone.com/reports/415178)
- CWE: Code Injection
- Submitted: 2018-09-27T06:37:47.407Z

## Timeline

- **Report Filed**
- **2018-09-27** @qab: Here is a different PoC, the main difference is that I am using a different method in bookmarking the chrome url.

STR:

1. Open PoC locally
2. Right click on the anchor tag and click 'open in new tab'
3. In the new tab, click on the bookmark button next to the addressbar
4. Using the middle mouse button, open the new bookmark.
5. RCE
- **2018-09-27** @diracdeltas: @qab i agree that being able to open chrome://brave is bad, but were you actually able to achieve RCE? if so could you share the vector? the RCE method used in https://hackerone.com/reports/395737 should have been fixed.
- **2018-09-27** @qab: Yes, the fix is not enough. The PoC only opens a local executable but its more than possible to run arbitrary commands (for Windows at least). 

Replace the chrome command in any of the PoC's with the following:

```chrome.remote.shell.writeShortcutLink("C://a//test.lnk","create",{target:"C:\\Windows\\system32\\cmd.exe", args:"/k calc"});
chrome.remote.shell.openItem("C://a//test.lnk")```
- **2018-09-27** @qab: Whoops. Replace C://a//test.lnk string with C://temp//test.lnk for it to work without creating the C://a// folder beforehand
- **2018-09-27** @qab: Hmm seems like we don't need to bookmark anything at all. We can simply drop a dragged anchor tag (that points the chrome:// url) into a window that navigated to 'http://brave.com' and it will load it automatically.

STR: 

1. Open attached PoC locally.
2. Click anywhere
3. In new popup, drag the anchor tag into the main window
4. Chrome code executed

And as previously discussed, this is an RCE at least on windows.
- **2018-09-27** @diracdeltas: triaged to https://github.com/brave/browser-laptop/issues/15237
- **Report Triaged**
- **2018-09-27** @diracdeltas: yup, the drag and drop issue was reported in https://hackerone.com/reports/415258
- **2018-10-03** @diracdeltas: i think this fixes all your STR cases but am not sure. are you able to verify? https://github.com/brave/browser-laptop/pull/15261
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
