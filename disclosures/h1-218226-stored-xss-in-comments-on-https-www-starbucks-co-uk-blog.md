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
date: 2017-06-27
submitted: 2017-04-02T23:18:08.913Z
bounty_usd: null
votes: 19
cve: []
program: "[[programs/starbucks|Starbucks]]"
reporter: "bayotop"
source: "https://hackerone.com/reports/218226"
title: "Stored XSS in comments on https://www.starbucks.co.uk/blog/*"
---
# Stored XSS in comments on https://www.starbucks.co.uk/blog/*

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 19 | **Program:** Starbucks | **Disclosed:** 2017-06-27

- Report: [https://hackerone.com/reports/218226](https://hackerone.com/reports/218226)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2017-04-02T23:18:08.913Z

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **2017-04-03** @rubikcube: Hey @bayotop 

Am i right you do need a valid account for the Starbucks blog? How would an attacker gain one? 

best

@rubikcube
- **2017-04-03** @bayotop: I used this link - https://www.starbucks.co.uk/account/signin - to create a test account. Once I was authenticated, I was free to post comments on https://www.starbucks.co.uk/blogs/*. See the comments at the bottom of this page -
 https://www.starbucks.co.uk/blog/setting-the-record-straight-on-starbucks-uk-taxes-and-profitability.

If this is not intended behavior., then that would be a whole different issue on it's own. 

Nonetheless, I would strongly recommend fixing the XSS issue described above. "A valid account for the Starbucks blog is needed" is a very dangerous presumption in this case. Totally legitimate accounts can be compromised in many different ways and then used to hijack other user's session by the XSS described above. Also you never know when legitimate users turn malicous. 

I am correct assuming you were now able to reproduce the issue?
- **2017-04-04** @rubikcube: Hey @bayotop 

I was able to confirm your submission, could you please remove the comments? 

Thanks!

@rubikcube
- **2017-04-04** @bayotop: Hi @rubikcube,

I am happy to hear that. 

I'd love to remove the comments, but there seems to be no option for that. The only options I can see are `Reply`, `Flagged` and `Permalink`.
- **2017-04-11** @bayotop: Hi,

Just wondering whether there has been any action or progress made on this report?
Thanks.
- **Report Triaged**
- **Bounty Awarded**
- **2017-04-27** @bayotop: Hi @siren,

Glad to hear that and thanks for the bounty. Let me know if I can be of any further assistance.
- **2017-05-22** @bayotop: Hi,

Since it's been one month now, do you have any updates on when this issue will be resolved? Thanks.
- **2017-06-08** @bayotop: Seems like ```https://www.starbucks.*/blog/*``` permanently redirects to https://1912pike.com making this publicly unexploitable. Still, you should definitely fix the issue in case the blog functionality is accessible internally. 

Anyway, I am considering this issue resolved.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Report Severity Updated**
