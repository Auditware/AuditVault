---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/http-request-smuggling
  - env/web
substate: "resolved"
weakness: "HTTP Request Smuggling"
enriched: true
date: 2020-07-09
submitted: 2020-01-10T14:24:17.581Z
bounty_usd: null
votes: 559
cve: []
program: "[[programs/eternal|Eternal]]"
reporter: "defparam"
source: "https://hackerone.com/reports/771666"
title: "Stealing Zomato X-Access-Token: in Bulk using HTTP Request Smuggling on api.zomato.com"
---
# Stealing Zomato X-Access-Token: in Bulk using HTTP Request Smuggling on api.zomato.com

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 559 | **Program:** Eternal | **Disclosed:** 2020-07-09

- Report: [https://hackerone.com/reports/771666](https://hackerone.com/reports/771666)
- CWE: HTTP Request Smuggling
- Submitted: 2020-01-10T14:24:17.581Z

## Report summary

Account takeover vulnerability using HTTP Request Smuggling and Desync attacks, this time through Akamai en route to Zomato. A big thanks to Zomato and Akamai for working with me to fix these issues in a timely manner.

For more information about these types of vulnerabilities check out my talk [Practical Attacks using HTTP Request Smuggling](https://youtu.be/3tpnuzFLU8g)

## Timeline

- **Report Filed**
- **2020-01-10** @defparam: When assessing if this is a `Mass PII leak`, Using TurboIntruder in a small sample test I was able to steal an account per every 2 or 3 requests before getting rate limited. An attacker could set up several attacker processes across IP addresses/geos to bypass rate limiting and increase the throughput of account takeovers. A successful attack like this could compromise most of the userbase
- **2020-01-10** @biryani-is-lob: Hi @defparam, 

Thanks for the submission, looking into this. 
 @ehsahil-zomato
- **Report Needs More Info**
- **Report New**
- **2020-01-10** @biryani-is-lob: @defparam, 

I am able to reproduce the behavior you are describing in the provided video PoC, I am asking for the video PoC showing other users PII leak to assess the severity of the issue. 

Thanks 
@ehsahil
- **2020-01-10** @defparam: @ehsahil,

Ah, I'm sorry! I misunderstood. Here is the sequel to my movie part 2 (lol)
████████

Best,
@defparam
- **Report Triaged**
- **2020-01-11** @prateek_0490-zomato: Hi @defparam - Awesome find. Out of curiosity, are you still testing it? ████████

We’re working on the fix.

Prateek
- **Report Severity Updated**
- **2020-01-11** @defparam: @prateek_0490-zomato ,

I've only ran a handful of tests today and that was to make the video for @ehsahil-zomato, Since then I haven't touched the asset and I've double check my machine, I have no traffic being sent to Zomato.
Last time I sent continuous traffic was thursday evening eastern standard timezone. Once I found the bug I finished testing and sent my report the next morning (today).

Best,
@defparam
- **2020-01-13** @prateek_0490-zomato: Hi @defparam - thanks, just a quick update - we're still working on it. We're taking multiple steps to mitigate this issue and apart from this we're also proactively adding checks to avoid such vulnerabilities.

Again, this was a great find. Keep Hunting.

P.S. - We're deciding on the bounty, please allow us time to get back.

Prateek
- **2020-01-13** @defparam: Hey @prateek_0490-zomato ,

Many thanks! Take your time, there's no rush here on my end. I'm happy to test the remedies once they are staged.

Best Regards,
@defparam
- **2020-01-14** @prateek_0490-zomato: Hi @defparam - We've deployed a fix, we will still be hardening it a bit more throughout the week.

Let me explain you about what was actually happening - so, basically this was happening at the AKAMAI level where the request were getting poisoned which lead to the issue and ideally those requests never reached our backend servers. Below rough illustration should give you a better idea -

{F684136}

Additionally, we are still investigating and figuring out the users who got affected because of this and as a precautionary measure we will be revoking their tokens. Initial investigation shows the count isn't exceeding hundred. Could you please confirm if the below IP is of your Digital Ocean instance -

- 159.8█████

Moreover, can you please go ahead and retest all the possible scenarios and try to bypass the current fixes in place? We really appreciate your help and cooperation in keeping @Zomato secure :)

Looking forward to hear back.

Prateek
- **2020-01-14** @defparam: Hi @prateek_0490-zomato ,

Very interesting! I did not expect that the desync had been solely contained within Akamai! One interesting this about this finding is that I would have normally ran my array of desync tests on Zomato and moved on happy. This is because for my normal tests I usually use the **GET** or **POST** http verbs which showed that **api.zomato.com** passed with no desync problems. However, for some reason I decided to retest using the **DELETE** verb and this is where I saw all the desync issues listed in my tool. I'm glad I found it because now I'm sure to perform my desync tests across a variety of HTTP verbs going forward. Thanks for the write up!

Yes I can confirm that ``159.8███`` is my digital ocean instance ;)

I re-ran my tests and I see no issues at all with the asset now.
███████
███
███████
███████

Super interesting bug, Thanks!
Best,
@defparam
- **2020-01-14** @prateek_0490-zomato: Awesome, thanks much for the confirmation, @defparam :)

AKAMAI is also rolling out the fix at their platform level in couple of days, I'll keep the report open until then and will request you to retest it again once that has been deployed.

We've been reviewing/investigating report for bounty, so expect to hear back by end of this week. Looking forward to receive some more awesome reports from you. Happy hunting!

Thanks again for helping us keep @Zomato safe and secure for our users.

Prateek
- **Bounty Awarded**
- **2020-01-16** @prateek_0490-zomato: Hi @defparam - We're still awaiting to hear back from AKAMAI, once they release a platform level fix, we will update here and request you to please retest it to see if you can find a bypass.

Enjoy the bounty and keep hunting!

Prateek
- **2020-01-16** @defparam: Thanks @Zomato !

I'm honored on the bounty amount past your advertised max! It illustrates how critical the issue was and I'm glad the team fixed it in a timely manner. Once let me know when you need one last re-test and I'm happy to run it.

Thanks again for your generous bounty,
Best,
@defparam
- **2020-01-22** @prateek_0490-zomato: @defparam - We're still awaiting to hear back on this, will keep you posted.

Prateek
- **2020-01-22** @defparam: Hey @prateek_0490-zomato ,

No worries. Akamai’s threat analysis team did reach out to me on Friday. They mentioned this report is the second bug I found in their WAF (the first being from a different BB program) and wanted data on the test vectors I’ve been using. I provided that data late Friday. It was a national holiday in US on Monday so they are probably currently spinning up their test scripts with my vectors this week.

Best,
@defparam
- **2020-01-22** @prateek_0490-zomato: @defparam - We thought so based on the conversations we're having with them. We're also going back and forth and pushing them :)

Thanks for the updates. Will let you know in case we hear back from them, and either way do let us know if you hear back from them first :)

Prateek
- **Report Resolved**
- **2020-01-28** @defparam: March?! wow, yeah I don’t blame you guys. Well, things appeared good on the last scan. Looking forward to working with you again.

Cheers,
Evan
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
