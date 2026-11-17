---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/code-injection
  - env/web
  - stack/node
substate: "resolved"
weakness: "Code Injection"
enriched: true
date: 2020-05-09
submitted: 2020-03-21T00:53:36.972Z
bounty_usd: null
votes: 15
cve: "CVE-2020-8149"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "mik317"
source: "https://hackerone.com/reports/825729"
title: "[logkitty] RCE via insecure command formatting"
---
# [logkitty] RCE via insecure command formatting

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 15 | **Program:** Node.js third-party modules | **Disclosed:** 2020-05-09

- Report: [https://hackerone.com/reports/825729](https://hackerone.com/reports/825729)
- CWE: Code Injection | CVE: CVE-2020-8149
- Submitted: 2020-03-21T00:53:36.972Z

## Timeline

- **Report Filed**
- **2020-03-22** @nochnoidozor: Hi @mik317,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@nochnoidozor
- **Report Triaged**
- **External User Joined**
- **2020-04-07** @zamotany: With the following PR: https://github.com/zamotany/logkitty/pull/18, reproduction steps are no longer producing `HACKED` file. The PR was released to NPM as `0.7.1`.
- **2020-04-07** @marcinhoppe: @zamotany many thanks for getting back to us so quickly!

@mik317 @nochnoidozor can you verify that version `0.7.1` properly fixes the vulnerability?
- **2020-04-07** @nochnoidozor: Hi @mik317 - Can you help us verify if the issue has been properly fixed in version `0.7.1`?

Thanks for your help!
@nochnoidozor
- **2020-04-07** @mik317: Hi @zamotany :),
thank you for the fast response and fix :).
I can confirm the fix patches the `command injection` issue is fixed properly :)

Thank again for the hard work :)
Best regards,
Mik
- **2020-04-08** @marcinhoppe: @mik317 thanks for quick verification!

@zamotany is it OK for you that we disclose this vulnerability now?
- **2020-04-08** @zamotany: Sure
- **Report Resolved**
- **Report Severity Updated**
- **Agreed On Going Public**
- **2020-04-09** @marcinhoppe: @mik317 i adjusted the CVSS score for this vulnerability. I classified this as a local attack, because it seems unlikely that this package would be used remotely. Let me know if this score makes sense to you.
- **2020-04-09** @mik317: Hi @marcinhoppe :)
Yeah, I agree the attack could be local, anyway it depends mostly on the implementation (someone could have used the package as part of a server which could allow someone analyzing an APK remotely, and that would have lead to `remote` attack vector).

Anyway, if it's fair for you, it's ok also for me ;)

Thank you again,
Mik
- **2020-04-14** @marcinhoppe: I requested a CVE for this finding: CVE-2020-8149.
- **2020-04-14** @mik317: Hi @marcinhoppe :),
thank you so much for this :). It's simply amazing :).
Hope to work with you again in the near future, and most important that's going all well by your side of the screen ;). Stay safe :).

Thank again and regards, Mik

Hi @nochnoidozor :),
can we pls update the CVE reference of this report with the CVE provided by @marcinhoppe ?

Best, Mik
- **Report Became Public**
- **Changed Scope**
