---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/time-of-check-time-of-use-toctou-race-condition
  - env/web
substate: "resolved"
weakness: "Time-of-check Time-of-use (TOCTOU) Race Condition"
enriched: true
date: 2018-02-07
submitted: 2017-12-24T08:47:29.068Z
bounty_usd: 15250
votes: 273
cve: []
program: "[[programs/shopify|Shopify]]"
reporter: "cache-money"
source: "https://hackerone.com/reports/300305"
title: "Ability to bypass partner email confirmation to take over any store given an employee email"
---
# Ability to bypass partner email confirmation to take over any store given an employee email

> **Severity:** Critical | **Bounty:** 15,250 USD | **Votes:** 273 | **Program:** Shopify | **Disclosed:** 2018-02-07

- Report: [https://hackerone.com/reports/300305](https://hackerone.com/reports/300305)
- CWE: Time-of-check Time-of-use (TOCTOU) Race Condition
- Submitted: 2017-12-24T08:47:29.068Z

## Report summary

@cache-money reported it was possible to bypass the email verification process in our Partners Dashboard. Doing so would have allowed a Partner to request access to a store under an email address the Partner did not own. If the store had a staff account associated with that email address, the staff account would have been automatically converted to a "collaborator" account and added to the Partner's dashboard without any merchant interaction. 

We tracked down the bug to a race condition in the logic for changing and verifying email addresses. We fixed it by locking the database record during those actions and requiring store administrators to approve all collaborator requests.

After reading Shopify's summary from #270981 a few of times I was able to replicate the intended behavior. Seeing how it worked, I realized the core behavior to investigate was the automatic conversion aspect of it. In order for the conversion to work, you needed to confirm a store employee's email on a partner account. From there you could add the store on the partner account as a "managed store", which will then perform the automatic conversion and give you collaborator access. The bug existed in the email confirmation, which allowed me to confirm arbitrary emails under my partner account via race condition.

The bug was filed on Christmas Eve, and within 12 hours the Shopify team rolled out a fix to address the immediate issue. It was a pleasure to work with a team that takes security as seriously as they do.

## Timeline

- **Report Filed**
- **2017-12-24** @Shopify: Thank you for reporting this bug! This is an automated response to let you know that we've received your issue, and we'll process it as soon as possible.

Due to the holiday period, it may take us up to 3 weeks to triage any given issue. Don't worry, we'll get to yours!

While you are waiting, you can read over our list of non applicable issues listed on our program page: https://hackerone.com/shopify. Make sure your issue isn't listed!
- **Report Triaged**
- **2017-12-24** @shopify-peteryaworski: Thanks again for the report @cache-money! We appreciate you taking the time to improve the security of Shopify rather than Spotify :) 

We shipped a temporary fix to address this today which disables automatically converting accounts. If you're able to bypass it, we'd love to know, otherwise we'll follow up on this first thing in January.

Thanks again - happy holidays!
pete
- **2017-12-24** @cache-money: That was quick, 12 hours to report and temp fix!

That functionality seems to be working properly, accounts are no longer converted. I'll comment if I find another use for a confirmed email.

Happy holidays and apologies for dropping this on Christmas Eve.

Thanks,
-- Tanner
- **2018-01-05** @shopify-peteryaworski: Hey Tanner, happy new year. Just wanted to update you so you knew where we were at and that we haven't forgotten about you. We pushed another change to remove collaborator auto conversions so administrators have to approve all requests. I'm hoping we'll close the report as resolved soon.

Again, if you can break the new change or still execute the race condition, we'd love to hear about it.

Thanks for your patience.
Pete
- **2018-01-06** @cache-money: Happy new year and thanks for the update, @shopify-peteryaworski! I'm still able to execute the race condition but it's certainly much more difficult. It probably took over 30 tries but I was able to get it to work twice. The first time I thought I accidentally confirmed the email myself which is why I then started testing again with an email I do not have access to.

Check partner account `699617` and notice there is a confirmed email of `cachemoney@hackerone.com`.

Thanks,
-- Tanner
- **2018-01-08** @cache-money: I tested the approval and it seems to work as intended. The minor problems I see are:

1. The staff user's account gets disabled immediately when you send the request and could potentially cause disruption.
2. Even if the store owner decides to "reject" the request, the staff user account gets completely deleted from the store.
3. I can request access with different permissions than the staff account currently has. The administrator has no insight into the previous permissions the account had before the conversion request, so extra permissions can be "slipped in" and probably go unnoticed.

Thanks,
-- Tanner
- **2018-01-09** @shopify-peteryaworski: Hey @cache-money, thanks for race condition confirmation again and the added considerations. We're ok with those since the process is intended to be initiated from the partner with an existing relationship. We pushed another change this morning targeting the race condition and I'll be testing again but if you're able to still exploited it, we'd love to know.

Thanks again for your help and for having reporting this to us.
Pete
- **2018-01-11** @cache-money: This looks fixed, I can't replicate after 100 trials. Thanks,
-- Tanner
- **Report Severity Updated**
- **Report Resolved**
- **2018-01-25** @cache-money: Hi @shopify-peteryaworski, I was wondering if there was an update on this.

Thanks,
-- Tanner
- **2018-01-25** @shopify-peteryaworski: Hey @cache-money, sorry for the delay, unfortunately no update right now but it shouldn't be too much longer. Thanks for your patience.

Pete
- **Bounty Awarded**
- **Bounty Awarded**
- **2018-02-02** @shopify-peteryaworski: Thanks again for your great work @cache-money. For reference, we awarded a 15k bounty as this would have allowed a Partner to access a store if the store had a staff account associated with the email address the Partner verified using the race condition you discovered. We added a $250 bonus for your help verifying the fix.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Report Vulnerability Types Updated**
- **Report Severity Updated**
