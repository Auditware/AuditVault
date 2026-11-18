---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-authentication-generic
  - env/web
substate: "informative"
weakness: "Improper Authentication - Generic"
enriched: true
body: true
date: 2021-10-21
submitted: 2021-06-22T12:54:48.583Z
bounty_usd: null
votes: 8
cve: []
program: "[[programs/reddit|Reddit]]"
reporter: "0xcharan"
source: "https://hackerone.com/reports/1241116"
title: "hardcoded api secret & api key in com.reddit.frontpage"
---
# hardcoded api secret & api key in com.reddit.frontpage

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 8 | **Program:** Reddit | **Disclosed:** 2021-10-21

- Report: [https://hackerone.com/reports/1241116](https://hackerone.com/reports/1241116)
- CWE: Improper Authentication - Generic
- Submitted: 2021-06-22T12:54:48.583Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

hi security team,
in file Resources/Resources.arsc/res/values/strings.xml
i have found
<string name="twitter_consumer_key">███</string>
<string name="twitter_consumer_secret">███</string>

It shouldn't be disclosed to third parties it meant for deveoplers as per https://developer.twitter.com/en/docs/authentication/oauth-2-0/bearer-tokens

poc:-
curl --user "██████:███"  --data 'grant_type=client_credentials' 'https://api.twitter.
com/oauth2/token'

response:-
{"token_type":"bearer","access_token":"████"}

it meant to request successful as official docs say https://developer.twitter.com/en/docs/authentication/oauth-2-0/bearer-tokens

## Impact

leakage of twitter_consumer_key and twitter_consumer_secret to public it meant for deveoplers only

## Timeline

- **Report Filed**
- **2021-06-22** @0xcharan: Impact:-by this attacker can get access to developer twitter account
- **2021-06-23** @0xcharan: Hi security team any update on my report ?
- **Report Informative**
- **Agreed On Going Public**
- **2021-08-15** @0xcharan: hi @gunther_reddit i hope you are fine can we disclose this report so others can be aware of this
regards
falcon_319
- **Agreed On Going Public**
- **Report Became Public**
