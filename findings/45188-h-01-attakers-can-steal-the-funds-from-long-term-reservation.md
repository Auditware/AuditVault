---
tags:
  - lang/rust
  - platform/code4rena
  - has/github
  - severity/high
  - sector/nft
protocol: "[[Coded Estate]]"
auditors:
  - "[[Ch_301]]"
report: "https://code4rena.com/reports/2024-10-coded-estate"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
---
# [H-01] Attakers can steal the funds from long-term reservation

- id: 45188
- impact: HIGH
- protocol: [[Coded Estate]]
- reporter: Ch\_301 (Code4rena)
- source: https://code4rena.com/reports/2024-10-coded-estate

## Summary


The bug report discusses a potential vulnerability in a protocol where an NFT owner can set the NFT for sale even if it is still under active rent. This can be done by using a specific function that sets a value to "true", allowing anyone to gain approval to buy the NFT. Additionally, there is another function that allows the owner or an approved address to withdraw funds before the rental period ends, which can be exploited by an attacker. This can result in the theft of funds from long-term reservations. The recommended solution is to modify the code to check for approval before allowing the withdrawal of funds. The bug has been acknowledged by the developer.

## Details


In this protocol NFT owner can set the NFT in sale even if it is still under active rent by triggering `execute.rs#setlistforsell()` which could set `token.sell.auto_approve` to a true value (means anyone can directly be approved and this will open multiple doors for attackers).

Users can call `execute.rs#setbidtobuy()` and send the necessary amount to gain approval of this NFT:

```rust
File: execute.rs#setbidtobuy()

675:             if token.sell.auto_approve {
676:                 // update the approval list (remove any for the same spender before adding)
677:                 let expires = Expiration::Never {  };
678:                 token.approvals.retain(|apr| apr.spender != info.sender);
679:                 let approval = Approval {
680:                     spender: info.sender.clone(),
681:                     expires,
682:                 };
683:                 token.approvals.push(approval);
684:                 
685:             }
```

Using the same function `setbidtobuy()` any address that has an existing bid in the NFT can cancel its bid and receive back all the initial funds (no fees in this function).

On the other side, the owner or any approved address can invoke `execute.rs#withdrawtolandlord()` and specify the receiver of the withdrawal funds (this function gives the homeowners the ability to withdraw a part of the funds even before the rent end, this is only for longterm rentals).

```rust
File: execute.rs

1787:     pub fn withdrawtolandlord(
/**CODE**/
1796:         address:String
1797:     ) -> Result<Response<C>, ContractError> {
/**CODE**/
1848:             .add_message(BankMsg::Send {
1849:                 to_address: address,
1850:                 amount: vec![Coin {
1851:                     denom: token.longterm_rental.denom,
1852:                     amount: Uint128::from(amount) - Uint128::new((u128::from(amount) * u128::from(fee_percentage)) / 10000),
```

However, the Attacker can create a sophisticated attack using `withdrawtolandlord()` and `setbidtobuy()`:
1. Choose an NFT that has a `token.sell.auto_approve == true` and an active long-term rental.
2. Call `setbidtobuy()` this will give him the necessary approval to finish the attack; he also needs to transfer the asked funds.
3. Trigger `withdrawtolandlord()` and transfer the maximum amount of tokens.

```rust
File: execute.rs#withdrawtolandlord()

1832:                 if item.deposit_amount - Uint128::from(token.longterm_rental.price_per_month) < Uint128::from(amount)  {
1833:                     return Err(ContractError::UnavailableAmount {  });
1834:                 }
```

4. Invoke `setbidtobuy()` to receive his original deposited funds.

### Impact

Steal the funds from long-term reservations using `setbidtobuy()`.

### Recommended Mitigation Steps

```diff
File: execute.rs
1787:     pub fn withdrawtolandlord(
1788:         &self,
1789:         deps: DepsMut,
1790:         env: Env,
1791:         info: MessageInfo,
1792:         token_id: String,
1793:         tenant: String,
1794:         renting_period: Vec<String>,
1795:         amount:u64,
1796:         address:String
1797:     ) -> Result<Response<C>, ContractError> {
1798:         let mut token = self.tokens.load(deps.storage, &token_id)?;
1799: 
-1800:         self.check_can_send(deps.as_ref(), &env, &info, &token)?;
+1800:         self.check_can_approve(deps.as_ref(), &env, &info, &token)?;
```

### Assessed type

Invalid Validation

**[blockchainstar12 (Coded Estate) acknowledged](https://github.com/code-423n4/2024-10-coded-estate-findings/issues/41#event-14661733016)**

***
