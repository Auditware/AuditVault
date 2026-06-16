---
tags:
  - lang/solidity
  - sector/lending
  - platform/sherlock
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Symmetrical Update]]"
auditors:
  - "[[bitsurfer]]"
report: "https://github.com/sherlock-audit/2023-08-symmetrical-judging"
genome:
  - "[[liquidation-logic]]"
  - "[[direct-drain]]"
  - "[[liquidation-underwater]]"
---
# H-2: `liquidatePositionsPartyA` limits partyB loss to partyB allocated balance, which can lead to inflated partyB balance and loss of funds for protocol users

- id: 26347
- impact: HIGH
- protocol: [[Symmetrical Update]]
- reporter: bitsurfer (Sherlock)
- source: N/A

## Summary


This bug report is about the `liquidatePositionsPartyA` function in the LiquidationFacetImpl.sol code which is part of the SYMM-IO/symmio-core repository. This function limits the loss of PartyB to the current allocated balance of PartyB, which can lead to an inflated PartyB balance and a loss of funds for protocol users. 

The bug is demonstrated by an example scenario where PartyB has two positions, one in a high profit and one in a high loss. The total upnl is much smaller than the individual positions upnl, and PartyB has allocated balance of 0. When PartyA is liquidated, the first position is liquidated and the amount to deduct is 0 because of PartyB's allocated balance. Then the second position is liquidated and PartyB's allocated balance increases by 1000, leading to an inflated final balance of PartyB. This means that the protocol owes users more funds than it has, which can lead to a bank run and the last users being unable to withdraw.

The code snippet for the bug can be found in the LiquidationFacetImpl.sol file on line 163-166. The bug was found through manual review and was fixed with a PR by MoonKnightDev. The recommendation is to calculate the total (signed) pnl for the positions for each PartyB before applying it, with the amount to deduct being for all positions combined for a particular PartyB instead of separate positions.

## Details

Source: https://github.com/sherlock-audit/2023-08-symmetrical-judging/issues/6 

## Found by 
bitsurfer, panprog

If partyB has positions both in a high profit and in a high loss, so that total upnl is much smaller than individual positions upnl, then partyB can deallocate most (or even all) of its funds. During partyA liquidation, `liquidatePositionsPartyA` limits partyB loss to the **current** allocated balance of partyB. In this case there is a big difference of the final results depending on order of position liquidations:
1. If the 1st position is in a profit, then the profit is first applied to balanceB, and then position in loss correctly subtracts from it (there is enough partyB balance to fully cover position in loss).
2. If the 1st position is in a loss, then balance (which is smaller than position loss) is simply reduced to 0, but then the 2nd position (which is in a profit) is added in full, leading to inflated final balance of partyB.

If such liquidation happens (intentional or not), partyB will have much more funds than it should at the expense of the other users: protocol will owe users more funds than it has, which can lead to bank run and the last users being unable to withdraw.

## Vulnerability Detail

Example Scenario:

Position 1: upnl = -960, cva+lf = 10, mm=10
Position 2: upnl = +1000, cva+lf = 10, mm=10
Total cva+lf = 20, total mm=20
PartyB has allocated balance = 0 (available = 0 + 1000 - 960 = 40 >= 20 - not liquidatable)
Party A is liquidated:
1. Position 1 is liquidated.
`amount` = 960
`amountToDeduct` = 0 (because partyB allocated balance = 0)
partyB allocatedBalance remains 0
2. Position 2 is liquidated.
`amount` = 1000
partyB allocatedBalance increases by 1000 (is set to 1000)

The result: PartyB should have a balance of less than 60 (upnl+cva), but it has 1000 instead!

## Impact

In some situations during partyA liquidations, PartyB balance is increased significantly while no funds enter the protocol, meaning protocol debt to users increases and is greater than protocol funds. This can cause a bank run, since the last users to withdraw will be unable to do so.

## Code Snippet

`amountToDeduct` is calculated as minimum between partyB loss and partyB balance. This amount is deducted from **current** partyB allocated balance.
https://github.com/sherlock-audit/2023-08-symmetrical/blob/main/symmio-core/contracts/facets/liquidation/LiquidationFacetImpl.sol#L163-L166

## Tool used

Manual Review

## Recommendation

Calculate total (signed) pnl for positions for each partyB before applying it: `amountToDeduct` should be for all positions combined for a particular partyB instead of separate positions.



## Discussion

**MoonKnightDev**

Fixed Code PR: https://github.com/SYMM-IO/symmio-core/pull/36
