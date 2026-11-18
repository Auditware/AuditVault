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
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi, we(Orange Tsai and Meh Chang) are the security research team from DEVCORE. Recently, we are doing a research about SSL VPN security, and found several critical vulnerabilities on Pulse Secure SSL VPN! We have reported to vendor and [patches](https://kb.pulsesecure.net/articles/Pulse_Security_Advisories/SA44101) have been released on `2019/4/25`. Since that, we keep monitoring numerous large corporations using Pulse Secure and we noticed that Twitter haven't patched the SSL VPN server over one month!

These vulnerabilities include a pre-auth file reading(CVSS 10) and a post-auth(admin) command injection(CVSS 8.0) which can be chained into a pre-auth RCE! Here are all vulnerabilities we found:

* CVE-2019-11510 - Pre-auth Arbitrary File Reading
* CVE-2019-11542 - Post-auth Stack Buffer Overflow
* CVE-2019-11539 - Post-auth Command Injection
* CVE-2019-11538 - Post-auth Arbitrary File Reading
* CVE-2019-11508 - Post-auth Arbitrary File Writing
* CVE-2019-11540 - Post-auth Session Hijacking


## Our Steps

First, we download following files with CVE-2019-11510:
1. `/etc/passwd`
2. `/etc/hosts`
3. `/data/runtime/mtmp/system`
4. `/data/runtime/mtmp/lmdb/dataa/data.mdb`
5. `/data/runtime/mtmp/lmdb/dataa/lock.mdb`
6. `/data/runtime/mtmp/lmdb/randomVal/data.mdb`
7. `/data/runtime/mtmp/lmdb/randomVal/lock.mdb`

██████████


The VPN user and hashed passwords are stored in the file `mtmp/system`. However, Pulse Secure caches the plain-text password in the `dataa/data.mdb` once the user log-in. Here, we just grep part of username/plain-text-password for proofs and further actions.

*P.S. we mask the password field for security concerns, and we can send to you if you provide your PGP key.*

```
█████████ / ████
█████████ / ██████
█████ / █████████
██████████ / █████████
███ / ██████
```

Once we log into the SSL VPN, we found the server has enabled the Two-Factor Authentication. Here, we listed two methods to bypass the 2FA:

████

1. We observed Twitter using the 2FA solution from Duo.com. With the file `mtmp/system`, we could obtain the integration key, secret key, and API hostname, which should be protected carefully according to the [Duo documentation](https://duo.com/docs/pulseconnect):

    > Treat your secret key like a password
    The security of your Duo application is tied to the security of your secret key (skey). Secure it as you would any sensitive credential. Don't share it with unauthorized individuals or email it to anyone under any circumstances!

    ```
    # secret-key = ██████████
    ████
    dc=███,dc=duosecurity,dc=com
    cn=<USER>

    # LDAP password = ██████████
    ██████████
    █████
    ███████
    uid=<username>
    ```

2. The Pulse Secure stores the user session in the `randomVal/data.mdb`. Without `Roaming Session` option enabled, we can reuse the session and log into your SSL VPN!

██████████



The next, in order to trigger the command injection(CVE-2019-11542). We leverage the web proxy function to access the admin interface with following URL:

```
https://0/admin/
```

████████

We are now trying to crack the admin hash by GPU. It seems takes a long time, but once we cracked, we can achieve RCE absolutely. Actually, we can simply wait for the admin login and obtain the plain-text password directly!
```
███████
███████
```

Anyway, we decided to report to you first, because it's lethal and critical. If you want, we can provide the RCE PoC in admin interface in order to proof the potential risk!


## Impact:

1. Access Intranet(we have accessed the `███████` for proof) ██████████
2. Plenty of staff plain-text passwords
3. Internal server and passwords(such as the LDAP)
4. Attack back all VPN clients(we will detail the step in [Black Hat USA 2019](https://www.blackhat.com/us-19/briefings/schedule/#infiltrating-corporate-intranet-like-nsa---pre-auth-rce-on-leading-ssl-vpns-15545))
5. Private keys
6. Sensitive cookies in Web VPN(such as okta, salesforce, box.com and google)

## Supporting Material/References:

We attached screenshots to proof our actions. For security concern, we didn't attach the `mtmp/system` and the `dataa/data.mdb`. If you want, we can send to you with your PGP key encrypted!

## Recommend Solution

The only and simplest way to solve this problem is to upgrade your SSL VPN to the [latest version](https://kb.pulsesecure.net/articles/Pulse_Security_Advisories/SA44101)!

## Impact

1. Access Intranet(we have accessed the `████████` for proof) ████
2. Plenty of staff plain-text passwords
3. Internal server and passwords(such as the LDAP)
4. Attack back all VPN clients(we will detail the step in [Black Hat USA 2019](https://www.blackhat.com/us-19/briefings/schedule/#infiltrating-corporate-intranet-like-nsa---pre-auth-rce-on-leading-ssl-vpns-15545))
5. Private keys
6. Sensitive cookies in Web VPN(such as okta, salesforce, box.com and google)

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
