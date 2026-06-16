---
tags:
  - blockchain/evm
  - blockchain/evm/mode
  - lang/solidity
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - sector/lending
protocol: "[[Autonomint Colored Dollar V1]]"
auditors:
  - "[[0x37]]"
report: "https://github.com/sherlock-audit/2024-11-autonomint-judging"
genome:
  - "[[stale-price]]"
  - "[[direct-drain]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# H-6: Lack of lastEthPrice sync between different chains

- id: 45459
- impact: HIGH
- protocol: [[Autonomint Colored Dollar V1]]
- reporter: 0x37 (Sherlock)
- source: N/A

## Summary


The bug report is about a lack of synchronization of the lastEthPrice between different chains in the Autonomint system. This can cause incorrect calculation of the cumulative value of CDS deposits, resulting in incorrect withdrawal amounts for users. The root cause of the issue is that the lastEthPrice is only updated in the current chain and not synced with other chains. This can lead to repeated calculation of gains/losses when users deposit or withdraw in different chains. The impact of this bug is incorrect calculation of the cumulative value, which can result in incorrect withdrawal amounts for users. The suggested mitigation is to sync the lastEthPrice with other chains to ensure accurate calculation of gains/losses. 

## Details

Source: https://github.com/sherlock-audit/2024-11-autonomint-judging/issues/533 

## Found by 
0x37, valuevalk

### Summary

The missing sync of lastEthPrice will cause incorrect cds cumulative value calculation.

### Root Cause

When users deposit or withdraw in cds, we will timely [update the cds cumulative value](https://github.com/sherlock-audit/2024-11-autonomint/blob/main/Blockchain/Blockchian/contracts/lib/CDSLib.sol#L489-L502).

We will calculate the cds gain/loss according to the ether price change from lastEthPrice to current Ether price. We will update the lastEthPrice after our calculation.

The problem is that the cds gain/loss stands for the total cds deposit's gain or loss including Op chain and Mode chain. We just update the `lastEthPrice` variable in current chain and don't sync with the other chain. When users deposit/withdraw in the other chain and calculate the cds gain/loss accroding to the ether price change, we will re-calculate the previous gain/loss because of the un-synced lastEthPrice.

For example:
1. Alice deposits in OP Chain in timestamp X. `lastEthPrice` = 3500 USD.
2. Bob deposits in Mode Chain in timestamp X. `lastEthPrice` = 3500 USD.
3. Cathy deposits in OP chain in timestamp X + 100, current Ether price = 4000 USD. We will calculate the cds gain/loss bettwne timestamp X and timestamp X + 100. The gain/loss will be updated to global variable `omniChainData.cumulativeValue` and `omniChainData.cumulativeValueSign`. `lastEthPrice` in OP Chain is updated to 4000 USD.
4. Dean deposits in Mode Chain in timestamp X + 200, current Ether price = 4000 USD. When we calculate the cds gain/loss, we will calculate the gain/loss from 3500 USD to 4000 USD because the `lastEthPrice` is still 3500 USD. This will cause the gain/loss will be calculated repeatedly.
  
```solidity
    function calculateCumulativeValue(
        uint128 _price, // current ether price
        uint256 totalCdsDepositedAmount, // usda amount in the treasury
        uint128 lastEthPrice, // last ether price
        uint256 vaultBal // collateral ether amount
    ) public pure returns (CDSInterface.CalculateValueResult memory) {
            if (_price > lastEthPrice) {
                priceDiff = _price - lastEthPrice;
                gains = true;
            } else {
                priceDiff = lastEthPrice - _price;
                gains = false;
            }
            value = uint128((_amount * vaultBal * priceDiff * 1e6) / (PRECISION * totalCdsDepositedAmount));
}

```
```solidity
        if (ethPrice != lastEthPrice) {
            updateLastEthPrice(ethPrice);
        }
```

### Internal pre-conditions

N/A

### External pre-conditions

N/A

### Attack Path

1. Alice deposits in OP Chain in timestamp X. `lastEthPrice` = 3500 USD.
2. Bob deposits in Mode Chain in timestamp X. `lastEthPrice` = 3500 USD.
3. Cathy deposits in OP chain in timestamp X + 100, current Ether price = 4000 USD. We will calculate the cds gain/loss bettwne timestamp X and timestamp X + 100. The gain/loss will be updated to global variable `omniChainData.cumulativeValue` and `omniChainData.cumulativeValueSign`. `lastEthPrice` in OP Chain is updated to 4000 USD.
4. Dean deposits in Mode Chain in timestamp X + 200, current Ether price = 4000 USD. When we calculate the cds gain/loss, we will calculate the gain/loss from 3500 USD to 4000 USD because the `lastEthPrice` is still 3500 USD. This will cause the gain/loss will be calculated repeatedly.
  

### Impact

The cds cumulative value calculation will be incorrect. This will cause cds owner's withdraw amount will be incorrect, more or less than expected.

### PoC

N/A

### Mitigation

Sync the `lastEthPrice` with the other chain.
