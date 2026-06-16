---
tags:
  - lang/rust
  - sector/staking
  - platform/hexens
  - has/github
  - severity/high
  - impact/mev/frontrun
  - trigger/first-deposit
protocol: "[[Persistence]]"
auditors:
  - "[[Hexens]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Hexens/2024-01-12-Persistence.md"
genome:
  - "[[rounding-direction]]"
  - "[[frontrun]]"
  - "[[first-deposit]]"
  - "[[fot-slippage]]"
  - "[[frontrun-exposure]]"
  - "[[integer-bounds]]"
---
# [PRST-6] First depositor can steal assets due to missing slippage protection

- id: 53507
- impact: HIGH
- protocol: [[Persistence]]
- reporter: Hexens
- source: https://github.com/solodit/solodit_content/blob/main/reports/Hexens/2024-01-12-Persistence.md

## Summary


The code for the function to mint `stkXPRT` has a vulnerability that allows an attacker to manipulate the exchange rate and cause rounding issues. This means that the first person to deposit their `xprt` for `stkXPRT` can lose part of their funds to the attacker. To fix this, a new parameter should be added to specify the minimum amount of shares expected to be minted. This will prevent manipulation before the transaction is executed. The issue has been acknowledged and is being worked on.

## Details

**Severity:** High

**Path:** x/liquidstake/keeper/liquidstake.go:LiquidStake

**Description:**

The function to mint `stkXPRT` does not have any slippage protection. It only uses the input amount in `xprt`, but the output amount of minted shares is not checked, such as against a minimum amount out parameter. The output amount is only checked against zero, which is insufficient.

When a user deposits their `xprt` for `stkXPRT` the amount of minted shares are calculated from the exchange rate. The exchange rate is calculated from the total net asset amount and the total supply. The total net asset amount includes a `balanceOf` of `xprt`, which can be increased by an attacker to manipulate the share rate and cause rounding issues.

As a result, the first depositor can lose part of their funds to an attacker that front-runs their deposit message with the well-known deposit/donation attack.

```
func (k Keeper) LiquidStake(
	ctx sdk.Context, proxyAcc, liquidStaker sdk.AccAddress, stakingCoin sdk.Coin) (newShares math.LegacyDec, stkXPRTMintAmount math.Int, err error) {
    [..]
    nas := k.GetNetAmountState(ctx)
    [..]
	// mint stkxprt, MintAmount = TotalSupply * StakeAmount/NetAmount
	liquidBondDenom := k.LiquidBondDenom(ctx)
	stkXPRTMintAmount = stakingCoin.Amount
	if nas.StkxprtTotalSupply.IsPositive() {
		stkXPRTMintAmount = types.NativeTokenToStkXPRT(stakingCoin.Amount, nas.StkxprtTotalSupply, nas.NetAmount)
	}
	[..]
}

func (k Keeper) GetNetAmountState(ctx sdk.Context) (nas types.NetAmountState) {
	totalRemainingRewards, totalDelShares, totalLiquidTokens := k.CheckDelegationStates(ctx, types.LiquidStakeProxyAcc)

	totalUnbondingBalance := sdk.ZeroInt()
	ubds := k.stakingKeeper.GetAllUnbondingDelegations(ctx, types.LiquidStakeProxyAcc)
	for _, ubd := range ubds {
		for _, entry := range ubd.Entries {
			// use Balance(slashing applied) not InitialBalance(without slashing)
			totalUnbondingBalance = totalUnbondingBalance.Add(entry.Balance)
		}
	}

	nas = types.NetAmountState{
		StkxprtTotalSupply:    k.bankKeeper.GetSupply(ctx, k.LiquidBondDenom(ctx)).Amount,
		TotalDelShares:        totalDelShares,
		TotalLiquidTokens:     totalLiquidTokens,
		TotalRemainingRewards: totalRemainingRewards,
		TotalUnbondingBalance: totalUnbondingBalance,
		ProxyAccBalance:       k.GetProxyAccBalance(ctx, types.LiquidStakeProxyAcc).Amount,
	}

	nas.NetAmount = nas.CalcNetAmount()
	nas.MintRate = nas.CalcMintRate()
	return
}

func NativeTokenToStkXPRT(nativeTokenAmount, stkXPRTTotalSupplyAmount math.Int, netAmount math.LegacyDec) (stkXPRTAmount math.Int) {
	return math.LegacyNewDecFromInt(stkXPRTTotalSupplyAmount).MulTruncate(math.LegacyNewDecFromInt(nativeTokenAmount)).QuoTruncate(netAmount.TruncateDec()).TruncateInt()
}
```


**Remediation:**  We would recommend to also add a parameter containing the minimum amount of shares expected to be minted by the user. The amount would be calculated at the moment of signing and as a result, the transaction would fail if any manipulation would have happened before the moment of execution.

**Status:**  Acknowledged


- - -
