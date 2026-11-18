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
date: 2023-04-11
submitted: 2023-02-22T21:53:13.229Z
bounty_usd: null
votes: 68
cve: "CVE-2022-23258"
program: "[[programs/brave|Brave Software]]"
reporter: "mrzheev"
source: "https://hackerone.com/reports/1884042"
title: "UXss on brave browser via scan QR Code"
---
# UXss on brave browser via scan QR Code

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 68 | **Program:** Brave Software | **Disclosed:** 2023-04-11

- Report: [https://hackerone.com/reports/1884042](https://hackerone.com/reports/1884042)
- CWE: Cross-site Scripting (XSS) - Generic | CVE: CVE-2022-23258
- Submitted: 2023-02-22T21:53:13.229Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:

I found UXss in your browser, and executed Xss on all open domains.
before that I want to tell you a little, that I've found a vulnerability like this in Microsoft Edge :
https://msrc.microsoft.com/update-guide/en-US/vulnerability/CVE-2022-23258

Oppo browser : (Private/no disclosure)

and now i found it in your application

## Products affected: 

 * Android 13, Brave browser version 1.48.164,  Brave Nightly browser version 1.50.53, Brave Beta Browser version 1.49.106, Chromium 110.5481.100


Payload : {F2191688}
This is a QR Code containing the url : javascript:alert(document.domain);

which the attacker will use to attack the victim


## Steps To Reproduce:
- Open Brave browser
- Open www.google.com

{F2191713}
- Click the url bar and delete the url (click the cross on the Url Bar)

{F2191709}
- You will see a Scan QR Code button

{F2191707}
- Click Scan QR Code button & Scan the QR Code above

{F2191708}

- Xss Executed.

{F2191706}  {F2191705}



## Supporting Material/References:

{F2191774}


https://msrc.microsoft.com/update-guide/en-US/vulnerability/CVE-2022-23258

## Impact

Attackers can steal the victim's cookies, and as you can see at this point. that this vulnerability does not only affect brave, but will affect all existing domains/websites. and it is very possible that websites such as facebook.com, google.com, microsoft.com are also affected by this vulnerability
example :
https://portswigger.net/daily-swig/microsoft-edge-translator-contained-uxss-flaw-exploitable-on-any-web-page

## Timeline

- **Report Filed**
- **2023-02-22** @mrzheev: Hi team, in the "Custom data" Column
Complexity :
I put the severity level wrong, I should have written Low, but I wrote High, Can you change that for me?

Complexity : LOW
- **Report Needs More Info**
- **Report Severity Updated**
- **Report New**
- **2023-02-22** @mrzheev: Sorry, I asked to change the complexity to low. Not the severity of this vulnerability
- **Report Severity Updated**
- **Report Triaged**
- **2023-02-22** @mrzheev: I think it's not only Android, it's also possible for IOS to be affected by this vulnerability.
- **External User Joined**
- **2023-02-23** @mrzheev: {F2192385}

Hey @fmarier-brave , can you change the arrow in this picture from High to Low on Custom Data - Complexity ?
- **Report Custom Field Value Updated**
- **2023-02-23** @fmarier-brave: I've updated the "custom data" complexity field.

Also, the fix for Android will be going out in the next 1.49.x release.

iOS was not affected, but we have strengthened the check anyways to mirror the one on Android.
- **2023-02-23** @mrzheev: Hi @fmarier-brave, Shouldn't this be fixed immediately without having to wait for the following release?. 

And I have also tested on the IPHONE 7 (IOS) and it is not affected but true as your suggestion, should strengthen the check to miror the one on android
- **2023-02-23** @fmarier-brave: > Shouldn't this be fixed immediately without having to wait for the following release?
Timing-wise, it came just too late to make it into today's release since we were already too far into the release process to restart with a new build. It will be in our next release.
- **Bounty Awarded**
- **2023-02-24** @mrzheev: Well, I understand. I'll be waiting for the following release
- **2023-02-24** @mrzheev: Hi @fmarier-brave, Just to ask, do the rewards given cover all the applications I find? Because I found this on nightly and beta versions as well. The impact provided may also be worse than that
- **2023-02-24** @fmarier-brave: > Just to ask, do the rewards given cover all the applications I find? Because I found this on nightly and beta versions as well.

Yes, that's all the same code and therefore the same bug. We pay once for the first person to report a bug to us. If you find a related issue that is different (e.g. in a different part of the product, or an issue that our fix doesn't address), then please file a new report and we will take a look.
- **Report Resolved**
- **Agreed On Going Public**
- **2023-03-01** @fmarier-brave: Only after it has been fixed in release. 1.50 is currently scheduled for April 4th (subject to change, but it should be around that time): https://github.com/brave/brave-browser/wiki/Brave-Release-Schedule
- **2023-04-08** @mrzheev: Hi @fmarier-brave , Improvements have been made, can this be disclosed?
- **Agreed On Going Public**
- **Report Became Public**
- **2023-07-01** @mrzheev: Hi @fmarier-brave @diracdeltas 
A little question, why is the report #1436142 #1436558 getting a critical reward and this report is not? technically this report is much more impactful than the one on #1436142 #1436558 and on custom data I have set severity Critical this should be considered, given that the UXSS I found on brave was far more severe than my findings on other browsers.
It's simple, if you open Facebook and log in. then scan the barcode on the QR Code containing a javascript url, then the victim's cookie on the Facebook domain will be obtained by the attacker.
it was very surprising for me to see that some of the rewards and severity of reports were higher than mine.
- **2023-07-01** @mrzheev: See what I marked.


{F2460207}


on reproduction alone he needs more than 1 interaction to get the Xss.
As of this report, the victim only needs to scan the QR Code and it gets Xss.
and any domain that the victim opens when scanning the QR Code will trigger Xss and steal the victim's cookies, including the brave domain and brave account.

I hope you will consider this. because I think it should be higher or equal to that report.

I'm sure you will take a fair decision.
- **2023-07-20** @mrzheev: > ≤$500 — This is definitely a real problem that puts Brave users at risk. We will ship a fix in a scheduled release. Hacker swag available upon request.

Hi I saw this, can I request swag from you?
- **2023-07-20** @kdenhar: If you send an email to yan@brave.com she can provide you with a discount code to use in https://store.brave.com
- **2023-07-20** @mrzheev: OK, thank you
- **2023-07-20** @mrzheev: What about bounty decisions? can it be upgraded to critical?
