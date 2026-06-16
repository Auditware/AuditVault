---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - severity/high
  - sector/nft
  - sector/streaming
  - sector/token
protocol: "[[FairSide]]"
auditors:
  - "[[WATCHPUG]]"
report: "https://code4rena.com/reports/2021-11-fairside"
genome:
  - "[[wrong-condition]]"
  - "[[locked-funds]]"
  - "[[timestamp-dependence]]"
---
# [H-03] Beneficiary cant get `fairSideConviction` NFT unless they only claim once, and only after it's fully vested

- id: 42326
- impact: HIGH
- protocol: [[FairSide]]
- reporter: WatchPug (Code4rena)
- source: https://code4rena.com/reports/2021-11-fairside

## Summary


The bug report is about an issue in the code where a beneficiary is not able to receive a specific type of NFT called `fairSideConviction` after claiming all their vested tokens. This is because the code checks for the initial vesting amount instead of the total claimed amount. The recommended solution is to change the condition to check for the total claimed amount instead. The severity of this bug is being disputed by the project team.

## Details

_Submitted by WatchPug, also found by cmichel_

Based on the context, once the beneficiary claimed all their vesting tokens, they should get the `fairSideConviction` NFT.

However, in the current implementation, if the beneficiary has claimed any amounts before it's fully vested, then they will never be able to get the `fairSideConviction` NFT, because at L138, it requires the `tokenbClaim` to be equal to the initial vesting amount.

[`FSDVesting.sol` L124-L142](https://github.com/code-423n4/2021-11-fairside/blob/20c68793f48ee2678508b9d3a1bae917c007b712/contracts/token/FSDVesting.sol#L124-L142)



```solidity
function claimVestedTokens() external override onlyBeneficiary {
    uint256 tokenClaim = calculateVestingClaim();
    require(
        tokenClaim > 0,
        "FSDVesting::claimVestedTokens: Zero claimable tokens"
    );

    totalClaimed = totalClaimed.add(tokenClaim);
    lastClaimAt = block.timestamp;

    fsd.safeTransfer(msg.sender, tokenClaim);

    emit TokensClaimed(msg.sender, tokenClaim, block.timestamp);

    if (amount == tokenClaim) {
        uint256 tokenId = fsd.tokenizeConviction(0);
        fairSideConviction.transferFrom(address(this), msg.sender, tokenId);
    }
}
```

##### Recommendation
Change to:

```solidity
function claimVestedTokens() external override onlyBeneficiary {
    uint256 tokenClaim = calculateVestingClaim();
    require(
        tokenClaim > 0,
        "FSDVesting::claimVestedTokens: Zero claimable tokens"
    );

    totalClaimed = totalClaimed.add(tokenClaim);
    lastClaimAt = block.timestamp;

    fsd.safeTransfer(msg.sender, tokenClaim);

    emit TokensClaimed(msg.sender, tokenClaim, block.timestamp);

    if (amount == totalClaimed) {
        uint256 tokenId = fsd.tokenizeConviction(0);
        fairSideConviction.transferFrom(address(this), msg.sender, tokenId);
    }
}
```

**[YunChe404 (FairSide) confirmed and disagreed with severity](https://github.com/code-423n4/2021-11-fairside-findings/issues/62#issuecomment-968298746)**
