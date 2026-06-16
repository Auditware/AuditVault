---
tags:
  - lang/solidity
  - sector/dex
  - sector/governance
  - sector/staking
  - sector/token
  - platform/consensys
  - has/github
  - severity/high
  - vuln/access-control/missing-modifier
  - vuln/reentrancy/single-function
  - impact/loss-of-funds/direct-drain
  - fix/use-reentrancy-guard
  - novelty/known-pattern
  - misassumption/admin-is-honest
  - misassumption/external-call-is-safe
  - fix/add-access-control
  - trigger/reentrancy-callback
protocol: "[[Skale Token]]"
auditors:
  - "[[Sergii Kravchenko]]"
report: "https://consensys.net/diligence/audits/2020/01/skale-token/"
genome:
  - "[[missing-modifier]]"
  - "[[single-function]]"
  - "[[direct-drain]]"
  - "[[use-reentrancy-guard]]"
  - "[[known-pattern]]"
  - "[[access-roles]]"
  - "[[reentrancy-guard]]"
  - "[[vote-delegation-loop]]"
---
# ERC-777 callback issue ✓ Partially fixed

- id: 13830
- impact: HIGH
- protocol: [[Skale Token]]
- reporter: Sergii Kravchenko (ConsenSys)
- source: https://consensys.net/diligence/audits/2020/01/skale-token/

## Summary


This bug report focuses on the potential for re-entrancy attacks when using ERC-777 tokens. Re-entrancy is an attack where malicious actors can access code multiple times, allowing them to exploit the code and steal funds. In order to protect against this, reentrancyGaurd was added to the token contract's `transfer()` and `transferFrom()` functions. However, other functions such as `burn()` and `send` may still contain reentrancy bugs. Additionally, even if all the functions in the token contract have re-entrancy protection, some projects might still be vulnerable to re-entrancy attacks that use callbacks of ERC-777. 

In order to address this, the `nonReentrant` modifier was added to the callbacks `_callTokensToSend` and `_callTokensReceived`. This ensures that it is impossible to make balance changes inside of the callbacks, as any new balance change will trigger a callback. 

However, this issue is still unresolved as it is still potentially possible to do re-entrancy from the `_getAndUpdateLockedAmount` function call, if the corresponding contract is upgraded in a specific way. To fix this issue, the upgrade capability for \_getAndUpdateLockedAmount() needs to be revoked by SKALE network governance. 

As a recommendation, it is suggested to use ERC-20 standard or remove callback function calls and replace them with a standard ERC-20 flow. This will ensure that code is not vulnerable to re-entrancy attacks.

## Details

#### Resolution



reentrancyGaurd was added in [SKALE-2153](https://github.com/skalenetwork/skale-manager/pull/110/files) to `transfer()` and `transferFrom()`. However other functions are still may contain reentrancy bug, such as `burn()`, `send`, etc.
Even if all the functions in the token contract (even `view` functions like `balanceOf`) have re-entrancy protection, some projects might be still potentially vulnerable to re-entrancy attacks that use callbacks of ERC-777.


**UPDATE**: in [skalenetwork/skale-manager#128](https://github.com/skalenetwork/skale-manager/pull/128) `nonReentrant` modifier is now only added to callbacks: `_callTokensToSend`  and `_callTokensReceived`. So far it’s impossible to make balance changes inside of the callbacks because any new balance change also triggers a callback. Therefore, it addresses the issue of re-entrancy by a malicious outside party (non-SKALE). Note since SKALE network retains upgrade capacity of smart contracts. Therefore, it’s potentially possible to do re-entrancy from the `_getAndUpdateLockedAmount` function call, if the corresponding contract is upgraded in a specific way.


This report raises this as an **unfixed minor issue**. This issue will be fixed if the upgrade capability for \_getAndUpdateLockedAmount() is revoked by SKALE network governance in the future.




#### Description


ERC-777 token comes with callback functions to the receiver and the sender on every token transfer. This gives re-entrancy opportunities for everyone who’s using this token. There is a chance that other systems might not handle ERC-777 correctly.


#### Examples


Uniswap reentrancy critical bug: <https://medium.com/consensys-diligence/uniswap-audit-b90335ac007>


#### Recommendation


Use ERC-20 standard or remove callback function calls.


Remove callback function usage from the system and replace them with a standard ERC-20 flow:


**code/contracts/delegation/SkaleBalances.sol:L55-L68**



```
function tokensReceived(
    address operator,
    address from,
    address to,
    uint256 amount,
    bytes calldata userData,
    bytes calldata operatorData
)
    external
    allow("SkaleToken")
{
    address recipient = abi.decode(userData, (address));
    stashBalance(recipient, amount);
}

```
**code/contracts/delegation/DelegationService.sol:L275-L289**



```
function tokensReceived(
    address operator,
    address from,
    address to,
    uint256 amount,
    bytes calldata userData,
    bytes calldata operatorData
)
    external
    allow("SkaleToken")
{
    require(userData.length == 32, "Data length is incorrect");
    uint validatorId = abi.decode(userData, (uint));
    distributeBounty(amount, validatorId);
}

```
