---
tags:
  - lang/solidity
  - sector/nft
  - sector/staking
  - sector/token
  - platform/consensys
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Geodefi]]"
auditors:
  - "[[Sergii Kravchenko]]"
report: "https://consensys.net/diligence/audits/2022/11/geodefi/"
genome:
  - "[[missing-modifier]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
  - "[[reward-accounting]]"
---
# New interfaces can add malicious code without any delay or check

- id: 20750
- impact: HIGH
- protocol: [[Geodefi]]
- reporter: Sergii Kravchenko (ConsenSys)
- source: https://consensys.net/diligence/audits/2022/11/geodefi/

## Summary


A bug was found in the Geode Finance system, which uses an ERC1155 gETH contract with planet id acting as a token id. The bug is that planet maintainers can whitelist new interfaces without needing approval, which could allow them to steal all derivative tokens in circulation in one transaction. To fix the issue, the code/contracts/Portal/utils/StakeUtilsLib.sol should be updated to have the avoidance be set on a per-interface basis and avoiding new interfaces by default. This way, users would need to allow the new tokens to access the balances.

## Details

#### Description


Geode Finance uses an interesting system of contracts for each individual staked ETH derivative. At the base of it all is an ERC1155 gETH contract where planet id acts as a token id. To make it more compatible with the rest of DeFi the Geode team pairs it up with an ERC20 contract that users would normally interact with and where all the allowances are stored. Naturally, since the balances are stored in the gETH contract, ERC20 interfaces need to ask gETH contract to update the balance. It is done in a way where the gETH contract will perform any transfer requested by the interface since the interface is expected to do all the checks and accountings. The issue comes with the fact that planet maintainers can whitelist new interfaces and that process does not require any approval. Planet maintainers could whitelist an interface that will send all the available tokens to the maintainer’s wallet for example. This essentially allows Planet maintainers to steal all derivative tokens in circulation in one transaction.


#### Examples


**code/contracts/Portal/utils/StakeUtilsLib.sol:L165-L173**



```
function setInterface(
 StakePool storage self,
 DataStoreUtils.DataStore storage DATASTORE,
 uint256 id,
 address \_interface
) external {
 DATASTORE.authenticate(id, true, [false, true, true]);
 \_setInterface(self, DATASTORE, id, \_interface);
}

```
#### Recommendation


`gETH.sol` contract has a concept of avoiders. One of the ways to fix this issue is to have the avoidance be set on a per-interface basis and avoiding new interfaces by default. This way users will need to allow the new tokens to access the balances.
