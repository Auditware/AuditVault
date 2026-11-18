---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-generic
  - env/network
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Generic"
enriched: true
body: true
date: 2017-05-22
submitted: 2016-12-10T00:47:35.155Z
bounty_usd: null
votes: 7
cve: []
program: "[[programs/informatica|Informatica]]"
reporter: "s_p_q_r"
source: "https://hackerone.com/reports/190016"
title: "[network.informatica.com] The login form XSS via the referer value"
---
# [network.informatica.com] The login form XSS via the referer value

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 7 | **Program:** Informatica | **Disclosed:** 2017-05-22

- Report: [https://hackerone.com/reports/190016](https://hackerone.com/reports/190016)
- CWE: Cross-site Scripting (XSS) - Generic
- Submitted: 2016-12-10T00:47:35.155Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

The **referer** parameter value https://network.informatica.com/login!input.jspa?referer=%ref% is inserted into the Javascript code

```javascript
if (pageURL.indexOf("login!input.jspa?referer=") > -1 || pageURL.indexOf("login.jspa?referer=") > -1) {
	finalPageURL='%ref%';
}
```
and used in further redirection without validation:

```javascript
InfaAutoLogin.authenticateUser(response.id, finalPageURL, {
	callback:function(responseMap) {
		if(responseMap['status'] === 'success') {
			document.location = responseMap['location'];
		}
		else {
			sessionStorage.setItem('autoLoginType', responseMap['statusMsg']);
		}
	}
});
```

This means an attacker can put JS links there, which will cause script execution in the victim's browser:

1. Log into your Informatica Network account
2. Go to https://network.informatica.com/login!input.jspa?referer=javascript:alert(document.domain)

{F142238}

Tested with latest Firefox and Chrome.

## Timeline

- **Report Filed**
- **2016-12-14** @ttoko: Hi @s_p_q_r,

I attempted to reproduce the issue in Firefox and Chrome and it did not work in either browser. Are you still able to reproduce the issue?

Thank you!
- **2016-12-14** @s_p_q_r: Hi,

Yes, I am. It fires about a second after the page is loaded.
- **Report Triaged**
- **Report Severity Updated**
- **2017-03-06** @tarantula_hawk: @s_p_q_r 
Please confirm if it is resolved now.
- **2017-03-20** @s_p_q_r: Yep, seems fixed now.
- **Report Resolved**
- **Swag Awarded**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2022-01-20** @akilac: We have updated our "Hall of Fame" and you can find it at https://www.informatica.com/trust-center/security-researcher-hall-of-fame.html . Thanks for keeping Informatica safe.
