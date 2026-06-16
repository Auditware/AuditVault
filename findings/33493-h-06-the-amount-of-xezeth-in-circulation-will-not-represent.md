---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/bridge
  - sector/lending
  - sector/oracle
  - sector/restaking
  - sector/staking
protocol: "[[Renzo]]"
auditors:
  - "[[GalloDaSballo]]"
report: "https://code4rena.com/reports/2024-04-renzo"
genome:
  - "[[wrong-condition]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[bridge-message-validation]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[reward-accounting]]"
---
# [H-06] The amount of `xezETH` in circulation will not represent the amount of `ezETH` tokens 1:1

- id: 33493
- impact: HIGH
- protocol: [[Renzo]]
- reporter: GalloDaSballo (Code4rena)
- source: https://code4rena.com/reports/2024-04-renzo

## Summary


This bug report is about a protocol that allows users to deposit `ETH`/`WETH` on a supported L2 in order to mint `ezETH` tokens. However, there is a discrepancy between the amount of `xezETH` tokens minted on L2 and the amount of `ezETH` tokens minted on L1. This is because both steps of the minting process are based on the current valuation, which can change over time. This can result in a situation where there are more `xezETH` tokens in circulation than `ezETH`, making some `xezETH` worthless and impossible to redeem for `ezETH`. This issue can be mitigated by tracking the amount of `xezETH` tokens minted on L2 and minting the equivalent amount of `ezETH` tokens on L1. However, this can still be a problem in the long term and may result in losses for users. The severity of this issue is debated, with some considering it a Medium severity and others considering it a High severity. 

## Details


The protocol allows to deposit `ETH`/`WETH` (or the specific chain native currency) on a supported L2 in order to mint `ezETH` tokens, this is the process:

1. User mints `xezETH` on L2s via [`xRenzoDeposit::deposit()`](https://github.com/code-423n4/2024-04-renzo/blob/main/contracts/Bridge/L2/xRenzoDeposit.sol#L204) in exchange for either `ETH` or `WETH`. The `xezETH` are minted based on the **current** `ezETH` valuation.
2. After some time the bridge sweepers transfer the `ETH`/`WETH` collected to the L1, via [`xRenzoDeposit::sweep()`](https://github.com/code-423n4/2024-04-renzo/blob/main/contracts/Bridge/L2/xRenzoDeposit.sol#L414). The funds are transferred to the `xRenzoBridge` contract on L1 via Connext.
3. Connext calls [`xRenzoBridge::xReceive()`](https://github.com/code-423n4/2024-04-renzo/blob/main/contracts/Bridge/L1/xRenzoBridge.sol#L139) on L1 which will receive the `ETH`/`WETH` and deposit them in the protocol via [`RestakeManager::depositETH()`](https://github.com/code-423n4/2024-04-renzo/blob/main/contracts/RestakeManager.sol#L592). This will mint `ezETH` tokens based on the **current** `ezETH` valuation, the `ezETH` tokens will then be locked in the lockbox in exchange for `xezETH`, which are then immediately burned because an equivalent amount should have already been minted on the L2 during step `1`.

Theoretically, the amount of `xezETH` tokens minted during step `1` should be the same as the amount of `ezETH` tokens minted during step `3`, but because on both steps the tokens are minted at the current valuation, and the valuation changes over time, there will be a discrepancy between the amount of `xezETH` and `ezETH` tokens in circulation.

This is an issue because [`XERC20Lockbox::withdraw()`](https://github.com/code-423n4/2024-04-renzo/blob/main/contracts/Bridge/xERC20/contracts/XERC20Lockbox.sol#L126-L135) always exchanges `xezETH` for `ezETH` 1:1.

### Impact

The price of `ezETH` is expected to increase over time. This will create a situation where there will be more `xezETH` in circulation than `ezETH`, rendering some `xezETH` worthless and impossible to redeem for `ezETH`.

A situation in which the `ezETH` valuation decreases instead of increasing is also problematic, because the protocol will mint less `xezETH` than it should. 

The discrepancy will become bigger and bigger with time.

### Proof of Concept

As an example, let's assume `ezETH` valuation is currently `1 ETH`:

1. Alice deposits `1 ETH` on L2 and receives `1 xezETH`.
2. Some time passes and the valuation of `ezETH` increases to `2ETH` (unrealistic, but allows simple math).
3. The bridge sweeper calls `sweep()`, transferring the `1 ETH` to the `xRenzoBridge` contract on L1.
4. The `xRenzoBridge` deposits the received `1 ETH` in the `RestakeManager`, which mints `0.5 ezETH` because the `ezETH` valuation doubled.
5. The `0.5 ezETH` is locked in the lockbox, `0.5 xezETH` are minted in return and immediately burned.

The situation now is the following:

- Alice has `1 xezETH` on L2.
- The lockbox contains `0.5 ezETH` on L1.

Alice can at best redeem `0.5 xezETH` in exchange for `0.5 ezETH`, and the remaining `0.5 xezETH` is worthless. The amount of value she can redeem is the correct one, (`1 ETH`), but now there are `xezETH` in circulation that are not backed by `ezETH`.

### Recommended Mitigation Steps

The protocol should track the amount of `xezETH` tokens minted via [`xRenzoDeposit::deposit()`](https://github.com/code-423n4/2024-04-renzo/blob/main/contracts/Bridge/L2/xRenzoDeposit.sol#L204) on the L2 and mint the equivalent amount of `ezETH` tokens on L1 when [`xRenzoBridge::xReceive()`](https://github.com/code-423n4/2024-04-renzo/blob/main/contracts/Bridge/L1/xRenzoBridge.sol#L139) is executed by passing the necessary data on the [`xcall()`](https://github.com/code-423n4/2024-04-renzo/blob/main/contracts/Bridge/L2/xRenzoDeposit.sol#L434-L442) to Connext.

If this is implemented it's possible for the valuation of `ezETH` tokens to change instantly after [`xRenzoBridge::xReceive()`](https://github.com/code-423n4/2024-04-renzo/blob/main/contracts/Bridge/L1/xRenzoBridge.sol) is executed, this is because the amount of `ezETH` tokens is not minted based on the current valuation anymore. As explained in other reports, the protocol will be subject to instant `ezETH` valuation changes (increase/decrease) no matter what (rewards, slashing, penalties), and should gracefully handle these situations via appropriate deposit and withdrawals queues.

**[jatinj615 (Renzo) acknowledged and commented](https://github.com/code-423n4/2024-04-renzo-findings/issues/145#issuecomment-2110038561):**
 > Yes, theoretically it is correct. But the protocol tackles this by sending the updated mint rate of ezETH frequently to L2s and also sweeps funds every hour if above batch size keeping the collateralization in place for ezETH. Also the `bridgeRouterFee` (5 bps) deducted on L2 if the transactions goes through slow path (during which mint rate of ezETH can rise) the extra 5 bps routerFee deducted on L2 is accumulated in minting ezETH on L1 in `xRenzoBridge::xReceive` instead of getting deducted by connext routers. 

**[alcueca (judge) commented](https://github.com/code-423n4/2024-04-renzo-findings/issues/145#issuecomment-2127148545):**
 > The long term effect of this is akin to bad debt in lending protocols. Eventually, the protocol or the (last) users need to assume the losses.

**[0xTenma (warden) commented](https://github.com/code-423n4/2024-04-renzo-findings/issues/145#issuecomment-2132084175):**
> I think severity of this issue should be Medium instead of High because there is no direct loss of funds possible here. If the ratio of xezETH to ezETH is not equal 1:1 in any case then it is only possible and the protocol sends the updated mint rate of ezETH frequently to L2s to avoid this situation. 
> Furthermore, According to C4 docs:
> > 2 - Med: Assets not at direct risk, but the function of the protocol or its availability could be impacted, or leak value with a hypothetical attack path with stated assumptions, but external requirements.
> 
> Stated assumptions and external requirement such as oracle delay are required to face to this issue.

**[jatinj615 (Renzo) commented](https://github.com/code-423n4/2024-04-renzo-findings/issues/145#issuecomment-2132105899):**
 > @alcueca - to add more to it as I have explained in the comment above and discussion in [#70](https://github.com/code-423n4/2024-04-renzo-findings/issues/70). The ezETH in prod is over collateralised due to the fact that in some cases (when connext routers don't have enough liquidity to process fast path) the 5bps deducted on L2 is used to collateralise ezETH on L1 which is why lockbox currently has more ezETH against the xezETH minted on L1. Team has been monitoring and keeping a track on it. 
 >
 > Considering the above argument, please confirm on the severity. 

**[0xCiphky (warden) commented](https://github.com/code-423n4/2024-04-renzo-findings/issues/145#issuecomment-2132318968):**
 > Respectfully, I believe this should remain as High severity:
> 
> - The finding clearly demonstrates a realistic scenario where the system could become insolvent, resulting in a loss of funds for users. Despite the current over-collateralization and precautions, there remains a long-term risk.
> - The audited implementation contains blockages that will affect efforts to maintain collateralization for ezETH. For example, if the MaxTVL is reached, the protocol cannot deposit in L1, causing an accumulation of minted L2 tokens until it becomes possible to deposit again, which could take a significant amount of time.
> - This issue can be intentionally exploited by users whenever the price on the L1 side is higher than on the L2 side.



***
