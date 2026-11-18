---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - env/web
  - vuln/race-condition
  - trigger/race-window
substate: "resolved"
weakness: null
enriched: true
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi team, 
I and Aditya sent this bug over email on Wed, 29 Dec, 17:45 IST. Later we noticed that security reports are accepted via the HackerOne program. So, I am sending a copy of the bug report here. 

## Summary:
We were testing an application and we found a race condition bug in the faucet Implementation of Starport. 
https://github.com/tendermint/starport

## Steps To Reproduce:
1. Start a starport with the below configuration. Note the "coins_max" has been set to 11 tokens and hence a user cannot fetch more after the 11 token limits.

```
accounts:
  - name: alice
    coins: ["0token", "200000000stake"]
  - name: bob
    coins: ["500token", "100000000stake"]
validator:
  name: alice
  staked: "100000000stake"
client:
  openapi:
    path: "docs/static/openapi.yml"
  vuex:
    path: "vue/src/store"
faucet:
  name: bob
  coins: ["5token", "100000stake"]  
  coins_max: ["11token", "100000stake"]
```

2. Now call the request manually  with 5 tokens per request as in our configuration after 2 requests and 10 tokens in total Alice won't be able to fetch more tokens from the faucet

```
POST / HTTP/1.1
Host: 172.105.41.242:4500
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:95.0) Gecko/20100101 Firefox/95.0
Accept: application/json
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Referer: http://172.105.41.242:4500/
Content-Type: application/json
Origin: http://172.105.41.242:4500
Content-Length: 63
Connection: close
{
  "address": "ALICE_ADDRESS"}

```

Now we can confirm Alice cannot have more than 11 tokens. 

3.  Now regenerate the server and instead of sending a single request send a concurrent request to fetch tokens in Alice address.  We used 50 requests concurrently.

{F1563051}

4. Now when we check Alice balance it is 30 which should have not been more than 11

{F1563052}

We believe the root cause of the issues is the go mapping which is not advised for concurrency 
https://github.com/tendermint/starport/blob/develop/starport/pkg/cosmosfaucet/transfer.go#L59

## Supporting Material/References:
https://cwe.mitre.org/data/definitions/362.html

## Impact

A malicious user can send concurrent requests to fetch more tokes from faucets than the "max-credit limit" which allows.

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
