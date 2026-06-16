---
tags:
  - lang/solidity
  - platform/sigmaprime
  - has/github
  - severity/high
  - sector/nft
  - sector/nft-marketplace
protocol: "[[Satori]]"
auditors:
  - "[[Sigma Prime]]"
report: "https://github.com/sigp/public-audits/blob/master/satori-sports/satori-sports-token-royalties/review.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[integer-bounds]]"
  - "[[royalty-edge-cases]]"
---
# Strict Equality Causes Token Purchase Failure

- id: 19564
- impact: HIGH
- protocol: [[Satori]] Sports
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/satori-sports/satori-sports-token-royalties/review.pdf

## Summary


This bug report is about an issue in the TokenRoyaltiesHandler.sol file, which is part of the Satori Sports Token Royalties. The purchased() function in the file is responsible for splitting payments made from an NFT sale and distributing them among the entities according to the percentages allocated in royaltiesBPS. Under certain circumstances, it is possible for users to submit an order with Satori and have the payment correctly processed, but the delivery of the NFT fails due to strict equality checks.

The problem is caused by a require statement on line 26 that checks if the totalPaid amount is equal to the purchaseCost. This statement acts as an invariant check, but the strict equality (using operator ==) fails under certain circumstances due to the calculation performed on line 20. This is because if the cfg.getRoyaltiesConfiguration().royaltiesBPS[i] * purchaseCost is not a direct multiple of 10000, the resultant owed will be rounded down. Any rounding errors will cause the require(totalPaid == purchaseCost) to fail, which prevents any calls to Token._transferPendingToOwner() from finalising and stops the user from becoming the owner of the purchased tokens.

The testing team has recommended avoiding strict equalities in this instance and suggests using the assertion require( purchaseCost >=totalPaid ,"Royalties payment not calculated correctly" ); instead. They also recommend writing more complex scenarios to ensure that edge cases such as this one are well accounted for.

The issue has been fixed on commit 923c35b. The responsibility of dividing values by 1bps has been handed over to the UI, and the testing team has recommended documenting this behaviour.

## Details

## Description

The `purchased()` function in `TokenRoyaltiesHandler.sol` splits the payment made from an NFT sale and divides it amongst the entities according to the percentages allocated in `royaltiesBPS`. Under certain circumstances, it is possible for users to submit an order with Satori and have the payment correctly processed, but the delivery of the NFT may fail due to strict equality checks.

As can be seen on line [22] in the code block below, the external royalties contract is updated to reflect the share of `NFT purchaseCost`. The following require statement on line [26] then checks that this calculation has been performed correctly and that the calculated `totalPaid` sums to the `purchaseCost`.

```solidity
for (uint256 i = 0; i < cfg.getRoyaltiesConfiguration().entities.length; ++i) {
    uint256 owed = cfg.getRoyaltiesConfiguration().royaltiesBPS[i] * purchaseCost / 10000; // bps 2dp
    totalPaid += owed;
    royalties.recordRoyalties(cfg.getRoyaltiesConfiguration().entities[i], owed);
    emit RoyaltiesPaid(address(this), cfg.getRoyaltiesConfiguration().entities[i], tokenId,
        cfg.getRoyaltiesConfiguration().royaltiesBPS[i], owed);
}
require(totalPaid == purchaseCost, "Royalties payment not calculated correctly");
```

This require statement acts as an invariant check. However, the strict equality (using operator `==`) will fail under certain circumstances due to the calculation performed on line [20]. If the `cfg.getRoyaltiesConfiguration().royaltiesBPS[i] * purchaseCost` is not a direct multiple of 10000, the resultant `owed` will be rounded down. Any rounding errors will cause the `require(totalPaid == purchaseCost)` to fail, effectively preventing any calls to `Token._transferPendingToOwner()` from finalizing. This stops the user from actually becoming the owner of the purchased tokens.

## Recommendations

The testing team recommends avoiding strict equalities in this instance. If the require statement is aimed at ensuring the amount of funds paid for the `purchaseToken()` does not exceed the amount paid to individual entities, then it may be worth considering the following assertion instead:

```solidity
require(purchaseCost >= totalPaid, "Royalties payment not calculated correctly");
```

Additionally, most tests are written as follows: `expect(event.args[1]).equal(ethers.utils.parseEther("1"));` which only validates royalties payment for very simple purchases. The testing team recommends writing more complex scenarios to ensure that edge cases such as the one discussed here are well accounted for.

## Resolution

The issue has been fixed on commit `923c35b`. The responsibility of dividing values by 1bps is handed over to the UI. The testing team recommends documenting this behavior.
