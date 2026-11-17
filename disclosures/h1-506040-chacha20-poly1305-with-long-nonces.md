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
