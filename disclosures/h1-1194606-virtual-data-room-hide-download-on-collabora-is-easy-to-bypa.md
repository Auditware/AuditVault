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
date: 2021-08-07
submitted: 2021-05-12T18:27:06.135Z
bounty_usd: 150
votes: 14
cve: "CVE-2021-32748"
program: "[[programs/nextcloud|Nextcloud]]"
reporter: "rtod"
source: "https://hackerone.com/reports/1194606"
title: "Virtual Data Room / Hide download on collabora is easy to bypass"
---
# Virtual Data Room / Hide download on collabora is easy to bypass

> **Severity:** High | **Bounty:** 150 USD | **Votes:** 14 | **Program:** Nextcloud | **Disclosed:** 2021-08-07

- Report: [https://hackerone.com/reports/1194606](https://hackerone.com/reports/1194606)
- CWE: Improper Access Control - Generic | CVE: CVE-2021-32748
- Submitted: 2021-05-12T18:27:06.135Z

## Timeline

- **Report Filed**
- **2021-05-12** @Nextcloud: Thanks a lot for reporting this potential issue back to us!

Our security team will take a look at this issue as soon as possible. We will reply to your report within 72 hours, usually much faster. For obvious reasons we'd like to ask you to not disclose this issue to any other party.
- **2021-05-17** @rullzer: Thanks a lot for your report.
We filled an internal ticket and will get back to you after our findings.
- **Report Triaged**
- **2021-06-23** @rtod: Did you manage to verify my suggestion with Collabora?
- **2021-06-28** @lukasreschkenc: We unfortunately don't have much updates to share here. I'll ask the product team for the next steps here.
- **2021-06-29** @lukasreschkenc: The product team is in talks with Collabora about adding some potential secret here. In the meantime, they are considering adding an IP check. (https://github.com/nextcloud/richdocuments/pull/1640)
- **2021-06-29** @lukasreschkenc: FYI:

> For further enhancement Collabora suggested that we could make use of the proof key that would already be available instead of a static shared secret, so we could indeed use that to verify that only the configured Collabora instance can perform WOPI requests. https://wopi.readthedocs.io/en/latest/scenarios/proofkeys.html
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Cve Id Added**
- **Report Became Public**
