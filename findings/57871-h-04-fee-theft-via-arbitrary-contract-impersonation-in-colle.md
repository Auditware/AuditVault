---
tags:
  - lang/solidity
  - sector/dex
  - sector/governance
  - platform/shieldify
  - has/github
  - has/poc
  - severity/high
protocol: "[[Daoslive]]"
auditors:
  - Shieldify Security
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/DaosLive-Security-Review.md"
genome:
  - "[[access-roles]]"
  - "[[fee-theft]]"
---
# [H-04] Fee Theft via Arbitrary Contract Impersonation in `collect()` Function in `DaosLocker`

- id: 57871
- impact: HIGH
- protocol: Daoslive
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/DaosLive-Security-Review.md

## Summary


The report describes a high-risk bug in the `DaosLocker::collect()` function, which can be exploited by a malicious actor to steal swap fees from legitimate DAOs. This can be done by deploying a fake contract that mimics the original `DaosLive` contract and calling `collect()` using this fake contract. The bug is caused by a lack of authorization checks and contract ownership verification in the affected code. The impact of this bug is that all accumulated swap fees will be drained and the intended ownership model will be bypassed. The recommendation to mitigate this issue is to create a new function inside `DaosLive` and use `msg.sender` instead of taking input for the Dao address. The team has responded that the bug has been fixed.

## Details

## Severity

High Risk

## Description

The `DaosLocker::collect()` function is vulnerable to impersonation attacks. A malicious actor can deploy an **arbitrary contract** that mimics the **token address and LP token ID** of a legitimate `DaosLive` contract. By doing so, they can illegitimately invoke `collect()` and **claim all the accrued swap fees**, effectively **stealing earnings meant for the rightful owner**.

## Exploit Scenario

1. A malicious actor observes the finalized `DaosLive` contract.
2. They deploy a **fake contract** that uses the **same token address and LP token ID** as the original `DaosLive` contract.
3. The attacker then calls `DaosLocker::collect()` using the malicious contract.
4. The function executes and **transfers the Dao fees** to the attacker - fees that were originally intended for the legitimate owner of the `DaosLive` contract.

### Root Cause

- Lack of **authorization checks** on the caller of `collect()`
- Absence of **contract ownership or identity verification**

## Location of Affected Code

File: [contracts/DaosLocker.sol](https://github.com/ED3N-Ventures/daoslive-sc/blob/9a1856db2060b609a17b24aa72ab35f2cdf09031/contracts/DaosLocker.sol)

```solidity
function collect(address dao) external {
  // code
  IDaosLive daosLive = IDaosLive(dao);
  @>  address token = daosLive.token();
  INonfungiblePositionManager positionManager = INonfungiblePositionManager(
        _factory.uniV3PositionManager()
  );
  address wethAddr = positionManager.WETH9();

  (uint256 amount0, uint256 amount1) = positionManager.collect(
      INonfungiblePositionManager.CollectParams({
          recipient: address(this),
          amount0Max: type(uint128).max,
          amount1Max: type(uint128).max,
   @>     tokenId: daosLive.lpTokenId()
      })
  );

  TransferHelper.safeTransfer(
        wethAddr,
  @>    OwnableUpgradeable(dao).owner(),
            daoEth
        );
        TransferHelper.safeTransfer(
            token,
        @>  OwnableUpgradeable(dao).owner(),
            daoToken
        );
  // code
}
```

## Impact

**Drain all accumulated Uniswap swap fees** that were meant for legitimate DAOs.
**Completely bypass the intended ownership model**, allowing external actors to claim protocol rewards.

## Recommendation

Consider implementing the steps described below to mitigate this issue:

- Create a function inside `DaosLive` to call `DaosLocker::collect()`
- Instead of taking input, use `msg.sender` for Dao address

## Team Response

Fixed.
