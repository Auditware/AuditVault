---
tags:
  - blockchain/solana
  - lang/rust
  - sector/governance
  - sector/oracle
  - platform/zenith
  - severity/high
  - vuln/access-control/missing-signer
  - vuln/dos/griefing
  - impact/dos/permanent
  - impact/loss-of-funds/direct-drain
  - novelty/variant
  - misassumption/admin-is-honest
  - fix/add-access-control
protocol: "[[GMX]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[missing-signer]]"
  - "[[griefing]]"
  - "[[permanent]]"
  - "[[direct-drain]]"
  - "[[variant]]"
  - "[[access-roles]]"
  - "[[account-signer]]"
  - "[[dos-resistance]]"
  - "[[pyth-oracle-completeness]]"
  - "[[realloc-rent-exemption]]"
  - "[[reward-accounting]]"
  - "[[timelock-timestamp-bypass]]"
---
H-9
Users can shift high-risk GM tokens by bypassing the max-
imum PNL check
Resolved
M-1
gt_set_exchange_time_window() could cause mis-pricing
of GT exchange
Resolved
M-2
prepare_gt_exchange_vault() could fail due to seed colli-
sion
Resolved
M-3
unchecked_execute_instruction() fails to check approver is
not revoked
Resolved
M-4
unchecked_revoke_role() will always fail due to wrong
signer
Resolved
M-5
Incorrect access control for set_expected_price_provider()
Resolved
M-6
Missing verification of the fee receiver address during Store
initialization can cause DoS of claiming treasury fees
Resolved
M-7
Pyth prices with high variance devalue the protocol
Acknowledged
6

GMX SOLANA PROTOCOL
SMART CONTRACT SECURITY ASSESSMENT
VERSION 1.1
ID
Description
Status
M-8
Order keeper can DoS others GLV Shift by calling
close_glv_shift repeatedly
Resolved
M-9
Changing the fee receiver causes permanent DoS of claim-
ing treasury fees
Resolved
M-10
close_empty_claimable_account and remove_glv_market
should refund rent to the account creator
Resolved
M-11
State Inconsistency Due to Solana Rollback
Resolved
M-12
Funding
calculation
might
not
revert
when
to-
tal_open_interest is zero
Resolved
M-13
Switchboard check_and_get_price() should use min slot of
the min/max prices
Resolved
M-14
Anyone can prevent market removal from the GLV
Resolved
M-15
Malicious TIMELOCK_KEEPER can set is_signer for an-
other TIMELOCK_KEEPER’s account to steal funds from it
Resolved
M-16
Imbalanced incentive for ADL creates unfair position clo-
sures and increases insolvency risk
Resolved
M-17
Malicious order keeper can perform risk-free trade using
different price in the same tx
Resolved
M-18
Far future price timestamps can block feed updates
Resolved
M-19
GLV shifts could be blocked by a high spread
Resolved
M-20
GLV max market value can be exceeded
Resolved
M-21
ADL can be DoS by spamming update_adl_state()
Resolved
M-22
initialize_referral_code()
can
be
griefed
using
trans-
fer_referral_code()
Resolved
M-23
forPositiveImpact Neglects To Incentivize Markets Without
Price Impact Configuration
Acknowledged
7

GMX SOLANA PROTOCOL
SMART CONTRACT SECURITY ASSESSMENT
VERSION 1.1
ID
Description
Status
L-1
final_short_token doesn’t have any constraints on a close
withdrawal request
Resolved
L-2
TIMELOCK_KEEPER can steal rent from others by calling
execute_instruction
Resolved
L-3
Wrong INIT_SPACE of SwapExecuted
Resolved
L-4
Unexpected transfer of treasury fees
Resolved
L-5
Insufficient authority segregation on Store initialization
Resolved
L-6
Order keeper can DoS GLV Shift by executing dust amount
shift
Resolved
L-7
CreateGlvShift can be DoS by another order keeper
Resolved
L-8
Missing constraining of final_short_token mint in Execute-
Withdrawal context
Resolved
L-9
Incorrect use of the require_eq macro for Pubkey values
Resolved
L-10
Unsorted Referral Reward Factors Validation
Resolved
L-11
Limit orders can’t specify an execution time
Resolved
L-12
ADL cannot be triggered when min_pnl_factor is reached
Resolved
L-13
Limit orders don’t have a deadline
Acknowledged
L-14
Missed validation for Account Length in load_instruction
Resolved
L-15
Misleading core error UnknownOrDisabledToken
Resolved
L-16
Invalid future oracle price timestamps pass verification
Resolved
8

GMX SOLANA PROTOCOL
SMART CONTRACT SECURITY ASSESSMENT
VERSION 1.1
ID
Description
Status
L-17
Missing implementation of GT reserve
Resolved
L-18
Overrestrictive treasury_vault_config check on treasury
withdrawals can leave old vaults inaccessible
Resolved
L-19
Missing validation for min_output in Order::update()
Resolved
L-20
Account seeds based on index of type u8 might limit long-
term protocol operation
Resolved
L-21
There is no feature flag to disable deposits and withdrawals
Resolved
L-22
Missing rent exempt check on withdrawal creation
Resolved
L-23
Order keepers are wrongfully charged for GLV shifts
Resolved
L-24
Users overpay a position’s rent on pure markets
Resolved
I-1
The project relies on vulnerable crate dependencies
Resolved
I-2
Inconsistency of market vault token account seeds
Resolved
I-3
Unused discount when minting GT
Resolved
I-4
Unused accounts in swap.rs
Resolved
I-5
Use of outdated Pyth Solana Receiver Rust SDK
Resolved
I-6
Incorrect error used for event_loader failure
Resolved
I-7
unchecked_insert_factor
is
callable
by
both
CON-
FIG_KEEPER and MARKET_KEEPER
Resolved
I-8
Use of outdated Switchboard On-Demand libraries
Resolved
9

GMX SOLANA PROTOCOL
SMART CONTRACT SECURITY ASSESSMENT
VERSION 1.1
4
Findings
4.1
High Risk
A total of 9 high risk findings were identified.
