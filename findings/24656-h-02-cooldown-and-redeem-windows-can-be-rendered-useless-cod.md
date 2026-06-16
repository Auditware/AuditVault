---
tags:
  - lang/solidity
  - sector/governance
  - sector/lending
  - sector/options
  - sector/staking
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - vuln/governance/flash-loan-voting
  - trigger/flash-loan
  - precondition/flash-loan-available
  - novelty/known-pattern
  - misassumption/price-cannot-be-manipulated
  - fix/add-snapshot
  - trigger/governance-vote
protocol: "[[Notional]]"
auditors:
  - "[[shw]]"
report: "https://code4rena.com/reports/2022-01-notional"
genome:
  - "[[flash-loan-voting]]"
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[known-pattern]]"
  - "[[role-bypass]]"
  - "[[flashloan-callback-auth]]"
  - "[[governance-voting-power-snapshot]]"
---
# [H-02] Cooldown and redeem windows can be rendered useless

- id: 24656
- impact: HIGH
- protocol: [[Notional]]
- reporter: shw (Code4rena)
- source: https://code4rena.com/reports/2022-01-notional

## Summary


ShippooorDAO discovered a bug in the cooldown and redeem windows of an account that has not staked sNOTE. It was possible for the account to call sNOTE.startCooldown and then deposit and redeem as they wish, making the cooldown useless. This could be used for voting power attacks using flash loan if the voting process was not monitored. To mitigate the problem, the severity was upgraded to high and the cooldown/redeem protection was refactored. 

The bug was discovered by using VS Code. It was suggested to either remove the cooldown/redeem period or to let the contract start the cooldown on mint, and bind the cooldown/redeem window to the amount that was minted at that time by the account. It was also suggested to include an amount (up to the user's balance) when starting the cooldown, and then the redeem can't withdraw more than the specified amount during the cooldown initialization. 

In conclusion, ShippooorDAO discovered a bug in the cooldown and redeem windows of an account that has not staked sNOTE. This bug could be used for voting power attacks using flash loan if the voting process was not monitored. To mitigate the problem, the severity was upgraded to high and the cooldown/redeem protection was refactored. Suggestions were made to either remove the cooldown/redeem period or to let the contract start the cooldown on mint, and bind the cooldown/redeem window to the amount that was minted at that time by the account. It was also suggested to include an amount (up to the user's balance) when starting the cooldown, and then the redeem can't withdraw more than the specified amount during the cooldown initialization.

## Details

_Submitted by ShippooorDAO_

Cooldown and redeem windows can be rendered useless.

#### Proof of Concept

*   Given an account that has not staked sNOTE.
*   Account calls sNOTE.startCooldown
*   Account waits for the duration of the cooldown period. Redeem period starts.
*   Account can then deposit and redeem as they wish, making the cooldown useless.
*   Multiple accounts could be used to "hop" between redeem windows by transfering between them, making the redeem window effictively useless.

Could be used for voting power attacks using flash loan if voting process is not monitored
<https://www.coindesk.com/tech/2020/10/29/flash-loans-have-made-their-way-to-manipulating-protocol-elections/>

#### Tools Used

*   VS Code

#### Recommended Mitigation Steps

A few ways to mitigate this problem:
Option A: Remove the cooldown/redeem period as it's not really preventing much in current state.
Option B: Let the contract start the cooldown on mint, and bind the cooldown/redeem window to the amount that was minted at that time by the account. Don't make sNOTE.startCooldown() available externally. Redeem should verify amount of token available using this new logic.

**[jeffywu (Notional) confirmed and commented](https://github.com/code-423n4/2022-01-notional-findings/issues/68#issuecomment-1030855494):**
 > Propose to increase the severity of this [from Low] to High.
> 
> This image is a better way to understand the potential attack.
> ![image](https://user-images.githubusercontent.com/977434/152688228-f26123d4-1c48-4779-8005-b22638e6595c.png)
> 

**[pauliax (judge) increased severity to high and commented](https://github.com/code-423n4/2022-01-notional-findings/issues/68#issuecomment-1041532469):**
 > Great find. Agree with the sponsor, the severity can be upgraded because it destroys the cooldown/redeem protection.
> 
> 
> Could this be mitigated by including an amount (up to the whole user's balance) when starting a cooldown, and then redeem can't withdraw more than specified during the cooldown init?

**[jeffywu (Notional) commented](https://github.com/code-423n4/2022-01-notional-findings/issues/68#issuecomment-1042982946):**
 > We've prevented this by refactoring how the redemption window is defined.



***
