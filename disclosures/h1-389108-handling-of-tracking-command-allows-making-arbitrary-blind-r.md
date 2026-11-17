---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - env/web
substate: "resolved"
weakness: null
enriched: true
date: 2019-08-01
submitted: 2018-08-01T01:12:27.640Z
bounty_usd: null
votes: 202
cve: []
program: "[[programs/superhuman|Superhuman (formerly Grammarly)]]"
reporter: "metnew"
source: "https://hackerone.com/reports/389108"
title: "Handling of `tracking` command allows making arbitrary blind requests with user's cookies from Grammarly Extension's origin"
---
# Handling of `tracking` command allows making arbitrary blind requests with user's cookies from Grammarly Extension's origin

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 202 | **Program:** Superhuman (formerly Grammarly) | **Disclosed:** 2019-08-01

- Report: [https://hackerone.com/reports/389108](https://hackerone.com/reports/389108)
- CWE: N/A
- Submitted: 2018-08-01T01:12:27.640Z

## Timeline

- **2018-08-01** @metnew: Typo: `File/Blob/FileList` **clonnable** objects
- **Report Filed**
- **2018-08-01** @metnew: **UPD:** it's possible to disclose Grammarly extension id in a browser using `gnar._fetch()`:
1. Run `server.js` (`npm i serve-handler && node server.js`) 
2. Open `http://localhost:5000/to-localhost.html` (assuming both files are in the same dir)
3. Server logs headers for `http://localhost:5000/detect-id` requests
4. Find `origin: 'chrome-extension://<id>'` in process output

Need some time to investigate this issue deeper. Maybe it's possible to escalate this bug to full RCE.

> Note that requests made using `gnar._fetch` includes "Origin" header.
- **2018-08-01** @metnew: ### Attack Scenario

> [3-5 steps are only theoretical currently]

I've got an assumption about the attack scenario that could lead to RCE. However, it has one requirement:

1. User visits attacker's page
2. Page triggers XHR from background page to attacker's server and discloses extension's id
3. [Assumption] #389076 or `window.open` could be triggered to open a page on `*://*.grammarly.com` URL. Grammarly has some domains those aren't listed on hackerone and could be vulnerable. XSS on "unprotected" `*.grammarly.com` domain is enough to trigger step 4.
4. Page at `*://*.grammarly.com` vulnerable to XSS calls `chrome.runtime.connect` with extension id from step 2.
5. Result: attacker has a page connected to Grammarly's background page and could send own commands to Grammarly extension.
- **2018-08-01** @metnew: ## Firefox

I was able to repro this with Grammarly for Firefox 8.828.1757 on 63.0a1 (2018-07-31) Mozilla Nightly
- **2018-08-02** @chessmast3r: Hi @metnew,

Thanks for your submission. We are currently reviewing your report and will get back to you once we have additional information to share.

Kind regards,
@chessmast3r
- **2018-08-04** @metnew: #### Schema modifying
> Theoretically: Object schema modification is possible when sending an object from the page to content script. Maybe object with modified schema could be sent to background page too.

> Probably it's possible to change `Object.prototype.apply` to something that attacker wants and sent to background page + bypass `JSON.stringify` with additional getters/setters/property config. I'll check this attack vector too.
- **2018-08-04** @metnew: Sorry, I forgot that the extension's `id` is static and assigned by Chrome marketplace. I'll submit another report if a page could connect to background page from `*.grammarly.com`.
- **Report Triaged**
- **2018-08-07** @metnew: @chessmast3r I don't understand why this issue could be closed. The patch is easy - just remove `_fetch` from the `p.tracker.gnar` object -> attacker can't call `fetch` from the extension with own args.
- **Bounty Awarded**
- **Report Resolved**
- **2018-08-08** @metnew: Hi @grammarly 
Thanks for the great bounty!
@andriy_derevyanko  - Yeah, the issue was fixed. Thanks for the quick resolution. 
> I hope that's only the beginning 😈
- **2018-08-13** @metnew: @grammarly @andriy_derevyanko  I think it is possible to send not only "blind" XHRs, because of this header in `fetch` polyfill:
``` js
url: "responseURL"in i ? i.responseURL : /^X-Request-URL:/m.test(i.getAllResponseHeaders()) ? i.getResponseHeader("X-Request-URL") : void 0
```

Attacker just needs to include own server url to `X-Request-URL` header. 

Some additional materials:
1. https://github.com/github/fetch/issues/443#issuecomment-262225338

> May it increases bounty somehow if I'll attach a PoC?)
- **2018-08-13** @andriy_derevyanko: @metnew thanks for extra information. Let us, please, review this case internally and I'll revert back to you with the response.
- **2018-08-14** @metnew: I've made a deeper research and it seems impossible to redirect response using Origin/Host headers :(
@andriy_derevyanko
- **2018-08-14** @metnew: @andriy_derevyanko Also, I've read your review on this report [thanks :)]. However, H1 team didn't disclose  Grammarly team contact details. I'd be glad if you can send me details by email: ██████
- **2018-08-14** @andriy_derevyanko: @metnew thanks for your contact. I also have them from Git – will drop you an email today.
With regards to this ticket. Are we considering it closed, right?
- **2018-08-14** @metnew: Yeah, closed
- **Agreed On Going Public**
- **Report Title Updated**
- **Cancelled Disclosure Request**
- **Agreed On Going Public**
- **Report Title Updated**
- **Agreed On Going Public**
- **Report Became Public**
