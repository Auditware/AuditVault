---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/violation-of-secure-design-principles
  - env/web
substate: "resolved"
weakness: "Violation of Secure Design Principles"
enriched: true
date: 2019-02-02
submitted: 2019-01-26T15:26:20.642Z
bounty_usd: null
votes: 28
cve: []
program: "[[programs/ratelimited|RATELIMITED]]"
reporter: "notexist"
source: "https://hackerone.com/reports/486667"
title: "Missing Protection Mechanism in Mail Servers allows malicious user to use staff.ratelimited.me email could lead to identity theft."
---
# Missing Protection Mechanism in Mail Servers allows malicious user to use staff.ratelimited.me email could lead to identity theft.

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 28 | **Program:** RATELIMITED | **Disclosed:** 2019-02-02

- Report: [https://hackerone.com/reports/486667](https://hackerone.com/reports/486667)
- CWE: Violation of Secure Design Principles
- Submitted: 2019-01-26T15:26:20.642Z

## Timeline

- **Report Filed**
- **2019-01-26** @notexist: You might consider checking these following reports for more information :
- https://hackerone.com/reports/182467
- https://hackerone.com/reports/575

This issue was i guess a worth for fixing or just make the impact goes to minimal. If this issue might not be part as your concern. I will love to learn and know the reason why in exchange only for knowledge.

Kind Regards,
Mart Gil
- **Report Severity Updated**
- **Report Title Updated**
- **Report Triaged**
- **Report Needs More Info**
- **Report New**
- **2019-01-27** @gtsatsis: Hey there Mart,

Would you happen to know how to fix this? I've added both SPF & DKIM, but I cannot do any server-side configuration, as our e-mail is powered by Yandex.

Regards,
George
- **Report Needs More Info**
- **Report New**
- **2019-01-27** @notexist: Hi @gtsatsis i use this website https://toolbox.googleapps.com/apps/messageheader/ to analyze the header from message and it does detect the domain from which the email came from in this case `emkei.cz`.
- **2019-01-27** @notexist: Sorry for my very limited actions for help you out from these issue but i am really trying my best :) and this is just a little bit difficult situation due to black-box testing. 

##### Please try the following as much as possible
Recognize email spoofing
- Check return path
- Check originating IP

To prevent email spoofing
- Setup SPF Record - for setting up SPF records please do follow https://yandex.com/support/domain/set-mail/spf.html instruction.
- Setup DKIM/DMARK -  for setting up DKIM signature please do follow https://yandex.com/support/domain/set-mail/dkim.html instruction.

and if possible please do let me know that are those steps or action that is being try already. But again for just server-side mitigation only try to follow my suggestion above on how to recognize email spoofing.

Kind Regards,
Mart Gil
- **2019-01-27** @notexist: **Please do visit this also as this might be the fix for this issue as my final resort and i'm confident it is:**
*This include specified configuration for `@gmail.com` accounts*
https://support.google.com/a/answer/33786

And another one from yandex https://yandex.com/support/connect/dns/spf.html
**They also take note for 72 hours to take effect of the configuration**, and so im not in a hurry so in fact i will keep an eye on this and check it by 2 days or so if needed to verify the fix.

I'm very happy working with you guys not only for helping out people from fixing issue against their site but also i'm learning new things and gain new experience.

Cheers,
Mart Gil
- **2019-01-27** @gtsatsis: Hey there Mart,

I had set the SPF & DKIM records yesterday after my response, and mxtoolbox shows them.

I guess all we can do is wait now.

Regards,
George
- **Report Needs More Info**
- **Report New**
- **2019-01-30** @notexist: Hello @gtsatsis it looks like this issue has been fixed :D I can confirm the fix by sending another spoofed email using `@staff.ratelimited.me` and this time it has been thrown to spam section of gmail. 

####  Spoofed email in spam section.
{F414823}
- **2019-01-30** @gtsatsis: Hey there @sxw,

Normally, I'd close this as resolved already, as you've verified, but it seems that it hasn't worked on my end(?)..

https://once-i-was-11-years-old-my.daddy-told.me/go-get-yourself-a-wife-or-youll-be-lonely/cdejf6bfvz.png

I came up with a seemingly real e-mail, and Google passed it through without an issue.

I have set up mail.staff.ratelimited.me to CNAME to domain.mail.yandex.net, DKIM under the mail selector of the staff subdomain, and SPF for staff.ratelimited.me.

I am currently unaware of any other solutions I could take.
- **2019-01-30** @gtsatsis: Additional info from mail-tester.com: https://once-i-was-11-years-old-my.daddy-told.me/go-get-yourself-a-wife-or-youll-be-lonely/fi8p2bu97r.png
- **2019-01-30** @notexist: Ow god, that was really awful. What tools have you use to replicate the issue. I just don't it get this could be possible after setting up SPF record and other configuration ? Though in my part i think its really fixed. What else i could ever do instead to finally resolved this issue ? 

Kind Regards,
Mart
- **2019-01-30** @gtsatsis: I've been using emkei.cz to test, and in all cases, my emails that looked legit passed through GMail's spam filters, I've got no idea anymore
- **2019-01-30** @notexist: I guess that should be the only way to mitigation in that issue instead. Google just separted spoof emails in `spam` from legitimate emails in `inbox` then they are only including warnings from the reciever about potential harm  againsts to it. In fact in #575 they took the same issue and this is only the fixed by just moving spoof email to `spam`.

I hope this helps,
Mart Gil
- **2019-01-30** @notexist: If you agreed it is you can close this report as resolved. 

Thank you,
Mart Gil
- **Report Resolved**
- **2019-01-30** @gtsatsis: Hey @sxw,

I wish I could give you even more reputation right now.

I have found the issue to be that I had forgotten to include `-all` at the end of the SPF record. Now a full FAIL happens upon SPF checks, and it will be directly put into spam!

Regards,
George
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
