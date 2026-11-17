---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/privacy-violation
  - env/mobile
  - os/android
substate: "resolved"
weakness: "Privacy Violation"
enriched: true
date: 2017-11-15
submitted: 2017-11-09T20:52:38.854Z
bounty_usd: null
votes: 31
cve: []
program: "[[programs/irccloud|IRCCloud]]"
reporter: "bagipro"
source: "https://hackerone.com/reports/288955"
title: "[IRCCloud Android] Theft of arbitrary files leading to token leakage"
---
# [IRCCloud Android] Theft of arbitrary files leading to token leakage

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 31 | **Program:** IRCCloud | **Disclosed:** 2017-11-15

- Report: [https://hackerone.com/reports/288955](https://hackerone.com/reports/288955)
- CWE: Privacy Violation
- Submitted: 2017-11-09T20:52:38.854Z

## Timeline

- **Report Filed**
- **2017-11-10** @bagipro: Forgot to attach PoC APK in the previous message
- **Report Triaged**
- **Report Needs More Info**
- **Report Triaged**
- **Bounty Awarded**
- **2017-11-15** @bagipro: Hi, I believe it's fixed, attacker has no ability anymore to use path traversal to specify output directory. 
https://github.com/irccloud/android/blob/master/src/com/irccloud/android/activity/MainActivity.java#L3710
This check (and similar too) does nothing, because it should get canonical path, but no absolute. It can be bypassed like so:
```
/data/data/./com.irccloud.android/
```
(and even if you change to canonical path, it can be bypassed via symlinks)

But it doesn't matter, because all slashes are replaced
https://github.com/irccloud/android/blob/master/src/com/irccloud/android/activity/MainActivity.java#L3737

Let's disclose my King Zaheck! ;)
- **Report Resolved**
- **Agreed On Going Public**
- **2017-11-15** @bagipro: Can you please update title from ``` Theft or ``` to ``` Theft of ```? It's a typo
- **Report Title Updated**
- **Agreed On Going Public**
- **Report Became Public**
- **2018-04-11** @bagipro: @jwheare 
I would suggest to add more protections. Attacker still able to upload protected files to public chats where they are available for everyone. Please validate the given uri and don't run
```java
 InputStream is = IRCCloudApplication.getInstance().getApplicationContext().getContentResolver().openInputStream(fileUri);
```
until you're sure the canonical file and all symlinks are not pointing to your internal files (or simply disallow use of symlinks, because normal apps don't use them)
- **2018-04-11** @jwheare: How does this change seem to you? https://github.com/irccloud/android/commit/4eb1facf3101312e3ed5856318ba6169be8c1322
- **2018-04-11** @bagipro: @jwheare 
Seems a good whitelist for ``` /data/data/com.irccloud.android/cache/* ```. Thanks!
