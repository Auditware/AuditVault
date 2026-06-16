---
tags:
  - lang/solidity
  - sector/stable
  - platform/cyfrin
  - has/github
  - severity/high
protocol: "[[Remora Pledge]]"
auditors:
  - Dacian
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-07-04-cyfrin-remora-pledge-v2.0.md"
genome:
  - "[[integer-bounds]]"
  - "[[underflow]]"
  - "[[known-pattern]]"
  - "[[math-is-safe]]"
  - "[[fix-arithmetic]]"
---
# `PledgeManager::pledge`, `refundTokens` will revert due to overflow when `pricePerToken * numTokens > type(uint32).max`

- id: 61172
- impact: HIGH
- protocol: Remora Pledge
- reporter: Dacian (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-07-04-cyfrin-remora-pledge-v2.0.md

## Summary


The bug report describes an issue in the code of a smart contract called `PledgeManager`. The contract has two functions, `pledge` and `refundTokens`, that multiply two `uint32` variables and store the result in a `uint256` variable. However, the contract does not account for the possibility of the multiplication resulting in a value greater than the maximum value that can be stored in a `uint32` variable. This can cause the functions to revert and prevent users from pledging larger amounts.

The impact of this bug is that the maximum amount that can be pledged is very low, which may not be enough for users. The contract is also not upgradeable, so the bug cannot be fixed by upgrading the contract.

To fix this issue, the report recommends increasing the size of the variables or casting one of them to `uint256` to prevent overflow. The fix has been implemented in the code and verified by the Remora and Cyfrin projects.



## Details

**Description:** `PledgeManager::pledge` multiplies two `uint32` variables and stores the result into a `uint256`, attempting to account for when the multiplication returns a value greater than `type(uint32).max`:
```solidity
uint256 stablecoinAmount = pricePerToken * numTokens; // account for overflow
```

`PledgeManager::refundTokens` does the same thing:
```solidity
uint256 refundAmount = numTokens * pricePerToken; //TOOD: overflow check
```

However this won't work correctly since if the result of the multiplication is greater than `type(uint32).max` the function will revert.

**Impact:** The maximum value of `uint32` is 4294967295. Since `pricePerToken` uses 6 decimals, the maximum possible `stablecoinAmount` is $4294.96 which is very low; pledging will be revert for many reasonable amounts that users will want to do.

The contract is also not upgradeable so this can't be fixed via upgrading.

**Proof of Concept:** You can easily verify this behavior using [chisel](https://getfoundry.sh/chisel/overview):
```solidity
$ chisel
Welcome to Chisel! Type `!help` to show available commands.
➜ uint32 a = type(uint32).max;
➜ uint32 b = 10;
➜ uint256 c = a * b;
Traces:
  [401] 0xBd770416a3345F91E4B34576cb804a576fa48EB1::run()
    └─ ← [Revert] panic: arithmetic underflow or overflow (0x11)

Error: Failed to execute REPL contract!
```

**Recommended Mitigation:** Firstly consider increasing the size of `pricePerToken` and `numTokens`, since the max value of `uint32` is 4,294,967,295 which means:
* for price with 6 decimals, the maximum `pricePerToken` is $4294 which may be too small
* the maximum token amount is 4.29B which may work or also be too small
* simple solution: standardize all protocol token amounts to `uint128`

Secondly instead of multiplying two smaller types such as `uint32`, cast one of them to `uint256`:
```diff
- uint256 stablecoinAmount = pricePerToken * numTokens; // account for overflow
+ uint256 stablecoinAmount = uint256(pricePerToken) * numTokens;
```

Verify the fix via chisel:
```solidity
$ chisel
Welcome to Chisel! Type `!help` to show available commands.
➜ uint32 a = type(uint32).max;
➜ uint32 b = 10;
➜ uint256 c = uint256(a) * b;
➜ c
Type: uint256
├ Hex: 0x9fffffff6
├ Hex (full word): 0x00000000000000000000000000000000000000000000000000000009fffffff6
└ Decimal: 42949672950
```

Consider these lines in `TokenBank::buyToken` whether a similar fix is needed there:
```solidity
// @audit can `amount * curData.pricePerToken * curData.saleFee > type(uint64).max`? If so then
// consider making a similar fix here to prevent overflow revert
        uint64 stablecoinValue = amount * curData.pricePerToken;
        uint64 feeValue = (stablecoinValue * curData.saleFee) / 1e6;
```

**Remora:** Fixed in commits [a0b277f](https://github.com/remora-projects/remora-smart-contracts/commit/a0b277fe4a59354f3b3783c4b8c06eb60f5157610), [ced21ba](https://github.com/remora-projects/remora-smart-contracts/commit/ced21ba9758b814eb48a09a5e792aa89cc87e8f5).

**Cyfrin:** Verified.
