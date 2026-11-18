---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-certificate-validation
  - env/web
  - vuln/csrf
substate: "resolved"
weakness: "Improper Certificate Validation"
enriched: true
body: true
date: 2025-10-15
submitted: 2025-07-15T13:33:26.798Z
bounty_usd: null
votes: 73
cve: "CVE-2018-12402", "CVE-2022-29912", "CVE-2022-45410", "CVE-2022-45413", "CVE-2023-30674", "CVE-2025-48980"
program: "[[programs/brave|Brave Software]]"
reporter: "mingijung"
source: "https://hackerone.com/reports/3253725"
title: "SameSite restrictions are lifted, and SameSite:Strict cookie are being sent."
---
# SameSite restrictions are lifted, and SameSite:Strict cookie are being sent.

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 73 | **Program:** Brave Software | **Disclosed:** 2025-10-15

- Report: [https://hackerone.com/reports/3253725](https://hackerone.com/reports/3253725)
- CWE: Improper Certificate Validation | CVE: CVE-2018-12402, CVE-2022-29912, CVE-2022-45410, CVE-2022-45413, CVE-2023-30674, CVE-2025-48980
- Submitted: 2025-07-15T13:33:26.798Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:

hello, Brave team.
There are cases where the SameSite policy is being bypassed, and I would like to report them.
When a user left-clicks a link in a cross-domain context and selects "Open Link in Split View," all cookies—including those with SameSite=Strict—are sent, even though it is a cross-site navigation.

* For SameSite cookies, only SameSite=Lax cookies should be sent during cross-site navigations.

Before providing a detailed explanation, here is a list of CVEs and issues that were reported as a result of SameSite violations.: 
https://issues.chromium.org/issues/40057062
https://issues.chromium.org/issues/40050641
https://issues.chromium.org/issues/40057831
https://issues.chromium.org/issues/40053069
https://issues.chromium.org/issues/40091708
https://issues.chromium.org/issues/40091123
https://issues.chromium.org/issues/40091076
https://issues.chromium.org/issues/40091073
https://issues.chromium.org/issues/40091053
https://issues.chromium.org/issues/40091031
https://issues.chromium.org/issues/40090228
https://issues.chromium.org/issues/40087297
https://issues.chromium.org/issues/41385446
https://bugzilla.mozilla.org/show_bug.cgi?id=1873223&_gl=1*p8erhc*_ga*MTU3OTk5MjUwOC4xNzQxNTg0MzY3*_ga_MQ7767QQQW*czE3NDgzMjQ2NTYkbzMkZzEkdDE3NDgzMjQ3NTUkajAkbDAkaDA.
https://bugzilla.mozilla.org/show_bug.cgi?id=1844827&_gl=1*1pdtywb*_ga*MTU3OTk5MjUwOC4xNzQxNTg0MzY3*_ga_MQ7767QQQW*czE3NDgzMjQ2NTYkbzMkZzEkdDE3NDgzMjQ4MjQkajAkbDAkaDA.
https://bugzilla.mozilla.org/show_bug.cgi?id=1456652&_gl=1*1739v6q*_ga*MTU3OTk5MjUwOC4xNzQxNTg0MzY3*_ga_MQ7767QQQW*czE3NDgzMjQ2NTYkbzMkZzEkdDE3NDgzMjU3NjIkajAkbDAkaDA.
https://nvd.nist.gov/vuln/detail/CVE-2018-12402
https://nvd.nist.gov/vuln/detail/cve-2022-29912
https://nvd.nist.gov/vuln/detail/cve-2022-45410
https://nvd.nist.gov/vuln/detail/cve-2022-45413
CVE-2023-30674

There was a case similar to the vulnerability that we are reporting, where a SameSite=Strict cookie was bypassed due to user interaction.:
https://issues.chromium.org/issues/40091708


The reason SameSite=Strict cookies are being sent in this case is because the Sec-Fetch-Site: cross-site header, which should normally be present, is missing. To prevent SameSite bypass and protect against CSRF attacks, this header should be properly included in the request.

thank you for reading.



## Products affected: 

Brave	1.80.120 in window operation

## Steps To Reproduce:

```
<a href='https://SameSite.check.com' target='_blank'>1234</a>" frameborder="0">
```
Try opening the hyperlink above using the "Open Link in Split View" option — even SameSite=Strict cookies are sent.

Try opening the link using other options as well—such as "Open in New Tab" or "Open in Incognito Window"—and compare the cookies that are sent in each case.

A video demonstrating the proof of concept (POC) has been included.


## Supporting Material/References:
*https://issues.chromium.org/issues/40091708*
https://issues.chromium.org/issues/40057062
https://issues.chromium.org/issues/40050641
https://issues.chromium.org/issues/40057831
https://issues.chromium.org/issues/40053069
https://issues.chromium.org/issues/40091708
https://issues.chromium.org/issues/40091123
https://issues.chromium.org/issues/40091076
https://issues.chromium.org/issues/40091073
https://issues.chromium.org/issues/40091053
https://issues.chromium.org/issues/40091031
https://issues.chromium.org/issues/40090228
https://issues.chromium.org/issues/40087297
https://issues.chromium.org/issues/41385446
https://bugzilla.mozilla.org/show_bug.cgi?id=1873223&_gl=1*p8erhc*_ga*MTU3OTk5MjUwOC4xNzQxNTg0MzY3*_ga_MQ7767QQQW*czE3NDgzMjQ2NTYkbzMkZzEkdDE3NDgzMjQ3NTUkajAkbDAkaDA.
https://bugzilla.mozilla.org/show_bug.cgi?id=1844827&_gl=1*1pdtywb*_ga*MTU3OTk5MjUwOC4xNzQxNTg0MzY3*_ga_MQ7767QQQW*czE3NDgzMjQ2NTYkbzMkZzEkdDE3NDgzMjQ4MjQkajAkbDAkaDA.
https://bugzilla.mozilla.org/show_bug.cgi?id=1456652&_gl=1*1739v6q*_ga*MTU3OTk5MjUwOC4xNzQxNTg0MzY3*_ga_MQ7767QQQW*czE3NDgzMjQ2NTYkbzMkZzEkdDE3NDgzMjU3NjIkajAkbDAkaDA.
https://nvd.nist.gov/vuln/detail/CVE-2018-12402
https://nvd.nist.gov/vuln/detail/cve-2022-29912
https://nvd.nist.gov/vuln/detail/cve-2022-45410
https://nvd.nist.gov/vuln/detail/cve-2022-45413
CVE-2023-30674

## Impact

{F4569378}

## Timeline

- **Report Filed**
- **Report Triaged**
- **2025-07-28** @diracdeltas: @mingijung This issue occurs in Chromium's split view implementation as well which we are migrating to. Could you report it to their bug bounty and let us know what they say? you can test it by enabling #side-by-side in chrome://flags in Chrome beta.
- **2025-07-30** @mingijung: Thanks for letting me know! I’ll report this to Google’s bug bounty program and share any updates I receive.
- **Report Resolved**
- **Bounty Awarded**
- **2025-08-09** @mingijung: Hello, sorry for the late reply. I have reported the issue to Google. I found an additional issue besides SameSite, so I ended up reporting it to Google later, and I have confirmed that the issue is currently being patched in Chrome. Once the patch is completed, you will probably be able to view the issue here: https://issues.chromium.org/issues/436444612.
  
Also, would it be possible to receive a CVE for this issue?

Thank you.
- **2025-08-09** @diracdeltas: Thanks, I am on parental leave but please ping me again in 2 weeks about the CVE. We do not issue those anyway until the fix is out in release usually.
- **2025-08-20** @artem_chaikin: @mingijung did Google give an estimate when the fix will be merged? We unfortunately don't have access to the issue you linked
- **2025-08-20** @mingijung: Since this wasn't an official feature before Chrome version M141, earlier browser versions will likely remain unpatched.
This appears to be fixed in version M141, and the issue tracker shows its status as FIXED

https://chromium-review.googlesource.com/c/chromium/src/+/6838198
- **2025-08-20** @artem_chaikin: Thanks!
- **2025-08-26** @mingijung: Hello, Brave team

May I request a CVE assignment for this issue?
- **2025-08-26** @diracdeltas: I submitted the CVE request, and it will be published once this report is disclosed. However we need to wait until the fix lands in Stable before disclosing.
- **2025-08-27** @mingijung: I understand. Thank you very much.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2025-10-22** @mingijung: Hello,

As the report has now been disclosed, I wanted to kindly ask if the CVE has been officially assigned and published.

Thank you for your help.
