---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-generic
  - env/mobile
  - os/android
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Generic"
enriched: true
date: 2020-09-24
submitted: 2020-06-23T22:02:23.714Z
bounty_usd: 560
votes: 32
cve: "CVE-2020-6506"
program: "[[programs/x|X / xAI]]"
reporter: "alesandroortiz"
source: "https://hackerone.com/reports/906433"
title: "Android WebViews in Twitter app are vulnerable to UXSS due to configuration and CVE-2020-6506"
---
# Android WebViews in Twitter app are vulnerable to UXSS due to configuration and CVE-2020-6506

> **Severity:** High | **Bounty:** 560 USD | **Votes:** 32 | **Program:** X / xAI | **Disclosed:** 2020-09-24

- Report: [https://hackerone.com/reports/906433](https://hackerone.com/reports/906433)
- CWE: Cross-site Scripting (XSS) - Generic | CVE: CVE-2020-6506
- Submitted: 2020-06-23T22:02:23.714Z

## Report summary

More details on CVE-2020-6506 available at: https://alesandroortiz.com/articles/uxss-android-webview-cve-2020-6506/

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **2020-06-24** @alesandroortiz: For reference, the activity for Video Website Cards is `/com/twitter/android/revenue/BrowserWithDockedVideoActivity.class`
- **Report Needs More Info**
- **Report New**
- **2020-06-25** @alesandroortiz: FYI, report #906433 is a URL spoofing vulnerability which could be chained with this UXSS vulnerability to perform URL spoofing attacks on a wider-range of targets.
- **2020-06-25** @bugtriage-sophia: Thank you for your report @alesandroortiz,

We are investigating the behavior you described and will get back to you when we have more information.

Thank you for thinking of Twitter security
- **Report Triaged**
- **Report Needs More Info**
- **Report New**
- **2020-07-02** @bugtriage-sophia: Thank you once again for your response @alesandroortiz,

We have resumed our investigation of the behavior you described and will get back to you when we have more information.

Thank you for thinking of Twitter security.
- **2020-07-06** @bugtriage-sophia: Thank you for your patience @alesandroortiz,

We are still investigating the behavior you described. However, we have finished our initial assessment, so you can now delete your POC Tweets to prevent this attack from being leaked to the public. 

If you could delete these public POCs as soon as possible, it would be much obliged. 

Thank you for thinking of Twitter security.
- **2020-07-06** @alesandroortiz: Hi @bugtriage-sophia,

Thanks for update, I've deleted the PoC Tweets for this report. Let me know if you need more info or have any questions.

Regards,
Alesandro
- **Report Triaged**
- **Bounty Awarded**
- **2020-07-27** @alesandroortiz: Thanks for bounty! Let me know if you need more info, have any questions, or have a build ready for mitigation verification.
- **Report Resolved**
- **2020-08-06** @alesandroortiz: Hi @yongjink,

Verified as mitigated in version 8.56.0-release.00 (released August 3rd) via behavioral testing and code analysis. I see option 1a was used to mitigate and new window creation is blocked. The mitigation is enabled if the `android_webview_ANDROID_64173_workaround_enabled` experiment flag is enabled (disabled by default in code, but presumably rolled out to everyone now.)

Thanks for mitigating on your end!

Regards,
Alesandro
- **2020-08-10** @alesandroortiz: As an FYI, https://crbug.com/1083819 is scheduled to be disclosed on or around September 9, 2020 by the Chromium Security Team. The crbug report does not directly identify any affected vendors. However, affected vendors should strive to mitigate the vulnerability for unpatched WebView users before the disclosure date, to help prevent in-the-wild exploitation.

Thanks again for mitigating in the Twitter app! No further action necessary other than pushing the update out to as many users as possible.
- **Agreed On Going Public**
- **2020-09-10** @alesandroortiz: CVE-2020-6506 is now disclosed: https://alesandroortiz.com/articles/uxss-android-webview-cve-2020-6506/

You may disclose this report.
- **Agreed On Going Public**
- **Report Became Public**
- **2020-09-24** @alesandroortiz: @agoldman: Thanks for disclosing.
