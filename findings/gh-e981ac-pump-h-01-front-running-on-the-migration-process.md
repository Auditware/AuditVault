---
tags:
  - blockchain/solana
  - lang/rust
  - sector/launchpad
  - platform/pashov
  - severity/high
  - impact/loss-of-funds/direct-drain
  - impact/mev/frontrun
protocol: "[[Pump]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[rounding-direction]]"
  - "[[direct-drain]]"
  - "[[frontrun]]"
  - "[[frontrun-exposure]]"
  - "[[integer-bounds]]"
---
[H-01] Front-running on the migration process
8.2. Medium Findings
[M-01] Insufficient Token Handling in buy()
8.3. Low Findings
[L-01] Virtual Reserves must exceed or match Real
Reserves
[L-02] Rounding down of fees in get_fee()
[L-03] State inconsistency due to Solana rollback
[L-04] Default withdraw authority will cause loss of
funds during the migration
[L-05] Pool migration fee is under constrained
[L-06] Missing production program ID Configuration
[L-07] Add validation check for duplicate authority
[L-08] Tokens can be donated before migration to reduce
the listing price after migration
[L-09] Missing checked arithmetic operations on the lib
[L-10] Bonding can be delayed indefinitely
[L-11] Extend account can be called to unnecessarily
waste native tokens
1
2
2
2
2
3
3
3
4
4
5
7
7
7
9
9
12
12
14
15
16
17
18
18
19
20
22
23

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
A time-boxed security review of the [[Pump]]-fun/pump-contracts-solana repository
was done by Pashov Audit Group, with a focus on the security aspects of the
application's smart contracts implementation.
4. About Pump
Pump on Solana is a platform for launching SPL coins that can be traded on a
bonding curve without needing to provide initial liquidity. Once the coin reaches a
particular market cap, liquidity is deposited from the bonding curve to Raydium,
and the received LP tokens are burnt.
2

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
3

5.3. Action required for severity levels
Critical - Must fix as soon as possible (if already deployed)
High - Must fix (before deployment if not already deployed)
Medium - Should fix
Low - Could fix
6. Security Assessment Summary
review commit hash - 72cb997ca547dabcb58116f16a4f888337e551e5
fixes review commit hash - bd794c918e133c3c125c0ef43068b7b2cc190c02
Scope
The following smart contracts were in scope of the audit:
lib
migrate
realloc_bonding_curve
realloc_global
update_global_authority
4

7. Executive Summary
Over the course of the security review, ubermensch, FrankCastle, Koolex,
carrotsmuggler, defsec, dirk_y engaged with Pump to review Pump. In this period
of time a total of 13 issues were uncovered.
Protocol Summary
Protocol Name Pump
Repository
https://github.com/pump-fun/pump-contracts-solana
Date
October 11th - October 26th
Protocol Type
Bonding Curve tokensale
Findings Count
Severity
Amount
High
1
Medium
1
Low
11
Total Findings 13
5

Summary of Findings
ID
Title
Severity
Status
