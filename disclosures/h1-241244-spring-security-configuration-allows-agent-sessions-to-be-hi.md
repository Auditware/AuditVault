---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/web
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
date: 2018-07-31
submitted: 2017-06-19T00:48:58.888Z
bounty_usd: null
votes: 6
cve: []
program: "[[programs/gocd|GoCD]]"
reporter: "4cad"
source: "https://hackerone.com/reports/241244"
title: "Spring security configuration allows agent sessions to be hijacked"
---
# Spring security configuration allows agent sessions to be hijacked

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 6 | **Program:** GoCD | **Disclosed:** 2018-07-31

- Report: [https://hackerone.com/reports/241244](https://hackerone.com/reports/241244)
- CWE: Improper Authentication - Generic
- Submitted: 2017-06-19T00:48:58.888Z

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **2017-06-19** @4cad: I will give you a break after this one :)
- **2017-06-19** @maheshp: Adding the HttpSessionContextIntegrationFilter to the filter chain makes sense. We will be fixing this and share an experimental build.
- **2017-06-19** @4cad: Sounds good - feel free to give me the pull request if it is easier, I can build it myself
- **2017-06-20** @maheshp: As per your suggestion added HttpSessionContextIntegrationFilter to the filter chain. Can you please verify the changes [1].

[1] https://github.com/gocd/gocd/pull/3597
- **2017-06-20** @4cad: I just verified the bug by testing before and after the fix - looks like the fix works!
- **Report Resolved**
- **Agreed On Going Public**
- **2018-07-02** @nyuday: Absolutely! If you have a chance, could you give us a link to the post when you publish it - we might be able to help share it too.
- **2018-07-02** @ketan: @4cad — do you want me to set the status of this ticket to "Disclose publicly" right away, or after you're done with the blog post?
- **2018-07-04** @4cad: Thanks! @ketan

That is a good idea - I will let you know when the blog is ready. This is my first blog post, so I appreciate the help.
- **Report Became Public**
