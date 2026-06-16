---
tags:
  - lang/rust
  - lang/sway
  - sector/bridge
  - sector/oracle
  - platform/halborn
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
  - novelty/variant
protocol: "[[Swaylend Protocol]]"
auditors:
  - "[[Halborn]]"
report: "https://www.halborn.com/audits/swaylend/swaylend-protocol"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[variant]]"
  - "[[pyth-oracle-completeness]]"
---
# Missing funds validation in update\_price\_feeds

- id: 50586
- impact: HIGH
- protocol: [[Swaylend Protocol]]
- reporter: Halborn
- source: https://www.halborn.com/audits/swaylend/swaylend-protocol

## Summary


This bug report describes an issue with the function `update_price_feeds` in the Pyth oracle. This function is responsible for updating the price feed by paying a fee and pushing the most recent price. However, the code does not check if the funds sent by the user are equal to the specified fee, resulting in a loss of funds for depositors. 

To demonstrate this issue, a proof of concept is provided where the function `update_price_feeds` is called internally and the fee is not checked, allowing for the use of market funds instead of the caller's assets. 

The BVSS score for this bug is 8.4, indicating a medium severity. The recommendation is to require that the passed value is equal to the specified fee in order to prevent the use of market funds. This issue has been resolved in the code by implementing this check. The remediation hash for this fix is provided for reference.

## Details

##### Description

The function `update_price_feeds` is responsible of updating the Pyth oracle by paying a given fee and pushing the most recent price (as Pyth oracles follow a push-like behavior where users are the ones which update the price feed at will). However, it is not checked that the funds sent by the user are indeed the passed `update_fee`, so such amount is retrieved from the internal balances of the market (which is a loss of funds for depositors).

##### Proof of Concept

The function `update_price_feeds` is responsible of updating the Pyth price feed from within the market contract. However, Pyth oracles need a fee being paid upfront, as seen in

<https://github.com/pyth-network/pyth-crosschain/blob/e3d8bfeff19906afc9640a52cadc165473560ff1/target_chains/fuel/contracts/pyth-contract/src/main.sw#L422>

```
#[storage(read, write), payable]
fn update_price_feeds(update_data: Vec<Bytes>) {
    require(
        msg_asset_id() == AssetId::base(),
        PythError::FeesCanOnlyBePaidInTheBaseAsset,
    );

    ...

    let required_fee = total_fee(total_number_of_updates, storage.single_update_fee);
    require(msg_amount() >= required_fee, PythError::InsufficientFee);

    ...
}
```

For that, the function `update_price_feeds` and its internal version calls `update_price_feeds` in the oracle endpoint and passes as fee `update_fee`. However, it does not check that the `msg.value` is equal to `update_fee`, so it is possible to update the price feeds by sending funds from the market balance instead of the caller assets.

```
#[payable, storage(read)]
fn update_price_feeds_internal(update_fee: u64, update_data: Vec<Bytes>) {
    let contract_id = storage.pyth_contract_id.read();
    require(contract_id != ZERO_B256, Error::OracleContractIdNotSet);

    let oracle = abi(PythCore, contract_id);
    oracle.update_price_feeds {
        asset_id: FUEL_ETH_BASE_ASSET_ID, coins: update_fee
    } // @audit not checked update_fee == msg.value
    (update_data);
}
```

##### BVSS

[AO:A/AC:L/AX:M/C:N/I:N/A:N/D:C/Y:N/R:N/S:C (8.4)](/bvss?q=AO:A/AC:L/AX:M/C:N/I:N/A:N/D:C/Y:N/R:N/S:C)

##### Recommendation

Require that the passed value is equal to the `update_fee` argument to avoid using market's funds.

##### Remediation

**SOLVED**: The code now checks for the passed amount to be higher or equal than `update_fee` and the token passed is ETH.

##### Remediation Hash

<https://github.com/Swaylend/swaylend-monorepo/commit/622bd073b48cfc211e8b7d6d0474186c61903e6f#diff-17baa8be2b4713b0056e503d498adfbeaf1e214298728ef86d5ef6dc7e71a810>
