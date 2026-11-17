---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
date: 2026-11-13
submitted: 2026-11-05T10:26:01.788Z
bounty_usd: null
votes: 59
cve: []
program: "[[programs/basecamp|Basecamp]]"
reporter: "matty69v"
source: "https://hackerone.com/reports/4175245"
title: "Cross-account stored XSS on app.basecamp.com leads to persistent administrator takeover"
---
# Cross-account stored XSS on app.basecamp.com leads to persistent administrator takeover

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 59 | **Program:** Basecamp | **Disclosed:** 2026-11-13

- Report: [https://hackerone.com/reports/4175245](https://hackerone.com/reports/4175245)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2026-11-05T10:26:01.788Z

## Timeline

- **Report Filed**
- **2026-11-05** @matty69v: Hello team please I found that i can do 4 more Cross account stored XSS should i do other reports ? 

Bests
- **2026-11-05** @matty69v: The following endpoints are affected by the same Lexxy vulnerability:

  - /messages/:id/edit
  - /documents/:id/edit
  - /todos/:id/edit
  - /schedule_entries/:id/edit

  Lexxy reparses untrusted `bc-attachment.content` during rich-text hydration, normalizes `select > option > div` into
  a live `div`, and preserves behavior-controlling `data-*` attributes. A legacy handler then fetches attacker-
  controlled HTML and inserts it into the page. The resulting cross-origin `turbo-frame` executes JavaScript on
  `app.basecamp.com` with the page CSP nonce.

  These endpoints are different reachable surfaces of the same Lexxy root cause so idk if i make different report :)
- **Report Triaged**
- **Report Severity Updated**
- **2026-11-06** @matty69v: Thanks u @mike37s can you explain me AC : H ?
- **Report Severity Updated**
- **2026-11-09** @djmb: You're right: Attack Complexity is Low, not High. However, Scope is Unchanged. The script runs in Basecamp as the administrator, and everything it does is within what Basecamp itself authorizes that administrator to do. We've re-scored this as CVSS:3.1/AV:N/AC:L/PR:L/UI:R/S:U/C:H/I:H/A:N (7.3, High). We'll update you here when the fix ships.
- **2026-11-09** @matty69v: Okay thanks @djmb the bounty will be awarded at the fix ?
- **Report Severity Updated**
- **2026-11-09** @djmb: A correction to our last reply: under CVSS 3.1, stored XSS is a Scope change, so Scope is Changed, not Unchanged. We've re-scored this as CVSS:3.1/AV:N/AC:L/PR:L/UI:R/S:C/C:H/I:H/A:N (8.7, High). This report is a bypass of the fix for an earlier report, so the bounty falls under our rule for bypasses of previously fixed vulnerabilities: 35% to 70% of the original bounty. We'll update you here when the fix ships.
- **2026-11-09** @matty69v: Could i be added to the original bypassed report ? @djmb 

Bests
- **2026-11-10** @matty69v: Hi @djmb,

Thank you for adding me to the original report, I really appreciate it.

I agree it shares the same root cause (untrusted `bc-attachment` content being reparsed in the editor). I'd just note that the path is a bit different: it goes through the `select > option > div` parser normalization and the legacy `data-behavior` handlers rather than Stimulus controllers, and reaches script execution via the Turbo frame nonce. I hope that can be taken into account when the bypass percentage is decided.

Happy to help test the fix whenever it's ready ^^

Best regards,
Matty
- **2026-11-11** @djmb: We've deployed a fix for this. Could you retest and confirm whether it holds on your side?
- **2026-11-11** @matty69v: Hi @djmb 

Thanks for the update. I retested and can confirm the fix works.

There is now server-side sanitization of the content attribute on bc-attachment elements. I stored a new payload from the outside-collaborator account:
- The original <select><option><div data-behavior="load_drafts_link" data-url="…"> payload is now saved as content="".
- A variant using the jquery-ujs gadget (<a data-disable-with data-behavior data-url>) is saved as a plain <a href="#"> with every data-* attribute removed.

My earlier proof records (Message Board, Docs & Files, To-dos, Calendar and Card Table) also come back with sanitized content now. The legacy data-behavior sinks (load_drafts_link, load_logo_uploader) and the jquery-ujs gadgets can no longer be reached, so the stored XSS and the admin takeover chain are no longer reproducible.

Thanks for the quick fix!

Best,
matty69v
- **2026-11-12** @matty69v: @djmb @mike37s Do you need something on my side ?
- **Report Resolved**
- **Agreed On Going Public**
- **Bounty Awarded**
- **2026-11-12** @matty69v: Thanks u @djmb I asked disclosure if you can accept it have a good day ;)
- **2026-11-13** @djmb: We're happy to disclose this report, but we can't hide the bounty amount from our side. HackerOne lets you hide your own bounty amounts across the site. Let us know when you're happy for the disclosure to go ahead, and we'll wait for that before we disclose.
- **2026-11-13** @matty69v: Go for disclosure :) @djmb
- **Agreed On Going Public**
- **Report Became Public**
