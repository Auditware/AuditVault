---
tags:
  - severity/high
  - has/github
  - has/poc
  - lang/solidity
  - sector/dex
  - platform/trailofbits
protocol: "[[FIVA Yield Tokenization Protocol]]"
auditors:
  - Tarun Bansal
report: "https://github.com/trailofbits/publications/blob/master/reviews/2025-05-FIVA-yieldtokenizationprotocol-securityreview.pdf"
genome:
  - "[[batch-item-auth]]"
  - "[[access-roles]]"
  - "[[access-control/missing-auth]]"
  - "[[dos/selective]]"
  - "[[known-pattern]]"
  - "[[frontrun]]"
  - "[[add-check]]"
  - "[[precondition/mev-capable]]"
  - "[[blast-radius/single-user]]"
---
# An attacker can grieve users by completing their liquidity provision operation

- id: 57089
- impact: HIGH
- protocol: FIVA Yield Tokenization Protocol
- reporter: Tarun Bansal (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2025-05-FIVA-yieldtokenizationprotocol-securityreview.pdf

## Summary


This report describes a vulnerability in the FIVA protocol that allows attackers to manipulate the liquidity provision process and cause users to receive significantly fewer LP tokens than expected. The attacker can do this by making a second token transfer before the legitimate user, sending a negligible amount of tokens while specifying the same receiver as the user and an arbitrary value for `min_lp_out`. This bypasses the slippage protection and can result in the user losing all of their deposited tokens. The report recommends short-term and long-term solutions to address this issue. 

## Details

## Vulnerability Assessment

**Difficulty:** High  

**Type:** Data Validation  

## Description  
An attacker can complete a user’s pool liquidity-providing action by transferring an insignificant amount to the pool with the `add_liquidity` message, mentioning the same receiver as the user. This causes the user to receive significantly fewer LP tokens than expected.

The FIVA protocol allows users to provide liquidity to the SY/PT pool. The liquidity provision process requires users to transfer both SY and PT tokens to the Pool contract with a `forward_payload`, including an `add_liquidity` operation. On the first token transfer, a Deposit contract is deployed to store the Pool address, recipient address, and the amount of SY or PT transferred by the user. On the second token transfer, the Deposit contract checks if both SY and PT are deposited and a slippage parameter is provided, then sends a `provide_lp` message to the Pool contract to mint LP tokens to the recipient.

```cpp
if (op == op::add_liquidity) {
    sy_balance += in_msg_body~load_coins();
    pt_balance += in_msg_body~load_coins();
    int min_lp_out = in_msg_body~load_coins();
    int with_unwrap = in_msg_body~load_uint(1);
    ;; TODO: consider to use min balance limit (i.e. 1000 instead of 0)
    if ((min_lp_out > 0) & (sy_balance > 0) & (pt_balance > 0)) {
        send_provide_lp(owner_addr, recipient_addr, sy_balance, pt_balance,
                         min_lp_out, query_id, with_unwrap);
        sy_balance = 0;
        pt_balance = 0;
    }
    save_data(owner_addr, recipient_addr, sy_balance, pt_balance);
    return ();
}
```

_Figure 9.1: The `add_liquidity` operation handler in the Deposit contract_  
`contracts/AMM/lp_deposit/deposit.fc#77-92`

However, an attacker can exploit this process by making the second transfer before the legitimate user, sending a negligible amount of tokens while specifying the same receiver as the user and an arbitrary value for `min_lp_out`. Because of the same pool and receiver combination, the attacker’s `add_liquidity` message is forwarded to the user’s Deposit contract, which then sends a `provide_lp` operation message to the pool. Since the amounts of PT and SY are imbalanced, the user will only receive the LP tokens minted by the minimum of the PT and SY tokens while losing all the tokens deposited in the first token transfer. The slippage protection is bypassed because the attacker controls the `min_lp_out` parameter.

## Exploit Scenario  
An attacker exploits a vulnerability in the two-phase deposit process by targeting users who have deposited 10,000 SY tokens into the Pool contract but have not yet deposited their PT tokens. After identifying a victim’s Deposit contract, the attacker sends a negligible amount of PT tokens, just enough to mint 1 nanoton LP token, to the pool while setting the victim as the recipient and specifying an extremely low `min_lp_out` value of 1, to bypass the slippage protection.

When the Deposit contract processes the `add_liquidity` operation, it executes the `send_provide_lp` function using the attacker’s manipulated parameters. The victim receives 1 nanoton LP token while losing their entire 10,000 SY token deposit.

## Recommendations  
- **Short term:** Include the address of the SY or PT token sender address in the Deposit contract’s `init_state` to make it unique for a combination of every Pool, recipient, and token sender.
- **Long term:** Create a system state specification with the state transition diagrams to document all the valid system states, specifically the intermediate temporary states. Follow the specification to ensure correct access control for all of the state transition functions.
