---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - has/poc
  - severity/high
  - sector/bridge
  - sector/lending
  - sector/stable
protocol: "[[Blueberry]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Blueberry-security-review_2025-05-16.md"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[bridge-message-validation]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# [H-01] `Escrow.tvl()` does not add in-flight USDC amount

- id: 61494
- impact: HIGH
- protocol: Blueberry_2025-05-16
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[Blueberry]]-security-review_2025-05-16.md

## Summary


The `tvl()` function in the `HyperliquidEscrow` contract is not properly calculating the total value locked (TVL) for USDC when it is being bridged at the same time. This means that the reported TVL is lower than it should be, which can cause users to lose funds or receive more than they should. Two proofs of concept (POCs) have been provided to demonstrate the issue. The recommendation is to fix the logic so that the in-flight USDC amount is also included in the TVL calculation.

## Details


## Severity

**Impact:** Medium  

**Likelihood:** High

## Description

The `tvl()` function in `HyperliquidEscrow` contract does not include the USDC amount that is currently being bridged (in-flight) when calculating the total value locked (TVL). For other assets, if a bridge is happening in the same block, that amount is added to the TVL. But for USDC, this step is skipped. This means the reported TVL is lower than it should be when USDC is being bridged.
```solidity
    function tvl() external view override returns (uint256 tvl_) {
            --Snipped--
            if (assetIndex == USDC_SPOT_INDEX) {
                tvl_ += IERC20(assetAddr).balanceOf(address(this)) * evmScaling;
            } else {
                uint256 rate = getRate(details.spotMarket, details.szDecimals);
                uint256 balance = IERC20(assetAddr).balanceOf(address(this)) * evmScaling;

                uint256 lastBridgeToL1Block = $$.inFlightBridge[assetIndex].blockNumber;
                // If we are still in the L1 bridge period (same EVM block as last bridge action took place), we need to add the in-flight bridge amounts
                if (block.number == lastBridgeToL1Block) {
                    balance += $$.inFlightBridge[assetIndex].amount * evmScaling;
                }

                balance += _spotAssetBalance(uint64(assetIndex));
                tvl_ += balance.mulWadDown(rate);
            }
        }
    }
```
As a result, any user who deposits or redeems in the same block when a USDC bridge is happening will see an incorrect TVL and share price. This can cause users to lose funds or unfairly receive more than they should.

### POC 1

This is a test unit regarding this issue. File should be in `test/hyperliquid` folder. 
[test_tvl.txt](https://github.com/user-attachments/files/20303490/test_tvl.txt)

### POC 2

You can find the PoC [here](https://gist.github.com/zarkk01/dcf5c8f2147c74186c0b85492d7c687b) and run `forge test --mt testTVLIgnoresUSDCBridged`.

## Recommendations

Fix the logic so that the in-flight USDC amount is also added to the TVL if it’s being bridged in the current block, just like other assets. This will make the TVL calculation correct and consistent.
