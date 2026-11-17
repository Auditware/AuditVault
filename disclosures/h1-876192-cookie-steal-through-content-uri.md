---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/weak-password-recovery-mechanism-for-forgotten-password
  - env/web
substate: "resolved"
weakness: "Weak Password Recovery Mechanism for Forgotten Password"
enriched: true
date: 2021-04-22
submitted: 2020-05-16T20:11:15.667Z
bounty_usd: null
votes: 79
cve: []
program: "[[programs/brave|Brave Software]]"
reporter: "kanytu"
source: "https://hackerone.com/reports/876192"
title: "Cookie steal through content Uri"
---
# Cookie steal through content Uri

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 79 | **Program:** Brave Software | **Disclosed:** 2021-04-22

- Report: [https://hackerone.com/reports/876192](https://hackerone.com/reports/876192)
- CWE: Weak Password Recovery Mechanism for Forgotten Password
- Submitted: 2020-05-16T20:11:15.667Z

## Report summary

Write-up available [here](https://infosecwriteups.com/brave-stealing-your-cookies-remotely-1e09d1184675).

## Timeline

- **Report Filed**
- **2020-05-16** @kanytu: The weakness is `Insecure Storage of Sensitive Information` and not `Weak Password Recovery Mechanism for Forgotten Password`.
- **2020-05-17** @kanytu: I've managed to escalate this issue to remote accessibility. 

A victim can get its cookies stolen remotely by opening a website and tapping anywhere in it.

This leverages the same exploit. Basically a malicious website can trigger a malicious html file download and trigger it's opening when the user clicks on that page. Opening it with `content://` URIs bypasses file-base crossed frame protection and the HTML opened will have access to the cookies file internally since it's the same schema.

That malicious page could then send the contents of this file to the attacker.

Attached is a Python webpage that runs in port 8080. 

### New steps:

1. Run the python server
2. Open that page in Brave Browser (`ngrok` can be used create a tunnel and easily open in the device)
3. Tap on the webpage

### Detailed explanation

The webpage returned contains an IFrame that downloads an HTML file with a random generate number. When the user clicks on the page, a new page is opened: `android-app://com.brave.browser/content/com.brave.browser.FileProvider/root/sdcard/Download/%s.html#Intent;type=text/html;end`

This webpage is an Android Intent Uri that will be opened in Brave as `content://com.brave.browser.FileProvider/root/sdcard/Download/%s.html`, being `%s`, the newly downloaded file.

When the file is opened, it will download the contents of `Cookies` file using `XMLHttpRequest` and displays a Javascript alert box containing the contents of this file.

---

The fix should be the same, either remove  `<root-path>` or have it point to `/storage/` instead of `.`.
- **Report Triaged**
- **2020-05-19** @kanytu: Hi again,

I just want to add some notes.

This works for all external files in the system as well as Brave's internal files. In this report, I've used Cookies since, in my opinion, it has the highest impact. A malicious HTML file can send any file in the external directory to a remote server if the path is known, which in some messaging applications it's predictable.

This can be exploited remotely as shown above, locally by a malicious application or it can be exploited with a malicious HTML file that the user has downloaded  and opened with Brave.

### Similar reports:
https://hackerone.com/reports/390013
https://hackerone.com/reports/375329

### CVEs for reference
https://nvd.nist.gov/vuln/detail/CVE-2019-11730
- **Report Severity Updated**
- **2020-06-02** @kanytu: Hi Brave Team.

Any news you can share?

Thanks
@kanytu
- **2020-06-02** @pranjal_jumde: @kanytu - We are working on the fix, we expect it to be merged this week.
- **2020-06-15** @pranjal_jumde: @kanytu - The fix should be available in the nightly channel shortly.
- **2020-06-15** @kanytu: Hi Brave Team,

Can you confirm the issue was addressed and a fix deployed in version 1.12.25?

Thanks,
@kanytu
- **2020-06-15** @pranjal_jumde: The patch missed version 1.12.25, hoping that it lands in the next one. I'll share an update here once I see the fix in nightly.
- **2020-06-17** @kanytu: Hey Brave Team,

I can confirm that this was fixed in Nightly channel (v. 1.12.32) by removing the `root-path` entry from the affected XML file.

Great job,
@kanytu
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **Report Reopened**
- **2020-09-16** @kanytu: Hi Brave team,

Do you have news regarding this issue? Will it be fixed soon? 

I have some reports for other browsers I would like to disclose in a few months. I can omit this report but some of the reports I have are kinda similar to this one. I don't want to turn this issue into a zer0day in the process so I can wait a little more for your fix but keep in mind this is a nasty bug. I understand PDFs are more important because it's a more noticeable issue than this one, but please consider fixing this as soon as possible. 

I'm unaware of your PDF logic but I don't see how a PDF should be opened from inside the root directory (unless you are saving them in your internal directory).

Let me know if you need help regarding possible solutions to this problem.

Thank you,
@kanytu
- **2020-09-17** @pranjal_jumde: @kanytu - We are working with the Chromium team to fix this issue at the moment. Do you have any timeline for disclosure?
- **2020-09-18** @kanytu: Hi Brave team,

I understand these things take time. I don't want to impose a short deadline for the fix. Do you think you can have that addressed by the end of November?

Thank you,
@kanytu
- **2020-09-21** @pranjal_jumde: Thanks @kanytu - November works for us. Thank you for your patience.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
