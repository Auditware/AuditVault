---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
  - vuln/info-disclosure
substate: "not-applicable"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2021-09-21
submitted: 2021-09-21T18:56:44.410Z
bounty_usd: null
votes: 2
cve: []
program: "[[programs/brave|Brave Software]]"
reporter: "kkarfalcon"
source: "https://hackerone.com/reports/1347249"
title: "Information disclosure"
---
# Information disclosure

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 2 | **Program:** Brave Software | **Disclosed:** 2021-09-21

- Report: [https://hackerone.com/reports/1347249](https://hackerone.com/reports/1347249)
- CWE: Information Disclosure
- Submitted: 2021-09-21T18:56:44.410Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Vulnerability tested on:- Brave	1.29.81 Chromium: 93.0.4577.82 (Official Build) (64-bit)
Vulnerability description:- For security measures and for privacy purposes, Brave has the ability to open a normal tab of the Brave when we navigate to: `chrome://wallet`, `chrome://history` etc. due to the reason that Tor should be blocking privileged URIs like `file:///`, `chrome://` etc. When we open local storage URIs or the Data URIs, it is blocking. So, we can say that TOR in Brave protects users from opening anything privileged in the browser.
But there is some weird case for: `chrome://downloads` and `brave://inspect/#devices`. Both can be dangerous when there is a UXSS present there because it can get to know about the data. The `brave://device-log/` looks interesting too, why do we see the device log of brave in the TOR Network in the Brave? 

Steps to reproduce:
1. Open Brave with TOR
2. Navigate to `brave://inspect/#devices`

Expected behavior?
--> When we are doing device debugging, it should have opened normal Brave and shouldn't open the privileged URI in the TOR session itself. Open `chrome://bookmarks` and `chrome://history`

Actual behavior?
--> It opens the debugging session inside the protected tor session.

Suggestions?
--> We should block `chrome://downloads`,  `brave://inspect/#devices`, `brave://device-log/` etc. and when somebody tries to navigate to those URIs, a normal Brave session should be started like we do for `chrome://history` as it keeps TOR away from personal information inside the brave URIs.

## Impact

Information disclosure.

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Report New**
- **2021-09-21** @fmarier: > Why are we seeing personal downloads of Brave browser inside TOR network which is completely separate from the brave browser

The guarantee that private browsing windows and Tor windows give users is that the browsing history that takes place in these private windows will not be visible outside of that window. So in this example:

1. Download a file in a normal window (say `normal.txt`).
2. Open a Tor window.
3. Download a different file in that Tor window (say `tor.txt`).
4. Open `brave://downloads` in the normal window.
5. Open `brave://downloads` in the Tor window.

You will see only `normal.txt` in the normal window download history. You will see both `normal.txt` and `tor.txt` in the Tor window's download history. Once the Tor window is closed, the `tor.txt` entry is lost.

That's the expected behavior and as far as I can tell, it's working as expected.

Private windows and Tor windows aren't trying to hide the download history from normal windows.
- **2021-09-21** @fmarier: > Please find the video PoC attached:

Dragging a text URL into the tar bar is equivalent to copy/pasting the URL into the URL bar, or typing it by hand into the URL bar. No referrer/opener information is leaked to the original page. We consider these user-initiated navigations and so they are not meant to be blocked.
- **Report Needs More Info**
- **Report New**
- **2021-09-21** @kkarfalcon: > Dragging a text URL into the tar bar is equivalent to copy/pasting the URL into the URL bar, or typing it by hand into the URL bar. No referrer/opener information is leaked to the original page. We consider these user-initiated navigations and so they are not meant to be blocked.

That's why, I didn't make a report of this case as I was aware that writing manually and selecting the text is normal. There was a Chromium bug related to this. Else I should have sent the report to Brave team so far. The case is also in Chromium too and Brave has same codebase.
- **2021-09-21** @kkarfalcon: > If you can find an example of such a way, we would be happy to look at it and review it.

We should better allow "chrome://history" inside the TOR Network that will be reasonable, yes? We should allow chrome://wallet inside the TOR as well. Why should we initiate an extra process of brave? :)
- **2021-09-21** @kkarfalcon: > You will see only normal.txt in the normal window download history. You will see both normal.txt and tor.txt in the Tor window's download history. Once the Tor window is closed, the tor.txt entry is lost.


Anything opened in the TOR should be cleared and shouldn't be present after the process is closed, accepted. But point here is: **Why are you allowing to open chrome://downloads "inside TOR network"?** 

Why do you not allow users to open:
Chrome://bookmarks
Chrome://wallet
Chrome://history
Chrome://help
inside the TOR network? What's the reason behind it? Would you mind telling the reason why it is biased?
- **Report Not Applicable**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2021-09-22** @kkarfalcon: If they aren't sent over the TOR network, the "chrome://history" should be allowed and you must also allow the local storage URIs then. Why aren't they allowed?
- **2021-09-22** @fmarier: The reason `brave://history` is opened in normal window is that private windows (and therefore Tor windows) inherit the history from normal windows, but don't add anything to the history.

If we were to open `brave://history` in the Tor window, it might confuse users into thinking that their private browsing history has been recorded on their local disk.
- **2021-09-25** @kkarfalcon: > If we were to open brave://history in the Tor window, it might confuse users into thinking that their private browsing history has been recorded on their local disk.
Don't you think so the same? Replace the same content with `brave://downloads:

```
 If we were to open brave://downloads in the Tor window, it might confuse users into thinking that their private download history has been recorded on their local disk.
```
Note: Download history isn't saved, please check your statement too dated 22nd Sept.
