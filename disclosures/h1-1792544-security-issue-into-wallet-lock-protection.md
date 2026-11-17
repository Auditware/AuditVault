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
date: 2023-01-11
submitted: 2022-12-04T17:20:39.808Z
bounty_usd: 200
votes: 52
cve: []
program: "[[programs/hiro|Hiro]]"
reporter: "bug_vs_me"
source: "https://hackerone.com/reports/1792544"
title: "Security Issue into Wallet lock protection "
---
# Security Issue into Wallet lock protection 

> **Severity:** High | **Bounty:** 200 USD | **Votes:** 52 | **Program:** Hiro | **Disclosed:** 2023-01-11

- Report: [https://hackerone.com/reports/1792544](https://hackerone.com/reports/1792544)
- CWE: Improper Authentication - Generic
- Submitted: 2022-12-04T17:20:39.808Z

## Timeline

- **Report Filed**
- **2022-12-05** @kyranjamie: Thanks for the report. Our team will investigate.
- **2022-12-05** @bug_vs_me: @kyranjamie 

Thank you for your response sir


@bug_vs_me
- **2022-12-06** @bug_vs_me: Hi, @kyranjamie 
Any update on this report?

Thanks
@bug_vs_me
- **2022-12-07** @markmhendrickson1: Thanks for the report, @bug_vs_me. We've released a patch for this behavior in v3.27.0: https://github.com/hirosystems/stacks-wallet-web/pull/2917

I'll provide a bounty now.
- **Bounty Awarded**
- **2022-12-07** @bug_vs_me: Hi @markmhendrickson1 Thank you For bounty,
- **2022-12-07** @bug_vs_me: @markmhendrickson1 I have a question isn't this vulnerability is high severity? As this wallet behaviour is dangerous, If wallet failure to encrypts data,while it's unlocked on different windows?

Please correct me if I am wrong!

Thankyou
@bug_vs_me
- **2022-12-07** @markmhendrickson1: I consider this of lesser severity since the user's key is not compromised in any novel way. Rather, it simply remains unencrypted in the window where the user has not taken the action to lock (until that particular window is closed). 

The user is just as safe / vulnerable as they'd usually be while signed / interacting with the wallet while it's unlocked, perhaps with the caveat that they could walk away from their computer without signing out of the computer itself and thinking that they've locked the wallet entirely. If someone else subsequently gets physical access to their computer, they could interact with the unlocked window. This is possible threat so it's good to resolve, but not a seemingly likely one. 

If you see other potential threat vectors, we'd appreciate hearing about them.
- **2022-12-07** @bug_vs_me: @markmhendrickson1 

Thankyou sir for clarification I am totally agree with your words,

Thanks love to do more with your team


@bug_vs_me
- **2022-12-11** @bug_vs_me: @markmhendrickson1 I have tested new version of wallet as it's fixed!
 Can you please triage and close this report?

And I want to disclose this report, if your team can allow!


Thankyou
@bug_vs_me
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
