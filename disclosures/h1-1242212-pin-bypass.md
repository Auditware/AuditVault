---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-authentication-generic
  - env/web
substate: "informative"
weakness: "Improper Authentication - Generic"
enriched: true
body: true
date: 2021-06-29
submitted: 2021-06-23T14:36:05.900Z
bounty_usd: null
votes: 34
cve: []
program: "[[programs/myetherwallet|MyEtherWallet]]"
reporter: "tushar_rec0n"
source: "https://hackerone.com/reports/1242212"
title: "PIN bypass"
---
# PIN bypass

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 34 | **Program:** MyEtherWallet | **Disclosed:** 2021-06-29

- Report: [https://hackerone.com/reports/1242212](https://hackerone.com/reports/1242212)
- CWE: Improper Authentication - Generic
- Submitted: 2021-06-23T14:36:05.900Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:

MEW apk has improper rate limit.


When we try to brute force the PIN, we are rate limited for 5 minutes after 5 or 6 attempt.


In my testing I found that it was checking the device's local time so by changing it we can brute force the PIN.


## Steps To Reproduce:

1.Install MEW app from play store.

2.Create your PIN.

3.Now open again your MEW apk.

4.You will be asked to enter the PIN.

5.Try to brute force the code. You will see a message to try again after 5 min.

6.Now change the time of your device.

7.Observe there is no rate limit now.

## Supporting Material/References:


{F1350023}

## Impact

An attacker can brute force the PIN of an user

## Timeline

- **Report Filed**
- **2021-06-24** @fobozsb: Hi @tushar_9905, thanks for the report, we're looking into it to verify
- **2021-06-28** @tushar_rec0n: Hey @fobozsb,

I hope you're doing well.

Can I get an update regarding my report. It has been 5 days.


Thanks.
- **Report Informative**
- **2021-06-28** @tushar_rec0n: >Also this approach require a physical access to device.

Do you mind telling me why have you put a PIN there?

How a security PIN protect the users?


Also there is a better way to handle this by checking for the PIN on the server side rather than in the client's phone.
- **Hacker Requested Mediation**
- **2021-06-28** @tushar_rec0n: As far as I can understand MEW wallets are protected by a security PIN and promises no one other than me can unlock the wallet. 

But this is not the case here.

It is absolutely a critical vulnerability which should be resolved.




{F1357026}
- **2021-06-28** @tushar_rec0n: *Brute-forcing a pin code requires trial and error to try and determine the correct combination. However, both your mobile device and the MEW wallet app have placed heavy restrictions on the number of attempts you can make to unlock them. For this reason, the possibility of someone accessing your app with your phone is very small, even if they have prolonged access to it.*

https://kb.myetherwallet.com/en/mewwallet/mewwallet-pin-password/

 Now I think it's clear that there is a bug which should be resolved.
Could please reconsider my report???
- **2021-06-29** @mewart: We looked into your report. This was a known issue and since we are client side wallet, we cannot verify the pin on the server side. We also don't think it is possible to brute force 1m variations without a debugging tool and since require physical connection to the device with developer-level debugging tool. We cannot accept this as a valid vulnerability and we will mark it as informational.
- **2021-06-29** @tushar_rec0n: *MEW wallet app have placed heavy restrictions on the number of attempts you can make to unlock them*

*For this reason, the possibility of someone accessing your app with your phone is very small, even if they have prolonged access to it.*

Rate limiting the number of attempts via clients time zone is not at all a heavy restriction, an attacker with no skills can easily bypass this.

https://kb.myetherwallet.com/en/mewwallet/mewwallet-pin-password/

I don't know why there is so much written about the security of the app.

Let's see what Hackerone Mediation Team has to say about this after that we can publicly disclose this.


Thank You
- **2021-06-29** @tushar_rec0n: >We also don't think it is possible to brute force 1m variations without a debugging tool and since require physical connection to the device with developer-level debugging tool. We cannot accept this as a valid vulnerability and we will mark it as informational.


There are many tools out there which can easily automate this, we don't need any `developer-level debugging tool` for this.


It's just a simple restriction which can be bypassed within hours.


Example:


https://github.com/urbanadventurer/Android-PIN-Bruteforce
- **2021-06-29** @tushar_rec0n: I did some research and came to the conclusion that we can rate limit client side apps using a Network Time Protocol, just like Clash of Clans or other famous apps which use it to synchronize the time over the whole network.




In this way you can check for the time lapsed via a time zone which cannot be changed by the user or an attacker.

>It is possible to use elapsed time or try to listen time changed event, but all of this methods are not perfect and may work wrong.

This method is perfect and almost every client side game uses this.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2021-06-29** @tushar_rec0n: On 24th june the programs policy was changed, I submitted my report on 23rd june and it was made out of scope.

At least be honest to yourself.

Thank you for the disclosure.
