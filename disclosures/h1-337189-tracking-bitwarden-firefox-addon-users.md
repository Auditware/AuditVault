---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
substate: "resolved"
weakness: null
enriched: true
date: 2018-05-23
submitted: 2018-04-13T09:21:24.054Z
bounty_usd: null
votes: 7
cve: []
program: "[[programs/bitwarden|Bitwarden]]"
reporter: "kmodi"
source: "https://hackerone.com/reports/337189"
title: "Tracking Bitwarden firefox addon users"
---
# Tracking Bitwarden firefox addon users

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 7 | **Program:** Bitwarden | **Disclosed:** 2018-05-23

- Report: [https://hackerone.com/reports/337189](https://hackerone.com/reports/337189)
- CWE: N/A
- Submitted: 2018-04-13T09:21:24.054Z

## Timeline

- **Report Filed**
- **2018-04-13** @kspearrin: Hi, thanks for the report! Is there a suggested fix for this? I am not sure how we could provide this feature without loading a local resource onto the page. It's a shame that resource URLs are not static like Chromium browsers. I think Edge might also suffer from this same problem.
- **Report Needs More Info**
- **Report New**
- **2018-04-13** @kspearrin: Here is where we inject the notification bar iframe into the page: https://github.com/bitwarden/browser/blob/master/src/content/notificationBar.js#L382 . We use the `chrome.extension.getURL` API.
- **2018-04-13** @kspearrin: Perhaps the solution is we need to move away from injecting an iFrame and generate the DOM directly on the page?
- **2018-04-13** @kmodi: Would be worth checking, also try and use `url(data:image/png;base64--------` technique to load resources.
- **2018-04-13** @kspearrin: This is loading an HTML page though, not a simple binary image.
- **2018-04-13** @kspearrin: This comment in the referenced Bugzilla thread seems to provide a viable solution for our use case: https://bugzilla.mozilla.org/show_bug.cgi?id=1372288#c25
- **2018-04-13** @kspearrin: I added this simple fix: https://github.com/bitwarden/browser/commit/46dabd5d8ab015554c7854f62e5f914004b8276f

Trying it on your test page seems to demonstrate that the resource URL is no longer being leaked through iframe src.

Can you confirm?
- **Report Needs More Info**
- **Report New**
- **2018-04-13** @kspearrin: What version of node are you using? `node --version`
- **2018-04-13** @kspearrin: Try pulling latest. I fixed the syntax error mentioned in the webpack file. Not sure why it compiled fine on my machine. Maybe I am using a more forgiving version of node.
- **Report Needs More Info**
- **Report New**
- **2018-04-13** @kspearrin: I am not sure. This is during build? I am running node 9.7.1
- **2018-04-13** @kmodi: Ok, so got it working. Upgraded the node version.

So, I can confirm it fixes the issue. However, Bitwarden will be still vulnerable to some attacks:
1. Users can still be tracked if they are using Bitwarden (document.getElementById('bit-notification-bar-iframe'))
2. It might be possible to emulate button click. (Need to be verified).

As a suggestion, for a long term fix you might want to explore Shadow Dom.(https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM), (https://glazkov.com/2011/01/14/what-the-heck-is-shadow-dom/)
- **Report Severity Updated**
- **Report Resolved**
- **2018-04-13** @kmodi: Thanks! Love the lighting fixes.
- **2018-04-23** @kmodi: If the fixed has been released and pushed on stores, is it safe to make this bug public?
- **Agreed On Going Public**
- **Report Became Public**
