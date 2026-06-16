---
tags:
  - lang/solidity
  - sector/stable
  - sector/token
  - platform/trailofbits
  - has/github
  - has/poc
  - severity/high
  - vuln/reentrancy/single-function
  - precondition/specific-token-type
  - fix/use-reentrancy-guard
  - novelty/known-pattern
  - misassumption/external-call-is-safe
  - trigger/reentrancy-callback
protocol: "[[Origin]]"
auditors:
  - "[[Dominik Teiml]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/OriginDollar.pdf"
genome:
  - "[[single-function]]"
  - "[[specific-token-type]]"
  - "[[use-reentrancy-guard]]"
  - "[[known-pattern]]"
  - "[[direct-drain]]"
  - "[[reentrancy-guard]]"
---
# Reentrancy and untrusted contract call in mintMultiple Diﬃculty: Low

- id: 18201
- impact: HIGH
- protocol: [[Origin Dollar]]
- reporter: Dominik Teiml (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/OriginDollar.pdf

## Summary


A bug was found in the MixOracle.sol contract, which has a high difficulty level. The bug is caused by missing checks and lack of reentrancy prevention in the mintMultiple function. This means that untrusted contracts can be called from the mintMultiple function, which can be used by an attacker to drain the contract.

The mintMultiple function calls a function with the ERC20 transferFrom signature on each of the passed-in asset addresses. An attacker can create a custom contract with this function, which will be called by the mintMultiple function. Without reentrancy protection, the attacker contract can call back into any of the VaultCore contract functions, allowing the attacker to exploit the imbalance between the assets transferred into VaultCore and the minted OUSD.

To fix the bug, short-term checks should be added to the mintMultiple function to revert if the amount is zero or the asset is not supported. Additionally, a reentrancy guard should be added to the mint, mintMultiple, redeem, and redeemAll functions. Long-term, static analysis checks should be incorporated into the CI/CD pipeline, and reentrancy guards should be added to all non-view functions callable by anyone. Lastly, calling untrusted contracts should be disallowed.

## Details

## Data Validation

**Target:** MixOracle.sol

**Difficulty:** High

## Description

Missing checks and no reentrancy prevention allow untrusted contracts to be called from `mintMultiple`. This could be used by an attacker to drain the contracts.

```solidity
function mintMultiple (
    address[] calldata _assets,
    uint256[] calldata _amounts
) external whenNotDepositPaused {
    require(_assets.length == _amounts.length, "Parameter length mismatch");
    uint256 priceAdjustedTotal = 0;
    uint256[] memory assetPrices = _getAssetPrices(false);
    
    for (uint256 i = 0; i < allAssets.length; i++) {
        for (uint256 j = 0; j < _assets.length; j++) {
            if (_assets[j] == allAssets[i]) {
                if (_amounts[j] > 0) {
                    uint256 assetDecimals = Helpers.getDecimals(allAssets[i]);
                    uint256 price = assetPrices[i];
                    if (price > 1e18) {
                        price = 1e18;
                    }
                    priceAdjustedTotal += _amounts[j].mulTruncateScale(price, 10 ** assetDecimals);
                }
            }
        }
    }
    
    // Rebase must happen before any transfers occur.
    if (priceAdjustedTotal > rebaseThreshold && !rebasePaused) {
        rebase(true);
    }
    
    for (uint256 i = 0; i < _assets.length; i++) {
        IERC20 asset = IERC20(_assets[i]);
        asset.safeTransferFrom(msg.sender, address(this), _amounts[i]);
    }
    
    oUSD.mint(msg.sender, priceAdjustedTotal);
    emit Mint(msg.sender, priceAdjustedTotal);
    
    if (priceAdjustedTotal >= autoAllocateThreshold) {
        allocate();
    }
}
```

*Figure 10.1: VaultCore.sol#L84-L127*

If an asset is not supported the first two loops will skip it. Likewise, if the amount is zero the first two loops will skip it. Compare this to the `mint` function which will revert if any of these two checks fail.

Unlike the first two loops, the third loop will not skip unsupported assets. This loop will call a function with the ERC20 `transferFrom` signature on each of the passed in asset addresses. An attacker could create a custom contract with such a function and it will be called. The attacker is free to do as he pleases within this function.

There are no reentrancy guards in the `VaultCore` contract and thus the above custom contract could call back into any of the `VaultCore` functions. Had there been reentrancy protection the attacker contract would not be able to call back into the `VaultCore` contract, severely limiting his abilities.

The third loop will transfer any assets into the `VaultCore` contract. However, only after the third loop is the corresponding OUSD minted. This creates a temporary imbalance between the assets transferred into `VaultCore`, and the minted OUSD. If an attacker contract is called inside this loop he could exploit this temporary imbalance.

## Exploit Scenario

An attacker creates a custom contract containing a `transferFrom` function which calls `Vault.mint`. The attacker calls `mintMultiple` passing in USDT as the first asset and his custom contract as the second asset. The `mintMultiple` function will first transfer the USDT into the `VaultCore` contract, followed by calling the custom contract’s `transferFrom` function. This function calls `Vault.mint` which triggers a rebase. Since the USDT already got transferred into the `VaultCore` contract, but no corresponding OUSD was minted, the imbalance will cause the rebase to function unexpectedly.

## Recommendation

**Short term:** Add checks that cause `mintMultiple` to revert if the amount is zero or the asset is not supported. Add a reentrancy guard to the `mint`, `mintMultiple`, `redeem`, and `redeemAll` functions.

**Long term:** Make use of Slither which will flag the reentrancy. Or even better, use Crytic and incorporate static analysis checks into your CI/CD pipeline. Add reentrancy guards to all non-view functions callable by anyone. Make sure to always revert a transaction if an input is incorrect. Disallow calling untrusted contracts.
