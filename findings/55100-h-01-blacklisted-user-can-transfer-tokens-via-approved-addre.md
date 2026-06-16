---
tags:
  - lang/solidity
  - platform/shieldify
  - has/github
  - severity/high
  - sector/bridge
protocol: "[[Terplayer Berabtc]]"
auditors:
  - Shieldify Security
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/Terplayer-BeraBTC-Security-Review.md"
genome:
  - "[[access-roles]]"
  - "[[missing-modifier]]"
  - "[[variant]]"
  - "[[admin-is-honest]]"
---
# [H-01] Blacklisted User Can Transfer Tokens via Approved Addresses

- id: 55100
- impact: HIGH
- protocol: Terplayer Berabtc
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/Terplayer-BeraBTC-Security-Review.md

## Summary


A high-risk bug has been found in a contract that prevents certain addresses from transferring tokens. The bug is in the `transferFrom()` function, where it only checks if the caller is blacklisted, not the actual token owner. This means that a blacklisted user can still transfer tokens through an approved address. This vulnerability defeats the purpose of the blacklist feature and can lead to potential money laundering or stolen funds. The fix requires modifying the `transferFrom()` function to check both the caller and token owner against the blacklist. The team has fixed the issue.

## Details

## Severity

High Risk

## Description

The contract implements a blacklist mechanism to prevent certain addresses from performing token transfers. However, the implementation contains a critical flaw in the `transferFrom()` function where it only checks if the caller (`msg.sender`) is blacklisted, not the actual token owner (from address). This allows a blacklisted user to transfer tokens if they had previously approved another address before being blacklisted. The approved address can then call `transferFrom()` to move the blacklisted user's tokens, since the modifier only verifies the caller's status. The vulnerability stems from incomplete blacklist checks in the transfer authorization logic.

## Location of Affected Code

File: [src/BeraBitcoin.sol#L242](https://github.com/batoshidao/bera-bitcoin/blob/19d509911de64a062dfaeef33f14e26f08b23c10/src/BeraBitcoin.sol#L242)

```solidity
function transferFrom(address from, address to, uint256 amount) public override notBlacklisted returns (bool) {
   return super.transferFrom(from, to, amount);
}
```

File: [src/BeraBitcoin.sol#L107](https://github.com/batoshidao/bera-bitcoin/blob/19d509911de64a062dfaeef33f14e26f08b23c10/src/BeraBitcoin.sol#L107)

```solidity
modifier notBlacklisted() {
   if (isBlacklisted(msg.sender)) revert AccountIsBlacklisted();
   _;
}
```

## Impact

This vulnerability severely compromises the effectiveness of the blacklist feature. Malicious actors who get blacklisted can still move their funds through pre-approved addresses, defeating the purpose of the security measure. In scenarios where tokens need to be frozen, this flaw allows continued token movement, potentially enabling money laundering or helping attackers escape with stolen funds.

## Recommendation

The fix requires modifying the `transferFrom()` function to check both the caller (`msg.sender`) and the token owner (from address) against the blacklist. The `notBlacklisted()` modifier should be extended to verify both addresses in transfer operations.

## Team Response

Fixed.
