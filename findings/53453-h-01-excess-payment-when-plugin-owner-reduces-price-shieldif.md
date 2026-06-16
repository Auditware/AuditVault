---
tags:
  - lang/solidity
  - platform/shieldify
  - has/github
  - has/poc
  - severity/high
  - sector/bridge
protocol: "[[Bullasv2]]"
auditors:
  - Shieldify Security
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/BullasV2-Security-Review.md"
genome:
  - "[[fee-accounting]]"
  - "[[variant]]"
---
# [H-01] Excess Payment When Plugin Owner Reduces Price

- id: 53453
- impact: HIGH
- protocol: Bullasv2
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/BullasV2-Security-Review.md

## Summary


The report discusses a bug in the `Multicall` contract where the `click()` function does not properly check the `msg.value` sent by users. This can lead to a vulnerability where users may send more ETH than necessary, which gets locked in the contract. The bug is located in the `Multicall.sol` file and can be exploited if the plugin owner changes the `entryFee` while a user's transaction is pending. The team has fixed the issue and recommends checking the relationship between `msg.value` and `price` to prevent this bug from occurring. 

## Details

## Severity

High Risk

## Description

The `click()` function in the `Multicall` contract does not verify that the received `msg.value` matches the calculated `price`, which is determined by calling `IQueuePlugin(plugin).getPrice() * amount`. This creates a vulnerability where users may send excessive ETH that gets locked in the contract when the plugin owner decreases the `entryFee`.

```solidity
function click(uint256 tokenId, uint256 amount, string calldata message) external payable returns (uint256 mintAmount) {
    uint256 price = IQueuePlugin(plugin).getPrice() * amount;
    IWBERA(base).deposit{value: price}();
    // No validation that msg.value == price
    IERC20(base).safeApprove(plugin, 0);
    IERC20(base).safeApprove(plugin, price);

    for (uint256 i = 0; i < amount; i++) {
        mintAmount += IQueuePlugin(plugin).click(tokenId, message);
    }
}
```

The plugin owner can modify the `entryFee` through the `setEntryFee()` function, which directly impacts the price calculation:

```solidity
function getPrice() external view returns (uint256) {
    return entryFee;
}
```

```solidity
function setEntryFee(uint256 _entryFee) external onlyOwner {
    entryFee = _entryFee;
    emit Plugin__EntryFeeSet(_entryFee);
}
```

## Location of Affected Code

File: [Multicall.sol](https://github.com/Heesho/bull-ish/blob/3b48a94280e1ddcc25f486735508a50c70a21741/contracts/Multicall.sol)

## Impact

Users may send excessive ETH that gets locked in the contract when the plugin owner decreases the `entryFee`.

## Proof of Concept

1. A user calculates the required payment based on the current `entryFee` (e.g., 1 ETH per click) and amount (e.g., 10 clicks), resulting in 10 ETH.
2. The user sends a transaction with 10 ETH as `msg.value` to call the `click` function.
3. Before the user's transaction is processed, the plugin owner reduces the `entryFee` from 1 ETH to 0.5 ETH.
4. When the user's transaction executes, the function calculates `price = 0.5 ETH * 10 = 5 ETH`.
5. Only 5 ETH is used in the `deposit` call, while the remaining 5 ETH is stuck in the contract with no mechanism to retrieve it.

## Recommendation

Check the relationship between `msg.value` and `price`. If there’s extra, return it to the user; if it’s not enough, revert.

## Team Response

Fixed.
