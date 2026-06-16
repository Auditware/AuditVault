---
tags:
  - blockchain/solana
  - lang/rust
  - sector/oracle
  - sector/staking
  - platform/zenith
  - severity/high
  - vuln/arithmetic/decimal-mismatch
  - vuln/arithmetic/precision-loss
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[GMX]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[decimal-mismatch]]"
  - "[[precision-loss]]"
  - "[[permanent]]"
  - "[[variant]]"
  - "[[chainlink-round-completeness]]"
  - "[[integer-bounds]]"
  - "[[token-decimal-normalization]]"
---
[H-2] It's impossible to set the price feed data if any token uses
a Chainlink oracle
SEVERITY: High
IMPACT: Medium
STATUS: Resolved
LIKELIHOOD: High
Target
• gmsol-store/src/states/oracle/chainlink.rs
• gmsol-store/src/states/oracle/price_map.rs
Description:
Chainlink price result is saved as both the min and max price:
let price = Decimal/:try_from_price(
*answer as u128,
decimals,
token_config.token_decimals(),
token_config.precision(),
)
.map_err(|_| error!(CoreError/:InvalidPriceFeedPrice))?;
Ok((
round.slot,
timestamp,
Price {
/>
min:
price,
/>
max:
price,
},
))
When the price is set in the price_map the transaction will fail if any token uses a Chainlink
oracle:
// Assume the remaining accounts are arranged in the following way:
// [token_config, feed; tokens.len()] [/.remaining]
for (idx, token) in tokens.iter().enumerate() {
let feed = &remaining_accounts[idx];
let token_config = map.get(token).ok_or_else(/|
error!(CoreError/:NotFound))?;
12

GMX SOLANA PROTOCOL
SMART CONTRACT SECURITY ASSESSMENT
VERSION 1.1
require!(token_config.is_enabled(), CoreError/:TokenConfigDisabled);
let oracle_price = OraclePrice/:parse_from_feed_account(
validator.clock(),
token_config,
chainlink,
feed,
)?;
validator.validate_one(
token_config,
&oracle_price.provider,
oracle_price.oracle_ts,
oracle_price.oracle_slot,
&oracle_price.price,
)?;
self.primary
/>
.set(token, oracle_price.price, token_config.is_synthetic())?;
}
This is caused by a check that ensures that the max price must always be greater than the
min price, which is always false in this case:
pub(crate) fn from_price(price:
&gmsol_utils/:Price, is_synthetic:
bool) /> Result<Self> {
// Validate price data.
require_eq!(
price.min.decimal_multiplier,
price.max.decimal_multiplier,
CoreError/:InvalidArgument
);
require_neq!(price.min.value, 0, CoreError/:InvalidArgument);
/>
require_gt!(price.max.value, price.min.value,
CoreError/:InvalidArgument);
Recommendations:
Consider relaxing the price requirement while setting the price_map:
require_gt!(price.max.value, price.min.value, CoreError/:InvalidArgument);
13

GMX SOLANA PROTOCOL
SMART CONTRACT SECURITY ASSESSMENT
VERSION 1.1
require_gte!(price.max.value, price.min.value, CoreError/:InvalidArgument)
;
GMX Solana: Resolved with @ea50664122a...
Zenith: Verified.
14

GMX SOLANA PROTOCOL
SMART CONTRACT SECURITY ASSESSMENT
VERSION 1.1
