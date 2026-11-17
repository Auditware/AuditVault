---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - stack/wordpress
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
date: 2019-03-08
submitted: 2019-01-28T07:45:00.790Z
bounty_usd: null
votes: 337
cve: []
program: "[[programs/wordpress|WordPress]]"
reporter: "klmunday"
source: "https://hackerone.com/reports/487081"
title: "Stored XSS in Private Message component (BuddyPress)"
---
# Stored XSS in Private Message component (BuddyPress)

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 337 | **Program:** WordPress | **Disclosed:** 2019-03-08

- Report: [https://hackerone.com/reports/487081](https://hackerone.com/reports/487081)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2019-01-28T07:45:00.790Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **2019-02-01** @klmunday: Hi John,

Thank you for the quick response, I am glad to hear that a patch is already underway
I've got some spare time this weekend so I may be able to dig a bit more into this.

Thanks again,
- **2019-02-03** @klmunday: Hello,

I have done some more digging and have discovered that this is only an issue with the Nouveau Template pack and is not present in the Legacy pack.

I found that by changing `{{{data.content}}}` to `{{data.content}}` in `common/js-templates/messages/index.php` causes the message contents to be rendered as plaintext within the messages. However, since the Editor uses html tags for its markdown (and all the messages are wrapped in <p> tags) I found this to not be a sufficient solution. 

I will let you know if I find anything else

Hope all is well,
-KLMunday
- **2019-02-07** @jjj: Hey @klmunday,

Thanks for the update. Our team ended at a similar, but slightly changed, end result.

In addition to the bracket changes in the template output, we've also removed some calls to `html_entity_decode()`, as a way to reverse the problem without breaking existing installations.

I've attached the patch, which we've tested and confirmed fixes the issue as we understand it.

If you agree this adequately addresses your findings, our goal would be to release an update to BuddyPress next week, or the early part of the week after next.

Thank you again, and talk soon
- **2019-02-08** @klmunday: Hello @jjj

Happy to say I can't find any way to break this.
I am happy with this as a solution

Thanks again
- **2019-02-08** @klmunday: I may have spoke too soon, it seems you can inject some html into the Subject now, I can seem to get <b> and <i> working fine, possibly others though

Was an easy fix though, just change all uses of `{{{data.subject}}}` to `{{data.subject}}` in `messages/index.php`
Doesn't seem to break anything - not sure if it was intended to be changed

Seems all fine with that change
- **2019-02-14** @jjj: Inviting HackerOne user foobar7, as he's reported a duplicate of this same issue.

As a general update to all participants, @boonebgorges will be taking over communication here, as he's been largely responsible for researching and patching this issue behind the scenes.

Thank you very much again for your continued patience.
-JJJ
- **External User Joined**
- **2019-02-18** @boonebgorges: Hi all -

I'm attaching an updated patch addressing the issue.

@klmunday You are correct that the previous patch allowed for some HTML to be passed into Subject lines. This was not a security vulnerability, as this markup was validated using a tag whitelist and `wp_kses`. However, it was an unintended and undesirable change in behavior. As such, the updated patch strips HTML tags altogether in the subject and excerpt contexts. In addition, there are some changes in the patch related to the way that the avatar URL is returned from the AJAX endpoints; these changes don't address any vulnerabilities that we're aware of, but they make our character handling more transparent and consistent with the other changes in the patch.

The current plan is to ship a BuddyPress security and maintenance release later this week, which will include the fix. @klmunday and @foobar7 If you'd like to be cited in the release post, please let me know what name and/or link to use. See https://buddypress.org/2018/01/buddypress-2-9-3-security-and-maintenance-release/ for a past example.
- **2019-02-18** @klmunday: Hi @boonebgorges,

Tested the patch and it works perfectly,
ah yeah I always forget about `wp_kses`

Please cite me as [Kieran Munday](www.klmunday.com)

Thanks again!
- **2019-02-19** @foobar7: Hi @boonebgorges,

you can cite me as Tim Coen (https://security-consulting.icu/). 

Thanks!
Tim
- **2019-02-20** @boonebgorges: Hi all - BuddyPress 4.2.0 has been released, and includes a fix for this issue. Thanks to both of you for coordinating with our team. https://buddypress.org/2019/02/buddypress-4-2-0-maintenance-and-security-release/
- **2019-02-27** @klmunday: Hi Boone,
That is great news!
If it is fine with both of you, when this is Resolved would it be possible to have full disclosure?

Thanks,
Kieran
- **Report Resolved**
- **2019-02-28** @foobar7: HI @klmunday ,

I'm not sure if the question was also directed at me,  but from my side you can go ahead and disclose this report.

Best,
Tim
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Bounty Awarded**
- **2019-03-25** @klmunday: Thanks for the bounty!
