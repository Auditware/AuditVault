---
tags:
  - lang/solidity
  - sector/stable
  - sector/token
  - platform/quantstamp
  - severity/high
  - impact/loss-of-funds/direct-drain
  - impact/loss-of-funds/fee-theft
  - impact/mev/frontrun
protocol: "[[Sequence]]"
auditors:
  - "[[Andy Lin]]"
report: "https://certificate.quantstamp.com/full/sequence-trail-contracts/3ff783d8-842e-4622-a9e9-f8052449161b/index.html"
genome:
  - "[[missing]]"
  - "[[direct-drain]]"
  - "[[fee-theft]]"
  - "[[frontrun]]"
  - "[[dos-resistance]]"
  - "[[frontrun-exposure]]"
---
# Unsigned Fee Parameters Let Any Signature Holder Drain Funds

- id: 64135
- impact: HIGH
- protocol: [[Sequence]] - Trail Contracts
- reporter: Andy Lin (Quantstamp)
- source: https://certificate.quantstamp.com/full/sequence-trail-contracts/3ff783d8-842e-4622-a9e9-f8052449161b/index.html

## Summary


The client has marked the bug as "fixed" in their latest update. The bug was related to two functions in the `TrailsIntentEntrypoint` contract, `depositToIntentWithPermit()` and `depositToIntent()`, which accepted `feeAmount` and `feeCollector` as parameters without requiring user signature. This created vulnerabilities that allowed malicious actors to drain user funds through inflated fees. The bug has been fixed in two parts, including adding explicit validation to ensure the permit covers both the deposit and fee amounts. The recommendation is to extend the type hash definition to include these fields and modify the function to verify these parameters. These changes will prevent unauthorized fee extraction and maintain the flexibility of the intent-based architecture. 

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `f36f3e8a1e00c7227db86f45ba2bff2df440d1ca`although the main fix is in commit `bfc4459`. The client provided the following explanation:

> Fixed in two parts:
> 
> 
> 1.   CRITICAL FIX (`bfc4459`): Added `feeAmount` and `feeCollector` to `TRAILS_INTENT_TYPEHASH`. Fee parameters are now part of the EIP-712 typed data signature, preventing malicious relayers from injecting arbitrary fees or draining user funds.
> 2.   ADDITIONAL VALIDATION (`79ff75f`, `cad0793`, `171b2c3`): Added explicit validation to ensure `permitAmount` exactly matches amount + `feeAmount` in `depositToIntentWithPermit()`. This prevents DoS scenarios where permits are insufficient and provides clear error messages with the `PermitAmountMismatch()` custom error.

**File(s) affected:**`TrailsIntentEntrypoint.sol`

**Description:** Both `depositToIntentWithPermit()` and `depositToIntent()` functions in the `TrailsIntentEntrypoint` contract accept `feeAmount` and `feeCollector` as parameters without requiring user signature, creating two critical vulnerabilities that expose users to fund drainage.

The `feeAmount` and `feeCollector` parameters are not included in the signed intent defined by `TRAILS_INTENT_TYPEHASH`, allowing any relayer or even actors observing the mempool to specify arbitrary values when executing a user's intent. Since users typically grant maximum or excess token allowances for convenience, malicious relayers can frontrun legitimate transactions and drain the user's entire token balance through inflated fees. The contract will successfully transfer both the intended deposit amount and the malicious fee amount, as long as the user has sufficient balance and allowance.

Additionally, the `depositToIntentWithPermit()` function contains a validation gap where `permitAmount` is independent from `amount` and `feeAmount`. The contract does not enforce that `permitAmount == amount + feeAmount`, creating edge cases where permits may be insufficient or users unknowingly over-sign, exposing them to malicious fee extraction.

**Exploit Scenario:**

1.   Alice signs an intent to deposit 100 USDC with a legitimate relayer advertising 1 USDC fee.
2.   Alice grants maximum approval or permits a large amount (1000 USDC) for convenience.
3.   Bob, a malicious relayer, observes Alice's transaction in the mempool.
4.   Bob frontruns Alice's transaction by calling `depositToIntent()` with `feeAmount=900` and his own `feeCollector` address.
5.   The contract successfully transfers 100 USDC to the intent address and 900 USDC to Bob's fee collector, as the signature only validates the deposit amount.
6.   Alice loses 900 USDC despite only intending to pay 1 USDC in fees, with no recourse since the transaction was technically valid according to her signed intent.

**Recommendation:** Extend `TRAILS_INTENT_TYPEHASH` to include `feeAmount` and `feeCollector` parameters, ensuring users explicitly authorize the complete fee structure as part of their intent signature. Update the type hash definition to include these fields and modify the `_verifyAndMarkIntent()` function to verify these additional parameters match the signed intent.

Also, add validation in `depositToIntentWithPermit()` to ensure the permit covers both the deposit and fee amounts:

```
require(permitAmount == amount + feeAmount, "Insufficient permit amount");
```

These changes ensure users explicitly authorize both the deposit amount and the fee structure, preventing unauthorized fee extraction while maintaining the flexibility of the intent-based architecture.
