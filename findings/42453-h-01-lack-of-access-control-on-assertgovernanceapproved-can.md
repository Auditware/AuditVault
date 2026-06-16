---
tags:
  - lang/solidity
  - sector/governance
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - vuln/dos/frozen-funds
  - impact/loss-of-funds/direct-drain
  - impact/loss-of-funds/locked-funds
  - impact/mev/frontrun
  - novelty/variant
protocol: "[[Behodler]]"
auditors:
  - "[[Code4rena]]"
report: "https://code4rena.com/reports/2022-01-behodler"
genome:
  - "[[frozen-funds]]"
  - "[[direct-drain]]"
  - "[[locked-funds]]"
  - "[[frontrun]]"
  - "[[variant]]"
  - "[[access-roles]]"
  - "[[dos-resistance]]"
  - "[[frontrun-exposure]]"
---
# [H-01] Lack of access control on `assertGovernanceApproved` can cause funds to be locked

- id: 42453
- impact: HIGH
- protocol: [[Behodler]]
- reporter: Code4rena (Code4rena)
- source: https://code4rena.com/reports/2022-01-behodler

## Summary


This bug report discusses a lack of access control in the `assertGovernanceApproved` function of the `FlashGovernanceArbiter` contract. This allows anyone to lock other users' funds in the contract as long as the users have approved the contract to transfer a certain amount of assets from them. The report includes a proof of concept and recommended mitigation steps to only allow certain addresses to call the function. Some members of the community have debated the severity of this bug, with some arguing it is a medium risk and others arguing it is a high risk due to the potential loss of funds for users. The report concludes with a warning to be cautious with allowances in similar functions in the future.

## Details

_Submitted by shw, also found by kirk-baird and pauliax_

Lack of access control on the `assertGovernanceApproved` function of `FlashGovernanceArbiter` allows anyone to lock other users' funds in the contract as long as the users have approved the contract to transfer `flashGovernanceConfig.amount` of `flashGovernanceConfig.asset` from them.

#### Proof of Concept

1.  Alice wants to execute a flash governance decision (e.g., disable to the protocol), so she first calls `approve` on the `flashGovernanceConfig.asset` to allow `FlashGovernanceArbiter` to transfer `flashGovernanceConfig.amount` of assets from her.
2.  An attacker Bob, who listens to the mempool, notices Alice's `approve` transaction and decides to front-run it. He calls `assertGovernanceApproved` with `sender` being Alice, `target` being any address, and `emergency` being `true`.
3.  As a result, Alice cannot execute her flash governance decision, and her funds are locked in the contract for the `flashGovernanceConfig.unlockTime` period.

Referenced code:
[DAO/FlashGovernanceArbiter.sol#L60-L81](https://github.com/code-423n4/2022-01-behodler/blob/main/contracts/DAO/FlashGovernanceArbiter.sol#L60-L81)

#### Recommended Mitigation Steps

Only allow certain addresses to call the `assertGovernanceApproved` function on `FlashGovernanceArbiter`.

**[gititGoro (Behodler) confirmed, but disagreed with High severity and commented](https://github.com/code-423n4/2022-01-behodler-findings/issues/300#issuecomment-1056104445):**
 > The reason I stuck with medium risk is because the user's funds can't be lost in this scenario. Only temporarily locked. If the user unapproves FlashGovernanceArbiter on EYE then they simply have to wait until the unlock period has passed and can withdraw again.

**[Jack the Pug (judge) commented](https://github.com/code-423n4/2022-01-behodler-findings/issues/300#issuecomment-1056190654):**
> Agreed. This should be somewhere in between Med and High. If it's just the users' deposits being temporarily locked, then it's definitely a Med. But this one is taking probably all the funds from users' wallets and locking them against their will, easy to pull off by anyone, all at once for all potential victims.
> 
> I tend to make it a High so that the future wardens and probably by extent the devs can be more careful with allowances. We have seen so many incidents caused by improper handling of users' allowances.
> 
> A `transferFrom()` with from not being hard-coded as `msg.sender` is evil.
> 
> My fellow wardens, if you are reading this, do not go easy on a `transferFrom()` that takes an argument as `from`.



***
