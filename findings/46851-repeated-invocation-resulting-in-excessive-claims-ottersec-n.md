---
tags:
  - lang/move
  - platform/ottersec
  - severity/high
  - sector/governance
  - sector/options
protocol: "[[Mysten Labs Sui]]"
auditors:
  - "[[Michał Bochnak]]"
report: "https://www.mystenlabs.com/"
genome:
  - "[[reward-calculation]]"
  - "[[direct-drain]]"
  - "[[account-ownership]]"
  - "[[timelock-timestamp-bypass]]"
---
# Repeated Invocation Resulting in Excessive Claims

- id: 46851
- impact: HIGH
- protocol: [[Mysten Republic Security Token]]
- reporter: Michał Bochnak (OtterSec)
- source: https://www.mystenlabs.com/

## Summary


The report highlights a bug in a module called timelock::claim, which is used for claiming unlocked tokens. The bug occurs because the module does not properly keep track of the cumulative claims made by an owner. This allows users to exploit the function and repeatedly claim the maximum amount of unlocked tokens, potentially exceeding the actual unlocked amount. The function also does not check if the total amount claimed so far exceeds the total unlocked tokens, making it vulnerable to repeated withdrawals. The bug has been fixed in a recent patch.

## Details

## Timelock Claim Vulnerability

In `timelock::claim`, the module does not fully account for the cumulative claims an owner may make on the unlocked tokens. Without this additional check, a user may exploit the function to repeatedly claim the maximum allowable unlocked balance, potentially exceeding the actual unlocked amount over multiple calls.

The function calculates `unlocked_tokens`, which is the total amount of tokens unlocked up to the current timestamp, based on the timelock’s release schedule.

```rust
> _ treasury_abilities/timelock/timelock.move

public fun claim<T>(
    self: &mut Timelock<T>,
    amount: Option<u64>,
    clock: &Clock,
    ctx: &mut TxContext,
): SplitRequest<T> {
    [...]
    let amount = amount.destroy_or!(unlocked_tokens);
    assert!(amount <= unlocked_tokens, ENotEnoughBalanceUnlocked);
    self.tokens_transferred = self.tokens_transferred + amount;
    let coin = self.left_balance.split(amount).into_coin(ctx);
    let (token, request) = shared_token::from_coin(coin, ctx);
    token.share();
}
```

However, each call to `claim` only checks that the currently requested amount is within the currently unlocked tokens, which renders the function vulnerable to repeated withdrawals. While `self.tokens_transferred` increments by the claimed amount with each call, there is no check to ensure that `amount + self.tokens_transferred` does not exceed the cumulative `unlocked_tokens`. This oversight allows the owner to call `claim` multiple times within the same unlock period, requesting the maximum unlocked amount each time without accounting for previously claimed tokens.

## Remediation

Verify that the cumulative amount claimed does not exceed the total unlocked tokens:

```
amount + self.tokens_transferred <= unlocked_tokens
```

## Patch

Resolved in `fe96359`.
