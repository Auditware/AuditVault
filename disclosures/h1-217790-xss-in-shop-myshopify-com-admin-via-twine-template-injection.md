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
date: 2017-06-01
submitted: 2017-04-02T02:33:01.281Z
bounty_usd: 1000
votes: 31
cve: []
program: "[[programs/shopify|Shopify]]"
reporter: "bored-engineer"
source: "https://hackerone.com/reports/217790"
title: "XSS in $shop$.myshopify.com/admin/ via twine template injection in 'Shopify.API.Modal.input' method when using a malicious app"
---
# XSS in $shop$.myshopify.com/admin/ via twine template injection in "Shopify.API.Modal.input" method when using a malicious app

> **Severity:** High | **Bounty:** 1,000 USD | **Votes:** 31 | **Program:** Shopify | **Disclosed:** 2017-06-01

- Report: [https://hackerone.com/reports/217790](https://hackerone.com/reports/217790)
- CWE: Cross-site Scripting (XSS) - Generic
- Submitted: 2017-04-02T02:33:01.281Z

## Report summary

This report demonstrated an XSS that could be exploited by a malicious application installed on a store to execute javascript as a store administrator. The cause of the XSS turned out to be improperly escaped user input in a lodash template.

## Timeline

- **Report Filed**
- **2017-04-03** @bored-engineer: I wanted to add a quick note to this one, technically this issue doesn't require an admin to install a malicious application to be exploited. If a bad actor were already aware that an administrator uses an application hosted on `example.com`, they could search for XSS issues on `example.com` and using a combination of `var win = window.open("$shop$.myshopify.com/admin/apps/$id")` and `win.postMessage` from the XSS they could likely trigger this issue. I hesitate to even mention this as is a very contrived example, however it's worth mentioning as normally XSS on the application domain wouldn't have much impact with the app being iframed to a specific URL on the application domain.
- **2017-04-03** @bored-engineer: To provide a PoC for the scenario described in my previous comment, consider a shop that has the "Product Reviews" application installed which is hosted on [productreviews.shopifyapps.com](https://productreviews.shopifyapps.com/). Normally, if I were to discover XSS on a specific endpoint such as [/XSS](https://productreviews.shopifyapps.com/XSS) it wouldn't directly affect the app since a specific endpoint is loaded within the administrative interface, not the endpoint with my XSS. Ignoring that this isn't quite true due to the proxy configuration of this specific app, I would be able to use this XSS to target a specific shop. If you open any URL on [productreviews.shopifyapps.com](https://productreviews.shopifyapps.com/) and run the following JS in the console (to simulate another XSS issue) it will fire an alert in the admin panel:
```js
var win = window.open("https://$shop$.myshopify.com/admin/apps/product-reviews/");
setInterval(function() {
  win.postMessage(JSON.stringify({
    message: "Shopify.API.Modal.input",
    data: {
      message: {
        message: "", 
        value: "'-alert(document.domain)-'",
      }
    }
  }), "*");
}, 100);
```
The core issue here is the still twine injection, however you may want to consider adding an additional verification step to the `window.onmessage` handler in the admin interface. One way to accomplish this would be to provide a secret (randomly generated) to the app when first initializing, then requiring all postMessage calls from the app include this secret before being evaluated, thereby assuring all messages originated from the app's iframe.
- **Report Triaged**
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
