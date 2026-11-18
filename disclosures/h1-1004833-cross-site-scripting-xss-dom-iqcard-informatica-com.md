---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-dom
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - DOM"
enriched: true
body: true
date: 2020-10-13
submitted: 2020-10-10T21:10:57.854Z
bounty_usd: null
votes: 27
cve: []
program: "[[programs/informatica|Informatica]]"
reporter: "rodtvs"
source: "https://hackerone.com/reports/1004833"
title: "Cross-site Scripting (XSS) - DOM - iqcard.informatica.com"
---
# Cross-site Scripting (XSS) - DOM - iqcard.informatica.com

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 27 | **Program:** Informatica | **Disclosed:** 2020-10-13

- Report: [https://hackerone.com/reports/1004833](https://hackerone.com/reports/1004833)
- CWE: Cross-site Scripting (XSS) - DOM
- Submitted: 2020-10-10T21:10:57.854Z

## Report summary

Researcher identified an aged DNS A record pointing to an IP address not owned by Informatica. Analysis showed that the DNS record was not in use for some time and was removed.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello all

I found a DOM based XSS at iqcard.informatica.com

# Description

After finding the path **iqcard.informatica.com/pub/fujitsu/fm3v2/player/attach.html**. I noticed that the code inside attach.html was vulnerable to DOM XSS, due to the fact of the javascript *document.location function. search*. The code below illustrates the code contained in the attach.html file

```
<HTML>
<HEAD>
<SCRIPT>
function GetAttach()
{
	var strSearch = document.location.search
	strSearch = strSearch.substring(1)
	
	document.location.replace(strSearch)
}
</SCRIPT>
</HEAD>
<BODY onload='GetAttach()'>


</BODY>
</HTML>
```
As can be seen through the code above, the variable * strSearch * receives everything that comes from the URL after the character? and then insert it into the function *document.location.replace ()*. Through this scenario we have some possibilities.

1 - We can direct the user to any page we want for example:

```
https://iqcard.informatica.com/pub/fujitsu/fm3v2/player/attach.html?evil.com
```


2 - We can run a DOM Based XSS, running the javascript schema, javascript: alert (1);

```
https://iqcard.informatica.com/pub/fujitsu/fm3v2/player/attach.html?javascript:alert(1)
```


# PoC 

I uploaded a video and an image.

## Impact

An attacker can redirect a user to a malicious page or execute XSS attacks against users of the application or use that domain as a phishing vector to attack other users of informatica.com

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Resolved**
- **2020-10-12** @rodtvs: Thanks @nheffernan again :) 
can i disclouse this one ?
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2020-11-17** @aks_infa: Hi @rodnt  We have updated our "Hall of Fame" page.
You can find your name here: https://www.informatica.com/trust-center/security-researcher-hall-of-fame.html
Thank you again for your effort.
