---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
substate: "informative"
weakness: "Improper Access Control - Generic"
enriched: true
date: 2026-11-07
submitted: 2026-11-06T10:51:03.682Z
bounty_usd: null
votes: 25
cve: []
program: "[[programs/curl|curl]]"
reporter: "arizonya"
source: "https://hackerone.com/reports/4177724"
title: "curl 8.23.0 keeps sending requests to an HTTP/3 backend after Alt-Svc: clear"
---
# curl 8.23.0 keeps sending requests to an HTTP/3 backend after Alt-Svc: clear

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 25 | **Program:** curl | **Disclosed:** 2026-11-07

- Report: [https://hackerone.com/reports/4177724](https://hackerone.com/reports/4177724)
- CWE: Improper Access Control - Generic
- Submitted: 2026-11-06T10:51:03.682Z

## Timeline

- **Report Filed**
- **2026-11-06** @icing: I would say that `Alt-Svc:` does not define a security boundary. It might be undesirable and a bug that the alternate HTTP/3 endpoint is still used, but if it presents a valid certificate the trust in that endpoint seems ok to me.
- **2026-11-06** @arizonya: Thank you for the quick response. I see your point about the valid certificate. I investigated this because curl continued routing later requests to the HTTP/3 alternative after the origin sent `Alt-Svc: clear`; in my local reproduction, a token issued afterward followed that route too. I thought the reproducible behavior would be useful to bring to your attention, and I appreciate you reviewing it.
- **2026-11-06** @bagder: I agree with @icing that this is not a vulnerability but sounds like a bug, please submit it as an issue on Github instead. Or even better as a pull-request...
- **2026-11-06** @arizonya: Thanks for the suggestion. I’ll look into whether I can prepare a fix as a pull request. Could you also record the final disposition of this HackerOne report so its status is clear?
- **2026-11-06** @jimfuller2024: agree - at most this is a RFC 7838 conformance bug
- **2026-11-06** @arizonya: I’ve opened curl/curl PR #23789 with a proposed fix for the Alt-Svc cache behavior and a regression test. The regression test reproduces the issue on the original code and passes with the proposed fix. I appreciate you pointing me toward the GitHub contribution process.
- **Report Informative**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
