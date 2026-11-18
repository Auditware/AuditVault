---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-exposure-through-directory-listing
  - env/web
substate: "resolved"
weakness: "Information Exposure Through Directory Listing"
enriched: true
body: true
date: 2023-06-23
submitted: 2023-04-15T18:35:12.441Z
bounty_usd: null
votes: 13
cve: []
program: "[[programs/mars|Mars]]"
reporter: "mo3giza"
source: "https://hackerone.com/reports/1948562"
title: "Information Exposure Through Directory Listing"
---
# Information Exposure Through Directory Listing

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 13 | **Program:** Mars | **Disclosed:** 2023-06-23

- Report: [https://hackerone.com/reports/1948562](https://hackerone.com/reports/1948562)
- CWE: Information Exposure Through Directory Listing
- Submitted: 2023-04-15T18:35:12.441Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:

Directory listing is a web server function that displays the directory contents when there is no index file in a specific website directory. It is dangerous to leave this function turned on for the web server because it leads to information disclosure.

## Steps To Reproduce:

Go to this URL:  ███
You can see logs files
████
████████

## PoC:
```
██████████ - - [█████:████ +0000] "GET /api/live/ws HTTP/1.1" 400 3325 "-" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36"
█████ - - [█████:████ +0000] "GET /api/live/ws HTTP/1.1" 400 3325 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36"
█████ - - [██████████:██████████ +0000] "GET /api/live/ws HTTP/1.1" 400 872 "-" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36"
```
```
[███ █████ █████████████] [core:error] [pid 8186:tid 140028348987136] [client ███:47058] AH00126: Invalid URI in request GET /cgi-bin/.%2e/%2e%2e/%2e%2e/%2e%2e/%2e%2e/%2e%2e/%2e%2e/%2e%2e/%2e%2e/etc/hosts HTTP/1.1
[██████ ████████████ ██████████] [authz_core:error] [pid 8186:tid 140027803723520] [client ██████████:47426] AH01630: client denied by server configuration: proxy:███████████
[████ ████████████ ██████████] [ssl:error] [pid 11243:tid ████] [client ████████:42490] AH02042: rejecting client initiated renegotiation
[█████ ████ ████] [proxy:error] [pid 4547:tid 140029011683072] (111)Connection refused: AH00957: HTTP: attempt to connect to ████:3000 (████████████) failed
```

## Impact

Information Disclosure

## Timeline

- **Report Filed**
- **2023-04-16** @h1_analyst_layla: Hi █████ - I'm discussing this submission internally with the Mars team. You will be updated as soon as there is additional information to share. Thanks for your patience!

Regards,
████
- **2023-04-16** @mo3giza: Hi ███, 
Thanks for letting me know, i will be waiting for any updates.
Best regards.
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
