---
tags:
  - lang/solidity
  - platform/cantina
  - has/poc
  - severity/high
  - sector/nft-lending
  - sector/restaking
  - sector/staking
protocol: "[[MilkyWay]]"
auditors:
  - "[[alpo]]"
report: "https://cdn.cantina.xyz/reports/report_cantina_solo_milkyway_january2025.pdf"
genome:
  - "[[unbounded-loop]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
  - "[[vote-delegation-loop]]"
---
# Linear iteration over undelegations with unmetered token transfers expose a permission- less chain halt 

- id: 46093
- impact: HIGH
- protocol: [[MilkyWay]]
- reporter: alpo (Cantina)
- source: https://cdn.cantina.xyz/reports/report_cantina_solo_milkyway_january2025.pdf

## Summary


The bug report describes a vulnerability in the code that allows an attacker to cause the blockchain to halt for an indefinite amount of time by accumulating service delegations and then undelegating them in batches across successive blocks. This is possible due to the high relative gas cost of SendCoins, which allows an attacker to get multiple blocks worth of unmetered gas with a single block of undelegations. This can be escalated until a single block needs to process an arbitrary number of unbonding maturations, leading to a halt in the chain. The report recommends capping the number of denoms that can be included in a single delegation or implementing a scaling gas cost to prevent this attack. The bug has been fixed in a recent pull request.

## Details

## Vulnerability Report: Accumulated Unbonding DoS Attack

## Context
- **File:** end_blocker.go#L11-L38

## Description
An attacker can accumulate service delegations (each with multiple delegated denoms) and then undelegate them in batches across successive blocks. This results in a growing number of accumulated unbondings that need to be processed in each new block, potentially leading to a prolonged chain halt.

Mature unbondings are processed linearly during unmetered EndBlock execution. Though this behavior is not typically exploitable (as the number of processed unbondings is generally capped at what can be produced in a single block), it can escalate to a chain halt due to the ability to include multiple denoms in a single delegation.

### Attack Surface
The attack surface described hinges on the high relative gas cost of `SendCoins`. If there are a sufficiently high number of denoms in a single delegation, even while the number of denoms per delegation is capped, an attacker can generate multiple blocks' worth of unmetered gas with a single block of undelegations.

### Attack Vector
1. Accumulate a large number of multi-denom delegations cheaply across low-cost blocks.
2. Start undelegating these in batches across successive blocks, allocating enough undelegations to approximately double the block maturation time.
3. Once the maturation period for the first undelegation block is reached, the next block will need to process two blocks worth of unbonding maturations. This will repeat geometrically, leading the following block to require processing of 4x, and so forth.
4. This escalation can continue until a single block needs to process an arbitrary number of unbonding maturations, causing a prolonged chain halt.

## Impact
This attack vector can be used to trigger an arbitrarily long chain halt, accessible by anyone at any time. In addition to being a costly DoS vector, it can undermine the security guarantees of Active Validator Sets (AVSs).

## Likelihood
The outlined attack vector can be executed cheaply and permissionlessly by anyone. While constraining the number of restakable denoms (e.g., to less than 3) could help avoid this, the current state with 4 restakable denoms remains exploitable. Additionally, the incubation period for the attack is at least `UnbondingTime` (currently set to 1 week), but it can remain undetectable because the core flows of the attack blend with regular user behavior.

## Proof of Concept
A gas tracking test can be run in `x/restaking/keeper/end_blocker_test.go` to demonstrate the scaling of unmetered gas consumption based on the number of denoms in each delegation:

```go
func (suite *KeeperTestSuite) TestGasConsumption_UndelegateVsEndBlockProcessing() {
    // Modify this value to test different numbers of denoms per delegation
    numDenomsPerDelegation := 10

    // --- Test Setup 
---
    // Set up the context with a pre-set block time for test determinism
    ctx := suite.ctx.
        WithBlockHeight(10).
        WithBlockTime(time.Date(2024, 1, 1, 12, 0, 0, 0, time.UTC))

    // Initialize the MsgServer
    msgServer := keeper.NewMsgServer(suite.k)

    // Set the unbonding delegation time to 7 days
    params := types.Params{
        UnbondingTime: 7 * 24 * time.Hour,
    }
    msgUpdateParams := &types.MsgUpdateParams{
        Authority: authtypes.NewModuleAddress("gov").String(),
        Params:    params,
    }
    _, err := msgServer.UpdateParams(ctx, msgUpdateParams)
    suite.Require().NoError(err)

    // Create a delegator address
    delegatorAddress := "cosmos167x6ehhple8gwz5ezy9x0464jltvdpzl6qfdt4"

    // Generate denoms to delegate
    denoms := make([]string, numDenomsPerDelegation)
    for i := 0; i < numDenomsPerDelegation; i++ {
        denoms[i] = fmt.Sprintf("uinit%d", i)
    }

    // Fund the delegator account with sufficient balance
    initialBalance := sdk.NewCoins()
    for _, denom := range denoms {
        initialBalance = initialBalance.Add(sdk.NewInt64Coin(denom, 1000))
    }
    suite.fundAccount(ctx, delegatorAddress, initialBalance)

    // Create a service to delegate to
    serviceID := uint32(1)
    serviceAddress := servicestypes.GetServiceAddress(serviceID).String()
    err = suite.sk.SaveService(ctx, servicestypes.Service{
        ID:              serviceID,
        Status:          servicestypes.SERVICE_STATUS_ACTIVE,
        Address:         serviceAddress,
        Tokens:          sdk.NewCoins(),
        DelegatorShares: sdk.NewDecCoins(),
    })
    suite.Require().NoError(err)

    // Prepare the total amount to delegate
    delegateAmounts := sdk.NewCoins()
    for _, denom := range denoms {
        delegateAmounts = delegateAmounts.Add(sdk.NewInt64Coin(denom, 100))
    }

    // Delegate multiple denominations to the service using MsgServer
    msgDelegate := &types.MsgDelegateService{
        Delegator: delegatorAddress,
        ServiceID: serviceID,
        Amount:    delegateAmounts,
    }
    _, err = msgServer.DelegateService(ctx, msgDelegate)
    suite.Require().NoError(err)

    // --- Undelegation Gas Tracking 
---
    undelegationGasStart := ctx.GasMeter().GasConsumed()

    // Undelegate the denominations using MsgServer
    msgUndelegate := &types.MsgUndelegateService{
        Delegator: delegatorAddress,
        ServiceID: serviceID,
        Amount:    delegateAmounts,
    }
    _, err = msgServer.UndelegateService(ctx, msgUndelegate)
    suite.Require().NoError(err)

    // Calculate gas used during undelegations
    gasUsedForUndelegations := ctx.GasMeter().GasConsumed() - undelegationGasStart
    fmt.Printf("Total gas used during initial undelegations: %d\n", gasUsedForUndelegations)

    // --- EndBlock Unbond Completion Gas Tracking 
---
    ctx = ctx.WithBlockTime(ctx.BlockTime().Add(7 * 24 * time.Hour))
    ctx = ctx.WithGasMeter(storetypes.NewInfiniteGasMeter())
    endBlockGasStart := ctx.GasMeter().GasConsumed()

    // Measure gas consumption during end block processing
    err = suite.k.CompleteMatureUnbondingDelegations(ctx)
    suite.Require().NoError(err)

    // Calculate gas used during end block processing
    gasUsedForEndBlock := ctx.GasMeter().GasConsumed() - endBlockGasStart
    fmt.Printf("Total gas used during end block unbonding completion: %d\n", gasUsedForEndBlock)

    // --- Gas Consumption Comparison 
---
    fmt.Printf("Gas used for undelegations: %d\n", gasUsedForUndelegations)
    fmt.Printf("Gas used for end block processing: %d\n", gasUsedForEndBlock)
}
```

### Gas Footprint Example
For a delegation with 10 denoms:
- Metered gas to undelegate (paid by attacker): 48764.
- Unmetered gas to complete unbonding (subsidized by chain in EndBlock): 109380 (>2x consumed gas).

For 20 denoms, each unit of gas paid by the attacker yields >3x the amount of unmetered gas in EndBlock. This scaling unmetered gas means that even with a fixed number of restakable denoms, the attack can escalate to a chain halt.

## Recommendation
To address this attack vector, limit the number of denoms included in a single delegation (e.g., to 3). This would cap the EndBlock processing of matured unbonds to what can be produced in a single block, which is asymptotically equivalent to spamming the chain with transactions.

An alternative, less restrictive approach involves implementing a scaling gas cost instead of a hard cap. Here’s how it could be done:
1. Introduce a `baseAdditionalGasCharge` with a fixed gas cost (e.g., 20,000).
2. Add a scaling gas cost to each undelegation of: `len(numDenomsInDelegation) * baseAdditionalGasCharge` (e.g., if the delegation has 5 denoms, an additional 100,000 gas would be charged during undelegation).

## Discussion
### MilkyWay
Could this be solved by:
1. Updating the `MsgDelegateOperator` and `MsgDelegateService` messages to use an `sdk.Coin` as the amount, similar to how a `MsgDelegatePool` operates.
2. Updating all the `MsgUnbond` messages to use an `sdk.Coin` for the amount rather than `sdk.Coins`.

### Alpo
Yes, that would be even better. I initially suggested a cap assuming multi-denom delegations were crucial, but if it's acceptable to use separate delegations, limiting to 1 denom per delegation would also reduce the attack surface significantly.

### MilkyWay
Fixed in PR 27.

### Alpo
Fix verified.
