---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/cross-site-scripting-xss-stored
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
date: 2021-01-17
submitted: 2020-06-16T21:19:49.402Z
bounty_usd: null
votes: 16
cve: "CVE-2020-8288"
program: "[[programs/rocket_chat|Rocket.Chat]]"
reporter: "fabianfreyer"
source: "https://hackerone.com/reports/899954"
title: "XSS in message attachment fileds."
---
# XSS in message attachment fileds.

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 16 | **Program:** Rocket.Chat | **Disclosed:** 2021-01-17

- Report: [https://hackerone.com/reports/899954](https://hackerone.com/reports/899954)
- CWE: Cross-site Scripting (XSS) - Stored | CVE: CVE-2020-8288
- Submitted: 2020-06-16T21:19:49.402Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **2020-12-10** @markus-rocketchat: Hi @fabianfreyer 

we finally have a fix for it here: https://github.com/RocketChat/Rocket.Chat/pull/19817

if you have an opinion on it, we would be glad to hear your feedback

best
Markus
- **2020-12-10** @fabianfreyer: The patch merged in https://github.com/RocketChat/Rocket.Chat/pull/19817 is insufficient. The following payload still leads to XSS:
```json
{
    "channel": "#cookiesplz",
    "text": "Hi, I'd like a cookie please",
    "attachments": [
        {
            "text": "",
            "fields": [
                {
                    "type": "\"><img src=x onerror='alert(document.cookie);'/></div><div foo=\"",
                    "title": "",
                    "value": "",
                    "short": false
                }
            ]
        }
    ]
}
```
- **2020-12-10** @markus-rocketchat: thank you. I passed it to the team
- **2020-12-11** @fabianfreyer: Might I propose the attached patch to address this vulnerability? This does not rely on a potentially brittle RegExp-based custom HTML escaping function.
- **2020-12-11** @markus-rocketchat: Thanks a lot. We are discussing your suggestion
- **2020-12-15** @markus-rocketchat: Hi @fabianfreyer 

we have added another PR to the previous one: https://github.com/RocketChat/Rocket.Chat/pull/19854
but without creating elements. if you have any feedback, please let us know

thank you
- **2020-12-18** @fabianfreyer: While I could at the moment not find a way to circumvent this check, I very much agree with the comment by user234461 on the [StackOverflow answer] that proposes the same escape function:
> Manually adding a random subset of encodable characters is likely storing up trouble for yourself and your colleagues down the line. There should be a single authority for which characters should be encoded, probably the browser or failing that a specific library that's likely to be comprehensive and maintained.

From my point of view, this can be closed.

[StackOverflow answer]: https://stackoverflow.com/questions/18749591/encode-html-entities-in-javascript/39243641#39243641
- **Report Resolved**
- **Agreed On Going Public**
- **2020-12-18** @markus-rocketchat: yes, release is currently being built
- **Report Became Public**
