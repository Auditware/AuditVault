---
tags:
  - blockchain/solana
  - lang/rust
  - platform/cantina
  - severity/high
  - vuln/arithmetic/decimal-mismatch
  - impact/loss-of-funds/direct-drain
  - novelty/known-pattern
  - misassumption/math-is-safe
  - fix/fix-arithmetic
  - sector/dex
protocol: "[[Perena]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[decimal-mismatch]]"
  - "[[direct-drain]]"
  - "[[known-pattern]]"
  - "[[integer-bounds]]"
  - "[[token-decimal-normalization]]"
---
3.1.1
Incorrect Decimal conversion Leads to Signiﬁcant Fund Loss
Severity: Critical Risk
Context: (No context ﬁles were provided by the reviewer)
Description: In the usd_star_mint and usd_star_burn functions, the decimal scaling logic is incorrect,
leading to a signiﬁcant loss of funds for both users and the protocol. The issue arises in the following
snippet:
if asset_info.decimals > usd_star_decimal {
amount = amount
.checked_mul(
10u128
.checked_pow((asset_info.decimals - usd_star_decimal) as u32)
.ok_or(ProgramError::ArithmeticOverflow)?,
)
.ok_or(ProgramError::ArithmeticOverflow)?;
} else if asset_info.decimals < usd_star_decimal {
amount = amount
.checked_div(
10u128
.checked_pow((usd_star_decimal - asset_info.decimals) as u32)
.ok_or(ProgramError::ArithmeticOverflow)?,
)
.ok_or(ProgramError::ArithmeticOverflow)?;
}
Here, the amount value is initially scaled according to the asset's decimals. However, the conversion logic
mistakenly applies the scaling operation in the wrong direction. This results in incorrect token amounts
being minted, causing substantial discrepancies in value.
Impact:
• Users may receive signiﬁcantly fewer tokens than expected.
• The protocol may suffer a substantial loss of funds due to incorrect scaling.
• This could lead to arbitrage exploits and ﬁnancial imbalances in the system.
Recommendation: To ensure correct decimal scaling, swap the multiplication and division operations in
the conditional statements:
if asset_info.decimals > usd_star_decimal {
amount = amount
-
.checked_mul(
+
.checked_div(
10u128
.checked_pow((asset_info.decimals - usd_star_decimal) as u32)
.ok_or(ProgramError::ArithmeticOverflow)?,
)
.ok_or(ProgramError::ArithmeticOverflow)?;
} else if asset_info.decimals < usd_star_decimal {
amount = amount
-
.checked_div(
+
.checked_mul(
10u128
.checked_pow((usd_star_decimal - asset_info.decimals) as u32)
.ok_or(ProgramError::ArithmeticOverflow)?,
)
.ok_or(ProgramError::ArithmeticOverflow)?;
}
By making this correction, the amount will be properly scaled to match the usd_star_decimal.
[[Perena]]: Fixed in PR 38.
Cantina Managed: Veriﬁed.
4

3.1.2
Token Decimals Are Not Handled in usd_prime_burn and usd_prime_mint, Leading to Huge Loss
of Funds for Both Protocol and Users
Severity: Critical Risk
Context: (No context ﬁles were provided by the reviewer)
Description: In the functions usd_prime_burn and usd_prime_mint, the decimals of the asset and prime_-
usd are not properly handled, which can result in a huge loss of funds for both the protocol and users.
Example: Issue in usd_prime_burn: The amount is in usd_prime decimals, and it gets divided by the price
(which is a scalar). This results in an amount in prime_decimal instead of the correct asset decimals. Prob-
lematic Code:
let mut amount = instruction_data
.prime_amount
.checked_mul(FEE_RATE_SCALE - bank.prime_fee_rate as u64)
.ok_or(ProgramError::ArithmeticOverflow)?
.checked_div(FEE_RATE_SCALE)
.ok_or(ProgramError::ArithmeticOverflow)?;
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
Example Scenario:
• USD Prime Decimals = 6.
• Asset Decimals = 9.
• Fees = 0 (for simplicity).
• Asset Price = 5 * 10ˆ5.
• Exponent = -5.
• USD Prime Amount = 5 * 10ˆ6.
Calculation:
amount = (5 * 10^6) / 5 = 10^6
The asset amount to be transferred is 106 instead of 109. Since the asset price is 5 USD and we are burning
5 units of USD Prime, the user should receive 109, but instead, they receive 106, causing a massive loss
of funds for users. Another Scenario Where the Protocol Loses Funds: If usd_prime decimals are greater
than the asset decimals, the protocol will suffer from this vulnerability and lose funds. To correct this, the
amount should be multiplied by 10ˆ(asset_decimals - usd_prime_decimals) to get the correct value.
Recommendation: Convert the decimals of the amount in the functions usd_prime_burn and usd_prime_-
mint as shown here:
5

// usd_prime_burn
if asset_info.decimals > usd_prime_decimal {
amount = amount
.checked_mul(
10u128
.checked_pow((asset_info.decimals - usd_prime_decimal) as u32)
.ok_or(ProgramError::ArithmeticOverflow)?,
)
.ok_or(ProgramError::ArithmeticOverflow)?;
} else if asset_info.decimals < usd_prime_decimal {
amount = amount
.checked_div(
10u128
.checked_pow((usd_prime_decimal - asset_info.decimals) as u32)
.ok_or(ProgramError::ArithmeticOverflow)?,
)
.ok_or(ProgramError::ArithmeticOverflow)?;
}
Applying this ﬁx ensures precision is maintained and prevents fund losses for both users and the protocol.
Perena: Fixed in PR 38.
Cantina Managed: Veriﬁed.
