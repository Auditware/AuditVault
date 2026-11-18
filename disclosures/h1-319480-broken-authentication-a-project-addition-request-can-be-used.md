---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/key-exchange-without-entity-authentication
  - env/web
  - vuln/xss
substate: "informative"
weakness: "Key Exchange without Entity Authentication"
enriched: true
body: true
date: 2018-03-13
submitted: 2018-02-25T07:37:55.196Z
bounty_usd: null
votes: 5
cve: []
program: "[[programs/semrush|Semrush]]"
reporter: "walterhwhite"
source: "https://hackerone.com/reports/319480"
title: "Broken Authentication: A project addition request can be used multiple time for different users"
---
# Broken Authentication: A project addition request can be used multiple time for different users

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 5 | **Program:** Semrush | **Disclosed:** 2018-03-13

- Report: [https://hackerone.com/reports/319480](https://hackerone.com/reports/319480)
- CWE: Key Exchange without Entity Authentication
- Submitted: 2018-02-25T07:37:55.196Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

> NOTE! Thanks for submitting a report! Please replace *all* the [square] sections below with the pertinent details. Remember, the more detail you provide, the easier it is for us to verify and then potentially issue a bounty, so be sure to take your time filling out the report!

**Summary:** 
[**Broken Authentication**. A project addition request can be used multiple time for different users]

**Description:** 
[**Reusable requests**. Once a project addition request is captured it can be used any number of times even after logout not only for the corresponding user but for any user with API key.

## Steps To Reproduce:


  1. Create two users for semrush.com 

		i) cleganearya1@gmail.com
		ii)saidutt.mekala@gmail.com
  2. Now create a project for the user saidutt.mekala@gmail.com
  3. Following will be the request along with headers for project creation:

POST /projects/api/projects/?key=█████████ HTTP/1.1
Host: www.semrush.com
User-Agent: Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:58.0) Gecko/20100101 Firefox/58.0
Accept: application/json, text/javascript, */*; q=0.01
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Referer: https://www.semrush.com/projects/?1519503450
Content-Type: application/json
X-Requested-With: XMLHttpRequest
Content-Length: 86
Cookie: __cfduid=d586fa9b6fb028d425a8df52599e73d021519503413; PHPSESSID=██████████; ref_code=__default__; usertype=Free-User; marketing=%7B%22user_cmp%22%3A%22%22%2C%22user_label%22%3A%22%22%7D; localization=%7B%22locale%22%3A%22en%22%7D; db=us; n_userid=LuWkzFqRyDaG+2bqBEeyAg==; semrush_counter_cookie=deleted; visit_first=1519503421910; userdata=%7B%22tz%22%3A%22GMT+5.5%22%2C%22ol%22%3A%22en%22%7D; utz=Asia%2FKolkata; wp13557=UWYYADDDDDDIKXCIMMK-JBZZ-XLLX-BYCY-ILTWWCUBMTICDMUMLJIZI-AZAL-XLML-CJHX-WTBKZBVKZXWVDlLtkNlo_Jht; uvts=7B3Au3azsgVbSB6R; org.springframework.web.servlet.i18n.CookieLocaleResolver.LOCALE=en
DNT: 1
Connection: keep-alive

{"domain":"BB1236.com","name":"BB12367.com","url":"BB123678.com","acl":{"write":true}}

4. Now delete the added project.
5. Logout of the application and close the browser.
6. Resend the above request with different parameters like {"domain":"Walterwhite12.com","name":"Walterwhite12.com","url":"Walterwhite12.com","acl":{"write":true}}

Following is the response:  

HTTP/1.1 200 
Date: Sun, 25 Feb 2018 06:50:58 GMT
Content-Type: application/json;charset=UTF-8
Connection: keep-alive
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubdomains; preload
Expect-CT: max-age=604800, report-uri="https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct"
Server: cloudflare
CF-RAY: 3f28bbc28bbd17aa-SIN
Content-Length: 224

{"id":1266025,"domain":"walterwhite12.com","name":"Walterwhite12.com","email":"saidutt.mekala@gmail.com","tools":[],"permission":["OWNER"],"available":true,"favorite":false,"root_domain":"walterwhite12.com","times_shared":0}

7. Now we can also add the project to any user by using his API Key in the request. In the following request I have used the API Key of the user cleganearya1@gmail.com :

POST /projects/api/projects/?key=█████████ HTTP/1.1
Host: www.semrush.com
User-Agent: Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:58.0) Gecko/20100101 Firefox/58.0
Accept: application/json, text/javascript, */*; q=0.01
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Referer: https://www.semrush.com/projects/?1519503450
Content-Type: application/json
X-Requested-With: XMLHttpRequest
Content-Length: 104
Cookie: __cfduid=d586fa9b6fb028d425a8df52599e73d021519503413; PHPSESSID=██████; ref_code=__default__; usertype=Free-User; marketing=%7B%22user_cmp%22%3A%22%22%2C%22user_label%22%3A%22%22%7D; localization=%7B%22locale%22%3A%22en%22%7D; db=us; n_userid=LuWkzFqRyDaG+2bqBEeyAg==; semrush_counter_cookie=deleted; visit_first=1519503421910; userdata=%7B%22tz%22%3A%22GMT+5.5%22%2C%22ol%22%3A%22en%22%7D; utz=Asia%2FKolkata; wp13557=UWYYADDDDDDIKXCIMMK-JBZZ-XLLX-BYCY-ILTWWCUBMTICDMUMLJIZI-AZAL-XLML-CJHX-WTBKZBVKZXWVDlLtkNlo_Jht; uvts=7B3Au3azsgVbSB6R; org.springframework.web.servlet.i18n.CookieLocaleResolver.LOCALE=en
DNT: 1
Connection: keep-alive

{"domain":"Walterwhite12.com","name":"Walterwhite12.com","url":"Walterwhite12.com","acl":{"write":true}}

8. Following is the response for the above request:

HTTP/1.1 200 
Date: Sun, 25 Feb 2018 06:53:17 GMT
Content-Type: application/json;charset=UTF-8
Connection: keep-alive
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubdomains; preload
Expect-CT: max-age=604800, report-uri="https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct"
Server: cloudflare
CF-RAY: 3f28bf1e9f8917aa-SIN
Content-Length: 222

{"id":1266027,"domain":"walterwhite12.com","name":"Walterwhite12.com","email":"cleganearya1@gmail.com","tools":[],"permission":["OWNER"],"available":true,"favorite":false,"root_domain":"walterwhite12.com","times_shared":0}

## Impact

Once a project addition request is captured it can be used any number of times even after logout not only for the corresponding user but for any user with API key. Hence there is no need to login for the user to create a project because an attacker can directly add a project to victims account with his own malicious inputs/scrips and make them executable without victims awareness.

i) Reusable cookies for same user.
ii)There is no match verification between the API Key and cookie/sessionIds. There should be a server side validation which should validate the relation between an API Key provided and the sessionIds of the current user.

## Timeline

- **Report Filed**
- **Report Informative**
- **2018-02-25** @walterhwhite: @alla Thanks for the quick response. 

I) But that's what I did, I changed the API Key of two users as mentioned above not the cookies.
II) Furthermore, the reported defect not only deals with API keys exchange but also it says that a captured request of adding a project can be used multiple for the same user too (Please read first six steps). First six steps explains one scenario/defect and remaining steps of changing the user API key elevates/increases the impact of the first defect.

I have read the policy before testing and I think above reported defect is inline with the policy.

Please let me if you need additional explanation.
- **2018-02-26** @walterhwhite: The first six steps are the steps to perform Replay Attack and remaining steps says that this replay attack can impact other users too if a proper API key is there .

So the actual defect is replay attack for the same user but it can also be expanded to others as well.
- **2018-02-26** @alla: How will you steal API key of another user?
- **2018-02-26** @alla: API key uses to authenticate the user in this request. So when you resend request with the same API key you just do it again as this user. It doesn't matter if you logged out from web interface.
- **2018-02-27** @walterhwhite: @alla Okay, if that request uses only API Key parameter as the authenticating factor I think the impact is more.

An API key of length 32 characters can be generated by using the following python script:

{code}
    import string
    import random
   def id_generator(size=32, char=string.ascii_lowercase + string.digits):
   return''.join(random.choice(char) for _ in range(size))
   i=1
   while(i<=n):
   print(id_generator())
   i+=1
{code}

Where n is the number of keys that we wish to generate. 

An attacker can generate these and perform brute force on the request. He will get a 200 Ok response code if any of the API keys are satisfied. If too many from any IP are blocked, a timing attack can be launched with some seconds of difference for every request.

I did not perform brute force attack on this as it is against the program policy.
- **2018-02-27** @security_semrush: md5 alphabet is *[abcdef01234567890]* => 16^32 = 3,4028237 × 10^38 possible variants. 

And according to our policy:
```
The following bugs are unlikely to be eligible for a bounty:

- Brute Force attacks
```
- **2018-02-27** @walterhwhite: @security_semrush :

i) The reported defect is not completely about enumerating or manipulating the API Key in the request. It says that "The request that was captured when the session is active can be used even after the user is logged out." which says that the session ids are only being deleted from the browser after logout but not expiring.

ii) The point related to API Key manipulation was brought into the context to describe the impact of the above-mentioned scenario can have on other users.

iii) This report may not be eligible for a bounty by brute force. But it definitely uncovers a vulnerability which can impact a user or number of users. Furthermore, brute force is not the only way to get the API Key it can also be done 
by Man in the middle attack. But brute force is an easy attack procedure and if the attacker is fortunate enough he will get 200 Ok response within 1000 hashes. It is **as per the policy** the report is not eligible for bounty but in my humble opinion, a real black hat hacker never does things for bounties and as per policies.

There should be extra authentication parameter which changes/expires every time the user logs in, unlike an API Key which is always a constant for a particular user.

Thanks,
WalterWhite.
- **2018-02-28** @alla: According to our policy — such use of API key is a part of our business logic.
- **2018-02-28** @walterhwhite: @alla I agree with your point that such use of API key is a part of business logic but it is not providing the necessary security it has to. An extra layer of security should be added consisting of cookies/session IDs which will expire once the user logs out and will prevent the reuse of the captured request. And server should check the match between the API Key and Session IDs to confirm that it is not coming from different user.
- **2018-03-01** @walterhwhite: @alla Did you get a chance to look into this.
- **2018-03-01** @alla: You write the same thing in other words. I just can reply the same way:
According to our policy — such use of API key is a part of our business logic.
- **2018-03-01** @walterhwhite: Okay, Thank you.
- **2018-03-02** @walterhwhite: @alla can we disclose this.
- **2018-03-10** @walterhwhite: @alla & @security_semrush can you please disclose this report.
- **2018-03-12** @walterhwhite: @alla & @security_semrush can you please disclose this report.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
