---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
date: 2019-01-01
submitted: 2018-04-30T19:54:48.684Z
bounty_usd: null
votes: 20
cve: []
program: "[[programs/ratelimited|RATELIMITED]]"
reporter: "z0mb13"
source: "https://hackerone.com/reports/345162"
title: "Local File Download"
---
# Local File Download

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 20 | **Program:** RATELIMITED | **Disclosed:** 2019-01-01

- Report: [https://hackerone.com/reports/345162](https://hackerone.com/reports/345162)
- CWE: Improper Access Control - Generic
- Submitted: 2018-04-30T19:54:48.684Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **2018-05-01** @z0mb13: Hi @gtsatsis ,
I agree, but the bugs are valid and existed at the time of assessment. So i hope they're counted as valid bugs.
Also, shall I continue reporting bugs on the support subdomain? Because you mentioned that you'll be changing the CMS completely so I thought I should ask once.

Best,
Aditya
- **2018-05-01** @gtsatsis: Hello @z0mb13,

It is up to you whether you are going to continue on reporting vulnerabilities in the current support system, though, we would rather not receiving any more reports on it for now as we're working on the new support system and are hoping to have it released this week.

Best regards,
George
- **2018-05-01** @z0mb13: Hello @gtsatsis , Okay I'll focus on the main domain. Could you please accept my signup via discord?
Thanks.
- **2018-05-01** @z0mb13: Also same kind of vulnerabilities exist on https://support.theendlessweb.com/ as they're using the same helpdesk.
- **2018-05-01** @djelectro: Yea, I'm also looking into a new help desk (I just used the same as RLME because I knew it had a good frontend) might not be using Kyako though.
- **2018-05-03** @djelectro: The helpdesk on support.theendlessweb.com has been replaced.
- **2018-05-03** @z0mb13: Yup, that looks fixed. But the support.ratelimited.me still needs to be updated.
- **2018-05-03** @gtsatsis: Hello @z0mb13,

I am currently working on patching an SMTP bug that has arised with the Kayako Helpdesk on RATELIMITED.

[The cron task just worked so it appears to have been fixed].

I will have the Kayako helpdesk replace DeskPRO within the day.

Best regards,
George
- **Report Resolved**
- **2018-05-04** @z0mb13: @djelectro , Isn't this eligible for a bounty? Considering the criticality of the issue and as it's mentioned on your policy.
- **2018-05-04** @djelectro: Unfortunately, we cannot offer bounties. We use HackerOne community edition/open source, as such, offering money & swag is something we are not allowed to do. (It may mean perks on the actual RLME service, but I heard nothing of that actually happening myself.) I did notice that it does say it is eligible, but I personally cannot control the page, as I am not an admin.

(pinging @gtsatsis to fix please)
- **2018-05-04** @z0mb13: Oh alright, no problem. Can we disclose this report as it's fixed?
- **2018-05-04** @djelectro: I dont see why not. 


Oh god im not sure how to make it public, do you have to request it?
- **2018-05-04** @z0mb13: I think you're supposed to do that from your panel. I can't do that.
- **2018-05-04** @z0mb13: https://support.hackerone.com/hc/en-us/articles/205269479-Public-Disclosure?mobile_site=true
- **2018-05-04** @djelectro: errr, maybe only Admins can do it. It does say a party can request it but personally I don't see an option, the redact button just lets me remove personal information. (HackerOne newb here lol)

EDIT: I dont have the option mentioned in the link you just sent
- **2018-05-04** @z0mb13: No problem, take your time. Go through that link i sent above. :p Not in a hurry at all.
- **2018-05-04** @djelectro: Oh, I see the issue. RATELIMITED is currently a private program for like the next 20 days I believe.

https://support.hackerone.com/hc/article_attachments/360001181426/public_disclosure_3.png

According to this chart we cannot disclose things until we are public. Once the 20 days has elapsed I would be more than happy to disclose it.
- **2018-05-04** @z0mb13: Sure, thanks :)
- **Hacker Requested Mediation**
- **2018-06-19** @gtsatsis: Hello there,

Sadly, due to the economic state of our services (Please note that most services on the RATELIMITED network are funded from my pocket, and we have not even made 50% of what has been invested into the service itself), we are unable to offer monetary compensation.

Please also note that compensation is unable to be offered on our current Hackerone plan (Community/Opensource)

We are willing to offer the following as of yet:
 * RATELIMITED Premium perks/benefits (Basically, bigger upload sizes)
 * Recognition on the service's announcements board
 (In the future, we may offer monetary compensation, but that is not sure as of yet.)

I hope you understand and that we can reach a reasonable resolution.
- **2018-06-19** @z0mb13: It's okay, you should have mentioned it earlier and please update the policy page so does not mislead others. So how can I claim my reward?

Best,
Aditya.
- **2018-06-19** @gtsatsis: In order to claim your in-service reward, you may send me a message on Discord (If you do use it at the moment), or, you may send me the e-mail you signed up with on RATELIMITED on here, or via e-mail at gtsatsis@staff.ratelimited.me 

My Discord username is Illya#0695, and recognition to you will be given as an announcement, linking to your HackerOne profile.

As for report disclosure:
We are currently sitting at 80 invited hackers, and we need 100 in order to launch a public program. If you would like to disclose this report, you may disclose it publicly anywhere, as you now have written permission by us.

We will be disclosing this as soon as we receive access to disclosure tools.
- **2018-06-19** @z0mb13: Thanks a lot. But i think it's up to you to mark this as resolved. I don't have an option here to do so.
- **2018-06-19** @gtsatsis: Sadly, I don't have the option here either, I suppose it is up to Hackerone to decide.
- **2018-06-19** @z0mb13: Yup, consider this resolved from my side. Thanks.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
