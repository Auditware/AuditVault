---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/server-side-request-forgery-ssrf
  - env/web
substate: "resolved"
weakness: "Server-Side Request Forgery (SSRF)"
enriched: true
body: true
date: 2025-06-03
submitted: 2025-05-28T09:36:50.362Z
bounty_usd: null
votes: 116
cve: []
program: "[[programs/lichess|Lichess]]"
reporter: "oblivionsage"
source: "https://hackerone.com/reports/3165242"
title: "Server-Side Request Forgery (SSRF) via Game Export API"
---
# Server-Side Request Forgery (SSRF) via Game Export API

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 116 | **Program:** Lichess | **Disclosed:** 2025-06-03

- Report: [https://hackerone.com/reports/3165242](https://hackerone.com/reports/3165242)
- CWE: Server-Side Request Forgery (SSRF)
- Submitted: 2025-05-28T09:36:50.362Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

# Summary

Hello Lichess Team,

I found a Server-Side Request Forgery vulnerability in the game export functionality. An attacker can make the Lichess server send HTTP requests to arbitrary URLs by manipulating the `players` parameter. This works on public endpoints that don't require any authentication





# Description:

The issue is in the game export API endpoints that accept a `players` parameter. When I looked at the code, I noticed that this parameter gets passed directly to `RealPlayerApi.apply()` without any URL validation


Here's the problematic flow I found:



In `app/controllers/Game.scala`:

```bash
val config = GameApiV2.OneConfig(
  format = GameApiV2.Format.byRequest,
  imported = getBool("imported"),
  flags = requestPgnFlags(extended = true),
  playerFile = get("players")  // User input taken directly
)
```


Then in `modules/api/src/main/GameApiV2.scala`:


```bash
realPlayers                  <- config.playerFile.so(realPlayerApi.apply)
```

And finally in `modules/web/src/main/RealPlayer.scala`

```bash
def apply(url: String): Fu[Option[RealPlayers]] = cache.get(url)
// This leads to:
ws.url(url).withRequestTimeout(3.seconds).get()
```


The `get("players")` method directly reads from HTTP query parameters without any validation. The `so()` method executes the function when the Option contains a value, so any URL I provide gets passed straight to the HTTP client




# PoC

Note: I discovered this vulnerability through source code analysis and then confirmed it by testing live on the official Lichess website. The following PoC demonstrates the issue as it exists in the production environment

1. Pick any valid game ID from Lichess (like from a recent game)

{F4390928}

2. Make a request to: `/game/export/[GAME_ID]?players=http://169.254.169.254/latest/meta-data/ `

3. The server will make an HTTP request to the provided URL

4. You can also test with: `/api/games/export/_ids?players=[URL]` or `/api/games/user/[USERNAME]?players=[URL] `

5. Monitor your server logs or use a service like webhook.site to confirm the request


{F4390944}

{F4390945}

# Mitigation:

To fix this, you should:

+ Add URL validation to only allow specific trusted domains for the `players` parameter

+ Implement a whitelist of allowed URLs or URL patterns

+ Consider removing the feature entirely if it's not critical

+ Add authentication requirements for these endpoints

+ Block requests to private IP ranges (127.x.x.x, 192.168.x.x, 10.x.x.x, 169.254.x.x) (For security and ethical reasons, I did not send any actual requests to these IP addresses. If required, I can provide my own IP address or any additional information for verification purposes)


The fix should be in `RealPlayerApi.apply()` method to validate the URL before making any HTTP requests.


https://cwe.mitre.org/data/definitions/918.html

## Impact

An attacker could use this to:

+ Access cloud metadata services (AWS, GCP) to steal credentials and configuration
+ Scan internal networks and discover internal services
+ Access internal APIs and admin panels that aren't exposed to the internet
+ Potentially read sensitive internal data or configuration files
+ Perform port scanning of internal infrastructure

This is particularly concerning because the endpoints are public - no authentication needed. Also, since it's on a high-traffic site like Lichess, an attacker could potentially use this to bypass IP-based restrictions on internal services

## Timeline

- **Report Filed**
- **2025-05-28** @oblivionsage: Just to add:
I actually found this vulnerability by looking through the official lichess-org/lila code on GitHub. That means it’s not just lichess.org that’s affected anyone running their own Lichess server or using this code (including forks and self-hosted versions) will be vulnerable too, unless they patch it.
So this issue doesn’t just impact the main site, but could affect a lot of other projects and players out there as well
- **2025-05-30** @oblivionsage: Hi team is there any update?
- **2025-06-02** @oblivionsage: Hi Lichess Team,

I hope you're doing well. I submitted a Server-Side Request Forgery vulnerability report, I wanted to check if you had a chance to review the report.I'm happy to provide any additional information or clarification if needed. The vulnerability allows making HTTP requests to arbitrary URLs including internal networks, so I wanted to ensure it gets proper attention

Thanks for your time and looking forward to hearing from you

Best regards

@oblivionsage
- **Report Resolved**
- **2025-06-02** @shrimpmode: We have precise monitoring of the usage of that feature, and fortunately it doesn't seem like it has ever been abused, so far.
- **2025-06-02** @oblivionsage: Hi @shrimpmode 

Thanks so much for the quick fix and sorry about the delay on my end too! Really appreciate you taking this seriously and removing the feature entirely - that's definitely the safest approach

Quick question: since this was a legitimate vulnerability with a public fix, would it make sense to request a CVE for it? No pressure at all, just thought it might be worth considering

Also, completely unrelated but... any chance you'd be up for a quick chess game sometime?  Would be fun to play on the platform with  main dev

Thanks again for being so responsive and professional about this

Cheers!
- **Agreed On Going Public**
- **2025-06-03** @oblivionsage: Awesome, thanks so much @shrimpmode 

CVE process  just to clarify, HackerOne doesn't automatically handle CVE requests. It's usually either:

1. The vendor (you guys) requests it from MITRE, or 
2. The researcher (me) can request it on behalf of the project

I'm happy to handle the CVE request through MITRE if you'd like - it's pretty straightforward and I've done it before. Or if you prefer to do it yourselves, that's totally fine too Either way works

For chess: My username is Halil214  Really excited to play :D
- **2025-06-03** @shrimpmode: OK, please do handle the CVE request then.
- **2025-06-03** @oblivionsage: Hi @shrimpmode ,

Just submitted the CVE request and used this report as reference, so I'll need to make it public for MITRE to see

Publishing now  thanks for everything!

@oblivionsage
- **Agreed On Going Public**
- **Report Became Public**
