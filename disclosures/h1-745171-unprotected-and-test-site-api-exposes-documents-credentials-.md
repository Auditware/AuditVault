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
date: 2022-09-14
submitted: 2019-11-23T23:15:03.093Z
bounty_usd: null
votes: 3
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "byteone"
source: "https://hackerone.com/reports/745171"
title: "Unprotected ██████ and Test site API Exposes Documents, Credentials, and Emails in ██████████ Proposal System"
---
# Unprotected ██████ and Test site API Exposes Documents, Credentials, and Emails in ██████████ Proposal System

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 3 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2022-09-14

- Report: [https://hackerone.com/reports/745171](https://hackerone.com/reports/745171)
- CWE: Improper Access Control - Generic
- Submitted: 2019-11-23T23:15:03.093Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
The test/integration API of the █████ web services is publicly exposed: disclosing documents, emails, and credentials to what appears to be the Seaport Bid proposal system. Because I did not attempt any exploitation outside of that necessary to deem this a reportable issue, it is not clear if the data is only test generated or if the system contains production documents, credentials, etc. 

███████

**Description:**
While performing manual reconnaissance, I came across Swagger/API documentation for the ███ web services API at https://███████/. 

The API endpoint appears to have four main types of functionality:

1) Document storage/retrieval
2) Email template storage
3) Email generation
4) PDF generation

Due to the lack of authentication on the API, the system can be easily abused by a minimally sophisticated attacker.

## Impact & Steps to Reproduce

1) Documents stored in the system can be uploaded, modified, or deleted via the API. Per the DoD program rules on data exfil, I did not try to access the documents. You can view a listing of the documents here:

https://███/api/1_0/Documents

2) Email templates can be access and modified. For example, you can view all email templates here:

https://██████████/api/1_0/EmailTemplates

You can also add, modify, or delete templates via the API.

3) Most importantly, you can view all of the emails that the system has sent via the API. The exact route is:

https://████/api/1_0/EmailMessages

**The emails are highly sensitive because they contain the activation codes needed to create a new account and access the █████████ Proposal System at https://███/Bid/.** 

For example, one of the last emails sent includes the following:

```

{"resultmetadata":[{"emailId":"3f6f7fb7-167b-432d-b35b-f443709ba832","systemcode":null,"senderEmailAddress":"████ Admin<DoNotReply@█████.com>","acknowledgementRequested":false,"attachments":[],"tags":[],"tokens":null,"emailStatus":"Sent","Subject":"Your ███████ Authentication Code","Body":"Your authentication code is 373A51. This code will expire at 09:23 AM on 11/22/2019.\r\n\r\n-----------------------------------------------------------------\r\n\r\nYou may check in through the following link https://████/Bid.\r\n\r\nThank you for your business with ███████.\r\n\r\nPlease do not reply directly to this message. 

```

Note the █████ Authentication Code `373A51`, which would allow an attacker to login to the system at https://█████/Bid.

The emails also include usernames of current users in the system who will have access expiring in the near future:

█████
You can view the full list of emails here:

https://█████████/api/1_0/EmailMessages

## Suggested Mitigation/Remediation Actions

Utilize bearer token authentication on the API route so that unauthorized parties cannot query it. Alternatively, lock down access to the API endpoint to restricted IP addresses or networks so that it is no longer publicly accessible.

## Impact

* Upload, delete, or download sensitive files stored in the document DB
* Send, read, and modify emails from ████ admin 
* Login to ████ proposal system using stolen authentication codes sent to users

## Timeline

- **Report Filed**
- **2019-11-23** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2019-11-24** @byteone: Criticality Update:  It appears the **_production version_** of the API at https://████████ is also exposed as well:

██████████
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2019-12-16** @byteone: Hi @ag3nt-j1,

Just FYI I believe this is now fixed - I just double checked and neither domain will resolve.

Regards,

@apexx
- **2020-04-01** @byteone: Hi @ag3nt-j1  - this is long since fixed, can we change to `resolved`?
- **2020-04-01** @agent-r5: We are still waiting for the system owner to get back to us.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
