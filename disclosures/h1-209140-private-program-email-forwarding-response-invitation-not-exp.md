---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/violation-of-secure-design-principles
  - env/web
substate: "resolved"
weakness: "Violation of Secure Design Principles"
enriched: true
date: 2018-05-30
submitted: 2017-02-26T17:03:34.500Z
bounty_usd: null
votes: 38
cve: []
program: "[[programs/security|HackerOne]]"
reporter: "japz"
source: "https://hackerone.com/reports/209140"
title: "Private program email forwarding response invitation not expire after first use."
---
# Private program email forwarding response invitation not expire after first use.

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 38 | **Program:** HackerOne | **Disclosed:** 2018-05-30

- Report: [https://hackerone.com/reports/209140](https://hackerone.com/reports/209140)
- CWE: Violation of Secure Design Principles
- Submitted: 2017-02-26T17:03:34.500Z

## Timeline

- **Report Filed**
- **2017-02-26** @japz: >NO NOT submit the test report (means the email link already used, but you did not continue to submit the report, you are now participants to the program).

Step 3 typo correction on my reproduction steps: That is __DO NOT__ , not NO NOT :)

__Additional information on the bug:__

Please note that this will work when the `Submit Vulnerability Report` button already clicked but the user __DID NOT hit the Submit Report button inside the program submission page.__ (means did not continue submitting the report, but already joined on the program because already clicked the `Submit Vulnerability Report` on the screenshot below:

{F164320}

As you can see on the PoC screenshot above, when that `Submit Vulnerability Report` was clicked, the user/researcher already auto invited to the program (private or not) , but when the user already quit, the user can __reuse__ that button/link to join again.

Regards
Japz
- **Report Informative**
- **2017-02-26** @japz: Hello @asuka ,

>Users could send another email to the programme and receive another invitation to join if they were banned

Thats the point, why HackerOne will allow user to join again after being banned, that is the security implication because the private program banned a user for a reason, if HackerOne will allow them join again, that is not good for the program owner, and banning or will not make any sense.
- **2018-04-23** @japz: Hi @asuka ,

Happy anniversary on this submission, you did not response to my last comment.

You did not even imagine the impact of this, __did you imagine that when the program owner disabled their email forwarding feature, the users can still joined despite they already leave__.

You told me this phrase:

>Users could send another email to the programme and receive another invitation to join if they were banned.

Without analyzing __HOW IF THE PROGRAM DECIDED TO DISABLE THE EMAIL FORWARDING__ ? , but since there is still token no expiring, user can still join.

The good thing now is, after 1 year it seems the token was expiring now, due to some recent bug related to email forwarding.

Pinging @jobert since he is responsing on some of the researcher even after the report was closed, not like @asuka who ignored my last comment after closing my report.

Regards
Japz
- **2018-05-03** @jobert: Hi @japz - thanks for flagging, we'll look into this tomorrow. This may be related to #331691.
- **2018-05-04** @japz: Hi @jobert ,

Thank you so much for your response, really much respect to you :)

>thanks for flagging, we'll look into this tomorrow. This may be related to #331691

You are correct @jobert , this is related/similar to #331691 , This is already fixed now maybe because of fixing #331691 since it is really similar.

The sad thing is i reported it 1 year ago but hackerone staff @asuka is unresponsive and ignore my last comment after he closed the report as informative.

If my submission a year ago was fixed earlier, the issue on this report #331691 will not exist for sure because if the token is expiring after use, no one is allowed to use it again.

I will appreciate if you can re-open and reclosed this as `Resolved` because it is indeed a valid bug.

Hope this will not mistakenly forgotten and or ignored again because of the status (`Informative`) of the report.

Regards
Japz
- **Report Reopened**
- **Report Resolved**
- **Not Eligible For Bounty**
- **2018-05-04** @japz: Hi @jobert 

Thanks for the response.

>Therefor we'll propose a new policy going forward and we'd like your feedback on it.

I would like to say i agree on the new policy, thanks for doing that..

>This report was filed over a year ago, so according to the new policy this report would've remained closed as Informative. Because we didn't have such policy, we're closing this our as resolved.

While you closed the report as `Resolved`, it seems the new policy applies to me when you decided this to not eligible for bounty, but it should not because this policy is not a formal yet. Hehe :)

I'm not sure if that is a bit unfair for me because the report #331691 was rewarded, but this descission is still all up to you.

>In this particular case, I do agree with @asuka's assessment. Our application does not have the ability to disable the Email Forwarding feature and so @asuka's call was correct.

If i'm not mistaken the `████` email forwarding feature is not active for a long time now, that means it is disabled.

Regards
Japz
- **2018-05-13** @japz: Hi @jobert ,

It's been more than a week and haven't heard anything from you, i disagree that my report was not eligible for bounty here while the report  #331691 was rewarded, the vulnerability here was indeed meets the barrier of hackerone's bug that should be eligible for bounty.

While my last comment has been ignored for a year by @asuka instead of asking more info or asking additional proof, he just ignored my last comment, and when the bug  #331691 appeared and fixed, @jobert was able to evaluate that this is a related bug, the bug  #331691 will not be existed if my submission was fixed earlier.

This is a clear miscommunication because @asuka never replied to my last comment after closing the report and did not even coordinated to the team who created the said function (email forwarding) for a clear investigation.

> I do agree with @asuka's assessment. Our application does not have the ability to disable the Email Forwarding feature and so @asuka's call was correct.

@jobert , lets say the program cannot disabled the email forwarding, __BUT__ they can change the email address for that forwarding feature, on `███████` , the email forwarding has been enabled before.. and now it is disabled so i assume they disabled/change/edit the email address for email forwarding, and you guys have to consider that.. When the program changes the email forwarding email, the issue that i submitted is the attacker can still use the invites token and join to the program.

Hope to hear back from you @jobert @asuka @security 

Regards
Japz
- **Agreed On Going Public**
- **Report Collaborator Invited**
- **Report Collaborator Joined**
- **2018-05-30** @bencode: > If i'm not mistaken the ████ email forwarding feature is not active for a long time now, that means it is disabled.
> they can change the email address for that forwarding feature, on ███████ , the email forwarding has been enabled before

The "disable email forwarding" situation needs to be the programs explicit choice to stop allowing hackers access through email. If the program "is not active" or they "change the email address" both indicate that the program is still running and hasn't shutdown their program and attempted to make it private.

---

Thanks for your patience, I know this isn't your desired outcome but sometimes things slip through the cracks, it's something we all will need to work on, aside from adding in policies, to make it fair for everyone. I hope you continue to participate and working with us to improve HackerOne and our community.
- **Agreed On Going Public**
- **Report Became Public**
- **2018-05-30** @japz: Hi @bencode 

>I know this isn't your desired outcome but sometimes things slip through the cracks

You are correct, no researchers wants this outcome, i understand with regards to the things slip through the cracks though.

>it's something we all will need to work on, aside from adding in policies, to make it fair for everyone.

Indeed, specially the internal team! , __BEING RESPONSIVE AFTER CLOSING THE REPORT IS IMPORTANT__ , this report will not get more than a year if the team members manage to response and ask more information.

P.S HackerOne is the main platform so you guys should be the role model of all other program owners, my only request is __be responsive, even after the report was closed, because sometimes researchers have some point and the team members missed it because of being unresponsive.__

Hope everything make sense, have a great day ahead :)

Cheers
Japz
- **2024-05-11** @japz: #
