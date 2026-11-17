---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/use-after-free
  - env/web
substate: "resolved"
weakness: "Use After Free"
enriched: true
date: 2020-07-06
submitted: 2020-03-21T16:40:38.626Z
bounty_usd: 10000
votes: 741
cve: []
program: "[[programs/playstation|PlayStation]]"
reporter: "theflow0"
source: "https://hackerone.com/reports/826026"
title: "Use-After-Free In IPV6_2292PKTOPTIONS leading To Arbitrary Kernel R/W Primitives"
---
# Use-After-Free In IPV6_2292PKTOPTIONS leading To Arbitrary Kernel R/W Primitives

> **Severity:** High | **Bounty:** 10,000 USD | **Votes:** 741 | **Program:** PlayStation | **Disclosed:** 2020-07-06

- Report: [https://hackerone.com/reports/826026](https://hackerone.com/reports/826026)
- CWE: Use After Free
- Submitted: 2020-03-21T16:40:38.626Z

## Timeline

- **Report Filed**
- **2020-03-21** @hacker-01: Hi @theflow0,

Thank you for accepting the invite to join our program and for your submission! Your report is currently being reviewed and we will get back to you once there is additional information to share.

Kind regards,
@hacker-01
- **Report Needs More Info**
- **Report New**
- **Report Triaged**
- **Bounty Awarded**
- **2020-04-22** @hacker-01: Hi @theflow0,

We would like to let you know that the vulnerability you reported has been patched via PS4 system software version 7.50 which was publicly released last week. Let us know if you have a way to verify the fix against this version or not. If not, we will close this report. 

Thank you!

Best Regards,
@hacker-01
- **2020-04-23** @theflow0: Hi all,

Thanks a lot.

Yes I verified that it was properly fixed.

Best,
Andy
- **Report Resolved**
- **2020-05-09** @theflow0: Btw, ███ would like to join the program.
- **2020-05-09** @hacker-01: Thank you @theflow0, we invited ████ to join the program.
- **2020-06-25** @theflow0: Dear PlayStation,

Would it be possible for me to post a writeup describing the exploitation of this vulnerability?

Andy
- **2020-06-25** @hacker-01: Hi Andy, 

we would be happy to work with you on coordinated disclosure. Could you please request disclosure through the platform so our team can track and discuss it internally?


Best Regards,
@hacker-01
- **Agreed On Going Public**
- **2020-07-02** @theflow0: any update on this? cheers.
- **2020-07-05** @greentea: Hi Andy,

Could you please share a draft of the write-up you plan to disclose so it can be reviewed in advance?

Thank you,
HackerOne staff
- **2020-07-05** @theflow0: Hey,

Instead of a writeup, I'd probably only disclose the vulnerability. Is it possible to make this report here public?

Best,
Andy
- **2020-07-06** @greentea: Hi Andy,

The PlayStation team will approve public disclosure on this report. Are you comfortable with all content in the back and forth comments being public? If so, we'll proceed. 

-HackerOne staff
- **2020-07-06** @theflow0: Yes, it's alright. Thanks!
- **Agreed On Going Public**
- **Report Became Public**
- **External User Joined**
