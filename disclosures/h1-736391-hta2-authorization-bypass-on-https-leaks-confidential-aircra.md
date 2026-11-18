---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-authorization
  - env/web
substate: "duplicate"
weakness: "Improper Authorization"
enriched: true
body: true
date: 2023-04-14
submitted: 2019-11-12T21:01:16.911Z
bounty_usd: null
votes: 40
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "cdl"
source: "https://hackerone.com/reports/736391"
title: "[HTA2] Authorization Bypass on https://██████ leaks confidential aircraft/missile information"
---
# [HTA2] Authorization Bypass on https://██████ leaks confidential aircraft/missile information

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 40 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2023-04-14

- Report: [https://hackerone.com/reports/736391](https://hackerone.com/reports/736391)
- CWE: Improper Authorization
- Submitted: 2019-11-12T21:01:16.911Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
There is an authorization bypass on https://██████  which allows a remote, unauthenticated attacker to bypass the "██████Single Sign-On" and view the application as an authenticated user.

## Details:
The host at ████ uses Akamai as a load balancer and routes traffic back to an internal server:

```
root@doggos:~# dig A ████
-- snip --
;; ANSWER SECTION:
███. 2386	IN	CNAME	█████.
████. 1554 IN CNAME ███.
███████. 180 IN CNAME e1010.d.akamaiedge.akamai.█████████.
e1010.d.akamaiedge.akamai.██████.	20 IN A	██████████
``` 

When attempting to hit the website, you are redirected to `https://█████████/pool/sso/authenticate/l/2?m=GET&r=t&u=https%3A%2F%2F████████%2F` and requires the visitor to authenticate via SSO.

However, I was able to find the Origin IP of this server. Hitting this Origin IP completely circumvents the ████████ SSO and allows the visitor to use the application as an authenticated user.

## Steps To Reproduce:
  1. Try visiting the application here: https://███. You'll see you are redirected to login via SSO.

█████████

  2. Run the following command to verify that ████ is the Origin IP for `█████████` by pulling the names from the SSL certificate:

```
root@doggos:~#  true | openssl s_client -connect ██████:443 2>/dev/null | openssl x509 -noout -text | perl -l -0777 -ne '@names=/\bDNS:([^\s,]+)/g; print join("\n", sort @names);'

█████████
```

  3. Now visit the application: https://█████
  4. You'll see that you can now use the application as an authenticated user by clicking through the sidebar:

███

You can search through past messages / updates on aircraft and missles here: 

https://███/Guest/MessageSearch.aspx

## Impact

Critical. A remote, unauthenticated attacker can view and download confidential information from this application. For instance, I clicked on one of the messages at https://████████/Guest/MessagesDetails.aspx and it downloaded a document containing sensitive information about some issues with some██████████:

█████████

████████


Best,
Corben Leo (@cdl)

## Timeline

- **Report Filed**
- **2019-11-13** @h1_analyst_leon: Hey @cdl - Thanks for the submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.
- **Report Duplicate**
- **2019-11-13** @cdl: Thanks @druth @tuxedo  - could one of you check out #734369? It's been in the new state longer than this one, thanks!
- **Report Title Updated**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
