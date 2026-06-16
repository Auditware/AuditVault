---
tags:
  - lang/solidity
  - platform/trailofbits
  - has/github
  - severity/high
  - sector/account
  - sector/dex
protocol: "[[Swap Coffee]]"
auditors:
  - "[[Bo Henderson]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/2025-05-swap-coffee-ton-dex-securityreview.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[access-roles]]"
---
# Malformed admin update data

- id: 57114
- impact: HIGH
- protocol: [[Swap Coffee]] TON DEX
- reporter: Bo Henderson (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2025-05-swap-coffee-ton-dex-securityreview.pdf

## Summary


This bug report discusses a problem with the `update_code_cell` function in the Swap Coffee protocol's factory contract. This function is used to update the initialization code for a specific contract, but it currently has a flaw that can cause the entire factory contract to become unusable. This happens when the function is used to update the code for the `lp_wallet` contract, which results in malformed data being set and all subsequent messages to the factory contract failing. The report recommends short-term and long-term solutions to fix this issue, which involve adding a second code cell argument and implementing tests for administrative functions.

## Details

## Diﬃculty: Medium

## Type: Access Controls

## Description
The `update_code_cell` helper function writes a cell with the wrong structure to storage. If the `opcodes::update_code_cell` functionality is ever used, the factory contract will become permanently unusable. 

For context, the `load_data` method, shown in Figure 4.1, defines the expected state structure: two addresses followed by two references to cells that contain initialization code.

```solidity
() load_data() impure inline {
    slice cs = get_data().begin_parse();
    storage::admin_address = cs~load_msg_addr();
    storage::withdrawer_address = cs~load_msg_addr();
    slice code_cs = cs~load_ref().begin_parse();
    storage::lp_wallet_code_cell = code_cs~load_ref();
    storage::init_code_cell = code_cs~load_ref();
    storage::liquidity_depository_code_cell = code_cs~load_ref();
    storage::pool_creator_code_cell = code_cs~load_ref();
    code_cs = cs~load_ref().begin_parse();
    storage::vault_code_dict = code_cs~load_dict();
    storage::pool_code_dict = code_cs~load_dict();
}
```
Figure 4.1: The load_data function of the factory contract (dex/contracts/factory.fc#L18–L32)

The `update_code_cell` helper function, shown in Figure 4.2, sets malformed data consisting of two addresses and one reference to a cell containing initialization code. Attempting to execute `load_data` after executing the `update_code_cell` function will result in an out-of-bounds reference error. Because `load_data` is called at the beginning of the `recv_internal` entrypoint function, all messages sent to this contract will fail, and the factory contract will become permanently unusable.

```solidity
() update_code_cell(cell code_cell) impure inline {
    set_data(
        begin_cell()
        .store_slice(storage::admin_address)
        .store_slice(storage::withdrawer_address)
        .store_ref(code_cell)
        .end_cell()
    );
}
```
Figure 4.2: The update_code_cell function of the factory contract (dex/contracts/factory.fc#L57–L65)

## Exploit Scenario
Alice, a Swap Coﬀee admin, attempts to deploy a minor update to the `lp_wallet` code in the factory. She executes the `update_code_cell` opcode on the factory contract and supplies the new `lp_wallet` code in the message body. As a result, malformed data is set, and all subsequent messages to this contract will throw errors. The `internal_recv` function no longer works, and the factory is now unusable. The Swap Coﬀee protocol must be redeployed.

## Recommendations
- **Short term**: Add a second code cell argument to the `update_code_cell` function and save references to both. Additionally, add verification logic to ensure these two cells contain the correct number of initialization code references.
- **Long term**: Add tests for all administrative functions to check whether the system is in the expected state following privileged actions.
