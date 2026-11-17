---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/information-exposure-through-directory-listing
  - env/web
  - stack/node
substate: "resolved"
weakness: "Information Exposure Through Directory Listing"
enriched: true
date: 2019-02-07
submitted: 2019-01-27T15:55:48.066Z
bounty_usd: null
votes: 13
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "skyn3t"
source: "https://hackerone.com/reports/486933"
title: "[serve] Access unlisted internal files/folders revealing sensitive information"
---
# [serve] Access unlisted internal files/folders revealing sensitive information

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 13 | **Program:** Node.js third-party modules | **Disclosed:** 2019-02-07

- Report: [https://hackerone.com/reports/486933](https://hackerone.com/reports/486933)
- CWE: Information Exposure Through Directory Listing
- Submitted: 2019-01-27T15:55:48.066Z

## Timeline

- **Report Filed**
- **2019-01-27** @api_xmgchqhv69rw1zem6733xop0tz: Hello,
Thanks for reporting this to us. Someone will quickly look at this report and triage it.
- **Report Triaged**
- **Report Severity Updated**
- **2019-01-28** @skyn3t: Hey Marcin,
Thanks for the quick response. Any reason why #308721(9.3) and #330650 (10) should be different in terms of severity?
Also what should be the correct score for this report , being similar in nature to both?
- **2019-02-02** @skyn3t: Never mind the above comment
- **External User Joined**
- **2019-02-04** @notquiteleo: Thank you for reporting this issue. We are issuing a fix!
- **2019-02-05** @skyn3t: Hey @notquiteleo ,

Also wanted to bring this to your attention.

Symlinks in `serve` can be used to download/traverse any file or path in server root.

###POC

1. Create a symlink inside your project directory
```
$ ln -s ../../../../../etc/passwd sympasswd
```

2. Run serve in the project directory
```
$ serve
```

**Result:** You can access `/etc/passwd` through `serve` via symlink that was created. This can also be used to bypass `unlisted` and `rewrites` feature.

###Recommendations
1. Validating symlinks in serve.
2. Providing users a flag to turn following of symlinks On/Off if required.
- **External User Joined**
- **2019-02-05** @andybitz: We just released version `5.0.8` of `serve-handler` which includes a fix for the vulnerability.

Thank you for reporting!
- **2019-02-06** @marcinhoppe: @andybitz Thanks! 

@skyn3t Will you have the capacity to re-test the fix?

I will be more than happy to disclose when we have a confirmation that the fix works.
- **2019-02-06** @skyn3t: Hey @andybitz ,
Don't forget to upgrade `serve`
- **2019-02-06** @notquiteleo: We just published version `10.1.2` of `serve` with this change.

https://github.com/zeit/serve/releases/tag/10.1.2
- **2019-02-06** @skyn3t: @marcinhoppe , I was able to verify that the fix works!
- **2019-02-06** @notquiteleo: @skyn3t How can we reward you for this report? Does HackerOne have a built-in mechanism for that?
- **2019-02-06** @lirantal: @notquiteleo that's kind of you! I'm checking with H1 if there's something internal we can do within this report.
- **2019-02-06** @skyn3t: Yeah that's great @notquiteleo 
Thanks @lirantal for looking into this!
- **2019-02-06** @lirantal: marcinhoppe had your back on this! ;-)
great job you guys on this handling this report start-to-end
- **2019-02-06** @reed: Hi @notquiteleo. As this particular program (@nodejs-ecosystem) is run by the Node.js Security WG, any bounties would need to come via them. If you wish to reward a researcher directly as the maintainer of the node module in question, one option is to sign-up for the free [HackerOne Community Edition](https://www.hackerone.com/product/community) for [serve](https://github.com/zeit/serve) and then pay a bounty via that separate program. We can even clone (or move, if the ecosystem team wishes) this report to make it easier. Would that work for you?
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
- **2019-02-09** @skyn3t: Thanks for disclosing @marcinhoppe 
@notquiteleo I've contacted you via twitter DM in case you didn't want to go the HackerOne way.
- **2019-02-12** @notquiteleo: Awesome, thanks!
