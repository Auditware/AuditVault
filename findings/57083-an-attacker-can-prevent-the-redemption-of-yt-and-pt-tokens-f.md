---
tags:
  - lang/solidity
  - platform/trailofbits
  - has/github
  - has/poc
  - severity/high
  - sector/vault
protocol: "[[FIVA Yield Tokenization Protocol]]"
auditors:
  - Tarun Bansal
report: "https://github.com/trailofbits/publications/blob/master/reviews/2025-05-FIVA-yieldtokenizationprotocol-securityreview.pdf"
genome:
  - "[[dos-resistance]]"
  - "[[variant]]"
---
# An attacker can prevent the redemption of YT and PT tokens from the YTMinter contract

- id: 57083
- impact: HIGH
- protocol: FIVA Yield Tokenization Protocol
- reporter: Tarun Bansal (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2025-05-FIVA-yieldtokenizationprotocol-securityreview.pdf

## Summary


The report identifies a high difficulty bug in the FIVA protocol related to the redemption process for YT and PT tokens. An attacker can prevent users from redeeming their tokens for SY tokens by sending a redeem message with the user as the receiver. This is possible because the RedeemDeposit contract, which is used in the redemption process, does not include the token transfer initiator in its init_state. As a result, anyone can send a `register_jetton` message to a user's existing RedeemDeposit contract, causing a delay or preventing the redemption process. This can be exploited by setting up a bot to complete the target user's redemptions. The report recommends including the token sender address in the RedeemDeposit contract's init_state in the short term and creating a system state specification in the long term to ensure correct access control for all state transition functions. 

## Details

## Diﬃculty: High

## Type: Conﬁguration

## Description
An attacker can complete a user’s redemption of YT and PT tokens from the YTMinter contract by sending the redeem message with the user as the receiver. This allows attackers to prevent users from redeeming their YT and PT tokens for SY tokens.

The FIVA protocol allows users to redeem their YT and PT tokens for SY tokens before maturity. This redemption process requires users to transfer both YT and PT tokens to the YTMinter contract with a `forward_payload`, including a `redeem` or `reddem_and_unwrap` operation, and the recipient of the SY tokens. 

On the first token transfer, the YTMinter contract deploys a RedeemDeposit contract with the `register_jetton` message. The RedeemDeposit contract stores the YTMinter address, the recipient address, and the PT or YT token amount transferred by the user:

```solidity
() register_jetton(slice recipient_addr, cell redeem_deposit_code, int pt_amount,
int yt_amount, int query_id, int unwrap) impure {
    cell state_init = calculate_redeem_deposit_state_init(my_address(),
    recipient_addr, redeem_deposit_code);
    slice redeem_deposit_addr = calc_redeem_deposit_address(state_init);
    var msg_body = begin_cell()
        .store_op(op::register_jetton)
        .store_query_id(query_id)
        .store_coins(pt_amount)
        .store_coins(yt_amount)
        .store_uint(unwrap, 1)
        .end_cell();
    var msg = begin_cell()
        .store_msg_flag(msg_flag::bounceable)
        .store_slice(redeem_deposit_addr)
        .store_coins(0)
        .store_msgbody_prefix_stateinit(state_init, msg_body)
        .end_cell();
    send_raw_message(msg, CARRY_REMAINING_BALANCE);
}
```

**Figure 3.1:** The register_jetton function of the YTMinter contract (`contracts/YT/redeem.fc#L20-L37`)

On the second token transfer, the YTMinter computes a RedeemDeposit address using self-address and the provided recipient address as the init_state data and sends the `register_jettons` message to it. The same recipient as the first transfer will result in the same RedeemDeposit address computation for the second transfer because of the same init_state data. 

When the user has transferred a non-zero amount of both the PT and YT tokens, the RedeemDeposit contract sends a `finalize_redeem` message to the YTMinter contract and destroys itself:

```solidity
if (op == op::register_jetton) {
    int pt_balance_msg = in_msg_body~load_coins();
    int yt_balance_msg = in_msg_body~load_coins();
    int with_unwrap = in_msg_body~load_uint(1);
    int pt_sum_balance = pt_balance + pt_balance_msg;
    int yt_sum_balance = yt_balance + yt_balance_msg;
    
    if ((pt_sum_balance > 0) & (yt_sum_balance > 0)) {
        send_finalize_redeem(admin_addr, recipient_addr, msg_value, pt_sum_balance,
        yt_sum_balance, query_id, with_unwrap);
        pt_sum_balance = 0;
        yt_sum_balance = 0;
    }
    
    save_data(admin_addr, recipient_addr, pt_sum_balance, yt_sum_balance);
    return ();
}
```

**Figure 3.2:** The register_jetton operation handler in the RedeemDeposit contract (`contracts/YT/redeem/deposit.fc#L83-L99`)

The finalize_redeem operation handler of the YTMinter contract compares the PT and YT amounts transferred by the user, redeems the SY tokens for a minimum of the PT and YT token amounts, and transfers the remaining amount of PT or YT tokens back to the user. 

The lack of the token transfer initiator in the RedeemDeposit contract’s init_state allows anyone to send a `register_jetton` message to a user’s existing RedeemDeposit contract by specifying the user as the `recipient_addr` of the redeem message. An attacker can use this to complete a user’s redemption by transferring only 1 nano ton of YT or PT token. The user gets back the remaining tokens and needs to transfer them back to the YTMinter contract to re-initiate the redemption process. Thus, an attacker can prevent or delay the redemption of the YT and PT tokens to grieve the users by setting up a bot to complete the target user’s redemptions.

## Exploit Scenario
Alice transfers 1e9 nano ton PT tokens to the YTMinter contract with the redeem operation and her own address as the recipient in the `forward_payload`. Now, before Alice transfers her YT tokens, Eve transfers 1 nano ton YT token to the YTMinter with the redeem operation and Alice’s address as the recipient in the `forward_payload`. Eve’s redeem message sends a `register_jetton` message to Alice's RedeemDeposit contract, which redeems only 1 nano ton YT and PT for Alice and returns the remaining 999999999 nano ton YT tokens to Alice.

## Recommendations
- Short term, include the address of the PT or YT token sender address in the RedeemDeposit contract’s init_state to make it unique for a combination of every YTMinter, redeemer, and recipient.
- Long term, create a system state specification with the state transition diagrams to document all the valid system states, specifically the intermediate temporary states. Follow the specification to ensure correct access control for all of the state transition functions.
