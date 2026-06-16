---
tags:
  - lang/solidity
  - sector/privacy
  - sector/zk
  - platform/trailofbits
  - has/github
  - has/poc
  - severity/high
  - vuln/logic/fee-calculation
  - novelty/known-pattern
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[DeGate]]"
auditors:
  - "[[Shaun Mirani]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/DeGate.pdf"
genome:
  - "[[fee-calculation]]"
  - "[[known-pattern]]"
  - "[[fee-theft]]"
  - "[[fee-accounting]]"
  - "[[integer-bounds]]"
  - "[[circuit-constraint-completeness]]"
  - "[[circuit-input-range-check]]"
---
# Missing range checks in MulDivGadget

- id: 17854
- impact: HIGH
- protocol: [[DeGate]]
- reporter: Shaun Mirani (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/DeGate.pdf

## Summary


A bug has been reported in the packages/loopring_v3/circuit/Gadgets/MathGadgets.h of a program. The zero-knowledge MulDivGadget used in the SpotTradeCircuit and BatchOrderGadget does not validate the arguments, numBitsValue, numBitsNumerator, and numBitsDenominator, which could cause an overﬂow. This could lead to catastrophic consequences. Additionally, the gadget does not validate the assertion that the product is bounded. An attacker could easily bypass the assertion by commenting it out. 

The fee calculations currently use a constant denominator of 10,000 from the set of constants, but future updates could render it variable. The values of fillS_A.value() and fillS_B.value() in the SpotTradeCircuit appear to be relatively unconstrained, which is a cause for concern. In the BatchOrderGadget, these values appear to be properly constrained.

An attacker could leverage a ﬁeld multiplication overﬂow to reduce the fees charged for the attacker’s spot trades. Because the quotient bit size is not checked, the attacker may be able to evade the fees entirely (and disrupt other arithmetic operations) by causing the system to set a negative fee amount.

To fix the bug, the MulDivGadget should be redesigned to use DualVariableGadgets to validate the bit size of its arguments, and use a SafeMulGadget to validate the bit size of the product. In the long term, every field should be properly validated and an external audit of the SNARK code should be obtained.

## Details

## Security Assessment Report

## Difficulty: High

## Type: Undefined Behavior

## Target: 
packages/loopring_v3/circuit/Gadgets/MathGadgets.h

## Description
The zero-knowledge `MulDivGadget` is used in the `SpotTradeCircuit` and `BatchOrderGadget` to calculate fees. The gadget takes `numBitsValue`, `numBitsNumerator`, and `numBitsDenominator` arguments indicating the bit size of the value, numerator, and denominator but does not validate those arguments; nor are the values used to validate the bit size of the quotient, which should be equal to `numBitsValue + numBitsNumerator - numBitsDenominator`. This lack of validation could cause a fee calculation to overflow, which could have catastrophic consequences.

```cpp
MulDivGadget(
    ProtoboardT &pb,
    const Constants &constants,
    const VariableT &_value,
    const VariableT &_numerator,
    const VariableT &_denominator,
    unsigned int numBitsValue,
    unsigned int numBitsNumerator,
    unsigned int numBitsDenominator,
    const std::string &prefix)
: GadgetT(pb, prefix),
  value(_value),
  numerator(_numerator),
  denominator(_denominator),
  quotient(make_variable(pb, FMT(prefix, ".quotient"))),
  denominator_notZero(pb, denominator, FMT(prefix, ".denominator_notZero")),
  product(pb, value, numerator, FMT(prefix, ".product")),
  // Range limit the remainder. The comparison below is not guaranteed to
  // work for very large values.
  remainder(pb, numBitsDenominator, FMT(prefix, ".remainder")),
  remainder_lt_denominator(
      pb,
      remainder.packed,
      denominator,
      numBitsDenominator,
      FMT(prefix, ".remainder < denominator")) 
{
}
```
assert(numBitsValue + numBitsNumerator <= NUM_BITS_FIELD_CAPACITY);

## Trail of Bits
16

### DeGate Security Assessment
**PUBLIC**

## Figure 2.1: The MulDivGadget Constructor
The gadget should also check the assertion that the product is bounded. A motivated attacker could easily bypass the assertion by commenting it out, which would not change the final circuit but would prevent a crash.

Fee calculations currently use a constant denominator of 10,000 from the set of constants, but future updates could render it variable. Moreover, in the `SpotTradeCircuit`, the values of `fillS_A.value()` and `fillS_B.value()` appear to be relatively unconstrained, which is a cause for concern.

```cpp
feeCalculatorA(
    pb,
    state.constants,
    fillS_B.value(),
    // 拆分trading fee与gas fee
    // state.protocolTakerFeeBips,
    orderA.feeBips.packed,
    // // 多refer账号-trading fee分配
    // state.referFeeBips,
    // state.uiFeeBips,
    FMT(prefix, ".feeCalculatorA")),
feeCalculatorB(
    pb,
    state.constants,
    fillS_A.value(),
    // 拆分trading fee与gas fee
    // state.protocolMakerFeeBips,
    orderB.feeBips.packed,
    // // 多refer账号-trading fee分配
    // state.referFeeBips,
    // state.uiFeeBips,
    FMT(prefix, ".feeCalculatorB")),
```
## Figure 2.2: Fee Calculations in the SpotTradeCircuit
In the `BatchOrderGadget`, these values appear to be properly constrained, as `deltaFilledB` is a `DualVariableGadget` of `NUM_BITS_AMOUNT` bits.

```cpp
tradingFeeCalculator(
    pb,
    constants,
    deltaFilledB.packed,
    order.feeBips.packed,
    FMT(prefix, ".tradingFeeCalculator")),
```
## Figure 2.3: A Fee Calculation in the BatchOrderGadget

## Exploit Scenario
An attacker leverages a field multiplication overflow to reduce the fees charged for the attacker’s spot trades. Because the quotient bit size is not checked, the attacker may be able to evade the fees entirely (and disrupt other arithmetic operations) by causing the system to set a negative fee amount.

## Recommendations
Short term, redesign the `MulDivGadget` to use `DualVariableGadget`s to validate the bit size of its arguments, and use a `SafeMulGadget` to validate the bit size of the product.

Long term, carefully check each gadget and circuit to ensure that every field is properly validated. While obtaining an external audit of the SNARK code is a good step, it is not unheard of for bugs to slip through regardless; Zcash, for example, experienced a catastrophic SNARK failure a few years ago despite having been audited.

## Trail of Bits
18

### DeGate Security Assessment
**PUBLIC**
