---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/http-request-smuggling
  - env/web
substate: "resolved"
weakness: "HTTP Request Smuggling"
enriched: true
date: 2020-07-02
submitted: 2020-05-07T10:07:59.993Z
bounty_usd: null
votes: 300
cve: []
program: "[[programs/helium|Helium]]"
reporter: "dracomalfoy"
source: "https://hackerone.com/reports/867952"
title: "HTTP request Smuggling"
---
# HTTP request Smuggling

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 300 | **Program:** Helium | **Disclosed:** 2020-07-02

- Report: [https://hackerone.com/reports/867952](https://hackerone.com/reports/867952)
- CWE: HTTP Request Smuggling
- Submitted: 2020-05-07T10:07:59.993Z

## Timeline

- **Report Filed**
- **2020-05-11** @dracomalfoy: Hi Team,
Any updates on this ?
- **Report Triaged**
- **2020-05-11** @victormu: Hi there, thanks for this interesting bug submission. Would you be able to explain how this bug would be exploited on console.helium.com, with a use case? Your second request goes to a separate subdomain, which does not in itself present any risks to console.
- **2020-05-12** @dracomalfoy: Well, i choosed the second domain because i want to make the defferences between smuggled request and the original request clear. We can change the host header to the "console.helium.com" and we will get the response of that subdomain.
As i had already mentioned in Impact, this could lead to serious exploitations like session hijacking, priviledge escalation, cache poisoning etc. It can expose the front-end header rewriting. And the most dangerous part is that attacker does not need the victim to take any action. Victim will be unaware of any attack.
Here is an article ablout it by James kettle.
https://portswigger.net/research/http-desync-attacks-request-smuggling-reborn
- **2020-05-13** @victormu: so what is the expected fix in your opinion? we use cloudflare which is already supposed to rewrite headers to prevent situations like this.
- **2020-05-13** @dracomalfoy: HTTP request smuggling vulnerabilities arise in situations where a front-end server forwards multiple requests to a back-end server over the same network connection, and the protocol used for the back-end connections carries the risk that the two servers disagree about the boundaries between requests. Some generic ways to prevent HTTP request smuggling vulnerabilities arising are as follows:

1. Disable reuse of back-end connections, so that each back-end request is sent over a separate network connection.
2. Use HTTP/2 for back-end connections, as this protocol prevents ambiguity about the boundaries between requests.
3. Use exactly the same web server software for the front-end and back-end servers, so that they agree about the boundaries between requests. 

In some cases, vulnerabilities can be avoided by making the front-end server normalize ambiguous requests or making the back-end server reject ambiguous requests and close the network connection. However, these approaches are potentially more error-prone than the generic mitigations identified above.

Source : https://portswigger.net/web-security/request-smuggling
- **2020-05-15** @victormu: can you make a smuggled request that doesn't use a second domain, but uses console.helium.com for the second request instead? I don't believe it will work
- **2020-05-17** @dracomalfoy: hi @victormu ,
I cant found the login request to console.helium.com. I think the endpoint is changed to auth.helium.com. But i manually crafted the request. Same behavior can be observed here.
- **2020-05-26** @dracomalfoy: Hi team,
It is almost 2 weeks since the submission was triaged. 
Any updates on status?
- **Bounty Awarded**
- **Report Resolved**
- **2020-06-02** @dracomalfoy: Thanks very much Helium Team.
- **Agreed On Going Public**
- **Report Became Public**
