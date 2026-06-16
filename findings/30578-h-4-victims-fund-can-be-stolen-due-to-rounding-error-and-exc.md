---
tags:
  - lang/solidity
  - sector/dex
  - sector/liquid-staking
  - sector/staking
  - sector/vault
  - platform/sherlock
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
  - fix/use-reentrancy-guard
protocol: "[[Napier]]"
auditors:
  - "[[jennifer37]]"
report: "https://github.com/sherlock-audit/2024-01-napier-judging"
genome:
  - "[[rounding-direction]]"
  - "[[direct-drain]]"
  - "[[use-reentrancy-guard]]"
  - "[[integer-bounds]]"
  - "[[reentrancy-guard]]"
---
# H-4: Victim's fund can be stolen due to rounding error and exchange rate manipulation

- id: 30578
- impact: HIGH
- protocol: [[Napier]]
- reporter: jennifer37 (Sherlock)
- source: N/A

## Summary


This bug report discusses a vulnerability in the protocol that allows malicious users to steal funds from victims. The issue is caused by a rounding error and exchange rate manipulation. The protocol has acknowledged the issue, but their current control is not enough to prevent such attacks. The impact of this bug is the loss of assets for the victim. The report suggests some measures to prevent this attack, such as minting shares to a dead address during contract deployment and avoiding the use of the `balanceOf` function. The tool used for this report is a manual review. There is a discussion among the team members regarding the severity of this issue, but it has been ultimately classified as High. 

## Details

Source: https://github.com/sherlock-audit/2024-01-napier-judging/issues/94 

The protocol has acknowledged this issue.

## Found by 
Bandit, LTDingZhen, cawfree, jennifer37, xAlismx, xiaoming90
## Summary

Victim's funds can be stolen by malicious users by exploiting the rounding error and through exchange rate manipulation.

## Vulnerability Detail

The LST Adaptor attempts to guard against the well-known vault inflation attack by reverting the TX when the amount of shares minted is rounded down to zero in Line 78 below.

https://github.com/sherlock-audit/2024-01-napier/blob/main/napier-v1/src/adapters/BaseLSTAdapter.sol#L71

```solidity
File: BaseLSTAdapter.sol
71:     function prefundedDeposit() external nonReentrant returns (uint256, uint256) {
72:         uint256 bufferEthCache = bufferEth; // cache storage reads
73:         uint256 queueEthCache = withdrawalQueueEth; // cache storage reads
74:         uint256 assets = IWETH9(WETH).balanceOf(address(this)) - bufferEthCache; // amount of WETH deposited at this time
75:         uint256 shares = previewDeposit(assets);
76: 
77:         if (assets == 0) return (0, 0);
78:         if (shares == 0) revert ZeroShares();
```

However, this control alone is not sufficient to guard against vault inflation attacks. 

Let's assume the following scenario (ignoring fee for simplicity's sake):

1. The victim initiates a transaction that deposits 10 ETH as the underlying asset when there are no issued estETH shares.
2. The attacker observes the victim’s transaction and deposits 1 wei of ETH (issuing 1 wei of estETH share) before the victim’s transaction. 1 wei of estETH share worth of PT and TY will be minted to the attacker.
3. Then, the attacker executes a transaction to directly transfer 5 stETH to the adaptor. The exchange rate at this point is `1 wei / (5 ETH + 1 wei)`. Note that the [`totalAssets`](https://github.com/sherlock-audit/2024-01-napier/blob/main/napier-v1/src/adapters/lido/StEtherAdapter.sol#L115) function uses the `balanceOf` function to compute the total underlying assets owned by the adaptor. Thus, this direct transfer will increase the total assets amount.
4. When the victim’s transaction is executed, the number of estETH shares issued is calculated as `10 ETH * 1 wei / (5 ETH + 1 wei)`, resulting in 1 wei being issued due to round-down.
5. The attacker will combine the PT + YT obtained earlier to redeem 1 wei of estETH share from the adaptor.
6. The attacker, holding 50% of the issued estETH shares (indirectly via the PT+YT he owned), receives `(15 ETH + 1 wei) / 2` as the underlying asset. 
7. The attacker seizes 25% of the underlying asset (2.5 ETH) deposited by the victim.

This scenario demonstrates that even when a revert is triggered due to the number of issued estETH share being 0, it does not prevent the attacker from capturing the user’s funds through exchange rate manipulation.

## Impact

Loss of assets for the victim.

## Code Snippet

https://github.com/sherlock-audit/2024-01-napier/blob/main/napier-v1/src/adapters/BaseLSTAdapter.sol#L71

## Tool used

Manual Review

## Recommendation

Following are some of the measures that could help to prevent such an attack:

- Mint a certain amount of shares to zero address (dead address) during contract deployment (similar to what has been implemented in Uniswap V2)
- Avoid using the `balanceOf` so that malicious users cannot transfer directly to the contract to increase the assets per share. Track the total assets internally via a variable.



## Discussion

**massun-onibakuchi**

Openzeppelin's ERC4626 with a decimalsOffset=0 in the virtual share mitigates the issue, but it is recognized that it does not completely resolve it. We plan to deposit a small amount of tokens after deployment.

**ydspa**

Escalate
This finding is not high.
This attack would be success only if the protocol team doesn't provide and keep any initial liquidity for the vault. However, in practical, we merely find protocol teams don't provide any fund to bootstrap projects. The likelihood of this attack is very low.

**sherlock-admin2**

> Escalate
> This finding is not high.
> This attack would be success only if the protocol team doesn't provide and keep any initial liquidity for the vault. However, in practical, we merely find protocol teams don't provide any fund to bootstrap projects. The likelihood of this attack is very low.

You've created a valid escalation!

To remove the escalation from consideration: Delete your comment.

You may delete or edit your escalation comment anytime before the 48-hour escalation window closes. After that, the escalation becomes final.

**massun-onibakuchi**

> Escalate This finding is not high. This attack would be success only if the protocol team doesn't provide and keep any initial liquidity for the vault. However, in practical, we merely find protocol teams don't provide any fund to bootstrap projects. The likelihood of this attack is very low.

Agree. This kind of inflation attack is not listed as a finding in the Mixbytes audit, which is still unpublished.

**MehdiKarimi81**

If the protocol team doesn't provide initial liquidity it would be high, since it's not listed as a known issue and the protocol team didn't clear that they plan to provide initial liquidity, it can be considered as a high severity. 

**xiaoming9090**

The mitigation of minting some shares in advance to prevent this issue was not documented in the contest’s README. Thus, the issue remains valid and as it is, as mitigation cannot be applied retrospectively after the contest. Otherwise, it would be unfair to the Watsons to raise an issue that only gets invalid by a mitigation shared after the contest/audit.

**cvetanovv**

I disagree with the escalation and this report should remain a valid High. Nowhere in the Readme or Documentation is it described that the protocol knows and can prevent this attack.

**Czar102**

Uncommunicated plans for issue mitigation don't constitute a reason for invalidation. I believe this was correctly judged – planning to reject the escalation and leave the issue as is.

**Czar102**

Result:
High
Has duplicates

**sherlock-admin3**

Escalations have been resolved successfully!

Escalation status:
- [ydspa](https://github.com/sherlock-audit/2024-01-napier-judging/issues/94/#issuecomment-1985343164): rejected
