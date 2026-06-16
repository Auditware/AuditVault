---
tags:
  - blockchain/solana
  - lang/rust
  - sector/dex
  - sector/launchpad
  - platform/pashov
  - severity/high
  - novelty/variant
protocol: "[[Descilaunchpad]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[frozen-funds]]"
  - "[[permanent]]"
  - "[[variant]]"
  - "[[access-roles]]"
  - "[[fot-slippage]]"
---
[H-01] withdraw_tokens fails to adjust claimed_supply
locking tokens permanently
[H-02] claim_revenue lets admin block user withdrawals
below min threshold
8.3. Medium Findings
[M-01] Prevent token claims if the minimum threshold is
not surpassed
8.4. Low Findings
[L-01] Incorrect check for > 0 buy amt
[L-02] Missing maximum cooldown duration validation
[L-03] Unused is_lp_created flag
[L-04] Missing toolchain version in Anchor.toml
[L-05] Use of transfer instead of transfer_checked
[L-06] All administrative keys are identical
[L-07] State inconsistency due to solana rollback
[L-08] Missing validation for start_time and end_time
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
11
13
13
14
14
14
15
15
16
16
17
18

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
A time-boxed security review of the merklelabshq/desci-launchpad repository
was done by Pashov Audit Group, with a focus on the security aspects of the
application's smart contracts implementation.
4. About Desci Launchpad
Desci Launchpad is a system for launching and funding projects, involving
curation, acceleration, and separation. It enables participants to back projects, with
raised funds creating liquidity pools and offering community benefits.
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
review commit hash - 7167b472dd4e1c1a45ed2d49f00cd1dfadad0fcd
fixes review commit hash - e41b734a8280fb7fe6440f9daf5f647b6ac5dec9
Scope
The following smart contracts were in scope of the audit:
buy_token.rs
claim_revenue
claim_token
create_token
deposit_token
init_stats
mod
update_token
withdraw_tokenstate
lib
error
constants
4

7. Executive Summary
Over the course of the security review, defsec, FrankCastle, ZanyBonzy engaged
with Merkle Labs to review Desci Launchpad. In this period of time a total of 12
issues were uncovered.
Protocol Summary
Protocol Name Desci Launchpad
Repository
https://github.com/merklelabshq/desci-launchpad
Date
February 7th 2025 - February 10th 2025
Protocol Type
Launchpad
Findings Count
Severity
Amount
Critical
1
High
2
Medium
1
Low
8
Total Findings 12
5

Summary of Findings
ID
Title
Severity
Status
