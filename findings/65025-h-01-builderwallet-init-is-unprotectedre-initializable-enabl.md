---
tags:
  - lang/solidity
  - sector/perpetuals
  - sector/token
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - vuln/pda/reinitialization
  - novelty/variant
  - misassumption/proxy-is-initialized
  - fix/initialize-proxy
protocol: "[[Panoptic]]"
auditors:
  - "[[dtang]]"
report: "https://code4rena.com/reports/2025-12-panoptic-next-core"
genome:
  - "[[reinitialization]]"
  - "[[variant]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
  - "[[initializer-auth]]"
  - "[[pda-derivation]]"
---
# [H-01] BuilderWallet `init()` is unprotected/re-initializable, enabling takeover and theft of builder fees

- id: 65025
- impact: HIGH
- protocol: [[Panoptic]]
- reporter: dtang (Code4rena)
- source: https://code4rena.com/reports/2025-12-panoptic-next-core

## Summary


The report highlights a bug in the `BuilderWallet` contract where the `init()` function does not have proper access control and can be called multiple times. This allows an attacker to overwrite the `builderAdmin` and then drain all ERC20 balances held by the contract. The impact of this bug is direct theft of all ERC20 balances held by any builder wallet, including protocol-distributed fees and shares. A proof of concept has been provided to demonstrate the exploit. The Panoptic team has confirmed the issue and implemented a mitigation to protect the `init()` function. 

## Details



In `BuilderWallet`, the admin is stored in `builderAdmin` but `init()` has no access control and no “only-once” guard:

* `BuilderWallet` definition: `RiskEngine.sol` [# L2307](https://github.com/code-423n4/2025-12-panoptic/blob/a4361d6d8dc6420c09187d80ea1a7ce851d1ca36/contracts/RiskEngine.sol# L2307)
* `init()` (unrestricted, overwrites `builderAdmin`): `RiskEngine.sol` [L2315](https://github.com/code-423n4/2025-12-panoptic/blob/a4361d6d8dc6420c09187d80ea1a7ce851d1ca36/contracts/RiskEngine.sol# L2315)
* `sweep()` (only gated by `builderAdmin`): `RiskEngine.sol` [L2319](https://github.com/code-423n4/2025-12-panoptic/blob/a4361d6d8dc6420c09187d80ea1a7ce851d1ca36/contracts/RiskEngine.sol# L2319)

Builder wallets are deployed by `BuilderFactory.deployBuilder(...)`, which calls `BuilderWallet(wallet).init(builderAdmin)` after CREATE2 deployment: `RiskEngine.sol` [L2371](https://github.com/code-423n4/2025-12-panoptic/blob/a4361d6d8dc6420c09187d80ea1a7ce851d1ca36/contracts/RiskEngine.sol# L2371)

Because `init()` remains callable after deployment, any attacker can overwrite `builderAdmin` and then legitimately pass the `sweep()` authorization check.

### Exploit Steps

1. Builder wallet is deployed via `deployBuilder(...)`: `RiskEngine.sol` [L2371](https://github.com/code-423n4/2025-12-panoptic/blob/a4361d6d8dc6420c09187d80ea1a7ce851d1ca36/contracts/RiskEngine.sol# L2371)
2. Builder wallet accumulates ERC20 balances (fees/tokens).
3. Attacker calls `BuilderWallet.init(attacker)` to overwrite `builderAdmin`: `RiskEngine.sol`[L2315](https://github.com/code-423n4/2025-12-panoptic/blob/a4361d6d8dc6420c09187d80ea1a7ce851d1ca36/contracts/RiskEngine.sol# L2315)
4. Attacker calls `BuilderWallet.sweep(token, attacker)` to drain balances: `RiskEngine.sol` [L2319](https://github.com/code-423n4/2025-12-panoptic/blob/a4361d6d8dc6420c09187d80ea1a7ce851d1ca36/contracts/RiskEngine.sol# L2319)

### Impact

Direct theft of all ERC20 balances held by any builder wallet (including protocol-distributed fees/shares).

### Proof of Concept (minimal, runnable Foundry test)

[View detailed Proof of Concept](https://code4rena.com/audits/2025-12-panoptic-next-core/submissions/S-16)

**[Panoptic mitigated](https://github.com/code-423n4/2026-02-panoptic-next-core-mitigation?tab=readme-ov-file# mitigation-of-high--medium-severity-issues):**

> Protect `builderWallet.init`.

**Status:** Mitigation confirmed. Full details in reports from [Valves](https://code4rena.com/audits/2026-02-panoptic-next-core-mitigation-review/submissions/S-3), [edoscoba](https://code4rena.com/audits/2026-02-panoptic-next-core-mitigation-review/submissions/S-18), and [Nyx](https://code4rena.com/audits/2026-02-panoptic-next-core-mitigation-review/submissions/S-29).

---
