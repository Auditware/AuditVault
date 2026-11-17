---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/os-command-injection
  - env/network
substate: "resolved"
weakness: "OS Command Injection"
enriched: true
date: 2019-08-10
submitted: 2019-05-28T07:53:44.155Z
bounty_usd: 20160
votes: 1246
cve: "CVE-2019-11510", "CVE-2019-11542", "CVE-2019-11539", "CVE-2019-11538", "CVE-2019-11508", "CVE-2019-11540"
program: "[[programs/x|X / xAI]]"
reporter: "orange"
source: "https://hackerone.com/reports/591295"
title: "Potential pre-auth RCE on Twitter VPN"
---
# Potential pre-auth RCE on Twitter VPN

> **Severity:** Critical | **Bounty:** 20,160 USD | **Votes:** 1246 | **Program:** X / xAI | **Disclosed:** 2019-08-10

- Report: [https://hackerone.com/reports/591295](https://hackerone.com/reports/591295)
- CWE: OS Command Injection | CVE: CVE-2019-11510, CVE-2019-11542, CVE-2019-11539, CVE-2019-11538, CVE-2019-11508, CVE-2019-11540
- Submitted: 2019-05-28T07:53:44.155Z

## Report summary

Thanks Twitter Security Team again :) The details can be found here!
* [Attacking SSL VPN - Part 3: The Golden Pulse Secure SSL VPN RCE Chain, with Twitter as Case Study!](https://blog.orange.tw/2019/09/attacking-ssl-vpn-part-3-golden-pulse-secure-rce-chain.html)

## Timeline

- **Report Filed**
- **2019-05-28** @orange: Here we listed affected servers we are monitoring:

* [*] twitter    - version=9.0.3.64015, lastm=Thu, 13 Dec 2018 05:34:28 GMT     - ██████████████
* [*] twitter    - version=8.2.7.55673, lastm=Sat, 08 Apr 2017 02:31:54 GMT     - ████████████████
* [*] twitter    - version=8.2.7.55673, lastm=Sat, 08 Apr 2017 02:31:54 GMT     - ███████████████
* [*] twitter    - version=9.0.3.64015, lastm=Thu, 13 Dec 2018 05:34:28 GMT     - ████████
* [*] twitter    - version=9.0.3.64015, lastm=Thu, 13 Dec 2018 05:34:28 GMT     - █████████
* [*] twitter    - version=9.0.3.64015, lastm=Thu, 13 Dec 2018 05:34:28 GMT     -██████
* [*] twitter    - version=9.0.3.64015, lastm=Thu, 13 Dec 2018 05:34:28 GMT     -████████
* [*] twitter    - version=9.0.3.64015, lastm=Thu, 13 Dec 2018 05:34:28 GMT     - ██████████████████
* [*] twitter    - version=9.0.3.64015, lastm=Thu, 13 Dec 2018 05:34:28 GMT     - ███████████
* [*] twitter    - version=9.0.3.64015, lastm=Thu, 13 Dec 2018 05:34:28 GMT     - █████████████████
* [*] twitter    - version=9.0.3.64015, lastm=Thu, 13 Dec 2018 05:34:28 GMT     - ██████████
* [*] twitter    - version=9.0.3.64015, lastm=Thu, 13 Dec 2018 05:34:28 GMT     - ██████████
* [*] twitter    - version=9.0.3.64015, lastm=Thu, 13 Dec 2018 05:34:28 GMT     - ███
* [*] twitter    - version=9.0.3.64015, lastm=Thu, 13 Dec 2018 05:34:28 GMT     - ███
* [*] twitter    - version=9.0.3.64015, lastm=Thu, 13 Dec 2018 05:34:28 GMT     - ████
* [*] twitter    - version=9.0.3.64015, lastm=Thu, 13 Dec 2018 05:34:28 GMT     - ███
* [*] twitter    - version=9.0.3.64015, lastm=Thu, 13 Dec 2018 05:34:28 GMT     - █████████
- **2019-05-28** @orange: Hi, we have cracked the admin hash and got the root shell. This is definitely a Pre-auth RCE on your SSL VPN server!
```
██████
```
- **Report Triaged**
- **2019-05-28** @andrewsorensen: Hi @orange,

Do you have any details on the script you used to exploit CVE-2019-11510 (download.py)? We'd like to confirm that our mitigation works once we've applied the appropriate fix.

Thanks for thinking of Twitter security!
- **2019-05-29** @orange: Hi, @andrewsorensen 

Unfortunately we cannot provide the `download.py`. We decided not to disclose it until the Black Hat because of its criticalness. We believe it is not necessary for your patch. Upgrading the version is the only effective way to prevent this bug and we can help you verify your fix directly. However, we can provide files you need if you provide your PGP key. Also, we can provide the RCE PoC on the admin interface to prove the severity.
- **2019-05-30** @asayler: @orange, we believe this issue has now been patched. Can you verify on your end?

Also, I'm not sure if you still have copies of the files you were able to download, but if so can you please encrypt those for the attached GPG key and attach them here?
- **2019-05-30** @orange: Hi, it seems you upgrade all the Pulse Secure SSL VPN(17 servers) to the latest version(9.0.4.64055) on my side. And please check the attachment for files!
- **Report Resolved**
- **2019-06-10** @orange: Hi, there

We would like to make a public disclosure on August. Of course we will mask all the sensitive information.
Is there any concern on the side of Twitter?
- **2019-06-10** @orange: By the way, is this domain included in the bounty scope?
Thanks :)
- **2019-06-11** @asayler: Hi @orange,

 If you'd like to disclose this, can you please formally request disclosure on this report via the "Request disclosure" dropdown option? That will kick off the process on our end for performing any necessary redactions and evaluating that request.

And yes, we are evaluating this for bounty payout as well and will have more info on that soon.
- **2019-06-11** @orange: Sure, thanks!
We will disclosure this report via the "Request disclosure" dropdown in the end of July :)
- **2019-06-11** @asayler: @orange, I'd encourage you to request disclosure at least 30 days before you want it to go public as it can take a bit for us to process it on our end.
- **Bounty Awarded**
- **2019-06-12** @orange: @asayler Sure, we will note that, and thanks for the bounty :)
- **2019-07-12** @orange: Hi, @asayler 

We will public this report on our Black Hat talk on 8/7 so we would like to double check that, can we put the company name "Twitter" and the URL "██████████" in our slides? Of course, all other sensitive information will not be included! Is that OK to you?

If yes, I can send the "public disclosure request" via the HackerOne dropdown option now!
- **2019-07-16** @asayler: Hi @orange,

Thanks for checking in. While we're willing to disclose this report so that you may reference it, we'd prefer if Twitter not feature too prominently in your talk given that we are but one of numerous Pulse customers impacted by this vulnerability. That said, the decision on how to include us is ultimately up to you, and we appreciate your efforts to inform the wider community about this vulnerability and the impact it could have.

We would, however, prefer you not mention the domain used by Twitter's vpn (███████). While we realize this domain is likely discoverable by other means, we'd rather not to draw too much attention to it given the fact that we do not generally publish our VPN domains publicly.

Once you request disclosure, I'll take a pass through this report to redact that domain name as well as any other sensitive details included in this report. Please avoid sharing any of the information we redact when speaking or writing about this issue publicly.

In terms of timeline, would you prefer we wait to disclose this report until the day of your talk? Or are you okay with us disclosing this report in the coming weeks prior to your talk?

Thanks,
Andy
- **2019-07-17** @orange: Sure, we will pay more attentions while presenting and mask all your domain info carefully! About the disclosure day, could you disclose this report on 8/10? If yes, when do I need to press the "request disclosure" button?

Thanks!
- **2019-07-17** @asayler: Thanks @orange. Please go ahead and request disclosure now, and we'll coordinate on our end to complete the actual disclosure on 8/10.
- **Agreed On Going Public**
- **2019-07-26** @asayler: @orange I just wanted to confirm that you want us to disclose this on Saturday, August 10th. I noticed your talk is actually on Wednesday, August 7th (https://www.blackhat.com/us-19/briefings/schedule/#infiltrating-corporate-intranet-like-nsa---pre-auth-rce-on-leading-ssl-vpns-15545), so I wanted to confirm that you still wanted this disclosed on the 10th, not the 7th.
- **2019-07-26** @orange: @asayler Hi, we also have a DEFCON talk on 8/9, so we think the 8/10 is more proper!
- **2019-07-26** @asayler: Sounds good, @orange. We'll plan on the morning of the 10th. Do you have a link to yoru DefCon talk as well?
- **2019-07-27** @orange: Sure! Here is the link: https://www.defcon.org/html/defcon-27/dc-27-schedule.html
- **Report Title Updated**
- **Agreed On Going Public**
- **Report Became Public**
