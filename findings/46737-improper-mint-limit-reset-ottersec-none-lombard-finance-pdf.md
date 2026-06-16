---
tags:
  - lang/move
  - platform/ottersec
  - severity/high
  - sector/token
protocol: "[[Lombard Finance]]"
auditors:
  - "[[Michał Bochnak]]"
report: "https://www.lombard.finance/"
genome:
  - "[[wrong-condition]]"
  - "[[reward-theft]]"
  - "[[treasury-multisig]]"
---
# Improper Mint Limit Reset

- id: 46737
- impact: HIGH
- protocol: [[Lombard Finance]]
- reporter: Michał Bochnak (OtterSec)
- source: https://www.lombard.finance/

## Summary


The code in the function "mint_and_transfer" is not properly updating the value of "left" within the MinterCap structure. Instead of updating the actual value, it is only re-assigning it with a reference to the "limit" field. To fix this, the code needs to use "*left" instead of "left" to correctly update the value. This issue has been fixed in the latest patch.

## Details

In `treasury::mint_and_transfer`, the line `left = limit;` modifies the local variable `left`. However, `get_cap_mut(treasury, ctx.sender())` returns a mutable reference to the `MinterCap` object associated with the sender. This implies `left` is a mutable reference, which refers to the actual value in the `MinterCap` structure. Thus, currently, the function is only re-assigning the `left` variable with a reference to the `limit` field of the structure rather than updating the `left` field. 

So, to properly update the value of `left` within the `MinterCap` structure, it needs to be de-referenced by utilizing `*left`. 

> _lbtc/sources/treasury.move move
```move
public fun mint_and_transfer<T>(
    [...]
) {
    [...]
    // Get the MinterCap and check the limit; if a new epoch - reset it
    let MinterCap { limit, epoch, mut left } = get_cap_mut(treasury, ctx.sender());
    
    // Reset the limit if this is a new epoch
    if (ctx.epoch() > *epoch) {
        left = limit;
        *epoch = ctx.epoch();
    };

    // Check that the amount is within the mint limit; update the limit
    assert!(amount <= *left, EMintLimitExceeded);
    *left = *left - amount;
    [...]
}
```

### Remediation
Set `*left = *limit` instead of `left = limit` to correctly update the available minting allowance.

### Patch
Fixed in `ecf55e3`.
