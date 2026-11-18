---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - vuln/xss-stored
  - vuln/xss
  - impact/credential-theft
  - trigger/victim-interaction
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2018-07-09
submitted: 2018-04-04T18:48:34.636Z
bounty_usd: 256
votes: 19
cve: []
program: "[[programs/discourse|Discourse]]"
reporter: "luigigubello"
source: "https://hackerone.com/reports/333507"
title: "Stored XSS in 'post last edited' option"
---
# Stored XSS in "post last edited" option

> **Severity:** High | **Bounty:** 256 USD | **Votes:** 19 | **Program:** Discourse | **Disclosed:** 2018-07-09

- Report: [https://hackerone.com/reports/333507](https://hackerone.com/reports/333507)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2018-04-04T18:48:34.636Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

1. There are two users: **Attacker** and **Victim**.
2. **Attacker** starts a private talk via private message with the **Victim**.
3. **Attacker** send a message to **Victim**, then he edits it or deletes it.
4. **Victim** sees the *yellow pencil*, symbol of the edit.
5. **Victim** clicks on *yellow pencil* to see the edit and the XSS runs.

Other info: the XSS also runs on topic (video PoC #2). You can find my XSS message on this URL:
https://try.discourse.org/t/recommended-reading-for-community-and-foss-enthusiasts/278
It is very dangerous because it can hit many users at the same time.

## Impact

XSS can use to steal cookies, password or to run arbitrary code on victim's browser

The hacker selected the **Cross-site Scripting (XSS) - Stored** weakness. This vulnerability type requires contextual information from the hacker. They provided the following answers:

**URL**
https://try.discourse.org/t/recommended-reading-for-community-and-foss-enthusiasts/278

**Verified**
Yes

## Timeline

- **Report Filed**
- **2018-04-05** @luigigubello: Sorry, the first URL doesn't work now because a deleted reply on Discourse vanishes after 24h. So, you can try this:
https://try.discourse.org/t/recommended-reading-for-community-and-foss-enthusiasts/278/6

The last reply on topic, it has a image of Milhouse. You click on yellow pencil and an prompt box appears.
- **Report Needs More Info**
- **Report New**
- **2018-04-06** @luigigubello: Hi @joystick ,

A new video PoC attached and a new URL (it can be vanished soon, see the last reply with Simpson image):
https://try.discourse.org/t/the-room-appreciation-topic/289/6

Steps:
1) An user replies in a topic, he uploads an image and he writes a XSS payload like title.
2) He deletes his reply and then he restores his reply.
3) Now if you click on yellow pencil to see the user's changes an alert box appears.
- **Report Triaged**
- **Report Severity Updated**
- **2018-04-14** @luigigubello: Hi,
Any news?
- **2018-04-15** @luigigubello: Hi, 

I see that the vulnerability has been fixed in Discourse 2.0.0 beta6 :) however, it is present in Discourse 1.9 and probably in versions lower than 2.0.0 beta6. Sorry, in the first post I did not write the version.

Best regards
- **Report Resolved**
- **2018-04-16** @luigigubello: @discourse_team thank you for the link to the fix! Very fast :)
- **Bounty Awarded**
- **2018-04-18** @luigigubello: Can we disclose it? :)
- **Agreed On Going Public**
- **2018-06-28** @discourse_user: probably ok
- **Report Became Public**
