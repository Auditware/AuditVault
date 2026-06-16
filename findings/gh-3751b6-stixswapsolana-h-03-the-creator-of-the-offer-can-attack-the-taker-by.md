---
tags:
  - blockchain/solana
  - lang/rust
  - sector/token
  - platform/pashov
  - severity/high
  - impact/dos/permanent
  - impact/loss-of-funds/direct-drain
  - impact/mev/frontrun
  - novelty/known-pattern
protocol: "[[Stixswapsolana]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[frozen-funds]]"
  - "[[permanent]]"
  - "[[direct-drain]]"
  - "[[frontrun]]"
  - "[[known-pattern]]"
  - "[[dos-resistance]]"
  - "[[frontrun-exposure]]"
  - "[[integer-bounds]]"
  - "[[pda-derivation]]"
---
[H-03] The creator of the offer can attack the taker by
front-running
[H-04] Permanent DOS and loss of funds due to
unhandled token dust
8.3. Medium Findings
[M-01] Whitelisted taker can DoS attack other
whitelisted takers
[M-02] Same token swap protection missing
8.4. Low Findings
[L-01] Frontrunning the initialization of admin_config
[L-02] Missing fee address validation in update function
[L-03] Missing minimum trade size protection
1
3
3
3
3
4
4
4
5
5
6
9
9
9
10
11
13
13
15
16
17
20
20
20
23
23
23
24

[L-04] State inconsistency due to Solana rollback
[L-05] offer_id is not utilized in create_offer
[L-06] Missing validation for an expected amount greater
than zero
[L-07] Missing Update of Offer Statistics in take_offer
[L-08] cancel_offer requires the maker as a signer,
preventing post-expiration cancellations
[L-09] Division overflow may result in trading at the
price of quote 0
[L-10] Expiring offers without closing the offer PDA
causes DoS
[L-11] Unreliable event logging due to Solana log
truncation
2
24
25
26
26
28
29
31
32

1. About Pashov Audit Group
Pashov Audit Group consists of multiple teams of some of the best smart contract
security researchers in the space. Having a combined reported security
vulnerabilities count of over 1000, the group strives to create the absolute very best
audit journey possible - although 100% security can never be guaranteed, we do
guarantee the best efforts of our experienced researchers for your blockchain
protocol. Check our previous work here or reach out on Twitter @pashovkrum.
2. Disclaimer
A smart contract security review can never verify the complete absence of
vulnerabilities. This is a time, resource and expertise bound effort where we try to
find as many vulnerabilities as possible. We can not guarantee 100% security after
the review or even if the review will find any problems with your smart contracts.
Subsequent security reviews, bug bounty programs and on-chain monitoring are
strongly recommended.
3. Introduction
A time-boxed security review of the STIX-Co/stix-swap-solana-contracts
repository was done by Pashov Audit Group, with a focus on the security aspects
of the application's smart contracts implementation.
4. About STIX Swap Solana
STIX Swap contracts provide automated solutions for OTC trades, including
escrow services for buyers and sellers and fee management. They support ERC20
tokens, native currencies, and allow for customizable trading setups and modular
upgrades.
3

5. Risk Classification
Severity
Impact: High Impact: Medium Impact: Low
Likelihood: High
Critical
High
Medium
Likelihood: Medium High
Medium
Low
Likelihood: Low
Medium
Low
Low
5.1. Impact
High - leads to a significant material loss of assets in the protocol or significantly
harms a group of users.
Medium - only a small amount of funds can be lost (such as leakage of value) or a
core functionality of the protocol is affected.
Low - can lead to any kind of unexpected behavior with some of the protocol's
functionalities that's not so critical.
5.2. Likelihood
High - attack path is possible with reasonable assumptions that mimic on-chain
conditions, and the cost of the attack is relatively low compared to the amount of
funds that can be stolen or lost.
Medium - only a conditionally incentivized attack vector, but still relatively
likely.
Low - has too many or too unlikely assumptions or requires a significant stake by
the attacker with little or no incentive.
4

5.3. Action required for severity levels
Critical - Must fix as soon as possible (if already deployed)
High - Must fix (before deployment if not already deployed)
Medium - Should fix
Low - Could fix
6. Security Assessment Summary
review commit hash - d7bae15f6208b02da6029dfda2994d7b859b486e
fixes review commit hash - 9629f542572dceca4567a206202e6fdce8c59dcd
Scope
The following smart contracts were in scope of the audit:
lib
error
constants
admin_struct
mod
offer
whitelist
admin
cancel_offer
create_offer
mod
taker_offer
5

7. Executive Summary
Over the course of the security review, defsec, FrankCastle, zhaojio engaged with
STIX Swap to review STIX Swap Solana. In this period of time a total of 20 issues
were uncovered.
Protocol Summary
Protocol Name STIX Swap Solana
Repository
https://github.com/STIX-Co/stix-swap-solana-contracts
Date
January 7th 2025 - January 12th 2025
Protocol Type
OTC Trading Service
Findings Count
Severity
Amount
Critical
3
High
4
Medium
2
Low
11
Total Findings 20
6

Summary of Findings
ID
Title
Severity
Status
