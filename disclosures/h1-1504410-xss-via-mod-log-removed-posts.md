---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2022-03-10
submitted: 2022-03-09T00:56:21.837Z
bounty_usd: null
votes: 218
cve: []
program: "[[programs/reddit|Reddit]]"
reporter: "ahacker1"
source: "https://hackerone.com/reports/1504410"
title: "XSS via Mod Log Removed Posts"
---
# XSS via Mod Log Removed Posts

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 218 | **Program:** Reddit | **Disclosed:** 2022-03-10

- Report: [https://hackerone.com/reports/1504410](https://hackerone.com/reports/1504410)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2022-03-09T00:56:21.837Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
I have discovered an XSS vulnerability regarding the mod notes feature. Specifically, the XSS payload executes when the victim removes a post in a subreddit and opens up the mod notes of the attacker.

## Steps To Reproduce:

1. The attacker creates a new post with the title containing the XSS payload.
2. The victim (mods of the subreddit) then must remove your post.
3. The payload executes when a victim (subreddit mod) opens up your mod notes. Sometimes, the mod notes are displayed when the victim hovers on your profile (this is true when a recent mod action has been taken on the user). 

## Supporting Material/References:

█████
█████

## Impact

Impact Below:

## Timeline

- **2022-03-09** @ahacker1: Subreddit moderators are the affected users of this vulnerability, making the vulnerability severe because subreddit moderators (particularly ones in large subreddits) can perform many critical actions (such as deleting posts, deleting subreddits and more/..). In addition, an attacker could also steal PII from the victim such as their email address.
- **Report Title Updated**
- **2022-03-09** @ahacker1: Sorry, for the above post, I meant by the mod log feature.
- **2022-03-09** @ahacker1: I have also discovered that stickying posts also produce the same vulnerability.
Clarification for step #3:
The attacker must hover over your profile, then click the user mod log to access the mod log (and for the payload to execute).
- **Report Filed**
- **2022-03-09** @les_oeufs: Hey @ahacker1, awesome find! I've confirmed this on my side and I've located the line of code that most likely is the root cause of this vulnerability. I'm going to contact the product team about this and I'll get back to you :)
- **Report Triaged**
- **Bounty Awarded**
- **2022-03-09** @les_oeufs: @ahacker1 So we just shipped a fix for this! Appreciate if you could retest to make sure XSS still isn't possible, and confirm there's no other bypass. Thanks!
- **2022-03-09** @ahacker1: Yes, I can confirm that the vulnerability has been patched, as angle brackets are properly escaped.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2022-03-10** @ahacker1: Oops, I forgot to add that the attachments should be redacted. Thanks!
- **2022-03-10** @les_oeufs: Done! Sorry I should have caught that as well :)
