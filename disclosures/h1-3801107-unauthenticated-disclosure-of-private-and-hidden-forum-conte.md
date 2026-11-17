---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-access-control-generic
  - env/web
  - stack/wordpress
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
date: 2026-10-12
submitted: 2026-06-14T04:06:47.154Z
bounty_usd: null
votes: 24
cve: []
program: "[[programs/wordpress|WordPress]]"
reporter: "winstoncrooker"
source: "https://hackerone.com/reports/3801107"
title: "Unauthenticated disclosure of private and hidden forum content in bbPress via the WordPress core REST single-item endpoint"
---
# Unauthenticated disclosure of private and hidden forum content in bbPress via the WordPress core REST single-item endpoint

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 24 | **Program:** WordPress | **Disclosed:** 2026-10-12

- Report: [https://hackerone.com/reports/3801107](https://hackerone.com/reports/3801107)
- CWE: Improper Access Control - Generic
- Submitted: 2026-06-14T04:06:47.154Z

## Timeline

- **Report Filed**
- **2026-07-11** @winstoncrooker: any updates?
- **2026-07-21** @winstoncrooker: Been little over a month since report was submitted wondering if you guys had any updates?

Thanks, 
Winston
- **Report Triaged**
- **2026-08-13** @winstoncrooker: Hey, @emaralive thanks for validating the vulnerability! I hope you can take some inspiration for the fix from my "Recommendation" section of the report to get this patched as soon as possible.
- **2026-09-11** @jjj: Thanks for the thorough report and for your patience while I worked through it.

I reproduced the unauthenticated disclosure and committed the fix to bbPress trunk in r7481. The forum, topic, and reply post types now use a bbPress REST controller that enforces private and hidden forum permissions, including restricted ancestors, for both single-item and collection responses. The same protection now applies to attachments whose parent is a forum, topic, or reply.

I also backported the fix to the 2.6 branch in r7482. The 2.6 post types remain excluded from REST by default, but installations that enable REST support through custom code will receive the same permission checks.

The regression suite covers public, private, and hidden forums; restricted ancestors; participants, Keymasters, direct and inherited forum moderators, and filter-granted moderators; Core post-status restrictions; collections and search; and attachments parented to each bbPress post type.

Thank you very much for helping keep bbPress secure!
- **2026-09-11** @winstoncrooker: Hey @jjj, thanks for the thorough fix and for walking through exactly what landed. Going
beyond what I reported to also cover restricted ancestors and attachments parented to a
forum/topic/reply is a better outcome than the single-item patch I suggested, and the
backport to 2.6 in r7482 means installs that enable REST through custom code are covered
too. Glad the regression suite ended up that broad.

A few things I wanted to ask now that trunk is patched:

1. CVE assignment. This is sitting at Critical 9.3 as an unauthenticated disclosure of
private and hidden forum content, and there is now a public fix with two commit
references (r7481 and r7482). Is a CVE planned? Happy to supply anything useful for the
request, including the affected version range and the CWE.

2. Release and disclosure. Is there a release this is targeted for, and would you like me
to hold off talking about it publicly until that ships? I am in no rush and will follow
whatever timeline works for you, I would just like to know when it is fine.

3. What is left to close this out. It has been triaged since August 11 and the fix is now
committed, so I assume the remaining step is the release going out and the report moving
to resolved. Is that right, and does the reward get decided at that point? Just want to
understand where it sits rather than keep checking in.

Thanks again for taking it seriously and for the detail in the writeup.

Winston
- **Report Resolved**
- **2026-09-12** @winstoncrooker: Hi @jjj, thanks for closing this out, and for the detail on r7481 and r7482.

Before it goes quiet I wanted to ask about the reward decision. The report closed without one and I cannot tell from my side whether that is final or still pending, so I would rather just ask than guess.

The reason I am asking rather than assuming is the program guidelines, which say bounties are doubled when a bug is reported before it is released to users. That is what happened here: the regression was introduced in the 2.7.0 development line and I reported it while 2.6.x was the shipping release, so no installed site was ever exposed. If that pre-release timing is instead what makes the report ineligible, I would genuinely like to know, because it changes how I handle the next one I find in trunk. Either answer is useful to me.

Two smaller things from my last comment that I think got missed when the report closed:

CVE. Is one planned? There is now a public fix with two commit references and the CVE field on the report is empty. Happy to supply the affected version range and the CWE if that saves you time.

Disclosure. Is there a release this is targeted for, and would you prefer I hold off on discussing it publicly until then? I am in no rush, I just want to follow your timeline.

Thanks again for the fix. Extending it to restricted ancestors and to attachments went well past what I reported.

Winston
- **Agreed On Going Public**
- **2026-09-13** @johnbillion: @winstoncrooker It usually takes us a few days after closing a report to make a bounty payment. It goes into a separate queue for us to deal with and we frequently encounter payment processing issues.  The bounty payment will be doubled as this was, as you stated, reported during development of 2.7. Many thanks.

I'll leave it to the bbPress team to answer y0our questions about the release and disclosure timeline. FYI we rarely request a CVE for issues that don't affect WordPress core because the workload is just too high. You're free to request one and it can be attached to this report prior to disclosure.

In case you've not seen it, the program policy was changed recently in order to refocus on high severity issues:

1. https://make.wordpress.org/security/2026/09/01/updates-to-the-wordpress-vulnerability-disclosure-program/
2. https://hackerone.com/wordpress
- **Bounty Awarded**
- **Report Became Public**
