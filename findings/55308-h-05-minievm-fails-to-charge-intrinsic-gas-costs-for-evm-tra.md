---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/infra
protocol: "[[Initia]]"
auditors:
  - berndartmueller
report: "https://code4rena.com/reports/2025-02-initia-cosmos"
genome:
  - "[[fee-accounting]]"
  - "[[variant]]"
---
# [H-05] Minievm fails to charge intrinsic gas costs for EVM transactions, allowing the abuse of the accesslist to consume computational resources without proper compensation

- id: 55308
- impact: HIGH
- protocol: Initia
- reporter: berndartmueller (Code4rena)
- source: https://code4rena.com/reports/2025-02-initia-cosmos

## Summary


The minievm, a program used for Ethereum Virtual Machine (EVM) transactions, fails to charge the proper amount of gas for certain operations, which can lead to a significant risk of denial of service (DoS) attacks. This is due to a lack of charging for intrinsic gas costs, which are considered necessary for the accesslist feature. This can result in users not properly paying for the computational resources required for their transactions, potentially leading to abuse of network resources. The recommended mitigation is to charge the proper amount of intrinsic gas as outlined in the EIP-2930 standard. This issue has been confirmed and mitigated by the developers.

## Details



<https://github.com/initia-labs/minievm/blob/744563dc6a642f054b4543db008df22664e4c125/x/evm/keeper/context.go# L372-L385>

<https://github.com/initia-labs/minievm/blob/744563dc6a642f054b4543db008df22664e4c125/x/evm/keeper/context.go# L243-L252>

<https://github.com/initia-labs/minievm/blob/744563dc6a642f054b4543db008df22664e4c125/x/evm/keeper/context.go# L277-L290>

### Finding description and impact

The minievm fails to charge intrinsic gas costs for EVM transactions in `EVMStaticCallWithTracer()`, `EVMCallWithTracer()`, and `EVMCreateWithTracer()`. In the EVM, intrinsic gas costs are considered costs for e.g., the accesslist ([EIP-2930](https://eips.ethereum.org/EIPS/eip-2930)). For comparison, Evmos charges the intrinsic gas [here](https://github.com/evmos/evmos/blob/0402a01c9036b40a7f47dc2fc5fb4cfae019f5f1/x/evm/keeper/state_transition.go# L295).

According to the comment in [`x/evm/state/statedb.go# L610`](https://github.com/initia-labs/minievm/blob/744563dc6a642f054b4543db008df22664e4c125/x/evm/state/statedb.go# L610), EIP-2930 (access lists) is supposed to be supported. Overall, this represents a significant DoS risk to the network, as it allows for the potential abuse of computational resources without proper compensation.

### Proof of Concept

Per EIP-2930, the Berlin hard fork raised the “cold” cost of account access opcodes (such as `BALANCE`, all `CALL`(s), and `EXT*`) to 2600 and raised the “cold” cost of state access opcode (`SLOAD`) from 800 to 2100 while lowering the “warm” cost for both to 100.

However, EIP-2930 has the added benefit of lowering transaction costs due to the transaction’s 200 gas discount.

As a result, instead of paying 2600 and 2100 gas for a `CALL` and `SLOAD` respectively, the transaction only requires 2400 and 1900 gas for cold access, and subsequent warm access will only cost 100 gas.

In the EVM, `makeCallVariantGasCallEIP2929` [checks if the address is warm](https://github.com/initia-labs/evm/blob/3d312736d7fbf68af35df985b01536684bf6aafa/core/vm/operations_acl.go# L155-L192). If so, the gas costs are reduced. This is under the premise that the intrinsic gas costs have been paid upfront, which include the accesslist costs.

However, as the intrinsic gas is not charged at all in `minievm`, neither the regular 2600 and 2100 nor the discounted 2400 and 1900 gas for the `CALL` and `SLOAD` opcodes is paid for.

By providing a large number of distinct contract addresses in the accesslist, the user does not properly pay for the computational resources required to load the code from storage. Similar with `SLOAD`‘s.

This is additionally magnified by the fact that the access list is iterated on-chain when [processing the message](https://github.com/initia-labs/minievm/blob/744563dc6a642f054b4543db008df22664e4c125/x/evm/keeper/msg_server.go# L256), utilizing uncapped computational resources which the user does not explicitly pay for.

### Recommended mitigation steps

Consider charging intrinsic transaction gas, that considers the accesslist, as per EIP-2930.

**[leojin (Initia) confirmed and commented](https://code4rena.com/audits/2025-02-initia-cosmos/submissions/F-10?commentParent=PNRW8epitWM):**

> We fixed the intrinsic gas charge in this [PR](https://github.com/initia-labs/minievm/pull/170/files). But, since gas is charged on the cosmos side based on the transaction’s data size (like intrinsic gas do), it does not pose a significant DoS risk; therefore, its security level can be considered lower.

**[berndartmueller (warden) commented](https://code4rena.com/audits/2025-02-initia-cosmos/submissions/F-10?commentParent=f2n83oSzq3u):**

> It’s correct that the `ConsumeTxSizeGasDecorator` ante decorator charges gas per tx byte:
>
> 
```

> ctx.GasMeter().ConsumeGas(params.TxSizeCostPerByte*storetypes.Gas(len(ctx.TxBytes())), "txSize")
> 
```

>
> where `TxSizeCostPerByte = 10` by default.
>
> However, this is, in my opinion, not sufficient. Considering that the access list `AccessList []AccessTuple` is basically an array of EVM addresses (`Address string`), which needs 20 bytes + a few bytes of overhead for the encoding per entry. To simplify calculations, let’s assume that an address entry in the access list requires 30 bytes. This results in `30 * 10 = 300 gas` being charged by `ConsumeTxSizeGasDecorator(..)`.
>
> However, this single access list entry equals 2600 of gas that would have been charged if the access list is considered in the intrinsic gas. That’s a `2600 - 300 = 2300 gap`.
>
> Hence, the gas that is charged per tx byte is not sufficient, leaving the DoS risk to be significant and justifying high severity.

**[LSDan (judge) commented](https://code4rena.com/audits/2025-02-initia-cosmos/submissions/F-10?commentParent=f2n83oSzq3u&commentChild=9NqmtSTdUhy):**

> Thank you for the clarified example. On review, I agree that this rises to the level of high risk.

**[Initia mitigated](https://github.com/code-423n4/2025-03-initia-cosmos-mitigation?tab=readme-ov-file# mitigation-of-high--medium-severity-issues):**

> Fixed intrinsic gas charge.

**Status:** Mitigation confirmed. Full details in reports from [0xAlix2](https://code4rena.com/audits/2025-03-initia-cosmos-mitigation-review/submissions/S-18), [berndartmueller](https://code4rena.com/audits/2025-03-initia-cosmos-mitigation-review/submissions/S-1) and [Franfran](https://code4rena.com/audits/2025-03-initia-cosmos-mitigation-review/submissions/S-38).

---


