---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2025-09-23
submitted: 2021-11-05T10:03:44.247Z
bounty_usd: null
votes: 107
cve: []
program: "[[programs/insightly|Insightly]]"
reporter: "xploiterr"
source: "https://hackerone.com/reports/1392262"
title: "Stored XSS via LINK Name."
---
# Stored XSS via LINK Name.

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 107 | **Program:** Insightly | **Disclosed:** 2025-09-23

- Report: [https://hackerone.com/reports/1392262](https://hackerone.com/reports/1392262)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2021-11-05T10:03:44.247Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Hi Team,

The `LINK NAME` is not properly escaped at the `Templates` page leading to `Stored XSS` and the name is reflected in the `<script> tag` , due to lack of sanitization the user can break out of the <script> tag and execute the XSS.

See Proof Of Concept below.
Thank You.

---

## Steps To Reproduce:

A. Log into your account at `https://marketing.na1.insightly.com/`

B. Click on `Plus Sign` --> `Add a new redirect Link` 

C. Enter this `'"></script><img src=x onerror=alert(1)>{{'7'*7}}` payload in the `Link Name` and fill all other details.

D. Click on `Save` and click on `Emails Icon` --> `Email Templates` --> `New Email Templates`

E. Enter all the details and click on `Save`

Wait a little bit and you will see the XSS executing.

## Note all the users visiting that page will execute the XSS in the organization.

---

## Proof Of Concept:

See this Video POC:

{F1504350}

POC:

{F1504349}

## Impact

An XSS attack allows an attacker to execute arbitrary JavaScript in the context of the attacked website and the attacked user. This can be abused to steal session cookies, perform requests in the name of the victim or for phishing attacks.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2022-01-03** @xploiterr: Hi Team,

Any Update on this ?

Many Thanks,
@xploiterr
- **2022-01-05** @h1_analyst_chanel: Hello  @xploiterr,

Thanks for your patience! The Insightly team is still working on this internally, and you will be updated once there is more information to share.

Regards,
@chinch1lla
- **2022-03-05** @xploiterr: Hi @chinch1lla,

Please ping the internal team once and tell them to check the report and perform further actions here.

Many Thanks,
@xploiterr
- **2022-03-17** @h1_analyst_ivan: Hey @xploiterr,

The team is still looking into this. I have reached out again for an update.

Thank you for your patience.

@iced_t
- **2022-05-17** @xploiterr: Hi @cbox,

Any Update on this one ?

Many Thanks,
@xploiterr
- **2022-05-26** @cbox: Hi @xploiterr,

Unfortunately I don't have an update on this one today. Followed up with the team & will circle back with that update.

Cheers,
@cbox
- **2022-06-14** @xploiterr: Hi @cbox,

Any Update on this one ?

Many Thanks,
@xploiterr
- **2022-08-23** @xploiterr: Hi @cbox,

Any Update on this one ?

Many Thanks,
@xploiterr
- **2022-08-30** @xploiterr: Hi @cbox,

I am expecting the update on the report soon as this  has been over `10 months` from being reported.


Many Thanks,
@xploiterr
- **2022-09-01** @h1_analyst_ivan: Hey @xploiterr,

The team is still looking into this. I have reached out for an update.

Thank you for your patience.

@iced_t
- **2022-10-04** @xploiterr: Hi @cbox,

Any Update on this one as this has been delayed too much.

Hope to hear soon from you with an update.

Note: `To the triager, please ping the internal team member` 

Many Thanks,
@xploiterr
- **2022-10-04** @h1_analyst_ivan: Hey @xploiterr,

I have reached out again for an update.

Thank you for your patience.

@h1_analyst_ivan
- **2022-10-24** @xploiterr: Hi @cbox,

Any Update on this one ?

Many Thanks,
@xploiterr
- **2022-11-04** @xploiterr: Hi @cbox,

Since this has been over 12 months from being reported. Please provide with the update on the report soon.

Many Thanks,
@xploiterr
- **2022-11-17** @xploiterr: Hi @cbox,

Any Update on this one ?  It has been over  a  year from being reported and this has been delayed too much.

Many Thanks,
@xploiterr
- **Bounty Awarded**
- **Report Triaged**
- **Report Retesting**
- **2024-06-08** @xploiterr: @cbox,

Please invite me to your program has well, as I might have left your program earlier.

Thanks
- **User Completed Retest**
- **2024-06-25** @xploiterr: @cbox,

Can you please leave Feedback on my public profile. That would be helpful to me.

Many Thanks,
@xploiterr
- **2024-07-02** @xploiterr: @cbox,

Can you please respond to the message.

Thanks.
- **2024-07-22** @xploiterr: @cbox,

Any Update on this one ?

Thanks
- **2024-07-29** @xploiterr: Is there any update on this one ?

Many Thanks,
@xploiterr
- **2024-07-29** @h1_analyst_jaco: Hi @xploiterr,

I have pinged the Insightly team regarding this report. I will get back to you as soon as I hear back from them. Please bear with us in the meantime.


Thank you for your patience.


Thanks,
@h1_analyst_jaco
- **Report Retest Approved**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
