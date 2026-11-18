---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/web
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
body: true
date: 2018-07-31
submitted: 2017-06-19T00:48:58.888Z
bounty_usd: null
votes: 6
cve: []
program: "[[programs/gocd|GoCD]]"
reporter: "4cad"
source: "https://hackerone.com/reports/241244"
title: "Spring security configuration allows agent sessions to be hijacked"
---
# Spring security configuration allows agent sessions to be hijacked

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 6 | **Program:** GoCD | **Disclosed:** 2018-07-31

- Report: [https://hackerone.com/reports/241244](https://hackerone.com/reports/241244)
- CWE: Improper Authentication - Generic
- Submitted: 2017-06-19T00:48:58.888Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Summary
=======
If agents have successfully logged in, then unauthenticated requests to /go/agent-websocket or /go/remoting/* will randomly succeed sometimes.

Description
========

The deprecated X509ProcessingFilter apparently does not work without a HttpSessionContextIntegrationFilter earlier on the chain. After a successful authentication it sets a thread-local security context that never gets cleared - meaning that future requests on /go/remoting or /go/agent-websocket will successfully authenticate if they randomly happen to be processed by one of the threads which has a valid security context.

Steps to Reproduce
=======
1) Start up a server.
2) Run the following command a bunch of times. It should always return a 403 Forbidden

 "curl http://localhost:8153/go/remoting/api/admin/config.xml | grep -B 2 Error"

3) Start up an agent, and wait about two minutes
4) Repeat the command from step 2. It should occasionally return a 500 Server Error. This happens when the request was successfully authenticated, and then fails in the GoCD code that is handling the request.

If the server has any artifacts, the URL from step (2) can be changed to a path to that URL. In this case it will sometimes return 403 Forbidden, and sometimes return the artifact itself. 

Risk
========

This allows an attacker without any credentials to read all artifacts or even upload artifacts (combined with #240198 they could use this to execute a stored XSS). While preparing this ticket, I was able to successfully upload a stored XSS file without any credentials by submitting a bunch of POST requests to http://localhost:8153/go/remoting/files/up42/1/up42_stage/1/up42_job/attack_unauthenticated.html

This is also really easy to discover - I stumbled across it when I noticed some requests were randomly being denied as unauthorized. It turns out all of my requests should have been unauthorized!

Recommended Fix
========
Add httpSessionContextIntegrationFilter immediately before x509ProcessingFilter in the acegi-security.xml file, for the /remoting/ and /agent-websocket/ entries.

This fixes it because the httpSessionContextIntegrationFilter clears the thread-local security context after each request, thus fixing the problem.

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **2017-06-19** @4cad: I will give you a break after this one :)
- **2017-06-19** @maheshp: Adding the HttpSessionContextIntegrationFilter to the filter chain makes sense. We will be fixing this and share an experimental build.
- **2017-06-19** @4cad: Sounds good - feel free to give me the pull request if it is easier, I can build it myself
- **2017-06-20** @maheshp: As per your suggestion added HttpSessionContextIntegrationFilter to the filter chain. Can you please verify the changes [1].

[1] https://github.com/gocd/gocd/pull/3597
- **2017-06-20** @4cad: I just verified the bug by testing before and after the fix - looks like the fix works!
- **Report Resolved**
- **Agreed On Going Public**
- **2018-07-02** @nyuday: Absolutely! If you have a chance, could you give us a link to the post when you publish it - we might be able to help share it too.
- **2018-07-02** @ketan: @4cad — do you want me to set the status of this ticket to "Disclose publicly" right away, or after you're done with the blog post?
- **2018-07-04** @4cad: Thanks! @ketan

That is a good idea - I will let you know when the blog is ready. This is my first blog post, so I appreciate the help.
- **Report Became Public**
