---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/violation-of-secure-design-principles
  - env/web
substate: "resolved"
weakness: "Violation of Secure Design Principles"
enriched: true
date: 2021-06-03
submitted: 2021-05-03T19:49:21.922Z
bounty_usd: null
votes: 36
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "fr1nge"
source: "https://hackerone.com/reports/1183263"
title: "Web Cache Poisoning on  █████ "
---
# Web Cache Poisoning on  █████ 

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 36 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2021-06-03

- Report: [https://hackerone.com/reports/1183263](https://hackerone.com/reports/1183263)
- CWE: Violation of Secure Design Principles
- Submitted: 2021-05-03T19:49:21.922Z

## Timeline

- **Report Filed**
- **2021-05-03** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Report New**
- **2021-05-04** @fr1nge: I think that I finally have a PoC that you will accept as  DoS. After trying to overwrite the cache of other pages that the main page links to, I found the link https://www.████████/████████.htm . And sent the request with the malicious header, which returned 
```http
HTTP/1.1 400 Bad Request
Server: nginx
Date: Tue, 04 May 2021 21:26:30 GMT
Content-Type: text/html
Content-Length: 628
X-Varnish: 2139951
Age: 0
Via: 1.1 varnish-v4
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
X-Content-Type-Options: nosniff

<html>
<head><title>400 Request Header Or Cookie Too Large</title></head>
<body>
<center><h1>400 Bad Request</h1></center>
<center>Request Header Or Cookie Too Large</center>
<hr><center>nginx</center>
</body>
</html>
<!-- a padding to disable MSIE and Chrome friendly error page -->
<!-- a padding to disable MSIE and Chrome friendly error page -->
<!-- a padding to disable MSIE and Chrome friendly error page -->
<!-- a padding to disable MSIE and Chrome friendly error page -->
<!-- a padding to disable MSIE and Chrome friendly error page -->
<!-- a padding to disable MSIE and Chrome friendly error page -->
```
And now, if you visit the main page https://www.███/ and click the `██████` on the bottom right, you will see that the page is unavailable due to the cache poisoning.  I hope that this PoC is enough to demonstrate the impact of this vulnerability. 

Kind Regards,
@fr1nge
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Report New**
- **2021-05-06** @fr1nge: Oh wait, sorry about that, I didn't open your screenshot. I meant you said it returned 400. Let me check.
- **Report Severity Updated**
- **Report Triaged**
- **2021-05-06** @fr1nge: I noticed that your url bar it says https://█████████/█████ however it should say https://www.███████/████████ could you please try again with the one that has the www.
- **2021-05-06** @agent-l8: Thats just what the bar shortens it too (in chrome)- only way to grab the www in the snip is to do a delay :). you are triaged regardless
- **2021-05-11** @agent-bk1: @fr1nge Can you verify if this is fixed? System Owner has stated they have mitigated this.
- **Report Vulnerability Types Updated**
- **2021-05-12** @fr1nge: I can confirm that the issue is fixed. The System Owner has disabled the web cache.
- **Report Resolved**
- **2021-05-12** @fr1nge: Thank you. Could you disclose this report?
- **Agreed On Going Public**
- **2021-05-12** @agent-l8: Added to the queue- we just did disclosures yesterday, so could be a week or two. Thanks!
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
