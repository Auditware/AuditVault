---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/privilege-escalation
  - env/web
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
date: 2019-05-24
submitted: 2019-05-20T19:34:49.683Z
bounty_usd: null
votes: 8
cve: []
program: "[[programs/homebrew|Homebrew]]"
reporter: "keeleysam"
source: "https://hackerone.com/reports/586251"
title: "Homebrew installed LaunchDaemons create simple root esclations"
---
# Homebrew installed LaunchDaemons create simple root esclations

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 8 | **Program:** Homebrew | **Disclosed:** 2019-05-24

- Report: [https://hackerone.com/reports/586251](https://hackerone.com/reports/586251)
- CWE: Privilege Escalation
- Submitted: 2019-05-20T19:34:49.683Z

## Timeline

- **Report Filed**
- **2019-05-20** @mikemcquaid: I don't see this as being particularly Homebrew-specific as it could apply to any plist for binaries running in user-writable locations. How would you see this being mitigated? Thanks!
- **2019-05-20** @keeleysam: It is true that this isn't really homebrew specific, and that the real fix here would be for launchd to not run anything which is user writable, but barring any changes on that side this is a hole that homebrew is opening up.

To mitigate, when Homebrew sets up a LaunchDaemon like this, it should ensure that what it points at is not mutable by the user without authentication.  This should probably be by ensuring that the directory is owned by root:wheel instead of user:staff, in this example `/usr/local/opt/dnsmasq/sbin`.  This would mean that updates to executable require authentication, but this is how it really should be.

Otherwise, any of these homebrew LaunchDaemons are just places where arbitrary code can get run as root with very little effort.
- **2019-05-20** @keeleysam: Also I would presume that you already need to elevate permissions to unload and reload the launchdaemon for updates, so doing that to update the executable in the directory it is run from shouldn't be a compromise to user experience.
- **2019-05-21** @mikemcquaid: Just to keep you in the loop: there's ongoing discussion with the Homebrew maintainers on how best to mitigate this (or at least better inform users of the risks).
- **2019-05-23** @mikemcquaid: I've got a proof of concept up here: https://github.com/Homebrew/homebrew-services/compare/master...MikeMcQuaid:root-ownership

This will take ownership of the binary and `bin` or `sbin` directory and set the sticky bit on both. In my testing this prevents the replacement of these files.

If you consider this to resolve the issue I'll close and disclose.

Thanks again!
- **2019-05-23** @keeleysam: This looks reasonable to me - this is a nifty use of the sticky bit.

Sam
- **Report Resolved**
- **2019-05-24** @mikemcquaid: Great work, thanks again!
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
