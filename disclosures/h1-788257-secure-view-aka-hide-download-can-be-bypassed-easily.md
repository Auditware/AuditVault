---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2020-04-10
submitted: 2020-02-03T13:18:19.732Z
bounty_usd: null
votes: 22
cve: "CVE-2020-8139"
program: "[[programs/nextcloud|Nextcloud]]"
reporter: "at5djl3pwjmunyutnoatp"
source: "https://hackerone.com/reports/788257"
title: "'Secure View' aka 'Hide Download' can be bypassed easily"
---
# "Secure View" aka "Hide Download" can be bypassed easily

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 22 | **Program:** Nextcloud | **Disclosed:** 2020-04-10

- Report: [https://hackerone.com/reports/788257](https://hackerone.com/reports/788257)
- CWE: Improper Access Control - Generic | CVE: CVE-2020-8139
- Submitted: 2020-02-03T13:18:19.732Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

The mid-2019 announced feature "Secure view" (https://nextcloud.com/blog/secure-view-prevent-your-shared-files-from-getting-downloaded/) allows for hiding the Download button on public shares.
Even though the announcement admits that there are always workarounds out there to get hands on the file anyway, the workaround for this one is way too simple: Just add **/download** to the URL (like you used to for every public share) and your browser starts downloading unhesitently.

For the sharee, the checkbox "Hide Download" is therefore very deceptive, since they very likely weigh themselves in false safety.

## Impact

Download a copy of a file or folder that's not supposed to be downloaded whatsoever

## Timeline

- **Report Filed**
- **2020-02-03** @Nextcloud: Thanks a lot for reporting this potential issue back to us!

Our security team will take a look at this issue as soon as possible. We will reply to your report within 72 hours, usually much faster. For obvious reasons we'd like to ask you to not disclose this issue to any other party.
- **Report Needs More Info**
- **Report New**
- **2020-02-07** @nickvergessen: Ah, I was thinking about the wrong feature (secure drop instead of secure view):
The following patch should fix the issue: https://github.com/nextcloud/server/pull/19349
- **Report Triaged**
- **2020-02-10** @at5djl3pwjmunyutnoatp: looks good, thank you
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Report Became Public**
