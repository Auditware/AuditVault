---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/server-side-request-forgery-ssrf
  - env/web
  - stack/node
substate: "resolved"
weakness: "Server-Side Request Forgery (SSRF)"
enriched: true
date: 2020-06-28
submitted: 2020-06-04T20:42:14.550Z
bounty_usd: null
votes: 23
cve: "CVE-2020-8205"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "mahmoud0x00"
source: "https://hackerone.com/reports/891270"
title: "[Uppy] Internal Server side request forgery (bypass of #786956)"
---
# [Uppy] Internal Server side request forgery (bypass of #786956)

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 23 | **Program:** Node.js third-party modules | **Disclosed:** 2020-06-28

- Report: [https://hackerone.com/reports/891270](https://hackerone.com/reports/891270)
- CWE: Server-Side Request Forgery (SSRF) | CVE: CVE-2020-8205
- Submitted: 2020-06-04T20:42:14.550Z

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **2020-06-05** @mahmoud0x00: Hey, 

seems it is a problem in their setup, seems that someone noticed that I fetched sensitive file yesterday and disabled it. Try to fetch any file using URL and it will throw the same error. (this on chrome)

{F856169} 

So to reproduce it, feel free to set up the latest version of it on your local machine and follow the same steps to reproduce it. or you can invite the maintainer of the module and let him triage it.

Thanks
- **2020-06-05** @mahmoud0x00: Hey @lugtag,

it came back to work, Please triage it as soon as possible. 

Thanks
- **Report Triaged**
- **Report Severity Updated**
- **External User Joined**
- **2020-06-15** @arturi: Thanks for reporting! Could you please invite ife@transloadit.com?
- **2020-06-15** @mahmoud0x00: @arturi Thanks for replying, Could you please create a CVE for this one? after fixing it for sure, I don't have the ability to invite other users, I guess @lugtag can help in this
- **2020-06-18** @bbe8482aecd24374d13c5de15a0a6: I have invited the person as requested. So it is already fixed and we can disclose this report and request a CVE?
- **External User Joined**
- **2020-06-18** @ifedapoolarewaju: @danielruf It is not fixed yet. There's a PR to fix it here https://github.com/transloadit/uppy/pull/2322 but it hasn't been released yet, so we can hold-off on the CVE for now. Also thank you for the invitation
- **2020-06-18** @ifedapoolarewaju: For clarity, the fix from  #786956 did address redirects. However, this current issue only occurs when the original URL being requested has a different protocol (e.g http) from the protocol it redirects to (e.g https). For example the URL https://tinyurl.com/gqdv39p (with protocol https) redirects to http://169.254.169.254/metadata/v1/ (with protocol http) and so the issue could be reproduced. The PR description explains this.
- **2020-06-18** @bbe8482aecd24374d13c5de15a0a6: Thanks for the clarification @ifedapoolarewaju.

Regarding the CVE, we can request one only after the disclosure of the report which is done after the issue is fixed.
- **2020-06-20** @mahmoud0x00: @ifedapoolarewaju @arturi @danielruf 

I have just noticed that you mentioned this issue in [Changelog](https://github.com/transloadit/uppy/blob/master/CHANGELOG.md#1161) yesterday, also I have already checked this issue on your demo version and it seems fixed, Good Job! 👍
- **2020-06-22** @ifedapoolarewaju: Yes, this is correct. The issue has been fixed (on versions 1.13.2, and 2.0.0-alpha.5) and released via npm. Thank you again for reporting the issue 🙏
- **2020-06-22** @mahmoud0x00: You are welcome @ifedapoolarewaju 🙏🏻 @danielruf time for disclosure and CVE request?
- **2020-06-22** @mahmoud0x00: @danielruf could you also please redact my video and screenshot? because I leaked uppy.io 's internal server 's metadata info.
- **2020-06-28** @bbe8482aecd24374d13c5de15a0a6: Hi @mahmoud0x00, I have redacted (converted to internal-only) the screenshot and the video from the initial report. Is this correct or do we have to redact more?
- **2020-06-28** @mahmoud0x00: @danielruf Looks good 👍
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
