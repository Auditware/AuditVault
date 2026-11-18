---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/privilege-escalation
  - env/web
  - vuln/broken-access-control
  - vuln/privilege-escalation
  - impact/account-takeover
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
body: true
date: 2020-09-15
submitted: 2020-06-28T13:09:26.941Z
bounty_usd: null
votes: 559
cve: []
program: "[[programs/shopify|Shopify]]"
reporter: "say_ch33se"
source: "https://hackerone.com/reports/910300"
title: "Email Confirmation Bypass in your-store.myshopify.com which leads to privilege escalation"
---
# Email Confirmation Bypass in your-store.myshopify.com which leads to privilege escalation

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 559 | **Program:** Shopify | **Disclosed:** 2020-09-15

- Report: [https://hackerone.com/reports/910300](https://hackerone.com/reports/910300)
- CWE: Privilege Escalation
- Submitted: 2020-06-28T13:09:26.941Z

## Report summary

On June 28th, @say_ch33se reported that it was possible to bypass Shopify's email verification for legacy accounts. Doing so would have allowed a user to access accounts they did not own. 

Our team immediately deployed a change to address this issue. Additionally, we have removed the ability to verify email addresses for legacy accounts. A code to confirm email ownership at the time of merging from a legacy account is now required.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello Shopify, I have found a bug by which I can verify any email on .myshopify.com, the bug is very strange but it works. Also I can take over the accounts but only the ones which do not have SSO.

To reproduce please follow the steps exactly as I written otherwise you will not be able to reproduce it.

Steps to reproduce: 

1. Go to your partners account and make a store
{F886149}

2. Go to your new store and don't verify email, then go to admin/settings/account/youraccountnumber
{F886151}

3. Change your email to victims email(in my case say_ch33se+111@wearehackerone.com)
{F886138}

4. Go to burps match and replace and replace your email with the email you want to takeover(in my case say_ch33se+111@wearehackerone.com)
{F886137}
{F886139}
{F886140}

5. Refresh the account page so its updated with victims email
{F886141}

6. Still on accounts page click on Upload photo and upload any photo and save
{F886142}

7. After that uncheck match and replace, refresh and on accounts page change email to your email which you own so you can get a confirmation email
{F886143}

8. In burp check match and replace again to replace your email with the email you want to takeover(same as above)
9. Go to your email which you own where is the confirmation link and click on it(in the browser where you are already logged in)
10. On that page where you verified email, upload another image
{F886144}

11. Now click on Review accounts
12. Enter stores password and you'll be greeted with Shopify ID
13. Click on Set up Shopify ID
{F886145}

14. And there you got it
{F886146}

15. Click continue and set up password
{F886147}
{F886148}

16. Now you can access vitims store and partner account without any problems

## Impact

Ability to confirm any email on your-store.myshopify.com and leverage SSO to take over accounts.

## Timeline

- **Report Filed**
- **2020-06-29** @jenn-shopify: Hi @say_ch33se,
Thank you for your report! We have validated this and shipped a mitigation. You should no longer be able to reproduce this issue. Our team is out of office today, but we will get back to you tomorrow with an update.
- **2020-06-29** @say_ch33se: Wow, you're fast. I did re-check and it definitely doesn't work anymore
- **Report Triaged**
- **Bounty Awarded**
- **2020-06-30** @say_ch33se: Hey Shopify, thank you for the bounty! I'm amazed with your fast response and professionalism! I will definitely keep searching for more bugs
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
