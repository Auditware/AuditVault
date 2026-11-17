---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - env/web
substate: "resolved"
weakness: null
enriched: true
date: 2017-09-15
submitted: 2017-06-05T10:28:51.711Z
bounty_usd: null
votes: 31
cve: []
program: "[[programs/automattic|Automattic]]"
reporter: "b258ea62bf297b02afa9854"
source: "https://hackerone.com/reports/236552"
title: "Unauthenticated RCE in Vaultpress"
---
# Unauthenticated RCE in Vaultpress

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 31 | **Program:** Automattic | **Disclosed:** 2017-09-15

- Report: [https://hackerone.com/reports/236552](https://hackerone.com/reports/236552)
- CWE: N/A
- Submitted: 2017-06-05T10:28:51.711Z

## Timeline

- **Report Filed**
- **2017-06-05** @xknown: Hi. Thanks for the report. We are going to take a look.
- **Report Resolved**
- **2017-06-08** @b258ea62bf297b02afa9854: Great, regarding this issue everything seems fine now. I can see the update process towards the clients goes quite fast. Any toughs/previous practices from your side regarding possible future disclosure and possible bounty?
- **Bounty Awarded**
- **2017-06-09** @b258ea62bf297b02afa9854: Thx for the bounty, tough it was more worth than reflected XSS due its existence in security plugin, but it is your decision. When update completes on wordpress.org I'll request disclosure. :)
- **2017-06-12** @b258ea62bf297b02afa9854: Extra from my side, another type of bypass / attack against this method in order to get the wanted RCE :) :

```
if ( $sig[0] === $signature )
			return true;
```
here we have classic timing attack (effective because its goal - RCE ) and should be replaced with:

```
if ( hash_equals($signature, $sig[0]))
			return true;
```
- **2017-06-13** @xknown: Hi. Yes, we are aware of it. I'll ping again the VaultPress team to see if they can also fix this issue.
- **2017-06-13** @b258ea62bf297b02afa9854: well, isn't 32 byte lenght (~50-100k requests to be defeated, worst case ~400k for md5), but exists and bad thing here is that isn't time limited e.g. could be solved piece by piece in quite big time interval.
- **2017-06-28** @thingalon: Thank you. This fix has been applied to trunk, and will be released with the next version of VaultPress soon.
- **2017-06-30** @b258ea62bf297b02afa9854: +1
- **Agreed On Going Public**
- **Report Became Public**
