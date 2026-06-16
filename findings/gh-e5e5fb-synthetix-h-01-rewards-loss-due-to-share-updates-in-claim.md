---
tags:
  - blockchain/evm
  - lang/solidity
  - sector/dex
  - sector/lending
  - sector/liquid-staking
  - sector/oracle
  - sector/staking
  - platform/pashov
  - severity/high
  - impact/dos/permanent
  - impact/mev/frontrun
  - novelty/known-pattern
protocol: "[[Synthetix]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[underflow]]"
  - "[[permanent]]"
  - "[[frontrun]]"
  - "[[known-pattern]]"
  - "[[account-ownership]]"
  - "[[dos-resistance]]"
  - "[[frontrun-exposure]]"
  - "[[integer-bounds]]"
  - "[[liquidation-underwater]]"
  - "[[pyth-oracle-completeness]]"
  - "[[vote-delegation-loop]]"
---
[H-01] Rewards loss due to share updates in claim
calculation
8.2. Medium Findings
[M-01] UserCollateral.vaults array has no length limit
[M-02] reward_distribution.schedule needs to be updated
when slot_duration == 0
[M-03] Permanent DoS on liquidation process
[M-04] Permanent DoS during the price update
8.3. Low Findings
[L-01] Preventing account closure by sending small token
amount
[L-02] Overflow in try_update_market_size_on_trade
[L-03] Missing validation for minimum publish time
[L-04] Risky token extensions
[L-05] Not clearing debt when amount_delta_usd == 0
[L-06] Function is missing
[L-07] Improper validation of susd_mint
[L-08] create_collateral_lock only allows increasing the
lock amount when the previous lock expires
[L-09] Missing update to last_interaction_slot
1
3
3
3
3
4
4
4
5
6
9
12
12
12
15
15
16
19
20
23
23
24
26
27
30
30
31
34
35

[L-10] Keepers can frontrun the trader order cancellation
[L-11] Missing confidence interval validation
2
35
38

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
A time-boxed security review of the SynthetixSolana/[[Synthetix]]-solana repository
was done by Pashov Audit Group, with a focus on the security aspects of the
application's smart contracts implementation.
4. About Synthetix on Solana
Synthetix provides a flexible framework for creating derivatives and managing
liquidity across blockchain networks. It enables users to stake collateral, provide
liquidity, and trade derivatives. The V3 design introduces modular features like
collateral vaults, liquidity pools, and advanced trading tools for smooth operation.
This audit was focused on Synthetix on Solana, written on Rust.
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
5

6. Security Assessment Summary
review commit hash - d8a4172b1432b712ab0158f7365c6862323c8c86
fixes review commit hash - d8a4172b1432b712ab0158f7365c6862323c8c86
Scope
The following smart contracts were in scope of the audit:
- accept
- account
- add
- add_config
- assign_debt_to_account
- associated_markets
- burn
- burn_usd_for_market
- claim
- claim_liquidated_collateral
- close
- collateral_disabled_by_default
- collateral_mint_definition
- commit
- complete
- configure
- consolidate_debt
- core_config
- core_market_reporting
- create
- create_lock
- create_market
- create_user
- custody
- delegate_collateral
- delegation_cooldown_duration
- deposit
- deposit_collateral
- deposit_usd
- disable
- distribute
- distribute_debt
- distribute_debt_to_accounts
- distribute_debt_to_vaults
- enabled
- error
6

- feature_flag
- flag_position
- funding_recomputed
- global_config
- initialize_program
- keeper
- keeper_liquidation_management
- keeper_margin_management
- lib
- liquidate_flagged_position_margin
- liquidate_margin
- liquidate_position
- liquidation
- manage_collateral
- margin
- margin_collateral_configured
- margin_liquidated
- market_collateral_access
- market_computation_access
- market_connections
- market_created
- market_debt
- market_size_updated
- market_usd_config
- max
- max_delegation_cooldown_duration
- min_liquidity_ratio
- minimum_credit
- mint
- mint_usd_for_market
- mod
- name
- nominate
- oracle_node_definition
- oracle_price
- order
- order_canceled
- order_committed
- order_settled
- pay_debt
- perp_market
- pool_owner_only
- pools
- position
- position_flagged
- position_liquidated
- preferred_pool
- prepare
- prepare_claim
- process_price
- program_owner_only
- pyth
- rebalance_markets
- recalculate_vault_collateral
7

- register
- register_market
- remove
- renounce_nomination
- renounce_ownership
- settle
- synthetix_perps_account
- synthetix_usd
- total_debt
- trader
- transfer_fees
- update
- update_depositing_enabled
- update_market_config
- update_one_pool_only
- update_pause
- user
- user_account_owner_only
- user_collateral
- utilization_recomputed
- vault
- withdraw
- withdraw_collateral
- withdraw_usd
8

7. Executive Summary
Over the course of the security review, Koolex, FrankCastle, ZanyBonzy, zhaojio
engaged with Synthetix to review Synthetix on Solana. In this period of time a total
of 16 issues were uncovered.
Protocol Summary
Protocol Name Synthetix on Solana
Repository
https://github.com/SynthetixSolana/synthetix-solana
Date
November 5th 2024 - December 13th 2024
Protocol Type
Derivative trading
Findings Count
Severity
Amount
High
1
Medium
4
Low
11
Total Findings 16
9

Summary of Findings
ID
Title
Severity
Status
