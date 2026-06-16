---
tags:
  - lang/move
  - lang/solidity
  - platform/pashov
  - has/github
  - severity/high
  - sector/dex
  - sector/nft
  - sector/staking
protocol: "[[DYAD]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Dyad-security-review.md"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[access-roles]]"
  - "[[fot-slippage]]"
  - "[[reward-accounting]]"
---
# [H-05] Users cannot stake in `UniV3Staking`

- id: 41692
- impact: HIGH
- protocol: [[DYAD]]
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Dyad-security-review.md

## Summary


This bug report discusses an issue with the `UniswapV3Staking.stake()` function, which is used to pull NFTs from users. The problem is that the function calls a non-existent function, `onERC721Received()`, which causes the transfer to fail and the execution of `stake()` to revert. To fix this issue, the report recommends implementing the `onERC721Received()` function in the contract.

## Details

## Severity

**Impact:** Medium

**Likelihood:** High

## Description

`UniswapV3Staking.stake()` pulls NFTs from the user in the following way:

```solidity
        positionManager.safeTransferFrom(msg.sender, address(this), tokenId);
```

However, this will end up calling the `onERC721Received()` function on the `UniswapV3Staking` contract, and expect a return value. However since that function is not implemented in this contract, the ERC721 transfer will fail, reverting the execution of `stake()`.

## Recommendations

Implement the following function to ensure that ERC721's can be received via `safeTransferFrom()`:

```solidity
function onERC721Received(address, address, uint256, bytes calldata) public pure returns (bytes4) {
        return msg.sig;
}
```
