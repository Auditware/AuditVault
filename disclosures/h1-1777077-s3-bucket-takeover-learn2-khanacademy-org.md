---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/cloud
  - stack/aws
substate: "resolved"
weakness: null
enriched: true
body: true
date: 2022-12-29
submitted: 2022-11-17T16:57:14.561Z
bounty_usd: null
votes: 35
cve: []
program: "[[programs/khanacademy|Khan Academy]]"
reporter: "fdeleite"
source: "https://hackerone.com/reports/1777077"
title: "S3 bucket takeover [learn2.khanacademy.org]"
---
# S3 bucket takeover [learn2.khanacademy.org]

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 35 | **Program:** Khan Academy | **Disclosed:** 2022-12-29

- Report: [https://hackerone.com/reports/1777077](https://hackerone.com/reports/1777077)
- CWE: N/A
- Submitted: 2022-11-17T16:57:14.561Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

The subdomain learn2.khanacademy.org was pointed  to Amazon S3, but no bucket with that name was registered [learn2.khanacademy.org]. This meant that anyone could sign up for Amazon S3, claim the bucket as their own and then serve content.

## Steps to reproduce
 
Check the following url:
http://learn2.khanacademy.org

Also

```
>  curl -k http://learn2.khanacademy.org/
<!doctype html>
<html>
  <head>
    <title>S3 takeover POC</title>
  </head>
  <body>
    <p>This is S3 takeover POC </p>
  </body>
</html>
```

## Impact

It's extremely vulnerable to attacks as a malicious user could create any web page with any content and host it on the `ford.com` domain. This would allow them to post malicious content which would be mistaken for a valid site. 

They could perform several attacks like:
 - Cookie Stealing
 - Phishing campaigns. 
 - Bypass Content-Security Policies and CORS.
 
## Recommendations for fix

* Remove the affected DNS record
 

### Supporting Material/References:

 - https://0xpatrik.com/subdomain-takeover/
 - https://hackerone.com/reports/661751

## Timeline

- **Report Filed**
- **2022-11-22** @fdeleite: Hello there,

Any updates on this report?
- **Report Resolved**
- **2022-11-23** @fdeleite: Hello there @drosile,

Thanks for the fast resolution. My username is pdelteil.
- **2022-11-23** @drosile: Thanks, the badge should be added to your account today!
- **Agreed On Going Public**
- **Report Became Public**
