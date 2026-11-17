---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
date: 2024-11-04
submitted: 2024-05-27T10:14:46.823Z
bounty_usd: 1000
votes: 76
cve: "CVE-2024-34341"
program: "[[programs/basecamp|Basecamp]]"
reporter: "thwin_htet"
source: "https://hackerone.com/reports/2521419"
title: "Stored XSS on trix editor version 2.1.1"
---
# Stored XSS on trix editor version 2.1.1

> **Severity:** High | **Bounty:** 1,000 USD | **Votes:** 76 | **Program:** Basecamp | **Disclosed:** 2024-11-04

- Report: [https://hackerone.com/reports/2521419](https://hackerone.com/reports/2521419)
- CWE: Cross-site Scripting (XSS) - Stored | CVE: CVE-2024-34341
- Submitted: 2024-05-27T10:14:46.823Z

## Timeline

- **Report Filed**
- **2024-05-27** @jacopo-beschi: Hi, 

Thanks for the report. I was able to reproduce it. I asked also my colleague to take a look, then I'll provide you with a bounty.
- **2024-05-27** @thwin_htet: Hi, 
thanks.

This also impact to Basecamp web app and desktop app as well since basecamp also uses trix editor.

{F3303108}

But i think i should not open a new report. So just informing.
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Triaged**
- **2024-05-30** @thwin_htet: Thanks for the Bounty.
How’s the CVE Process?
- **2024-05-30** @afcapel: @thwin_htet we'll create a security advisory when we have the patched version ready, and then Github assigns a CVE with it. I can credit you for the report in the advisory.
- **2024-05-31** @thwin_htet: noted bro. thanks.
- **2024-07-18** @thwin_htet: Hello,

Rails ActionText does bundle Trix as a vendored dependency. I found this issue in ActionText first and root cause was due to Trix, so I reported here first.  Can we claim bounty from IBB for this?

Also, when will we release the fixed version?

regards,
- **2024-07-18** @rosa: Hey @thwin_htet, no, the bounty would be the one awarded here. I'm afraid we don't have a time estimation for the fixed version. Sorry about that!

Thanks,
Rosa
- **2024-08-14** @rosa: Hey @thwin_htet, we've released a new version of Trix with [a fix for this vulnerability](https://github.com/basecamp/trix/pull/1156) and requested a CVE in GitHub, who now need to review the security advisory we submitted before assigning a CVE. 

Thanks,
Rosa
- **2024-08-15** @rosa: Hi again, @thwin_htet, [the security advisory has been published and assigned a CVE](https://github.com/basecamp/trix/security/advisories/GHSA-qm2q-9f3q-2vcv). Would you mind checking and confirming whether this is fixed so I can close it as Resolved? 

Thanks!
Rosa
- **2024-08-16** @thwin_htet: Hello @rosa , 

i can't reproduce anymore on version 2.1.5. I can confirm that it is fixed.

thanks.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
