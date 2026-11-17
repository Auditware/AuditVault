---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-certificate-validation
  - env/web
substate: "not-applicable"
weakness: "Improper Certificate Validation"
enriched: true
date: 2026-06-05
submitted: 2026-06-05T11:44:52.389Z
bounty_usd: null
votes: 23
cve: "CVE-2020-8286"
program: "[[programs/curl|curl]]"
reporter: "argus-systems"
source: "https://hackerone.com/reports/3784125"
title: "GnuTLS OCSP stapling accepts unrelated SingleResponse (no cert-ID binding)"
---
# GnuTLS OCSP stapling accepts unrelated SingleResponse (no cert-ID binding)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 23 | **Program:** curl | **Disclosed:** 2026-06-05

- Report: [https://hackerone.com/reports/3784125](https://hackerone.com/reports/3784125)
- CWE: Improper Certificate Validation | CVE: CVE-2020-8286
- Submitted: 2026-06-05T11:44:52.389Z

## Timeline

- **Report Filed**
- **2026-06-05** @icing: Nice LLM output. Let's set the clankers aside and look at

https://www.gnutls.org/manual/html_node/Core-TLS-API.html#gnutls_005fcertificate_005fverify_005fpeers2

which libcurl uses to verify the certificate. According to GnuTLS:

"This function will take into account the stapled OCSP responses sent by the server"

and reading its code, it indeed does so to my reading unless `GNUTLS_VERIFY_DISABLE_CRL_CHECKS` is given.

Now, please explain to me how an invalid OCSP response would give a positive verify result from GnuTLS and how the subsequent libcurl checks would mess this up.
- **2026-06-05** @argus-systems: You're correct. I went and actually ran a PoC to verify, and it fails on both GnuTLS 3.7.3 and 3.8.3. GnuTLS verifies the stapled OCSP response including certID binding. This is not an exploitable vulnerability.

This is a defense-in-depth code quality issue in curl, not an exploitable vulnerability with current GnuTLS versions.
- **Report Not Applicable**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
