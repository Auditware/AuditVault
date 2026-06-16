---
tags:
  - lang/solidity
  - platform/mixbytes
  - has/github
  - severity/high
  - sector/oracle
protocol: "[[P2P.Org]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/P2P.org/SSV%20Integration/README.md#1-depositethandregistervalidators-allows-unauthorized-users-to-drain-the-ssvtoken-balance"
genome:
  - "[[missing-modifier]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
---
# `depositEthAndRegisterValidators()` allows unauthorized users to drain the `SsvToken` balance

- id: 29417
- impact: HIGH
- protocol: [[P2P.Org]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/P2P.org/SSV%20Integration/README.md#1-depositethandregistervalidators-allows-unauthorized-users-to-drain-the-ssvtoken-balance

## Summary


This bug report is about a vulnerability in the `depositEthAndRegisterValidators` function of the `P2pSsvProxyFactory` contract. This function allows users to transfer any amount of `SsvToken` to the newly created `SsvCluster` in the `SsvNetwork`. The issue is that the `SsvPayload.tokenAmount` parameter has no restrictions, allowing users to drain the entire `SsvToken` balance by depositing 32 ETH. This can be recovered through a multi-step process, but the attacker still has control over their deposit and can withdraw it. This vulnerability is classified as `high` severity as it can block deposits from subsequent clients until the owner intervenes. To prevent this, it is recommended to limit the maximum value of `SSVToken` tokens transferred to a reasonable amount to enhance the system's security.

## Details

##### Description
This issue has been identified in the [`depositEthAndRegisterValidators`](https://github.com/p2p-org/p2p-ssv-proxy/blob/9dd4728002d9c275e29e8ba38bcf7d90efc7531b/src/p2pSsvProxyFactory/P2pSsvProxyFactory.sol#L421C26-L433) function of the `P2pSsvProxyFactory` contract.
This function permits transferring any specified amount of `SsvToken` to the newly created `SsvCluster` in the `SsvNetwork`. The issue arises from the lack of restrictions on the `SsvPayload.tokenAmount` parameter, enabling users to drain the entire `SsvToken` balance by depositing `32 ETH`. Consequently, these tokens can only be recovered through a multi-step process where the owner has to [withdraw](https://github.com/p2p-org/p2p-ssv-proxy/blob/9dd4728002d9c275e29e8ba38bcf7d90efc7531b/src/p2pSsvProxy/P2pSsvProxy.sol#L290) the total amount from the `SsvCluster` and then [transfer](https://github.com/p2p-org/p2p-ssv-proxy/blob/9dd4728002d9c275e29e8ba38bcf7d90efc7531b/src/p2pSsvProxy/P2pSsvProxy.sol#L306) it from the corresponding `P2pSsvProxy` back to `P2pSsvProxyFactory`. Moreover, the attacker retains control over their deposit and can withdraw it using their specified `withdrawCredentials`. 
This vulnerability is classified as `high` severity due to its potential to block deposits from subsequent clients until the owner intervenes.

##### Recommendation
We recommend limiting the maximum value of `SSVToken` tokens transferred to a reasonable amount to prevent system block due to actions of unprivileged users and to enhance the system's overall security.
