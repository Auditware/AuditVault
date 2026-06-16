---
tags:
  - severity/high
  - has/github
  - has/poc
  - lang/solidity
  - sector/token
  - platform/code4rena
protocol: "[[Initia]]"
auditors:
  - 0xAlix2
report: "https://code4rena.com/reports/2025-02-initia-cosmos"
genome:
  - "[[token-decimal-normalization]]"
  - "[[logic/wrong-condition]]"
  - "[[data-corruption/accounting-error]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[redesign-logic]]"
  - "[[blast-radius/single-user]]"
---
# [H-01] Wrong handling of ERC20 denoms in `ERC20Keeper::BurnCoins`

- id: 55304
- impact: HIGH
- protocol: Initia
- reporter: 0xAlix2 (Code4rena)
- source: https://code4rena.com/reports/2025-02-initia-cosmos

## Summary


The bug report is about a flaw in the MiniEVM system, specifically in the ERC20 contracts that allow users to interact with the system. When a user creates an ERC20 contract through Cosmos, it is saved as `evm/ADDRESS` and the corresponding EVM address is also saved. However, there is a flaw in the code that handles the minting and burning of these contracts. When the `MintCoins` function is called, it checks if the contract is an ERC20Denom and if so, it does nothing. However, if it is not an ERC20Denom, it calls `sudoMint` and sends the entire amount to the community pool instead of just the matching coin. This means that if two ERC20 contracts are provided, double the amount will be sent to the community pool. Similarly, in the `BurnCoins` function, there is an error that causes the entire amount to be sent to the community pool instead of just the matching coin. This means that if a user tries to burn 50 coins of two different ERC20 contracts, 100 coins of each contract will be sent to the community pool instead of just 50. This bug has been confirmed and a fix has been implemented in a recent PR.

## Details



MiniEVM is an optimistic rollup consumer chain powered by EVM, it allows users to interact with EVM/solidity contracts through Cosmos. Part of those contracts is ERC20, which allows users to interact with [`ERC20Factory`](https://github.com/initia-labs/minievm/blob/744563dc6a642f054b4543db008df22664e4c125/x/evm/contracts/erc20_factory/ERC20Factory.go) to create their ERC20s through Cosmos call messages.
When doing so, a new ERC20 is created, and of course, an address is generated say `ADDRESS`, on the Cosmos end this denom/token is saved as `evm/ADDRESS` (without the `0x` prefix), and the corresponding EVM address is saved, this type of denoms are referred to as ERC20Denom.
Another type of denoms created is through `CreateERC20`, these also interact with the factory, but these are saved as just denoms, in other words, if a `uinit` denom is created it is just saved and referred to as `uinit`, the Cosmos part handles the part of minting and burning of these.

When `MintCoins` is called in the ERC20 keeper, it checks if the denom is `ERC20Denom`, if so, nothing is done, this is because minting should be done by the ERC20 creator/owner. If not, then `sudoMint` is called, [here](https://github.com/initia-labs/minievm/blob/744563dc6a642f054b4543db008df22664e4c125/x/evm/keeper/erc20.go# L311-L351):
```

func (k ERC20Keeper) MintCoins(ctx context.Context, addr sdk.AccAddress, amount sdk.Coins) error {
	// ... snip ...

	for _, coin := range amount {
		denom := coin.Denom
		if types.IsERC20Denom(denom) {
			return moderrors.Wrapf(types.ErrInvalidRequest, "cannot mint erc20 coin: %s", coin.Denom)
		}

		// ... snip ...

		inputBz, err := k.ERC20ABI.Pack("sudoMint", evmAddr, coin.Amount.BigInt())
		if err != nil {
			return types.ErrFailedToPackABI.Wrap(err.Error())
		}

		// ... snip ...
	}

	// ... snip ...
}
```

Similarly, in `BurnCoins` ([here](https://github.com/initia-labs/minievm/blob/744563dc6a642f054b4543db008df22664e4c125/x/evm/keeper/erc20.go# L75-L112)):
```

func (k ERC20Keeper) BurnCoins(ctx context.Context, addr sdk.AccAddress, amount sdk.Coins) error {
	// ... snip ...

	for _, coin := range amount {
		// if a coin is not generated from 0x1, then send the coin to community pool
		// because we don't have burn capability.
		if types.IsERC20Denom(coin.Denom) {
			if err := k.communityPoolKeeper.FundCommunityPool(ctx, amount, evmAddr.Bytes()); err != nil {
				return err
			}

			continue
		}

		// ... snip ...
	}

	// ... snip ...
}
```

If the denom is `ERC20Denom`, it is supposed to be sent to the community pool. However, there’s a huge flaw here, as it is sending the whole `amount` instead of `coin`.

If one of the coins returns true for `types.IsERC20Denom(coin.Denom)`, then all the coins are sent to `FundCommunityPool`, not just the matching one. Then, the next iteration will send the coins again to 0x1 to be
burned. If 2 EVM coins are provided, then double of each will be sent to the fund.

### Proof of Concept

Add the following test in `minievm/x/evm/keeper/erc20_test.go`:
```

func Test_BurnTwice(t *testing.T) {
	ctx, input := createDefaultTestInput(t)
	_, _, addr := keyPubAddr()
	evmAddr := common.BytesToAddress(addr.Bytes())

	erc20Keeper, err := keeper.NewERC20Keeper(&input.EVMKeeper)
	require.NoError(t, err)

	fooContractAddr_1 := deployERC20(t, ctx, input, evmAddr, "foo")
	fooDenom_1, err := types.ContractAddrToDenom(ctx, &input.EVMKeeper, fooContractAddr_1)
	require.NoError(t, err)
	require.Equal(t, "evm/"+fooContractAddr_1.Hex()[2:], fooDenom_1)

	fooContractAddr_2 := deployERC20(t, ctx, input, evmAddr, "bar")
	fooDenom_2, err := types.ContractAddrToDenom(ctx, &input.EVMKeeper, fooContractAddr_2)
	require.NoError(t, err)
	require.Equal(t, "evm/"+fooContractAddr_2.Hex()[2:], fooDenom_2)

	cacheCtx, _ := ctx.CacheContext()
	err = erc20Keeper.MintCoins(cacheCtx, addr, sdk.NewCoins(
		sdk.NewCoin(fooDenom_1, math.NewInt(100)),
		sdk.NewCoin(fooDenom_2, math.NewInt(100)),
	))
	require.Error(t, err)

	mintERC20(t, ctx, input, evmAddr, evmAddr, sdk.NewCoin(fooDenom_1, math.NewInt(100)), false)
	mintERC20(t, ctx, input, evmAddr, evmAddr, sdk.NewCoin(fooDenom_2, math.NewInt(100)), false)

	amount, err := erc20Keeper.GetBalance(ctx, addr, fooDenom_1)
	require.NoError(t, err)
	require.Equal(t, math.NewInt(100), amount)

	amount, err = erc20Keeper.GetBalance(ctx, addr, fooDenom_2)
	require.NoError(t, err)
	require.Equal(t, math.NewInt(100), amount)

	// Community pool should have 0 balance
	require.Equal(t, math.NewInt(0), input.CommunityPoolKeeper.CommunityPool.AmountOf(fooDenom_1))
	require.Equal(t, math.NewInt(0), input.CommunityPoolKeeper.CommunityPool.AmountOf(fooDenom_2))

	// Burn 50 coins of each denom
	err = erc20Keeper.BurnCoins(ctx, addr, sdk.NewCoins(
		sdk.NewCoin(fooDenom_1, math.NewInt(50)),
		sdk.NewCoin(fooDenom_2, math.NewInt(50)),
	))
	require.NoError(t, err)

	// Community pool should have 100 (50*2) coins of each denom
	require.Equal(t, math.NewInt(100), input.CommunityPoolKeeper.CommunityPool.AmountOf(fooDenom_1))
	require.Equal(t, math.NewInt(100), input.CommunityPoolKeeper.CommunityPool.AmountOf(fooDenom_2))
}
```

### Recommended mitigation steps

[`minievm/x/evm/keeper/erc20.go`](https://github.com/initia-labs/minievm/blob/744563dc6a642f054b4543db008df22664e4c125/x/evm/keeper/erc20.go# L75-L112):
```

	// BurnCoins implements IERC20Keeper.
	func (k ERC20Keeper) BurnCoins(ctx context.Context, addr sdk.AccAddress, amount sdk.Coins) error {
		// ... snip ...

		for _, coin := range amount {
			// if a coin is not generated from 0x1, then send the coin to community pool
			// because we don't have burn capability.
			if types.IsERC20Denom(coin.Denom) {
-				if err := k.communityPoolKeeper.FundCommunityPool(ctx, amount, evmAddr.Bytes()); err != nil {
+				if err := k.communityPoolKeeper.FundCommunityPool(ctx, sdk.NewCoins(coin), evmAddr.Bytes()); err != nil {
					return err
				}

				continue
			}

			// ... snip ...
		}

		return nil
	}
```

**[leojin (Initia) confirmed and commented](https://code4rena.com/audits/2025-02-initia-cosmos/submissions/F-3?commentParent=b82KCPcfdHR):**

> We fixed in this [PR](https://github.com/initia-labs/minievm/pull/168).

**[Initia mitigated](https://github.com/code-423n4/2025-03-initia-cosmos-mitigation?tab=readme-ov-file# mitigation-of-high--medium-severity-issues):**

> PR addresses burn coins error.

**Status:** Mitigation confirmed. Full details in reports from [berndartmueller](https://code4rena.com/audits/2025-03-initia-cosmos-mitigation-review/submissions/S-9), [Franfran](https://code4rena.com/audits/2025-03-initia-cosmos-mitigation-review/submissions/S-33) and [0xAlix2](https://code4rena.com/audits/2025-03-initia-cosmos-mitigation-review/submissions/S-11).

---


