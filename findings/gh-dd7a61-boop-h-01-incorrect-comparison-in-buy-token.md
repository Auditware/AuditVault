---
tags:
  - blockchain/solana
  - lang/rust
  - sector/launchpad
  - platform/pashov
  - severity/high
  - impact/loss-of-funds/direct-drain
  - novelty/variant
protocol: "[[Boop]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[frozen-funds]]"
  - "[[direct-drain]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
  - "[[fot-slippage]]"
  - "[[pda-derivation]]"
---
[H-01] 
Incorrect Comparison in `buy_token` 
Leading to Graduation Threshold 
Violation 
High  
Resolved 
[M-01] 
 
Slippage Protection Bypass in 
`buy_token` 
Medium 
Resolved 
[L-01] 
Incorrect Macro Usage for Pubkey 
Comparison 
Low 
Resolved 
[L-02] 
Insecure Authority Transfer Leading 
to Potential DoS 
Low 
Resolved 
[L-03] 
Setting the destination address to a 
PDA of a Token Account Closure 
Leading to SOL Lock 
Low 
Resolved 
[L-04] 
Missing Validation for Raydium 
Program Address 
Low 
Resolved 
[L-05] 
Missing Validation for `amount > 0` in 
`wrap` Function 
Low 
Resolved 
[L-06] 
Missing Validation for 
`protocol_fee_recipient` in 
`update_config` 
Low 
Resolved 
[L-07] 
Permanent Freezing of 
`create_raydium_pool` Due to Seed 
Constraint  
Low 
Resolved 
​
 

Risk Classification
Audit Scope
All the programs in [[Boop]]-solana/programs  :
boop
fee_spiltter
reward_pool
sboop
Commit Hash : https://github.com/Boop-fun/boop-
solana/commit/b7f7533ad783c1a489e4977e013f18ece4bca277
Findings
1. High Findings
1.1 Incorrect Comparison in buy_token  Leading to Graduation
Threshold Violation
Description
In the buy_token  function, the comparison between net_buy_amount  and
max_buy_amount_with_fees  is incorrect. The issue arises because max_buy_amount_with_fees
represents the remaining tokens in the bonding curve after adding fees, while net_buy_amount  is the
user's token amount after subtracting fees.
This mismatch can cause the function to allow purchases beyond the graduation threshold, leading to
users paying more for fewer tokens at an inflated price.
Impact

This issue Leads to Graduation Threshold Violation which is core variant in the system , and results in
users buying more tokens at a much higher price than expected due to exceeding the bonding curve’s
graduation threshold. Specifically, the bonding curve’s SOL reserves ( sol_reserves ) can exceed the
intended graduation reserve, leading to unfair pricing and potential loss of funds for the user.
Scenario:
Amount in: 55 SOL
Fee: 10% (0.1)
Max amount without fees: 45 SOL
Max amount with fees: 50 SOL
Net buy amount: 49.5 SOL
Current Condition:
if net_buy_amount <= max_buy_amount_with_fees {
   actual_buy_amount = net_buy_amount; // amount after taking fees
   actual_swap_fee = swap_fee;
} else {
   actual_buy_amount = max_buy_amount_without_fees; // amount without 
taking fees
   actual_swap_fee = max_buy_amount_with_fees
       .checked_sub(max_buy_amount_without_fees)
       .unwrap();
};
Actual Values in This Scenario:
actual_buy_amount: 49.5 SOL
actual_swap_fee: 5.5 SOL
Since actual_buy_amount  is incorrectly calculated since it is greater than Max amount without
