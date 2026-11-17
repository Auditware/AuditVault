---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
substate: "resolved"
weakness: null
enriched: true
date: 2018-10-22
submitted: 2018-09-27T11:45:41.134Z
bounty_usd: null
votes: 16
cve: []
program: "[[programs/brave|Brave Software]]"
reporter: "metnew"
source: "https://hackerone.com/reports/415258"
title: "RCE: DnDing shortcut files to chrome://brave allows loading HTML files in Muon's context"
---
# RCE: DnDing shortcut files to chrome://brave allows loading HTML files in Muon's context

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 16 | **Program:** Brave Software | **Disclosed:** 2018-10-22

- Report: [https://hackerone.com/reports/415258](https://hackerone.com/reports/415258)
- CWE: N/A
- Submitted: 2018-09-27T11:45:41.134Z

## Timeline

- **Report Filed**
- **2018-09-27** @metnew: ## DnDing links from other apps works too!

This vector is much more dangerous for sure.
No shortcut files required.

1. Send `chrome://brave/etc/passwd` link via `Mail.app`
2. Dnd this link to Brave
3. `chrome://brave/etc/passwd`!
- **Report Triaged**
- **2018-09-27** @metnew: I don't know what's behind #415178, however, I had reported this issue 3 days ago on Twitter, before #395737 was disclosed (in case of a duplicate)
- **2018-09-28** @diracdeltas: @metnew the other issues is `'chrome://brave' can be navigated to using the middle mouse click (or normal click with CTRL held) IFF coming from a bookmark.` and then later the reporter realized that it can also be navigated via DnD. we will award for both but the fix is probably the same.
- **2018-10-03** @diracdeltas: i couldn't repro the STR using the .webloc files on macOS. brave opened 2 error pages + the contents of the webloc file, not /etc/passwd.
- **2018-10-03** @metnew: Did you use DnD?
~~What does STR mean?~~
- **2018-10-03** @diracdeltas: @metnew yes i did drag and drop

can you check out this PR and see if it fixes it for you? https://github.com/brave/browser-laptop/pull/15261
- **2018-10-03** @metnew: Ooh, I removed sources a few days ago :(
Ok, I'll check
- **2018-10-03** @metnew: @diracdeltas 
1. Cloned `master` => Navigation to `chrome://brave` via DnD works for me.
2. I discovered why DnD works as file viewer for you => `.webloc` file is probably corrupted. e.g. a space char in "URL" key exists
3. Switched to the branch with fix => navigation to `chrome://brave` doesn't work

However, I have a suggestion for you: `details.url.startsWith('chrome://brave')`. 
Maybe it'd better switching to `indexOf` or similar? 
I saw some cases where a null byte at the beginning of the string allowed to bypass such checks. (UXSS in Webkit in 2013 via `%01javascript:` URI)
I guess, it's more robust and navigation to `%00chrome://brave`(and similar) will be considered as invalid.

~~`details.url` might be already sanitized before this check, I don't know~~
- **2018-10-03** @metnew: > Attached `webloc` files are well formatted, maybe it happens because of your custom settings
- **2018-10-03** @diracdeltas: chromium does some kind of normalization on the URL (for instance it is always lowercase) but no harm in changing it to be more strict
- **Bounty Awarded**
- **2018-10-04** @metnew: Great, thanks @brave!
- **Report Resolved**
- **Agreed On Going Public**
- **2018-10-20** @metnew: Hi @diracdeltas, maybe let's disclose this bug? 2 weeks passed
- **2018-10-22** @toml: We normally count two weeks from the date that the release has been available for download. I think that today marks that two-week mark for 0.25.2, so public it is.
- **Agreed On Going Public**
- **Report Became Public**
