---
tags:
  - lang/solidity
  - sector/lending
  - sector/staking
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - vuln/dos/griefing
  - vuln/reentrancy/single-function
  - fix/use-reentrancy-guard
  - novelty/known-pattern
  - misassumption/external-call-is-safe
  - trigger/reentrancy-callback
protocol: "[[USG]]"
auditors:
  - "[[0xAdwa]]"
  - "[[0xImmortan]]"
  - "[[0xRaz]]"
  - "[[0xRstStn]]"
  - "[[0xc0ffEE]]"
  - "[[0xd4ps]]"
  - "[[0xodus]]"
  - "[[0xxAristos]]"
  - "[[7]]"
  - "[[Artur]]"
  - "[[BADROBINX]]"
  - "[[Cybrid]]"
  - "[[HeckerTrieuTien]]"
  - "[[InquisitorScythe]]"
  - "[[JeRRy0422]]"
  - "[[Obsidian]]"
  - "[[Orhukl]]"
  - "[[Oxsadeeq]]"
  - "[[Pexy]]"
  - "[[Ratt13snak3]]"
  - "[[Sneks]]"
  - "[[Synthrax]]"
  - "[[Uddercover]]"
  - "[[X0sauce]]"
  - "[[Ziusz]]"
  - "[[air_0x]]"
  - "[[axelot]]"
  - "[[bam0x7]]"
  - "[[boredpukar]]"
  - "[[covey0x07]]"
  - "[[edger]]"
  - "[[gh0xt]]"
  - "[[gneiss]]"
  - "[[greekfreakxyz]]"
  - "[[illoy_sci]]"
  - "[[jayjoshix]]"
  - "[[lucky-gru]]"
  - "[[maigadoh]]"
  - "[[makarov]]"
  - "[[oxelmiguel]]"
  - "[[prosper]]"
  - "[[redtrama]]"
  - "[[sakibcy]]"
  - "[[sl1]]"
  - "[[theboiledcorn]]"
  - "[[tobi0x18]]"
  - "[[web3made]]"
  - "[[x15]]"
  - "[[xKeywordx]]"
  - "[[yaioxy]]"
report: "https://github.com/sherlock-audit/2025-08-usg-tangent-judging"
genome:
  - "[[griefing]]"
  - "[[single-function]]"
  - "[[use-reentrancy-guard]]"
  - "[[known-pattern]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
  - "[[account-ownership]]"
  - "[[bridge-sender-auth]]"
  - "[[dos-resistance]]"
  - "[[liquidation-underwater]]"
  - "[[reentrancy-guard]]"
  - "[[vote-delegation-loop]]"
---
# H-2: Caller supplied `ControlTower` lets anyone be the migrator

- id: 63046
- impact: HIGH
- protocol: [[USG]] - Tangent
- reporter: illoy\_sci (Sherlock)
- source: N/A

## Summary


This bug report is about a vulnerability found in a contract called the "2025-08-usg-tangent-judging" contract. The vulnerability was discovered by multiple individuals and can be exploited to drain a victim's collateral to an attacker's account. The root cause of this vulnerability is that the contract relies on a caller-provided parameter for role checks instead of using its own trusted state. This allows an attacker to pass a fake parameter and gain unauthorized access to the contract's functions. The impact of this vulnerability is significant as it can result in the loss of collateral and debt manipulation for multiple accounts. There are no specific conditions required for this attack to occur, making it a high-risk vulnerability. The report suggests implementing measures to prevent this type of exploit in the future.

## Details


Source: https://github.com/sherlock-audit/2025-08-usg-tangent-judging/issues/61 

## Found by 
0xAdwa, 0xImmortan, 0xRaz, 0xRstStn, 0xc0ffEE, 0xd4ps, 0xodus, 0xxAristos, 7, Artur, BADROBINX, Cybrid, HeckerTrieuTien, InquisitorScythe, JeRRy0422, Obsidian, Orhukl, Oxsadeeq, Pexy, Ratt13snak3, Sneks, Synthrax, Uddercover, X0sauce, Ziusz, air\_0x, axelot, bam0x7, boredpukar, covey0x07, edger, gh0xt, gneiss, greekfreakxyz, illoy\_sci, jayjoshix, lucky-gru, maigadoh, makarov, oxelmiguel, prosper, redtrama, sakibcy, sl1, theboiledcorn, tobi0x18, web3made, x15, xKeywordx, yaioxy

### Summary

The migration and reentrancy functions verify `isPositionMigrator(msg.sender)` against a caller-provided `IControlTower` parameter instead of the market’s trusted `controlTower` state. An attacker can pass a fake `ControlTower` that always returns true, then use `migrateFrom`/`migrateTo` to siphon a victim’s collateral to an attacker receiver, shove debt onto others, and grief by toggling the reentrancy lock

### Root Cause

The contract delegates the role check to a caller-supplied parameter instead of its own trusted state. In [_verifySenderMigrator](https://github.com/sherlock-audit/2025-08-usg-tangent/blob/main/tangent-contracts/src/USG/Market/abstract/MarketCore.sol#L594-L596), the authority being queried is the external argument `_controlTower`, which the caller controls

```solidity
// MarketCore.sol
function _verifySenderMigrator(IControlTower _controlTower) internal view {
    // @ Untrusted authority: the caller picks _controlTower
    require(_controlTower.isPositionMigrator(msg.sender), NotAMigratoor());
}
```
Entry points then accept that same `_controlTower` and pass it through

```solidity
// MarketExternalActions.sol (simplified)
function migrateFrom(
    IControlTower _controlTower,        // @ user-supplied
    address account,
    uint256 collatToRemove,
    uint256 debtToRemove,
    uint256 debtToRepay,
    address receiver
) external /* nonReentrant etc */ {
    _verifySenderMigrator(_controlTower);  // @ checks the untrusted param
    // ... proceeds with collateral/debt moves, eventually sending to `receiver`
}

function migrateTo(
    IControlTower _controlTower,        // @ user-supplied
    address account,
    uint256 collatToAdd,
    uint256 debtToAdd
) external {
    _verifySenderMigrator(_controlTower);  // @ same issue
    // ... mutates another account’s position
}

function reeantrancyOn(IControlTower _controlTower) external {
    _verifySenderMigrator(_controlTower);  // @ lets attacker flip lock
    // ... set lock = true
}
```

Conceptually, the market already has a trusted authority in storage

```solidity
IControlTower public controlTower; // @ canonical, trusted authority for roles
```

But the checks ignore it and instead trust whatever the external caller passes in.

### Internal Pre-conditions

-

### External Pre-conditions

-

### Attack Path

1. Attacker deploys `FakeControlTower` implementing `isPositionMigrator(address) → true`.
2. Calls `market.migrateFrom(fakeCT, victim, collatToRemove, debtToRemove, debtToRepay, receiver=attacker)`.
3. Function proceeds, reducing victim’s collateral (and optionally reshaping debt), ultimately transferring collateral out via the post‑hooks to receiver.
4. Optionally call `migrateTo(fakeCT, anotherVictim, collatToAdd, debtToAdd)` to push debt onto another account.

### Impact

Any caller can masquerade as an authorized migrator by passing a fake `IControlTower` that always approves them. That lets the attacker invoke `migrateFrom` to siphon a victim’s collateral to an attacker-controlled receiver, potentially draining positions entirely in a single transaction. 

Using `migrateTo`, the attacker can shove arbitrary debt onto other accounts, forcing liquidations, ruining health factors, and creating broad griefing/insolvency risk for the market. They can also flip the market’s reentrancy lock via `reeantrancyOn/Off` to disrupt other users’ actions during execution, enabling denial-of-service style griefing. 

There are no meaningful preconditions beyond deploying a permissive `ControlTower` and calling the functions, so the blast radius includes any account with collateral on any affected market.

### PoC

_No response_

### Mitigation

_No response_
