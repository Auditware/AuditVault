---
tags:
  - lang/solidity
  - sector/governance
  - sector/lending
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[DittoETH]]"
auditors:
  - "[[klau5]]"
report: "https://code4rena.com/reports/2024-03-dittoeth"
genome:
  - "[[griefing]]"
  - "[[direct-drain]]"
  - "[[liquidation-underwater]]"
---
# [H-06] Closing a SR during a wrong redemption proposal leads to loss of funds

- id: 34176
- impact: HIGH
- protocol: [[DittoETH]]
- reporter: klau5 (Code4rena)
- source: https://code4rena.com/reports/2024-03-dittoeth

## Summary


This bug report discusses an issue with the `proposeRedemption` and `disputeRedemption` functions in the `RedemptionFacet.sol` contract of the DittoETH project. These functions allow users to create and dispute redemption proposals, but there is a flaw that can result in the loss of collateral if a short record (SR) is closed during the process. A proof of concept is provided in the `Redemption.t.sol` test file, and it is recommended to carefully consider any changes to address this issue. The type of bug is classified as a Context bug.

## Details


<https://github.com/code-423n4/2024-03-dittoeth/blob/91faf46078bb6fe8ce9f55bcb717e5d2d302d22e/contracts/facets/RedemptionFacet.sol#L267-L268> 

<https://github.com/code-423n4/2024-03-dittoeth/blob/91faf46078bb6fe8ce9f55bcb717e5d2d302d22e/contracts/libraries/AppStorage.sol#L92>

### Impact

When a user creates a redemption proposal with the `proposeRedemption` function the user has to provide a list of the short records (SRs) with the lowest collateral ratios (CR) in the system ascending.

To prevent users from creating proposals with a wrong SR list, anyone is allowed to dispute proposals with the `disputeRedemption` function. This function allows the disputer to prove that a SR with a lower CR was not included in the proposal and for doing so the disputer receives a penalty fee from the proposer.

If between these flows of creating a wrong proposal and disputing it a SR is closed (liquidation, exiting, transfer, ...) the collateral is added to the closed SR and can not be recovered.

### Proof of Concept

The following POC can be implemented in the `Redemption.t.sol` test file:

```solidity
function test_dispute_on_non_existing_sr() public {
    // setup shorts
    makeShorts({singleShorter: true});

    _setETH(1000 ether);
    skip(1 hours);

    STypes.ShortRecord memory sr1 = diamond.getShortRecord(asset, sender, C.SHORT_STARTING_ID);
    STypes.ShortRecord memory sr2 = diamond.getShortRecord(asset, sender, C.SHORT_STARTING_ID+1);
    STypes.ShortRecord memory sr3 = diamond.getShortRecord(asset, sender, C.SHORT_STARTING_ID+2);

    uint256 cr1 = diamond.getCollateralRatio(asset, sr1);
    uint256 cr2 = diamond.getCollateralRatio(asset, sr2);
    uint256 cr3 = diamond.getCollateralRatio(asset, sr3);

    // CRs are increasing
    assertGt(cr2, cr1);
    assertGt(cr3, cr2);

    // user creates a wrong proposal
    MTypes.ProposalInput[] memory proposalInputs =
        makeProposalInputsForDispute({shortId1: C.SHORT_STARTING_ID + 1, shortId2: C.SHORT_STARTING_ID + 2});

    address redeemer = receiver;
    vm.prank(redeemer);
    diamond.proposeRedemption(asset, proposalInputs, DEFAULT_AMOUNT * 3 / 2, MAX_REDEMPTION_FEE);

    // on of the SRs in the proposal is closed
    fundLimitAskOpt(DEFAULT_PRICE, DEFAULT_AMOUNT / 2, extra);
    exitShort(C.SHORT_STARTING_ID + 2, DEFAULT_AMOUNT / 2, DEFAULT_PRICE, sender);

    // SR is now closed
    sr3 = diamond.getShortRecord(asset, sender, C.SHORT_STARTING_ID+2);

    assertEq(uint(sr3.status), uint(SR.Closed));

    uint88 collateralBefore = sr3.collateral;

    // another user disputes the wrong proposal
    address disputer = extra;
    vm.prank(disputer);
    diamond.disputeRedemption({
        asset: asset,
        redeemer: redeemer,
        incorrectIndex: 0,
        disputeShorter: sender,
        disputeShortId: C.SHORT_STARTING_ID
    });

    // SR is still closed and collateral increased
    sr3 = diamond.getShortRecord(asset, sender, C.SHORT_STARTING_ID+2);
    assertEq(uint(sr3.status), uint(SR.Closed));
    assertGt(sr3.collateral, collateralBefore);
}
```

### Recommended Mitigation Steps

Opening up the SR again if it's closed would be a solution, but it could probably be misused to avoid liquidations. Therefore, carefully think about the implications of changes in this context.

### Assessed type

Context

**[ditto-eth (DittoETH) confirmed](https://github.com/code-423n4/2024-03-dittoeth-findings/issues/35#issuecomment-2045982402)**

***
