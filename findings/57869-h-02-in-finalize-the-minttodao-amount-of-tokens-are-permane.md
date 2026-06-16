---
tags:
  - lang/solidity
  - sector/governance
  - platform/shieldify
  - has/github
  - severity/high
protocol: "[[Daoslive]]"
auditors:
  - Shieldify Security
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/DaosLive-Security-Review.md"
genome:
  - "[[fee-accounting]]"
  - "[[frozen-funds]]"
  - "[[variant]]"
---
# [H-02] In `finalize()`, the `_mintToDao` Amount of Tokens Are Permanently Stuck in `DaosLive`

- id: 57869
- impact: HIGH
- protocol: Daoslive
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/DaosLive-Security-Review.md

## Summary


This bug report describes a high-risk issue in the `DaosLive::finalize()` function of the DaosLive contract. The issue is that there is a parameter called `_mintToDao()` that allows for the minting of additional tokens to the contract address. However, there is no way for the DAO manager to access or use these tokens, leading to a permanent loss of tokens. This affects all DAOs that use this parameter during `finalize()`. The recommended solution is to add a function to transfer tokens to the DAO manager or modify the `finalize()` function to mint directly to the DAO manager or any recipient address. The team has responded that the issue has been fixed.

## Details

## Severity

High Risk

## Description

In the `DaosLive::finalize()` function, there's a parameter `_mintToDao()` that allows minting additional tokens to the contract address.

These tokens are minted to the contract address (`address(this)`), but there is no functionality implemented to allow the DAO manager to access or utilize these tokens. The tokens become permanently locked in the contract.

## Location of Affected Code

File: [contracts/DaosLive.sol](https://github.com/ED3N-Ventures/daoslive-sc/blob/9a1856db2060b609a17b24aa72ab35f2cdf09031/contracts/DaosLive.sol)

```solidity
 function finalize(
    string calldata name,
    string calldata symbol,
    IDaosVesting.Schedule[] calldata schedules,
@-> uint256 _mintToDao,
    uint256 _snipeAmount // eth
) external onlyOwner {
    // code

    uint256 mintToDao = _mintToDao;
    if (mintToDao > 0) {
@->    IDaosToken(token).mint(address(this), mintToDao);
    }

    // code
}
```

## Impact

- Tokens minted through `_mintToDao()` are permanently locked in the contract, leading to a permanent loss of tokens, as there's no way to recover them
- Affects all DAOs that use the `_mintToDao()` parameter during `finalize()`

## Recommendation

- Add a dedicated function to transfer tokens to the DAO manager.
- Modify the `finalize()` function to mint directly to the DAO manager or any recipient address.

## Team Response

Fixed.
