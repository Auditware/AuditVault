---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
date: 2020-04-18
submitted: 2019-12-29T07:39:05.231Z
bounty_usd: null
votes: 59
cve: []
program: "[[programs/palo_alto_software|Palo Alto Software]]"
reporter: "homai"
source: "https://hackerone.com/reports/765679"
title: "Stored XSS on upload files leads to steal cookie"
---
# Stored XSS on upload files leads to steal cookie

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 59 | **Program:** Palo Alto Software | **Disclosed:** 2020-04-18

- Report: [https://hackerone.com/reports/765679](https://hackerone.com/reports/765679)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2019-12-29T07:39:05.231Z

## Report summary

Attackers can trigger XSS by SVG files. Developers should attention to block SVG files or sanitize files before upload.
This report has found by the following link :
[File Upload XSS](https://brutelogic.com.br/blog/file-upload-xss/)

Thanks to Master of XSS : [Rodolfo Assis](https://twitter.com/rodoassis)

## Timeline

- **Report Filed**
- **Report Triaged**
- **2020-01-04** @homai: Happy new year @staffors 

Please notify me when a patch has been placed. I would like to double-check the issue after your patch.

Thanks.
- **2020-01-24** @kad3nce: @seqrityman, I tried and failed to reproduce this today. I downloaded the payloads you provided and sent them to a test Outpost mailbox.

In Safari 13.0.4 (15608.4.9.1.3) and Chrome 80.0.3987.53, when clicking the attachments in the received email, a new tab opens and shows a small blank triangle, but no alert.

In Firefox 71.0, a new tab opens when clicking the attachments, and an error message is shown: 'The Image "https://..." cannot be displayed because it contains errors.' (Screenshots attached).

Will you please test again and/or give guidance on how to reproduce?

Thanks so much!
- **2020-01-24** @kad3nce: @seqrityman, I forgot to include that I'm on macOS 10.15.2.
- **2020-01-24** @kad3nce: @seqrityman, just tested on Ubuntu 19.10 with Chrome 79 and Firefox 72 and experienced the same behavior as on the Mac (a new tab opens and shows a small blank triangle, but no alert, or shows a message that the image cannot be displayed because it contains errors, respectively).
- **2020-01-25** @homai: Hi @kad3nce 
I think you have sent files to other users but try to open files from your account(From Sent folder). For this reason, you have received this kind of message.
In my scenario, I've created two accounts and send files from the first account and open files in the second account.
Please try again and open links from destination inbox.
If you have any problems or questions, please let me know.

Thanks for your attention.
- **2020-01-28** @homai: Any problem?
- **2020-01-30** @kad3nce: Thank you for the clarification, @seqrityman. I was able today to repro in Chrome and Firefox. Moving forward with a fix. Will reach back out if we need anything else, and will let you know when a fix has been deployed.
- **2020-02-15** @kad3nce: We have a fix in flight now. Will touch base when it goes live (likely in 3-4 weeks).
- **2020-03-18** @homai: Hi @kad3nce 
Is there any new news?
- **Report Resolved**
- **2020-03-19** @homai: I hope your business be safer.
I made a request disclosure, I think this report has some important things for developers. 
If you agree with disclosure this report, please confirm that.
Thanks for your attention :)
- **Agreed On Going Public**
- **Report Became Public**
