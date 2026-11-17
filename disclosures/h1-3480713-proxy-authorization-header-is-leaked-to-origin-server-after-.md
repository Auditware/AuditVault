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
