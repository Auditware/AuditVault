---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-generic
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Generic"
enriched: true
date: 2022-11-16
submitted: 2022-05-24T10:29:44.956Z
bounty_usd: null
votes: 43
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "yvvdwf"
source: "https://hackerone.com/reports/1579645"
title: "XSS: `v-safe-html` is not safe enough"
---
# XSS: `v-safe-html` is not safe enough

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 43 | **Program:** GitLab | **Disclosed:** 2022-11-16

- Report: [https://hackerone.com/reports/1579645](https://hackerone.com/reports/1579645)
- CWE: Cross-site Scripting (XSS) - Generic
- Submitted: 2022-05-24T10:29:44.956Z

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Report Severity Updated**
- **Report Triaged**
- **2022-06-08** @gitlab-securitybot: ETA for fix:

Hi @yvvdwf,

The issue you reported is currently scheduled to be fixed by 2022-08-31.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **Report Severity Updated**
- **Bounty Awarded**
- **2022-07-01** @yvvdwf: Hi @rshambhuni, 

Thank you for the bounty. However I think that it seems that its impact is underestimated. In brief, when users click anywhere attacker can (1) do XSS (without CSP bypass) or (2) issue arbitrary POST/PUT/DELETE requests. I see that there are existing some finding with `high` severity and they have the same impact.

Best regards,
- **2022-07-01** @rshambhuni: @yvvdwf Thanks for your question. We scored this for an XSS (that doesn't bypass CSP) scenario as we felt the CSRF attack vector isn't realistic for the following reasons:
- Almost all of our API calls require a custom header to be present like `Authorization:` or `PRIVATE-TOKEN:` to be sent along with the request which would not make the CSRF attack possible.
- For the scenario you mentioned above in your report, where an admin level user logs in goes this deep into artifacts and clicking somewhere on the page to trigger a CSRF attack, is not realistic in our context as that is not what admin users may do on a day-to-day basis (looking at and debugging job artifacts). I'm assuming CSRF is possible in the scenario you described as the API call you used is relying on admin's cookie for authentication? We haven't found other API calls that allow this kind of privilege escalation on normal users with just a cookie based authentication without requiring custom headers like `Authorization:` or `PRIVATE-TOKEN:` as I mentioned above. Please let us know if you don't think that is the case?

Thank you!
- **2022-07-05** @yvvdwf: Hi @rshambhuni ,

I really appreciate your explanation in details. However I would like to demand you to pay attention on the fact that this is not only a CSRF hijack attack but it allows to inject (almost) any html tags (that will be filled latter by `v-safe-html` directive). Consequently attackers may trick victims to give their passwords into a `<form>` that will be submitted to an attacker-controlled site, for example.

Furthermore, attackers may inject *any* html tags when victim clicks *anywhere*. This leads to full-XSS although the XSS does not occur on Gitlab SaaS due to its CSP protection but it can totally occur on a self-managed instance (I recently saw on GitLab  security release note a no-bypass-CSP XSS that has `high` severity).


Otherwise, please find below an example that allows to inject any `PUT` requests on Gitlab SaaS. These `PUT` requests use legitimate csrf-token thanks to axios library. Consequently this finding allows attackers to perform any `PUT` requests on behalf of victims. Some possible attack scenarios can be: admin escalation as mentioned in the initial report, [the victim can grant more permission (without knowing it) to one of its projects](https://gitlab.com/gitlab-org/gitlab/-/issues/211949#note_308558947), etc.

I managed to automatically the steps of reproduction by using CI jobs. To do so, you need to create firstly a personal token that is required to erase a job to be able to trigger error in its dependencies. Steps to reproduce can be as the following:

- Goto https://gitlab.com/-/profile/personal_access_tokens, then create `a personal access token` with `api` scope.
- In an existing project or create a new project. Then goto its `Settings / CI/CD`. Then add a new variable with `Key` is `API_TOKEN` and `Value` is the token you've created
{F1808833}
- Add or replace `.gitlab-ci.yml` in the project by the one in this attached file
- Wait for a few seconds when the pipeline finished its jobs
- Go to `CI/CD / Jobs` page, you should see a list of finished jobs. The latest job, named `create-iframe` contains the attack. Go ahead, open this job. You may note that there exists a topmost transparent layer that intercepts any clicks. Click anywhere to issue a PUT request to `/any-put-request-url-here` (you can modify this url via  `PUT_REQUEST_URL` variable in `.gitlab-ci.yml` file). One thing I would like to note here is, the topmost transparent layer is hidden after the click. Thus victims may be not aware about the attack.
{F1808831}
{F1808832}
- An example is available here: https://gitlab.com/yvvdwf/xss/-/jobs/2680191065  https://gitlab.com/yvvdwf/xss/-/tree/xss-in-job-dependencies (the repository is private)
- **2022-07-07** @yvvdwf: Hi @rshambhuni ,

When set ` PUT_REQUEST_URL: /-/profile/password?user[new_password]=12345678`, we can takeover any Gitlab account that was created by logging in via third party application,  such as, a Google, Github, Twitter, Bitbucket, or Saleforce.

{F1812532}

To perform this demo, you need to have an account from one of the above providers.

- Following the steps I presented in the previous message above and change the value of `PUT_REQUEST_URL` to `/-/profile/password?user[new_password]=12345678`
- After committing the modification in the `.gitlab-ci.yml` file, wait for few seconds until the CI/CD pipeline finishes its job.
- Now logout Gitlab.com, then login with a thrid party provider to get a new account on Gitlab.com
- (If the attack project is not public, then we need to invite the victim to be a member of the project so that the victim can access to the CI/CD jobs' pages)
- As the victim, you visit the latest job page, named `create-iframe`, which contains the attack, then click anywhere to trigger attack
- Refresh the page, you should now be logged out from Gitlab.com as your password was changed

Consequently, this finding has an ability to allow attackers to takeover a Gitlab account.

Best,
- **2022-07-28** @yvvdwf: Hi @rshambhuni,

Are you able to review the severity of this finding?

Best
- **2022-07-29** @rshambhuni: @yvvdwf You are chaining two different bugs (content injection which you reported in this report and the bug in the profile endpoint that allows password change) to get the impact of of an account takeover for users on a 3rd party OAuth provider. The bug with 3rd party OAuth providers that allows password change is a known issue and is being tracked under https://gitlab.com/gitlab-org/gitlab/-/issues/357952. Since you also reported the same type of attack in a new report, #1647446, the bounty given on this report will be final.

Thank you and we look forward to your next report!
- **Report Resolved**
- **2022-07-29** @yvvdwf: Hi @rshambhuni 

Thank you for the reply. However I cannot agree with your conclusion.  Although you closed the report, I'd like to clarify the impact of this finding one more times:

- The first impact of this finding is stored-XSS without CSP by-pass. It is as you said above. 
- The second impact is to allow sending *any* requests on gitlab.com (with the presence of CSP). These requests are not prevented by CSRF protection (i.e., are accepted by the backend).  I think that you ignored this impact.

Best
- **2022-07-29** @rshambhuni: > The second impact is to allow sending any requests on gitlab.com (with the presence of CSP). These requests are not prevented by CSRF protection (i.e., are accepted by the backend).

@yvvdwf Without using the account takeover bug in 3rd party OAuth providers, since you have used that in #1647446, and since it is known to us, can you share a PoC for another endpoint that can be leveraged to cause impact using the arbitrary requests bug?
- **2022-07-29** @yvvdwf: > @yvvdwf Without using the account takeover bug in 3rd party OAuth providers, since you have used that in #1647446, and since it is known to us, can you share a PoC for another endpoint that can be leveraged to cause impact using the arbitrary requests bug?

@rshambhuni thank you for the reply. Indeed, as the above example allows to send any `PUT` requests, so attackers may execute (on behalf of victim) any API endpoints supporting PUT requests. 

This leads to the admin escalation, as in the initial report. Otherwise, please find in the attached file a demo which allows escalating group permission. For example,  the following [API](https://docs.gitlab.com/ee/api/members.html#edit-a-member-of-a-group-or-project) endpoint can allow the attacker to be `owner` of a group: `/api/v4/groups/37/members/2?access_level=50`,  in which, `37` is ID of the group to take over, `2` is ID of the attacker, and `50` is the owner level. 

Because this finding was mitigated  on gitlab.com, I do the demo on a self-hosted instance but the impact should be the same.
- **2022-07-29** @rshambhuni: @yvvdwf Ok, I'll review the PoC, discuss it internally and will get back to you. Thanks!
- **2022-08-18** @yvvdwf: Hi @rshambhuni , 

Are you able to valid the PoC ?

Best,
- **2022-08-24** @rshambhuni: @yvvdwf My apologies for the delay. I was out of office for the last few weeks. I'll review your PoC and will get back to you soon. Thank you!
- **2022-09-01** @rshambhuni: @yvvdwf My apologies again for the delayed response here. I tried reproducing the arbitrary requests PoC you shared initially (admin escalation) and the owner escalation PoC you shared [here](https://hackerone.com/reports/1579645#activity-17768549) and both of them don't work with cookie based requests. For admin escalation PoC with the payload - `form action=/api/v4/users/6?_method=PUT&admin=true method=post`, when I visit the jobs page as an admin and do the necessary tasks to trigger the payload, I see the request to the above endpoint is being made but it is failing with a `404` error and the attacker does not get promoted to an admin.

Same with the payload that promotes attacker to a group owner. It doesn't work when an admin user clicks anywhere on the `trigger-xss` job page (after doing the necessary steps to set up the payload). I see a `GET` request is made (not a `PUT` request) and the attacker is not promoted to a group owner. 

The following curl command also doesn't work in the command line (where `29` is the group an attacker with user_id `6` wants to become an `Owner` on). I see `{"message":"401 Unauthorized"}` error in the response. Looks like API endpoints [like these](https://docs.gitlab.com/ee/api/members.html#edit-a-member-of-a-group-or-project) only accept an access token in the request.

`curl --request PUT --cookie "_gitlab_session=ADMIN_SESSION_COOKIE" "http://gitlab.example.com/api/v4/groups/29/members/6?access_level=50"`
- **2022-09-01** @yvvdwf: Hi @rshambhuni,

Thank you for your time.

Please find the file `.gitlab-ci.yml` in the attached file that I used for the video PoC. To reproduce, you need to update values of 3 variables:`PUT_REQUEST_URL`, `API_TOKEN` and `GL_HOST`

Otherwise, we can see in the [docs](https://docs.gitlab.com/ee/api/index.html#session-cookie) that cookie is allowed to use to authenticate to API endpoint. I think that your command `curl` does not work because it has not `X-CSRF-Token` header. The following command works on my *local* Gitlab instance:

```
curl 'http://gl.local/api/v4/groups/37/members/2?access_level=50' \
  -X 'PUT' \
  -H 'Cookie: _gitlab_session=cd5c3d9f38eb6d6c5fe0e6b6eeb7dcc0' \
  -H 'X-CSRF-Token: NCCZNxtc+jtgAnbQOvuoRD4Dzq1qSOOpscHlA/41+1ifGk+A0jWTkQfQcv+YStNH5wTRq1/zwgOSaTkRRXAzNg=='
```
Best regards
- **Report Reopened**
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **2022-09-02** @yvvdwf: Awesome, thank you @rshambhuni for your patient while looking into this!!!
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
