---
tags:
  - lang/solidity
  - platform/trailofbits
  - has/github
  - severity/high
  - sector/bridge
  - sector/stable
  - sector/token
protocol: "[[Meson]]"
auditors:
  - "[[Damilola Edwards]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/MesonProtocol.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[locked-funds]]"
  - "[[bridge-message-validation]]"
  - "[[cross-contract-state-consistency]]"
---
# USDT transfers to third-party contracts will fail

- id: 18109
- impact: HIGH
- protocol: [[Meson]] Protocol
- reporter: Damilola Edwards (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/MesonProtocol.pdf

## Summary


This bug report is about the Meson protocol, which is used to allow a user to release funds to a smart contract. The protocol increases the contract’s allowance and then calls the contract. However, some tokens, such as USDT, do not implement the increaseAllowance method, which is necessary for this process. As a result, any attempt to release USDT to a smart contract wallet during a swap will fail, trapping the user’s funds.

To address this issue in the short term, the protocol should use standard ERC20 methods to perform allowance increases. This implementation will be safe because the retrieval and incrementation of an allowance will happen atomically, preventing race conditions.

In the long term, it is recommended that tests are implemented for all features, especially those used to deposit and withdraw funds, create swaps, and release funds during swaps. Additionally, these tests should use exact copies of the on-chain token contracts and cover all combinations of supported chains and tokens.

## Details

## Diﬃculty: High

## Type: Cryptography

## Description
To allow a user to release funds to a smart contract, the Meson protocol increases the contract’s allowance (via a call to `increaseAllowance`) and then calls the contract, as shown in Figure 11.1.

```solidity
IERC20Minimal(token).increaseAllowance(contractAddr, adjustedAmount);
ITransferWithBeneficiary(contractAddr).transferWithBeneficiary(token, adjustedAmount, beneficiary, data);
```
*Figure 11.1: contracts/utils/MesonHelpers.sol#66–67*

The `increaseAllowance` method, which is part of OpenZeppelin’s ERC20 library, was introduced to prevent race conditions when token allowances are changed via top-level calls. However, this method is not in the ERC20 specification, and not all tokens implement it. In particular, USDT does not implement the method on the Ethereum mainnet. Thus, any attempt to release USDT to a smart contract wallet during a swap will fail, trapping the user’s funds.

## Exploit Scenario
Bob, a Meson protocol user, creates a swap from USDC to USDT on the Ethereum mainnet, using the third-party decentralized application (dApp) wallet feature. Bob then attempts to release the funds. However, because USDT does not implement the `increaseAllowance` function, the call fails, and Bob’s funds are trapped.

## Recommendations
Short term, use standard ERC20 methods to perform allowance increases, as shown in Figure 11.2.

```solidity
uint256 adjustedAmount = amount + IERC20Minimal(token).allowance(contractAddr);
IERC20Minimal(token).approve(contractAddr, adjustedAmount);
ITransferWithBeneficiary(contractAddr).transferWithBeneficiary(token, adjustedAmount, beneficiary, data);
```
*Figure 11.2: An example implementation of an allowance increase*

An implementation such as this one is safe because the retrieval and incrementation of an allowance happen atomically, preventing race conditions.

Long term, implement tests for all features, especially those used to deposit and withdraw funds, create swaps, and release funds during swaps. Additionally, ensure that these tests use exact copies of the on-chain token contracts and cover all combinations of supported chains and tokens. For example, test against a fork of the Ethereum mainnet rather than against a fresh network with a synthetic mock token.
