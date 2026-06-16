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
  - "[[fee-accounting]]"
  - "[[fee-calculation]]"
  - "[[use-reentrancy-guard]]"
  - "[[variant]]"
  - "[[math-is-safe]]"
---
# [C-01] Protocol Loses `mint()`/`redeem()` Fees Due to Missing Treasury Collection Mechanism

- id: 55099
- impact: HIGH
- protocol: Terplayer Berabtc
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/Terplayer-BeraBTC-Security-Review.md

## Summary


This bug report describes a critical issue in the contract code for the BeraBitcoin project. The contract is supposed to collect fees during minting and redemption, but it fails to do so. This means that the project is losing potential revenue. The location of the affected code is also provided. The recommendation is to add a treasury address and update the code to collect and store the fees correctly. The team has responded that the issue has been fixed.

## Details

## Severity

Critical Risk

## Description

The contract implements minting and redemption fees in the `custodianMint()` and `redeem()` functions but fails to properly collect and store these fees for the protocol. During minting, the fee is simply deducted from the minted amount without being allocated to a treasury. Similarly, during redemption, the fee is subtracted from the redeemed value without being captured. While the fee calculations are correctly implemented mathematically, the contract lacks both a treasury address variable and the logic to transfer these fees to protocol-controlled addresses. This creates a situation where protocol revenue that should be accruing to the project treasury is effectively being burned or lost.

## Location of Affected Code

File: [src/BeraBitcoin.sol#L178](https://github.com/batoshidao/bera-bitcoin/blob/19d509911de64a062dfaeef33f14e26f08b23c10/src/BeraBitcoin.sol#L178)

```solidity
function custodianMint(
   address to,
   uint256 value
) public onlyRole(CUSTODIAN_ROLE) nonReentrant {
   if (mintFeeRate > 0) {
      value -= (value * mintFeeRate) / BASE_RATE;
   }
   _mint(to, value);
   emit CustodianMinted(to, value);
}
```

File: [src/BeraBitcoin.sol#L203](https://github.com/batoshidao/bera-bitcoin/blob/19d509911de64a062dfaeef33f14e26f08b23c10/src/BeraBitcoin.sol#L203)

```solidity
function redeem(
   uint256 value,
   string memory recipient
) public nonReentrant {
   uint256 burned = value;
   _burn(msg.sender, burned);
   if (redeemFeeRate > 0) {
      value -= (burned * redeemFeeRate) / BASE_RATE;
   }
   emit Redeemed(msg.sender, burned, value, recipient);
}
```

## Impact

The protocol loses all potential revenue from its fee structure as they are not being collected.

## Recommendation

Add treasury address state variable and add fees to this variable which are generated through `custodianMint()` and `redeem()`

## Team Response

Fixed.
