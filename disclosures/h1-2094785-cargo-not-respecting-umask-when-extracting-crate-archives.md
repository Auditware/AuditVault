---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
  - vuln/code-injection
substate: "resolved"
weakness: null
enriched: true
body: true
date: 2023-08-15
submitted: 2023-08-03T15:30:18.564Z
bounty_usd: 4660
votes: 7
cve: "CVE-2023-38497"
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "addisoncrump"
source: "https://hackerone.com/reports/2094785"
title: " Cargo not respecting umask when extracting crate archives"
---
#  Cargo not respecting umask when extracting crate archives

> **Severity:** High | **Bounty:** 4,660 USD | **Votes:** 7 | **Program:** Internet Bug Bounty | **Disclosed:** 2023-08-15

- Report: [https://hackerone.com/reports/2094785](https://hackerone.com/reports/2094785)
- CWE: N/A | CVE: CVE-2023-38497
- Submitted: 2023-08-03T15:30:18.564Z

## Report summary

Cargo not respecting umask when extracting crate archives

Description
The Rust Security Response WG was notified that Cargo did not respect the umask when extracting crate archives on UNIX-like systems. If the user downloaded a crate containing files writeable by any local user, another local user could exploit this to change the source code compiled and executed by the current user.

This vulnerability has been assigned CVE-2023-38497.

Overview
In UNIX-like systems, each file has three sets of permissions: for the user owning the file, for the group owning the file, and for all other local users. The "umask" is configured on most systems to limit those permissions during file creation, removing dangerous ones. For example, the default umask on macOS and most Linux distributions only allow the user owning a file to write to it, preventing the group owning it or other local users from doing the same.

When a dependency is downloaded by Cargo, its source code has to be extracted on disk to allow the Rust compiler to read as part of the build. To improve performance, this extraction only happens the first time a dependency is used, caching the pre-extracted files for future invocations.

Unfortunately, it was discovered that Cargo did not respect the umask during extraction, and propagated the permissions stored in the crate archive as-is. If an archive contained files writeable by any user on the system (and the system configuration didn't prevent writes through other security measures), another local user on the system could replace or tweak the source code of a dependency, potentially achieving code execution the next time the project is compiled.

Acknowledgments
We want to thank Addison Crump for responsibly disclosing this to us according to the Rust security policy.

Full GHSA link: https://github.com/rust-lang/cargo/security/advisories/GHSA-j3xp-wfr4-hx87

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Cargo did not properly protect files in the cargo registry. When an archive contained files which were marked as globally writeable, they would be unpacked as-is and retain their global writeability. This is CWE-278 (not available in HackerOne).

This was discovered as part of a (personal) routine file permissions check:

```sh
find / ! -type l -perm -002 -exec ls -alhd {} \;
```

## Impact

A local attacker may inject arbitrary code into the cached files present in the cargo registry. This, in turn, allows for a local attacker to act as the targeted user (when the user compiles the modified code) or to poison prebuilt binaries built by that user and thus have arbitrary code execution against downstream users (supply chain attack).

## Timeline

- **Report Filed**
- **2023-08-03** @addisoncrump: Please note also the security announcement here: https://blog.rust-lang.org/2023/08/03/cve-2023-38497.html
- **Report Triaged**
- **Cve Id Added**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **2023-08-15** @addisoncrump: No trouble at all. Thank you for helping to organise this bounty program. :)

I intend to donate this bounty to an open source project but am still waiting on the related support ticket. Not sure if I need to take any action w.r.t. this.
- **Agreed On Going Public**
- **Report Became Public**
- **2023-08-18** @addisoncrump: Disregard the above; while organising for my secondary donation, the open source project declined the donation. Thanks again!
