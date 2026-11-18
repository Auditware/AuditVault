---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/cross-site-scripting-xss-generic
  - env/cloud
  - stack/aws
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Generic"
enriched: true
body: true
date: 2020-09-03
submitted: 2020-07-08T14:05:14.708Z
bounty_usd: null
votes: 22
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "pdbx"
source: "https://hackerone.com/reports/918946"
title: "Subdomain takeover due to an unclaimed Amazon S3 bucket on ███"
---
# Subdomain takeover due to an unclaimed Amazon S3 bucket on ███

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 22 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2020-09-03

- Report: [https://hackerone.com/reports/918946](https://hackerone.com/reports/918946)
- CWE: Cross-site Scripting (XSS) - Generic
- Submitted: 2020-07-08T14:05:14.708Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
An unclaimed Amazon S3 bucket on █████████ gives an attacker the possibility to gain full control over this subdomain.

**Description:**
`███████` pointed to an S3 bucket that did no longer exists. The bucket points to an Amazon S3 website bucket in the US East region. I claimed this bucket and successfully took over this subdomain. 

Note:
I am reporting this issue to DoD since: "████████ ██████" The ████████ is linked to ███, so I believe this belongs here. I discovered this domain initially from the DoD websites list. Please excuse if this is a misconception. 

## Impact
This is extremely vulnerable to attacks as a malicious user could create any web page with any content and host it on the ██████████ domain. This would allow them to post malicious content which would be mistaken for a valid site. They could:
 * XSS
 * Phishing
 * Bypass domain security 
 * Steal sensitive user data, cookies, etc. 

## Step-by-step Reproduction Instructions
`dig ███` results in: 

```
; <<>> DiG 9.11.3-1ubuntu1.12-Ubuntu <<>> ███
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 53839
;; flags: qr rd ra; QUERY: 1, ANSWER: 3, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 4096
;; QUESTION SECTION:
;███████.    IN  A

;; ANSWER SECTION:
██████████. 1022 IN CNAME   ████-website-us-east-1.amazonaws.com.
██████████-website-us-east-1.amazonaws.com. 1022 IN CNAME s3-website-us-east-1.amazonaws.com.
s3-website-us-east-1.amazonaws.com. 2542 IN A   █████

;; Query time: 304 msec
;; SERVER: 10.68.0.1#53(10.68.0.1)
;; WHEN: Wed Jul 08 22:01:20 KST 2020
;; MSG SIZE  rcvd: 154
```

1. █████████ points to an Amazon S3 bucket in the S3 US East 1 region. Visiting http://███████ revealed that the bucket did not exist (refer to `before.png`). 
2. I created an S3 bucket with the name `████████` on my S3 account in the US East 1 region and uploaded an `index.html` and  an XSS POC (`xss_poc_998877665544332211.html`).
3. Visiting http://███ shows the successful subdomain takeover. View the page source to see the following comment: ` <!-- Demonstrated subdomain takeover by chron0x -->`
4. Visiting http://████████/xss_poc_998877665544332211.html you can see the simple XSS payload in action. 

## Suggested Mitigation/Remediation Actions
Remove the █████ DNS entry and I will remove the bucket from my Amazon account as soon as this issue is resolved. If you want to reclaim the domain instead, please let me know in the comments and I free the bucket before.

## Impact

High. An attacker can use the domain for various malicious activities ranging from XSS, over phishing to cookie stealing, etc. All of this while using a trusted domain name (██████).

## Timeline

- **Report Filed**
- **2020-07-08** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2020-07-08** @agent-l8: '
- **Report Triaged**
- **2020-07-08** @pdbx: Hello, good to hear that it is in scope. 
I am attaching the `index.html` file and the `xss_poc_998877665544332211.html` file. 
I wrote the takeover message as an HTML comment to be discrete. You can view the page source through the following link:
`view-source:http://█████████/index.html`

The `begin.png` is an image of the subdomain when I discovered it. Since I took it over, it looks now according to my uploaded `index.html` file. 

I hope I could clarify the concerns.
- **Report Severity Updated**
- **2020-07-27** @agent-l8: @chron0x can you go ahead and release the domain? thanks!
- **2020-07-28** @pdbx: @agent-l8 Domain is released.
- **Report Resolved**
- **Agreed On Going Public**
- **2020-08-24** @agent-l8: added to queue for review
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
