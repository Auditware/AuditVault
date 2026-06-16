---
tags:
  - lang/solidity
  - platform/trailofbits
  - has/github
  - has/poc
  - severity/high
  - sector/nft
protocol: "[[FIVA Yield Tokenization Protocol]]"
auditors:
  - Tarun Bansal
report: "https://github.com/trailofbits/publications/blob/master/reviews/2025-05-FIVA-yieldtokenizationprotocol-securityreview.pdf"
genome:
  - "[[upgrade-safety]]"
  - "[[variant]]"
---
# Lack of validation checks in the upgrade_storage operation handler

- id: 57082
- impact: HIGH
- protocol: FIVA Yield Tokenization Protocol
- reporter: Tarun Bansal (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2025-05-FIVA-yieldtokenizationprotocol-securityreview.pdf

## Summary


This bug report discusses a problem with the `upgrade_storage` operation in the SYMinter contract. This operation does not properly check the data that is being saved, which can result in a malformed data cell being stored. This can cause the contract to become unusable, as all user actions will result in an exception. The issue also affects several other contracts. The report recommends implementing a validation check in the operation handler to prevent this issue, and also suggests identifying and documenting all possible actions that privileged accounts can take to prevent similar mistakes in the future.

## Details

## Diﬃculty: Medium

## Type: Denial of Service

## Description
The `upgrade_storage` operation saves the user-provided cell as contract storage data without validating its data. A malformed data cell can make the contract unusable. The `upgrade_storage` operation handler of the SYMinter contract does not validate that the user-provided data cell includes all of the required storage fields in the correct format. A malformed, incomplete, or empty cell can be saved as the contract storage data, causing an exception from the `load_data` function of the contract. This will make the contract unusable, as all the user actions will throw an exception.

```cpp
if (op == op::upgrade_storage) {
    check_sender_is_admin(sender_address);
    cell new_storage = in_msg_body~load_ref();
    set_data(new_storage);
    throw(successExitCode);
}
```
*Figure 2.1: The `upgrade_storage` operation handler of the SYMinter contract  
`contracts/SY/generic/maintance.fc#L97-L102`*

The same issue also affects the `upgrade_storage` operation handler of the `EvaaSyMinter`, `YTMinter`, `PTMinter`, `UnlimitedMinter`, `UnlimitedMinterV2`, `Collection`, and `Pool` contracts.

## Exploit Scenario
Alice upgrades the SYMinter contract storage but accidentally enters an incomplete data cell and saves it as the contract storage data. After this, every user action fails because the `load_data` function cannot parse the required storage data from the stored incomplete data cell and throws an exception.

## Recommendations
**Short term:** Implement a validation check in the `upgrade_storage` operation handler to ensure that the new data cell includes all the storage data fields in the correct format and can be parsed without an exception.

**Long term:** Identify and document all possible actions that privileged accounts can take, along with their associated risks. This will facilitate codebase reviews and prevent future mistakes.
