---
tags:
  - lang/solidity
  - sector/liquid-staking
  - sector/staking
  - sector/token
  - platform/spearbit
  - has/github
  - has/poc
  - severity/high
protocol: "[[Kinetiq LST]]"
auditors:
  - Rvierdiiev
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Kinetiq-Spearbit-Security-Review-March-2025.pdf"
genome:
  - "[[integer-bounds]]"
  - "[[precision-loss]]"
  - "[[direct-drain]]"
  - "[[variant]]"
  - "[[math-is-safe]]"
  - "[[fix-arithmetic]]"
---
# Precision Truncation on Stake May Lead to Improper Accounting and Protocol Insolvency

- id: 58596
- impact: HIGH
- protocol: Kinetiq LST
- reporter: Rvierdiiev (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Kinetiq-Spearbit-Security-Review-March-2025.pdf

## Summary


This bug report discusses a high-risk issue in the `StakingManager` contract. The problem occurs when `_distributeStake` sends HYPE to the L1, as the `truncatedAmount` used may not be divisible by `1e10`, resulting in a loss of funds. This can lead to incorrect accounting and prevent users from withdrawing their funds. The report suggests several solutions, including changing the `recordStake()` function and warning users to interact with a consistent `StakingManager` instance. The bug has been fixed in the latest commits.

## Details

## Severity: High Risk

## Context
(No context files were provided by the reviewer)

## Description
In the `StakingManager` contract, `_distributeStake` sends HYPE to the L1 via:

```solidity
(bool success,) = payable(L1_HYPE_CONTRACT).call{value: truncatedAmount}("");
```

The `truncatedAmount` is derived from user input but may not be divisible by `1e10`, which is required by HyperCore’s 8-decimal format. Any residual amount (less than `1e10`) is lost during the transfer. This leads to a permanent accounting mismatch: more kHYPE is minted than the amount effectively deposited to L1, creating latent insolvency.

This situation often arises after a withdrawal operation leaves the internal `hypeBuffer` in a non-aligned state. A subsequent deposit will adjust for the buffer, leaving a remainder (`amountToStake`) that is no longer `1e10`-divisible - leading to precision loss and drift.

## How it affects the system:
- Silent loss of HYPE on every unaligned stake.
- Incorrect `totalStaked` accounting in both `StakingManager` and `StakingAccountant`.
- Minted kHYPE cannot be fully redeemed, resulting in user withdrawals reverting.
- If unstake fees are enabled, the protocol treasury may absorb the discrepancy since part of the kHYPE is not redeemed.

Although the problem may not surface immediately when fees are active, it ultimately dilutes protocol revenue by over-minting kHYPE relative to real funds.

The total protocol or user-facing loss in HYPE due to misaligned buffer truncation can be expressed as:
- Let `n` be the number of deposit operations following a buffer misalignment.
- Let `ai` be the intended amount to stake for deposit `i`.
- Let `ti` be the truncated amount actually sent to L1 for deposit `i`.
- Let `ϵi = ai - ti` be the unrecoverable loss from deposit `i` due to precision truncation.

Then, the total accumulated loss `Ltotal` is:

$$
L_{total} = \sum_{i=1}^{n} ϵi = \sum_{i=1}^{n} (a_i \mod 10^{10})
$$

Each `ϵi` represents the portion of HYPE (in wei) that is silently dropped due to the 8-decimal constraint on HyperCore, and cannot be recovered via unstake or withdrawal mechanisms. This value accumulates in the contract and cannot be redeemed via withdrawal or unstaking.

## Proof Of Concept
The following test demonstrates the exact scenario:

```solidity
function test_simple_bufferLeadsToInsolvency() public {
    vm.prank(manager);
    stakingManager.setUnstakeFeeRate(0);
    _stake(user, 1 ether / 2);
    _unstake(user, 997); // leaves non-aligned buffer
    _stake(user, 0.5 ether); // triggers truncated send
    deal(address(stakingManager), sentToL1 * 1e10 + address(stakingManager).balance);
    _unstake(user, kHYPE.balanceOf(user));
    _passTimeAndWithdraw(user, 0);
    _passTimeAndWithdraw(user, 1); // Reverts - balance not recoverable
}
```

Truncated amounts are not retained by the contract or recoverable from HyperCore.

## Recommendation
- Change `recordStake()` to operate on the actual `truncatedAmount` that was sent to L1, not the original input amount.
- Consider adding logic to enforce `amountToStake % 1e10 == 0` or normalize the buffer post-withdrawal.
- Track unredeemable “dust” explicitly and separate it from `_cancelledWithdrawalAmount` to allow intentional recovery.
- Warn integrators and users to always interact with a consistent `StakingManager` instance, as buffer state is isolated and loss is local to each instance.

## Kinetiq
Fixed in e2bac5c.

## Cantina Managed
Fixed in e2bac5c. The fix calculates the amount that was lost previously and stores it in the buffer to add liquidity for withdrawals. This effectively solves the issue by expanding the buffer potentially over the maximum target defined on the global state variable. This fix works if and only if only one `StakingManager` is used per Khype token contract or if users withdraw from the same exact `StakingManager` they used for staking. Added event for the fix in 3c1ec31 commit.
