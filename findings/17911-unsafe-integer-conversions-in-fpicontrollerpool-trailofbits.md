---
tags:
  - lang/solidity
  - platform/trailofbits
  - has/github
  - severity/high
  - sector/algo-stable
  - sector/governance
  - sector/lending
  - sector/stable
protocol: "[[Frax Finance]]"
auditors:
  - "[[Gustavo Grieco]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/FraxQ22022.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# Unsafe integer conversions in FPIControllerPool

- id: 17911
- impact: HIGH
- protocol: [[Frax Finance]]
- reporter: Gustavo Grieco (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/FraxQ22022.pdf

## Summary


This bug report is about a data validation issue in the FPIControllerPool contract, which allows certain users to borrow or repay FRAX within certain limits (e.g., the borrowing cap). The issue is that explicit integer conversions can be used to bypass these restrictions. For example, if frax_amount is set to a very large unsigned integer, it could be cast to a negative number, allowing malicious users to exploit the code and bypass the limits. This same issue also affects the implementation of price_info.

The report provides two recommendations to address this issue. The first is to add checks to the relevant functions to validate the results of explicit integer conversions to ensure they are within the expected range. The second is to use extensive smart contract fuzzing to test that system invariants cannot be broken.

## Details

## Difficulty: Low

## Type: Data Validation

## Description

Explicit integer conversions can be used to bypass certain restrictions (e.g., the borrowing cap) in the `FPIControllerPool` contract. The `FPIControllerPool` contract allows certain users to either borrow or repay FRAX within certain limits (e.g., the borrowing cap):

```solidity
// Lend the FRAX collateral to an AMO
function giveFRAXToAMO(address destination_amo, uint256 frax_amount) external onlyByOwnGov validAMO(destination_amo) {
    int256 frax_amount_i256 = int256(frax_amount);
    // Update the balances first
    require((frax_borrowed_sum + frax_amount_i256) <= frax_borrow_cap, "Borrow cap");
    frax_borrowed_balances[destination_amo] += frax_amount_i256;
    frax_borrowed_sum += frax_amount_i256;
    // Give the FRAX to the AMO
    TransferHelper.safeTransfer(address(FRAX), destination_amo, frax_amount);
}

// AMO gives back FRAX. Needed for proper accounting
function receiveFRAXFromAMO(uint256 frax_amount) external validAMO(msg.sender) {
    int256 frax_amt_i256 = int256(frax_amount);
    // Give back first
    TransferHelper.safeTransferFrom(address(FRAX), msg.sender, address(this), frax_amount);
    // Then update the balances
    frax_borrowed_balances[msg.sender] -= frax_amt_i256;
    frax_borrowed_sum -= frax_amt_i256;
}
```

*Figure 4.1: The `giveFRAXToAMO` function in `FPIControllerPool.sol`*

However, these functions explicitly convert these variables from `uint256` to `int256`; these conversions will never revert and can produce unexpected results. For instance, if `frax_amount` is set to a very large unsigned integer, it could be cast to a negative number. Malicious users could exploit this fact by adjusting the variables to integers that will bypass the limits imposed by the code after they are cast.

The same issue affects the implementation of `price_info`:

```solidity
// Get additional info about the peg status
function price_info() public view returns (
    int256 collat_imbalance,
    uint256 cpi_peg_price,
    uint256 fpi_price,
    uint256 price_diff_frac_abs
) {
    fpi_price = getFPIPriceE18();
    cpi_peg_price = cpiTracker.currPegPrice();
    uint256 fpi_supply = FPI_TKN.totalSupply();
    
    if (fpi_price > cpi_peg_price) {
        collat_imbalance = int256(((fpi_price - cpi_peg_price) * fpi_supply) / PRICE_PRECISION);
        price_diff_frac_abs = ((fpi_price - cpi_peg_price) * PEG_BAND_PRECISION) / fpi_price;
    } else {
        collat_imbalance = -1 * int256(((cpi_peg_price - fpi_price) * fpi_supply) / PRICE_PRECISION);
        price_diff_frac_abs = ((cpi_peg_price - fpi_price) * PEG_BAND_PRECISION) / fpi_price;
    }
}
```

*Figure 4.2: The `price_info` function in `FPIControllerPool.sol`*

## Exploit Scenario

Eve submits a governance proposal that can increase the amount of FRAX that can be borrowed. The voters approve the proposal because they believe that the borrowing cap will stop Eve from changing it to a larger value.

## Recommendations

- **Short term:** Add checks to the relevant functions to validate the results of explicit integer conversions to ensure that they are within the expected range.
- **Long term:** Use extensive smart contract fuzzing to test that system invariants cannot be broken.
