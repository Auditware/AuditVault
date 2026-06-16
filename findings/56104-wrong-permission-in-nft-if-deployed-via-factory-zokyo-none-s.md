---
tags:
  - lang/solidity
  - sector/nft
  - platform/zokyo
  - has/github
  - severity/high
  - vuln/access-control/uninitialized-owner
  - novelty/variant
  - misassumption/proxy-is-initialized
  - fix/add-access-control
protocol: "[[Shoyu]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2021-08-30-Shoyu.md"
genome:
  - "[[uninitialized-owner]]"
  - "[[variant]]"
  - "[[admin-takeover]]"
  - "[[access-roles]]"
  - "[[initializer-auth]]"
---
# Wrong permission in NFT if deployed via factory

- id: 56104
- impact: HIGH
- protocol: [[Shoyu]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2021-08-30-Shoyu.md

## Summary


The function createNFT721 is not working properly when called by a user. The issue is that the msg.sender in the NFT contract is set to the address of the factory, not the user. This causes problems when trying to call the function with onlyOwner modifier. The recommendation is to change the modifier or allow access for the factory to execute certain functions. The issue has been fixed by passing the factory owner as a parameter in the factory call.

## Details

**Description**

When the function createNFT721 is called msg.sender is the address of X user, and this
address passed as parameter to NFT contract as owner. But msg.sender in NFT721
constructor is the address of the factory, and in the initialize function contract trying to call the
function with onlyOwner modifier. Since msg.sender in initialize is factory and owner is
msg.sender of factory call (in my case user) it fails. This is also relevant for NFT1155.

**Recommendation**:

Change onlyOwner modifier to onlyOwnerOrFactory with changing of require in ti. Or provide
access for factory to execute setRoyaltyFeeRecipient and setRoyaltyFee functions.

**Re-audit**:
Fixed, now factory owner passed by parameter of factory call.
