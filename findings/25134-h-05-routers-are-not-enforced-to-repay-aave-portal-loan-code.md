---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/bridge
  - sector/infra
  - sector/lending
  - sector/multisig
  - sector/stable
  - sector/uncollat-lending
protocol: "[[Connext]]"
auditors:
  - "[[Code4rena]]"
report: "https://code4rena.com/reports/2022-06-connext"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[bridge-message-validation]]"
  - "[[cross-contract-state-consistency]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# [H-05] Routers are not Enforced to Repay AAVE Portal Loan

- id: 25134
- impact: HIGH
- protocol: [[Connext]]
- reporter: Code4rena (Code4rena)
- source: https://code4rena.com/reports/2022-06-connext

## Summary


This bug report is about a potential issue with Connext's AAVE portal, which provides a trusted credit line to Connext. When a nomad message arrives, it will call the `BridgeFacet.handle` function, which will trigger the `_reconcile` function. This function will attempt to repay the loan to AAVE portal, but if it fails, Connext expects that the router will use the `repayAavePortal` function out-of-band to help Connext to repay the loan. 

The bug report highlights a potential issue where a router may not help Connext to repay the loan out-of-band, and instead may withdraw all the liquidity from the router. If this happens, Connext will incur a large amount of debt from AAVE portal.

A whitelist for routers that can use portals is suggested as a mitigation step, as this would ensure that only trusted routers could use this feature. However, it is noted that even trusted actors may turn rogue when dealing with significant gain. Therefore, it is recommended to explore other alternatives. 

One such alternative is to escrow the amount received from nomad in an `Escrow` contract. This contract would contain the logic to perform the necessary actions to repay AAVE portal loan. The router is responsible for triggering the `Escrow.settleAAVEPortalLoan` to kick start the out-of-band repayment process. This approach is similar to the withdrawal pattern and would incentivize the router to make the repayment as fast as possible.

## Details

_Submitted by xiaoming90_

[BridgeFacet.sol#L984](https://github.com/code-423n4/2022-06-connext/blob/b4532655071566b33c41eac46e75be29b4a381ed/contracts/contracts/core/connext/facets/BridgeFacet.sol#L984)<br>

### Background

#### AAVE Portal

AAVE portal provides a trusted credit line that allows bridges to take on an unbacked position, and Connext intents to use this credit line to provide fast-liquidity for its users in the event the routers do not have sufficient liquidity.

Connext will assign one (1) router to be responsible for taking on credit risk of borrowing an unbacked position from AAVE portal as per [Source Code](https://github.com/code-423n4/2022-06-connext/blob/b4532655071566b33c41eac46e75be29b4a381ed/contracts/contracts/core/connext/facets/BridgeFacet.sol#L777).

Under normal circumstance, the `BridgeFacet._reconcile` function will automatically repay back the loan to AAVE portal when the nomad message arrives. However, if the repayment fails for certain reason, Connext expects that the router will use the [`repayAavePortal`](https://github.com/code-423n4/2022-06-connext/blob/4dd6149748b635f95460d4c3924c7e3fb6716967/contracts/contracts/core/connext/facets/PortalFacet.sol#L80) function out-of-band to help Connext to repay the loan.

Ultimately, it is Connext that take on the credit risk because AAVE portal only provides a trusted credit line to Connext, but not to the individual routers.

#### Nomad Message

When nomad message arrives, it will call `BridgeFacet.handle` function, which will in turn trigger the internal `_reconcile` function. Note that the `handle` or `_reconcile` function cannot be reverted under any circumstances because nomad message cannot be reprocessed on the nomad side.

### Proof-of-Concept

1.  Alice transfers `1,000,000` DAI from Ethereum domain to Polygon domain

2.  None of the existing routers have sufficient liquidity, thus the sequencer decided that AAVE Portal should be used

3.  Bob's router has been selected to take on the credit risk for the unbacked position, and Connext proceeds to borrow `1,000,000` DAI from AAVE Portal and send the `1,000,000` DAI to Alice's wallet on Polygon domain

4.  When slow nomad message arrives, `BridgeFacet._reconcile` function is triggered to attempt to repay back the loan to AAVE portal. This function will in turn trigger the [`BridgeFacet._reconcileProcessPortal`](https://github.com/code-423n4/2022-06-connext/blob/b4532655071566b33c41eac46e75be29b4a381ed/contracts/contracts/core/connext/facets/BridgeFacet.sol#L984) function where the portal repayment logic resides.

5.  Within the `BridgeFacet._reconcileProcessPortal`, notice that if the `AssetLogic.swapFromLocalAssetIfNeededForExactOut` swap fails, it will return [`_amount`](https://github.com/code-423n4/2022-06-connext/blob/b4532655071566b33c41eac46e75be29b4a381ed/contracts/contracts/core/connext/facets/BridgeFacet.sol#L1022).

6.  Within the `BridgeFacet._reconcileProcessPortal`, notice that if the \`\`AavaPool.backUnbacked`external repayment call fails, it will set`amountIn = 0`  , and then return [ `return (\_amount - amountIn)` ](https://github.com/code-423n4/2022-06-connext/blob/b4532655071566b33c41eac46e75be29b4a381ed/contracts/contracts/core/connext/facets/BridgeFacet.sol#L1061) , which is basically the same as  `\_amount\`.

7.  When the `_reconcileProcessPortal` function call returned at [Line 603](https://github.com/code-423n4/2022-06-connext/blob/b4532655071566b33c41eac46e75be29b4a381ed/contracts/contracts/core/connext/facets/BridgeFacet.sol#L603), it will set the ` toDistribute  ` to the `amount`. `amount` in this example is `1,000,000` DAI.

8.  Next, at [Line 611](https://github.com/code-423n4/2022-06-connext/blob/b4532655071566b33c41eac46e75be29b4a381ed/contracts/contracts/core/connext/facets/BridgeFacet.sol#L611), the contract will increase Bob's router balance by `1,000,000` DAI

9.  Bob notices that his router balance has increased by `1,000,000` DAI, and he could not resist the tempation of `1,000,000` DAI. Therefore, instead of helping Connext to repay the loan via `repayAavePortal` function out-of-band, he decided to quickly withdraws all his liquidty from his router.

10. Bob gained `1,000,000` DAI, while Connext still owns AAVE portal `1,000,000` DAI

### Impact

If routers decided not to repay the loan, Connext will incur large amount of debt from AAVE portal.

### Recommended Mitigation Steps

Understood that there is a whitelist for routers that can use portals to ensure that only trusted routers could use this feature. In this case, the trust entirely depends on the integrity of the router owner and the assumption that the owner will not act against Connext and its community. However, as seen in many of the past security incidents, trusted actor or even own protocol team member might turn rogue when dealing with significant gain. In the above example, `1,000,000` DAI. It is common to see even larger amount of funds transferring across the bridge.

Therefore, to overcome the above-mentioned risk, some protocol would implement ` m-of-n  ` multisig or validation, which help to mitigate the risk of a single trusted actor from turning rogue and perform malicious action.

Therefore, it is recommended to reconsider such design and explore other alternatives. One such alternative would be as follows:

> Assuming that the AAVE portal interest rate is fixed, therefore, the amount of repayment is deterministic, and Connext can compute the amount of repayment that needs to be repaid at any point of time.
>
> When the `BridgeFacet._reconcileProcessPortal` swap or `AavaPool.backUnbacked` fails, do not immediately credit the Bob's router balance. Instead, escrow the amount  (`1,000,000` DAI) received from nomad in an `Escrow` contract. Implement a function called `settleAAVEPortalLoan` within the `Escrow` contract, which contains the logic to perform the necessary actions to repay AAVE portal loan. In this case, Bob is responsible for triggering the `Escrow.settleAAVEPortalLoan` to kick start the out-of-band repayment process. If the repayment is sucessful, Bob's router will be credited with the earning for taking on credit risk.
>
> One positive side effect of this approach is that Bob will be incentivize to make the repayment as fast as possible because the longer he delays, the higher the interest rate, and thus less earning for him.
>
> This approach is quite similar to the withdrawal pattern.

**[LayneHaber (Connext) acknowledged and commented](https://github.com/code-423n4/2022-06-connext-findings/issues/143#issuecomment-1167461057):**
 > This is correct, and using an escrow contract would be helpful, but in general the router has no incentive ever to repay aave loans (even with this fix). This eliminates the possibility of a router profiting from the mishandling of `reconcile`, but doesn't address the root of the trustedness, which is embedded at the aave layer (by being able to take out unbacked loans).



***
