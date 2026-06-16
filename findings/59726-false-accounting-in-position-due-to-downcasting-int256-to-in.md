---
tags:
  - lang/solidity
  - sector/perpetuals
  - platform/quantstamp
  - severity/high
  - novelty/known-pattern
protocol: "[[Ithaca Finance]]"
auditors:
  - "[[Mustafa Hasan]]"
report: "https://certificate.quantstamp.com/full/ithaca-finance/8cacdbf3-9f47-4135-854d-1d004abad065/index.html"
genome:
  - "[[underflow]]"
  - "[[wrong-state]]"
  - "[[known-pattern]]"
  - "[[integer-bounds]]"
  - "[[token-decimal-normalization]]"
---
# False Accounting in Position Due to Downcasting `int256` to `int64`

- id: 59726
- impact: HIGH
- protocol: [[Ithaca Finance]]
- reporter: Mustafa Hasan (Quantstamp)
- source: https://certificate.quantstamp.com/full/ithaca-finance/8cacdbf3-9f47-4135-854d-1d004abad065/index.html

## Summary


The client has reported a bug in the code that calculates client positions in the `Ledger.sol` file. The code uses `int64` which has a maximum value of `9,223,372,036,854,775,807` and can easily be exceeded for tokens with 18 decimal precision. This causes an overflow issue and incorrect results. The team is advised to use `int256` consistently throughout the project to avoid this problem. 

## Details

**Update**
Marked as "Fixed" by the client. The issue is fixed by using `int256` across the project. Addressed in: `ae69c230605e4548746e843ac032e75d1f59fa97`.

**File(s) affected:**`contracts/ledger/Ledger.sol`

**Description:** In `Ledger.sol`, the function `processPositionUpdates()` calculates the `clientPositions` through the following code logic:

```
clientPositions[position.contractId][position.client] = int64(
    int256(clientPositions[position.contractId][position.client]) + 
    int256(position.size)
);
```

Note that in the above operation, there's a low chance that the `int256` value will overflow the upper bound of `int64`. This is not ideal, as the overflowed value will be downcasted to `int64` from `int256`. In the solc version (0.8.17) used in the current contract, this will cause the returned result to be incorrect. Note that the `int64` maximum is `9,223,372,036,854,775,807`. For tokens with 18 decimal precision, this number can be easily achieved, which will cause the overflow issue.

**Exploit Scenario:** Consider the following simplified Ledger implementation:

```
contract LedgerSimplified{
    struct PositionParam {
        uint32 contractId;
        address client;
        int64 size;
    }
    mapping(uint32 => mapping(address => int64)) public clientPositions;

    function updatePositions(
        PositionParam[] memory positions
    ) external{

        if (positions.length > 0) {
            processPositionUpdates(positions);
        }
    }

    function processPositionUpdates(PositionParam[] memory positions) internal {
        PositionParam memory position;
        for (uint256 i = 0; i < positions.length; i++) {
            position = positions[i];

            clientPositions[position.contractId][position.client] = int64(
                int256(clientPositions[position.contractId][position.client]) + 
                    int256(position.size)
            ); 
        }
    }
}
```

By calling `updatePositions()` method twice with the input `4611686018427387904` (`2^62`), the function is overflowed and the mapping for the target client id is `int64: -9223372036854775808`.

**Recommendation:** We recommend the team to carefully evaluate the theoretical upper bound for positions. Ensure consistency between the `int` usage, such as keeping everything as `int256`.
