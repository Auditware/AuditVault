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

## Timeline

- **Report Filed**
- **Report Triaged**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
