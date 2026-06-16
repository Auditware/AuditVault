---
tags:
  - lang/solidity
  - platform/cantina
  - severity/high
  - sector/restaking
  - sector/staking
protocol: "[[MilkyWay]]"
auditors:
  - "[[alpo]]"
report: "https://cdn.cantina.xyz/reports/report_cantina_solo_milkyway_january2025.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[vote-delegation-loop]]"
---
# Service delegations not being set correctly in store breaks core accreditation functionality 

- id: 46094
- impact: HIGH
- protocol: [[MilkyWay]]
- reporter: alpo (Cantina)
- source: https://cdn.cantina.xyz/reports/report_cantina_solo_milkyway_january2025.pdf

## Summary


A bug has been found in the code for service delegations, where the actual delegation bytes are not being set in the store. This leads to a broken service iteration and triggers an error when trying to update accreditation status. This bug can occur anytime there is a change in accreditation status and has a major impact on core accreditation processes. Fixing this bug on mainnet would require a hard fork and manual state changes, which is a risky process. A test has been provided to reproduce the bug and a recommendation has been made to fix it by passing in delegationBz instead of an empty byte array. The bug has been fixed in PR 13 and verified by Alpo.

## Details

## Bug Report: Service Delegation Issue

**Context:** `alias_functions.go#L193`

**Description:**
Service delegations don't set the actual delegation bytes in store (they just set `[]byte{}`, see linked code block), leading to service iteration being completely broken. The primary impact of this is an error trigger that blocks any accreditation update due to trying to convert an empty string to bytes.

**Likelihood:**
This bug will surface any time an accreditation status change is triggered.

**Impact:**
1. Core accreditation flows are non-functional until this is fixed.
2. The remediation process for fixing this bug on mainnet would require a hard fork and manual state changes in the upgrade handler, which is a highly risky process.

**Proof of Concept:**
The following Go test can be used to reproduce the bug. Once it is fixed, this test should pass.

```go
func (suite *KeeperTestSuite) TestServiceAccreditationModification_SingleDelegation() {
    // Cache the context to avoid conflicts
    ctx, _ := suite.ctx.CacheContext()
    
    // Set up a sample service with initial accreditation status
    service, _ := suite.setupSampleServiceAndOperator(ctx)
    service.Accredited = false
    err := suite.servicesKeeper.SaveService(ctx, service)
    suite.Require().NoError(err)
    
    // Create a single delegation
    delegatorAddr := testutil.TestAddress(1000)
    
    // Fund the delegator's account
    suite.FundAccount(
        ctx,
        delegatorAddr.String(),
        sdk.NewCoins(sdk.NewInt64Coin("umilk", 100_000_000)),
    )
    
    // Set user preferences
    err = suite.restakingKeeper.SetUserPreferences(
        ctx,
        delegatorAddr.String(),
        restakingtypes.UserPreferences{
            TrustNonAccreditedServices: true,
            TrustAccreditedServices:     true,
            TrustedServicesIDs:          nil,
        },
    )
    suite.Require().NoError(err)
    
    // Delegate to the service
    suite.DelegateService(
        ctx,
        service.ID,
        sdk.NewCoins(sdk.NewInt64Coin("umilk", 100_000_000)),
        delegatorAddr.String(),
        true,
    )
    
    // Refetch service and change accreditation
    service, err = suite.servicesKeeper.GetService(ctx, service.ID)
    suite.Require().NoError(err)
    service.Accredited = true
    err = suite.servicesKeeper.SaveService(ctx, service)
    suite.Require().NoError(err)
    
    // Trigger hook
    err = suite.keeper.AfterServiceAccreditationModified(ctx, service.ID)
    // We expect this to not error, but it errors with "empty address string is not allowed"
    suite.Require().NoError(err)
}
```

**Recommendation:**
Pass in `delegationBz` instead of `[]byte{}` to the linked `store.Set` call.

**MilkyWay:** Fixed in PR 13.

**Alpo:** Fix verified.
