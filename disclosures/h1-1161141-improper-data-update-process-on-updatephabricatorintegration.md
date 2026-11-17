---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/information-disclosure
  - env/web
substate: "informative"
weakness: "Information Disclosure"
enriched: true
date: 2021-04-30
submitted: 2021-04-12T06:03:10.811Z
bounty_usd: null
votes: 16
cve: []
program: "[[programs/security|HackerOne]]"
reporter: "nukedx"
source: "https://hackerone.com/reports/1161141"
title: "Improper data update process on UpdatePhabricatorIntegration mutation leads to leak of Phabricator Conduit API token."
---
# Improper data update process on UpdatePhabricatorIntegration mutation leads to leak of Phabricator Conduit API token.

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 16 | **Program:** HackerOne | **Disclosed:** 2021-04-30

- Report: [https://hackerone.com/reports/1161141](https://hackerone.com/reports/1161141)
- CWE: Information Disclosure
- Submitted: 2021-04-12T06:03:10.811Z

## Timeline

- **Report Filed**
- **2021-04-12** @nukedx: We also noticed that during our tests since there is no control for existing escalation to **Phabricator** unlike jira, we can assign multiple issues for it and even when they are removed via `RemoveReference` mutation, system is not removing bi-directional notification for removed reference. It just retrieves previous reference to the report (see F1262378) which we believe that reason for sending notifications for the removed references keep happening.

Even though it changes to previous one due to previous one being active removed reference is still getting updates for the report.
- **2021-04-12** @h1_analyst_leon: Hi @nukedx,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@tuxedo
- **2021-04-13** @h1_analyst_leon: Hi @nukedx - I'm discussing this submission internally with the HackerOne team. You will be updated as soon as there is additional information to share. Thanks for your patience!
- **2021-04-14** @wvdv: Hey @nukedx,

Thanks for the great write-up! I loved reading it and thought the technique you used to extract the API token is a smart one! 

However, to pull off this attack, you'll need a malicious team member with program management permissions. I've double-checked the permissions on mutation and confirmed we only allow Phabricator integration changes if you have management permissions on the team.

Having a rogue team member/manager is the problem. There's little our platform can do to defend against such a scenario. Therefore, I believe this report is not describing a valid security vulnerability.

What do you think of my assessment? 

Thanks!
- **2021-04-14** @nukedx: Hi @wvdv,

Firstly, thanks for kind words :). I'm pleased to hear that you loved reading it.

Well I agree with you that having malicious team member it's programs fault but this is still valid security vulnerability because, team members shouldn't be allowed to update `base_url` when there is valid connection. When we disconnect entry on database is removed and when we add new connection it's generating new id for connection.

That's one of the reasons I set privileges high on CVSS, I know this shouldn't be treated as crit original score was 8.7, but looks like there is an additional score for this asset.
 
Sadly, unlike previous times, when we were allowed to add many team members to sandbox programs I could check other permissions for RBAC sadly now I can not but I believe attacker should be having `Edit profile, program and bounty settings` permissions under `Program` group.

As mentioned being ability to update `base_url` is troublesome which leads to API token leak as demonstrated, yet we can see that ability to update `base_url` is not in UI itself, neither `api_token` is retrieved via GraphQL queries.

On programmers perspective, I highly believe controlling existing connection and preventing `base_url` update in case of this, would easily solve this issue and which should be done in first place :)

Still from my assessment this is a security vulnerability because of the given facts.

I would be love to hear what you think for it as well :)

Nonetheless, please stay safe and be well.

Sincerely,
@nukedx
- **Report Informative**
- **2021-04-14** @nukedx: Hi Willian,

Thanks for reply and your willingness to keep discussion going. I believe you are confusing some stuff, problem is lying on for both integration creating process and updating process same GraphQL mutation is used `UpdatePhabricatorIntegration`, code on backend probably looks like this (I'm not really good at ruby but I'll try to simulate

```ruby
require "phabricator_integration"
require "session"

team_id = session.user.team_id

if PhabricatorIntegration.is_having_active_connection(team_id) do
     return PhabricatorIntegration.show_ui_for_updating_parameters
else
     return PhabricatorIntegration.show_ui_for_creating_connection
end
 ```

So above is sample ruby code checking if current user's team is having active Phabricator connection and showing UI, if not it's showing UI for creating new connection.

However on UI for updating integration there is no option for updating `base_url` neither for `api_token`, meanwhile only way to change URL is disconnecting it and creating new one.

I recorded video for how it's processing on normal user which you can find below and I highly believe when you check it you will understand my point of view:

████████

As we can see on video, integration's ID is not changing when URL updated and there is no UI option for it :).

If you are going to add an option for updating `base_url` on UI or if there was an option for it, I could understand your point of view.

So my suggestion would be, either add `base_url` changing option on UI as well as maybe add option for changing `api_token` and if no token is in present just update URL like as it now or separate creating and updating process from each other by using their own functions and do not update URL on update.

I hope this makes it more clear.

Please be aware that while it's programs own responsibility if they are having malicious actor, it's still also HackerOne's responsibility to minimize such threat actors because most of attacks actually coming from insider threats, maybe your point of view for threat model is different from me.

PS: What I mean for RBAC, on previously we could add extra users to sandbox program with different access rights as of now we can only have our own account can not add new users, I believe we can still change our permissions but and we can not change our user to none admin because team must have only one admin, yet demo-member is not treated as actual admin when we are trying to change our group.

Sincerely,
@nukedx
- **2021-04-14** @wvdv: Thanks for the additional info @nukedx! Let me think about it some more, I will come back to you!
- **2021-04-14** @nukedx: Sorry for additional message, since you mentioned you want to keep teams changing URL without changing `api_token` and being able to use it same, I go for disconnecting and sending only URL with GraphQL request for checking if previous `api_token` is stored.

{F1265017}
{F1265018}

As we can see from above examples, we can not either send them as empty because function on backend is expecting them to be not blank and in present.

I hope this will also make it more clear.

Edit: I didn't see your reply and was typing. I hope it will be useful, as a fellow engineer I'm more than happy to keep discussion going on :)
- **2021-04-20** @nukedx: Hi @wvdv,

I hope all is well on your end, It has been almost a week I didn't hear back from you, is there any change on your thoughts for this issue?

Sincerely,
@nukedx
- **2021-04-24** @wvdv: Hey @nudex, I've asked a co-worker for a second opinion and we believe this isn't a security vulnerability. Granted, it's odd to have such a mutation and not have a UI that supports these operations but that has to do with some previous iteration of the UX of this integration.

I hope you have a great weekend!

Willian
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
