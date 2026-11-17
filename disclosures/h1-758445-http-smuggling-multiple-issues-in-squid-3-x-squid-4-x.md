---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/http-response-splitting
  - env/web
substate: "resolved"
weakness: "HTTP Response Splitting"
enriched: true
date: 2021-08-26
submitted: 2019-12-14T11:11:17.654Z
bounty_usd: null
votes: 74
cve: "CVE-2019-18678", "CVE-2020-15811", "CVE-2020-8449"
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "regilero"
source: "https://hackerone.com/reports/758445"
title: "HTTP Smuggling multiple issues in Squid 3.x & squid 4.x"
---
# HTTP Smuggling multiple issues in Squid 3.x & squid 4.x

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 74 | **Program:** Internet Bug Bounty | **Disclosed:** 2021-08-26

- Report: [https://hackerone.com/reports/758445](https://hackerone.com/reports/758445)
- CWE: HTTP Response Splitting | CVE: CVE-2019-18678, CVE-2020-15811, CVE-2020-8449
- Submitted: 2019-12-14T11:11:17.654Z

## Timeline

- **Report Filed**
- **2019-12-15** @nochnoidozor: Hi @regilero,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@nochnoidozor
- **Report Triaged**
- **Cve Id Added**
- **2019-12-16** @regilero: For references on the exact same issue there are other CVEs on other HTTP product that I reported in the past:

* Apache Traffic Server (ATS) :  CVE-2018-8004 : https://nvd.nist.gov/vuln/detail/CVE-2018-8004 (score 6.5)
* Apache httpd : CVE-2016-8743 : https://nvd.nist.gov/vuln/detail/CVE-2016-8743 (score 7.5 - multiple issues)
* Nodejs: CVE-2016-2086 : https://nvd.nist.gov/vuln/detail/CVE-2016-2086 (score 7.5 - multiple issues)
* golang : CVE-2019-16276 : https://nvd.nist.gov/vuln/detail/CVE-2019-16276 (score 7.5)
- **2020-02-17** @regilero: Follow-up : 

Issue `#3`, the **ServerSide Request Forgery & Security Bypass issue** is now fixed in Squid 4.10, with this security announce : http://www.squid-cache.org/Advisories/SQUID-2020_1.txt (CVE CVE-2020-8449 I think, as CVE-2020-8450 may be the unrelated RCE).

We are still waiting for a fix on issue `#4`...
- **2020-08-24** @regilero: The last Issue (#4) is now fixed in Squid with 4.13 & 5.04 release: https://www.spinics.net/lists/squid/msg93048.html ; **CVE-2020-15811** ; HTTP Request splitting using various combinations around Transfer-Encoding values ('chunked' not used as last keyword, bad quoting, etc.). As said in the report this could lead to cache poisoning. Exploit of the issue with interactions with some other HTTP actors was demonstrated to the project maintainers.
Impacted version are listed on the report (summary: 3.4, 4.x and 5.x)

So finally we have 3 CVE for this Hackerone report (I do not expect any move on the undisclosed and wontfix issue #1 for Squid 3.x, so let's say it does not exists):

- #2 :  **CVE-2019-18678** (HTTP Splitting using space before columns) CVSS v3 score **5.3**   https://www.suse.com/fr-fr/security/cve/CVE-2019-18678/ (but as I said 2 messages before this same issue is usually at least 6 or 7 on other equivalent products), and 
- #3 : **CVE-2020-8449** (Hosts header manipulations, ServerSide Request Forgery)  https://access.redhat.com/security/cve/cve-2020-8449 scored 4.8 for Redhat (CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:L/I:L/A:N) and 7.5 NVD (CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N) : I think the Redhat score is low because I did not publicly explain this attack, yet...
- #4: **CVE-2020-15811** (HTTP Splitting using non terminal 'chunked') CVSS Score of **9.3** https://nvd.nist.gov/vuln-metrics/cvss/v3-calculator?vector=AV:N/AC:L/PR:L/UI:N/S:C/C:H/I:H/A:N/E:F/RL:O/RC:C/CR:H/IR:H/AR:X/MAV:N/MAC:L/MPR:L/MUI:N/MS:C/MC:H/MI:H/MA:N&version=3.1

This should be the end of this Hackerone Report. I you need a squid project side view on my work, for details, I think you can ask Amos Jeffries which worked on most of the issues and is now very aware of HTTP Smuggling issues.

For issues #3 and #4 I did not yet make a deep explanation in this report, as I made for issue #2. I'll certainly publish these details in the following months. I you want more details I can provide.
- **2020-08-25** @nochnoidozor: Hi @regilero - Thanks for the additional information and for your continuous patience.

Best,
@nochnoidozor
- **2020-09-03** @regilero: Ok, and know?
- **2020-09-16** @regilero: Hello, Can you please add some follow-up from your side, do you need some extra information?
- **2020-09-19** @nochnoidozor: Hi @regilero - I'm trying to reach out the team internally and hope to provide an update shortly.

Best,
@nochnoidozor
- **2020-10-20** @regilero: Ok, that was a month ago now. @nochnoidozor should I click on the "request Mediation" button now?
- **2020-10-21** @nochnoidozor: Hi @regilero - Unfortunately I've been unable to get an answer yet from the team and I'm still awaiting a response. Thanks for your patience.

Best,
@nochnoidozor
- **Hacker Requested Mediation**
- **2020-12-07** @antenna: Hi @regilero,

Apologies for the delay.

We're looking into this internally, as there are other older reports without response, and will do our best to get a response from the program team.

Best regards,
@antenna
- **2021-01-14** @regilero: So, we are now in 2021, happy new Year. this report is now more than 1 year old.
- **2021-01-18** @nochnoidozor: Hi @regilero - Unfortunately we haven't updates yet. Thanks for your patience.

Best,
@nochnoidozor
- **2021-04-26** @regilero: A few moments later... So it's now 1 year and 4 months. Still no feedback.
- **2021-05-02** @h1_analyst_chanel: Hi @regilero - I've requested feedback from the internal team. Thank you for your immense patience and apologies for the frustration caused by the delay in updates.
- **Report Resolved**
- **Not Eligible For Bounty**
- **2021-07-24** @regilero: I highly doubt of the CVE score.
* **privileges required: low** : this is wrong, you do not need any privilege for the attacker, it is 'None' (which is enough to get a 7.5 score overall)
* **scope: unchanged**, here we cleary talk of cache poisoning, and HTTP splitting, and here the splitting is made by Squid, so the impact will be on another actor, not directly on squid, so the scoe is 'changed'.
* **availability: None**, well, if you have a cache poisoning of the HTTP actor set in front of squid I think we can said we have a complete loss of availability for Squid.

This score of 9.3 was listed by the squid project in the initial advisory https://github.com/squid-cache/squid/security/advisories/GHSA-c7p8-xqhm-49wv

Now, 2 years after you come back and state that this is in fact a non-problem, that someone has decided that it was only medium, who has decided, what do they know about this issue, nobody asked me anything... and you close this issue, are you kidding me?

Issue #3 is also scored 7.5 here https://nvd.nist.gov/vuln/detail/CVE-2020-8449 on the same site you used to reject the #4; But same thing, just throw it and close the issue. And for issue #2 we could also check the detail and see why the score is low on official website, not sur it should.

This is a complete lack of respect, I feel really bad, like I made the effort of not explaining these issues anywhere, for 2 years. And you come here and close the issue without any effort!
- **Report Reopened**
- **Bounty Awarded**
- **Cve Id Added**
- **Cve Id Added**
- **Report Severity Updated**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Title Updated**
- **2021-08-20** @regilero: Thanks for the bounty. This is huge. I will make some detailed explanations on the issues public in the following weeks, I think we can say we are far from 0days here :-)
- **Report Became Public**
