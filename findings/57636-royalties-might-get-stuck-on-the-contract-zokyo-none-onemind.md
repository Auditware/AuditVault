---
tags:
  - lang/solidity
  - platform/zokyo
  - has/github
  - severity/high
  - sector/nft
  - sector/nft-marketplace
protocol: "[[Onemind]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-10-18-Onemind.md"
genome:
  - "[[frozen-funds]]"
  - "[[permanent]]"
  - "[[royalty-edge-cases]]"
---
# Royalties might get stuck on the contract.

- id: 57636
- impact: HIGH
- protocol: [[Onemind]]
- reporter: zokyo (Zokyo)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-10-18-Onemind.md

## Summary


The bug report is about a function in the PlatformAuction.sol file that handles royalties and currency transfers. There is a problem with the check for the receiver address, which can cause the royalty value to be calculated and subtracted from the initial price, but not actually transferred. This can happen if the owner of the NFT collection has renounced their role. The recommendation is to not subtract the fee value if it wasn't transferred due to a zero address. The bug has been resolved, but there was another issue where the result of the transaction was always returned as true even if the royalty was not transferred. This has also been fixed.

## Details

**Description**

PlatformAuction.sol: function_handleRoyalties(), _currency Transfer().
There is a check in the_currency Transfer() function that the 'receiver address is not zero address. In case the owner of the NFT collection has renounced the role with standard Ownable functionality, the_calculateRoyalty() function called within the_handleRoyalties() function will return zero address. This way, the royalty value will be calculated and subtracted from the initial price` (Line 150), but it won't be transferred and will get stuck on the auction contract's balance.
A similar situation can also happen in the_handleFee() function in case 'feeConfig.treasury` is set as zero address.

**Recommendation**

Do not subtract the fee value from the price in case the fee value wasn't transferred because of zero address.

**Re-audit comment**

Resolved.

Post-audit:
Paid 'royalty amount is now subtracted from price` in case of a successful royalty transfer. However, in_currency Transfer(), the result flag is initially equal to true. Due to this, the result of the transaction will be returned as true even though, in fact, royalty might not have been transferred.

Post-audit:
The correct result is returned now and no royalties can get stuck.
