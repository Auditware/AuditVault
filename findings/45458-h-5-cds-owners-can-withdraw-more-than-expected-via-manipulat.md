---
tags:
  - lang/solidity
  - sector/oracle
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - fix/use-reentrancy-guard
protocol: "[[Autonomint Colored Dollar V1]]"
auditors:
  - "[[newspacexyz]]"
report: "https://github.com/sherlock-audit/2024-11-autonomint-judging"
genome:
  - "[[signature-replay]]"
  - "[[use-reentrancy-guard]]"
  - "[[direct-drain]]"
  - "[[permit-fork-replay]]"
  - "[[reentrancy-guard]]"
---
# H-5: cds owners can withdraw more than expected via manipulating excessProfitCumulativeValue

- id: 45458
- impact: HIGH
- protocol: [[Autonomint Colored Dollar V1]]
- reporter: newspacexyz (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue found in the `cds owners` function of the `CDS.sol` contract. It was discovered that malicious users can manipulate the `excessProfitCumulativeValue` parameter to withdraw more profit than expected. This is possible because the signature and `excessProfitCumulativeValue` can be replayed, allowing users to choose any valid values from the on-chain data. This manipulation can result in malicious users getting more profit than they are entitled to. To fix this issue, the signature check needs to be enhanced so that one signature can only be used for one specific deposit index. 

## Details

Source: https://github.com/sherlock-audit/2024-11-autonomint-judging/issues/469 

## Found by 
0x37, 0x73696d616f, 0xAristos, Galturok, John44, Kral01, Laksmana, PeterSR, RampageAudit, Ruhum, Waydou, ZanyBonzy, newspacexyz, pashap9990, super\_jack, t.aksoy, theweb3mechanic, tjonair, valuevalk, volodya

### Summary

`excessProfitCumulativeValue` in withdraw() can be manipulated. Malicious users can manipulate this `excessProfitCumulativeValue` to withdraw more than expected.

### Root Cause

In [CDS.sol:withdraw](https://github.com/sherlock-audit/2024-11-autonomint/blob/main/Blockchain/Blockchian/contracts/Core_logic/CDS.sol#L279), cds owners can withdraw their usda deposit.

In withdraw(), there is one parameter `excessProfitCumulativeValue`, we will use this parameter `excessProfitCumulativeValue` to calculate the cds owner's possible profit. Although this parameter `excessProfitCumulativeValue` is signed by the admin, the signature and `excessProfitCumulativeValue` can be replayed. When different cds owners withdraw, they will get the different `excessProfitCumulativeValue` and `signature` from the protocol's backend server. Malicious users can choose any valid `excessProfitCumulativeValue`, `nonce` and `signature` from on-chain data.

Malicious users can choose one smaller `excessProfitCumulativeValue` to trigger withdraw() function. Malicious users can get more profit than expected.

```solidity
    function withdraw(
        uint64 index, // deposit index.
        uint256 excessProfitCumulativeValue,
        uint256 nonce,
        bytes memory signature
    ) external payable nonReentrant whenNotPaused(IMultiSign.Functions(5)) {
        if (!_verify(FunctionName.CDS_WITHDRAW, excessProfitCumulativeValue, nonce, "0x", signature)) revert CDS_NotAnAdminTwo();
```
```solidity
    function cdsAmountToReturn(
        address _user,
        uint64 index,
        uint128 cumulativeValue,
        bool cumulativeValueSign,
        uint256 excessProfitCumulativeValue
    ) private view returns (uint256) {
    ...
                    uint256 profit = (depositedAmount * (valDiff - excessProfitCumulativeValue)) / 1e11;
    ...
}
```

### Internal pre-conditions

N/A

### External pre-conditions

N/A

### Attack Path

N/A

### Impact

Malicious users can withdraw more profit than expected via manipulating the `excessProfitCumulativeValue` and `signauture`.

### PoC

N/A

### Mitigation

Enhance the signature check. One signature can only be used for one cds owner's specific deposit index.
