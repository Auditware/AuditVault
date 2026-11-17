---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
substate: "resolved"
weakness: null
enriched: true
date: 2020-09-15
submitted: 2020-09-10T04:06:27.552Z
bounty_usd: null
votes: 25
cve: []
program: "[[programs/shopify|Shopify]]"
reporter: "jaka-tingkir"
source: "https://hackerone.com/reports/978125"
title: "xss triggered in 'myshopify.com/admin/product'"
---
# xss triggered in "myshopify.com/admin/product"

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 25 | **Program:** Shopify | **Disclosed:** 2020-09-15

- Report: [https://hackerone.com/reports/978125](https://hackerone.com/reports/978125)
- CWE: N/A
- Submitted: 2020-09-10T04:06:27.552Z

## Report summary

@jaka_tingkir discovered a bypass to an HTML sanitization function on the Collections and Products Rich Text Editor. Until recently, all reports regarding cross site scripting in the Rich Text Editor were considered a Known Issue under our program:

> - **XSS - Rich Text Editor** - Any issue related to execution of javascript in the Rich Text Editor (for example, when editing the description of a product, blog or collection, etc).

Recently we deployed an HTML sanitization function to the Rich Text Editor in specific sections of the administrative area. We then updated the exclusion to mention specific pages that are still vulnerable:

> - **XSS - Rich Text Editor** - Issues relating to execution of JavaScript in the legacy Rich Text Editor in the Legal settings, Blogs section, and Pages section of the Shopify admin.

As this exclusion states, all new reports regarding the legal settings, blogs, and pages sections will still be considered invalid and a Known Issue. New XSS reports regarding the rich text editors in the Products and Collections sections may be valid.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2020-09-12** @jaka-tingkir: I forgot to add,

by saving the xss in the product description, "when other users see the in-store product the xss can be triggered"
- **2020-09-12** @jaka-tingkir: @jack_mccracken
##I found XSS Dom through the same technique and xss is activated on your internal web.

and after doing more tests with payload xss hunter and I got the results of this xss, see F985352
- **Report Severity Updated**
- **2020-09-14** @jaka-tingkir: @jack_mccracken only giving information

I can still produce this problem.

thanks
- **2020-09-14** @jack_mccracken: Hi @jaka_tingkir,

Thanks for the update. We're still working on this one, and will let you know when we have made a change.
- **2020-09-14** @jaka-tingkir: good, and please see all that can be taken from this problem, like at F985352

thanks @jack_mccracken
- **2020-09-14** @jack_mccracken: Hi @jaka_tingkir,

Just to clarify, the script execution on shopifypreview.com that you show in your video is a known issue under the following program page exclusion:

> XSS - Storefront - Any issue where a store administrator is able to insert javascript in the storefront area of their own store, including the checkout pages.

The issue we are fixing here is that the payload can execute on `/admin/products` (the admin area), not on shopifypreview.com.
- **2020-09-14** @jaka-tingkir: hmmm, fine

thanks for the explanation
- **Report Resolved**
- **2020-09-15** @jaka-tingkir: great, i try again and cant reproductions, its fixed!!!!


im wait bounty from you.


and can you set a "severity and weaknness"

thanks
- **2020-09-15** @jaka-tingkir: hai @jack_mccracken I want to ask, from some of my reports that Shopify has received, is there any swag for me.

greetings and thanks
- **2020-09-15** @jack_mccracken: Hi @jaka_tingkir,

We award swag generally based on the criticality of a single issue, rather than for continued reporting. Issues that are rated "High" and "Critical" are normally eligible for swag. Additionally, because of the current situation with COVID-19, our swag program is on hold.
- **2020-09-15** @jaka-tingkir: indeed I know that, hmmm I hope to get 1 from Shopify.

I am still waiting for your bounty.


and can you accept my request above
thanks @jack_mccracken
- **2020-09-15** @jaka-tingkir: is there an update before i disclouser this report
- **2020-09-15** @jaka-tingkir: @jack_mccracken update for bounty, before disclouser this
- **Bounty Awarded**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
