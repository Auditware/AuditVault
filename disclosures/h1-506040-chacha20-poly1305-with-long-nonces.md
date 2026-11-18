---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/missing-encryption-of-sensitive-data
  - env/web
substate: "resolved"
weakness: "Missing Encryption of Sensitive Data"
enriched: true
body: true
date: 2019-09-30
submitted: 2019-03-07T09:21:12.416Z
bounty_usd: null
votes: 8
cve: "CVE-2019-1543"
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "jorandirkgreef"
source: "https://hackerone.com/reports/506040"
title: "ChaCha20-Poly1305 with long nonces"
---
# ChaCha20-Poly1305 with long nonces

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 8 | **Program:** Internet Bug Bounty | **Disclosed:** 2019-09-30

- Report: [https://hackerone.com/reports/506040](https://hackerone.com/reports/506040)
- CWE: Missing Encryption of Sensitive Data | CVE: CVE-2019-1543
- Submitted: 2019-03-07T09:21:12.416Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

This report relates to CVE-2019-1543, https://www.openssl.org/news/secadv/20190306.txt, which I reported to the OpenSSL maintainers a few days ago.

OpenSSL accepts nonces for the AEAD cipher ChaCha20-Poly1305 of up to 16-bytes. This support is advertised in the OpenSSL documentation and via the CHACHA_CTR_SIZE (16) constant.

However, the specification for ChaCha20-Poly1305 supports only up to 12-bytes.

If a user passes a 16-byte nonce to OpenSSL, OpenSSL will discard the first 4-bytes of the nonce.

## Impact

The maintainers classified the severity of this as LOW since it only affects user applications of OpenSSL, while at the same time recognizing the severity of this for these user applications as MEDIUM (or "serious" and "catastrophic" in the words of two maintainers).

This breaks the guarantees provided by OpenSSL to user applications in two ways:

1. These first 4-bytes are not authenticated, breaking the integrity guarantees of the AEAD cipher, and allowing an attacker to tamper with 4-bytes of the AEAD message. This in itself is serious for applications which rely on AEAD ciphers to detect message tampering and/or message corruption.

2. This introduces the likelihood of nonce-reuse, since the most significant 4-bytes of nonce entropy are discarded by OpenSSL, for example, where a user provides a 32-bit nonce counter in a statically allocated 16-byte buffer to OpenSSL. Nonce-reuse is catastrophic for an AEAD cipher such as ChaCha20-Poly1305, as it would allow an attacker to completely decrypt all sensitive information.

## Timeline

- **Report Filed**
- **2019-03-08** @h1_analyst_leon: Hey @jorandirkgreef - Thanks for the submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.
- **2019-03-12** @jorandirkgreef: Thanks @tuxedo , I see NIST just finished their analysis of the CVE: https://nvd.nist.gov/vuln/detail/CVE-2019-1543

NIST rated the severity of the CVE as 5.8 MEDIUM according to CVSS v2 and as 7.4 HIGH according to CVSS v3.

They further filed it under CWE-310 (http://cwe.mitre.org/data/definitions/310.html), which includes CWE-311, but perhaps CWE-310 is a better classification.
- **2019-04-11** @jorandirkgreef: Ping @tuxedo
- **2019-05-08** @jorandirkgreef: @tuxedo, are you still reviewing the report? Should we escalate this to the IBB panel?
- **Cve Id Added**
- **Report Severity Updated**
- **Report Triaged**
- **2019-07-15** @jorandirkgreef: @tuxedo, it has been nearly two months since activity on this report. Is this normal for IBB? I did not expect security responses to take this long.
- **2019-07-25** @h1_analyst_oceana: Hello @jorandirkgreef,

Thanks for your patience! I have pinged the team on this issue, and I will update you once there is more information to share.

Warm Regards,

@magicmouse
- **2019-07-25** @jorandirkgreef: Thanks @magicmouse
- **2019-08-27** @jorandirkgreef: @magicmouse, this should be ready to award, having followed IBB's guidelines for OpenSSL?
- **2019-08-27** @jorandirkgreef: It's almost 6 months since the CVE was disclosed and the report filed, but the bounty has yet to be paid.
- **2019-09-12** @jorandirkgreef: @tuxedo and @magicmouse thanks for all your help with this. Would you mind escalating this report please?
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **2019-09-30** @jorandirkgreef: Thanks @reed!
- **Agreed On Going Public**
- **Report Became Public**
