---
tags:
  - platform/halborn
  - has/github
  - lang/solidity
  - severity/high
  - sector/infra
protocol: "[[AppChain Modules]]"
auditors:
  - "[[Halborn]]"
report: "https://www.halborn.com/audits/emoney/appchain-modules"
genome:
  - "[[upgradeable-contract]]"
  - "[[permanent]]"
  - "[[upgrade-safety]]"
---
# Improper Implementation of Cosmos SDK Upgrade Procedures

- id: 52147
- impact: HIGH
- protocol: [[AppChain Modules]]
- reporter: Halborn
- source: https://www.halborn.com/audits/emoney/appchain-modules

## Summary


The Scallop Bank chain has a problem with its regulation module not following the recommended upgrade procedures for the Cosmos SDK. The module's ConsensusVersion() method is not properly managed and could cause issues during upgrades. This is because the method returns a hard-coded value and there are no upgrade handlers or migration scripts in place. The module also does not track or update its version based on changes or upgrades. To fix this, the EMoney team needs to implement upgrade handlers for each version change and ensure they perform necessary state migrations. The team has accepted the risk of this issue. The code reference for this bug can be found on the EMoneyChain GitHub repository.

## Details

##### Description

The regulation module in the Scallop Bank chain does not fully adhere to the Cosmos SDK upgrade procedures. Specifically, the module's ConsensusVersion() method is static and does not reflect proper version management as recommended by Cosmos SDK. This could lead to issues during chain upgrades and may prevent proper execution of upgrade handlers.

Key observations:

1. The ConsensusVersion() method returns a hard-coded value of 2:

```
   func (AppModule) ConsensusVersion() uint64 { return 2 }
```

2. There's no implementation of upgrade handlers or migration scripts.

3. The module doesn't seem to track or update its version based on changes or upgrades.

##### BVSS

[AO:A/AC:L/AX:L/C:N/I:M/A:M/D:N/Y:N/R:N/S:C (7.8)](/bvss?q=AO:A/AC:L/AX:L/C:N/I:M/A:M/D:N/Y:N/R:N/S:C)

##### Recommendation

Implement upgrade handlers:

- Create upgrade handlers for each version change.

- Ensure these handlers perform necessary state migrations.

  

### Remediation Plan

**RISK ACCEPTED:** The **Emoney team** accepted the risk of the issue.

##### References

[EMoney-Network/EMoneyChain/tree/872703eaad7051654bf13265516732850afd5aac](https://github.com/EMoney-Network/EMoneyChain/tree/872703eaad7051654bf13265516732850afd5aac/x/regulation)
