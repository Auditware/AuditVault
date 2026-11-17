---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - env/web
substate: "resolved"
weakness: null
enriched: true
date: 2022-07-26
submitted: 2021-12-30T08:45:02.218Z
bounty_usd: 5000
votes: 61
cve: []
program: "[[programs/cosmos|Cosmos]]"
reporter: "cyberboy"
source: "https://hackerone.com/reports/1438052"
title: "Race condition in faucet when using starport"
---
# Race condition in faucet when using starport

> **Severity:** Critical | **Bounty:** 5,000 USD | **Votes:** 61 | **Program:** Cosmos | **Disclosed:** 2022-07-26

- Report: [https://hackerone.com/reports/1438052](https://hackerone.com/reports/1438052)
- CWE: N/A
- Submitted: 2021-12-30T08:45:02.218Z

## Report summary

The proper writeup of the bug can be found here at our blogpost https://blog.credshields.com/race-condition-in-tendermints-starport-7cebe176d935

The root cause of the bug was in function “Transfer” at
https://github.com/tendermint/starport/blob/7812125/starport/pkg/cosmosfaucet/transfer.go#L50-L74
We can notice in the code that each request to the faucet causes two actions to be made; one for querying the account’s balance and the other for sending tokens. When sending concurrent requests to the faucet, in the time of querying the balance, for some requests, this check happens at the same time and ends up seeing less balance in the account because sending the tokens action has not been finalized for the previous requests.

## Timeline

- **Report Filed**
- **Report Collaborator Invited**
- **Report Collaborator Joined**
- **Hacker Requested Mediation**
- **2022-07-21** @jonws: Hi @cyberboy 

I apologize for the delay, I am following up with the engineering team just to full cover this off and resolve and payout the bounty.

Thank you for your patience and I hope to have an update for you ASAP
- **Report Triaged**
- **2022-07-26** @cyberboy: Thank you, @jonws, for help here. Much appreciated!
- **Bounty Awarded**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **2022-07-26** @cyberboy: Hey @jonws Thank you for the reward! As the bug was fixed, and if it is okay with your team, can we publicly disclose the bug?
- **Agreed On Going Public**
- **Report Became Public**
