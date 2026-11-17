---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/server-side-request-forgery-ssrf
  - env/web
substate: "resolved"
weakness: "Server-Side Request Forgery (SSRF)"
enriched: true
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
