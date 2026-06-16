---
tags:
  - lang/solidity
  - sector/bridge
  - has/github
  - severity/high
protocol: "[[Across]]"
auditors:
  - OpenZeppelin
report: "https://blog.openzeppelin.com/across-audit"
genome:
  - "[[dos-resistance]]"
  - "[[cross-protocol]]"
---
# Forwarder and Withdrawal Helper Contracts Do Not Handle ETH Transfers Correctly

- id: 56760
- impact: HIGH
- protocol: Across Audit
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/across-audit

## Summary


This bug report discusses an issue with the `WithdrawalHelperBase` and `ForwarderBase` contracts that are used to transfer tokens and messages between different blockchain layers. These contracts are not able to handle ETH transfers correctly because they do not have a `receive` function. This means that any attempts to transfer ETH to these contracts will fail. This can cause problems when trying to transfer WETH or bridged ETH to other chains. The suggested solution is to add a `receive` function to these contracts to properly handle incoming ETH transfers and allow for the unwrapping of WETH tokens during bridging. This issue has been resolved in a recent update by adding the `receive` function to these contracts. 

## Details

The [`WithdrawalHelperBase`](https://github.com/across-protocol/contracts/blob/5a0c67c984d19a3bb843a4cec9bb081734583dd1/contracts/chain-adapters/l2/WithdrawalHelperBase.sol#L18) and [`ForwarderBase`](https://github.com/across-protocol/contracts/blob/5a0c67c984d19a3bb843a4cec9bb081734583dd1/contracts/chain-adapters/ForwarderBase.sol#L18) contracts are designed to be deployed on L2s and assist in moving tokens and messages to and from L3 chains. These contracts are inherited by the chain-specific contracts, currently designed for Arbitrum and OVM-based blockchains. However, none of these contracts handle ETH transfers correctly. This is because they do not contain the `receive` function, which causes any attempt to transfer ETH to these contracts to fail.

In the case of forwarder contracts, the lack of the `receive` function means that WETH transfers, which rely on unwrapping before bridging such as [the transfers made through the `Optimism_Adapter`](https://github.com/across-protocol/contracts/blob/5a0c67c984d19a3bb843a4cec9bb081734583dd1/contracts/chain-adapters/Optimism_Adapter.sol#L101-L105), will fail, leaving the ETH in the bridge until the contract can be upgraded. In the case of withdrawal helper contracts, the lack of the `receive` function implies that they will not be capable of unwrapping WETH [in an attempt to transfer it to Ethereum](https://github.com/across-protocol/contracts/blob/5a0c67c984d19a3bb843a4cec9bb081734583dd1/contracts/chain-adapters/l2/Ovm_WithdrawalHelper.sol#L114-L124). Additionally, they will not be capable of receiving ETH bridged from L3s. Moreover, while the withdrawal helper contracts contain [token-bridging logic](https://github.com/across-protocol/contracts/blob/5a0c67c984d19a3bb843a4cec9bb081734583dd1/contracts/chain-adapters/l2/WithdrawalHelperBase.sol#L87-L101), they do not support bridging ETH. This means that even if they were capable of receiving ETH and ETH was bridged to them from L3s, it could not be routed to L1.

Consider adding a `receive` function to the `ForwarderBase` and `WithdrawalHelperBase` contracts to facilitate incoming ETH transfers and the unwrapping of WETH tokens during bridging. As the contracts do not support bridging ETH directly, the `receive` function should include logic to ensure that incoming ETH is handled correctly and can be sent on to the target chain.

***Update:** Resolved in [pull request #725](https://github.com/across-protocol/contracts/pull/725), at commit [705a276](https://github.com/across-protocol/contracts/pull/725/commits/705a2765af7b052c1268c9e6843579df2ac35659) by adding the `receive` function to forwarder and withdrawal helper contracts. Moreover, both contracts allow to transfer ETH out of them by wrapping it in case when WETH transfer is requested. The team stated:*

> *We went with this approach so that we can keep the same format as our L1 adapters for L2-L3 bridging, and as our L2 spoke pools for L2-L1 withdrawals.*
