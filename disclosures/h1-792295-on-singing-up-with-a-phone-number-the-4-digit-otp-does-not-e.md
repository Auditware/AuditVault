---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/violation-of-secure-design-principles
  - env/web
substate: "resolved"
weakness: "Violation of Secure Design Principles"
enriched: true
body: true
date: 2020-11-25
submitted: 2020-02-10T18:35:08.910Z
bounty_usd: null
votes: 49
cve: []
program: "[[programs/bumble|Bumble]]"
reporter: "theuniversaldude"
source: "https://hackerone.com/reports/792295"
title: "On Singing up with a Phone number , The 4 digit OTP does not expires for a long time leading to an easy attack and make a verified account easilty"
---
# On Singing up with a Phone number , The 4 digit OTP does not expires for a long time leading to an easy attack and make a verified account easilty

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 49 | **Program:** Bumble | **Disclosed:** 2020-11-25

- Report: [https://hackerone.com/reports/792295](https://hackerone.com/reports/792295)
- CWE: Violation of Secure Design Principles
- Submitted: 2020-02-10T18:35:08.910Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello there how are you doing ?
Go to sign up page and enter a new phone number and you will be redirected to https://bumble.com/registration/confirm-phone .
You will receive a easy breakable 4 digit OTP Code .
I waited for about 4 hours and the OTP did not expired , This shows that the OTP can be easily bruteforced even having the rate limiting , assuming rate limiting is implemented as this is an old program .
The OTP can be bruteforced , by changing IP via VPN and as the OTP does not expires for a long time it gives sufficient time , to get the actual OTP Code also the OTP is only of 4 digits , So it only requires 10,000 requests .


For Solving of this issue , Captcha Implementation is recommended .
POC - Please check screenshots

## Impact

Impact
Registering with a different person mobile number without actual verification .
Impersonating other's identity .

## Timeline

- **Report Filed**
- **2020-02-10** @theuniversaldude: Note : Earlier my this same report was closed stating the captcha is already implemented so now i am showing proof that no captcha is implemented please see the screenshots
- **Report Triaged**
- **2020-02-11** @theuniversaldude: thanks for the triag
- **2020-02-14** @theuniversaldude: any progress?
- **2020-03-02** @theuniversaldude: Hello ,
Please keep me updated
- **2020-03-03** @uyga: Hey.
Thank you for your patience. The issue is about to be solved globally, so it will take time.
Cheers.
- **2020-03-03** @theuniversaldude: ok cool
- **2020-04-10** @theuniversaldude: Hey,
I expect a response.
It has been more than month.
Cheers.
- **2020-04-22** @theuniversaldude: Hello
- **2020-05-06** @theuniversaldude: Heyyyyyyyyyyyyy
- **2020-05-07** @theuniversaldude: Huiiiii
- **2020-06-12** @theuniversaldude: Comment please
- **2020-06-12** @theuniversaldude: Comment please
- **2020-06-13** @theuniversaldude: Comment please
- **2020-07-10** @theuniversaldude: Comment please
- **2020-07-10** @theuniversaldude: I hope you reply soon
- **2020-09-10** @theuniversaldude: Hello @uyga any update?
- **Bounty Awarded**
- **Report Resolved**
- **2020-11-25** @theuniversaldude: It is fixed.
- **2020-11-25** @theuniversaldude: Please make it public.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
