---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
date: 2021-06-30
submitted: 2021-03-22T10:39:40.941Z
bounty_usd: null
votes: 5
cve: []
program: "[[programs/rocket_chat|Rocket.Chat]]"
reporter: "sonarsource"
source: "https://hackerone.com/reports/1132202"
title: "Post-Auth Stored XSS with User Interaction leads to Remote Code Execution"
---
# Post-Auth Stored XSS with User Interaction leads to Remote Code Execution

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 5 | **Program:** Rocket.Chat | **Disclosed:** 2021-06-30

- Report: [https://hackerone.com/reports/1132202](https://hackerone.com/reports/1132202)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2021-03-22T10:39:40.941Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Resolved**
- **2021-05-31** @sonarsource: Hi @markus-rocketchat 

The patch looks good for this specific issue. It prevents attackers from specifying arbitrary room names and encodes room names in API error messages, so there is no data flow from unsanitized user input to the `toastr` library anymore.

However, it does not mitigate the issue on the client side. It is still necessary to encode all API responses properly, which could create a new vulnerability if it is overlooked at some point in the future. To implement a long-term mitigation, we recommend setting `toastr.options.escapeHtml = true` as mentioned in our initial report. It seems that `client/startup/startup.ts` would be the right place for that.
- **Agreed On Going Public**
- **2021-06-03** @markus-rocketchat: thanks. we will follow your suggestion on this. we appreciate the recommendation.
- **Report Became Public**
- **2023-10-25** @sonarsource: Hi @markus-rocketchat,

There was never a CVE requested for this vulnerability. Could you go ahead and request one via HackerOne?

Thanks!
