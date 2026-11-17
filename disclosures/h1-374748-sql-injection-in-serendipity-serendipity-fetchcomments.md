---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/sql-injection
  - env/web
substate: "resolved"
weakness: "SQL Injection"
enriched: true
date: 2018-11-09
submitted: 2018-06-30T15:34:42.642Z
bounty_usd: null
votes: 4
cve: []
program: "[[programs/hannob|Hanno's projects]]"
reporter: "bb9866f3f743d6bf69b6836"
source: "https://hackerone.com/reports/374748"
title: "SQL injection in Serendipity (serendipity_fetchComments)"
---
# SQL injection in Serendipity (serendipity_fetchComments)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 4 | **Program:** Hanno's projects | **Disclosed:** 2018-11-09

- Report: [https://hackerone.com/reports/374748](https://hackerone.com/reports/374748)
- CWE: SQL Injection
- Submitted: 2018-06-30T15:34:42.642Z

## Report summary

Bug in upstream Serendipity software, got fixed in version 2.1.3.

The impact is limited, as it requires a backend login. Still it's a great finding and many thanks to the reporter.

## Timeline

- **Report Filed**
- **2018-07-15** @bb9866f3f743d6bf69b6836: Hi @hannob, any update regarding this one? Should I report it directly to upstream?
- **Report Triaged**
- **2018-07-18** @hanno: This is now fixed with a patch I got from s9y's dev (as should be all other open issues).
I'd appreciate if you could check that and also look for further issues, s9y will soon release a security update.
- **2018-07-18** @bb9866f3f743d6bf69b6836: > Garvin (s9y dev) thinks this is a low impact issue, as it requires a logged in admin. 

I agree, even if it could still be exploited by chaining with #373950. 

> I'd appreciate if you could check that and also look for further issues, s9y will soon release a security update.

The fix (https://github.com/s9y/Serendipity/commit/1afc4d929d96e5bf63cafd4cb8155ca2fb4e8f5f#diff-2168c9599f249d04a7bda43923c908f2R104) looks good to me. I would also add a cast to https://github.com/s9y/Serendipity/blob/1afc4d929d96e5bf63cafd4cb8155ca2fb4e8f5f/include/functions_comments.inc.php#L471, just to be sure.
- **2018-07-20** @bb9866f3f743d6bf69b6836: Suggestion implemented in https://github.com/s9y/Serendipity/commit/005a86da1cacdfb579001d4ff9f85df16b4b5316#diff-e9913ab11efe99f0e30efb4d2f6fd2b9R471.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
