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
