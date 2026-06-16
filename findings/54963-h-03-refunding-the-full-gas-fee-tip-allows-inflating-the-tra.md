---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/governance
  - sector/staking
protocol: "[[MANTRA]]"
auditors:
  - "[[berndartmueller]]"
report: "https://code4rena.com/reports/2024-11-mantra-chain"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[dos-resistance]]"
  - "[[frontrun-exposure]]"
---
# [H-03] Refunding the full gas fee tip allows inflating the transaction priority and filling up the block gas limit, effectively DoSing the network

- id: 54963
- impact: HIGH
- protocol: [[MANTRA]]
- reporter: berndartmueller (Code4rena)
- source: https://code4rena.com/reports/2024-11-mantra-chain

## Summary


The skip-mev feemarket ante handler is causing two problems in Mantra. Firstly, the maximum block gas limit is set to 75 million, which means that blocks can only contain transactions that consume less than or equal to 75 million gas. However, since unspent gas is fully refunded, an attacker can submit a transaction with a gas limit close to 75 million, consume only a small fraction of it, and get the rest refunded. This can be repeated to fill up the block with transactions that consume only a small fraction of the gas limit, effectively causing a Denial of Service (DoS) attack on the network. Secondly, a transaction's priority in the mempool is determined by the paid fee. By overpaying, a transaction can always have a very high priority. This can be exploited by an attacker to fill up blocks with transactions that consume all of the block gas, effectively DoSing the network. A proof of concept was provided to demonstrate how this can be done. The report suggests that the code in the feemarket ante handler should be modified to prevent these issues.

## Details



### Finding description and impact

skip-mev’s feemarket ante handler [escrows the full paid fee amount](https://github.com/skip-mev/feemarket/blob/f1f216e15aa6bcc05075a7079496764820a0f545/x/feemarket/ante/fee.go# L141) (which includes the base gas fee + tip). Any paid gas fee that is not consumed is **fully** refunded to the fee payer in Mantra’s `xfeemarket` post handler.

This is problematic in two ways:

1. According to the `genesis.json` configuration for Mantra, the consensus parameter for the [maximum block gas `max_gas` is set to `75_000_000`](https://github.com/code-423n4/2024-11-mantra/blob/37dedf312c3ea161792b8e1278978db23bb5a8b0/networks/mantra-1/genesis.json# L1392). This means that blocks will have a 75M gas limit and will only contain transactions that have a cumulative gas consumption of less than or equal to 75M. This is ensured by using a block gas meter, as seen [when preparing a block](https://github.com/cosmos/cosmos-sdk/blob/c64d1010800d60677cc25e2fca5b3d8c37b683cc/baseapp/abci.go# L416) and [when finalizing a block](https://github.com/cosmos/cosmos-sdk/blob/c64d1010800d60677cc25e2fca5b3d8c37b683cc/baseapp/abci.go# L747-L748). Therefore, knowing that unspent gas is fully refunded, an attacker can submit a tx with a gas limit of near 75M, consume only a small fraction of it, and get the rest refunded. This can be repeated to fill up the block with transactions that consume only a small fraction of the gas limit, effectively DoSing the network.
2. A transaction’s priority in the mempool is determined based on the paid fee. By purposefully overpaying, a transaction can always have a very high priority.

### Proof of Concept

skip-mev’s feemarket `feeMarketCheckDecorator()` ante handler decorator [escrows the full paid fee amount](https://github.com/skip-mev/feemarket/blob/f1f216e15aa6bcc05075a7079496764820a0f545/x/feemarket/ante/fee.go# L141).

The transaction’s priority is [determined](https://github.com/skip-mev/feemarket/blob/f1f216e15aa6bcc05075a7079496764820a0f545/x/feemarket/ante/fee.go# L146) via the `priorityFee` by converting the full paid fee amount (in any of the allowed coins) to the base denom fee coin (`uom`). This `priorityFee` is then used to [set the transaction priority](https://github.com/skip-mev/feemarket/blob/f1f216e15aa6bcc05075a7079496764820a0f545/x/feemarket/ante/fee.go# L156) within the mempool.
```

156: ctx = ctx.WithPriority(GetTxPriority(priorityFee, int64(gas), baseGasPrice))
```

In the post handler, after the message is executed, `BurnFeeAndRefund()` [refunds](https://github.com/code-423n4/2024-11-mantra/blob/37dedf312c3ea161792b8e1278978db23bb5a8b0/x/xfeemarket/post/fee.go# L166) the tip, i.e., the difference between the gas consumed and the paid fee, to the fee payer.
```

148: func (dfd FeeMarketDeductDecorator) BurnFeeAndRefund(ctx sdk.Context, fee, tip sdk.Coin, feePayer sdk.AccAddress, defaultFeeDenom string) error {
...   // [...]
163:
164: 	// refund the tip if it is not nil and non zero
165: 	if !tip.IsNil() && !tip.IsZero() {
166: 		err := RefundTip(dfd.bankKeeper, ctx, feePayer, sdk.NewCoins(tip))
167: 		if err != nil {
168: 			return err
169: 		}
```

Knowing that the tip is subsequently refunded, a user might exploit this by providing a large amount of fees to (1) DoS the network by filling up blocks with transactions that consume only a small fraction of the gas limit, and (2) always have a very high priority in the mempool.

**Proof of concept:**

Here is a PoC that demonstrates how a transaction can set its gas limit as high as the block gas limit to consume all of the block gas and effectively DoS the network:

Two simple bank coin send transactions are generated and broadcasted. The first transaction sets the gas limit to the maximum block gas limit of 75M, and the second transaction sets it to a more reasonable 1M. Both transactions are signed and broadcasted quickly to attempt to get them into the same block.

But, since the first transaction consumes all of the block gas, the second transaction is put into a separate block.

Setup environment by starting a local node:

First, adapt the `Makefile` to ensure the validator has more available funds and the gas limit is set to 75M (mimicking Mantra mainnet):
```

diff --git a/Makefile b/Makefile
index 0ad0cdc..80d3c5a 100644
--- a/Makefile
+++ b/Makefile
@@ -220,12 +220,13 @@ mocks:
 build-and-run-single-node: build
 	@echo "Building and running a single node for testing..."
 	@mkdir -p .mantrasinglenodetest
-	@if [ ! -f .mantrasinglenodetest/config.toml ]; then \
+	@if [ ! -f .mantrasinglenodetest/config/config.toml ]; then \
 		./build/mantrachaind init single-node-test --chain-id test-chain --home .mantrasinglenodetest; \
 		./build/mantrachaind keys add validator --keyring-backend test --home .mantrasinglenodetest; \
-		./build/mantrachaind genesis add-genesis-account $$(./build/mantrachaind keys show validator -a --keyring-backend test --home .mantrasinglenodetest) 100000000stake --home .mantrasinglenodetest; \
+		./build/mantrachaind genesis add-genesis-account $$(./build/mantrachaind keys show validator -a --keyring-backend test --home .mantrasinglenodetest) 100000000000000stake --home .mantrasinglenodetest; \
 		./build/mantrachaind genesis gentx validator 100000000stake --chain-id test-chain --keyring-backend test --home .mantrasinglenodetest; \
 		./build/mantrachaind genesis collect-gentxs --home .mantrasinglenodetest; \
+		sed -i'' -e 's/"max_gas": "-1"/"max_gas": "75000000"/' .mantrasinglenodetest/config/genesis.json; \
 	fi
 	./build/mantrachaind start --home .mantrasinglenodetest --minimum-gas-prices 0stake
```

Start the local node with:
```

make build-and-run-single-node
```

Next, save the following script as `test.sh`:
```

#!/bin/bash

MAX_BLOCK_GAS=75000000

ACCOUNT_ADDRESS=$(./build/mantrachaind keys show validator -a --keyring-backend test --home .mantrasinglenodetest)



## Artifacts

- Raw capture: /Users/user/Desktop/crawlee-run/pages_capture.har
- Pages snapshot: /Users/user/Desktop/crawlee-run/all_findings_full.json
