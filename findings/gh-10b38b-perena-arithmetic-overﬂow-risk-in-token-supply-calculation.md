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
  - sector/oracle
protocol: "[[Perena]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[decimal-mismatch]]"
  - "[[direct-drain]]"
  - "[[known-pattern]]"
  - "[[dos-resistance]]"
  - "[[integer-bounds]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[pyth-oracle-completeness]]"
  - "[[token-decimal-normalization]]"
  - "[[token2022-transfer-checked]]"
---
3.2.3
Arithmetic Overﬂow Risk in Token Supply Calculation
Severity: High Risk
Context: helpers/mod.rs#L49-L57
Description: In the get_mint_supply() function of src/helpers/mod.rs, there is a signiﬁcant risk of arith-
metic overﬂow when calculating token supply with high values. The function attempts to normalize token
supply to a standardized decimal representation (using DENOMINATOR = 1_000_000). The issue occurs in
this calculation:
9

• helpers/mod.rs#L49-L57:
supply = supply
.checked_mul(DENOMINATOR)
.ok_or(ProgramError::ArithmeticOverflow)?
.checked_div(
10u64
.checked_pow(decimals as u32)
.ok_or(ProgramError::ArithmeticOverflow)?,
)
.ok_or(ProgramError::ArithmeticOverflow)?;
For tokens with 6 decimals (which appears to be the case for both USD Star and USD Prime), this calcula-
tion becomes problematic when the supply reaches approximately 19 million tokens. At this point:
• The raw supply would be 19M × 106 = 19 × 1012.
• When multiplied by DENOMINATOR (1_000_000), this exceeds the maximum value for u64.
This is particularly concerning because:
1. The current supply of USD Star is reported to be around 14 million (14 × 1012 raw value).
2. Growing to 19 million is reasonably likely in the near future.
The impact of this overﬂow would be severe - it would cause a denial of service in critical token operations:
• usd_prime_mint() and usd_prime_burn() would fail when USD Prime reaches the 19 Million supply.
• usd_star_mint() and usd_star_burn() would fail when USD Star reaches the 19 Million supply.
Recommendation: Since the function's primary purpose appears to be providing token decimals rather
than normalized supply calculations, the simplest solution is to remove the supply normalization logic. If
normalized supply is actually needed by callers, consider using a larger integer type (e.g., u128) for the
calculation to avoid overﬂow.
[[Perena]]: DENOMINATOR is removed in commit e4ee6af9.
Cantina Managed: Veriﬁed.
3.3
Medium Risk
3.3.1
Unﬁltered Support for Token-2022 Extensions such as fees-on-transfer Break Protocol Logic
which leads to loss of funds
Severity: Medium Risk
Context: (No context ﬁles were provided by the reviewer)
Summary: Allowing arbitrary Token-2022 extensions can disrupt protocol logic, particularly in minting
and burning functions. Some extensions, such as fees-on-transfer, deduct a fee when transferring tokens,
leading to discrepancies between expected and actual received amounts, which can cause fund loss.
Description: The protocol assumes that the amount speciﬁed by the user in minting and burning oper-
ations matches the actual amount received. However, Token-2022 extensions can introduce unexpected
behavior. Speciﬁcally, fees-on-transfer extensions deduct a portion of the transferred amount as a fee,
meaning the protocol will receive less than intended.
This discrepancy leads to:
• Loss of protocol funds since the system operates on incorrect balance assumptions.
• Broken protocol logic where minting and burning functions no longer behave as expected.
Proof of Concept: Scenario demonstrating fund loss:
1. A user initiates a minting operation with 100 tokens.
2. The protocol assumes it will receive 100 tokens.
3. If the token has a fees-on-transfer extension (e.g., 2% fee), only 98 tokens reach the protocol.
4. The discrepancy causes incorrect accounting, leading to fund loss or unexpected failures.
10

Impact:
• Loss of protocol funds due to inaccurate balance calculations.
• Minting/burning logic failure if assumptions about received amounts are incorrect.
Recommendation: Restrict the supported Token-2022 extensions to only those compatible with the pro-
tocol. Implement a ﬁlter function to validate mints and ensure only intended extensions are allowed:
pub fn is_supported_mint(mint_account: &InterfaceAccount<Mint>) -> bool {
let mint_info = mint_account.to_account_info();
let mint_data = mint_info.data.borrow();
let mint = StateWithExtensions::<spl_token_2022::state::Mint>::unpack(&mint_data)
.map_err(|_| return false)
.unwrap();
let extensions = mint.get_extension_types().unwrap();
for e in extensions {
// Only allow extensions explicitly compatible with the protocol
if e != ExtensionType::MetaDataPointer {
return false;
}
}
true
}
Fix Summary:
• Validate Token-2022 mints before processing to prevent unexpected behaviors.
• Explicitly allow only safe extensions that do not interfere with protocol logic.
• Reject tokens with fees-on-transfer or other unsupported behaviors to avoid fund loss.
This ensures the protocol functions correctly without unexpected side effects from arbitrary Token-2022
extensions.
Perena Addressed in PR 37. Other than TransferFeeAmount, what other extensions would cause loss of
funds?
Cantina Managed: Veriﬁed.
3.3.2
Missing Conﬁdence Validation in Pyth Oracle Price
Severity: Medium Risk
Context: (No context ﬁles were provided by the reviewer)
Description: The trading functions that use the Pyth oracle price do not validate conﬁdence values (conf
and ema_conf). They only use get_price_no_older_than to check staleness but do not ensure that the
conﬁdence percentage remains within an acceptable threshold. This omission can lead to:
• Using prices during high uncertainty periods, which may not reﬂect accurate market conditions.
• Missing market anomaly signals, potentially overlooking extreme price deviations.
• Potential incorrect liquidations during low market conﬁdence, leading to unfair liquidations or im-
proper risk calculations.
