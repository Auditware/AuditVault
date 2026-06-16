---
tags:
  - lang/solidity
  - platform/spearbit
  - has/github
  - severity/high
  - sector/account
protocol: "[[Buck Labs]]"
auditors:
  - "[[R0bert]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Buck-Labs-Spearbit-Security-Review-January-2026.pdf"
genome:
  - "[[upgradeable-contract]]"
  - "[[permanent]]"
  - "[[upgrade-safety]]"
---
# RewardsEngine V1.1 missing distribute

- id: 64790
- impact: HIGH
- protocol: [[Buck Labs]]
- reporter: R0bert (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Buck-Labs-Spearbit-Security-Review-January-2026.pdf

## Summary


The report states that there is a high-risk bug in the upgrade procedure for the RewardsEngine proxy. The provided implementation for V1.1 does not inherit all the necessary functions from the V1 implementation, causing issues with the migration process. This could result in the rewards distribution step being blocked and the need for a rollback or another upgrade deployment. The recommendation is to ensure that the V1.1 implementation includes all necessary functions and to test the upgrade process before deploying it in production. The bug has been fixed in the latest commit by Buck Labs and verified by Cantina Managed.

## Details

## Severity: High Risk

## Context
- File: [buckUpgradeProcedure.md](buckUpgradeProcedure.md#L309-L315)
- File: [RewardsEngineV1_1.sol](RewardsEngineV1_1.sol#L58-L64)

## Description
The upgrade procedure requires calling `distribute` after upgrading the RewardsEngine proxy to V1.1. The provided `RewardsEngineV1_1` implementation is a standalone contract that only adds `claimFor` and `batchClaimFor` and does not inherit from the V1 implementation. 

As a result, core V1 entrypoints like `distribute` and epoch configuration are not present in this implementation. If this implementation is used for the UUPS upgrade, calls expected by the migration runbook will revert because the function selectors are missing. That would block the rewards distribution step and leave the migration sequence in a broken state, forcing a rollback or another upgrade deployment to restore the missing interface.

```bash
cast send $REWARDS_ENGINE_PROXY "distribute(uint256)" \
$COUPON_USDC \
--from $DISTRIBUTOR_WALLET
```

```solidity
contract RewardsEngineV1_1 is
    Initializable,
    AccessControlUpgradeable,
    PausableUpgradeable,
    MulticallUpgradeable,
    UUPSUpgradeable
{
    // NEW V1.1: Batch Claim Functions
    function claimFor(address user, address recipient)
        external
        onlyClaimAdmin
        returns (uint256 amount)
    { ... }

    function batchClaimFor(address[] calldata users)
        external
        onlyClaimAdmin
        returns (uint256 totalClaimed)
    { ... }
}
```

## Recommendation
Ensure the V1.1 implementation is a strict superset of the V1 interface. The safest pattern is to inherit the full V1 implementation and add only the new batch claim functionality. Re-run a fork test that upgrades the proxy and executes the exact runbook sequence, including `distribute` and `batchClaimFor`, before any production upgrade.

## Buck Labs
Fixed in commit `22968a5`.

## Cantina Managed
Fix verified. `RewardsEngineV1_1` is now a strict superset of V1 and includes `distribute` and full V1 entrypoints.
