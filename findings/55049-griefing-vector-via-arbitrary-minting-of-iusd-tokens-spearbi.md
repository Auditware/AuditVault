---
tags:
  - lang/solidity
  - sector/governance
  - sector/staking
  - sector/token
  - platform/spearbit
  - has/github
  - severity/high
protocol: "[[InfiniFi Contracts]]"
auditors:
  - R0bert
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/InfiniFi-Spearbit-Security-Review-March-2025.pdf"
genome:
  - "[[dos-resistance]]"
  - "[[griefing]]"
  - "[[mev/frontrun]]"
  - "[[variant]]"
---
# Griefing vector via arbitrary minting of iUSD tokens

- id: 55049
- impact: HIGH
- protocol: infiniFi contracts
- reporter: R0bert (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/InfiniFi-Spearbit-Security-Review-March-2025.pdf

## Summary


The report highlights a security vulnerability in the `InfiniFiGatewayV1` contract, where anyone can mint iUSD receipt tokens to any address. This can disrupt user and contract operations, as well as interfere with voting mechanisms. The vulnerability lies in the `ReceiptToken` contract, which enforces action restrictions during token transfers. The recommendation is to either remove the ability to mint to other addresses or increase the cost of minting to make it less feasible for attackers. The issue has been fixed by removing the `ActionRestriction` feature from iUSD and siUSD tokens.

## Details

## Security Vulnerability Report

## Severity
**High Risk**

## Context
`MintController.sol#L99`

## Description
The mint function in the `InfiniFiGatewayV1` contract allows anyone to mint iUSD receipt tokens to an arbitrary address specified by the `_to` parameter. This functionality introduces a significant griefing vector that can disrupt user and contract operations within the system. Specifically, each call to mint triggers an external call to 

```solidity
ReceiptToken(receiptToken).restrictActionUntil(_to, block.timestamp + restrictionDuration);
```

which restricts the target address from performing certain actions, such as transferring receipt tokens, for a period defined by the `restrictionDuration` state variable. The `restrictionDuration` is currently set to a minimal value of 1, making the cost of repeatedly invoking this function extremely low.

This design enables an attacker to grief users and contracts by minting small amounts of iUSD to targeted addresses, thereby repeatedly extending their restriction periods. For users, this can block operations like `mintAndStake`, `mintAndLock`, and `createPosition` in the `InfiniFiGatewayV1` contract, as well as interfere with voting mechanisms. These operations can be front-run by an attacker calling 

```solidity
mint(<InfiniFiGatewayV1 address>, 1);
```

causing subsequent user transactions to fail if they involve restricted actions.

Additionally, this vulnerability impacts contracts that transfer iUSD, such as the `YieldSharing` contract. In the `accrue` function, if a positive yield is detected, `_handlePositiveYield` is called, which includes a transfer of receipt tokens to a performance fee recipient:

```solidity
ReceiptToken(receiptToken).transfer(performanceFeeRecipient, fee);
```

If an attacker mints iUSD to the `YieldSharing` contract address (e.g., via `mint(<YieldSharing address>, 1)`), the contract becomes restricted, and this transfer fails, effectively causing a temporary denial of service (DoS) for the `accrue` function. An attacker could front-run every accrue call with such a mint, delaying or blocking yield processing indefinitely.

The root of this issue lies in the `ReceiptToken` contract's `_update` function, which enforces action restrictions during token transfers:

```solidity
function _update(address _from, address _to, uint256 _value) internal override {
    if (_from != address(0) && _to != address(0)) {
        // check action restrictions if the transfer is not a burn nor a mint
        _checkActionRestriction(_from);
    }
    return ERC20._update(_from, _to, _value);
}
```

This function checks if the sender (`_from`) is restricted whenever a transfer occurs (excluding minting and burning). If restricted, the transfer reverts, halting any operation dependent on it. Since both `LockedPositionTokens` and `StakedTokens` inherit from `ActionRestriction`, they are similarly vulnerable if targeted by minting, potentially disrupting their respective functionalities.

In summary, the ability to mint iUSD to any address allows an attacker to impose repeated restrictions with minimal cost, denying users access to key operations and causing temporary DoS in contracts that rely on transferring iUSD.

## Recommendation
Consider removing the possibility of minting to other addresses and always mint directly to the caller. Alternatively, if minting to other addresses is a required feature, consider increasing the `minMintAmount` to a much higher value so the griefing vector is not feasible due to the increased costs. Finally, consider having a set of whitelisted addresses that will not suffer the transfer restriction constrain and add all the protocol addresses to this whitelist.

## Fixes
- **infiniFi**: Fixed in commit `e893df4` by removing `ActionRestriction` from iUSD and siUSD tokens.
- **Spearbit**: Fix verified.
