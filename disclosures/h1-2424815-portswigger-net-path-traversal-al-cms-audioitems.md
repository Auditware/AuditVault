---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
substate: "resolved"
weakness: "Path Traversal"
enriched: true
date: 2024-04-04
submitted: 2024-03-20T07:26:29.063Z
bounty_usd: null
votes: 146
cve: []
program: "[[programs/portswigger|PortSwigger Web Security]]"
reporter: "0xd0m7"
source: "https://hackerone.com/reports/2424815"
title: "[portswigger.net] Path Traversal al /cms/audioitems"
---
# [portswigger.net] Path Traversal al /cms/audioitems

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 146 | **Program:** PortSwigger Web Security | **Disclosed:** 2024-04-04

- Report: [https://hackerone.com/reports/2424815](https://hackerone.com/reports/2424815)
- CWE: Path Traversal
- Submitted: 2024-03-20T07:26:29.063Z

## Timeline

- **Report Filed**
- **2024-03-20** @albinowax: Thanks for the report, that doesn't look good! We'll investigate right away.
- **Report Triaged**
- **2024-03-20** @albinowax: We've released an initial hotfix to production now - please let us know if you are able to bypass it. This vulnerability occurred due to a typo in our path validation - we are now working on a hardening measure to make sure this can't happen elsewhere.
- **2024-03-20** @0xd0m7: Hi @albinowax 
The initial fix seems to be valid and I have not been able to bypass it with the usual techniques. However, when you have a definitive fix, I would like to be able to review it calmly.
Best
@0xd0m7
- **Report Severity Updated**
- **2024-03-20** @0xd0m7: Yes, I agree.
Sometimes I raise the severity for the immediate fix. Always works.
Thanks
@0xd0m7
- **2024-03-20** @0xd0m7: @albinowax 
I would like (if the team approve it) full disclosure of this report once team will have a final fix.
Best.
- **Bounty Awarded**
- **2024-03-20** @albinowax: Yes we're happy to disclose this once the final fix lands.
- **2024-03-20** @0xd0m7: Hi @PortSwigger\ Web\ Security
Thanks a lot for the bounty ! Happy to help!
Btw @albinowax , thanks for the disclosure!
Contributing to the community is necessary..At least to confirm that any bug, no matter how simple, can be exits in any company, no matter what services they offer.

Best
@0xd0m7
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
