---
tags:
  - lang/solidity
  - sector/lending
  - has/github
  - severity/high
protocol: "[[Valantis]]"
auditors:
  - Hexens
report: "https://github.com/solodit/solodit_content/blob/main/reports/Hexens/2025-03-17-Valantis.md"
genome:
  - "[[upgrade-safety]]"
  - "[[direct-drain]]"
  - "[[locked-funds]]"
---
# [VLTS3-3] Loss of funds when setting a new lendingModule with stHYPEWithdrawalModule::setProposedLendingModule

- id: 56684
- impact: HIGH
- protocol: Valantis
- reporter: Hexens
- source: https://github.com/solodit/solodit_content/blob/main/reports/Hexens/2025-03-17-Valantis.md

## Summary


The bug report states that when a new `lendingModule` is set using `stHYPEWithdrawalModule::setProposedLendingModule`, the funds from the current `lendingModule` are transferred to the `stHYPEWithdrawalModule` contract. However, these funds may get stuck in the contract and cannot be transferred to the new `lendingModule` or any other destination. This can happen because the code does not include a way to transfer the withdrawn tokens. To fix this issue, it is recommended to set the withdraw receiver as the SovereignPool and then re-deposit the funds into the new lending module using `supplyToken1ToLendingPool`. This bug has been fixed.

## Details

**Severity:** High

**Description:** When a new `lendingModule` is set via `stHYPEWithdrawalModule::setProposedLendingModule` the wrapped native token is transferred from the current `lendingModule` to the `stHYPEWithdrawalModule` contract:
```
if (address(lendingModule) != address(0)) {
    lendingModule.withdraw(lendingModule.assetBalance(), address(this));
}
```
As a consequence, these funds may be stuck in the `stHYPEWithdrawalModule` contract since they are not transferred to the new lending module (`lendingModuleProposal.lendingModule`) and there is also no other way to transfer the withdrawn tokens.
```
function setProposedLendingModule() external onlyOwner {
    if (lendingModuleProposal.startTimestamp > block.timestamp) {
        revert stHYPEWithdrawalModule__setProposedLendingModule_ProposalNotActive();
    }

    if (lendingModuleProposal.startTimestamp == 0) {
        revert stHYPEWithdrawalModule__setProposedLendingModule_InactiveProposal();
    }

    if (address(lendingModule) != address(0)) {
        lendingModule.withdraw(lendingModule.assetBalance(), address(this));
    }

    lendingModule = ILendingModule(lendingModuleProposal.lendingModule);
    delete lendingModuleProposal;
    emit LendingModuleSet(address(lendingModule));
}
```


**Remediation:**  We recommend to set the withdraw receiver as the SovereignPool, such that the withdrawn tokens would simply be counted as reserve. Afterwards, the owner can re-deposit any amount of assets back into the new lending module using `supplyToken1ToLendingPool`.

**Status:**  Fixed


- - -
