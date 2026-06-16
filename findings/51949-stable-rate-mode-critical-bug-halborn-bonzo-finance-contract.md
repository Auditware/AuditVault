---
tags:
  - lang/solidity
  - severity/high
  - platform/halborn
  - sector/governance
  - sector/lending
protocol: "[[Bonzo Finance]]"
auditors:
  - "[[Halborn]]"
report: "https://www.halborn.com/audits/bonzo/finance-contracts"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# Stable Rate Mode Critical Bug

- id: 51949
- impact: HIGH
- protocol: Finance Contracts
- reporter: Halborn
- source: https://www.halborn.com/audits/bonzo/finance-contracts

## Summary


The report is about a bug that was found on November 4, 2023 related to the stable borrow rate in Aave v2 and v3. This bug affects certain assets and poses a significant risk. To fix it, the stable rate mode was fully deprecated, meaning new borrowings in stable mode were stopped and rebalancing from variable to stable was halted. The Aave DAO is recommended to update the `swapBorrowRateMode` function in the Aave Pool smart contract to allow any address to trigger the rate swap, which will move all current stable debt positions to variable without penalizing users. Once this is done, the stable rate mode can be fully deprecated. The bug has been solved by the Bonzo team. 

## Details

##### Description

A critical bug related to the stable borrow rate was reported on November 4, 2023. This bug affects certain assets due to their configuration and poses a significant risk. Given the nature of the bug and the progressive deprecation of the stable rate in Aave v2 and v3, it was decided to fully deprecate the stable rate mode. The fix involved halting new borrowings in stable mode, as well as stopping rebalancing and swapping from variable to stable. Although we are confident that there is no further vector for the bug, the current situation creates significant technical overhead and complicates security evaluations. Furthermore, disclosing the attack vector is not safe until all user stable debt positions are closed.

<https://governance.aave.com/t/bgd-full-deprecation-of-stable-rate/16473>

##### BVSS

[AO:A/AC:L/AX:L/C:N/I:C/A:N/D:N/Y:N/R:N/S:U (10.0)](/bvss?q=AO:A/AC:L/AX:L/C:N/I:C/A:N/D:N/Y:N/R:N/S:U)

##### Recommendation

To mitigate this issue, it is recommended to update the `swapBorrowRateMode` function in the Aave Pool smart contract on both Aave v2 and v3 to make the swap from stable to variable rate permission-less. This will allow any address to trigger the rate swap, enabling the Aave DAO to automate the process of moving all current stable debt positions to variable without penalizing users. Once all positions are in variable mode, the stable rate mode can be fully deprecated.

###

##### Remediation

**SOLVED:** The suggestion was applied by the **Bonzo team**.

##### Remediation Hash

660ee467156ad3078e0d61e07e347a920eb1d621
