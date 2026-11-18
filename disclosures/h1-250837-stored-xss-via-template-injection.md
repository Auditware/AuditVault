---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - stack/wordpress
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2017-12-11
submitted: 2017-07-18T14:56:15.741Z
bounty_usd: null
votes: 12
cve: []
program: "[[programs/wordpress|WordPress]]"
reporter: "morningstar"
source: "https://hackerone.com/reports/250837"
title: "Stored xss via template injection"
---
# Stored xss via template injection

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 12 | **Program:** WordPress | **Disclosed:** 2017-12-11

- Report: [https://hackerone.com/reports/250837](https://hackerone.com/reports/250837)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2017-07-18T14:56:15.741Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello Sir , I found Stored XSS in https://mercantile.wordpress.org/
POC is attached .
Steps to reproduce:
1.Login to your account.
2. Go to https://mercantile.wordpress.org/my-account/edit-address/ & fill details , press save & intercept this request in burp suit.
3.change name to {{constructor.constructor('alert(1)')()}} & forward request. as shown in screenshot.
Xss will popup when you visit your account page.
 
    Although its self XSS. but  following attack  scenario makes it useful.
Anyone can make account on https://mercantile.wordpress.org/ using someone else email id, Its not verifying whether its your email id or not. Lets consider "A" makes account with "B" persons email & by using this technique store XSS payload in its account. After that "B" wants account on mercantile.wordpress.org with same email. so rather creating account with new email, "B" person just do forget password & recover & recover his account. but xss payload is still there in his account so attacker "A" can access victim "B" account anytime.
        One more thing, even after changing name with https://mercantile.wordpress.org/my-account/edit-account/ setting payload is not removed its still there. so its make attack more sophisticated. 
     
Thanks & Regards,
Akshay

## Timeline

- **Report Filed**
- **Report Triaged**
- **External User Joined**
- **Report Severity Updated**
- **2017-07-22** @morningstar: Hello sir, Thanks for reply, i was bit busy. can i report more vulnerabilities on  mercantile ? or i have to do that after your audit ?
- **2017-07-24** @iandunn: It'd be best to wait until the audit is done, since most of the issues are low-hanging fruit that we're already aware of, and are very likely to be fixed by the audit.

Once that's done, though, we'd love to get more testing for anything we miss.
- **External User Joined**
- **2017-08-01** @morningstar: May be you already aware of this, if not then Fix this too in your audit, not a security issue. But ████ 
██████
██████ 
████████ ███████ ██████  █████████. ██████████ 
Thanks, 
Akshay.
- **2017-08-01** @iandunn: ██████
- **2017-08-02** @morningstar: Wew nice feature :p
- **2017-08-05** @morningstar: Any ETA about audit?
- **2017-08-07** @iandunn: The developer has started on it, but hasn't reached the point of deploying a fix for this one yet. I'm hoping it'll be next week, but can't guarantee that at this point.
- **2017-08-17** @morningstar: updates?
- **2017-08-18** @iandunn: We've made more progress, but not as quickly as I hoped. 

Sorry for the ongoing delays, this and some of the related issues have turned out to require a large amount of refactoring because some of the fundamental architecture was insecure. It'll probably be another few weeks, but it's hard to give an exact estimate.
- **2017-08-30** @iandunn: Just wanted to let you know that the refactoring is taking longer than expected, but is still being actively worked on. Thanks for your patience!
- **2017-08-31** @morningstar: thanks for updates
- **2017-09-04** @morningstar: updates? seems like fix.
- **2017-09-04** @iandunn: We've deployed a few changes, but are still working on the complete solution, so I don't think this is fully resolved yet.
- **2017-09-14** @morningstar: any updates?
- **2017-09-14** @aaroncampbell: Hey @morningstar,

@iandunn is out for the week. The audit is ongoing but still incomplete. We'll update you here as soon as it's complete.

Thanks,
Aaron
- **2017-09-27** @iandunn: Hey, just wanted to let you know that we're making progress. We've deployed some code that gets us closing to fixing this, but not the actual fix yet. We keep running into new obstacles, but are getting closer. Thanks for your patience :)
- **2017-10-16** @iandunn: Hey, sorry for the slow progress here, just wanted to let you know that we're still actively working on it and making progress.
- **2017-10-17** @morningstar: no problem @iandunn take your time :) & thanks for updates
- **2017-11-07** @iandunn: Hey, just wanted to give you an update. We're still actively working on it, but unfortunately we're still not done yet. It's turned out to be a pretty big project.

The old site architecture was fundamentally insecure, and there were some other problems that made long-term maintenance untenable. So, we're ripping out all of the Angular code from the site and replacing it with other solutions. As you can imagine, there are a lot of interconnected pieces that need to be updated, and of course that work has to be balanced with other priorities as well.

We've made about 70 commits to the repository in the last few months related to that, and those have all been deployed to the site, but there's still more to do before we can completely remove Angular.

It could be a few more months before all of the changes are ready. I know that's a long time to wait, but I really appreciate how patient you've been.

Thanks,
Ian
- **External User Removed**
- **Bounty Awarded**
- **2017-11-17** @iandunn: We haven't removed all of the Angular yet, but I think it's at the point now where this can be re-tested. Can you see if you're able to bypass any of the fixes?
- **2017-11-18** @morningstar: yup, Its not fixed yet. I am still able to reproduce issue with same method above.
- **2017-11-21** @iandunn: Ah, yeah, I see that now, thanks. I let the dev know. I'll get you an update when he's had a chance to fix it.
- **2017-12-07** @iandunn: Ok, I think we finally got this fixed. I'm no longer able to reproduce it in my tests.

Sorry that it took so long, but I really appreciate how patient you were!

Do you mind re-testing one last time?
- **2017-12-08** @morningstar: fixed :) no longer reproducible .
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
