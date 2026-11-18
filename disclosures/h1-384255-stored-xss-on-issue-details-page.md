---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2018-10-30
submitted: 2018-07-19T17:49:43.530Z
bounty_usd: null
votes: 16
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "8ayac"
source: "https://hackerone.com/reports/384255"
title: "Stored XSS on Issue details page"
---
# Stored XSS on Issue details page

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 16 | **Program:** GitLab | **Disclosed:** 2018-10-30

- Report: [https://hackerone.com/reports/384255](https://hackerone.com/reports/384255)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2018-07-19T17:49:43.530Z

## Report summary

The detail page of Issue (the page that provides the content of an Issue) is vulnerable to Stored XSS.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
The detail page of Issue (the page that provides the content of an Issue) is vulnerable to Stored XSS.

**Description:**
The two exploits are via the function of submittin an issue or the function of editing an issue.
This vulnerability is reproduced in `Firefox` and`Chrome`. `IE11` and`Edge` are not. I did not test the reproduction on other browsers.

## Steps To Reproduce:
1. Sign in to GitLab.
2. Click the "[+]" icon.
3. Click "New Project".
4. Fill out "Project name" form with "PoC".
5. Check the check box of "Public".
6. Click "Issues"
7. Click "New issue" button.
8. Fill out the each form as follows:
    * Title: PoC
    * Description: `![xss" onload=alert(1);//](a)`
9. Click "Submit issue".

Furthermore, when editing an already existing issue, you can also reproduce by entering A in the "Description" form and saving it.

## Impact

The security impact is the same as any typical Stored XSS.

Thank you!

## Timeline

- **Report Filed**
- **2018-07-19** @jritchey: Hi @8ayac ,

Nice find, thanks for reporting this! I just validated that this a Persistent XSS issue. We are working internally on resolving the issue at https://gitlab.com/gitlab-org/gitlab-ce/issues/49422. We are working to get this patched immediately. 

The issue will be made public 30 days after a patch has been released. We will keep you updated on our progress via HackerOne.

Best regards,
James
- **Report Triaged**
- **2018-07-22** @8ayac: Hello, @jritchey ,

I'd like to update the serverity from Medium to High. I evaluated this vulnerability using "CVSS v3.0", so the servertiy is now Medium. However, considering other published reports and the the definition in a policy, I realized that Medium is not appropriate. Can you update it?

Thanks.
- **Report Severity Updated**
- **2018-07-23** @jritchey: @8ayac ,

Yeah, not a problem. Set it to High

Best,
James
- **2018-07-23** @8ayac: @jritchey ,

Thank you for your prompt response!
- **2018-08-04** @8ayac: Hi @jritchey ,

How's the state of progress after that?

Thanks.
- **2018-09-12** @8ayac: Hi @jritchey ,

About 2 months have passed since I reported this issue.
I have asked you once, can you tell me the progress?

Thanks.
- **2018-09-12** @jritchey: @8ayac , there's not much update on this issue, but I wish there was more. I'm pinging the dev team again on this and will increase it's visibility.  Thanks for reaching out on this
- **2018-09-20** @asaba: Hi @8ayac, this has been scheduled for release in version 11.6, Dec 22, 2018.
- **2018-09-21** @8ayac: Hi @asaba,thank you for notifying the progress. I am looking forward to the day of release!
- **2018-09-21** @8ayac: Hello @jritchey,

Thank you for checking the progress.
By the way, is this report eligible for awards?
Even if it is not a bounty but a swag, I'm surely glad.

Best,
8ayac
- **2018-09-21** @jritchey: @8ayac ,

Yes, I can get you some swag. What is your email? (I can redact it before making the report public).

Best regards,
James
- **2018-09-22** @8ayac: @jritchey,

Thanks. 
My email is `████████`.
- **2018-09-30** @8ayac: @jritchey,
I told you my email, but I have not received any contact yet.
Have you checked it?
- **2018-10-02** @jritchey: @8ayac ,

I just requested a swag code to be sent to your email.

Thanks again for reporting this issue! We've recently released the patch at https://about.gitlab.com/2018/10/01/security-release-gitlab-11-dot-3-dot-1-released/. We can set this issue to public in approximately +30 days.

Best regards,
James
- **Report Resolved**
- **2018-10-03** @8ayac: Thanks, @jritchey.

I'm looking forward to receiving my first swag in the Bug Bounty program.

Cheers!
- **2018-10-08** @jritchey: @8ayac ,

Have you received an email yet regarding the swag?

Best regards,
James
- **2018-10-08** @8ayac: @jritchey,

I have not received it yet.
I was just about to ask you.
When can I receive it?

Thanks,
8ayac
- **2018-10-08** @8ayac: @jritchey,
I received it certainly, thank you.
- **2018-10-30** @8ayac: @jritchey ,
May I publish this report?
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2018-10-30** @8ayac: @jritchey ,
I want to disclose a full report, why is it limited?
- **2018-11-01** @jritchey: @8ayac ,
Please check now. H1 had a strange process of disclosing the report.

Best regards,
James
- **2018-11-01** @8ayac: @jritchey,
Oh, I get it!
Thanks.
