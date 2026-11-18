---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-generic
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Generic"
enriched: true
body: true
date: 2018-03-16
submitted: 2018-03-12T09:13:00.824Z
bounty_usd: null
votes: 19
cve: []
program: "[[programs/mycrypto|MyCrypto]]"
reporter: "w2w"
source: "https://hackerone.com/reports/324548"
title: "Html injection mycrypto.com"
---
# Html injection mycrypto.com

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 19 | **Program:** MyCrypto | **Disclosed:** 2018-03-16

- Report: [https://hackerone.com/reports/324548](https://hackerone.com/reports/324548)
- CWE: Cross-site Scripting (XSS) - Generic
- Submitted: 2018-03-12T09:13:00.824Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello. I remembered that a couple of months ago I found an HTML injection vulnerability on myetherwallet.com, I sent it, but my message was ignored.
Since you have the same interface, I decided to check this vulnerability on your site and it was reproduced. The vulnerability works both on www.mycrypto.com and on mycrypto.com.
Html injection is in a pop-up message

 <div class = "alert-message ng-binding" ng-bind-html = "alert.message"> You are successfully connected
<br> URL: <strong> https://www.mycrypto.com/?txHash=qwqwq%3C%20SRC=%22jav
ascript: alert (0); "& gt; <a href="https://securityz.net"> <img src =" https://securityz.net/mycrypto.jpeg "> </a> qwqw # check- tx-status </ strong> <br> Network: <strong> ETH </ strong> provided by <strong> mycryptoapi.com </ strong> </ div>

Unfortunately, you have filtering there, I could not execute js and could hardly display a picture with href on the page. 
## PoC
 https://mycrypto.com/?txHash=qwqwq%3C%20SRC=%22jav&#x0D;ascript:alert(0);"> <a href="https://securityz.net"><img src="https://securityz.net/mycrypto.jpeg"></a>qwqw#check-tx-status 

##PoC video
 https://www.youtube.com/watch?v=JmP9AU8sX5k .
##Impact
Since your site and myetherwallet are often subjected to phishing attacks, this vulnerability is dangerous. You can put in the href url of the phishing site, then you can steal the private key of the victim. Perhaps you can upload js to the site, but I could not do it.

## Impact

Since your site and myetherwallet are often subjected to phishing attacks, this vulnerability is dangerous. You can put in the href url of the phishing site, then you can steal the private key of the victim. Perhaps you can upload js to the site, but I could not do it.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2018-03-12** @w2w: Here is the PoC link https://goo.gl/AMqx5T
- **Report Triaged**
- **2018-03-12** @w2w: The fact that you will fix this vulnerability is great, but what about myetherwallet? I would like to disclose this report publicly after the fix, but if I disclose it, I will also disclose the vulnerability on myetherwallet.com and there may be massive cash theft.
- **2018-03-12** @dternyak: We are not affiliated with myetherwallet.com, but I will reach out via my personal contact information to make sure he is informed about your report.

You may also reach out independently of course.
- **Report Resolved**
- **Agreed On Going Public**
- **2018-03-14** @dternyak: Hi w2w,

Thank you for the responsible disclosure. 

We don't currently have any policies against disclosure after vulnerabilities have been patched, however you are the first so far to ask for disclosure permission.

Would it be possible to make a join statement or otherwise participate in your disclosure process so that our users can be best kept up to date?

Best,
Daniel
- **2018-03-14** @w2w: I do not quite understand your question. You say that users can be updated, but this is not a vulnerability in the software, it's just html injection in a web application. And it is fixed, if you open the report, it does not hurt your users.
- **Agreed On Going Public**
- **Report Became Public**
