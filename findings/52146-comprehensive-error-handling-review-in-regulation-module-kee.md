---
tags:
  - platform/halborn
  - has/github
  - severity/high
  - novelty/variant
  - sector/vault
protocol: "[[AppChain Modules]]"
auditors:
  - "[[Halborn]]"
report: "https://www.halborn.com/audits/emoney/appchain-modules"
genome:
  - "[[unchecked-return-value]]"
  - "[[variant]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
---
# Comprehensive Error Handling Review in Regulation Module Keeper

- id: 52146
- impact: HIGH
- protocol: [[AppChain Modules]]
- reporter: Halborn
- source: https://www.halborn.com/audits/emoney/appchain-modules

## Summary


This bug report highlights several issues with the error handling in the regulation module's Keeper implementation. These issues can lead to unexpected behavior, security vulnerabilities, and blockchain instability. The report identifies specific functions that ignore errors, use panics instead of error returns, and have inconsistent error handling. Additionally, some operations that could potentially fail are not checked for errors. The report provides recommendations for improving the error handling, such as implementing a consistent strategy, replacing panics with error returns, and checking all returned errors. The Emoney team has already solved the issue by adding error handlers and the remediation plan can be found in the provided link.

## Details

##### Description

A thorough review of the regulation module's Keeper implementation reveals several instances of inadequate or missing error handling. These issues can lead to silent failures, unexpected behavior, or potential security vulnerabilities.

**Key Issues:**

**1. Ignored Errors:**

Several functions ignore returned errors, potentially leading to incorrect state or execution flow.

**2. Panics Instead of Error Returns:**

Some functions panic on error conditions instead of returning errors, which can lead to blockchain instability.

**3. Inconsistent Error Handling:**

Error handling is not consistent across the module, making the code harder to maintain and debug.

**4. Missing Error Checks:**

Some operations that could potentially fail are not checked for errors.

**Detailed Findings:**

**1. AddressStatus:**

- No error handling for potential store access failures.

**2. AllowAddress and DisallowAddress:**

- Proper error handling implemented.

**3. SetAddressStatus:**

- No error handling for potential store access failures.

**4. TransferAuthority:**

- Proper error handling implemented.

**5. RemoveAuthority and AddAuthority:**

- Uses panic instead of returning errors.

- Example:

```
     if err != nil {

         panic(err)

     }
```

  

**6. ProposeVoting:**

- Proper error handling implemented.

**7. Vote:**

- Error from **GetVotingById** is properly handled.

**8. ProcessVoting:**

- Error from **GetVotingById** is properly handled.

- Error from **GetVotingThreshold** is ignored.

**9. GetVotingById:**

- Returns error, but uses **MustUnmarshal** which can panic.

**10. GetVotingThreshold:**

- Returns error, but it's often ignored in calling functions.

**11. ApplyVote:**

- Error from **GetVotingThreshold** is checked but not properly handled.

- Uses **MustUnmarshal** which can panic.

**12. FinalizeBlock and FinalizeAdd:**

- Ignore error from **GetVotingById**.

##### BVSS

[AO:A/AC:L/AX:L/C:N/I:C/A:N/D:N/Y:N/R:N/S:C (10.0)](/bvss?q=AO:A/AC:L/AX:L/C:N/I:C/A:N/D:N/Y:N/R:N/S:C)

##### Recommendation

**1. Consistent Error Handling:**

Implement a consistent error handling strategy across all functions.

**2. Replace Panics with Error Returns:**

Update functions like RemoveAuthority and AddAuthority to return errors instead of panicking.

**3. Check All Returned Errors:**

Ensure all functions that can return errors have their results checked and handled appropriately.

**4. Use Unmarshal Instead of MustUnmarshal:**

Replace instances of MustUnmarshal with Unmarshal and handle potential errors.

**5. Improve Error Context:**

Use error wrapping to provide more context when returning errors.

**6. Add Logging:**

Implement logging for error conditions, especially in cases where execution continues after an error.

  

### Remediation Plan

**SOLVED :** The **Emoney team** solved the issue by adding error handlers.

##### Remediation Hash

<https://github.com/EMoney-Network/EMoneyChain/pull/6/commits/9a5ef3d9767cc4b3f8a763b76d7bc4119d9e7850>
