---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - stack/wordpress
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
date: 2020-01-08
submitted: 2019-03-14T21:37:27.180Z
bounty_usd: null
votes: 80
cve: "CVE-2019-16773"
program: "[[programs/wordpress|WordPress]]"
reporter: "simonscannell"
source: "https://hackerone.com/reports/509930"
title: "Potential unprivileged Stored XSS through wp_targeted_link_rel"
---
# Potential unprivileged Stored XSS through wp_targeted_link_rel

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 80 | **Program:** WordPress | **Disclosed:** 2020-01-08

- Report: [https://hackerone.com/reports/509930](https://hackerone.com/reports/509930)
- CWE: Cross-site Scripting (XSS) - Stored | CVE: CVE-2019-16773
- Submitted: 2019-03-14T21:37:27.180Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **2019-05-23** @simonscannell: ████
- **2019-11-19** @simonscannell: Hi @vortfu ,

Are there any updates on the patch?
- **2019-11-20** @whyisjake: Hey @simonscannell,

We put together this patch that aims to fix this problem. Could you please review?

Cheers,

@whyisjake
- **2019-11-25** @simonscannell: Hi @whyisjake ,

Seems effective to me!

Best,
Simon
- **2019-12-11** @whyisjake: Hey there @simonscannell,

Do you have a GitHub account? Would like to add you to the Security Advisory there.

Also, would the "Props to Simon Scannell of RIPS Technologies" still work for the release on Thursday?

Cheers,

@whyisjake
- **2019-12-11** @simonscannell: Hi @whyisjake ,

My github account is https://github.com/scannells thank you!

Yes, please do use this props for all Security issues reported by me!

Best regards,
Simon
- **2019-12-16** @ehtis: Hi Simon,

This went out in https://wordpress.org/news/2019/12/wordpress-5-3-1-security-and-maintenance-release/ 

Working on getting the bounty released. Thank you for your great research as always! :)
- **Bounty Awarded**
- **Report Resolved**
- **2019-12-18** @simonscannell: Thank you very much!

I was told ██████████
Is also in the queue, but since it was Not included in this round I just wanted to make sure there are no confusions, thank you!
- **2019-12-19** @ehtis: Yep! Also working on getting that released.
- **2019-12-19** @simonscannell: Thank you for taking care of this!
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2020-01-08** @simonscannell: Hi @whyisjake ,

Thank you! I like the direction WordPress is going with full disclosure.

All the best,
Simon
- **Cve Id Added**
