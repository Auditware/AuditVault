---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/cleartext-storage-of-sensitive-information
  - env/web
substate: "resolved"
weakness: "Cleartext Storage of Sensitive Information"
enriched: true
body: true
date: 2018-10-08
submitted: 2018-08-17T09:49:01.636Z
bounty_usd: null
votes: 582
cve: []
program: "[[programs/snapchat|Snapchat]]"
reporter: "th3g3nt3lman"
source: "https://hackerone.com/reports/396467"
title: "Github Token Leaked publicly for https://github.sc-corp.net"
---
# Github Token Leaked publicly for https://github.sc-corp.net

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 582 | **Program:** Snapchat | **Disclosed:** 2018-10-08

- Report: [https://hackerone.com/reports/396467](https://hackerone.com/reports/396467)
- CWE: Cleartext Storage of Sensitive Information
- Submitted: 2018-08-17T09:49:01.636Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

###Description :

GitHub is a truly awesome service but it is unwise to put any sensitive data in code that is hosted on GitHub and similar services as i was able to find github token indexed ***7 hours Ago*** by user ***██████ - Software Engineer - Snap Inc***

### Issue & POC :
You can find the leak in this link :
https://github.com/█████/leetcode/blob/0eec6434940a01e490d5eecea9baf4778836c54e/TopicMatch.py

````

import os
import requests
import sys
pull_number = 76793
pull_url = "https://github.sc-corp.net/api/v3/repos/Snapchat/android/pulls/" + str(pull_number)
payload = {}
payload["Authorization"] = "token " + "[REDACTED - see source report]"
print payload
r = requests.get(pull_url,

```

## Impact

I didn't try anything with the token, and dont know what access it has, and i know that in order to login to https://github.sc-corp.net you need to have an email @snap but still i though it would be a good idea to share this finding with you in case it can be used in a way that i dont know.

Best Regards

## Timeline

- **Report Filed**
- **Report Triaged**
- **2018-08-17** @th3g3nt3lman: Thanks @cgrayson for quick response, i really didn't want to highlight this as high or critical as i prefer always in such findings not to escalate or try something that might impact target, so its up to you to asses the risk.

Very happy to help securing snapchat
- **2018-08-20** @th3g3nt3lman: Dear @cgrayson ,
There is something i found that is not related to your BB program but it might affect some users, i wanted to share it with you just as an information , maybe you can speak to google and take it over the net.

There is someone hosting a suspicious website having "Snapchat inc" in the certificate, as you can see below :
{F335558}

the domain name is "sn.ht" which is hosting a suspicious javascript code exactly the same as the one used for Blind XSS attacks, when a user opens this site all his cookies, details will be stolen by the one managing this site.

Maybe you wont be able to take any actions regarding this, and i don't know google policy regarding this but i just wanted to share this with you.

Best Regards,
- **Report Severity Updated**
- **Bounty Awarded**
- **2018-08-20** @th3g3nt3lman: Thats the best day in my life @cgrayson @snapchat ,  you don't know how much this bounty can help me :) thanks for your generosity.

Thank you alot guys
- **2018-08-26** @th3g3nt3lman: Dear @cgrayson,

I know its not my right to ask, just out of curiosity, what was the impact of the above if it reached bad hands ?
Doesnt the google authentication somehow protect the access to this site even with the token leaked ?

I was thinking for the last week in this and would appriciate your answer if this is allowed just to learn :)

Best Regards,
- **Report Resolved**
- **2018-09-08** @th3g3nt3lman: Thanks guys, it was nice working with you, can we have a limited disclosure for this without exposing the code ? Just like researcher found a working token that affected one of our servers or whatever you find suitable, maybe only the title of the report.

I like to share with other researchers so they can learn specially the new ones.

Best Regards,
- **Agreed On Going Public**
- **Report Became Public**
