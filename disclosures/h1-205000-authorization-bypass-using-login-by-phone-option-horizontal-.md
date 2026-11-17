---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/mobile
  - os/android
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
date: 2017-09-14
submitted: 2017-02-09T15:59:33.227Z
bounty_usd: null
votes: 68
cve: []
program: "[[programs/grab|Grab]]"
reporter: "sp1d3rs"
source: "https://hackerone.com/reports/205000"
title: "Authorization bypass using login by phone option+horizontal escalation possible on Grab Android App"
---
# Authorization bypass using login by phone option+horizontal escalation possible on Grab Android App

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 68 | **Program:** Grab | **Disclosed:** 2017-09-14

- Report: [https://hackerone.com/reports/205000](https://hackerone.com/reports/205000)
- CWE: Improper Authentication - Generic
- Submitted: 2017-02-09T15:59:33.227Z

## Report summary

###Summary
I found a OTP code bypass on the login endpoint, used by Grab Android App. Since no password was required upon login (only SMS code), it was actually account takeover (still, the victim will be informed that something is wrong  because of few incoming SMSes with codes).
The team was very responsible and fixed the issue fast.
Thanks to the Grab team for the great experience and the bounty! It is a pleasure to work with you!

###Technique
The used method (thanks to the @yaworsk and his #149598 report!) is highly depending on the luck due to low enough chance to guess correct code using only 3 attempts in 30 seconds (and we must consider that the server may not throw the one of the choosen codes for a very long time). So account takeover is not so easy, and requires a lot of time. The side effect of this - it is abusing the SMS sending mechanism (it was fixed too).

###Why it works
1) The code had only 4 digits (with 5-6 digits chance to guess the code dramatically drop). Even with 4 digits tool can work a week without results.
*and*
2) There was no limiting on the code refreshing attempts  (now it is, and also account can be locked).

###Used tools and apps:
1) Nox App Player (android emulator), proxied through web debugging proxy.
2) Tested application - https://play.google.com/store/apps/details?id=com.grabtaxi.passenger (app allows registration from any country)
3) Custom C# tool for SMS code refreshing.

## Timeline

- **Report Filed**
- **2017-02-09** @sp1d3rs: P.S. in the step 2 correct country code needed too besides the phone. In my case it's `UA`. After pressing `Start` button sending process will start in 30 seconds.
- **Report Triaged**
- **Report Triaged**
- **2017-02-24** @grabsecurity: Hi @sp1d3rs,

Can you verify if this issue has been fixed?
- **2017-02-24** @sp1d3rs: Hi, it seems like issue is fully fixed.
After 5 unsuccessfull code attempts the response is
```
{
	"status": 400,
	"code": 4004
}
```
instead
```
{
	"status": 400,
	"code": 4000
}
```
which means the attacker get block for some time.
Also `https://p.grabtaxi.com/api/passenger/v2/profiles/activationsms` and  `https://p.grabtaxi.com/api/passenger/v2/profiles/register` does not refresh anymore code attempts. 
So all possible attack vectors will not work here anymore.
- **Report Resolved**
- **Bounty Awarded**
- **2017-03-01** @sp1d3rs: Thank you very much for the bounty!
- **2017-08-13** @sp1d3rs: Hello. Can you hide the private information from the report, like phone number (in Steps to Reproduce section)?
I'm going to prepare this report for disclosure (if you agree, for sure).
- **2017-08-31** @sp1d3rs: Hi @grabsecurity, can you hide the phone number using ████████ ?
- **2017-09-13** @nozz_: Hello @sp1d3rs ! It's done.

Thank you for working with us we are looking for more of your report!
- **2017-09-13** @sp1d3rs: Hi @nozz_ ,
Thanks a lot for the redacting! I noticed that the phone number also exposed in the F159112 and F159106 attachments. Can they be removed too?
Or maybe we can disclose this report with Limited Visibility?
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
