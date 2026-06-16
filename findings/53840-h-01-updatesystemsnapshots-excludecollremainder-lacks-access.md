---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/lending
  - platform/recon-audits
protocol: "[[Apollon Report]]"
auditors:
  - Alex The Entreprenerd
report: "https://github.com/solodit/solodit_content/blob/main/reports/Recon Audits/2025-03-22-Apollon_Report.md"
genome:
  - "[[access-roles]]"
  - "[[access-control/missing-auth]]"
  - "[[data-corruption/state-manipulation]]"
  - "[[known-pattern]]"
  - "[[single-tx]]"
  - "[[add-access-control]]"
  - "[[precondition/always]]"
  - "[[blast-radius/protocol-wide]]"
---
# [H-01] `updateSystemSnapshots_excludeCollRemainder` lacks access control

- id: 53840
- impact: HIGH
- protocol: Apollon Report
- reporter: Alex The Entreprenerd (Recon Audits)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Recon Audits/2025-03-22-Apollon_Report.md

## Summary


The bug report states that the function `updateSystemSnapshots_excludeCollRemainder` does not have proper access control, allowing for manipulation of stakes. This was discovered through invariant tests, which showed that no call should ever be successful. The bug can be fixed by adding a check to ensure that the caller is `LiquidationOperations`.

## Details

**Impact**

The function `updateSystemSnapshots_excludeCollRemainder` doesn't have access control meaning that stakes can be manipulated

I found this by running invariant tests, with the simple check that no call should ever succeed


```solidity
 => [call] CryticTester.troveManager_updateSystemSnapshots_excludeCollRemainder((address,uint256)[])([]) (addr=0xA647ff3c36cFab592509E13860ab8c4F28781a66, value=0, sender=0x0000000000000000000000000000000000030000)
         => [call] TroveManager.updateSystemSnapshots_excludeCollRemainder((address,uint256)[])([]) (addr=0x48E4F3f3daE11341ff2eDF60Af6857Ae08C871C5, value=0, sender=0xA647ff3c36cFab592509E13860ab8c4F28781a66)
                 => [event] SystemSnapshotsUpdated([], [])
                 => [return ()]
         => [event] Log("should never be possible")
         => [panic: assertion failed]
```

**Mitigation**

Add a check to ensure that the caller is LiquidationOperations
