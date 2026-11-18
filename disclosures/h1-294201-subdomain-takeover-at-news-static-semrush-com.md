---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
  - vuln/xss
  - vuln/subdomain-takeover
  - trigger/social-engineering
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2018-01-10
submitted: 2017-12-01T10:04:40.130Z
bounty_usd: null
votes: 40
cve: []
program: "[[programs/semrush|Semrush]]"
reporter: "z3r"
source: "https://hackerone.com/reports/294201"
title: "subdomain takeover at news-static.semrush.com"
---
# subdomain takeover at news-static.semrush.com

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 40 | **Program:** Semrush | **Disclosed:** 2018-01-10

- Report: [https://hackerone.com/reports/294201](https://hackerone.com/reports/294201)
- CWE: Improper Access Control - Generic
- Submitted: 2017-12-01T10:04:40.130Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:** The subdomain news-static.semrush.com can be taken over by attackers and abuse it for further attacks (Phishing, XSS Cross origin, malware, etc..).

**Description:** The subdomain news-static.semrush.com was pointed using CNAME to Amazon S3, but no bucket with that name was registered. This meant that anyone could sign up for Amazon S3, claim the bucket as their own and then serve content on news-static.semrush.com

**Browsers Verified In:**
  * Google Chrome v62.0.3202.94 
  * FireFox ESR v52.5.0

**Steps To Reproduce:** 
  1. Open AWS account
  2. Create s3 bucket and claim the subdomain news-static.semrush.com
  3. upload poc.html file to the bucket

**Supporting Material/References:**

```
$ dig A news-static.semrush.com @8.8.8.8

; <<>> DiG 9.8.3-P1 <<>> A news-static.semrush.com @8.8.8.8
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 35678
;; flags: qr rd ra; QUERY: 1, ANSWER: 3, AUTHORITY: 0, ADDITIONAL: 0

;; QUESTION SECTION:
;news-static.semrush.com.	IN	A

;; ANSWER SECTION:
news-static.semrush.com. 59	IN	CNAME	s3.amazonaws.com.
s3.amazonaws.com.	3459	IN	CNAME	s3-1.amazonaws.com.
s3-1.amazonaws.com.	4	IN	A	52.216.21.165
```

**POC**
http://news-static.semrush.com/POC_2313521212.html

This means that nobody else can claim the bucket and add content.

**Mitigation/Fix** 
I have claimed the bucket on my account so no one can claimed it before I release it.
Remove the news-static.semrush.com DNS entry. Alternatively, if you wish to use news-static.semrush.com with S3, tell me in a comment and I will remove the bucket from my Amazon account.

## Impact

The attacker will own the subdomain and can do whatever he want with it, such as Phishing, XSS that can affect all *.semrush.com to bypass cross origin policy and upload malwares. etc..

## Timeline

- **Report Filed**
- **2017-12-01** @alla: Thanks for the report, we will investigate this.
- **Report Triaged**
- **2017-12-04** @alla: Could you please check the fix?
- **2017-12-04** @z3r: Confirmed, the fix has been well implemented.
thank you for the fast response.
- **Report Resolved**
- **2017-12-04** @z3r: Could you please tell me if this vulnerability is eligible for bounty or not ?
- **2017-12-04** @z3r: @alla
- **2017-12-05** @z3r: from your policy page, we can consider this finding as:
*Security misconfiguration — up to $500*
please correct me if I'm wrong.
- **2017-12-05** @alla: Decision about bounty will be taken approximately on 11 December. Thank you for your patience.
- **2017-12-11** @z3r: Kind reminder @alla
- **Bounty Awarded**
- **Agreed On Going Public**
- **Report Became Public**
- **Report Vulnerability Types Updated**
