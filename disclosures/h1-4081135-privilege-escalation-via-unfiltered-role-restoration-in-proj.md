---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/privilege-escalation
  - env/web
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
date: 2026-11-15
submitted: 2026-10-03T02:24:51.124Z
bounty_usd: null
votes: 28
cve: []
program: "[[programs/weblate|Weblate]]"
reporter: "zukosdead"
source: "https://hackerone.com/reports/4081135"
title: "Privilege escalation via unfiltered role restoration in project backup import"
---
# Privilege escalation via unfiltered role restoration in project backup import

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 28 | **Program:** Weblate | **Disclosed:** 2026-11-15

- Report: [https://hackerone.com/reports/4081135](https://hackerone.com/reports/4081135)
- CWE: Privilege Escalation
- Submitted: 2026-10-03T02:24:51.124Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **2026-10-03** @nijel: We're going to publish an advisory on GitHub for this; please let me know how you want to be referenced there (GitHub handle preferred).
- **2026-10-03** @zukosdead: Thanks for addressing this and arranging the advisory! I do have a GitHub account, but I’d prefer to be credited through my HackerOne profile, as in the previous advisory: “This issue was reported by [zukosdead](https://hackerone.com/zukosdead) via HackerOne.”

I’ll take a look at the fix later when I’m free—I have work, so I don’t have time to review it at the moment.

I’d also be interested in publicly disclosing the HackerOne report once the fix is released. Please let me know what timing would work best for you.
- **2026-10-03** @zukosdead: Screenshot shows the fix correctly raising ValidationError: Referenced role cannot be assigned to a project team. at backups.py:1654 when a crafted backup attempts to restore a team with a global-permission role. The test FAILED because it was written to assert the escalation happens and wasn't updated to expect the ValidationError secure outcome — the fix is working as intended.{F6894705}
- **Report Resolved**
- **2026-10-13** @zukosdead: Hi nijel,

Thank you for fixing this issue and publishing the advisory—I appreciate your work on it.

Now that the fix has been released, would you be open to making this HackerOne report public? Also, is a CVE assignment planned for this vulnerability?

Best regards,
zukosdead
- **Agreed On Going Public**
- **Report Became Public**
