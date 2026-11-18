---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
  - impact/account-takeover
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2020-11-10
submitted: 2020-10-06T13:44:41.609Z
bounty_usd: null
votes: 142
cve: []
program: "[[programs/acronis|Acronis]]"
reporter: "sayaanalam"
source: "https://hackerone.com/reports/999765"
title: "Ticket Trick at https://account.acronis.com"
---
# Ticket Trick at https://account.acronis.com

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 142 | **Program:** Acronis | **Disclosed:** 2020-11-10

- Report: [https://hackerone.com/reports/999765](https://hackerone.com/reports/999765)
- CWE: Improper Access Control - Generic
- Submitted: 2020-10-06T13:44:41.609Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary
Hello dear team,
I found a serious issue in Acronis
This vulnerability is called ticket trick vulnerability which comes under critical category. Which can allow me to login on websites like atlassian,github,clouflare,choopa,..etc on behalf of support_mobility@acronis.com .

## Steps To Reproduce
Lets take an example to get your github account.

1. As Github send account register verification mails from noreply@github.com
2. I registered an account on acronis with same email.
3. Now your support system creates ticket of emails sent to  support_mobility@acronis.com .
4. So I registered an account  on github and logged into my acronis account with email noreply@github.com .
5. As Acronis allowed me to see support tickets without email verification , so I was able to see support tickets easily created by noreply@acronis.com .
6. On support ticket there was an email verification link sent to noreply@github.com .
7. In this way I was able to takeover many account registered with  support_mobility@acronis.com and many internal accounts that can be accessed with only @acronis.com

##POC

I was able to register a github account on your email address :-

{F1022537}

##Resources about this vulnerability:-
https://hackerone.com/reports/498964
https://medium.com/intigriti/how-i-hacked-hundreds-of-companies-through-their-helpdesk-b7680ddc2d4c

## Impact

* Critical Email Takeover
* Ticket Trick


Thanks for reading my report.

Best Regards
Sayaan Alam

## Timeline

- **Report Filed**
- **2020-10-06** @security-bot: Hi @sayaanalam

Thanks for participating in Acronis bug bounty program!
Our security team will take a look at this issue as soon as possible.
We will reply within 22 hours during business days.

Meanwhile, I'd recommend you to check out our [policy](https://hackerone.com/acronis).
- **2020-10-07** @sayaanalam: Hello there ,

It’s been more than 22 hours and there have been multiple internal activities here,
Could you please triage the report?

Thanks
- **2020-10-07** @iradostev: Hi @sayaanalam 

You should understand that each your message that we have to answer only disturbs us from report investigation. As per current [policy](https://hackerone.com/acronis), we have 10 business days for it, so please stop spamming and be patient.
- **2020-10-07** @sayaanalam: Hey @iradostev ,

Sorry to Disturb, I thought it’s assigned to someone else. 

Thanks
- **Report Severity Updated**
- **Report Triaged**
- **2020-10-08** @sayaanalam: Hey @iradostev ,

I have attached a screenshot above that I was able to register on Github , Similarly I could have registered at a lot of services mentioned on article linked above , I’ve a complete takeover on your email support_mobility@acronis.com through I can initiate registration, reset request on any application in the same way with which I’ve registered and verified account on GitHub.

Here’s the article link for better reference  - https://link.medium.com/dITXU9BDpab


Hope everything is clear now.



Thanks
Sayaan Alam
- **2020-10-12** @sayaanalam: Hi @iradostev ,

Do you have some updates on it ?

Thanks
Sayaan Alam
- **Bounty Awarded**
- **2020-10-13** @sayaanalam: Thanks for Sweet Bounty :)
- **2020-10-13** @sayaanalam: Hey @iradostev ,

Do you offer swags too ?

Thanks
- **2020-10-13** @iradostev: Hi @sayaanalam 

Unfortunately, no.
- **2020-10-16** @sayaanalam: Hi @iradostev ,

Do we have any update on the fix on this bug?

Thanks
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
