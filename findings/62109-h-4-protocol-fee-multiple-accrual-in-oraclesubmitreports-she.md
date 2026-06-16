---
tags:
  - lang/solidity
  - sector/oracle
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - vuln/logic/fee-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Mellow]]"
auditors:
  - "[[0x23r0]]"
  - "[[0xc0ffEE]]"
  - "[[7]]"
  - "[[Etherking]]"
  - "[[ZanyBonzy]]"
  - "[[blockace]]"
  - "[[evta]]"
  - "[[lodelux]]"
  - "[[silver_eth]]"
report: "https://github.com/sherlock-audit/2025-07-mellow-flexible-vaults-judging"
genome:
  - "[[fee-calculation]]"
  - "[[wrong-state]]"
  - "[[variant]]"
  - "[[fee-accounting]]"
  - "[[integer-bounds]]"
  - "[[timestamp-dependence]]"
---
# H-4: Protocol Fee Multiple Accrual in Oracle.submitReports

- id: 62109
- impact: HIGH
- protocol: [[Mellow]] Flexible Vaults
- reporter: evta (Sherlock)
- source: N/A

## Summary


The `Oracle.submitReports` function in the flexible-vaults protocol processes multiple asset reports in a single transaction. However, the function does not properly handle the calculation and accrual of protocol fees when multiple reports are submitted. This leads to excessive fees being charged when non-base assets are processed before the base asset. The root cause of this issue is the interaction between `Oracle.submitReports` and `ShareModule.handleReport`, which uses an old timestamp to calculate fees instead of updating it for each report. This vulnerability can be exploited by submitting multiple reports in a single transaction and can result in multiple fee accruals. The impact of this bug is that excessive fees can be charged to users. The protocol team has fixed this issue in the latest update.

## Details


Source: https://github.com/sherlock-audit/2025-07-mellow-flexible-vaults-judging/issues/167 

## Found by 
0x23r0, 0xc0ffEE, 7, Etherking, ZanyBonzy, blockace, evta, lodelux, silver\_eth

### Summary

The `Oracle.submitReports` function processes multiple asset reports in a single transaction, but the `ShareModule.handleReport` function calculates and accrues protocol fees for each report individually without considering that the timestamp should only be updated once per batch. This leads to multiple fee accruals when non-base assets are processed before the base asset, resulting in excessive protocol fees being charged.

### Root Cause

The issue stems from the interaction between [`Oracle.submitReports`](https://github.com/sherlock-audit/2025-07-mellow-flexible-vaults/blob/eca8836d68d65bcbfc52c6f04cf6b4b1597555bf/flexible-vaults/src/oracles/Oracle.sol#L103-L121) and `ShareModule.handleReport`. In `ShareModule.handleReport`, the fee calculation uses the current timestamp and the last stored timestamp to calculate protocol fees:

```solidity
// In ShareModule.handleReport (lines 281-283)
uint256 fees = feeManager_.calculateFee(address(this), asset, priceD18, shareManager_.totalShares());
if (fees != 0) {
    shareManager_.mint(feeManager_.feeRecipient(), fees);
}
```

The `FeeManager.calculateFee` function calculates protocol fees based on the time difference:

```solidity
// In FeeManager.calculateFee (lines 81-83)
uint256 timestamp = $.timestamps[vault];
if (timestamp != 0 && block.timestamp > timestamp) {
    shares += Math.mulDiv(totalShares, $.protocolFeeD6 * (block.timestamp - timestamp), 365e6 days);
}
```

However, `FeeManager.updateState` only updates the timestamp when the asset is the base asset:

```solidity
// In FeeManager.updateState (lines 116-128)
function updateState(address asset, uint256 priceD18) external {
    FeeManagerStorage storage $ = _feeManagerStorage();
    address vault = _msgSender();
    if ($.baseAsset[vault] != asset) {
        return; // Early return for non-base assets
    }
    // ... update minPriceD18 and timestamp
    $.timestamps[vault] = block.timestamp;
}
```

When multiple reports are submitted in `Oracle.submitReports`, if the first reports are for non-base assets, the timestamp remains unchanged, causing each subsequent report to calculate fees based on the same old timestamp, leading to multiple fee accruals.

### Internal Pre-conditions

1. The vault must support multiple assets with one designated as the base asset
2. The `Oracle.submitReports` function must be called with multiple reports in a single transaction
3. The first reports in the batch must be for non-base assets
4. The base asset report must appear later in the batch
5. Protocol fees must be configured (protocolFeeD6 > 0)
6. Time must have passed since the last timestamp update (block.timestamp > lastTimestamp)

### External Pre-conditions

.

### Attack Path

1. **Setup**: Configure a vault with multiple assets where one is designated as the base asset
2. **Initial State**: Set protocol fees and ensure time has passed since the last timestamp update
3. **Submit Reports**: Call `Oracle.submitReports` with multiple reports where non-base assets appear first
4. **First Report Processing**: `ShareModule.handleReport` is called for the first non-base asset
   - `FeeManager.calculateFee` calculates protocol fees based on old timestamp
   - Fees are minted to the fee recipient
   - `FeeManager.updateState` is called but returns early (not base asset)
5. **Subsequent Reports**: For each additional report before the base asset:
   - `FeeManager.calculateFee` uses the same old timestamp
   - Additional fees are calculated and minted
   - `FeeManager.updateState` continues to return early
6. **Base Asset Report**: When the base asset report is processed:
   - Fees are calculated again using the old timestamp
   - `FeeManager.updateState` finally updates the timestamp
7. **Result**: Multiple fee accruals have occurred, with fees being charged multiple times for the same time period

### Impact

This vulnerability allows excessive protocol fees to be charged when multiple asset reports are submitted in a single transaction.

### PoC

```solidity
function testMultipleTimesFee() external {
    Deployment memory deployment = createVault(vaultAdmin, vaultProxyAdmin, assetsDefault);
    Oracle oracle = deployment.oracle;
    address asset = assetsDefault[0];

    vm.startPrank(vaultAdmin);
    deployment.feeManager.setFeeRecipient(vaultAdmin);
    deployment.feeManager.setFees(0,0,0, 1e5); // 10% protocol fee
    deployment.feeManager.setBaseAsset(address(deployment.vault), asset);
    vm.stopPrank();

    IOracle.Report[] memory reports = new IOracle.Report[](3); 
    for (uint256 i = 0; i < 3; i++) {
        reports[i].asset = assetsDefault[2 - i];
        reports[i].priceD18 = 1e18;
    }

    vm.startPrank(vaultAdmin);
    oracle.submitReports(reports);
    for (uint256 i = 0; i < 3; i++) {
        oracle.acceptReport(reports[i].asset, reports[i].priceD18, uint32(block.timestamp));
    }
    vm.stopPrank();

    // Set initial shares to 1000
    vm.prank(address(deployment.vault));
    deployment.shareManager.mint(address(0x100), 1000 ether);

    // Move time forward by 1 year
    skip(365 days);

    // Submit reports for 3 assets
    vm.prank(vaultAdmin);
    oracle.submitReports(reports);

    // Check the fee recipient's shares
    uint256 feeRecipientShares = deployment.shareManager.sharesOf(vaultAdmin);
    console.log("Fee recipient shares:", feeRecipientShares);

    assertGt(feeRecipientShares, 300 ether, "Fee recipient shares mismatch");
}
```

### Mitigation

The issue can be mitigated by updating the implementation related to the timestamp update.
I think the timestamp should be updated even though the asset is not the base asset.

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/mellow-finance/flexible-vaults/pull/6/files
