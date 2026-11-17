---
tags:
  - checklist
  - web3-sector/account
generated: true
---
# Account — Audit Checklist

> Auto-generated from **51** findings in this sector (**16** with bug-class tags), ranked by frequency.
> Regenerate with `node vault-admin/crawler/gen_sector_checklists.js`. Do not edit by hand.

## ⚠️ Top vulnerability classes
What actually goes wrong in this sector, most common first. Tick each as you rule it out.

- [ ] **Bridge: Replay** — 4 findings `vuln/bridge/replay`
- [ ] **Reentrancy: Single Function** — 3 findings `vuln/reentrancy/single-function`
- [ ] **Dos: Frozen Funds** — 2 findings `vuln/dos/frozen-funds`
- [ ] **Access Control: Missing Signer** — 2 findings `vuln/access-control/missing-signer`
- [ ] **Dos: Griefing** — 2 findings `vuln/dos/griefing`
- [ ] **Dependency: Upgradeable Contract** — 1 finding `vuln/dependency/upgradeable-contract`
- [ ] **Access Control: Uninitialized Owner** — 1 finding `vuln/access-control/uninitialized-owner`
- [ ] **Arithmetic: Underflow** — 1 finding `vuln/arithmetic/underflow`
- [ ] **Dos: Init Constraint** — 1 finding `vuln/dos/init-constraint`
- [ ] **Access Control: Missing Modifier** — 1 finding `vuln/access-control/missing-modifier`

## 🎯 Common triggers
The conditions attackers use to set these bugs off — check each path is constrained.

- [ ] `trigger/reentrancy-callback` — 3
- [ ] `trigger/cross-chain-message` — 3
- [ ] `trigger/first-deposit` — 1
- [ ] `trigger/sandwich-attack` — 1

## 💥 Typical impact
Where it hurts when these bugs land.

- `impact/loss-of-funds/direct-drain` — 7
- `impact/mev/frontrun` — 6
- `impact/loss-of-funds/locked-funds` — 4
- `impact/privilege-escalation/ownership-transfer` — 1
- `impact/mev/sandwich` — 1

## 🛠️ Recommended mitigations
The fixes auditors most often recommended in this sector.

- `fix/use-reentrancy-guard` — 5
- `fix/add-access-control` — 4
- `fix/add-nonce` — 3
- `fix/upgrade-dependency` — 1
- `fix/fix-arithmetic` — 1
- `fix/add-check` — 1

## 📚 Study these findings

- [[19278-bls-rogue-key-attack-allows-executing-arbitrary-transactions|BLS Rogue Key Attack Allows Executing Arbitrary Transactions]] — `vuln/reentrancy/single-function`
- [[19279-operations-are-vulnerable-to-signature-replay-via-reentrancy|Operations Are Vulnerable To Signature Replay Via Reentrancy]] — `vuln/reentrancy/single-function`
- [[19280-ownership-of-proxyadmin-may-be-transferred-to-any-wallet-sig|Ownership of ProxyAdmin May Be Transferred To Any Wallet]] — `vuln/dependency/upgradeable-contract`
- [[28036-destruction-of-the-ensowallet-implementation-contract-mixbyt|Destruction of the EnsoWallet implementation contract]] — `vuln/dos/frozen-funds`
- [[30496-dos-of-an-account-using-frontrun-mixbytes-none-kinto-markdow|DoS of an account using frontrun]] — `vuln/access-control/uninitialized-owner`
- [[30498-incorrect-signature-validation-for-different-signer-policies|Incorrect signature validation for different signer policies]] — `vuln/access-control/missing-signer`
- [[40196-permissions-can-drain-approvals-given-to-certain-paymasters|Permissions can drain approvals given to certain paymasters]] — `vuln/access-control/missing-signer`
- [[42067-installation-reentrancy-concerns-cantina-none-biconomy-pdf|Installation reentrancy concerns]] — `vuln/reentrancy/single-function`
