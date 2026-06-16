---
tags:
  - lang/solidity
  - platform/trailofbits
  - has/github
  - has/poc
  - severity/high
  - sector/staking
protocol: "[[DeGate]]"
auditors:
  - "[[Shaun Mirani]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/DeGate.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[reward-accounting]]"
---
# Numerical comparison gadget does not support very large numbers

- id: 17861
- impact: HIGH
- protocol: [[DeGate]]
- reporter: Shaun Mirani (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/DeGate.pdf

## Summary


This bug report is about an issue with the LeqGadget in MathGadgets.h, which performs comparison operations over numeric values. The LeqGadget is only guaranteed to work correctly on values in the field capacity - 1, which is equal to 253. This means that using numbers close to 2**256 - 1 will cause an assertion failure. This could potentially crash the validator.

The short-term recommendation is to disallow the use of numbers greater than the capacity of the bits of the field and document this limitation for users. The long-term recommendation is to review the limitations of each gadget to ensure that it will not block any user operations and document those limitations.

## Details

## DeGate Security Assessment

## Difficulty: High

## Type: Undefined Behavior

## Target: circuit/Gadgets/MathGadgets.h

### Description
The `LeqGadget` performs various comparison operations over numeric values but does not support the full range of `uint256` values:

```cpp
// (A <(=) B)
class LeqGadget : public GadgetT
{
…
}
```

The comparison gadget is only guaranteed to work correctly on values in the field capacity - 1:

```cpp
ASSERT(n <= NUM_BITS_FIELD_CAPACITY - 1, prefix);
```

**Figure 9.1:** Part of the `LeqGadget` in `MathGadgets.h`

Since `NUM_BITS_FIELD_CAPACITY` is equal to 253, the use of numbers close to `2**256 - 1` will cause an assertion failure. Token deposit amounts are not affected by this limitation since they are defined using the `uint248` type; however, other fields, such as the ones that track down the deposit state, could trigger a failure in the `LeqGadget`.

```cpp
struct BalanceLeaf
{
    uint32 tokenID;
    uint248 balance;
}
```

```cpp
struct DepositState {
    uint256 freeDepositMax;
    uint256 freeDepositRemained;
    uint256 lastDepositBlockNum;
    uint256 freeSlotPerBlock;
    uint256 depositFee;
}
```

**Figure 9.2:** The `BalanceLeaf` and `DepositState` data structures in `ExchangeData.sol`

This problem was also raised in the Loopring repository.

## Exploit Scenario
Alice triggers a circuit that uses the `LeqGadget` to perform a comparison with a large number that it does not support. This causes an assertion failure that crashes the validator.

## Recommendations
- **Short Term:** Disallow the use of numbers greater than the capacity of the bits of the field, and document this limitation for users.
- **Long Term:** Review the limitations of each gadget to ensure that it will not block any user operations, and document those limitations.
