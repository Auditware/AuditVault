---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/web
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
body: true
date: 2019-06-22
submitted: 2017-02-15T15:12:23.399Z
bounty_usd: null
votes: 67
cve: []
program: "[[programs/automattic|Automattic]]"
reporter: "saurabhb"
source: "https://hackerone.com/reports/206650"
title: "Broken Authentication - Security token gets captured via man in the middle attack"
---
# Broken Authentication - Security token gets captured via man in the middle attack

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 67 | **Program:** Automattic | **Disclosed:** 2019-06-22

- Report: [https://hackerone.com/reports/206650](https://hackerone.com/reports/206650)
- CWE: Improper Authentication - Generic
- Submitted: 2017-02-15T15:12:23.399Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Product / URL**

`http://en.instagram-brand.com/register/reset/<the security token here>?email=<email address here>`


**Description and Impact**

The password reset links issues by Instagram Brand gets delivered to users inbox with a http scheme and NOT https scheme.

This causes an attacker stealing those links and performing mass account takeovers and security compromises.

The link that gets delivered in inbox is:
`http://mandrillapp.com/track/click/30956340/instagram-brand.com?p=<the very long security token here>`

On requesting the above link in browser, it sends back the password reset token in clear text: `http://en.instagram-brand.com/register/reset/<the security token here>?email=<the email of user here>`

**Solution:**
This issues has a very easy solution. I have myself performed this and it worked !!.
Whenever the code responsible for sending password reset link makes those links, just add https as scheme instead of http. And you will observe that now all the accounts are safe and data cannot be stolen.


**Reproduction Instructions / Proof of Concept**

1. Request for you password reset link.
2. Go to inbox.
3. Right click that link and paste it on notepad and observe the scheme.
4. You can also start Wireshark to capture the traffic and observe that security token can be compromised.

I have attached the screenshot of Wireshark as a proof of concept. F161119

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **2017-02-16** @nickdaugherty: Thanks for the additional info - so it's the initial mandrillapp.com link that is using http, rather than the url on en.instagram-brand.com. Is it possible to get an `http://` version of the instagram-brand.com url (as in the initial report)?

I believe this would be reasonably hard to successfully exploit, because if a user clicks on the http mandrill link and follows it through (exposing it to the MiTM attack in this scenario), they'll land on an https url on instagram-brand with a single-use token that will be invalidated upon password reset.

An attacker would need to capture that mandrill url, then follow the link and update the password themselves before the user did - which _would_ be possible for a bot to do.

Another consideration here is that the link is sent in an email, which is common practice. Emails generally aren't super secure and can themselves be susceptible to MiTM attacks - which no amount of HTTPS can fix.

I do agree though that it would be better to have HTTPS on the entire chain - I'm passing this along to the client and will keep you updated.
- **Report Triaged**
- **2017-02-23** @nickdaugherty: Hi @dermeister - the client has implemented a fix - removing mandrill altogether and using direct HTTPS links instead - can you test again and let us know if you consider this fixed?
- **2017-02-24** @saurabhb: Hi @nickdaugherty  - This is fixed.

Regards,
DerMeister
- **Report Resolved**
- **2017-02-25** @saurabhb: Cheers !
- **2017-03-06** @saurabhb: Is this eligible for a bounty?
- **Bounty Awarded**
- **Agreed On Going Public**
- **Report Became Public**
- **2019-06-28** @saurabhb: Thanks a lot.
