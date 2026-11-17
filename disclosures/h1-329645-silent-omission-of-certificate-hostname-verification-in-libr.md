---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-certificate-validation
  - env/web
substate: "resolved"
weakness: "Improper Certificate Validation"
enriched: true
date: 2019-09-26
submitted: 2018-03-25T12:36:24.157Z
bounty_usd: null
votes: 4
cve: "CVE-2018-8970"
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "tiran"
source: "https://hackerone.com/reports/329645"
title: "Silent omission of certificate hostname verification in LibreSSL and BoringSSL"
---
# Silent omission of certificate hostname verification in LibreSSL and BoringSSL

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 4 | **Program:** Internet Bug Bounty | **Disclosed:** 2019-09-26

- Report: [https://hackerone.com/reports/329645](https://hackerone.com/reports/329645)
- CWE: Improper Certificate Validation | CVE: CVE-2018-8970
- Submitted: 2018-03-25T12:36:24.157Z

## Timeline

- **Report Filed**
- **2018-03-25** @tiran: I forgot to mention, the bug would have impacted all users and applications running under Python 3.7 on Alpine Linux, OpenBSD, DragonFly BSD and any other distribution and vendor that uses LibreSSL.
- **Report Triaged**
- **2018-04-17** @tiran: Hi @thefrog ,

Thanks for getting back to me! It's fine, we are all volunteers and all busy people. I asked Paul to get in contact with somebody, because I wasn't sure if my inquiry got lost in the mail. :)

I have some updates that you might be interested in:

* The Chromium bug report https://bugs.chromium.org/p/chromium/issues/detail?id=824799 has been made public. * Adam Langley has updated OpenSSL's wiki and replaced the example with a better one. The new version no longer uses namelen 0 and has proper error checking. https://wiki.openssl.org/index.php?title=Hostname_validation&type=revision&diff=2645&oldid=2552
* I have hardened CPython's implementation and replaced namelen 0 with strlen() of the second parameter.
* My mail https://mail.python.org/pipermail/python-dev/2018-April/152624.html to the public Python developer mailing list explains the issue in a slightly different angle.

Regards,
Christian
- **2018-09-22** @tiran: Hi @thefrog, I haven't heard back from you in a while. Is my vulerability report still under consideration?
- **2019-05-25** @tiran: Hi, the bug has been in triage state for a year. Is anybody still looking into it?
- **Not Eligible For Bounty**
- **Cve Id Added**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
