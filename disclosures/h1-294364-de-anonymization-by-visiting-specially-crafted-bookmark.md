---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
date: 2018-07-03
submitted: 2017-12-02T00:41:24.597Z
bounty_usd: null
votes: 15
cve: []
program: "[[programs/torproject|Tor]]"
reporter: "qab"
source: "https://hackerone.com/reports/294364"
title: "De-anonymization by visiting specially crafted bookmark."
---
# De-anonymization by visiting specially crafted bookmark.

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 15 | **Program:** Tor | **Disclosed:** 2018-07-03

- Report: [https://hackerone.com/reports/294364](https://hackerone.com/reports/294364)
- CWE: Information Disclosure
- Submitted: 2017-12-02T00:41:24.597Z

## Timeline

- **Report Filed**
- **2017-12-02** @qab: The URL should be 'about:memory?file=\\\localhost\\\q.json.gz' (two slashes each)
- **2017-12-04** @geko: Thanks for this report. This is https://bugzilla.mozilla.org/show_bug.cgi?id=1413868, I believe, and got reported to us a couple of weeks ago. We even paid a bug bounty for that one. The testcase you  have is interesting, though. I guess this is a Windows-only issue or did you get it or a similar trick on other systems to run as well?
- **2017-12-05** @qab: I only tested on windows so far, network drives may be supported on other OS's from a quick google search. I don't have access to the bug, so I hope this isn't a complete dupe and still worth something.
- **2017-12-06** @geko: Your bug seems to be a special case of the one reported at Mozilla: the possibility of proxy bypass via SMB URLs which the user gets to paste/bookmark etc (by social engineering). It's a dupe in the sense that the underlying problem is the same, your test case is different though.

I am not sure how I may reward you for that. I think a bounty is out of scope as we already paid a bounty for the underlying bug. What I can do right now is offering you a Tor t-shirt as a special thanks for your bug hunting. Would you want to get one? If so, please shoot me an email (gk[@]torproject[.]org without the brackets) and I'll put you in contact with the right folks.
- **2017-12-07** @qab: I understand. Thank you for the offer!
- **2017-12-07** @qab: May I get access to https://bugzilla.mozilla.org/show_bug.cgi?id=1413868? My bugzilla email is qab@ksu.edu
- **2017-12-07** @geko: Sure, I added you to the bug.
- **2017-12-07** @qab: Thanks! You can close this bug if you like.
- **Report Resolved**
- **Swag Awarded**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Not Eligible For Bounty**
