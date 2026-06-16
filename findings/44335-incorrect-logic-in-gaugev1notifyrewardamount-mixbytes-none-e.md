---
tags:
  - lang/solidity
  - platform/mixbytes
  - has/github
  - severity/high
  - sector/governance
protocol: "[[EYWA]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/EYWA/DAO/README.md#1-incorrect-logic-in-gaugev1notifyrewardamount"
genome:
  - "[[reward-calculation]]"
  - "[[reward-theft]]"
  - "[[reward-accounting]]"
---
# Incorrect logic in `GaugeV1.notifyRewardAmount()`

- id: 44335
- impact: HIGH
- protocol: [[EYWA]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/EYWA/DAO/README.md#1-incorrect-logic-in-gaugev1notifyrewardamount

## Summary


The report highlights a bug in the `notifyRewardAmount()` function of the `GaugeV1` contract. The function uses an incorrect value for creating a Merkl campaign, which results in the loss of accumulated rewards for the gauge. The bug is caused by the function using the `balanceOf(address(this))` parameter instead of the `amount_` parameter, and also missing a `transferFrom()` call. The recommended solution is to implement functionality to transfer rewards from the `EscrowVoteManagerV1` contract to the `GaugeV1` contract.

## Details

##### Description

The `notifyRewardAmount()` function in the `GaugeV1` contract uses an incorrect value for creating a Merkl campaign. Instead of the `amount_` parameter, it uses `balanceOf(address(this))`, while missing `transferFrom()` despite having a `forceApprove()` call.

```solidity
function notifyRewardAmount(uint256 amount_) external {
    if (msg.sender != s_escrowVoteManager) {
        revert UnauthorizedCaller();
    }
    IERC20 m_eywa = IERC20(s_eywa);
    uint256 m_balance = m_eywa.balanceOf(address(this));
    if (m_balance * 1 hours / EPOCH_DURATION >= 
        DISTRIBUTION_CREATOR.rewardTokenMinAmounts(address(m_eywa))) {
        m_eywa.approve(address(DISTRIBUTION_CREATOR), m_balance);
        IDistributionCreator.CampaignParameters memory m_campaignParameters = 
            s_campaignParameters;
        m_campaignParameters.amount = m_balance;
        ...
    }
    ...
}
```
https://gitlab.ubertech.dev/blockchainlaboratory/eywa-dao/blob/29465033f28c8d3f09cbc6722e08e44f443bd3b2/contracts/GaugeV1.sol#L54-69

When distributing rewards, `EscrowVoteManagerV1` approves `GaugeV1`, but the transfer of tokens does not occur.

Additionally, the **s_claimableRewardsByGauge** mapping is deleted, and the gauge loses its accumulated rewards.

https://gitlab.ubertech.dev/blockchainlaboratory/eywa-dao/blob/29465033f28c8d3f09cbc6722e08e44f443bd3b2/contracts/EscrowVoteManagerV1.sol#L369-382


##### Recommendation

We recommend implementing functionality to transfer rewards from EscrowVoteManagerV1 to GaugeV1.

***
