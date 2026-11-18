---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-generic
  - env/web
  - vuln/xss
  - vuln/csrf
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Generic"
enriched: true
body: true
date: 2023-06-22
submitted: 2020-09-28T21:16:34.835Z
bounty_usd: null
votes: 17
cve: []
program: "[[programs/brave|Brave Software]]"
reporter: "nishimunea"
source: "https://hackerone.com/reports/993670"
title: "Universal XSS through FIDO U2F register from subframe"
---
# Universal XSS through FIDO U2F register from subframe

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 17 | **Program:** Brave Software | **Disclosed:** 2023-06-22

- Report: [https://hackerone.com/reports/993670](https://hackerone.com/reports/993670)
- CWE: Cross-site Scripting (XSS) - Generic
- Submitted: 2020-09-28T21:16:34.835Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:

There are three weaknesses in Brave's FIDO U2F implementation.

* `u2f.register()` can be executed from cross-origin subframe by invoking [U2F.postMessage](https://github.com/brave/brave-ios/blob/e52c52495aa654584abe8172d689977756e6549d/Client/Frontend/UserContent/UserScripts/U2F.js#L264) directly
* Then, FIDO related modals show the name of top frame origin (but not caller subframe)
* The `version` parameter sent from the above `postMessage` is embedded in an [evaluateJavaScript](https://github.com/brave/brave-ios/blob/d01b8c07b8a6244af48798efe4afeccd266707e2/Client/WebAuthN/U2FExtensions.swift#L1003) without escape

The combination of these weaknesses allows cross-domain subframe to inject any JavaScript code to the top frame through fake U2F registration process.
## Products affected: 

 * Brave iOS Version 1.20 (20.09.11.20), also current Nightly

## Steps To Reproduce:

* Open [UXSS Victim](https://alice.csrf.jp/brave/uxss_victim.php) hosted on alice.csrf.jp.
  This site has a cross-origin iframe that opens evil.csrf.jp.
* Ready to Scan dialog is shown with the name of top frame
* Insert your FIDO device such as YubiKey 5Ci and touch
* Injected JavaScript `alert()` is executed on the top frame

## Supporting Material/References:

  * See attached movie file for the demonstration

## Impact

As written in summary, malicious web content in subframe can UXSS on the top frame origin.

## Timeline

- **Report Filed**
- **2020-09-29** @nishimunea: > u2f.register() can be executed from cross-origin subframe by invoking U2F.postMessage directly
> Then, FIDO related modals show the name of top frame origin (but not caller subframe)

`navigator.credentials.create` in WebAuthentication API also meets the above 2 conditions, except for UXSS.
[Here](https://alice.csrf.jp/brave/webauthn_parent.php) is the demonstration. You can see a FIDO2 modal with the name of `alice.csrf.jp` but the actual request initiator is `evil.csrf.jp` opened in an iframe.
- **2020-09-30** @nishimunea: @pranjal_jumde Hello, I find your usual response is really speedy, but this case seems to take a bit longer than usual. Is there anything I can help with?
- **Report Triaged**
- **2020-09-30** @nishimunea: @pranjal_jumde Thanks, that’s all right!
- **2020-10-12** @diracdeltas: pranjal has a candidate fix for this and similar issues here: https://github.com/brave/brave-ios/pull/2930/
- **2020-10-13** @nishimunea: @diracdeltas Thanks for sharing the progress! As far as I checked it's nice fix.
- **2020-10-13** @diracdeltas: @nishimunea just to give you an update on our fix timeline:

@pranjal_jumde is going to make a PR that does the minimum viable fix for the U2F XSS issue, and possibly another issue with the password manager. We are aiming to get this out in a 1.20 hotfix or 1.21 at the latest.

There is a broader fix that needs to be done to prevent these attacks in other parts of our code. Since this will require a lot more testing and QA resources, we probably won't be able to get it out until 1.23 which is going out in Jan 2021.

We would appreciate it if we could keep this issue private until the broader fix is out.
- **2020-10-13** @nishimunea: @diracdeltas I understood. Yes, I will keep it private until the complete fix!
- **Bounty Awarded**
- **Report Resolved**
- **2020-10-22** @diracdeltas: the more comprehensive follow-up fix is https://github.com/brave/brave-ios/issues/2957, which we are aiming for in 1.23 (Jan 2021).
- **2020-10-22** @nishimunea: I see! Thanks!
- **2023-06-22** @nishimunea: Hello! Could you make this bug ticket accessible to the public?
As time has passed since the fix and this product is now already secure, I'd like to make this hacktivity details available for anyone to reference.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
