---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
substate: "resolved"
weakness: null
enriched: true
body: true
date: 2022-06-30
submitted: 2022-05-24T03:44:18.570Z
bounty_usd: null
votes: 41
cve: "CVE-2023-22798"
program: "[[programs/brave|Brave Software]]"
reporter: "kalkii"
source: "https://hackerone.com/reports/1579374"
title: "Browser is not following proper flow for redirection cause open redirect "
---
# Browser is not following proper flow for redirection cause open redirect 

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 41 | **Program:** Brave Software | **Disclosed:** 2022-06-30

- Report: [https://hackerone.com/reports/1579374](https://hackerone.com/reports/1579374)
- CWE: N/A | CVE: CVE-2023-22798
- Submitted: 2022-05-24T03:44:18.570Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:

Brave browser is not following proper flow for redirection. Browser is directly redirecting to the site that is present in redirect parameter without confirming from the main site server.
I have found this vulnerability and this is affecting Facebook. Facebook use ```l.facebook.com/l.php?u=<redirect_site>``` for redirection and when server gets the request it check whether the redirect_site is in the list of there malicious(linkshim) list or not. If not then Facebook redirect  it properly.
But when we try to go to a site like https://l.facebook.com/l.php?u=https://test.facebook-whitehat.com/ then brave browser is directly requesting to https://test.facebook-whitehat.com/ (a domain resticted by facebook which can be used for testing prepose) without asking Facebook server  whether should I redirect or not. But other browser are properly following the flow. 

## Products affected: 

 Windows 11, Version 1.38.119 Chromium: 101.0.4951.67 (Official Build) (64-bit)

## Steps To Reproduce:

1. Open brave browser in windows
2.  Intercept the requests
3. Go to ```https://l.facebook.com/l.php?u=https://test.facebook-whitehat.com/``` and you will notice that it directly generating a request ```https://test.facebook-whitehat.com/``` not to ```l.facebook.com```

## Supporting Material/References:

 I also soon how other browser is responding and how brave is responder. POC video attached

## Impact

Brave has seen a massive growth in 2021 quarter and Facebook is the one of the largest used social media.
Due to this vulnerability users that are using Brave browser are directly affected which will affect brave reputation as only brave browser users are getting affect.
As well  this vulnerability in brave browser is affecting facebook's security also.

## Timeline

- **Report Filed**
- **2022-05-24** @diracdeltas: thanks for the report. this was part of a feature called URL debouncing but it seems it should only debounce URLs that would otherwise redirect. we are looking into fixes.
- **Report Triaged**
- **2022-05-27** @kalkii: Hi @diracdeltas 

I have **retested** the issue and It is fixed as far as I can check.
That was very quick.
Can you provide some update regarding it?

Thanks and Regards
Abhinav
- **Report Resolved**
- **Report Severity Updated**
- **Bounty Awarded**
- **2022-05-30** @kalkii: Hi @diracdeltas 

Thanks for the bounty
Just checking can you also provide Swag as it mentioned in the policy under Bounty Schedule that Hacker Swag is also available upon request. 

Thanks and Regards
Abhinav
- **2022-05-30** @diracdeltas: @abhinavsecondary i'll ask but we may not be able to ship it for a while. will let you know.
- **Agreed On Going Public**
- **2022-05-30** @kalkii: I would request you to take approval for the swag as well. I would be really happy if I get it 

Thanks and Regard 
Abhinav
- **2022-05-30** @diracdeltas: @abhinavsecondary we can disclose once we are done with the full fix and it's been released for 30 days or so. for swag, please email your name, shipping address, and shirt size to yan@brave.com. thanks.
- **2022-05-30** @kalkii: Hi @diracdeltas 

I have sent you the email. Thanks for the swag

Thanks and Regards
Abhinav
- **2022-06-30** @kalkii: Hi @diracdeltas 

It's been a month and also brave has disclosed about this on GitHub https://github.com/brave/adblock-lists/commit/51867e0d15a6d7f80d5b714fd0e9976b9c160bb0
So can we now disclose it over here also?

Thanks & Regards
Abhinav
- **Agreed On Going Public**
- **Report Became Public**
- **2023-01-17** @kalkii: Hi @diracdeltas 

Happy New Year
I was just curious can I get a CVE on this??

Thanks
- **2023-01-17** @diracdeltas: I just requested one for you. The tentative ID is CVE-2023-22798.
- **2023-01-17** @kalkii: Thank you🙂
