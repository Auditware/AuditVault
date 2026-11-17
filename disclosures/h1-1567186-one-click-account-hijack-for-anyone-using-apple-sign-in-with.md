---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
date: 2022-08-02
submitted: 2022-05-12T14:03:26.715Z
bounty_usd: null
votes: 510
cve: []
program: "[[programs/reddit|Reddit]]"
reporter: "fransrosen"
source: "https://hackerone.com/reports/1567186"
title: "One-click account hijack for anyone using Apple sign-in with Reddit, due to response-type switch + leaking href to XSS on www.redditmedia.com"
---
# One-click account hijack for anyone using Apple sign-in with Reddit, due to response-type switch + leaking href to XSS on www.redditmedia.com

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 510 | **Program:** Reddit | **Disclosed:** 2022-08-02

- Report: [https://hackerone.com/reports/1567186](https://hackerone.com/reports/1567186)
- CWE: Improper Access Control - Generic
- Submitted: 2022-05-12T14:03:26.715Z

## Timeline

- **Report Filed**
- **2022-05-12** @les_oeufs: Great find, writeup and showing full impact! We agree this is a critical, and have a general idea how to prevent this. I'm sending this over to the proper dev team and I'll keep you posted.
- **Report Triaged**
- **2022-05-12** @les_oeufs: There is a bit more at play here, but we feel limiting to an approved list of GTM ids (that we own via our Google Tag Manager account) will prevent this vulnerability at its core. Seems like the biggest issue here is us allowing user controlled GTM ids to be loaded in redditmedia.com?
- **2022-05-12** @fransrosen: Yes, that's a great first step, I agree! That will limit the attacker from initiating the XSS on redditmedia.com which is the reason it can reach `frames[1].window.name` in the main window from the attacker window.

Thank you for a super quick response!

Regards,
Frans
- **Bounty Awarded**
- **2022-06-02** @fransrosen: Thanks a lot!
- **2022-06-07** @les_oeufs: Fix went out this afternoon, so when you get the chance mind confirming the fix? It's mainly around restricting the GTM ids.
- **2022-06-07** @fransrosen: Hi,
Yes, I can confirm the restrict is now in place for GTM-ids! This prevents me from running my own GTM-ID in my own iframe to utilize the XSS to reach the `window.name` of the redditmedia-iframe in the Reddit-main window.

There might still be vulnerable listeners loaded by your own GTM-ids that could potentially give access to the `window.name` of the redditmedia-iframe, but none of the ones I saw now and tested on `GTM-5XVNS82` had any issues as I could see.

Maybe a good thing would be to empty out `search` and `hash` (And also remove those from `href`) from the `window.name` sent to the redditmedia-iframe? Then having a vulnerable listener in your GTM would not leak any params.

Regards,
Frans
- **2022-06-07** @les_oeufs: Are you talking about removing search, hash, and other params from window.name sent to redditmedia from external domains?
- **2022-06-07** @fransrosen: I was thinking of always removing them, so `www.reddit.com` never exposes any fragment or query params down to `www.redditmedia.com`. But maybe they are used for analytics or similar? I'm guessing the problem can be avoided in different ways:

1. Use a separate redirect_uri for all "sign in with"-solutions, so none of those solutions can end up on a page that renders redditmedia-iframe. And/or:
2. Prevent leakage of OAuth-params to third parties by preventing those params from getting sent down to the redditmedia-frame completely. Then, none of the third party scripts loaded by redditmedia could access the OAuth-parameters using the `window.name` of the redditmedia-frame:
{F1761028}
- **2022-06-07** @les_oeufs: Ah that makes sense, I was trying to find where you were talking about the initial iframe on reddt.com loading redditmedia. I found where in the code base that is generated, its rather old code, but I think if we try to either blocklist certain params specific to SSO (might be easiest to list these) or allowlist important ones for analytics (possibly harder to quantify). 

Little snippet attached of where I think the culprit exists. I will have to knock on some devs doors to get some extra eyes on this. But I agree this is important to limit in case any sort of XSS is found in the future on redditmedia.com.
- **2022-07-27** @les_oeufs: @fransrosen Looks like we finally got a fix out for the google tag manager iframe and are sanitizing what parameters it is pulling to clean out any problematic oauth2 params.
- **2022-07-29** @fransrosen: Hi @les_oeufs,

Nice, I can see this:

```js
d = new URLSearchParams(location.search);
        ["code", "access_token", "state", "refresh_token", "id_token"].forEach((function(e) {
            d.delete(e)
        }
        ));
        var c = d.toString()
          , f = "" + location.origin + location.pathname + (c ? "?" + c : "")
          , p = t.getLocation = function() {
            return {
                href: f,
                hostname: location.hostname,
                origin: location.origin,
                pathname: location.pathname || "/",
                search: c,
                hash: location.hash.replace(/^#/, "")
            }
        }
```

However, remember that for both `access_token` and `id_token`, they will be a part of `location.hash` and not `location.search`, like this:

```
https://www.reddir.com/#access_token=xxx&id_token=zzz
```
And those doesn't seem to be filtered:
{F1843747}

Hope this helps,

Regards,
Frans
- **2022-08-01** @les_oeufs: Hey @fransrosen, we pushed a fix for the parts after the hash still leaking through. We should be good to go now. Let me know if there's anything you want redacted here, will try to aim for full disclosure, but can do limited if you prefer. :)
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
