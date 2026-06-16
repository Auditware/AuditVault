---
tags:
  - blockchain/solana
  - lang/rust
  - platform/cantina
  - severity/high
  - vuln/arithmetic/precision-loss
  - impact/loss-of-funds/direct-drain
  - misassumption/math-is-safe
  - fix/fix-arithmetic
  - sector/oracle
protocol: "[[Perena]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[precision-loss]]"
  - "[[direct-drain]]"
  - "[[integer-bounds]]"
  - "[[token2022-transfer-checked]]"
---
3.1.4
Missing Validation on USD-Star Mint Address Allows Unlimited USD-Prime Minting
Severity: Critical Risk
Context: (No context ﬁles were provided by the reviewer)
6

Description:
An
exploitable
lack
of
validation
exists
in
the
unstake
processor
function
in
program/src/processors/unstake.rs.
This vulnerability allows attackers to bypass intended controls
and mint unlimited USD-Prime tokens.
The core issue is that when processing an unstake request, the code fails to validate that the usd_star_-
mint_info provided by the user is the legitimate USD-Star token mint. This oversight creates a critical
vulnerability. The attack path is straightforward:
• An attacker creates a worthless "trash" token they fully control.
• They pass this token mint as usd_star_mint_info when calling the unstake() function.
• The function proceeds to burn their worthless tokens and mint legitimate USD-Prime tokens in re-
turn.
• The amount of USD-Prime minted is based on calculations involving the supposed USD-Star price.
• Attacker uses the newly minted USD_Prime to swap to other tokens, effectively draining all the vaults.
This vulnerability effectively creates an unlimited minting vulnerability for USD-Prime tokens, allowing
attackers to drain the protocol by exchanging worthless tokens for valuable ones.
Recommendation: Add proper validation for the usd_star_mint_info parameter similar to how usd_-
prime_mint_info is validated in both stake() and unstake() functions.
[[Perena]]: Fixed in PR 48.
Cantina Managed: Veriﬁed.
3.2
High Risk
3.2.1
Integer Overﬂow in usd_prime_mint Calculation will lead to making it impossible to mint USD
tokens under normal conditions.
Severity: High Risk
Context: usd_prime_mint.rs#L69
Description: The usd_prime_mint function multiplies asset_amount by asset_price.price and then di-
vides by 10.pow(asset_price.exponent). However, the multiplication is performed in a u64 variable,
which is too small to hold large intermediate results before division, leading to an overﬂow error in normal
minting scenarios.
In the function usd_prime_mint, the calculation of the USD amount follows this formula:.
amount = asset_amount × price
10price.exponent
To minimize precision loss, multiplication is performed before division. However, since u64 can only store
values up to 1.8 × 1019, large token amounts and prices can cause an overﬂow before division occurs.
Proof of Concept: The vulnerable code snippet:
let mut amount: u64 = instruction_data
.asset_amount
.checked_mul(asset_price.price as u64)
.ok_or(ProgramError::ArithmeticOverflow)?;
amount = amount
.checked_div(
10u64
.checked_pow(asset_price.exponent.unsigned_abs())
.ok_or(ProgramError::ArithmeticOverflow)?,
)
.ok_or(ProgramError::ArithmeticOverflow)?;
Vulnerability Scenario:
• u64 can hold up to 1.8 × 1019.
• A normal token supply might be 10ˆ9, with 9 decimal places.
7

• Token amounts would therefore have up to 18 decimal places.
• Price feeds often have 6-8 decimal places (~700 feeds use 5 decimals, ~600 feeds use 8 deci-
mals).
• The multiplication step results in 1026, far exceeding u64's limit, causing an overﬂow.
Example Overﬂow Case:
• amount = 10000 × 109.
• price= 100 × 108.
• Multiplication result: 1023, which exceeds u64's capacity.
Impact: This issue will cause the function to revert due to an arithmetic overﬂow, making it impossible
to mint USD tokens under normal conditions.
Recommendation: To prevent overﬂow, the multiplication should be performed using u128, which can
store values up to 3.4 × 1038 before downcasting to u64. Here is the corrected code:
let amount: u128 = (instruction_data.asset_amount as u128)
.checked_mul(asset_price.price as u128)
.ok_or(ProgramError::ArithmeticOverflow)?;
let divisor: u128 = 10u128
.checked_pow(asset_price.exponent.unsigned_abs() as u32)
.ok_or(ProgramError::ArithmeticOverflow)?;
let amount = amount
.checked_div(divisor)
.ok_or(ProgramError::ArithmeticOverflow)?;
// Safely downcast to u64 if it fits, otherwise return an overflow error
let amount: u64 = amount
.try_into()
.map_err(|_| ProgramError::ArithmeticOverflow)?;
Fix Summary:
• Use u128 for multiplication to prevent intermediate overﬂows.
• Perform division using u128 before converting the result to u64.
• Safely downcast to u64 only if the ﬁnal value ﬁts within u64's range.
This ensures that large token amounts and high-precision price feeds do not cause arithmetic overﬂows.
Perena: Fixed in commit 9baf3dff.
Cantina Managed: Veriﬁed.
3.2.2
Division Before Multiplication Issue Will Lead to Precision Loss and Rounding Down to Zero,
Causing Loss of Funds to Users
Severity: High Risk
Context: (No context ﬁles were provided by the reviewer)
Description: In the function usd_prime_burn, we get the amount of asset to be transferred to the user.
This amount is calculated by the following code:
amount = amount
.checked_div(asset_price.price as u64)
.ok_or(ProgramError::ArithmeticOverflow)?;
amount = amount
.checked_mul(
10u64
.checked_pow(asset_price.exponent.unsigned_abs())
.ok_or(ProgramError::ArithmeticOverflow)?,
)
.ok_or(ProgramError::ArithmeticOverflow)?;
8

The amount is calculated by dividing the amount by the price ﬁrst and then multiplying by
10.pow(exponent). Since the majority of prices have 6 or 8 decimals, and the USD value has 6 decimals
(such as USDC), this will lead to rounding down to zero, which can cause a huge loss of funds for users.
Example Scenario:
• Price = 10.pow(8).
• Prime amount = 99 * 10.pow(6).
This calculation results in:
amount = (99 × 106)/(108) = 0
This will round down to zero, causing the prime_amount to be burned without transferring the asset to the
user:
transfer(
token_program_info,
token_2022_program_info,
asset_mint_info,
bank_info,
bank_asset_info,
user_asset_info,
amount,
asset_info.decimals,
bank_bump,
program_id,
)?;
// burn
burn(
signer_info,
usd_prime_mint_info,
user_prime_info,
bank_bump,
instruction_data.prime_amount,
usd_prime_decimal,
)?;
Recommendation: Perform multiplication before division to prevent precision loss:
amount = amount
.checked_mul(
10u64
.checked_pow(asset_price.exponent.unsigned_abs())
.ok_or(ProgramError::ArithmeticOverflow)?,
)
.ok_or(ProgramError::ArithmeticOverflow)?;
amount = amount
.checked_div(asset_price.price as u64)
.ok_or(ProgramError::ArithmeticOverflow)?;
This ensures that the calculation maintains precision and prevents rounding errors that could lead to fund
loss.
Perena: Fixed in PR 40.
Cantina Managed: Veriﬁed.
