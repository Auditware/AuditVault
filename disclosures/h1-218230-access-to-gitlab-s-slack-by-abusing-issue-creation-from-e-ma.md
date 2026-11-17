---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-authentication-generic
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
date: 2017-09-21
submitted: 2017-04-03T00:23:27.224Z
bounty_usd: null
votes: 54
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "intidc"
source: "https://hackerone.com/reports/218230"
title: "Access to GitLab's Slack by abusing issue creation from e-mail"
---
# Access to GitLab's Slack by abusing issue creation from e-mail

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 54 | **Program:** GitLab | **Disclosed:** 2017-09-21

- Report: [https://hackerone.com/reports/218230](https://hackerone.com/reports/218230)
- CWE: Improper Authentication - Generic
- Submitted: 2017-04-03T00:23:27.224Z

## Report summary

SEE BLOGPOST: "How I hacked hundreds of companies through their helpdesk" https://medium.com/@intideceukelaire/how-i-hacked-hundreds-of-companies-through-their-helpdesk-b7680ddc2d4c

## Timeline

- **Report Filed**
- **2017-04-03** @mrchris: Hi Inti,

Thank you for the report. I've lodged an internal issue to discuss the next steps in dealing with this security problem. 

We will reach out once the has been triage to the security team. Please let me know if you have any further questions.
- **2017-04-03** @rspeicher: @intidc Wow, brilliant find and excellent report! We've opened an internal issue to make sure this gets addressed, and we'll keep you updated here on its progress.

Thanks!
- **Report Triaged**
- **2017-08-02** @intidc: Hi @briann,

A very similar issue that was present in a lot of bug bounty programs and I would like to do a blogpost on it in September. I would like to mention the technique I used on GitLab as a side note. Are you OK with that?

Thanks!

Inti
- **2017-08-03** @briann: Hi @intidc,

I know we're looking forward to reading the write-up. As you get closer to publishing information would you mind letting us know? We've discussed some solutions for resolving this vulnerability but as it pretty much affects only gitlab.com and we've blocked it from being exploited for any sensitive services it's been allowed to stagnate a bit. We'll do our best to get a patch out before September, but if we fail we'd really appreciate a heads-up before it goes public.

When a patch is released we'll let you know right away. Thanks again,
- **2017-08-03** @intidc: Absolutely - I'll let you know. From what I found, this affects Slack, Yammer and Phabricator. Will ping you in September so you can proofread it.
- **2017-09-08** @intidc: Hi @briann,

I'd like to publish the blog next Wednesday. It will be about Slack takeovers through support in general, but I'd like to mention this as a side-note. Is that OK? Could you mark this report as resolved and request disclosure?

Thanks!

Inti
- **2017-09-08** @briann: Hi @intidc,

We're in the process of updating our documentation now to inform users how to avoid the dangers of this feature. Once that documentation is published (hopefully later today) we can close this issue and open it to the public. Thanks for letting us know.

I'll update you here shortly.
- **2017-09-10** @intidc: Hi @briann,

This is a **confidential** daft version of the unlisted blog article. 

https://medium.com/@intideceukelaire/how-i-hacked-hundreds-of-companies-through-their-helpdesk-b7680ddc2d4c

I'd like to go live on Wednesday. If you have any feedback or suggestions, please let me know!

Inti
- **2017-09-12** @intidc: Hi @briann,

I would like to publish the blogpost next Monday. Is that OK?

Inti
- **2017-09-12** @briann: Sure. Are you delaying it until Monday because of us? I hope we'll have the changes to our documentation published later today.
- **2017-09-13** @intidc: Hi @briann, Slack is taking some extra measures to prevent abuse (GitLab method will still work however). I delayed the blog so they can ship it in time. Please let me know if the documentation is updated, I'll include a link in the article.

Inti
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
