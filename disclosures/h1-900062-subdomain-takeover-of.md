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
body: true
date: 2020-07-08
submitted: 2020-06-16T23:52:34.842Z
bounty_usd: null
votes: 18
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "flavsec_"
source: "https://hackerone.com/reports/900062"
title: "Subdomain takeover of ████"
---
# Subdomain takeover of ████

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 18 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2020-07-08

- Report: [https://hackerone.com/reports/900062](https://hackerone.com/reports/900062)
- CWE: Privilege Escalation
- Submitted: 2020-06-16T23:52:34.842Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
I was able to claim the subdomain: ████ using Microsoft Azure ( CDN profiles)

**Description:**

## Impact
Platform(s) Affected:
Subdomain
Azure CDN

## Step-by-step Reproduction Instructions

1. Using dig, I was able to determine that the subdomain '███████' was vulnerable to takeover. The record showed status: NXDOMAIN and was pointing to the CNAME: █████.
2. Using this information, I was able to create a new Azure CDN Profile with the name '██████████'. This would resolve to the CNAME record mentioned above.
3. I then created a Web App domain through Azure  where I uploaded a small proof html file through FTP, I then set the CDN's origin type to WebApp and selected the url that I created earlier, this would serve the proof file (█████/proof.html) , Last and final step I set the custom domain to ███████ and enabled ssl.
4. I was then able to view the uploaded site at https://████████/proof.html

## Suggested Mitigation/Remediation Actions
To mitigate this issue you can:

Remove the DNS record from the DNS zone if it is no longer needed.
Claim the domain name in a permanent DNS record so it cannot be used elsewhere.

## Impact

This is extremely vulnerable to attacks as a malicious user could create any web page with any content and host it on the ████ domain. This would allow them to post malicious content which would be mistaken for a valid site. They could steal cookies, bypass domain security, steal sensitive user data, malware distribution, etc.

## Timeline

- **Report Filed**
- **2020-06-16** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **2020-06-17** @flavsec_: Thanks very much, I will kindly answer any question they might have.
- **2020-06-17** @agent-r5: Please release the domain so the system owner can regain control. Also we do not want you to incur any upkeep costs.
- **2020-06-17** @flavsec_: Hello, the subdomain should now be free. Thanks!
- **2020-06-24** @flavsec_: Any new information? Possibility for disclosure? Thank you
- **2020-06-24** @agent-l8: @flav_ nothing as of yet- when the system owner confirms the fix action we can resolve it. at that point you can request disclosure and be added to our queue. Thanks!
- **Report Resolved**
- **Agreed On Going Public**
- **2020-07-08** @agent-l8: added to queue
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
