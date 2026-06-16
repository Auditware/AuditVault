---
tags:
  - lang/solidity
  - sector/staking
  - sector/token
  - platform/trailofbits
  - has/github
  - severity/high
  - novelty/known-pattern
protocol: "[[Shardeum]]"
auditors:
  - "[[Guillermo Larregay Trail of Bits PUBLIC]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/2025-10-vechain-vechainthorhayabusaupgrade-securityreview.pdf"
genome:
  - "[[known-pattern]]"
  - "[[griefing]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
  - "[[integer-bounds]]"
  - "[[vote-delegation-loop]]"
---
# Staker contract balance invariant can be broken using SELFDESTRUCT

- id: 63203
- impact: HIGH
- protocol: Upgrade
- reporter: Guillermo Larregay Trail of Bits PUBLIC (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2025-10-vechain-vechainthorhayabusaupgrade-securityreview.pdf

## Summary


The VeChain DPoS system has a bug where the total amount of staked VET should match the Staker contract balance, but an attacker can use the `SELFDESTRUCT` function to send VET to the contract, breaking this invariant. This can prevent certain operations from completing and block production. A recommended short-term solution is to track the contract's VET balance separately and not rely on it for critical code paths. In the long term, the system should not rely on contract balances and improve testing for adversarial cases.

## Details

## VeChain DPoS Contract Balance Invariant

**Difficulty:** N/A  
**Type:** Configuration

## Description

VeChain DPoS uses a Staker contract to handle validations and delegations. One of the system's invariants requires that the total amount of staked VET matches the Staker contract balance. 

Even though the contract prevents VET from being received via normal transfers, an attacker can still send VET to the contract via `SELFDESTRUCT`. This can break two assumptions: the first one is that the amount of VET transferred to the contract is always an integer, and the second is that all VET in the contract comes from a stake or delegation operation.

```go
func (s *Staker) ContractBalanceCheck(pendingWithdraw uint64) error {
    // Get the staker contract's account balance
    stakerAddr := s.Address()
    balance, err := s.state.GetBalance(stakerAddr)
    if err != nil {
        return err
    }
    balanceVET := ToVET(balance)
    total := uint64(0)
    for _, stake := range []uint64{lockedStake, queuedStake, withdrawableStake, cooldownStake, pendingWithdraw} {
        partialSum, overflow := math.SafeAdd(total, stake)
        if overflow {
            return fmt.Errorf(
                "total overflow occurred while adding locked(%d) + queued(%d) + withdrawable(%d) + cooldown(%d) + pendingWithdraw(%d)",
                lockedStake,
                queuedStake,
                withdrawableStake,
                cooldownStake,
                pendingWithdraw,
            )
        }
        total = partialSum
    }
    if balanceVET != total {
        logger.Error("sanity check failed",
            "locked", lockedStake,
            "queued", queuedStake,
            "withdrawable", withdrawableStake,
            "cooldown", cooldownStake,
            "pendingWithdraw", pendingWithdraw,
            "total", total,
            "balance", balanceVET,
        )
        return fmt.Errorf(
            "sanity check failed: locked(%d) + queued(%d) + withdrawable(%d) = %d, but account balance is %d, diff= %d",
            lockedStake,
            queuedStake,
            withdrawableStake,
            total,
            balanceVET,
            balanceVET-total,
        )
    }
    return nil
}
```

**Figure 1.1:** An excerpt of the ContractBalanceCheck function (thor/builtin/staker/housekeep.go#L262–L324)

As shown in figure 1.1, the ContractBalanceCheck invariant can be broken by forcing VET into the contract. Since the invariant is checked on housekeeping, staking operations, and block validation, the attacker can do the following:

- Prevent the PoA to DPoS transition from completing if the balance is altered during the transition period.
- Prevent block production if a transaction is sent after DPoS is activated, since blocks containing transactions that break the balance invariant are invalid.

## Exploit Scenario

Mallory develops a contract that, when deployed, calls the `SELFDESTRUCT` opcode and sends its balance to the staker contract. Then she deploys and funds it with more than 1 VET, altering the balance of the staker contract by enough to break the invariant.

## Recommendations

- **Short term:** Track the Staker contract’s VET balance using an additional storage variable that is updated only on direct calls to the smart contract. Direct transfers and airdrops should not affect this variable.
  
- **Long term:** Do not rely on contract balances, as they can be altered. Improve the test suite to consider adversarial cases. Additionally, consider reducing the reliance on the contract balance check on critical code paths (e.g., block validation), since this opens up a significant DoS attack vector.
