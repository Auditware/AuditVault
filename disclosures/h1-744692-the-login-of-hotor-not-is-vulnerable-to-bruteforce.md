---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-restriction-of-authentication-attempts
  - env/web
substate: "resolved"
weakness: "Improper Restriction of Authentication Attempts"
enriched: true
body: true
date: 2020-01-23
submitted: 2019-11-22T16:36:11.608Z
bounty_usd: null
votes: 59
cve: []
program: "[[programs/bumble|Bumble]]"
reporter: "oo7hacker3"
source: "https://hackerone.com/reports/744692"
title: "The login of Hotor Not is Vulnerable to bruteforce."
---
# The login of Hotor Not is Vulnerable to bruteforce.

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 59 | **Program:** Bumble | **Disclosed:** 2020-01-23

- Report: [https://hackerone.com/reports/744692](https://hackerone.com/reports/744692)
- CWE: Improper Restriction of Authentication Attempts
- Submitted: 2019-11-22T16:36:11.608Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I was able to validate that The Login of HotorNot is Vulnerable to BruteForcing .

Steps to reproduce:
1. https://hotornot.com/signin
2.Use Burp intruder attack for BruteForcing 
3.Send as many requests you want.

Fix:
Proper mitigation of BruteForcing should be done using Ratelimitng etc implementation.

## Impact

If attacker successfully Bruteforces the he/she might takeover it.Which might lead in users Privacy Violation

## Timeline

- **Report Filed**
- **2019-11-22** @oo7hacker3: Also One more fix:
Captcha Should Be generated for Every False Attempts Due to Which Automated BruteForcing is Mitigated .
- **2019-11-23** @oo7hacker3: Hii updates!
- **2019-11-24** @oo7hacker3: Hii Updates!
- **2019-11-24** @oo7hacker3: Hi updates!
- **2019-11-25** @oo7hacker3: Hi updates
- **Report Triaged**
- **Report Needs More Info**
- **Report New**
- **2019-11-25** @oo7hacker3: This is how You should Bypass captcha......
- **2019-11-25** @oo7hacker3: This is how to bypass captcha and remaining steps are similar.....for BruteForcing 
Just capture request after submitting captcha.
And send as many request you want.!
- **2019-11-25** @oo7hacker3: And sorry I forgot about the clause......So I submitted Similar report against Another login

But The issue is Similar for that login also.....same you can bypass captcha and Bruteforce it.


One question-:
Is it eligible for bounty?
- **2019-11-26** @oo7hacker3: Hii updates
- **Report Triaged**
- **2019-11-26** @oo7hacker3: Yes thanks for Updating me I would just like to help you for fix

Fix for this is-:
1) Captcha should be generated for each false attempt
2) Ratelimitng should be applied on attempts.
- **2019-11-28** @oo7hacker3: Hii any updates!
- **2019-11-29** @oo7hacker3: Hii update
- **2019-11-29** @oo7hacker3: Hii any updates!
- **2019-11-30** @oo7hacker3: Hii any updates
- **2019-11-30** @oo7hacker3: Hi updates
- **2019-12-01** @oo7hacker3: Hi updates
- **2019-12-02** @oo7hacker3: Hii any updates
- **2019-12-02** @uyga: Hey.
Could you stop writing here every single minute, please?
Despite captcha mechanism requires some tuning, it's not that urgent. The logic there is a bit more sophisticated then you think. Sometimes we fake response and do not show captcha. And this is made to make a potential attacker's life harder.
That doesn't mean attacker it able to bruteforce the real account. 
Cheers.
- **2019-12-02** @oo7hacker3: Sorry 
I was just pinging ......for response.
- **2019-12-08** @oo7hacker3: Its been almost a week .......any updates.
- **2019-12-09** @oo7hacker3: Any update about when this issue will be Updated.
- **2019-12-10** @oo7hacker3: Any updates!
- **2019-12-11** @oo7hacker3: Is this Report valid for Bounty?
- **2019-12-12** @oo7hacker3: Pls tell me is this report valid for Bounty?
- **2019-12-12** @oo7hacker3: hi @uyga is this report valid for Bounty.
- **Bounty Awarded**
- **Report Resolved**
- **2019-12-13** @oo7hacker3: Thank you for the Bounty......  Pls delete the screenshot because it contains my account details.
- **Agreed On Going Public**
- **2019-12-27** @uyga: Hey.
It looks like I can't delete anything here. Sorry.
- **2019-12-27** @oo7hacker3: But the Screenshots contain MY ACCOUNT DETAILS. ..     someone might takeover my Account using the Credentials.
- **2019-12-27** @uyga: Hey.
Looks like I managed to convert attachments to internal view only.
Hope this helps.
Cheers!
- **Report Became Public**
