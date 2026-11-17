---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/server-side-request-forgery-ssrf
  - env/web
substate: "resolved"
weakness: "Server-Side Request Forgery (SSRF)"
enriched: true
date: 2022-09-14
submitted: 2022-07-06T14:16:13.838Z
bounty_usd: null
votes: 11
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "sudi"
source: "https://hackerone.com/reports/1628102"
title: "Full read SSRF at █████████ [HtUS]"
---
# Full read SSRF at █████████ [HtUS]

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 11 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2022-09-14

- Report: [https://hackerone.com/reports/1628102](https://hackerone.com/reports/1628102)
- CWE: Server-Side Request Forgery (SSRF)
- Submitted: 2022-07-06T14:16:13.838Z

## Timeline

- **Report Filed**
- **2022-07-06** @sudi: Hey team,
Kindly add @hein_thant to this report as a *collaborator* and set the bounty amount to be 1:1
- **2022-07-07** @h1_analyst_dhaval: Hi @sudi,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@saffron
- **Report Severity Updated**
- **2022-07-07** @sudi: Sorry for mentioning it again but can you invite  @hein_thant to this report as a collaborator and set the bounty amount to be 1:1, just wanted to make sure you don't missed it :)

I will try to if I can escalate it further.

Thankyou
- **2022-07-07** @sudi: .
- **Report Triaged**
- **2022-07-07** @h1_analyst_dhaval: Hi @sudi

Since Collaborators feature doesn't seem to be enabled, I'll reach out to internal team with your request to add collaborator.

Additionally, please do not perform any sensitive actions, if you believe you can perform a sensitive action then please provide steps and we will request the Hack U.S. Team for validation.

Kind regards,
@saffron
- **2022-07-07** @sudi: Hey @saffron , thanks for your reply.
In #1627978, I was invited as a collaborator by the h1 triager so I suppose you should be allowed to do the same too here also.

Regards
Sudhanshu
- **2022-07-07** @sudi: >Additionally, please do not perform any sensitive actions, if you believe you can perform an sensitive action then please provide steps and we will request the Hack U.S. Team for validation

I was planning dump the AWS keys for the available iam roles and check for their priveleges , nothing else. Am I allowed to this?
It's full read ssrf which I could use to even hit  their localhost server so I really thing this should be a critical

Regards
Sudhanshu
- **2022-07-07** @h1_analyst_dhaval: Hi @sudi

Thanks for reaching out.

> I was planning dump the AWS keys for the available iam roles and check for their priveleges , nothing else. Am I allowed to this?

Please do not retrieve the keys, I've already set the CVSS parameter Confidentiality to High since you've demonstrated access to http://███/latest/meta-data.

I've used the following CVSS parameters:

█████

If you are able to demonstrate a scenario which impacts Integrity or Availability then please let us know along with reasoning and steps. Please do not retrieve any sensitive information or perform any actions. You can also provide the steps and we can request the Hack U.S. Team for validation.

Regards,
@saffron
- **2022-07-07** @sudi: Hey Hack U.S staff,
Please don't reward a bounty for this report untill @hein_thant has joined the report as a collaborator. 


As saffron already pointed this out earlier:
>Since Collaborators feature doesn't seem to be enabled, I'll reach out to internal team with your request to add collaborator

Regards
Sudhanshu
- **2022-07-07** @h1_analyst_dhaval: Hi @sudi

The bounty splitting feature has now been enabled, I request if you can please invite the fellow researcher and set the bounty weight accordingly.

- https://docs.hackerone.com/hackers/payments.html#bounty-splitting

Regards,
@saffron
- **Report Collaborator Invited**
- **Report Collaborator Joined**
- **2022-07-07** @sudi: Hey @saffron , thanks for the headsup :)
- **Bounty Awarded**
- **Bounty Awarded**
- **2022-08-16** @agent-j5: Greetings @sudi, I was hoping you could test this to see if it is still valid, or provide me with the login credentials so I can test.  I requested an account but have not gotten an email verification yet so I am unable to test the mitigation of this vulnerability.  Thank you.
- **2022-08-16** @sudi: Hey @agent-j5 ,
Here are the creds: 
████████

I also verified the fix, I am not able to Create or Edit any LRS Configuration now, this error is show if I try to do so (even with public domains):
███████
██████

As I couldn't create any new lrs config , so I tried with the one which I initially used when I was submitting this report.Upon clicking on the run test config, this error is thrown:

██████████

*The configured LRS endpoint appears unsafe -- please provide a fully-qualified, public domain name.*

It doesn't seems to reproducible anymore

Regards
Sudhanshu
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
