---
tags:
  - lang/solidity
  - sector/staking
  - platform/quantstamp
  - severity/high
protocol: "[[Sapien]]"
auditors:
  - Paul Clemson
report: "https://certificate.quantstamp.com/full/sapien/ffb7e698-6178-46f0-8df8-52e537af70c0/index.html"
genome:
  - "[[signature-malleability]]"
  - "[[replay]]"
  - "[[variant]]"
  - "[[bridge-is-secure]]"
  - "[[signature-is-unique]]"
  - "[[add-nonce]]"
  - "[[cross-chain-message]]"
---
# Signature Replay Attack Possible Between Stake, Unstake and Reward Functions Enabling Unauthorized Token Claims

- id: 62036
- impact: HIGH
- protocol: Sapien
- reporter: Paul Clemson (Quantstamp)
- source: https://certificate.quantstamp.com/full/sapien/ffb7e698-6178-46f0-8df8-52e537af70c0/index.html

## Summary


This bug report is about a vulnerability found in the SapienRewards and SapienStaking contracts. These contracts have a function called "verifyOrder()" which uses the same signature format and validation logic. This allows an attacker to reuse signatures across different contract functions, allowing them to claim unauthorized rewards and drain tokens. The report also includes an exploit scenario where an attacker could use a signature meant for staking to claim rewards. The recommendation is to implement a fix called EIP-712 typed structured data signing and to track used orders to prevent replay attacks.

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `fa79159`.

![Image 30: Alert icon](https://certificate.quantstamp.com/full/sapien/ffb7e698-6178-46f0-8df8-52e537af70c0/static/media/success-icon-alert.4e26c8d3b65fdf9f4f0789a4086052ba.svg)

**Update**
Marked as "Fixed" by the client. Addressed in: `4ba050c5db3fe00d6c39cad790a6d95834e2a624`. The client provided the following explanation:

> The vulnerability was fixed by implementing EIP-712 typed structured data signing in both contracts.

![Image 31: Alert icon](https://certificate.quantstamp.com/full/sapien/ffb7e698-6178-46f0-8df8-52e537af70c0/static/media/success-icon-alert.4e26c8d3b65fdf9f4f0789a4086052ba.svg)

**Update**
Marked as "Fixed" by the client. Addressed in: `4ba050c5db3fe00d6c39cad790a6d95834e2a624`. The client provided the following explanation:

> The vulnerability was fixed by implementing EIP-712 typed structured data signing in both contracts.

**File(s) affected:**`SapienStaking.sol`, `Rewards.sol`

**Description:** A critical signature replay vulnerability exists in the `SapienRewards` and `SapienStaking` contracts. The `verifyOrder()` function in both contracts uses the same signature format and validation logic:

```
bytes32 messageHash = keccak256(abi.encodePacked(userWallet, rewardAmount, orderId));
```

This allows signatures to be reused across different contract functions. Specifically:

1.   A signature generated for staking tokens can be replayed to claim rewards in the `SapienRewards` contract
2.   The same signature can also be replayed multiple times for staking and unstaking within `SapienStaking`

This means an attacker who obtains a valid signature meant for staking could:

*   Use it to claim unauthorized rewards from `SapienRewards`
*   Drain tokens through repeated unstaking operations (see [SAP-1](https://certificate.quantstamp.com/full/sapien/ffb7e698-6178-46f0-8df8-52e537af70c0/index.html#findings-qs1))
*   Accidentally overwrite existing staking positions, causing themselves to lose their staked tokens

The vulnerability allows:

*   Unauthorized claiming of rewards using stake signatures
*   Multiple drains of the same stake amount
*   Overwriting of legitimate user stakes

**Exploit Scenario:**

 Attacker claims to want to stake 1000 tokens and requests a signed order:

*   userWallet: attacker address
*   amount: 1000 tokens 
*   orderId: "ORDER_1000_1"
*   signature: signed by sapienAddress for staking

1.   Other than claimed the attacker use the signature in SapienRewards: claimReward(1000, "ORDER_1000_1", signature)

2.   The transaction succeeds because:

    *   msg.sender matches the userWallet in the signature
    *   The amount matches
    *   The orderId hasn't been used in SapienRewards
    *   The signature verification passes since it contains the same parameters

3.   Result: Attacker claims 1000 tokens in rewards using a signature that was only intended for staking

**Recommendation:** 1. Implement EIP-712 typed structured data signing-

1.   Track used orders to prevent replay.

This fix should be implemented in both contracts to prevent cross-contract and cross-function replay attacks.
