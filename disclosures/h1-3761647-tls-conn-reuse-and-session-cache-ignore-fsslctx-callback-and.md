---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/insufficiently-protected-credentials
  - env/web
substate: "informative"
weakness: "Insufficiently Protected Credentials"
enriched: true
date: 2026-06-01
submitted: 2026-05-26T02:47:20.811Z
bounty_usd: null
votes: 16
cve: []
program: "[[programs/curl|curl]]"
reporter: "fg0x0"
source: "https://hackerone.com/reports/3761647"
title: "TLS conn reuse and session cache ignore fsslctx callback and ssl_config_data flags ( incomplete fix variant of 7541ae569 )"
---
# TLS conn reuse and session cache ignore fsslctx callback and ssl_config_data flags ( incomplete fix variant of 7541ae569 )

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 16 | **Program:** curl | **Disclosed:** 2026-06-01

- Report: [https://hackerone.com/reports/3761647](https://hackerone.com/reports/3761647)
- CWE: Insufficiently Protected Credentials
- Submitted: 2026-05-26T02:47:20.811Z

## Timeline

- **Report Filed**
- **2026-05-26** @bagder: To me this sounds like you did not read the documentation for CURLOPT_SSL_CTX_FUNCTION but you allowed your AI to tell you this without verification.

Maybe the booleans should be used as you suggest, but the setup is very artificial and far from a HIGH problem.
- **2026-05-26** @icing: Documented behaviour, non issue.
- **2026-05-26** @fg0x0: Hey @bagder @icing 

Thank you for the review. Fair points on CURLOPT_SSL_CTX_FUNCTION - the severity was overstated and I apologize for the noise.
Regarding the boolean fields ( no_revoke, revoke_best_effort, no_partialchain, native_ca_store, auto_client_cert ) - Daniel mentioned these may have merit. Since PR #21667 established the pattern of including security-relevant config in the connection match, would it be reasonable to track these booleans as a low-severity issue here rather than just a code improvement? 

Happy to provide a patch.
- **2026-05-26** @jimfuller2024: this seems self inflicted by the app (eg. api foot gun)
- **Report Informative**
- **Agreed On Going Public**
- **Manually Disclosed**
