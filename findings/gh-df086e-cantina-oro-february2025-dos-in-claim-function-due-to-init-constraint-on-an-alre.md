---
tags:
  - blockchain/solana
  - lang/rust
  - platform/cantina
  - severity/high
  - vuln/dos/init-constraint
  - vuln/oracle/stale-price
  - vuln/pda/reinitialization
  - impact/dos/permanent
  - novelty/known-pattern
  - misassumption/oracle-is-reliable
  - misassumption/proxy-is-initialized
  - fix/add-check
  - fix/initialize-proxy
  - sector/oracle
protocol: "[[Cantina Oro February2025]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[init-constraint]]"
  - "[[stale-price]]"
  - "[[reinitialization]]"
  - "[[permanent]]"
  - "[[known-pattern]]"
  - "[[dos-resistance]]"
  - "[[fot-slippage]]"
  - "[[initializer-auth]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[pda-derivation]]"
  - "[[pyth-oracle-completeness]]"
---
3.2.1
DoS in claim Function Due to init Constraint on an Already Initialized Account
Severity: High Risk
Context: (No context ﬁles were provided by the reviewer)
Description: In the claim function, the init constraint is incorrectly applied to the PDA position. How-
ever, this account is already initialized in the stake function. As a result, the claim function will fail to
execute after the initial staking process, leading to a permanent denial of service (DoS) for claiming re-
wards. This renders the protocol's claiming functionality unusable.
In the claim function, the init constraint is incorrectly applied to the PDA position. However, this account
is already initialized in the stake function. As a result, the claim function will fail to execute after the initial
staking process, leading to a permanent denial of service (DoS) for claiming rewards. This renders the
protocol's claiming functionality unusable.
// in claim function
#[ account(
init,
payer = user,
space = 8 + Position::INIT_SPACE,
) ]
pub position: Box<Account<'info, Position>>,
Recommendation: Replace the init constraint with mut to ensure the position account can be modiﬁed
instead of being reinitialized. Additionally, verify the account’s existence before performing operations to
prevent unintended reinitialization attempts.
#[ account(mut) ]
pub position: Box<Account<'info, Position>>,
Oro: Fixed in commit 9b580eded.
Cantina Managed: Fix veriﬁed.
3.3
Medium Risk
3.3.1
Missing Slippage Parameter Exposes Users to Unintended Prices, Leading to Potential Fund
Loss
Severity: Medium Risk
Context: (No context ﬁles were provided by the reviewer)
Description: In the trading functions buy and sell, trades are executed based on either the oracle price
or a stored constant price, with the higher price being used. While there is a check to ensure price fresh-
ness, there is no validation of the price value itself against a reasonable threshold.
In the trading functions buy and sell , trades are executed based on either the oracle price or a stored
constant price, with the higher price being used. While there is a check to ensure price freshness, there
is no validation of the price value itself against a reasonable threshold. This lack of validation can result
in the use of an inﬂated price from the Pyth oracle due to market volatility, leading to users unknowingly
purchasing assets at signiﬁcantly higher prices. For example, if the stored price and the intended trade
price are 100, but the Pyth oracle returns an inﬂated price of 1000, the system will use 1000, causing a
signiﬁcant loss to the user.
Recommendation: Introduce a slippage parameter to allow users to specify an acceptable price devia-
tion, ensuring they are protected from extreme price ﬂuctuations. Updated buy Function:
10

impl<'info> Buy<'info> {.
pub fn buy(&mut self, amount: u64, max_amount_in: u64) -> Result<()> {
let total_cost = amount * price / 100 * (10000 + self.price.fee)
// Ensure the total cost does not exceed the user's maximum acceptable amount
require!(total_cost <= max_amount_in, CustomError::SlippageExceeded);
Ok(())
}
}
Oro: Fixed in commit f7923435.
Cantina Managed: Fix veriﬁed.
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
As per Pyth's best practices, conﬁdence intervals should be considered when evaluating price validity.
Recommendation: Introduce a conﬁgurable max_confidence_pct parameter in the price account and
validate the conﬁdence percentage before using the price.
• Updated buy Function with Conﬁdence Validation:
impl<'info> Buy<'info> {
pub fn buy(&mut self, amount: u64, max_amount_in: u64, max_confidence_pct: u64) -> Result<()> {
// Fetch price and confidence from Pyth oracle
let pyth_price_result =
price_update.get_price_no_older_than(&Clock::get()?, maximum_age, &feed_id);
let (pyth_price, conf) = match pyth_price_result {
Ok(price) => (price.price, price.conf),
Err(e) => Err(e)?,
};
// Validate confidence percentage.
let confidence_pct = (conf as u128)
.checked_mul(100)?
.checked_div(pyth_price.abs() as u128)?;
require!(
confidence_pct <= max_confidence_pct as u128,
CustomError::PriceConfidenceTooHigh
);
Ok(())
}
}
Oro: Fixed in commit 5df656a9.
Cantina Managed: Fix veriﬁed.
3.3.3
User can unstake anytime instead of getting locked for 1 year
Severity: Medium Risk
Context: (No context ﬁles were provided by the reviewer)
11
