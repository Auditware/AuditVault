---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-request-forgery-csrf
  - env/cloud
  - stack/kubernetes
substate: "resolved"
weakness: "Cross-Site Request Forgery (CSRF)"
enriched: true
date: 2024-01-29
submitted: 2024-01-19T08:16:14.091Z
bounty_usd: 4660
votes: 34
cve: []
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "tint0"
source: "https://hackerone.com/reports/2326194"
title: "Argo CD CSRF leads to Kubernetes cluster compromise"
---
# Argo CD CSRF leads to Kubernetes cluster compromise

> **Severity:** High | **Bounty:** 4,660 USD | **Votes:** 34 | **Program:** Internet Bug Bounty | **Disclosed:** 2024-01-29

- Report: [https://hackerone.com/reports/2326194](https://hackerone.com/reports/2326194)
- CWE: Cross-Site Request Forgery (CSRF)
- Submitted: 2024-01-19T08:16:14.091Z

## Report summary

Cross-Site Request Forgery (CSRF) in github.com/argoproj/argo-cd 
CVE-2024-22424
Severity: High

Impact
The Argo CD API prior to versions 2.10-rc2, 2.9.4, 2.8.8, and 2.7.16 are vulnerable to a cross-server request forgery (CSRF) attack when the attacker has the ability to write HTML to a page on the same parent domain as Argo CD.

A CSRF attack works by tricking an authenticated Argo CD user into loading a web page which contains code to call Argo CD API endpoints on the victim’s behalf. For example, an attacker could send an Argo CD user a link to a page which looks harmless but in the background calls an Argo CD API endpoint to create an application running malicious code.

Argo CD uses the “Lax” SameSite cookie policy to prevent CSRF attacks where the attacker controls an external domain. The malicious external website can attempt to call the Argo CD API, but the web browser will refuse to send the Argo CD auth token with the request.

Many companies host Argo CD on an internal subdomain, such as https:// argo-cd.internal.example.com. If an attacker can place malicious code on, for example, https:// test.internal.example.com/, they can still perform a CSRF attack. In this case, the “Lax” SameSite cookie does not prevent the browser from sending the auth cookie, because the destination is a parent domain of the Argo CD API.

Browsers generally block such attacks by applying CORS policies to sensitive requests with sensitive content types. Specifically, browsers will send a “preflight request” for POSTs with content type “application/json” asking the destination API “are you allowed to accept requests from my domain?” If the destination API does not answer “yes,” the browser will block the request.

Before the patched versions, Argo CD did not validate that requests contained the correct content type header. So an attacker could bypass the browser’s CORS check by setting the content type to something which is considered “not sensitive” such as “text/plain.” The browser wouldn’t send the preflight request, and Argo CD would happily accept the contents (which are actually still JSON) and perform the requested action (such as running malicious code).

Full GHSA: https://github.com/argoproj/argo-cd/security/advisories/GHSA-92mw-q256-5vwg

https://blog.calif.io/p/argo-cd-csrf

## Timeline

- **Report Filed**
- **Report Triaged**
- **2024-01-29** @kunderkoffler: FYI, I've reached out to the project maintainers for modifier confirmation. Will wrap everything up after their response.
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **2024-01-29** @tint0: Appreciate it @kunderkoffler!
- **Agreed On Going Public**
- **Report Became Public**
