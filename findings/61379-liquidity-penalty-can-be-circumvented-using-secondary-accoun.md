---
tags:
  - lang/solidity
  - platform/openzeppelin
  - has/github
  - severity/high
  - sector/dex
protocol: "[[Uniswap Hooks]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/openzeppelin-uniswap-hooks-v1.1.0-rc-1-audit"
genome:
  - "[[fee-manipulation]]"
  - "[[fee-theft]]"
  - "[[fot-slippage]]"
---
# Liquidity Penalty Can Be Circumvented Using Secondary Accounts

- id: 61379
- impact: HIGH
- protocol: OpenZeppelin [[Uniswap Hooks]] v1.1.0 RC 1 Audit
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/openzeppelin-uniswap-hooks-v1.1.0-rc-1-audit

## Summary


The LiquidityPenaltyHook contract is designed to discourage unfair fees earned by attackers in Uniswap by donating fees to the pool when liquidity is added and removed within a short time window. However, a coordinated attack involving two accounts can bypass this penalty mechanism and allow the attacker to collect the fees. To prevent this, it is suggested to enhance the hook logic to monitor for abrupt and large tick changes and condition donation eligibility on the continuity and persistence of the beneficiary's liquidity.

## Details

The `LiquidityPenaltyHook` [contract](https://github.com/OpenZeppelin/uniswap-hooks/blob/087974776fb7285ec844ca090eab860bd8430a11/src/general/LiquidityPenaltyHook.sol) is designed to penalize JIT liquidity provision by donating fees to the pool when liquidity is added and removed within a short time window (defined by `blockNumberOffset`). This discourages attackers from earning fees unfairly from the swaps they anticipate. However, the penalty mechanism can be bypassed using a coordinated attack involving two accounts, exploiting how fee donation rewards in-range liquidity providers at the time of removal.

Below is an example simulating how an attacker could bypass the JIT protection using two coordinated accounts:

1. **Setup:** Current tick is in a stable range (e.g., 10,000).
2. **Step 1 – Positioning:** Attacker’s secondary account (Account B or "B") adds a small liquidity position in an out-of-range tick window (e.g., [-13,000, -12,000]) where no other liquidity exists.
3. **Step 2 – Fee Capture:** In the next block:
   * Primary account (Account A or "A") adds large liquidity in the current tick.
   * Victim executes a large swap, generating fees for A.
4. **Step 3 – Fee Redirection:**
   * A swaps to move the price into B’s tick range.
   * A removes liquidity. Since removal happens within the offset window, `LiquidityPenaltyHook` forcibly donates accrued fees back to the pool.
   * B, now the sole in-range provider, removes liquidity and receives the donated fees.
   * A swaps again to restore the original tick range.

This sequence allows Account B to collect fees originally earned by Account A, effectively bypassing the penalty that would otherwise reduce A’s profits. Since the hook donates to whoever is in range during removal, and has no mechanism to detect coordination between A and B, this type of attack is feasible and profitable.

Consider enhancing the hook logic to monitor for abrupt and large tick changes, particularly those occurring within a single block. If such behavior is detected, fee donations could be withheld, delayed, or proportionally distributed over time to prevent their full capture by opportunistically positioned accounts. In addition, donation eligibility could be conditioned on the continuity and persistence of the beneficiary’s liquidity, reducing the incentive for short-lived, strategically placed positions that aim to exploit transient price shifts.
