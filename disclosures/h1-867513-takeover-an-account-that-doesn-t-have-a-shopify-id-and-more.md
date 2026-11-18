---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - env/web
substate: "resolved"
weakness: null
enriched: true
body: true
date: 2020-09-02
submitted: 2020-05-07T00:51:25.479Z
bounty_usd: null
votes: 3006
cve: []
program: "[[programs/shopify|Shopify]]"
reporter: "imgnotfound"
source: "https://hackerone.com/reports/867513"
title: "Takeover an account that doesn't have a Shopify ID and more"
---
# Takeover an account that doesn't have a Shopify ID and more

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 3006 | **Program:** Shopify | **Disclosed:** 2020-09-02

- Report: [https://hackerone.com/reports/867513](https://hackerone.com/reports/867513)
- CWE: N/A
- Submitted: 2020-05-07T00:51:25.479Z

## Report summary

A report from @francisbeaudoin showed that it was possible to bypass Shopify's email verification for a small subset of Shopify user accounts. Doing so would have allowed a user to access accounts they did not own. 

Our team immediately deployed a change to address this issue. Additionally, we have removed the ability to verify an email address prior to merging an account. All account merges now require an email verification flow.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Details
The https://pos-channel.shopifycloud.com/graphql-proxy/admin can be exploited to update a staff member email without any email confirmation. 

Using the partner dashboard, we've the ability to create a store that doesn't have a Shopify ID account on https://accounts.shopify.com. By using these two together, all we have to do is create an arbitrary store to an email that we own and confirm it with received email, then use the the POS Staff endpoint to update our email without having to validate it.

You'll then be prompted to create a Shopify ID for your stores (the new created one alongs with the victim stores) and you won't need to validate that you own the email since it is already verified.

## Steps to reproduce
1. Have a victim with a shop that doesn't have a Shopify ID
1. Open https://parners.shopify.com and create a development store
1. Within the store creation form, you'll need to update your shop email to one that doesn't exist within Shopify and that you own (so it can be validated). As the field is read-only, that can either be done by intercepting the request with an application like Burp or do the above **within your browser console** to update the form object.
```
window.RailsData.current_organization.business_email = "nonexistingemail@shopify.com";
window.RailsData.user.email = "nonexistingemail@shopify.com";
```
1.. Validate that you own the email address (Link sent to your email)
1. Add the **POS** to your shop **Sales Channels**
1. Open up the **POS > Staff**
1. Save your own staff page and copy the CURL request by using browser inspection
1. Replace the CURL payload email field with the victim email and send the request
1. Refresh your profile page in your Shop, you'll then be prompt to combine your account and note that you're not asked to validated the new email (victim's one).
1. Proceed with the Shopify ID creation
1. You now own the Shopify ID, you can just change its email to yours as the victim could still be recovering them by doing a forget password.

## Impact

That vulnerability has multiple impacts so I wasn't sure if I should've been creating multiple reports
1. Ability to take-over some account
{F818496}

1. Ability to create a verified Shopify ID with non-verified email (See the verified: **francisbeaudoin@hackerone.com**)
{F818494}

1. Ability to update Staff informations even when linked to a Shopify ID

For the later one, let's say you have a Shop with two staff members: A and B (the attacker). Staff B is aware that the Shop owner is about to transfer the Shop to Staff A. By exploiting the POS access endpoint, staff B would be able to move **first name, last name and email** between Staff A <--> Staff B so that once the shop owner would be selecting the right Staff within the UI, we would be sending it to the wrong person.

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **2020-05-07** @imgnotfound: As a FYI, in the video, the victim's store was also a development store (created in a separate partner account) to make sure that the shop owner "StaffMember" object isn't attached to any account on accounts.myshopify.com, which I believe is a Shopify ID.

It might be possible to takeover already existing Shopify ID but will require digging deeper.
- **Report Triaged**
- **2020-05-07** @imgnotfound: Alright, thanks for quick update!
- **2020-05-08** @clayton: A quick update: we deployed a preliminary fix to prevent email changes made through our API from bypassing email validation requirements. Our engineering team is continuing to investigate, and we'll be in touch again soon.
- **2020-05-08** @imgnotfound: I made some testing of the preliminary fix for the email change and it does look good! You guys are quite efficient and I really appreciate working with you guys :)
- **Bounty Awarded**
- **Report Resolved**
- **2020-05-13** @imgnotfound: Awesome, thanks a lot for that bounty!
- **Agreed On Going Public**
- **2020-06-30** @shopify-peteryaworski: Hi @francisbeaudoin,
just wanted to let you know we haven't forgotten about the disclosure request on this one, we just need to follow up internally on it. Sorry it's taken so long.
- **Agreed On Going Public**
- **Report Became Public**
- **Bounty Awarded**
- **2020-12-22** @imgnotfound: Really appreciate you all taking time to make that video - it really made my day!

Thanks again and happy holiday to all of you!
- **Swag Awarded**
- **2021-01-08** @imgnotfound: Yeah, thanks :)
- **Bounty Awarded**
