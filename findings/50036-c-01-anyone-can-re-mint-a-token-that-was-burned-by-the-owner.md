---
tags:
  - lang/solidity
  - has/github
  - has/poc
  - severity/high
  - sector/bridge
protocol: "[[NFTMirror]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/NFTMirror-security-review_2024-12-30.md"
genome:
  - "[[access-roles]]"
  - "[[specific-token-type]]"
---
# [C-01] Anyone can re-mint a token that was burned by the owner

- id: 50036
- impact: HIGH
- protocol: NFTMirror_2024-12-30
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/NFTMirror-security-review_2024-12-30.md

## Summary


This bug report talks about an issue with token minting on the Beacon contract. It is considered a high severity bug with a high likelihood of occurring. The problem is that tokens can be burned by the owner and then minted again, even though they are supposed to be locked. This is because the code does not lock the tokens after they are burned. The report suggests a solution to add a line of code to lock the tokens after they are burned.

## Details

## Severity

**Impact:** High

**Likelihood:** High

## Description

The minting of tokens is restricted to the beacon contract by enforcing in the `_beforeTokenTransfer` hook that only the beacon can transfer locked tokens. As the default status of a token is locked, non-existing tokens are expected to be locked.

```solidity
    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal view override {
        if (msg.sender != BEACON_CONTRACT_ADDRESS) {
@>          if (tokenIsLocked(tokenId)) revert CallerNotBeacon();
        }
```

However, it has not been taken into account that tokens can be burned by the owner when they are not locked, and after they are burned, they are kept unlocked. This allows anyone to mint them again.

```solidity
    function burn(uint256 tokenId) external {
        if (tokenIsLocked(tokenId)) {
            _burn(tokenId);
        } else {
@>          _burn(msg.sender, tokenId);
        }
    }
```

#### Proof of concept

```solidity
function testBurnAndMint() public {
    testUnlockTokens_ShadowCollection();

    vm.prank(baycShadow.ownerOf(tokenId));
    baycShadow.burn(tokenId);

    assertEq(baycShadow.tokenIsLocked(tokenId), false);
    baycShadow.mint(recipient, tokenId);
}
```

## Recommendations

Lock tokens after they are burned by the owner.

```diff
    function burn(uint256 tokenId) external {
        if (tokenIsLocked(tokenId)) {
            _burn(tokenId);
        } else {
            _burn(msg.sender, tokenId);
+           _setExtraData(tokenId, LOCKED);
        }
    }
```
