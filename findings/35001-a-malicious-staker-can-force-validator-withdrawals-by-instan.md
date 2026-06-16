---
tags:
  - lang/solidity
  - sector/staking
  - platform/cyfrin
  - has/github
  - severity/high
  - vuln/dos/griefing
  - fix/use-reentrancy-guard
  - novelty/variant
protocol: "[[Casimir]]"
auditors:
  - "[[Hans]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2024-07-10-cyfrin-casimir-v2.0.md"
genome:
  - "[[griefing]]"
  - "[[use-reentrancy-guard]]"
  - "[[variant]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
  - "[[reentrancy-guard]]"
---
# A malicious staker can force validator withdrawals by instantly staking and unstaking

- id: 35001
- impact: HIGH
- protocol: [[Casimir]]
- reporter: Hans (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2024-07-10-cyfrin-casimir-v2.0.md

## Summary


The bug report describes an issue where a user can exploit the system by repeatedly depositing and withdrawing ETH, causing unnecessary withdrawals from the Beacon Chain. This results in a loss of potential rewards for genuine stakers and is also costly for the protocol. The report recommends implementing an unstake lock period and removing ETH from ready validators instead of exiting them first. The bug has been fixed in the Casimir contracts and verified by Cyfrin. 

## Details

**Description:** When a user unstakes via `CasimirManager::requestUnstake`, the number of required validator exits is calculated using the prevailing expected withdrawable balance as follows:

```solidity
function requestUnstake(uint256 amount) external nonReentrant {
    // code ....
    uint256 expectedWithdrawableBalance =
        getWithdrawableBalance() + requestedExits * VALIDATOR_CAPACITY + delayedEffectiveBalance;
    if (unstakeQueueAmount > expectedWithdrawableBalance) {
        uint256 requiredAmount = unstakeQueueAmount - expectedWithdrawableBalance;
>       uint256 requiredExits = requiredAmount / VALIDATOR_CAPACITY; //@audit required exits calculated here
        if (requiredAmount % VALIDATOR_CAPACITY > 0) {
            requiredExits++;
        }
        exitValidators(requiredExits);
    }

    emit UnstakeRequested(msg.sender, amount);
}
```

Consider the following simplified scenario:

`unAssignedBalance = 31 ETH withdrawnBalance = 0 delayedEffectiveBalance = 0 requestedExits = 0`

Also, for simplicity, assume the `deposit fees = 0%`

Alice, a malicious validator, stakes 1 ETH. This allocates the unassigned balance to a new validator via `distributeStakes`. At this point, the state is:

`unAssignedBalance = 0 ETH withdrawnBalance = 0 delayedEffectiveBalance = 0 requestedExits = 0`

Alice instantly places an unstake request for 1 ETH via `requestUnstake`. Since there is not enough balance to fulfill unstakes, an existing validator will be forced to withdraw from the Beacon Chain. After this, the state will be:

`unAssignedBalance = 0 ETH withdrawnBalance = 0 delayedEffectiveBalance = 0 requestedExits = 1`

Now, Alice can repeat the attack, this time by instantly depositing and withdrawing 64 ETH. At the end of this, the state will be:

`unAssignedBalance = 0 ETH withdrawnBalance = 0 delayedEffectiveBalance = 0 requestedExits = 2`

Each time, Alice only has to lose the deposit fee & gas fee but can grief the genuine stakers who lose their potential rewards & the operators who are forcefully kicked out of the validator.

**Impact:** Unnecessary validator withdrawal requests grief stakers, operators and protocol itself. Exiting validators causes a loss of yield to stakers and is very gas intensive for protocol.

**Recommended Mitigation:**
- Consider an unstake lock period. A user cannot request unstaking until a minimum time/blocks have elapsed after deposit.
- Consider removing ETH from `readyValidators` instead of exiting validators first -> while active validators are already accruing rewards, ready Validators have not yet started the process. And the overhead related to removing operators, de-registering from the SSV cluster is not needed if ETH is deallocated from ready validators.

**Casimir:**
Fixed in [4a5cd14](https://github.com/casimirlabs/casimir-contracts/commit/4a5cd145c247d9274c3f21f9e9c1b5557a230a01)

**Cyfrin:** Verified.
