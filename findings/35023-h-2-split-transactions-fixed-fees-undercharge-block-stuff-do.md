---
tags:
  - lang/rust
  - lang/solidity
  - sector/dex
  - sector/infra
  - sector/lending
  - sector/privacy
  - sector/stable
  - sector/staking
  - sector/zk
  - platform/sherlock
  - has/github
  - severity/high
  - vuln/logic/fee-calculation
  - impact/loss-of-funds/direct-drain
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[ALEO]]"
auditors:
  - "[[DTheo]]"
report: "https://github.com/sherlock-audit/2024-05-aleo-judging"
genome:
  - "[[fee-calculation]]"
  - "[[direct-drain]]"
  - "[[dos-resistance]]"
  - "[[fee-accounting]]"
  - "[[liquidation-underwater]]"
  - "[[circuit-dos-invalid-proof]]"
---
# H-2: `split` transaction's fixed fees undercharge block stuff DOS attacks

- id: 35023
- impact: HIGH
- protocol: [[ALEO]]
- reporter: dtheo (Sherlock)
- source: N/A

## Summary


The split transaction type in Aleo has a fixed fee of 10 credits, which can be exploited in block stuffing attacks. This means that an attacker can fill blocks with this transaction type without having to increase the fee during times of congestion. This can lead to cheap and unreasonable block stuffing attacks, causing network congestion and preventing important transactions from being processed. The fixed fee for split transactions should be removed and a fee commitment should be required, similar to other transaction types. This issue can have a significant impact on the network, potentially causing loss of funds and disrupting the functionality of DeFi protocols. This is a serious issue that needs to be addressed in order to ensure the security and stability of the Aleo network.

## Details

Source: https://github.com/sherlock-audit/2024-05-aleo-judging/issues/35 

## Found by 
dtheo
## Summary

Split transactions that contain only 1 transition (the entire transaction is a single `split` transaction and nothing else) do not require a fee commitment and instead charge a fixed 10 credit fee. Since the fee is fixed this transaction type can be abused in block stuffing attacks without having to increase the fee during times of congestion. 

## Vulnerability Detail

Similar to Ethereum's EIP-1559 mechanism, Aleo allows for fee increases during times of congestion to prevent DOS due to block stuffing attacks. Unlike public and private `fee` transaction types where the fee is dynamic and provided as inputs, `split` transaction types have a fixed fee that is hardcoded to 10 credits in the `split` function in credits.aleo. This allows for an attacker to use this transaction type to fill blocks to their [max transaction limit](https://github.com/sherlock-audit/2024-05-aleo/blob/main/snarkVM/ledger/block/src/verify.rs#L422-L428) without ever having to increase their fees. This allows for unreasonable cheap block stuffing attacks that can be used to DOS the network during critical time periods to prevent DEX liquidations, collateral adjustments, etc. 

## Impact

The hardcoding of the `split` transactions fee amount and lack of outer fee commitment requirements bypass the Aleo networks dynamic fee mechanism allowing unreasonable cheap block stuff DOS attacks on the network.

## Code Snippet

[snarkVM/synthesizer/src/vm/verify.rs#L225-L248](https://github.com/sherlock-audit/2024-05-aleo/blob/main/snarkVM/synthesizer/src/vm/verify.rs#L225-L248)

[snarkVM/synthesizer/program/src/resources/credits.aleo#L947-L972)](https://github.com/sherlock-audit/2024-05-aleo/blob/main/snarkVM/synthesizer/program/src/resources/credits.aleo#L947-L972)

[snarkVM/ledger/block/src/verify.rs#L422-L428](https://github.com/sherlock-audit/2024-05-aleo/blob/main/snarkVM/ledger/block/src/verify.rs#L422-L428)

## Tool used

Manual Review

## Recommendation

Remove the fixed fee from inside the `split` function in credits.aleo. Require fee commitments for this transaction type that are similar to all other transaction types. 



## Discussion

**evanmarshall**

Somewhat a duplicate of: https://github.com/sherlock-audit/2024-05-aleo-judging/issues/17

A fee is already charged (at the program layer instead of consensus layer). The base fee is about twice was a `transfer_private` requires as a base fee.

**sherlock-admin3**

> Escalate
> 
> The sponsors comment indicates that the split fee is 2 times the transfer_private fee so undercharging is not occurring here.

You've deleted an escalation for this issue.

**infosecual**

> The sponsors comment indicates that the split fee is 2 times the transfer_private fee so undercharging is not occurring here.

The initial cost of the transaction at baseline is 2x. This submission is not talking about the baseline cost. This submission is talking about the fact that the split transaction costs will not increase with every other transaction type when congestion is happening. [Aleo Documentation on transaction fees](https://developer.aleo.org/concepts/transaction_fees/) explains this a bit: 

> The minimum execute transaction fee may increase to prevent spamming; it is currently stable between 3 and 5 millicredits
for a basic credits.aleo transfer.

For example, `transfer_private` fees will increase and could easily 20-50x during periods of spam/congestion- think similar to an evm chain at 150 gwei gas prices. In Aleo the `split` fee is waived at the consensus layer and is exactly 10 credits at the program layer. Since all dynamic fee pricing happens at the consensus layer the `split` transaction will never increase in cost and can be used to spam without increasing costs. This can crowd out other transactions during congestion even as all other `execute` transaction get multiple magnitudes more expensive.

**evanmarshall**

So this isn't implemented yet in the snarkOS repo but I'd imagine that validators will drop transactions that generate the least revenue in the long run. I don't see it as a spam vector as validators noticing a full mempool will simply prioritize the most profitable transactions. 

A bigger criticism that I don't believe the mempool is currently sorted by priority fees. Once that is in place, I see the issue as more DOS for the split transaction. If validators are sorting the mempool by profitability and fees are high, no split transaction will ever get through because it won't be profitable with a fixed fee. 

**Haxatron**

> The initial cost of the transaction at baseline is 2x. This submission is not talking about the baseline cost. This submission is talking about the fact that the split transaction costs will not increase with every other transaction type when congestion is happening.

Apologies, I stand corrected. I do agree that the split fee not being subjected to EIP-1559 style pricing is a real issue and will delete the escalation.

**sherlock-admin3**

> Escalate
> 
> This is valid. However, I would like to dispute the severity of this issue.
> 
> It does not meet Sherlock's High Severity criteria :
> 
> https://docs.sherlock.xyz/audits/judging/judging#iv.-how-to-identify-a-high-issue
> 
> I believe it should be downgraded to a Medium instead

You've deleted an escalation for this issue.

**infosecual**

I am very confident of the severity of this issue.

The issue here is that there is currently no dynamic fee mechanism for the `split` transaction type and there is currently no logic in the sequencer to order transactions by priority fees, so there is nothing to prevent crowding out valid transactions with spam that is not subject to dynamic increasing costs. There are really two things that need to happen here to mitigate this issue - 1. a priority fee auction market ordering needs to be implemented and 2. a dynamic fee needs to be implemented for `split` in order to have its pricing adjust correctly during times of congestion. 

To comment on the impact- if this is not fixed someone will eventually abuse this to destroy a defi protocol. Users and protocols built on Aleo will experience an attack like this as a chain liveness issue. Any protocol that depends on liquidations happening in a timely manner will be affected by this. Both users and protocols will incur material loss. Users will not be able to withdrawal assets or top up collateral, DEX's will not be able to liquidate positions that are about to incur bad debt against the protocol, etc. The list can go on and on since this breaks chain liveness assumptions that all protocols are built on.

For some reference, in Ethereum world this would be detrimental to Maker, Euler, AAVE, Curve, etc. The largest protocols there are. A malicious entity can abuse issues like this one to prevent critical transactions from landing during times of volatility which can lead to entire protocols going insolvent. This was one of the early concerns with Maker on Ethereum - everyone was afraid of a the possibility of a DAI depeg if Maker could not liquidate large vaults in time due to a targeted DOS attack during a large ETH price drop (shanghai attacks were in everyone's recent memory). A DAI depegging is just one example of what could happen during a chain liveness issue. Luckily Ethereum has not had a liveness issue since the creation of these protocols. For everyones sake I hope it never does and I hope Aleo never has to experience one either.

Sherlock is highly geared towards smart contract contests and does not have judging rules specific to L1s so there is no callout to specifically categorize the severity of this category of bug as high. However here are the two possible criteria for High on Shrelock - both are still met:

- [x] Definite loss of funds without (extensive) limitations of external conditions.
- [X] Inflicts serious non-material losses (doesn't include contract simply not working).

While this is not the sort of issue you are used to seeing on a smart contract audit platform, this is the type of issue that underpins all smart contracts. My day job is to focus on L1 security research and attacks like these are the sort of nightmare situation that keeps my team up at night. The EF bug bounty would consider this type of issue in an Ethereum client as a `critical` category and award the max payout. This is a foundational issue that needs to be addressed in order to have a stable DEFI economy on Aleo. It does not matter how secure the smart contracts are that run on Aleo if attacks like this are possible.
