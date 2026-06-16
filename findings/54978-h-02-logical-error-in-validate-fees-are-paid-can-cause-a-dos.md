---
tags:
  - lang/rust
  - sector/dex
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
protocol: "[[MANTRA]]"
auditors:
  - carrotsmuggler
report: "https://code4rena.com/reports/2024-11-mantra-dex"
genome:
  - "[[dos-resistance]]"
  - "[[fee-calculation]]"
  - "[[variant]]"
  - "[[math-is-safe]]"
  - "[[fix-arithmetic]]"
---
# [H-02] Logical error in `validate_fees_are_paid` can cause a DoS or allow users to bypass fees if `denom_creation_fee` includes multiple coins, including `pool_creation_fee`, and the user attempts to pay all fees using only `pool_creation_fee`

- id: 54978
- impact: HIGH
- protocol: MANTRA
- reporter: carrotsmuggler (Code4rena)
- source: https://code4rena.com/reports/2024-11-mantra-dex

## Summary


This bug report discusses an issue in the code for creating a pool in a decentralized exchange. The problem occurs when a user pays both the `denom_creation_fee` and `pool_creation_fee` using the same coin. This can lead to a denial of service attack or allow the user to bypass one of the fees. The report provides a proof of concept for how this can happen and recommends a mitigation strategy to combine the amounts and perform the validation. The severity of the bug is debated by the team, with some considering it a low risk due to the current configuration only allowing one token to be used for payment. However, the judge considers it a high risk as the code in question may be changed in the future.

## Details



[/contracts/pool-manager/src/helpers.rs# L561-L592](https://github.com/code-423n4/2024-11-mantra-dex/blob/main/contracts/pool-manager/src/helpers.rs# L561-L592)

### Finding description and Impact

When a user creates a pool, they must pay both `denom_creation_fee` and `pool_creation_fee`.

The `denom_creation_fee` can be paid using multiple coins or a single coin and may also include the same coin as `pool_creation_fee`. If multiple `denom_creation_fee` coins options are available, and one of them matches the coin used for `pool_creation_fee`, it can lead to issues.

### Problem Scenario

The issue arises when the user attempts to pay both fees using the same coin.

1. **Different Fee Amounts:** If the user pays both fees in the same coin, with different amounts for `denom_creation_fee` and `pool_creation_fee`, they might add both amounts and send the total. When validating the `pool_creation_fee`, the check `paid_pool_fee_amount` `==` `pool_creation_fee`.amount will fail, causing a DoS.
```

            ensure!(
                paid_pool_fee_amount == pool_creation_fee.amount,
                ContractError::InvalidPoolCreationFee {
                    amount: paid_pool_fee_amount,
                    expected: pool_creation_fee.amount,
                }
            );
```

2. **Same Fee Amounts:** If both fees have the same amount and the user pays only once, they can bypass one of the fees entirely, resulting in a fee payment bypass.
```

            ensure!(
                paid_pool_fee_amount == pool_creation_fee.amount, //-> HERE It will pass
                ContractError::InvalidPoolCreationFee {
                    amount: paid_pool_fee_amount,
                    expected: pool_creation_fee.amount,
                }
            );

            total_fees.push(Coin {
                denom: pool_fee_denom.clone(),
                amount: paid_pool_fee_amount,
            });

            // Check if the user paid the token factory fee in any other of the allowed denoms
            let tf_fee_paid = denom_creation_fee.iter().any(|fee| {
                let paid_fee_amount = info
                    .funds
                    .iter()
                    .filter(|fund| fund.denom == fee.denom)
                    .map(|fund| fund.amount)
                    .try_fold(Uint128::zero(), |acc, amount| acc.checked_add(amount))
                    .unwrap_or(Uint128::zero());

                total_fees.push(Coin {
                    denom: fee.denom.clone(),
                    amount: paid_fee_amount,
                });

                paid_fee_amount == fee.amount  //-> HERE It will pass
            });
```

As both are equal, that’s why both checks will pass. The impact is High as it can cause a DoS and allow the bypass of one of the fees.

### Proof of Concept

**How it happens when amounts are different:**

1. The user sends a transaction to create a pool by combining both fee amounts into a single payment.
2. The transaction reverts because the check `paid_pool_fee_amount == pool_creation_fee.amount` evaluates to false.
3. If the user attempts to bypass this, the next check for `denom_creation_fee` will also fail.

**How it happens when amounts are the same:**

1. The attacker will send only one amount because both checks (for `pool_creation_fee` and `denom_creation_fee`) will pass, as both amounts are equal. This allows the attacker to pay only once.

### Recommended mitigation steps

We can verify whether the user is paying with one coin or multiple coins. If the user is paying with one coin, we can combine both amounts and perform the validation. Similarly, if the user is paying with multiple coins, we can apply the same approach. This will effectively mitigate the issue.

**[jvr0x (MANTRA) confirmed and commented](https://code4rena.com/audits/2024-11-mantra-dex/submissions/F-2?commentParent=WTvR6w3CBnP):**

> It is valid. However, considering the chain only supports 1 token to pay for the token factory at the moment, I wouldn’t deem it as high, but low.

**[3docSec (judge) commented](https://code4rena.com/audits/2024-11-mantra-dex/submissions/F-2?commentParent=WTvR6w3CBnP&commentChild=8SdRE6Pzuzs):**

> I see your point, and while I would agree if this were a bug bounty program (funds are not at risk in live contracts), I consider this a High, because what counts is the code in-scope and not the live config, unless the in-scope code is hardcoded to have only one token and can’t be changed by config.

---


