---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
substate: "informative"
weakness: null
enriched: true
date: 2018-06-06
submitted: 2018-05-27T00:30:07.597Z
bounty_usd: null
votes: 0
cve: []
program: "[[programs/torproject|Tor]]"
reporter: "metnew"
source: "https://hackerone.com/reports/358005"
title: "Tor Browser: iframe with `data:` uri  has access to parent window"
---
# Tor Browser: iframe with `data:` uri  has access to parent window

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 0 | **Program:** Tor | **Disclosed:** 2018-06-06

- Report: [https://hackerone.com/reports/358005](https://hackerone.com/reports/358005)
- CWE: N/A
- Submitted: 2018-05-27T00:30:07.597Z

## Timeline

- **Report Filed**
- **2018-05-28** @geko: What do you mean with "latest Firefox"? There is more than one latest Firefox: There is Firefox 60.0.1, Firefox 60.0.1 ESR, and Firefox 52.8.0 ESR. We are still following the ESR 52 series while we are preparing the switch to ESR 60. Are you claiming that Firefox 52.8.0 ESR does not inhibit that flaw while Tor Browser 7.5.4 does? If not, have you contacted Mozilla to report this bug as well? To test a normal Firefox 52.8.0 ESR you can download a version from https://www.mozilla.org/en-US/firefox/organizations/all/#legacy.
- **Report Needs More Info**
- **Report New**
- **Report Informative**
- **2018-05-28** @metnew: I filled a report to Mozilla, but as I understand, ESR should be patched against this, so that's a vulnerability anyway. Hope, they will qualify it as a valid security bug, because of Tor.
Thanks for a quick response!
- **2018-05-30** @geko: Could you give us a link to your bug report, so that we can follow it?
- **2018-05-30** @metnew: https://bugzilla.mozilla.org/show_bug.cgi?id=1464884
- **Agreed On Going Public**
- **2018-06-06** @metnew: FF team rejected to fix this problem in ESR52 and ESR60, so Tor browser will continue being vulnerable against this.
Link: https://bugzilla.mozilla.org/show_bug.cgi?id=1464884
- **Agreed On Going Public**
- **Report Became Public**
