---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/lending
protocol: "[[Open Dollar]]"
auditors:
  - "[[Falconhoof]]"
report: "https://code4rena.com/reports/2023-10-opendollar"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[account-ownership]]"
  - "[[cross-contract-state-consistency]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# [H-02] Missing debt check lets users start a debt auction of non-existent debt

- id: 29348
- impact: HIGH
- protocol: [[Open Dollar]]
- reporter: falconhoof (Code4rena)
- source: https://code4rena.com/reports/2023-10-opendollar

## Summary


A bug was identified in the `AccountingEngine.sol` contract of the OpenDollar protocol. The contract is responsible for initializing both debt and surplus auctions. The bug is related to the check that verifies that there is a sufficient amount of bad debt available to auction. The check is located on AccountingEngine:181, `if (_params.debtAuctionBidSize > _unqueuedUnauctionedDebt(_debtBalance))`, and it is used to ensure that the protocol can only auction debt that is not currently undergoing an auction and is not locked within the debt queue. The issue stems in line 183, where `_settleDebt` is called. This aims to ensure that only bad debt is considered for the auction. However, if the remaining bad debt, after settlement, falls below the specified threshold `(debtAuctionBidSize <= unqueuedUnauctionedDebt())`, the auction still starts with an incorrect amount of bad debt coverage, diluting the protocol Token when it is not yet needed.

The impact of this bug is that non-existent debt gets auctioned when it is not necessary, which dilutes the protocol token. To demonstrate the bug, two test cases were created using the protocol's test suite. The first test case implements a two-call flow, where the "settleDebt" function must be externally triggered before initiating an auction. This design ensures that a check for insufficient debt occurs prior to creating an auction. Consequently, as after calling settleDebt there is inadequate debt, the operation will revert. The second test case invokes the `auctionDebt` function directly. It is expected to behave in the same manner as in the first test case, but in this second test case, the execution follows a different path. Rather than replicating the behavior of the initial test case by reverting not starting the auction, the execution succeeds, resulting in the creation of a debt auction even when there is no existing debt.

To mitigate this risk, the check `(_params.debtAuctionBidSize > _unqueuedUnauctionedDebt(_debtBalance))` should be introduced after calling \_settleDebt to ensure there exists enough amount of bad debt in the contract after the settling. The bug was resolved in a pull request [here](https://github.com/open-dollar/od

## Details


The `AccountingEngine.sol` contract serves as the protocol's central component responsible for initializing both debt and surplus auctions. Debt auctions are consistently initiated with a predefined minimum bid referred to as debtAuctionBidSize. This is done to ensure that the protocol can only auction debt that is not currently undergoing an auction and is not locked within the debt queue, as articulated in the comment found on `IAccountingEngine:248`: "It can only auction debt that has been popped from the debt queue and is not already being auctioned". This necessity prompts the check on AccountingEngine:181:

`if (_params.debtAuctionBidSize > _unqueuedUnauctionedDebt(_debtBalance))`

This check verifies that there is a sufficient amount of bad debt available to auction.

The issue stems in line 183, where `_settleDebt` is called, this aims to ensure that only bad debt is considered for the auction. However, if the remaining bad debt, after settlement, falls below the specified threshold `(debtAuctionBidSize <= unqueuedUnauctionedDebt())`, the auction still starts with an incorrect amount of bad debt coverage, diluting the protocol Token when it is not yet needed.

### Impact

Non-existent debt gets auctioned when it is not necesary which dilutes the protocol token.

### PoC

The attached Proof of Concept (PoC) demonstrates two test cases:

*   In the initial test case, a two-call flow is implemented. The "settleDebt" function must be externally triggered before initiating an auction. This design ensures that a check for insufficient debt occurs prior to creating an auction. Consequently, as after calling settleDebt there is inadequate debt, the operation will revert.
*   In the second case, the `auctionDebt` function is invoked directly. It is expected to behave in the same manner as in the first test case (because the funciton calls `_settleDebt` internally). However, in this second test case, the execution follows a different path. Rather than replicating the behavior of the initial test case by reverting not starting the auction, the execution succeeds, resulting in the creation of a debt auction even when there is no existing debt.

The following tests have been created using the protocol's test suite:

First test case (original two call flow):

```solidity
  function test_missing_insuficient_debt_check_part2() public {
    accountingEngine.modifyParameters("surplusTransferPercentage", abi.encode(1));
    accountingEngine.modifyParameters("extraSurplusReceiver", abi.encode(1));

    safeEngine.createUnbackedDebt(address(0), address(accountingEngine), rad(100 ether));

    _popDebtFromQueue(100 ether);

    accountingEngine.settleDebt(100 ether);

    vm.expectRevert();
    uint id = accountingEngine.auctionDebt();

  }
```

Second test case (vulnerability):

```solidity
  function test_missing_insuficient_debt_check_part2() public {
    accountingEngine.modifyParameters("surplusTransferPercentage", abi.encode(1));
    accountingEngine.modifyParameters("extraSurplusReceiver", abi.encode(1));

    safeEngine.createUnbackedDebt(address(0), address(accountingEngine), rad(100 ether));

    _popDebtFromQueue(100 ether);

    
    uint id = accountingEngine.auctionDebt();

  }
```

Both test cases should revert and not let a user create a debt Auction under insufficient debt circumstances, but as stated on the report the second test case succeeds and creates the Auction.

### Recommended Mitigation Steps

To mitigate this risk, I suggest introducing the check `(_params.debtAuctionBidSize > _unqueuedUnauctionedDebt(_debtBalance))` after calling \_settleDebt to ensure there exists enough amount of bad in the contract after the settling.

**[RaymondFam (Lookout) commented](https://github.com/code-423n4/2023-10-opendollar-findings/issues/24#issuecomment-1780182988):**
 > Seems like `_params.debtAuctionBidSize > _unqueuedUnauctionedDebt(_debtBalance)` check is well in place prior to settling the debt in the second case, but will let the sponsor look into it.

**[MiloTruck (Judge) commented](https://github.com/code-423n4/2023-10-opendollar-findings/issues/24#issuecomment-1793315875):**
 > Due to the misplacement of the `_params.debtAuctionBidSize > _unqueuedUnauctionedDebt(_debtBalance)` check before `_settleDebt()` is called, the protocol will create debt auctions even when the amount of bad debt is below `params.debtAuctionBidSize`. This leads to dilution of the protocol token as bidders can buy non-existent debt, thereby destabilizing the value of protocol's token. As such, I agree with high severity.

**[pi0neerpat (OpenDollar) commented](https://github.com/code-423n4/2023-10-opendollar-findings/issues/24#issuecomment-1861163388)**
 >Resolved [here](https://github.com/open-dollar/od-contracts/pull/253).

***
