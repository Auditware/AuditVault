---
tags:
  - blockchain/starknet
  - lang/cairo
  - lang/rust
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/cdp
  - sector/lending
  - sector/options
protocol: "[[Opus]]"
auditors:
  - "[[TrungOre]]"
report: "https://code4rena.com/reports/2024-01-opus"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-manipulation-resistance]]"
---
# [H-03] A user can steal from the shrine by forcing redistribution of their trove; due to incorrect logic trove debt will be reset but yangs kept

- id: 30422
- impact: HIGH
- protocol: [[Opus]]
- reporter: TrungOre (Code4rena)
- source: https://code4rena.com/reports/2024-01-opus

## Summary


This bug report discusses a potential issue in the code of a system that involves two types of currency, yang A and yang B, and two users, U1 and U2. The bug allows for U1 to steal from the system's shrine by forcing a redistribution of their position. This is due to a flaw in the function `redistribute_helper` which updates certain arrays before executing a `continue` statement, causing some values to never be used. This results in an incorrect final state where U1 can withdraw all their units of yang B from their trove, violating the system's invariant. A proof of concept is provided to demonstrate the bug and mitigation steps are recommended. The type of the bug is assessed as a loop and a high-risk evaluation is suggested due to the potential impact on other users' collateral.

## Details


Let's assume two yangs in the system, yang A and yang B, and two users:

- User U1 with trove #1 with zero A units, 1000 B units, and 500 yin debt;
- User U2 with trove #2 10000 A unit, 1000 B units, and 500 yin debt.

If the user U1 can force redistribution of their position, then they can steal from the shrine due to a bug in the code. The function `redistribute_helper` loops through all yangs in order, including those not in the trove #1. Since `trove_yang_amt.is_zero()` returns `true` for yang A, the `updated_trove_yang_balances` array is updated early and then `continue` statement is executed.

However, since the `new_yang_totals` array is not updated in the iteration of the loop, some values of `updated_trove_yang_balances` end up never being used.

Let's assume 100% redistribution. After the all loop is fully executed, the two arrays contain:

`updated_trove_yang_balances = [(A, 0), (B, 0)];`<br>
`new_yang_totals = [(B, 1000)];`

The final loop of the function is executed just once. Its first and only iteration writes the new total B value. However, it does not update the amount of B in the trove #1, since `(B, 0)` is the second element of the first array.
The final state is that trove #1 still has 1000 units of B, but no more debt. The user U1 can now withdraw all 1000 units from the trove #1.

This bug violates the shrine invariant "The total amount of a yang is equal to the sum of all troves' deposits of that yang (this includes any exceptionally redistributed yangs and their accompanying errors) and the initial amount seeded at the time of `add_yang`."

### Proof of Concept

    #[test]
    fn test_shrine_redistribution_bug() {
        let shrine: IShrineDispatcher = shrine_utils::shrine_setup_with_feed(Option::None);

        // Manually set up troves so that all troves uses just yang1
        let yangs: Span<ContractAddress> = shrine_utils::three_yang_addrs_reversed();
        let yang_addr = *yangs.at(1); // select the middle one

        let forge_amt: u128 = 1_000_000_000_000_000_000_000;

        // Set up trove1 with some yang and some debt
        let trove1_owner = common::trove1_owner_addr();
        let redistributed_trove: u64 = common::TROVE_1;
        start_prank(CheatTarget::All, shrine_utils::admin());
        shrine.deposit(yang_addr, redistributed_trove, shrine_utils::TROVE1_YANG1_DEPOSIT.into());
        shrine.forge(trove1_owner, redistributed_trove, forge_amt.into(), 0_u128.into());

        // Set up trove1 with some yang and some debt
        let trove2_owner = common::trove2_owner_addr();
        let recipient_trove: u64 = common::TROVE_2;
        shrine.deposit(yang_addr, recipient_trove, shrine_utils::TROVE1_YANG1_DEPOSIT.into());
        shrine.forge(trove2_owner, recipient_trove, forge_amt.into(), 0_u128.into());

        println!("before:");
        println!(" trove1 yang={}", shrine.get_deposit(yang_addr, redistributed_trove).val);
        println!(" trove2 yang={}", shrine.get_deposit(yang_addr, recipient_trove).val);
        println!(" total yang: {}", shrine.get_yang_total(yang_addr));

        // Simulate complete redistribution of trove1
        shrine.redistribute(redistributed_trove, trove1_health.debt, RAY_ONE.into());

        println!("after:");
        println!(" trove1 yang={}", shrine.get_deposit(yang_addr, redistributed_trove).val);
        println!(" trove2 yang={}", shrine.get_deposit(yang_addr, recipient_trove).val);
        println!(" total yang: {}", shrine.get_yang_total(yang_addr));

        shrine_utils::assert_shrine_invariants(shrine, yangs, 2);
    }

Output:

    before:
    trove1 yang=5000000000000000000
    trove2 yang=5000000000000000000
    trove1 value=2895610636113415002820 ltv=345350299355935952856010534 debt=1000000000000000000000
    trove2 value=2895610636113415002820 ltv=345350299355935952856010534 debt=1000000000000000000000

    after:
    trove1 yang=5000000000000000000
    trove2 yang=5000000000000000000
    trove1 value=2895610636113415002820 ltv=0 debt=0
    trove2 value=2895610636113415002820 ltv=690700598711871905712021068 debt=2000000000000000000000

Expected output:

    after:
    trove1 yang=0
    trove2 yang=5000000000000000000
    trove1 value=0 ltv=0 debt=0
    trove2 value=2895610636113415002820 ltv=690700598711871905712021068 debt=2000000000000000000000

One question is: how difficult is it to force the redistribution? It looks like it's a realistic option in some cases. For instance, the attacker could first drain the stability pool (absorber) by forcing absorbtions until it is empty. A liquidation can be forced by borrowing max amount and then waiting for `ltv > threshold` to happen due to small price fluctuations, potentially even manipulating the price slightly (as only a small change is required to cross the threshold). For a collateral asset with asset's `threshold > ABSORPTION_THRESHOLD` it's not required that the trove's `penalty == max_possible_penalty`.

### Recommended Mitigation Steps

Do not update the array `updated_trove_yang_balances` before the `continue` statement.

### Assessed type

Loop

**[tserg (Opus) confirmed and commented via duplicate issue #199](https://github.com/code-423n4/2024-01-opus-findings/issues/199#issuecomment-1931449951):**
> This is valid - potentially fixed.

**[0xsomeone (judge) commented](https://github.com/code-423n4/2024-01-opus-findings/issues/143#issuecomment-1964627245):**
 > The warden has demonstrated how a debt redistribution will maintain incorrect entries in the updated Yang balances and total Yang balances when skipping over one, weaponizing this behavior to acquire collateral from a shrine.
> 
> I believe a high-risk evaluation is apt as collateral of other users is directly impacted.

***
