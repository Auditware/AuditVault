---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
  - stack/wordpress
substate: "resolved"
weakness: null
enriched: true
date: 2017-08-22
submitted: 2016-11-20T06:36:56.932Z
bounty_usd: null
votes: 9
cve: []
program: "[[programs/wordpress|WordPress]]"
reporter: "mopman"
source: "https://hackerone.com/reports/183568"
title: "[Buddypress] Arbitrary File Deletion through bp_avatar_set"
---
# [Buddypress] Arbitrary File Deletion through bp_avatar_set

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 9 | **Program:** WordPress | **Disclosed:** 2017-08-22

- Report: [https://hackerone.com/reports/183568](https://hackerone.com/reports/183568)
- CWE: N/A
- Submitted: 2016-11-20T06:36:56.932Z

## Timeline

- **Report Filed**
- **2016-11-21** @vortfu: Thanks for the report - we'll forward this issue to the BuddyPress team immediately.
- **External User Joined**
- **2016-11-21** @jjj: Hey @mopman, thanks again for reporting this here.

I'll be looking into this. We'll need to very specifically limit file deletion access to only the 1 that's currently being interacted with.
- **Report Triaged**
- **2016-12-20** @jjj: Hi @mopman, thanks for your patience while we worked this out on our end.

We are going to start pushing fixes into each major branch, ranging from trunk (2.8) back to 2.2. How would you like to be credited publicly for identifying and responsibly disclosing this to us? This includes commit messages and any blog posts that outline the situation and subsequent releases.

Talk soon,

-JJJ
- **Report Resolved**
- **Bounty Awarded**
- **2017-03-07** @mopman: Thanks for the bounty guys, and glad to see this got resolved.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
