---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-reflected
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Reflected"
enriched: true
date: 2026-06-30
submitted: 2026-06-29T03:16:36.099Z
bounty_usd: null
votes: 5
cve: []
program: "[[programs/essity|Essity]]"
reporter: "marioniangi"
source: "https://hackerone.com/reports/3830771"
title: "Reflected XSS in legacy CGI script /cgi-bin/████████.pl on ████████ via `████████` parameter"
---
# Reflected XSS in legacy CGI script /cgi-bin/████████.pl on ████████ via `████████` parameter

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 5 | **Program:** Essity | **Disclosed:** 2026-06-30

- Report: [https://hackerone.com/reports/3830771](https://hackerone.com/reports/3830771)
- CWE: Cross-site Scripting (XSS) - Reflected
- Submitted: 2026-06-29T03:16:36.099Z

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **2026-06-29** @marioniangi: Hello Essity  Team,

Thank you for reviewing the report.

Before the explanation below, please take a look at the attached video I provided, as it shows the exact reproduction process and the browser behavior during ████████ing.

The vulnerability is reproducible on both HTTP and HTTPS endpoints.
However, when using HTTPS, the browser displays a certificate warning (NET::ERR_CERT_COMMON_NAME_INVALID) which must be bypassed via Advanced → Proceed to ████████ (unsafe) before the page loads.


In contrast, the HTTP endpoint does not show any certificate warning and the payload executes immedia████████y.  

 use this 

``http://████████/cgi-bin/████████.pl?action=Register&████████=%3Cscript%3Ealert(document.domain)%3C%2Fscript%3E&last=████████&████████=123``

I believe the issue may not have been reproduced because the endpoint initially displays a certificate warning (`NET::ERR_CERT_COMMON_NAME_INVALID`) before the application page is loaded.

To clarify, the certificate issue itself is not the vulnerability being reported. The reported issue is that user-controlled input appears to be reflected into the HTML response and executed by the browser.

Steps to reproduce:

1. Open the following URL in Chrome:

`https://████████/cgi-bin/████████.pl?action=Register&████████=%3Cscript%3Ealert(document.domain)%3C%2Fscript%3E&last=████████&████████=123`

2. Chrome may display a certificate warning for `████████`.

3. Click:
   **Advanced → Proceed to ████████ (unsafe)**

4. Allow the page to load.

5. Observe that JavaScript executes and a browser alert appears.

6. View Page Source or inspect the HTML response.

Observed reflected HTML:

```html id="n8j4pk"
<script>alert(document.domain)</script> ████████, Tel: 123
```
████████

Expected behavior:
User input should be safely encoded before being inserted into the HTML response.

Actual behavior:
The value supplied in the `████████` parameter is reflected directly into the response HTML without output encoding, causing the browser to interpret and execute it as JavaScript.

The `alert(document.domain)` payload was used only to demonstrate JavaScript execution and confirm reflection.

If needed, I also provide:

* Raw HTML response containing the reflected payload

Best regards,
████████
- **2026-06-29** @marioniangi: In contrast, the HTTP endpoint does not show any certificate warning and the payload executes immedia████████y.

use this

``http://████████/cgi-bin/████████.pl?action=Register&████████=%3Cscript%3Ealert(document.domain)%3C%2Fscript%3E&last=████████&████████=123``

look the video  poc

████████
- **2026-06-29** @marioniangi: To reproduce the XSS without any certificate warnings, please use the HTTP URL:


``http://████████/cgi-bin/████████.pl?action=Register&████████=%3Cscript%3Ealert(document.domain)%3C%2Fscript%3E&last=████████&████████=123``
- **Report Triaged**
- **2026-06-29** @hugolevisse: Hello ████████ 
We have implemented a fix and the issue has been remediated.
Could you please verify that the vulnerability is no longer exploitable on your end? Once confirmed, we will proceed with resolving this report.
We appreciate your contribution to improving our security posture.

Additionally could you confirm how you came across this ████████ endpoint?

Best regards,
Essity AppSec Team
- **2026-06-29** @marioniangi: Hello ████████,

Thank you for the update and for the quick remediation , I really appreciate the effort from your team in handling this.

If possible, I would also like to ask if your team would be comfortable leaving a short comment or recommendation on my profile regarding this report. It would be a great appreciation of the collaboration during this disclosure process.

Looking forward to your response.

Best regards,
████████
- **2026-06-29** @marioniangi: Hello ████████,

Thank you for the quick remediation. I have verified the fix and can confirm that the XSS vulnerability at `████████/cgi-bin/████████.pl` is no longer exploitable.

**Verification:**

``"http://████████/cgi-bin/████████.pl?action=Register&████████=<script>alert(document.domain)</script>&last=████████&████████=123``


""Response**

Not Found
The requested URL was not found on this server.
Apache/2.4.25 (Debian) Server at ████████ Port 80

##Confirmed: The endpoint is no longer accessible (404 Not Found).
- **2026-06-29** @marioniangi: I discovered this endpoint during regular bug hunting activities. While performing reconnaissance on Essity's public infrastructure, I identified legacy CGI scripts that were still accessible. The ████████.pl script appeared to be a ████████/debugging endpoint that was unintentionally exposed to the public.
- **Report Resolved**
- **2026-06-30** @marioniangi: Hello Essity AppSec Team,
Can this report be disclosed guys?
Thank you for the update and for addressing the issue.
- **Agreed On Going Public**
- **2026-06-30** @hugolevisse: Hi ████████, we recently saw your LinkedIn posts regarding reported vulnerabilities. In accordance to our Disclosure Policy, researchers may only publish details about identified vulnerabilities after Essity has fully remediated them and expressed clear consent.
These findings do not meet any of the aforementioned criteria, therefore we urge you to remove the shared data. 
Please note that any further violation may result in removal from the program
- **2026-06-30** @marioniangi: Hello @team,
Thank you for the clarification.
I have removed the LinkedIn post to fully comply with your disclosure policy.
My intention was not to violate any rules, but to share general research experience without disclosing sensitive program details.

Could you please let me know if disclosure will be permitted in the future, or if I should wait for explicit authorization before sharing anything publicly?

Best regards,
████████
- **Agreed On Going Public**
- **Report Became Public**
