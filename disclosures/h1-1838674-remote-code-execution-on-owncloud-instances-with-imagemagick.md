---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/code-injection
  - env/web
substate: "resolved"
weakness: "Code Injection"
enriched: true
date: 2023-04-12
submitted: 2023-01-18T23:07:04.547Z
bounty_usd: null
votes: 7
cve: []
program: "[[programs/owncloud|ownCloud]]"
reporter: "lukasreschke"
source: "https://hackerone.com/reports/1838674"
title: "Remote Code Execution on ownCloud instances with ImageMagick installed"
---
# Remote Code Execution on ownCloud instances with ImageMagick installed

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 7 | **Program:** ownCloud | **Disclosed:** 2023-04-12

- Report: [https://hackerone.com/reports/1838674](https://hackerone.com/reports/1838674)
- CWE: Code Injection
- Submitted: 2023-01-18T23:07:04.547Z

## Timeline

- **Draft Started**
- **Report Filed**
- **2023-01-18** @ownCloud: Thanks a lot for reporting this potential issue back to us. We take security very seriously and would appreciate if you would not share any information about this bug until we have determined a potential patch.
 
Our security team will take a look at this issue as soon as possible. We will reply to your report within 72 hours, usually much faster.
- **Report Triaged**
- **2023-01-19** @lukasreschke: I haven't really dived deep into potential mitigations here.

In my  experience it is best to just use a locked down [policy.xml](https://imagemagick.org/script/security-policy.php) (maybe it's possible to set that in PHP using `MAGICK_CONFIGURE_PATH`?) and dedicated short-lived sandboxed machines/processes for anything that deals with converting user supplied content. The latter may be hard with a self-hosted model... (but maybe something valuable for oCIS?)
- **2023-01-19** @corby: Alright, we'll investigate different options and will keep this in mind for oCIS as you said.
I'll keep you updated when there are any news.
- **2023-02-08** @lukasreschke: Has there been any update here? Or communications that insecure image preview providers should be disabled?
- **2023-02-09** @corby: Hi Lukas,

thanks for keeping up with the issue.
There hasn't been any update or communications yet. We tried to find different options to fix this issue but unfortunately the only secure solution is to as you said use a locked down `policy.xml`.
We are preparing a text for publication and changes to the docs and will publish them soon, I hope it will be next week.

Thanks and best regards,
Corby
- **2023-02-20** @lukasreschke: > We are preparing a text for publication and changes to the docs and will publish them soon, I hope it will be next week.

Has there been any publicly shareable update on this? :)
- **2023-02-21** @corby: Hi,

so far we have added this to our docs: https://doc.owncloud.com/server/10.10/admin_manual/installation/manual_installation/manual_imagick7.html#secure-imagemagick
We still have to send out a text to our customers to make them aware of this.

Thanks!
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
