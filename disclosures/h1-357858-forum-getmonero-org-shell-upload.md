---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/code-injection
  - env/web
substate: "resolved"
weakness: "Code Injection"
enriched: true
date: 2018-07-27
submitted: 2018-05-26T13:26:09.625Z
bounty_usd: null
votes: 43
cve: []
program: "[[programs/monero|Monero]]"
reporter: "kaulse"
source: "https://hackerone.com/reports/357858"
title: "forum.getmonero.org Shell upload"
---
# forum.getmonero.org Shell upload

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 43 | **Program:** Monero | **Disclosed:** 2018-07-27

- Report: [https://hackerone.com/reports/357858](https://hackerone.com/reports/357858)
- CWE: Code Injection
- Submitted: 2018-05-26T13:26:09.625Z

## Timeline

- **Report Filed**
- **2018-05-26** @kaulse: Very bad and small shell: 
`https://forum.getmonero.org/uploads/profile/lNobodyl1527341299.php?do=base64exec`

Example: `https://forum.getmonero.org/uploads/profile/lNobodyl1527341299.php?do=cHdk`
cHdk -> pwd: /var/www/forum.getmonero.org/webroot/public/uploads/profile

You can find the vulnerable code here: `https://github.com/monero-project/monero-forum/blob/master/app/controllers/UsersController.php#L392`.

I've found something else which should be verified too:
-> IP leak, because the server makes a request to the link param. Example: https://forum.getmonero.org/get/image?link=https://requestbin.fullcontact.com/1gypbs01
Example: https://requestbin.fullcontact.com/1gypbs01?inspect
- **2018-05-26** @kaulse: -> HTTP Header Injection in https://getmonero.org/language.php / `https://github.com/monero-project/monero-site/blob/master/language.php`. The cookie MONERO_LANG is injected into the header function without validation. CloudFlare seems to protect this site from this attack. Nevertheless, it should be validated/escaped.
- **2018-05-26** @kaulse: https://forum.getmonero.org/uploads/profile/test.txt
- **2018-05-26** @kaulse: I think this is enough evidence. I will stop to avoid damage.
- **2018-05-26** @kaulse: Oh, btw that earlier reported HTTP Header Injection Vulnerability is wrong. I didn't know that PHP prevents that since the version of 5.1.2!
- **2018-05-27** @fluffypony: Excellent find - thank you so much for that! Whilst this is technically out-of-scope, the severity is high enough that we'll make an exception. I've disabled the upload functionality, and nuked the form on the user profile settings screen. Please provide a Monero address so we can send a bounty your way.
- **2018-05-27** @kaulse: Hey @fluffypony,

thank you for the quick answer!
My Monero address is `8ApFriQxRgXNkTWevy5PDaRKcGRERPzchjaoussyoqxh3mQyDpnAK1m3AQfFeani3b4MZxJe63GrUFgorMCx4jBz1v7kLaR`.
Thanks in advance!

if you need help do not hesitate to ask!
- **2018-05-27** @kaulse: By the way, I would try to fix that vulnerability by doing something like this:
```PHP
$extension = Input::file('profile')->getClientOriginalExtension();
if (!in_array(strtolower($extension), ["jpg", "png"])) {
      return Redirect::to('/user/settings')->with('errors', array('Wrong image type!'));
}
```
- **Report Triaged**
- **2018-05-30** @fluffypony: Ok great - 25 XMR sent, transaction ID is ce8295d150e98f2c488451415061f91692f32391b70369cc181095f3eb68c599. Since we're shutting the forum down do you have any problem with us not disclosing this? Or, alternatively, once the forum is entirely gone we can disclose it via an issue on the forum GitHub repo, and note that its unsafe in the readme?
- **2018-05-30** @kaulse: I really appreciate that bounty! Thank you!

I agree we can disclose it!
- **2018-06-22** @kaulse: Quick reminder: Forum seems still be online so I assume that you changed your mind.

Can we disclose it?
- **Swag Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **2018-07-27** @anonimal: Note: this issue was resolved by disabling on the server, not fixed in the code.
- **Agreed On Going Public**
- **Report Became Public**
