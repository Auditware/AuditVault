---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-request-forgery-csrf
  - env/web
substate: "resolved"
weakness: "Cross-Site Request Forgery (CSRF)"
enriched: true
body: true
date: 2017-09-23
submitted: 2017-06-29T20:05:48.533Z
bounty_usd: null
votes: 29
cve: []
program: "[[programs/starbucks|Starbucks]]"
reporter: "jackb898"
source: "https://hackerone.com/reports/244504"
title: "Possible SOP bypass in www.starbucks.com due to insecure crossdomain.xml"
---
# Possible SOP bypass in www.starbucks.com due to insecure crossdomain.xml

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 29 | **Program:** Starbucks | **Disclosed:** 2017-09-23

- Report: [https://hackerone.com/reports/244504](https://hackerone.com/reports/244504)
- CWE: Cross-Site Request Forgery (CSRF)
- Submitted: 2017-06-29T20:05:48.533Z

## Report summary

Ah, my early reports. I've come quite a ways from reporting things before I understood exactly what they were. Nonetheless I got pretty creative here and recognized that a problem existed in this configuration, one that turned out to be a high impact problem. For web developers: *always* keep your crossdomain.xml allowed domains up to date if you have something other than wildcard allowed! Thank you to the Starbucks team for an efficient and helpful response.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello. I was penetration testing your website, and noticed that your crossdomain.xml file allowed many sites access. I went through and, for all the sites that had *.website.com with them, I scanned them for subdomains.

I found that a subdomain for ███████.com (a site in your crossdomain.xml as *███████), m███████, was vulnerable to takeover. 

I'm not going to take it over since they do not have a white hat hacker program, but if someone were to take it over, they could make flash files on it to retrieve sensitive information from starbucks.com, and do it with no issue. Another factor that makes it even worse is that it's possible to use any headers also (<allow-http-request-headers-from domain="*" headers="*"/>).

It's similar to if your site had this line in the crossdomain.xml: <allow-access-from domain="*" />

SCENARIO:
This is a scenario of how it would most likely be exploited
1. A black hat is trying to hack into Starbucks
2. He goes to the crossdomain.xml file looking for <allow-access-from domain="*" />, but he notices lots of different websites are allowed access
3. He decides to check the domains with *. before them for vulnerable subdomains
4. He finds m██████, and notices *███████ has access
5. He takes over m██████ and uploads a malicious flash file to send HTTP requests and see their responses. 


HOW TO FIX THIS
Pretty simple, obvious fix, but you have two routes you can take for it.
First option: You can just remove <allow-access-from domain="*████████" /> from your crossdomain.xml file. (I didn't find any other subdomains vulnerable to takeover that were in there)

Second option: You can talk to ███████, the company that owns █████.com, and tell them to disconnect the DNS records linking m████████ and m██████.███

MORE INFORMATION
Here is more information on how it could be exploited: http://resources.infosecinstitute.com/bypassing-csrf-protections-fun-profit/ (read between Abusing CORS via Flash Files down to Bypassing XMLHttpRequest Header Validation)



Thanks,
Jack

## Timeline

- **Report Filed**
- **2017-06-29** @joystick: Hi,

Thank you for your submission. We are investigating your report, and will let you know if we have any questions. We appreciate your assistance and cooperation. 

Regards.
- **Report Vulnerability Types Updated**
- **Report Title Updated**
- **Report Title Updated**
- **2017-06-30** @jackb898: Thanks for fixing the title. I really didn't know how to describe or categorize it.
- **Report Triaged**
- **2017-07-01** @jackb898: Great, thanks. I'll be offline for about 2 weeks beginning tomorrow in case you're trying to ask me anything.
- **Bounty Awarded**
- **2017-07-15** @jackb898: Thanks for the bounty! May we disclose this after the entry is removed?
- **2017-08-02** @jackb898: Just curious if you have an estimated time of removing the crossdomain entry?
- **2017-08-08** @siren: Hi @kicker,

I'm expecting a release to address this very soon and will provide another update as soon as I have confirmation it has been deployed.
Once this is closed out we can disclose.

Thanks!
- **2017-08-24** @jackb898: Hello, I see you've updated the crossdomain.xml files across your domains. That should resolve the issue as far as I can tell.
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
- **Report Severity Updated**
- **Report Severity Updated**
- **Changed Scope**
