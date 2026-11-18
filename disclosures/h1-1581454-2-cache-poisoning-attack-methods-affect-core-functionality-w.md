---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
  - vuln/dos
substate: "informative"
weakness: null
enriched: true
body: true
date: 2022-06-06
submitted: 2022-05-25T22:45:22.485Z
bounty_usd: null
votes: 7
cve: []
program: "[[programs/exodus|Exodus]]"
reporter: "setiawan_"
source: "https://hackerone.com/reports/1581454"
title: "2 Cache Poisoning Attack Methods Affect Core Functionality www.exodus.com"
---
# 2 Cache Poisoning Attack Methods Affect Core Functionality www.exodus.com

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 7 | **Program:** Exodus | **Disclosed:** 2022-06-06

- Report: [https://hackerone.com/reports/1581454](https://hackerone.com/reports/1581454)
- CWE: N/A
- Submitted: 2022-05-25T22:45:22.485Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
www.exodus.com hosts static js and css files on Server: cloudflare . Which is cached by cloudflare and passed to all other users accessing the source. I was able to impact the core functionality by using a custom HTTP. Here are 2 details of the Bug.

## Steps To Reproduce:

**1. 501 Not Implemented**

At https://www.exodus.com/, I was able to impact core functionality by using an invalid custom HTTP header to replace the JavaScript file from https://www.exodus.com/webpack-runtime-d5cfa86b8e358efc5db3-v2.js with message '501 Not Implemented'.

```
ERROR /webpack-runtime-d5cfa86b8e358efc5db3-v2.js?cachebust=exodus HTTP/1.1
Host: www.exodus.com
```
```
CRASH /webpack-runtime-d5cfa86b8e358efc5db3-v2.js?cachebust=exodus HTTP/1.1
Host: www.exodus.com
```

Response :
```
HTTP/1.1 501 Not Implemented
Date: Wed, 25 May 2022 22:07:00 GMT
Content-Length: 0
Connection: keep-alive
Expect-CT: max-age=604800, report-uri="https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct"
Strict-Transport-Security: max-age=15552000; includeSubDomains; preload
Set-Cookie: __cfruid=5132a5357442dd861d107824c86a39a95057bcaf-1653516420; path=/; domain=.exodus.com; HttpOnly; Secure; SameSite=None
Server: cloudflare
CF-RAY: 711194da3f3fa131-SIN
```
( HTTP ) My custom CRASH & ERROR to fulfill a request does not work or is not found on the server this server establishes communication between the client and the server to be interrupted . Note that the CF-RAY value changes every time we send a request. CF-RAY is a hash value that encodes information about the data center and requests.

**2. Cache poisoning triggers Firewall Exodus**

When you poison a .js / .css file with additional 2 headers namely : x-rewrite-url & x-original-url it will trigger the exodus firewall rule.

GET request:
```
GET /webpack-runtime-d5cfa86b8e358efc5db3-v2.js?cachebust=exodus HTTP/1.1
Host: www.exodus.com
x-rewrite-url: /root
```
```
GET /webpack-runtime-d5cfa86b8e358efc5db3-v2.js?cachebust=exodus HTTP/1.1
Host: www.exodus.com
x-original-url: /root
```
Pay attention to the GET request. It looks different if you open the response in a browser, it will make a POST. Logically, if the POST, DELETE or PURGE methods are not allowed it will issue a response POST is not a valid request method ( 500 Internal Server Error ) However with 2 additional headers x-rewrite-url & x-original-url it actually makes a POST request to the internal system, interesting is not it? :
```
POST /webpack-runtime-d5cfa86b8e358efc5db3-v2.js?cachebust=exodus HTTP/1.1
Host: www.exodus.com
```
Response :
```
HTTP/1.1 403 Forbidden
Server: cloudflare
CF-RAY: 7111ab2b8cd191c6-SIN

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <title>Exodus - Firewall Triggered</title>
```

## Supporting Material/References:
- F1744429: Crash501NotImplemented.png
- F1744430: FirewallTriggeredWithCachePoison.png
- F1744431: PostRequestTriggeredFirewall.png

==Note: I've added in the User-Agent header to help with problem tracking. https://hackerone.com/bismillahfortuner?type=user
User-Agent: h1-<bismillahfortuner>==

## Impact

www.exodus.com hosts static js and css files on Server: cloudflare . Which is cached by cloudflare and passed to all other users accessing the source. I was able to impact the core functionality by using a custom HTTP. And I can trigger exodus firewall rules using cache poisoning

## Timeline

- **Report Filed**
- **Report Informative**
- **2022-05-25** @setiawan_: > 501 Not Implemented I don't see how this is relevant to the POC. If it was indeed vulnerable, GET/ request to the same endpoint should show the same error message which is not the case.

Hi 501 Not Implemented means that the server does not support the functionality required to fulfill the request. Usually in the case of poisoning the cache this is contained in the header
"Transfer-Encoding" You can open it here for a similar report https://hackerone.com/reports/622122. In the report the researchers were able to poison paypal with invalid transfer encoding. But in this report especially www.exodus.com I can poison it with 2 methods, namely HTTP CRASH , ERROR ( This returns Cookie Value and returns response 501 Not Implemented ) & Transfer-Encoding: foo ( This will return response 501 Not Implemented but does not carry cookies ) means, I can conclude that the 2 requests below can poison Server (number 1) and Cloudflare (number 2)

## 1. Request : 

```
CRASH /webpack-runtime-d5cfa86b8e358efc5db3-v2.js?cachebust=exodus HTTP/1.1
Host: www.exodus.com
User-Agent: h1-<bismillahfortuner>
```

Response :

```
HTTP/1.1 501 Not Implemented
Date: Wed, 25 May 2022 23:28:15 GMT
Content-Length: 0
Connection: keep-alive
Expect-CT: max-age=604800, report-uri="https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct"
Strict-Transport-Security: max-age=15552000; includeSubDomains; preload
Set-Cookie: __cfruid=74ae4764c47f28a6e9ba6debf2b8dea46e9f45d3-1653521295; path=/; domain=.exodus.com; HttpOnly; Secure; SameSite=None
Server: cloudflare
CF-RAY: 71120be35cba462b-SIN
```

## 2. Request : 

```
GET /webpack-runtime-d5cfa86b8e358efc5db3-v2.js?cachebust=exodus HTTP/1.1
Host: www.exodus.com
Transfer-Encoding: foo
User-Agent: h1-<bismillahfortuner>
```

Response :

```
HTTP/1.1 501 Not Implemented
Server: cloudflare
Date: Wed, 25 May 2022 23:30:16 GMT
Content-Type: text/html
Content-Length: 163
Connection: close
CF-RAY:-

<html>
<head><title>501 Not Implemented</title></head>
<body>
<center><h1>501 Not Implemented</h1></center>
<hr><center>cloudflare</center>
</body>
</html>
```

> I don't see headers x-rewrite-url: /root & x-original-url: /root are making any changes to response.

  You didn't look carefully enough to see the extra headers x-rewrite-url: /root & x-original-url: /root. If we pay attention to the 2 additional headers that give a 403 Forbidden response with the title Exodus - Firewall Triggered . However if you remove those 2 extra headers, it will return 200 OK. Then you notice again, in burpsuite please click action then click "Show response in browser" you will get the same image as F1744431: PostRequestTriggeredFirewall.png then you look at the header again. it will make a POST request not a GET. That's why the firewall is triggered by x-rewrite-url: /root & x-original-url: /root

Request :

```
GET /webpack-runtime-d5cfa86b8e358efc5db3-v2.js?cachebust=exodus HTTP/1.1
Host: www.exodus.com
x-rewrite-url: /root
User-Agent: h1-<bismillahfortuner>
```

> 403 Forbidden error is not associated with anything shown in the report. It is either due to POST request or User-Agent blockage at Cloud Flare.

Of course related. 403 Forbidden interprets that the server has been poisoned with x-rewrite-url: /root& x-original-url: /root . Notice inside Burpsuite I made a request with GET . However when you open the browser it will make a POST request. interesting right? that's why the firewall is triggered.
- **2022-05-25** @setiawan_: HI, @jensec

Additional information : Bypass purge cache function www.exodus.com

In this image F 1744431 : PostRequest TriggeredFirewall.png it will return a 403 Forbidden error. But if we copy using Curl and change the POST method with PURGE . it will be active :) means I can bypass the entire cache inside www.exodus.com

```
curl 'https://www.exodus.com/webpack-runtime-d5cfa86b8e358efc5db3-v2.js?cachebust=exodus' -X 'PURGE' -H 'User-Agent: User-Agent: h1-<bismillahfortuner>' -H 'Accept-Language: en-US,en;q=0.5' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/x-www-form-urlencoded' -H 'Origin: http://burpsuite' -H 'Connection: keep-alive' -H 'Referer: http://burpsuite/' -H 'Cookies: __cfruid=46943a85a40b2b3c4bdaa8abb04aeda5e8e5c321-1653515691; _ga=GA1.2.1030472207.1653513759; _gid=GA1.2.1339251426.1653513759; ex_subscribe_session=1; ex_subscribe=1' -H 'Upgrade-Insecure-Requests: 1' -H 'Sec-Fetch-Dest: document' -H 'Sec-Fetch-Mode: navigate' -H 'Sec-Fetch-Site: cross-site' --data-raw 'RenderableItem=%2Fshow%2F3%2Fbykqv993b6qycz0odvvd2z1gk74rldzf'
```

oh yeah, during testing. The User-Agent does not affect any changes. I entered the User-Agent value using my username according to the program rules https://hackerone.com/exodus
- **2022-05-26** @jensec: Hey @bismillahfortuner ,

Thank you for the detailed response. You tried to show 3 different things in above report and comments- Using random HTTP methods to cause 501 error, Using `Transfer-Encoding` header to show similar 501 error and Adding extra headers `x-rewrite-url` that would case trigger 403 error. None of these proves a valid POC, Here is why:

- When you use any random headers, it would show 501 error as intended. 

```
EXODUS /9425-ebe88a4f337590f8a75a-v2.js?jensec=1 HTTP/2
Host: www.exodus.com
Te: trailers

```

This would show 501 error but when I request:

```
GET /9425-ebe88a4f337590f8a75a-v2.js?jensec=1 HTTP/2
Host: www.exodus.com
Te: trailers

```

It doesn't show 501 same error that means error is not cached.

- When you use `Transfer-Encoding` header, it would show 501 error 

```
GET /9425-ebe88a4f337590f8a75a-v2.js?jensec1=2 HTTP/2
Host: www.exodus.com
Transfer-Encoding: exodus
Te: trailers

```

but when I remove the header, it doesn't which means it doesn't cache the response:

```
GET /9425-ebe88a4f337590f8a75a-v2.js?jensec1=2 HTTP/2
Host: www.exodus.com
Te: trailers

```

- Regarding 403 trigger with header value `x-rewrite-url: /root` , 403 does not indicate anything related to you accessing anything internal. Such path at /root does not exists. You can try providing `x-rewrite-url: /blah-blah` and you will see same 403 error. it is because Cloud Flare firewall detects such headers and block them.


With these said, I don't see any vulnerability here. In ideal condition this thing to be vulnerability, when I open the JavaScript URL in browser it should show some errors instead of loading the JS content. Hope this all make sense, If you have any questions Please feel free to shoot.

Thank you,
@jensec
- **2022-05-26** @setiawan_: Hi @jensec thanks for the response.

I will explain in more detail to you. But first, I apologize if the language I use is not good.

> When you use any random headers, it would show 501 error as intended.
> When you use Transfer-Encoding header, it would show 501 error.

I will explain using your full query.
The purpose of web cache poisoning is to send requests that cause malicious responses that are cached and served to other users.
Now I ask myself, How and What is the proof if I have succeeded in poisoning all www.exodus.com users. If we detail view below request using custom header ( NO TRASFER-ENCODING) it will return error 501 carrying cookie, Is this a problem? OF COURSE! did it look in the response that the one receiving the error was the Cloudflare Server, yes the cloud server received the 501 error? and did you see the CF-Ray header: xxxxxxxX-SIN in the response, SIN shows the location of the cache closest to us, I am close to Singapore so the header in the response is always SIN. maybe there is different? However, If you use Additional headers ( " Transfer-Encoding: foo ") it will get error 501 however it is blocked by cloudflare, not returning cf ray and cookies.

Conclusion :
1. If I add a header ("Transfer-Encoding: foo ") then Cloudlare will return a 501 response without cookies. This means that the Cloudflare Server does not support the functionality required to fulfill the request.

2. If I remove the header("Transfer-Encoding:foo") and add a custom header it will return 501 carrying cookies. This means that the Exodus Server supports this request and passes it on to Cloudflare.

```
EXODUS /9425-ebe88a4f337590f8a75a-v2.js@%0d%0aSet-Cookie:aaaaaaaaa=aaaaaaaaaaa?exodus=jensec HTTP/1.1
Host: www.exodus.com
```

> it is because Cloud Flare firewall detects such headers and block them.

Precisely! CloudFlare's firewall detected a malicious x-original-url: /root header and blocked it. Now, I want you to note, In burpsuite make sure you use request("GET") and add header("x-original-url: /root") it will return 403 forbidden Firewall Triggered. However, if you see the response in the browser, the host www.exodus.com makes a request ("POST"), strange isn't it? is there a miscommunication between www.exodus.com & clodflare? why are requests (GET) forwarded to requests (POST)?

Conclusion :

1. Inside Burpsuite. www.exodus.com make a request (GET)
2. In the Browser. www.exodus.com make a request(POST)

Thank You.
- **2022-05-26** @jensec: Hi @bismillahfortuner ,

I am still unable to see any cache poisoning here. By all means, if you open the javascript via URL in browser `https://www.exodus.com/9425-ebe88a4f337590f8a75a-v2.js?cachebuster=xyz`and if it shows 501 or some other error, we would see that as a problem and valid POC for this attack because that means error is cached. 

I would say you take a closer look at my last comment and what I meant with each individual test cases. Also no need to apologise, I like the fact that we are digging deep in the attack vector.

Thanks,
@jensec
- **2022-05-26** @setiawan_: hi @jensec
- **2022-05-27** @setiawan_: Hello exodus security team @jensec 

Hi, how is it going? is the POC valid?

Thank You.
- **2022-05-27** @jensec: @bismillahfortuner .

That should be a GET request in the browser not a POST request. It still doesn't prove the attack. I want to see a video where you reload it in the browser and it would still show 501 error in the browser screen it self. not in console.
- **2022-05-27** @setiawan_: Hi, thanks for your response @jensec 

> That should be a GET request in the browser not a POST request. It still doesn't prove the attack. I want to see a video where you reload it in the browser and it would still show 501 error in the browser screen it self. not in console.

Here's what's interesting.
1. If you make a GET URL request with cachebuster using COPY URL it will indeed be forwarded to GET. Also note that Transferred comes from cache, which means that the request comes from cache.
```
GET /9425-ebe88a4f337590f8a75a-v2.js?cachebuster=xyz HTTP/1.1
Host: www.exodus.com
```
2.
- When you load the js file the GET uses the COPY URL along with the cachebuseter=xzy payload it comes from cache And this also successfully returns a GET. But if you delete the cachebuster. Transferred it changed to RACE / CACHE means the request is racing. The response is fetched from the server even though it is cached.

- When you load a GET request and open it using the Show Response Browser ( via burpsuite ) it will make the request turn into a POST. that is, Transfer-Encoding: FOO which we injected in the header succeeded in converting the GET request into POST.
```
GET /9425-ebe88a4f337590f8a75a-v2.js?cachebuster=xyz HTTP/1.1
Host: www.exodus.com
Transfer-Encoding: FOO
```
3. When you display a response using a browser using Burpsuite, all GET requests in BurpSuite will be forwarded with a POST request in the browser. The request below returns 501 with cookies.
```
ERROR /9425-ebe88a4f337590f8a75a-v2.js?cachebuster=xyz HTTP/1.1
Host: www.exodus.com
```

Thank You.
- **2022-05-27** @jensec: @bismillahfortuner ,

As I explained, if you can open the affected URL directly in browser and it shows error, we would consider looking further into it. Using random HTTP method or TA header is indeed causing the 501 error but it is not being cached since the error is given by Cloud Flare and not the content CDN. 

Opening the response from Burp in browser can not be considered as a valid proof. You can not add headers or use random HTTP methods in victim browsers. Please look at https://hackerone.com/reports/1173153 this report about how to show a through POC. 

Thank you,
@jensec
- **2022-05-27** @setiawan_: Web cache poisoning is a sophisticated technique in which attackers exploit the behavior of web servers and caches so that a malicious HTTP response is served to other users in this case I can't replicate it in the browser, but deep inside the server manages to receive the cache with additional headers. If that is your opinion, then I will close this report. Thank You.
- **Agreed On Going Public**
- **Cancelled Disclosure Request**
- **2022-06-06** @setiawan_: I would like to request to disclose to the public. This isn't a security issue, is it?
- **Agreed On Going Public**
- **Manually Disclosed**
