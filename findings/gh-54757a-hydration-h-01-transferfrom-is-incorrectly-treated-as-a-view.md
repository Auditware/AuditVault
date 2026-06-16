---
tags:
  - lang/rust
  - sector/token
  - platform/pashov
  - severity/high
  - novelty/variant
protocol: "[[Hydration]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[unbounded-loop]]"
  - "[[permanent]]"
  - "[[variant]]"
  - "[[fot-slippage]]"
---
[H-01] TransferFrom is incorrectly treated as a view
function
8.2. Medium Findings
[M-01] Unbounded storage iteration in EVM address
registration migration
[M-02] Failure to verify ERC20 function return values in
handle_result()
[M-03] Unbounded memory growth via EVM Error
message allocations
8.3. Low Findings
[L-01] EIP-2 signature malleability in Permit validation
[L-02] Missing logging in runtime upgrade
implementation
[L-03] EVM exit status misclassification in
handle_result()
[L-04] Oversized EVM error messages due to full value
encoding
[L-05] Unchecked message size in call()
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
10
11
13
13
13
14
16
16

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
A time-boxed security review of the galacticcouncil/[[Hydration]]-node repository
was done by Pashov Audit Group, with a focus on the security aspects of the
application's smart contracts implementation.
4. About Hydration
Hydration is a DeFi protocol on Polkadot, offering an 'Omnipool' that combines all
assets into a single, highly efficient trading pool, reducing slippage and increasing
capital efficiency. Through features like single-sided liquidity provisioning,
incentivized rewards, and advanced security, Hydration minimizes impermanent
loss and ensures safer, more streamlined trading for liquidity providers and DAOs
alike.
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
review commit hash - 90eb2543cbe037626ed2c5f263f876bc5db6825a
fixes review commit hash - 5d4121cbe3fd852b8e8341d2358c19cf118946bc
Scope
The following smart contracts were in scope of the audit:
lib.rs
erc20_currency.rs
executor.rs
evm.rs
erc20_mapping.rs
multicurrency.rs
permit.rs
4

7. Executive Summary
Over the course of the security review, Koolex, FrankCastle, ubermensch engaged
with Hydration to review Hydration. In this period of time a total of 9 issues were
uncovered.
Protocol Summary
Protocol Name Hydration
Repository
https://github.com/galacticcouncil/hydration-node
Date
October 17th - October 22th
Protocol Type
Liquidity provision protocol
Findings Count
Severity
Amount
High
1
Medium
3
Low
5
Total Findings 9
5

Summary of Findings
ID
Title
Severity
Status
