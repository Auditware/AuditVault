---
tags:
  - lang/solidity
  - sector/dex
  - sector/liquid-staking
  - sector/nft
  - sector/token
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[stETH]]"
auditors:
  - "[[blockace]]"
  - "[[elolpuer]]"
report: "https://github.com/sherlock-audit/2025-11-stnxm-by-easedefi-judging"
genome:
  - "[[frozen-funds]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
  - "[[fot-slippage]]"
---
# H-3: Owner can steal funds on withdraw by burning wrong Uniswap V3 position liquidity

- id: 64081
- impact: HIGH
- protocol: [[stETH]] by EaseDeFi
- reporter: elolpuer (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue found in the stNXM contract, where the owner is able to steal funds from the vault and the protocol is unable to recover them. The bug was found by two users, blockace and elolpuer. The root cause of the bug is that the decreaseLiquidity() function does not check if the tokenId is valid for the wNxm/stNxm pool, allowing the owner to burn vault-held shares and gain more assets. The attack path involves the owner creating a withdrawal request and then using a different Uniswap V3 pool to call decreaseLiquidity() and burn shares belonging to others. This results in the owner being able to withdraw more assets and other users losing their ability to finalize withdrawals. The impact of this bug is that the owner can steal tokens from the vault and other users may lose their tokens. The protocol team has fixed this issue in a recent commit. To mitigate this issue, the tokenId should be checked to ensure it belongs to the wNxm/stNxm pool. 

## Details


Source: https://github.com/sherlock-audit/2025-11-stnxm-by-easedefi-judging/issues/176 

## Found by 
blockace, elolpuer

### Summary

From README: _If the owner is able to steal the funds that cannot be recovered by the protocol/proxy, then it may be a valid issue (if it leads to Med/High impact)._
Owner can pass a `tokenId` from a different Uniswap V3 pool to `decreaseLiquidity()`, which will burn vault shares because the function does not verify the token's pool. This results in burning vault-held shares and allows the owner to gain more assets.

### Root Cause

[decreaseLiquidity()](https://github.com/sherlock-audit/2025-11-stnxm-by-easedefi/blob/main/stNXM-Contracts/contracts/core/stNXM.sol#L416) function does not check if `tokenId` is valid for `wNxm/stNxm` pool:
```solidity
function decreaseLiquidity(uint256 tokenId, uint128 liquidity) external onlyOwner update {
    //@audit no check for valid tokenId
    INonfungiblePositionManager.DecreaseLiquidityParams memory params = ...

    nfp.decreaseLiquidity(params);
    (uint256 amount0, uint256 amount1) = nfp.collect(
        INonfungiblePositionManager.CollectParams(tokenId, address(this), type(uint128).max, type(uint128).max)
    );
    uint256 stNxmAmount = isToken0 ? amount0 : amount1;

    // Burn stNXM that was removed.
    if (stNxmAmount > 0) _burn(address(this), stNxmAmount);
    ...
}
```
This will allow owner to pass a `tokenId` from a different Uniswap V3 pool and burn shares to receive more assets during withdrawal.

### Internal Pre-conditions

1. Vault has some withdraw requests

### External Pre-conditions

_No response_

### Attack Path

1. Owner creates a withdrawal request using their shares (e.g., when large whales also create withdrawal requests) and waits until it can be finalized.
2. Owner creates 2 ERC-20 tokens and deploys a Uniswap V3 pool with them.
3. Adds liquidity to the pool and mints an ERC-721 position.
4. Transfers the NFT position to the `stNXM` contract.
5. Calls `decreaseLiquidity()` with this position to burn vault shares belonging to others (from others withdrawal requests).
6. Since the function does not verify that the position belongs to the `wNxm/stNxm` pool, it burns vault shares.
7. With a reduced `totalSupply()`, the owner can now withdraw more assets.
8. Other users lose their ability to finalize withdrawals because the `burn()` will be DoSed in `withdrawFinalize()` cause this shares already burned by owner.

### Impact

Owner steals tokens from vault, other user who had active withdrawal requests lose their tokens.

### PoC

_No response_

### Mitigation

Check that `tokenId` belongs to `wNxm/stNxm` pool.

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/EaseDeFi/stNXM-Contracts/commit/807170825a6b993412c51e569cd35a191842685e
