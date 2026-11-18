---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/user-interface-ui-misrepresentation-of-critical-information
  - env/web
  - os/macos
  - trigger/one-click
  - trigger/victim-interaction
  - trigger/social-engineering
substate: "resolved"
weakness: "User Interface (UI) Misrepresentation of Critical Information"
enriched: true
body: true
date: 2025-01-16
submitted: 2024-12-09T11:15:46.105Z
bounty_usd: null
votes: 87
cve: "CVE-2025-23086"
program: "[[programs/brave|Brave Software]]"
reporter: "syarif07"
source: "https://hackerone.com/reports/2888770"
title: " Incorrect security UI of files' download source on brave MacOS"
---
#  Incorrect security UI of files' download source on brave MacOS

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 87 | **Program:** Brave Software | **Disclosed:** 2025-01-16

- Report: [https://hackerone.com/reports/2888770](https://hackerone.com/reports/2888770)
- CWE: User Interface (UI) Misrepresentation of Critical Information | CVE: CVE-2025-23086
- Submitted: 2024-12-09T11:15:46.105Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
This vulnerability involves the incorrect display of the download source in the Brave download alert. Instead of displaying the actual source of the downloaded file, the browser displays the referrer header value, which may mislead the user into believing that the file is from a trusted source. This behavior creates a potential security risk as it could allow attackers to trick users into downloading malicious files.

## Products affected: 
Brave is up to date
Version 1.73.97 Chromium: 131.0.6778.108 (Official Build) (arm64)

## Steps To Reproduce:
1. Victim visit: https://ybt01.github.io/upload/google.html#
2. Victim click `click me to download google apk` and will pop up download location with wrong files origin

{F3826618}

## POC 
{F3826622}

## Expected result

The origin source on the download pop up should accurately reflect the actual source of the downloaded file, indicating the URL from which the file was downloaded directly (e.g., https://ybt01.github.io).

## Actual Result

The origin source on the pop up displays the URL of the referring page (e.g., https://google.com), thus misleading the user about the actual source of the downloaded file.

## Supporting Material/References:
This issue is similar to the one in the report: https://issues.chromium.org/issues/352681108 
but this is a different case because in chrome it is not affected. and in brave it is affected in the download pop up while in the chromium report it is affected in chrome: //downloads. However, in terms of impact and scenario this case is similar.

## Impact

This vulnerability can significantly impact user security by providing misleading information about file downloads. Users may unknowingly trust files downloaded from malicious sources, believing they originated from reputable domains. This can facilitate the distribution of malware and other harmful software, especially in targeted attacks by Advanced Persistent Threat (APT) groups or malicious websites that employ social engineering tactics. As a result, the risk of unintentional malware installation on user systems increases, undermining the overall security posture of users.

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Bounty Awarded**
- **2024-12-17** @syarif07: Hi, thanks for bounty. Btw can i get CVE for this issue? @diracdeltas
- **2024-12-17** @diracdeltas: Yes, please remind me of the CVE in approximately 3 weeks once this is in release.
- **2025-01-14** @syarif07: Hi team any update about CVE?
- **Agreed On Going Public**
- **Report Vulnerability Types Updated**
- **Agreed On Going Public**
- **Report Became Public**
- **2025-01-23** @syarif07: Hi @diracdeltas any update about CVE?
- **2025-01-23** @diracdeltas: isn't it already published as CVE-2025-23086?
- **2025-01-23** @syarif07: Oh well thanks @diracdeltas , I didn't realize that.
- **2025-01-31** @diracdeltas: Since a lot of people seem to be trying to copy this report, please let us remind anyone reading this:

1. We will not award for issues in download-related UI that Brave has inherited from Chromium which Chromium is fixing or closed as working as intended, for example: https://issues.chromium.org/issues/390695734
2. We will not award for features in which showing the referer/initiator origin instead of the download origin is the intended behavior, which will be determined at our discretion.
- **2025-08-29** @syarif07: Hi @diracdeltas am i eligible to request swag?
{F4727369}
- **2025-09-01** @kdenhar: Yes, you'd be eligible for this. Please send me an email at kdenhartog@brave.com and I can assist you with this.
