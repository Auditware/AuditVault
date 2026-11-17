---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/path-traversal
  - env/web
  - stack/wordpress
substate: "resolved"
weakness: "Path Traversal"
enriched: true
date: 2020-06-09
submitted: 2018-11-08T09:53:53.284Z
bounty_usd: null
votes: 164
cve: []
program: "[[programs/wordpress|WordPress]]"
reporter: "simonscannell"
source: "https://hackerone.com/reports/436928"
title: "RCE as Admin defeats WordPress hardening and file permissions"
---
# RCE as Admin defeats WordPress hardening and file permissions

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 164 | **Program:** WordPress | **Disclosed:** 2020-06-09

- Report: [https://hackerone.com/reports/436928](https://hackerone.com/reports/436928)
- CWE: Path Traversal
- Submitted: 2018-11-08T09:53:53.284Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **2018-11-08** @simonscannell: Hi Ian,

Thank you for appreciating my work. :) 

I've read somewhere that WordPress 5.0 is scheduled for November 19th. Is that true and will the release fix the vulnerabilities?
- **2018-11-08** @iandunn: That is [the current release date for 5.0](https://make.wordpress.org/core/5.0/), but we typically release security fixes in minor updates, since those are installed automatically by most WP sites, whereas major releases require the user to manually update.

So, depending on various factors, we'll either do a `4.9.9` release before 5.0 comes out, or a `5.0.x` one after it does. At this point, I'd guess we'll do a `5.0.x` release. There may be non-security minor releases in the `5.0` branch before the security release comes out, but we're still planning to release the fix for #404323 before December 15th. Release dates for the other issues you've reported are still TBD.
- **Report Severity Updated**
- **2019-07-24** @simonscannell: Hi Ian,

could you please add ████████ or the user `karimeo` to this report as a participant with me having the full bounty? He is a collegue of mine at RIPS. Since I'm going to leave RIPS, it would be cool if you could add him here so that he can communicate with you regarding disclosure timelines etc.
- **2019-07-24** @iandunn: Hey Simon, I've invited him. Best of luck in whatever you pursue next :)
- **External User Joined**
- **2019-09-17** @whyisjake: Hi there @karimeo and @simonscannell,

We have a patch and test here that we'd love to gather your feedback on.

Please let me know if you are able to replicate the issue, or if you have any other feedback.

Cheers,

@whyisjake
- **2019-09-17** @simonscannell: Hi @whyisjake,

I think the patch should work!

Do you agree, @karimeo?

Best,
Simon
- **2019-09-18** @karimeo: Hey,

Looks good to me.  This prevents the path traversal at that point. 

Best regards,
Karim.
- **2019-11-17** @simonscannell: Now that WordPress 5.3 has been released, will the next minor release contain this patch and the one for #424751?
- **2019-11-17** @peterwilsoncc: Hi @simonscannell 

This was patched in [[46476]](https://core.trac.wordpress.org/changeset/46476) for 5.2.4.

Please accept my apologies for missing the followup paperwork, some last minute changes were made to the release. The release notes will be updated during the week.

I've moved this ticket through to the program's bounty queue.

Thank you!
Peter
- **2019-11-17** @simonscannell: Hi @peterwilsoncc 

To be honest, I'm disappointed. I know that you guys are understaffed and patches may have some delays because of that, but forgetting to mention a, rated by WP itself, critical vuln is another thing.

Please take note that I am no longer working for RIPSTech and this is entirely my personal opinion.

I'm not mad or pointing fingers since I don't know what happened but from the perspective of a Security Researcher:
WordPress is Open Source Software and altough Automattic should, they do Not Sponsor high payouts like Magento for example does. That means the only reason for a researcher to spend hundreds of hours on doing research about the WP core is 1) the moral appeal of making
The internet safer and 2) recognition. Taking both away by letting researchers wait months and sometimes years for a patch and by forgetting to mention the researcher in the changelogs is not a long term strategy to get skilled researchers to submit bugs. 

I also don't want you to feel like this is me being mad. I will continue to submit bugs if I find them and am Happy to work with you, I just don't want to pretend I am not frustrated after this. Some of these vulnerabilities were literally found after me dreaming about them, waking up on a sunday morning and running to the office to work for 12 hours with a headache to confirm the vulnerability. That's the other side of the story.

What about #424751?

But then again, I am not mad or making anyone responsible for this and I hope this message has been received the way I intended to, one without blame or anger but merely a genuine statement and hoping to work together again after my sabbatical.

All the best,
Simon
- **2019-11-17** @simonscannell: And thank you for Processing this now.
- **2019-11-18** @peterwilsoncc: Hi Simon,

I understand your disappointment and accept your criticism and feedback.

In order to address this issue, I've reviewed our release process, and will be updating it to ensure that all fixes are verified to have a matching note in the release documentation, prior to publication.

> What about #424751?

There were some issues on the patch caught internally. I will check my notes and add comments to the ticket by Wednesday this week.

> I am no longer working for RIPSTech

Yep, understood this is personal feedback. Thanks for the time you dedicated to WordPress while there, your contribution and feedback are very much appreciated. 

In previous releases, we've credited you as "Simon Scannell of RIPS Technologies". How would you like us to credit you going forward?

Enjoy your sabbatical, and I look forward to us working together more when you get back,
Peter
- **2019-11-18** @simonscannell: Hi Peter,

Thank you for listening! 

I am looking forward to seeing your notes on this, just know that incase any questions arise on wednesday that I am going to be without internet for another week from that point on.

As for credits: since I did find the vulnerabilities during my time at RIPS Tech, please continue to use "Simon Scannell of RIPS Technologies". Thank you for asking!

Simon
- **2020-01-14** @simonscannell: Is there an ETA for Resolution of this ticket? :)

All the best,
Simon
- **2020-01-14** @simonscannell: Is there an ETA for Resolution of this ticket? :)

All the best,
Simon
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Cancelled Disclosure Request**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
