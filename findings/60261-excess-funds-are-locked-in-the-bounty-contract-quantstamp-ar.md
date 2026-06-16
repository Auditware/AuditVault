---
tags:
  - lang/solidity
  - platform/quantstamp
  - severity/high
  - vuln/dos/frozen-funds
  - impact/loss-of-funds/locked-funds
  - novelty/variant
  - sector/infra
protocol: "[[Arkham Intel Exchange]]"
auditors:
  - "[[Shih-Hung Wang]]"
report: "https://certificate.quantstamp.com/full/arkham-intel-exchange-bounty-contract/f86ecee0-d44f-48c3-80e9-e8570e2abadb/index.html"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[variant]]"
  - "[[account-ownership]]"
  - "[[dos-resistance]]"
---
# Excess Funds Are Locked in the Bounty Contract

- id: 60261
- impact: HIGH
- protocol: [[Arkham Intel Exchange]] Bounty Contract
- reporter: Shih-Hung Wang (Quantstamp)
- source: https://certificate.quantstamp.com/full/arkham-intel-exchange-bounty-contract/f86ecee0-d44f-48c3-80e9-e8570e2abadb/index.html

## Summary


The client has marked a bug as "Fixed" and the excess funds in the `BountyV1.sol` file can now be withdrawn by the owner. However, the code comments state that excess funds from rejected submissions should be accrued as fees, but only a portion of the excess funds are accounted for in the implementation. This means that the remaining excess funds are permanently locked in the contract and cannot be withdrawn by the owner. The recommendation is to confirm if this is intended and if not, to add the entire amount of excess funds to the accrued fees.

## Details

**Update**
Marked as "Fixed" by the client. The full excess funds are now withdrawable by the owner. Addressed in: `07eed4efb3dceaef6f70301e188826dafcd2c652`.

**File(s) affected:**`BountyV1.sol`

**Description:** According to the code comments in `BountyV1`:

> If a funder closes their bounty, they receive the amount of the bounty back. (Bounty funders can receive a maximum of 100% of their initial funding back. if there is excess funding from rejected submissions, it is accrued as fees.)

It states that the excess funds from rejected submissions are accrued as fees. However, in the implementation of `closeBounty()`, only a portion of the excess funds are accounted for the fees (L418):

```
if (_bounties[bounty].amount > _bounties[bounty].initialAmount) {
    excessAccrued = _bounties[bounty].amount - _bounties[bounty].initialAmount;
    _accruedFees += fee(excessAccrued, true);
    _bounties[bounty].amount = _bounties[bounty].initialAmount;
}
```

As a result, the rest of the excess funds are locked in the contract permanently and not withdrawable by the owner with the `burnAndWithdraw()` function.

**Recommendation:** Confirm whether this is an intended behavior. If not, consider adding the entire amount of `excessAccrued` to `_accruedFees`.
