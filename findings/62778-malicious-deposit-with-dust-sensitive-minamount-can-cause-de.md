---
tags:
  - lang/solidity
  - sector/bridge
  - platform/quantstamp
  - severity/high
  - vuln/arithmetic/decimal-mismatch
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Camp]]"
auditors:
  - "[[Paul Clemson]]"
report: "https://certificate.quantstamp.com/full/camp/ae830654-5f2b-4d21-aba2-1de572092da6/index.html"
genome:
  - "[[decimal-mismatch]]"
  - "[[temporary]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
  - "[[fot-slippage]]"
  - "[[reentrancy-guard]]"
  - "[[timelock-timestamp-bypass]]"
  - "[[token-decimal-normalization]]"
---
# Malicious Deposit with Dust-Sensitive `minAmount` Can Cause Denial of Service on `batchRelease()` Function

- id: 62778
- impact: HIGH
- protocol: [[Camp]]
- reporter: Paul Clemson (Quantstamp)
- source: https://certificate.quantstamp.com/full/camp/ae830654-5f2b-4d21-aba2-1de572092da6/index.html

## Summary

A bug has been reported in the `CampTimelockEscrowNativeOFT.sol` file where a malicious user can exploit the `_removeDust()` function to cause a Denial of Service (DoS) condition. This is due to a lack of validation in the `batchRelease()` function, which processes deposits sequentially and does not handle errors for individual deposits. The exploit involves setting a `_minAmount` parameter that is incompatible with the dust-adjusted amount, causing a revert and blocking the processing of subsequent deposits. The recommendation is to add a validation check in the `bridgeOut()` function to prevent this exploit. The bug has been marked as "Fixed" by the client and addressed in the `b7c7f7e589e706a63e0378b4bd0ae6a8d2fef6e2` update.

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `b7c7f7e589e706a63e0378b4bd0ae6a8d2fef6e2`.

**File(s) affected:**`CampTimelockEscrowNativeOFT.sol`

**Description:** The `batchRelease()` function in `CampTimelockEscrowNativeOFT` processes deposits sequentially in a loop. When processing each deposit, it calls `_bridgeNativeTokens()`, which internally triggers LayerZero's dust removal mechanism via `_removeDust()`. This function rounds down the amount by removing decimal precision dust to ensure compatibility across chains with different token decimals.

However, a malicious user can exploit this mechanism by setting a `_minAmount` parameter that becomes incompatible with the dust-adjusted amount. The LayerZero `OFTCore` contract performs a slippage check that reverts if the dust-adjusted amount falls below the user-specified `_minAmount`:

```
// In OFTCore._debitView()
amountSentLD = _removeDust(_amountLD);
amountReceivedLD = amountSentLD;

// Check for slippage - this will revert if dust removal reduces amount below minAmount
if (amountReceivedLD < _minAmountLD) {
    revert SlippageExceeded(amountReceivedLD, _minAmountLD);
}
```

When this revert occurs during the `batchRelease` loop, it causes the entire transaction to revert. Since deposits are processed sequentially and there's no error handling around individual deposit processing, a single malicious deposit can permanently block the processing of all subsequent deposits in the queue, effectively creating a Denial of Service condition.

Another simpler attack could be that `minAmount` is simply larger than the `_originalAmount`, and since there is no validation, it will always fail too. The fix with dust adjusted value should fix both scenarios.

**Exploit Scenario:**

1.   Alice (legitimate user) calls `bridgeOut()` with 10 ETH, creating a deposit that gets queued for processing.
2.   Bob (attacker) analyzes the dust calculation parameters and calls `bridgeOut()` with carefully chosen parameters: `_originalAmount = 1.0000123 ETH` and `_minAmount = 1.0000120 ETH`.
3.   Bob's deposit is queued after Alice's deposit.
4.   After the `holdPeriod` expires, a keeper calls `batchRelease()` to process the matured deposits.
5.   The function successfully processes Alice's deposit first.
6.   When processing Bob's deposit, `_removeDust()` rounds down `1.0000123 ETH` to `1.0000100 ETH` (assuming appropriate decimal conversion rate).
7.   The slippage check `1.0000100 ETH < 1.0000120 ETH` fails, causing `SlippageExceeded` revert.
8.   The entire `batchRelease()` transaction reverts, and the cursor position is not updated.
9.   All future calls to `batchRelease()` will attempt to process Bob's malicious deposit first, causing the same revert and permanently blocking the queue.

**Recommendation:** Add a validation check in the `bridgeOut()` function to ensure that `_minAmount` is compatible with the dust-adjusted amount before allowing the deposit to be queued:

```
function bridgeOut(address _to, uint128 _gaslimit, uint256 _originalAmount, uint256 _minAmount) external payable nonReentrant {

    // Prevent DoS by ensuring minAmount is compatible with dust removal
    uint256 dustAdjustedAmount = removeDust(_originalAmount);
    require(_minAmount <= dustAdjustedAmount, "CampTimelockEscrowNativeOFT: minAmount exceeds dust-adjusted amount");

    if (whitelist[msg.sender]) {
        _bridgeNativeTokens(_to, _originalAmount, _minAmount, _gaslimit);
    } else {
        // ... rest of escrow logic
    }
}
```
