---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - env/web
substate: "resolved"
weakness: null
enriched: true
date: 2018-09-25
submitted: 2018-08-03T02:40:34.651Z
bounty_usd: null
votes: 74
cve: []
program: "[[programs/brave|Brave Software]]"
reporter: "metnew"
source: "https://hackerone.com/reports/390013"
title: "Local files reading from the web using `brave://`"
---
# Local files reading from the web using `brave://`

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 74 | **Program:** Brave Software | **Disclosed:** 2018-09-25

- Report: [https://hackerone.com/reports/390013](https://hackerone.com/reports/390013)
- CWE: N/A
- Submitted: 2018-08-03T02:40:34.651Z

## Timeline

- **Report Title Updated**
- **2018-08-03** @metnew: ## Patch

I saw the Brave team's patch for #375329. As far as I remember, they made a check to not convert `brave://` to `file://`. However, `brave://` is nested from `AsarProtocolHandler`(correct name?) that adds `Access-Control-Allow-Origin: *` header to all requests. 

The patch is simple 😈
- **2018-08-03** @metnew: ### Typo

`brave://` protocol was introduced as a replacement for `file://` protocol that was nesting `AsarProtocolHandler`(or something like that) in `brave/muon`.

> That's from my understanding. Probably, Brave will use `brave://` similarly to `chrome://` in future (as a browser-level protocol handler for internal config or etc.).
- **2018-08-03** @metnew: > I've contacted @diracdeltas through security@brave.com

### Impact
Note that it's a generic issue: it also allows local files downloading/inclusion through `brave://`.

> ~~I hope that Brave will not ignore my messages as usual and read this:~~

### Patch

#### `Access-Control-Allow-Origin: *` - quick fix
Remove `Access-Control-Allow-Origin: *` headers from `AsarProtocolHandler` response

#### `FileProtocolHandler` vs `AsarProtocolHandler`

`brave://` should behave as `file://` (`net::FileProtocolHandler`). That's probably impossible. 

If `brave://` inherits `AsarProtocolHandler`, you have to apply the same rules to this protocol as `FileProtocolHandler` has (i.e., make it inaccessible from the web). This likely requires changes on the Chromium level.

From the other side, removing `AsarProtocolHandler` from the codebase is probably impossible because of Electron requirements (not sure).
- **2018-08-03** @metnew: This vulnerability was fixed in https://github.com/brave/muon/commit/85de41ea3f6b069e0e4f628da7365e3f4e5c9cf2

> Thanks for the quick fix @brave
- **Report Filed**
- **Report Resolved**
- **Bounty Awarded**
- **2018-08-03** @metnew: Omg, Brave ❤️
- **Agreed On Going Public**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Report Became Public**
