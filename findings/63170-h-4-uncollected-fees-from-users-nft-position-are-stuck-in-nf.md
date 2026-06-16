---
tags:
  - lang/solidity
  - sector/dex
  - sector/nft
  - platform/sherlock
  - has/github
  - severity/high
  - vuln/access-control/missing-modifier
  - vuln/reentrancy/single-function
  - fix/use-reentrancy-guard
  - novelty/known-pattern
  - misassumption/admin-is-honest
  - misassumption/external-call-is-safe
  - fix/add-access-control
  - trigger/reentrancy-callback
protocol: "[[Ammplify]]"
auditors:
  - "[[0x37]]"
  - "[[0xpinkman]]"
  - "[[JeRRy0422]]"
  - "[[KiroBrejka]]"
  - "[[SarveshLimaye]]"
  - "[[Slayer]]"
  - "[[blockace]]"
  - "[[panprog]]"
report: "https://github.com/sherlock-audit/2025-09-ammplify-judging"
genome:
  - "[[missing-modifier]]"
  - "[[single-function]]"
  - "[[permanent]]"
  - "[[use-reentrancy-guard]]"
  - "[[known-pattern]]"
  - "[[access-roles]]"
  - "[[reentrancy-guard]]"
---
# H-4: Uncollected fees from user's NFT position are stuck in `NFTManager` if `NFTManager.decomposeAndMint` function is used

- id: 63170
- impact: HIGH
- protocol: [[Ammplify]]
- reporter: panprog (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue with the `NFTManager.decomposeAndMint` function in the Ammplify protocol. This function is responsible for converting a user's Uniswap V3 NFT position into Ammplify's `Maker` liquidity. However, the issue is that any uncollected fees from the NFT position are not being sent to the user, but instead remain stuck in the `NFTManager` contract. This is because the function does not use the `RFTPayer` interface, which is meant to transfer these fees to the user. As a result, the user loses the uncollected fees from their NFT position. The root cause of this issue is the failure to use the `RFTPayer` interface in the `decomposeAndMint` function. To mitigate this issue, the protocol team has fixed it in a recent pull request.

## Details


Source: https://github.com/sherlock-audit/2025-09-ammplify-judging/issues/238 

## Found by 
0x37, 0xpinkman, JeRRy0422, KiroBrejka, SarveshLimaye, Slayer, blockace, panprog

### Summary

`NFTManager.decomposeAndMint` converts user's Uniswap V3 NFT position into Ammplify's `Maker` liquidity. The issue is that any uncollected fees are stuck in the `NFTManager` contract. These fees are collected in the `UniV3Decomposer` and sent to `NFTManager` contract:

```solidity
            // After primary transfer, sweep any dust the contract may still hold for this token
            uint256 residual = IERC20(token).balanceOf(address(this));
            if (residual > 0) {
                TransferHelper.safeTransfer(token, caller, residual);
            }
```

Notice that the funds are sent to `caller`, which is set to `msg.sender` (e.g. `NFTManager`) in `nonReentrant` modifier of the `decompose` function:

```solidity
    modifier nonReentrant {
        require(caller == address(0), ReentrancyAttempt());
        caller = msg.sender;
        _;
        caller = msg.sender;
    }

    function decompose(
        uint256 positionId,
        bool isCompounding,
        uint160 minSqrtPriceX96,
        uint160 maxSqrtPriceX96,
        bytes calldata rftData
    ) external nonReentrant returns (uint256 newAssetId) {
```

After receiving funds from the decomposer, `NFTManager` never sends these to the user:

```solidity
        _currentTokenRequester = msg.sender;

        // Decompose the Uniswap V3 position
        assetId = DECOMPOSER.decompose(positionId, isCompounding, minSqrtPriceX96, maxSqrtPriceX96, rftData);

        // Clear the token requester context
        _currentTokenRequester = address(0);

        // Mint NFT for the decomposed asset
        tokenId = _nextTokenId++;
        assetToToken[assetId] = tokenId;
        tokenToAsset[tokenId] = assetId;
        _currentSupply++;

        _safeMint(msg.sender, tokenId);

        emit PositionDecomposedAndMinted(positionId, assetId, tokenId, msg.sender);
    }
```

It might expect to receive these collected fees via the `RFTPayer` interface, but this interface is never used in this call:
- decomposer transfers funds to `NFTManager` directly, not via `RFTPayer`.
- even though decomposer specifies `msg.sender` (`NFTManager`) as recepient for `Maker` position, under the hood it uses `RFTPayer` interface on its caller (i.e. decomposer) instead of the `recepient`.

The funds in `NFTManager` remain until the first `mintNewMaker` operation, which sends all residual token amounts to `MakerFacet`, meaning these funds are then stuck in the `MakerFacet` contract.

### Root Cause

No funds are sent to user after `DECOMPOSER.decompose` call (and `RFTPayer` interface is not used):
https://github.com/sherlock-audit/2025-09-ammplify/blob/main/Ammplify/src/integrations/NFTManager.sol#L156-L173

### Internal Pre-conditions

User calls `NFTManager.decomposeAndMint` with position with uncollected fees

### External Pre-conditions

None.

### Attack Path

Happens always when internal pre-condition is met.

### Impact

User losses uncollected position fees

### Mitigation

After decomposer mints `Maker` liquidity, send residual amounts of both tokens to `msg.sender`, or use `RFTPayer` interface from decomposer to `NFTManager`. If `RFTPayer` interface is not used, do not set `_currentTokenRequester` in `decomposeAndMint` function since the interface is not used in it.

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/itos-finance/Ammplify/pull/38
