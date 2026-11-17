---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/privilege-escalation
  - env/web
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
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
