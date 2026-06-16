---
tags:
  - blockchain/starknet
  - lang/cairo
  - lang/rust
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/cdp
  - sector/lending
  - sector/options
protocol: "[[Opus]]"
auditors:
  - "[[jasonxiale]]"
report: "https://code4rena.com/reports/2024-01-opus"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# [H-01] Neglect of exceptional redistribution amounts in `withdraw_helper` function

- id: 30420
- impact: HIGH
- protocol: [[Opus]]
- reporter: jasonxiale (Code4rena)
- source: https://code4rena.com/reports/2024-01-opus

## Summary


The report discusses an issue in the `withdraw_helper` function of the `shrine` contract, which handles withdrawal logic for the `withdraw` and `seize` functions. The issue is that the function does not properly account for any new yang balance added to a trove during an exceptional redistribution, resulting in potential financial losses for users. The report recommends calling the `charge` function before calculating the new trove yang balance to mitigate this issue. The severity of this issue is considered high-risk as it could result in the loss of users' collateral. 

## Details


### Lines of code

<https://github.com/code-423n4/2024-01-opus/blob/main/src/core/shrine.cairo#L1382-L1392><br>
<https://github.com/code-423n4/2024-01-opus/blob/main/src/core/shrine.cairo#L1421-L1431>

### Description

The `withdraw_helper` function in the `shrine` contract handles withdrawal logic for both the `withdraw` and `seize` functions. It is responsible for updating trove balances, total yang balances, and charging interest for the trove via the `charge` function. However, there is an oversight in the current implementation:

```cairo
fn withdraw_helper(ref self: ContractState, yang: ContractAddress, trove_id: u64, amount: Wad) {
    ...

    let new_trove_balance: Wad = trove_balance - amount;
    let new_total: Wad = self.yang_total.read(yang_id) - amount;

    self.charge(trove_id);

    //@audit will not account for exceptional redistribution added to deposits balance in `charge` call

    self.yang_total.write(yang_id, new_total);
    self.deposits.write((yang_id, trove_id), new_trove_balance);

    // Emit events
    self.emit(YangTotalUpdated { yang, total: new_total });
    self.emit(DepositUpdated { yang, trove_id, amount: new_trove_balance });
}
```

The issue in the code above is that the `withdraw_helper` function proceeds to update the storage variables `yang_total` and `deposits` using the previously calculated `new_total` and `new_trove_balance` values, without accounting for any new yang balance added to the trove after an exceptional redistribution. This results in neglecting any exceptional redistributions added to the `deposits` balance during the `charge` call :

```cairo
fn charge(ref self: ContractState, trove_id: u64) {
    ...

    // If there was any exceptional redistribution, write updated yang amounts to trove
    if updated_trove_yang_balances.is_some() {
        let mut updated_trove_yang_balances = updated_trove_yang_balances.unwrap();
        loop {
            match updated_trove_yang_balances.pop_front() {
                Option::Some(yang_balance) => {
                    //@audit will updated the trove yang balance
                    self.deposits.write((*yang_balance.yang_id, trove_id), *yang_balance.amount);
                },
                Option::None => { break; },
            };
        };
    }

    ...
}
```

Because the trove `deposits` map is changed in the `charge` function but `withdraw_helper` uses directly the value `new_trove_balance`, which was calculated before the `charge` call, the exceptional redistribution added to `deposits` will be overridden and will be neglected in the trove yang balance.

This oversight could result in financial losses for all protocol users. When users withdraw yang amounts, any exceptional redistributions that should have been added to their trove balances will be neglected and lost.

### Impact

Users are at risk of losing all yang exceptional redistribution amounts due to an error in the `withdraw_helper` function, which causes it to neglect any yang-added redistribution to the trove `deposits` map.

### Proof of concept

Let's take a simple scenario to highlight this issue:

- Bob wants to withdraw a 100 amount of yang (`yang_id`) from his trove (`trove_id`) certain, we had the following state before the tx:

    `deposits(yang_id, trove_id) = 1000`

- When Bob calls `abbot.withdraw`, `withdraw_helper` will be invoked under the hood in the shrine contract which will first calculate the new yang trove balance:

    `new_trove_balance = trove_balance - amount = 1000 - 100 = 900`

- An exceptional redistribution did happen so when the `charge` function is called it will update the trove yang `deposits` balance, so now we have (suppose redistribution is 50 yang per trove, for example):

    `deposits(yang_id, trove_id) = 1000 + 50 = 1050`

- After calling `charge`, the `withdraw_helper` function will set the trove yang balance, `v`, to the previously calculated `new_trove_balance`, so we will have:

    `deposits(yang_id, trove_id) = 1000 - 100 = 900`

- We see that the yang amount added from exceptional redistribution is completely neglected as we should have:

    `deposits(yang_id, trove_id) = 1000 - 100 + 50 = 950`

Thus, as demonstrated in this simplified example, the issue will cause the loss of any exceptional redistribution amounts for the users resulting in a financial losses.

### Tools Used

VS Code

### Recommended Mitigation

To address this issue, the `charge` function should be called before calculating the new trove yang balance (`new_trove_balance`). This ensures that any exceptional redistributions are accounted for before updating the trove balance and total yang balance:

```diff
fn withdraw_helper(ref self: ContractState, yang: ContractAddress, trove_id: u64, amount: Wad) {
        let yang_id: u32 = self.get_valid_yang_id(yang);

        //@audit add exceptional redistribution before calculating `new_trove_balance`
++      self.charge(trove_id);

        // Fails if amount > amount of yang deposited in the given trove
        let trove_balance: Wad = self.deposits.read((yang_id, trove_id));
        assert(trove_balance >= amount, 'SH: Insufficient yang balance');

        let new_trove_balance: Wad = trove_balance - amount;
        let new_total: Wad = self.yang_total.read(yang_id) - amount;

--      self.charge(trove_id);

        self.yang_total.write(yang_id, new_total);
        self.deposits.write((yang_id, trove_id), new_trove_balance);

        // Emit events
        self.emit(YangTotalUpdated { yang, total: new_total });
        self.emit(DepositUpdated { yang, trove_id, amount: new_trove_balance });
    }
```

### Assessed type

Context

**[tserg (Opus) confirmed and commented via duplicate issue #211](https://github.com/code-423n4/2024-01-opus-findings/issues/211#issuecomment-1931432990):**
> This is valid - potentially fixed.

**[0xsomeone (judge) commented](https://github.com/code-423n4/2024-01-opus-findings/issues/206#issuecomment-1964589887):**
 > The warden has demonstrated how an exception trove redistribution will not be properly tracked by the withdrawal helper, resulting in an unsynchronized accounting state for the Opus system whereby the user will lose the collateral they acquired in the redistribution.
> 
> I believe a high-risk severity is appropriate as it details a scenario in which the collateral balances of users will potentially lose the full redistributed collateral.

***
