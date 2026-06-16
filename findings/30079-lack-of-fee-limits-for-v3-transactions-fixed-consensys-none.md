---
tags:
  - blockchain/starknet
  - lang/cairo
  - lang/solidity
  - platform/consensys
  - has/github
  - severity/high
  - sector/account
  - sector/governance
  - sector/infra
  - sector/multisig
  - sector/options
protocol: "[[Argent Account & Argent Multisig Starknet Transaction V3 Updates]]"
auditors:
  - "[[Heiko Fisch]]"
report: "https://consensys.net/diligence/audits/2024/01/argent-account-argent-multisig-starknet-transaction-v3-updates/"
genome:
  - "[[unbounded-loop]]"
  - "[[direct-drain]]"
  - "[[account-ownership]]"
  - "[[circuit-constraint-completeness]]"
---
# Lack of Fee Limits for V3 Transactions ✓ Fixed

- id: 30079
- impact: HIGH
- protocol: [[Argent Account & Argent Multisig Starknet Transaction V3 Updates]]
- reporter: Heiko Fisch (ConsenSys)
- source: https://consensys.net/diligence/audits/2024/01/argent-account-argent-multisig-starknet-transaction-v3-updates/

## Summary


This bug report discusses a potential vulnerability in the Starknet contract that could allow a malicious Guardian to drain a user's account by signing an escape transaction with an excessive fee limit. Currently, the only sequencer is operated by StarkWare and charges a fair price for the L1 costs. However, in a more decentralized Starknet future, there may be more sequencers that could potentially exploit this vulnerability. The report recommends implementing limits on the amount of STRK that can be spent on fees for both L1_GAS and L2_GAS to prevent this type of attack. The details of the L2 fee mechanism have not yet been specified, so caution is advised. 

## Details

#### Resolution



Fixed in [PR-266](https://github.com/argentlabs/argent-contracts-starknet-private/pull/266/) by introducing limits on the v3 transaction fees through two separate maximums:


* `MAX_ESCAPE_TIP_STRK = 1 STRK` which limits the result of multiplying `tip * L2_GAS.max_amount`.
* `MAX_ESCAPE_MAX_FEE_STRK = 50 STRK` which limits the sum of all of the following:
	+ `L1_GAS.max_price_per_unit * L1_GAS.max_amount`,
	+ `L2_GAS.max_price_per_unit * L2_GAS.max_amount`,
	+ `tip * L2_GAS.max_amount`, the tip described above.




#### Description


Starknet transactions have fields to specify the maximum amount of fees the sequencer may take. For v1 transactions, this is just one field with the name `max_fee` and unit WEI (i.e., 10^{-18} ETH). For the newly introduced v3 transactions, the situation is a bit more complicated. First of all, there are two types of fees: `L1_GAS` and `L2_GAS`. The former is needed to cover the gas costs on L1 that the transaction produces, the second is supposed to cover the L2 costs and will be utilized in the upcoming fee market. For each of these two fee types, a transaction specifies the `max_amount` and the `max_price_per_unit`. In addition to that, there is also a `tip` field to help facilitate the market. It is noteworthy that the `max_price_per_unit` fields – even for `L1_GAS` – and the `tip` will be specified in 10^{-18} STRK/gas. Another point worth highlighting is that, as Starknet has built-in account abstraction, the fee for a transaction is paid by the account.


Currently, the only sequencer is operated by StarkWare and charges a fair price for the L1 costs. (And L2 fees are not being collected yet.) Hence, even if a transaction specifies a very high fee limit, the sequencer takes only what is really needed and not everything that the transaction limit(s) would allow. For the sake of brevity, let us call such a sequencer “nice”. In a more decentralized Starknet future, there will probably be more sequencers, and they may not necessarily be nice, meaning they may take more in fees than what the L1 costs demand of them. Also, it is not impossible that the rules for the StarkWare sequencer change at some point in the future (although it seems reasonable to assume that this would be properly announced). But – to summarize this discussion – currently there is only sequencer, and it is nice. The attack we describe below requires a “non-nice” sequencer – and, as we will explain shortly, a malicious Guardian – and is therefore, at the time of writing this report, not feasible, even assuming the Guardian acts with malice.


As explained in more detail in the [System Overview of our previous report](https://consensys.io/diligence/audits/2023/06/argent-account-multisig-for-starknet/#system-overview), there is an escape mechanism which (1) allows users to reclaim control of their account if the Guardian fails to cooperate and (2) allows Guardians to assign a new owner if the original owner lost access to their key. Crucially and unlike other account activities, escape-related actions require only a single signer. Hence, a general attack scenario that the account should implement protective measures against is a malicious Guardian trying to drain the account by signing an escape transaction with an excessive fee limit. A similar situation arises if, instead of the Guardian being malicious, a third party comes into possession of the owner’s private key, but to keep the discussion more concise, we’ll consider this subsumed under “malicious Guardian.” As mentioned above, such an attack is not possible with a nice sequencer, but – ideally – the account contract should not rely on that.


Examining the relevant code, we see that the fee restriction logic for v1 transactions – which is known from earlier versions of the contract – is still present:


**src/account/argent\_account.cairo:L47-L48**



```
/// Limits fee in escapes
const MAX\_ESCAPE\_MAX\_FEE: u128 = 50000000000000000; // 0.05 ETH

```
**src/account/argent\_account.cairo:L772-L774**



```
} else if tx\_info.version == TX\_V1 || tx\_info.version == TX\_V1\_ESTIMATE {
 // other fields not available on V1
 assert(tx\_info.max\_fee <= MAX\_ESCAPE\_MAX\_FEE, 'argent/max-fee-too-high');

```
And there is a limit on the total tip, i.e., `tip * L2_GAS.max_amount`, for v3 transactions:


**src/account/argent\_account.cairo:L49-L50**



```
/// Limits tip in escapes
const MAX\_ESCAPE\_TIP: u128 = 1\_000000000000000000; // 1 STRK

```
**src/account/argent\_account.cairo:L758-L771**



```
// Limit the maximum tip while escaping (max\_fee returns 0 on TX\_V3)
let max\_l2\_gas: u64 = loop {
 match tx\_info.resource\_bounds.pop\_front() {
 Option::Some(r) => { if \*r.resource == 'L2\_GAS' {
 break \*r.max\_amount;
 } },
 Option::None => {
 // L2\_GAS not found
 break 0;
 }
 };
};
let max\_tip = tx\_info.tip \* max\_l2\_gas.into();
assert(max\_tip <= MAX\_ESCAPE\_TIP, 'argent/tip-too-high');

```
However, no limit is imposed on the amount of STRK for `L1_GAS` or `L2_GAS`. Regarding `L1_GAS`, this means that a malicious Guardian could specify an excessive `max_price_per_unit` in an escape transaction and – with the help of a non-nice sequencer – drain the account’s entire STRK balance. Since the sequencer can pocket the difference between `max_price_per_unit` and what is really needed on L1, it is also conceivable that the two parties collude for an attack.


For `L2_GAS`, the situation is more difficult to assess because the fee market has not been implemented yet. It is very well possible that the “base fee” will be set by the network – similar to the base fee on Ethereum, see [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559). In this case, constraining only the tip, as is currently the case, would be sufficient to prevent the `L2_GAS` part of this kind of attack, as long as one is comfortable with risking to pay any fee the market demands. Nevertheless, as the details of the L2 fee mechanism have not yet been specified, we advise caution.


#### Recommendation


For both `L1_GAS` and `L2_GAS`, the amount of STRK that can be spent on fees should be limited, similar to the limit on `max_fee` for v1 transactions. There are several different – and equally viable – ways to do this: separately for `L1_GAS` and `L2_GAS` or together; including the tip in a (higher) limit or handling it separately.


One aspect of the L2 fees that has, to the best of our knowledge, not been decided yet is whether the `tip` will be considered part of the `max_price_per_unit` (similar to EIP-1559) or if it can be on top of that. Hence, to be on the safe side, the latter should be considered possible, and the tip should not be left unconstrained.
