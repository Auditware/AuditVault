---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/privilege-escalation
  - env/web
  - vuln/subdomain-takeover
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
body: true
date: 2022-11-12
submitted: 2022-09-30T16:15:02.344Z
bounty_usd: null
votes: 32
cve: []
program: "[[programs/equifax|Equifax-vdp]]"
reporter: "valluvarsploit_h1"
source: "https://hackerone.com/reports/1718371"
title: "Subdomain takeover at http://test.www.midigator.com"
---
# Subdomain takeover at http://test.www.midigator.com

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 32 | **Program:** Equifax-vdp | **Disclosed:** 2022-11-12

- Report: [https://hackerone.com/reports/1718371](https://hackerone.com/reports/1718371)
- CWE: Privilege Escalation
- Submitted: 2022-09-30T16:15:02.344Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Vulnerability
Subdomain test.www.midigator.com points to an AWS S3 bucket that no longer exists. I was able to take control of this bucket and serve my own content on it.

## Proof Of Concept
```code
$ dig test.www.midigator.com
[snipped]
;; ANSWER SECTION:
test.www.midigator.com.	60	IN	CNAME	test.www.midigator.com.s3-website-us-west-1.amazonaws.com.
test.www.midigator.com.s3-website-us-west-1.amazonaws.com. 59 IN CNAME s3-website-us-west-1.amazonaws.com.
s3-website-us-west-1.amazonaws.com. 4 IN A	52.219.193.3
```

{F1963195}

## Remediation
Remove the CNAME entry for the `test.www.midigator.com`

## Impact

Subdomain Takeover

## Timeline

- **Report Filed**
- **2022-10-01** @h1_analyst_shiva: Hi @valluvarsploit_h1,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@h1_analyst_shiva
(Previously known as @wadoichimonji)


*Note: Over the next few weeks all of the HackerOne Triage team will be changing their usernames. This new format will make it easier for customers and hackers to easily discern when they are corresponding with a HackerOne security analyst and when they are communicating with a hacker. Look out for a full press release soon.*
- **Report Triaged**
- **2022-10-02** @valluvarsploit_h1: Hello @h1_analyst_shiva,
Thank you for the quick triage. Can I delete the S3 bucket (`test.www.midigator.com.s3-website-us-west-1.amazonaws.com`)  where I hosted my PoC?
- **2022-10-02** @valluvarsploit_h1: I am asking for permission to delete the bucket because I couldn't afford AWS. Hope you understand. Sorry for the rush.
- **2022-10-04** @valluvarsploit_h1: Hello Team,
I deleted S3 bucket since evidence has been recorded in this report, Thanks.
- **2022-10-06** @asv01: Hello @valluvarsploit_h1 ,

Thank you for vulnerability report! We're currently reviewing its details and working with internal remediation teams
to determine a proper resolution. We will continue to update you as we work through this process.
Thanks,
- **2022-10-06** @valluvarsploit_h1: Hello @asv01,
I have unclaimed this AWS S3 bucket so you will see a `404 Not Found` page if you visit now. I can reclaim this S3 bucket anytime and host my own content on it. Let me know if you need any help.

Regards,
@valluvarsploit_h1
- **2022-10-10** @asv01: Hello @valluvarsploit_h1 can you please retest this and let us know if you are still seen the issue in here ?
- **2022-10-11** @valluvarsploit_h1: Hello @asv01,
I have retested it. I was not able to take over the subdomain `test.www.midigator.com` anymore. Thanks for quickly fixing this issue. Kudos to the security team.
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
