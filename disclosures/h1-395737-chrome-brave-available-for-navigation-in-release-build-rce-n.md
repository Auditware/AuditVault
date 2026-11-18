---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
substate: "resolved"
weakness: null
enriched: true
body: true
date: 2018-09-25
submitted: 2018-08-16T04:53:51.685Z
bounty_usd: null
votes: 46
cve: []
program: "[[programs/brave|Brave Software]]"
reporter: "metnew"
source: "https://hackerone.com/reports/395737"
title: "`chrome://brave` available for navigation in Release build [-> RCE] + navigation to `chrome://*` using tab_helper ['Open in new tab']"
---
# `chrome://brave` available for navigation in Release build [-> RCE] + navigation to `chrome://*` using tab_helper ["Open in new tab"]

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 46 | **Program:** Brave Software | **Disclosed:** 2018-09-25

- Report: [https://hackerone.com/reports/395737](https://hackerone.com/reports/395737)
- CWE: N/A
- Submitted: 2018-08-16T04:53:51.685Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:

### `chrome://brave` is available for navigation

Navigation to `chrome://brave` + `<local_file_path>` requires local file at `<local_file_path>`.

The file loaded in this context has access to **private Muon APIs** such as `chrome.ipcRenderer/remote/webFrame/webViewRequest`.

Muon API allows executing code on the device. (e.g. with `chrome.remote.require('child_process').exec`)

> In addition, Brave isn't sandboxed (on all OS).

That's clearly a vulnerability, not a feature:
1. it's in Release channel, not in Debug builds
2. Could lead to RCE

> Note: attacker knows the correct `<local_file_path>` after loading the file from `file://` origin (`window.location.pathname`).

### Navigation to `chrome://brave`

I've already shown the way to navigate to `file://` URLs in  #369218, which was fixed in 0.23.80.

>  I mentioned in the report that it's possible navigating to `chrome://` URLs too in #369218. However, [the fix](https://github.com/brave/browser-laptop/pull/14973) was incomplete. It only works for `about:` and `file:`URLs.

### PoC

1. Shows that `<webview>` works
2. Launches `Calculator.app` on macOS

## Products affected: 
 
Brave: 0.23.79 (0.23.80 and 0.23.100 too, where #369218 is patched)
V8: 6.8.275.24 
rev: 51b49051a779f0db94fbcfd0df5faca781299ea0 
Muon: 8.0.7 
OS Release: 17.7.0 
Update Channel: Release 
OS Architecture: x64 
OS Platform: macOS 
Node.js: 7.9.0 
Brave Sync: v1.4.2 
libchromiumcontent: 68.0.3440.84

## Steps To Reproduce ||  Attack Scenario:

1. Download `exploit.html`
2. Open link in the file using "Open in new tab"
3. The new tab opens with private `<webview>` tag + `Calculator.app` starts

## Patch

Preventing navigation to `chrome://brave` origin seems ok.

### Additional resources

Screencast attached.

## Impact

Crafted HTML file allows executing code on the device. 

> Requires user gesture - "Open in a new tab". Set impact to "High", because requires downloading the file.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2018-08-17** @metnew: Fixed in: https://github.com/brave/browser-laptop/pull/15047
- **2018-08-17** @metnew: > @diracdeltas Are you sure the fix is complete? It still seems possible navigating to "chrome://brave" from address bar.
- **2018-08-19** @diracdeltas: @metnew you're right, i thought we already blocked navigation to chrome:// but turns out we don't
- **2018-08-21** @diracdeltas: we're also just going to remove the chrome.remote.require API since it's from Electron but we don't use it: https://github.com/brave/muon/pull/644
- **2018-08-21** @metnew: I think there is an RCE without `chrome.remote`. I'm going to review this case now @diracdeltas
- **2018-08-21** @diracdeltas: BTW i still plan on blocking chrome:// loads - just saying we can also remove some of these APIs
- **2018-08-21** @metnew: Removing `Webview` and `chrome.webFrame` in the context of `chrome://brave/*` seems impossible, however, it's possible to leverage these APIs to UXSS. So blocking navigation to `chrome://brave` is still required.
- **2018-08-21** @metnew: @diracdeltas 
Blocking navigation to `chrome://` should work.
However, I'm afraid of debugging capabilities: will `chrome://histograms/` being accessible in this case?
- **2018-08-21** @diracdeltas: @metnew good call! i didn't realize we supported chrome://histograms. i guess i can just block chrome://brave
- **2018-08-21** @metnew: @diracdeltas Also:
chrome://blob-internals/
chrome://appcache-internals/
chrome://serviceworker-internals/
chrome://webrtc-internals/
chrome://network-errors/
chrome://media-internals/
and something related to USB, AFAIR

I was thinking about local files reading ( #369218 + #375329) from the web with opening a new tab pointing to "chrome://blob-internals/<blob>" or something similar. 
I didn't find a way to do this :(
- **2018-08-21** @metnew: @diracdeltas  I think `https://github.com/brave/muon/pull/644` is not a good patch against RCE since `chrome.ipcRenderer` continues being available in this case.  

> UXSS of course available in any case

Blocked navigation to `chrome://brave/*` is required.
- **2018-08-21** @metnew: Seems possible to require `require` using 

```js
ipcMain.on('ELECTRON_BROWSER_GET_BUILTIN', function (event, module) {
  try {
    event.returnValue = valueToMeta(event.sender, electron[module])
  } catch (error) {
    event.returnValue = exceptionToMeta(error)
  }
})
```
- **2018-08-23** @metnew: 2nd part of the fix: https://github.com/brave/browser-laptop/pull/15076
- **2018-08-23** @metnew: The vulnerability was completely fixed in 0.23.104
- **2018-08-29** @metnew: > Hope, you'll consider [my comments](https://hackerone.com/bugs?subject=user&report_id=395737&view=open&substates%5B%5D=new&substates%5B%5D=needs-more-info&substates%5B%5D=triaged&substates%5B%5D=pre-submission&reported_to_team=&text_query=&program_states%5B%5D=2&program_states%5B%5D=3&program_states%5B%5D=4&program_states%5B%5D=5&sort_type=latest_activity&sort_direction=descending&limit=25&page=1#activity-3211359)/activity, when estimating bounty
- **2018-09-03** @metnew: Hi @brave, any updates?
- **Bounty Awarded**
- **Report Resolved**
- **2018-09-04** @metnew: Great, thanks @brave!
- **Agreed On Going Public**
- **2018-09-21** @metnew: @diracdeltas 
### RCE from the web

 #369218 allowed opening a system HTML files to trigger reflected XSS.
That vulnerability makes this problem Critical.

### Attack scenario

1. Open `chrome://brave/<local_file_with_reflected_XSS>`
2. Trigger RCE.

### Summary

So, yeah, in some sense, that's RCE from the web.
- **Bounty Awarded**
- **Agreed On Going Public**
- **Report Became Public**
- **2018-09-25** @metnew: Thanks, @brave!
- **2018-09-26** @diracdeltas: @metnew correctly pointed out in a comment on https://hackerone.com/reports/369218#activity-3388871 that this vuln is pretty easy to trigger if you have MITM access. for instance MacOS apparently loads a file automatically over HTTP (i haven't verified this). or the attacker could just wait for the user to initiate a download over HTTP.

furthermore, a MITM could redirect any HTTP request in Brave to an attacker site, which would then trigger this exploit. i think this means effectively RCE from MITM with almost no user interaction.

given that i think we should consider increasing the bounty yet again. @toml
- **2018-09-26** @metnew: <FROM-#369218>

By default macOS includes `/System/Library/CoreServices/Photo Library Migration Utility.app/Contents/Frameworks/RedRock.framework/Versions/A/Resources/GooglePlaceSearchV3.html` file.

This file on the local filesystem requires a Google Maps scripts from the web over `http://`. 
That's unsafe. MITM => running own scripts on `file://` and `chrome://brave/` origins.

Yeah, so that means an attacker with a MITM access can "level up" bugs that requires running scripts on `file:///` origin: like #390362, #375329 and #395737 (this report).

Tested on the latest High Sierra.

</FROM-#369218>

### Attack Scenario (via navigation)

1. User (via copypasting URL or #369218) navigates to `chrome://brave/System/Library/CoreServices/Photo Library Migration Utility.app/Contents/Frameworks/RedRock.framework/Versions/A/Resources/GooglePlaceSearchV3.html` - This file is available in default macOS installation (High Sierra)

2. This HTML file loads Google Maps scripts from `http://maps.googleapis.com/maps/api/js?v=3&client=gme-appleinc&libraries=places&sensor=false`

3. Attacker with MITM access could inject own JS 

4. RCE

@diracdeltas, the attack vector via MITMing downloaded HTML files is also great, thanks for pointing.
- **2018-09-26** @metnew: @diracdeltas, HTTPS everywhere doesn't work on `file:///`, scripts blocking doesn't work on `file:///`.
Don't know whether it's a separate issue, but this behavior allows MITMing scripts on `file:///` and `chrome://brave/`.
- **2018-09-27** @metnew: @diracdeltas 
Also, check https://hackerone.com/reports/415258#activity-3397382

\\--Copypasted from #415258--\
## MITM vs HTTPSE

`chrome://brave` is always vulnerable to MITM even when HTTPSE is active
`file://` is vulnerable to MITM, when HTTPSE is inactive

> As far as I know, HTTPS Everywhere isn't enabled by default.
- **Bounty Awarded**
- **2018-09-27** @metnew: Great!

I've considered the most realistic case involving navigation to `chrome://brave` origin. 
Relying on non-default files is not reasonable, so MITM should occur on `maps.googleapis.com`
HTTPSE correctly handles `maps.googleapis.com` (probably?).

But from my observations, it doesn't matter since `chrome://brave` origin is always vulnerable to MITM despite the HTTPSE.

> I guess there is no logic mistake in my assumption
