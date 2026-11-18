---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/privacy-violation
  - env/web
  - vuln/info-disclosure
substate: "resolved"
weakness: "Privacy Violation"
enriched: true
body: true
date: 2017-11-07
submitted: 2017-08-10T09:33:18.962Z
bounty_usd: null
votes: 10
cve: []
program: "[[programs/brave|Brave Software]]"
reporter: "qab"
source: "https://hackerone.com/reports/258578"
title: "application/x-brave-tab should not be readable."
---
# application/x-brave-tab should not be readable.

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 10 | **Program:** Brave Software | **Disclosed:** 2017-11-07

- Report: [https://hackerone.com/reports/258578](https://hackerone.com/reports/258578)
- CWE: Privacy Violation
- Submitted: 2017-08-10T09:33:18.962Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:

It is possible to read a dragged tab object if user is coerced into drag and dropping it into attacker controlled page. This is bad because tab history is mentioned within the object, thus information leaks are possible through a trick.

## Products affected: 

 
Brave: 0.18.14 
rev: ad92d029e184c4cff01b2e9f4916725ba675e3c8 
Muon: 4.3.6 
libchromiumcontent: 60.0.3112.78 
V8: 6.0.286.44 
Node.js: 7.9.0 
Update Channel: dev 
OS Platform: Microsoft Windows 
OS Release: 10.0.14393 
OS Architecture: x64

## Steps To Reproduce:

1. Open PoC and click on button.
2. Popup should appear loading facebook and then should direct to a dummy page
3. Attempt to drag and drop the newly opened windows tab into the big 'O' under the button. (as if you are trying to move the tab but instead you drop it into the O)
4. We can successfully read 'x-brave-tab' object including history.

As I mentioned before, so much information is available in the output, specifically I want to point to the history section, where we can extract victims facebook name by reading URL after redirect.
This is done by opening a popup pointing to 'https://www.facebook.com/me' which will instantly redirect to 'https://www.facebook.com/{your name}' and then we redirect into a dummy page in order to create a history object.

Given that the user is not dragging directly from facebook.com then it is not the same as having a user copy paste or drag n drop their facebook URL. This is pretty much completely done within attacker controlled website.

## Supporting Material/References:

PoC attached.
Also, I wonder if something worse could happen messing with this object. I haven't been able to produce my own custom tabs yet, but if that is even theoretically possible then we 'theoretically' also have control of all the variables mentioned in the tab object.

Here is a sample of the output:
```
{"showOnRight":false,"security":{"isSecure":false,"runInsecureContent":false},"src":"about:blank","lastAccessedTime":1502356944847,"computedThemeColor":null,"guestInstanceId":44,"adblock":{},"partition":"persist:default","findDetail":{"searchString":"","caseSensitivity":false},"noScript":{},"endLoadTime":1502356942486,"navbar":{"urlbar":{"location":"http://localhost/wut.html","suggestions":{"selectedIndex":null,"searchResults":[],"suggestionList":null,"shouldRender":false},"selected":false,"focused":false,"active":false}},"trackingProtection":{},"tabId":322,"zoomLevel":0,"breakpoint":"default","partitionNumber":0,"history":["https://www.facebook.com/abdulrahman.alqabandi.3","https://www.facebook.com/abdulrahman.alqabandi.3","http://localhost/wut.html"],"audioMuted":false,"startLoadTime":1502356941347,"provisionalLocation":"https://www.facebook.com/abdulrahman.alqabandi.3","location":"http://localhost/wut.html","fingerprintingProtection":{},"httpsEverywhere":{},"audioPlaybackActive":false,"disposition":"new-popup","title":"localhost/wut.html","searchDetail":null,"icon":null,"isPrivate":false,"openerTabId":5,"parentFrameKey":null,"loading":false,"hrefPreview":"","unloaded":false,"key":1}
```

## Timeline

- **Report Filed**
- **2017-08-10** @asuka: Thanks for your report - we're looking into this and will get back to you as soon as we have an update.
- **Report Triaged**
- **Report Resolved**
- **Bounty Awarded**
- **2017-09-12** @qab: Thanks!
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
