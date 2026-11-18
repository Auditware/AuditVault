---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/server-side-request-forgery-ssrf
  - env/web
  - vuln/ssrf
substate: "resolved"
weakness: "Server-Side Request Forgery (SSRF)"
enriched: true
body: true
date: 2019-10-08
submitted: 2019-01-19T18:00:45.913Z
bounty_usd: null
votes: 4
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "warsong"
source: "https://hackerone.com/reports/482634"
title: "https://████████ Impacted by DNN ImageHandler SSRF"
---
# https://████████ Impacted by DNN ImageHandler SSRF

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 4 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2019-10-08

- Report: [https://hackerone.com/reports/482634](https://hackerone.com/reports/482634)
- CWE: Server-Side Request Forgery (SSRF)
- Submitted: 2019-01-19T18:00:45.913Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Summary:
https://███████ runs DNN 8.0.0 to 9.1.1 and is impacted by CVE 2017-0929 allowing for a SSRF through the DNN ImageHandler. Origin servers will request any image file supplied by the attacker. This allows for internal NIPR sites to be mapped and accessed through a vulnerable host. The attack is limited by file extension.

Impact
Vulnerable site allows interaction with internal NIPR sites. Pulling default image files from internal NIPR sites verifies the site is online and responsive. Discloses origin IP addresses, and could be manipulated further.  This could also be used as a defacement technique making the sight display images of radical ideologies or pornography.  

Step-by-step Reproduction Instructions
Access the DNN image handler on the vulnerable site.
Supply Burp collaborator payload (working on free burp right now and cannot provide a collab payload) or external attacker controlled image for SSRF trigger.
Payload Example:
https://█████/DnnImageHandler.ashx?mode=file&url=http://1.bp.blogspot.com/-q19YK-T_wAU/UdpDm76jIgI/AAAAAAAAAWo/yjeRx4Vet80/s400/meme11.jpg

https://████████/DnnImageHandler.ashx?mode=file&url=http://www.███/data/uploads/images/DC3_seal.png

Product, Version, and Configuration
DNN 8.0.0 to 9.1.1 with ImageHandler exposed.

Suggested Mitigation/Remediation Actions
Upgrade to DNN 9.2.0 or later. If upgrading isn't possible, consider blocking requests to ImageHandler if it is unused.

## Impact

Recommend High Severity: Vulnerable site allows interaction with internal NIPR-Only sites. Pulling default image files from internal NIPR sites verifies the site is online and responsive. Discloses origin IP addresses, and could be manipulated further to cause harm on internal NIPR sites. This could also be used as a defacement technique making the sight display images of radical ideologies or pornography.

## Timeline

- **Report Filed**
- **2019-01-19** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

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
- **2019-01-29** @warsong: Looks good in testing.  The ImageHandler actually still 200s but doesn't fetch content.  I threw in a collaborator payload and didn't get a DNS lookup or HTTP GET so it looks like it is properly being sanitized.
- **2019-01-30** @agent-1: Amazing work @warsong. With your permission we'd like to highlight you on our Twitter page @DC3VDP for the month of January. Please let us know if that's okay, and if you have a Twitter handle to tag.

DC3 VDP Team
- **2019-01-31** @warsong: @agent-1 yeah for sure, that would be awesome!  I do have a twitter handle but I don't tweet very often.  It is @warsong71 but you can also use my name (Lance Cleghorn) if you'd like; thanks for the shoutout!
- **Agreed On Going Public**
- **2019-02-06** @ag3nt-j1: I'll get it in the queue Lance, thanks for all you do for us!
- **Agreed On Going Public**
- **Report Became Public**
