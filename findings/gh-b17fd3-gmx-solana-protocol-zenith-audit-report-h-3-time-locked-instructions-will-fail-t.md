---
tags:
  - blockchain/solana
  - lang/rust
  - platform/zenith
  - severity/high
  - sector/governance
  - sector/perpetuals
protocol: "[[GMX]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[signature-validation]]"
  - "[[permanent]]"
  - "[[timelock-timestamp-bypass]]"
---
[H-3] Time-locked instructions will fail to execute due to
insufficient signing
SEVERITY: High
IMPACT: High
STATUS: Resolved
LIKELIHOOD: Medium
Target
• programs/gmsol-timelock/src/instructions/instruction_buffer.rs#L389-L395
Description:
Every time-locked instruction is buffered with its executor and all its accounts necessary for
execution where some of them can be signers. Additionally, the executor is always set as a
signer too, see here.
However, on execution of the instruction, it is only signed by the executor wallet's signer
seeds and not by the executor account which is set as a signer. Additionally, it is not signed
by any of the accounts that were specified as signers when the instruction was created.
Consequently, time-locked instructions will fail to execute blocking crucial protocol actions.
Recommendations:
It is recommended to revise the instruction signing mechanism:
1. Set the executor's wallet instead of the executor as signer in the instruction.
2. Ensure the invocation is signed by all accounts that were set as signers when the
instruction was created.
GMX Solana: Fixed in @36112aa6868....
Zenith: Verified. Resolved by marking the executor wallet as signer instead of the executor.
15

GMX SOLANA PROTOCOL
SMART CONTRACT SECURITY ASSESSMENT
VERSION 1.1
[H-4] Wrong funding factor on markets with adaptive funding
SEVERITY: High
IMPACT: High
STATUS: Resolved
LIKELIHOOD: Medium
Target
• gmsol-store/src/ops/market.rs
• gmsol-model/src/action/update_funding_state.rs
Description:
When a market updates its funding state, the calculation of the funding factor may be
wrong on a market with adaptive funding (i.e. when increase_factor_per_second > 0).
The issue is that when the increase factor is positive, the function that calculates the
funding factor returns zero even if it should not.
This would result in a zero funding factor as the funding_value will be multiplied by zero
(which will be wrong when the open interest and/or short interest are not zero).
Recommendations:
Consider returning a zero funding factor only when the adaptive funding is not enabled:
let funding_increase_factor_per_second = self.market.funding_fee_params()/.
increase_factor_per_second();
if diff_value.is_zero(){
if diff_value.is_zero() && funding_increase_factor_per_second.is_zero() {
return Ok((Zero/:zero(), true, Zero/:zero()));
}
GMX Solana: Resolved with @ea50664122...
Zenith: Verified.
16

GMX SOLANA PROTOCOL
SMART CONTRACT SECURITY ASSESSMENT
VERSION 1.1
