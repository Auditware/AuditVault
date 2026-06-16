---
tags:
  - lang/solidity
  - platform/shieldify
  - has/github
  - severity/high
  - vuln/reentrancy/single-function
  - fix/add-access-control
  - novelty/known-pattern
  - misassumption/external-call-is-safe
  - sector/staking
protocol: "[[Vallarok]]"
auditors:
  - "[[Shieldify Security]]"
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/Vallarok-Security-Review.md"
genome:
  - "[[single-function]]"
  - "[[add-access-control]]"
  - "[[known-pattern]]"
  - "[[reward-theft]]"
  - "[[access-roles]]"
  - "[[reentrancy-guard]]"
---
# [H-01] Malicious User Can Mint Unlimited Amount of NFTs Due to Reentrancy in `whitelistMint()` and `FCFSMint()`

- id: 44182
- impact: HIGH
- protocol: [[Vallarok]]
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/Vallarok-Security-Review.md

## Summary


The report states that there is a high risk bug in the `whitelistMint()` and `FCFSMint()` functions in the `RunaAGI.sol` file. These functions are vulnerable to reentrancy, which means that a malicious user can exploit them to mint an unlimited number of NFTs. The bug is caused by the lack of a reentrancy modifier in the code, which allows the attacker to continuously call the `_safeMint()` function. The recommended solution is to add a reentrancy modifier to these functions. The team has acknowledged the bug and has fixed it as suggested.

## Details

## Severity

High Risk

## Description

The `whitelistMint()` and `FCFSMint()` functions are vulnerable to reentrancy. We can see that the function fails to apply a reentrancy modifier.

When a malicious user calls them, they can do a reentrancy attack via the `_safeMint()` function that is called. We can see that absolutely all variables are updated afterwards. Thus, a malicious user can mint as many NFTs as he wants.

## Location of Affected Code

File: [contracts/RunaAGI.sol](https://github.com/purple-banana/contract-runa/blob/7153c2ffbf3a5e958af921f0ab92e20c5035d9bf/contracts/RunaAGI.sol)

```solidity
function whitelistMint(uint256 _salt, bytes32 _msgHash, bytes memory _signature) external payable {
    // code
    _safeMint(msg.sender, _tokenIdCounter.current());
    _tokenIdCounter.increment();
    _totalSupply++;
    saleSupplyMinted++;
}

function FCFSMint(uint256 _salt, bytes32 _msgHash, bytes memory _signature) external payable {
    // code
    _safeMint(msg.sender, _tokenIdCounter.current());
    _tokenIdCounter.increment();
    _totalSupply++;
    saleSupplyMinted++;
    fcfsMinted[msg.sender] += 1;
}
```

## Recommendation

Consider adding a reentrancy modifier on `whitelistMint()` and `FCFSMint()`.

## Team Response

Fixed as suggested.
