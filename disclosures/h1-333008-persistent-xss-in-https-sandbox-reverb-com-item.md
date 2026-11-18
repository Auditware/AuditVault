---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2018-05-06
submitted: 2018-04-03T20:49:11.135Z
bounty_usd: null
votes: 36
cve: []
program: "[[programs/reverb|Reverb.com]]"
reporter: "bigshaq"
source: "https://hackerone.com/reports/333008"
title: "Persistent XSS in https://sandbox.reverb.com/item/"
---
# Persistent XSS in https://sandbox.reverb.com/item/

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 36 | **Program:** Reverb.com | **Disclosed:** 2018-05-06

- Report: [https://hackerone.com/reports/333008](https://hackerone.com/reports/333008)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2018-04-03T20:49:11.135Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

# Description
I found a Persistent XSS in a listing page. The flaw is in the SoundCloud link that the listing owner can attach(The parameter is called *product[soundcloud_link_attributes][link]*). There's no encoding on the user input and it looks like there's only client-side validation.

# PoC
The payload:
```
https://soundcloud.com/rich-the-kid/sets/the-world-is-yours-15?fuzzing" onload=alert(document.domain) x="
```
If you try to put this payload straight into the "Edit Listing" page it'll give you the following error:
```
https://sandbox.reverb.com/listings/[YOUR_LISTING_ID]/edit
```
{F281627}

But it looks like there's only client side validation, when I tried to enter a valid link:
```
https://soundcloud.com/rich-the-kid/sets/the-world-is-yours-15
```
I got no error message(because it was a valid link)
But when I clicked "Save & Review Listing", intercepted the request and tampered the *product[soundcloud_link_attributes][link]* parameter's value to:
```
https://soundcloud.com/rich-the-kid/sets/the-world-is-yours-15?fuzzing" onload=alert(document.domain) x="
```
It updated successfully and because there's no encoding on this input parameter - it allowed me to inject javascript code that'll be stored on my listing page.
{F281640}

PoC Video: https://youtu.be/Y-8W422hLOw

## Impact

An attacker can:
* Perform a defacement on every possible store in the website (all he need is a single click from the victim)
* Deny future access from any other shop owner that access this listing(with the self-PXSS that i reported 2 days ago: https://hackerone.com/reports/331725 )
*  Perform operations in the application on behalf of the victim

The hacker selected the **Cross-site Scripting (XSS) - Stored** weakness. This vulnerability type requires contextual information from the hacker. They provided the following answers:

**URL**
https://sandbox.reverb.com/item/

**Verified**
Yes

## Timeline

- **Report Filed**
- **Report Triaged**
- **Bounty Awarded**
- **2018-04-04** @bigshaq: Thanks for the bounty! (:
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
