---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/infra
protocol: "[[Kakarot]]"
auditors:
  - "[[AshutoshSB]]"
report: "https://code4rena.com/reports/2024-09-kakarot"
genome:
  - "[[signature-replay]]"
  - "[[role-bypass]]"
  - "[[circuit-input-range-check]]"
---
# [H-06] Three valid signatures for the same message

- id: 45173
- impact: HIGH
- protocol: [[Kakarot]]
- reporter: AshutoshSB (Code4rena)
- source: https://code4rena.com/reports/2024-09-kakarot

## Summary



Summary: 

The bug report discusses an issue with the `ecrecover` function in Kakarot, a platform similar to Ethereum. It is possible to create three different valid signatures for the same message on Kakarot, while on Ethereum, only two are possible. This is due to differences in how the `ecrecover` function handles values outside of the valid range for `s`. This can potentially lead to malleability attacks on Kakarot, where signatures can be manipulated in two ways, compared to only one way on Ethereum. The report suggests limiting the value of `s` in the `ec_recover::run` function to prevent this issue. A proof of concept is provided, and a test is recommended to be run to ensure the fix is implemented correctly.

## Details


On Ethereum, it's possible to create **two** different valid signatures for the same message (known as ECDSA Signature Malleability). However, on Kakarot, you can create **three** different valid signatures for the same message. This happens because, on Ethereum, if the value of `s` is higher than the maximum valid range, it returns `address(0)`. On Kakarot, in this case, it returns a valid address.

### Proof of Concept

If `r` and `v` are in the valid range, and `s` is between `1` and `secp256k1n`, the `ecrecover` function behaves the same on both Ethereum and Kakarot.

- On Ethereum, if the value of `s` is higher than `secp256k1n`, it returns `address(0)`.
- On Kakarot, if the value of `s` is higher than `secp256k1n`, it returns an address equivalent to `s + secp256k1n`.

Here's an example for better clarity. The `ecrecover` function for the following inputs will return the same result `0x992FEaf0E360bffaeAcf57c28D2a3F5059Fe0982`:

- On Ethereum:
    - input1: `r = 1, v = 27, s = 2`
    - input2: `r = 1, v = 28, s = secp256k1n - 2 = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD036413F`

- On Kakarot:
    - input1: `r = 1, v = 27, s = 2`
    - input2: `r = 1, v = 28, s = secp256k1n - 2 = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD036413F`
    - input3: `r = 1, v = 27, s = secp256k1n + 2 = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364143`

While inputs 1 and 2 behave as expected, input 3 highlights the problem. With input 3, Ethereum's `ecrecover` returns `address(0)`, but Kakarot returns the same result as input1 and input2.

This shows that a malleability attack on Kakarot can be done in two ways, whereas on Ethereum, it can only be done in one.

In simple terms, on Ethereum, a malleability attack can be done by changing the `v` from `27` to `28` (or vice versa) and swapping `s` with `secp256k1n - s`:

- `r, s, v`
- `r, secp256k1n - s, v = {27 -> 28, 28 -> 27}`

On Kakarot, the malleability attack can be done in two ways: either by changing `s` to `secp256k1n + s` (as long as it's not larger than `2**256 - 1`) or using the same method as Ethereum by changing the `v` and swapping `s` with `secp256k1n - s`:

- `r, s, v`
- `r, secp256k1n - s, v = {27 -> 28, 28 -> 27}`

OR:

- `r, s, v`
- `r, secp256k1n + s, v`

The value of `s` needs to be limited in the `ec_recover::run` function to make sure it's within the valid range.

```rust
    func run{
        syscall_ptr: felt*,
        pedersen_ptr: HashBuiltin*,
        range_check_ptr,
        bitwise_ptr: BitwiseBuiltin*,
    }(_address: felt, input_len: felt, input: felt*) -> (
        output_len: felt, output: felt*, gas_used: felt, reverted: felt
    ) {
        alloc_locals;

        let (input_padded) = alloc();
        slice(input_padded, input_len, input, 0, 4 * 32);

        let v_uint256 = Helpers.bytes32_to_uint256(input_padded + 32);
        let v = Helpers.uint256_to_felt(v_uint256);

        if ((v - 27) * (v - 28) != 0) {
            let (output) = alloc();
            return (0, output, GAS_COST_EC_RECOVER, 0);
        }

        let msg_hash = Helpers.bytes_to_uint256(32, input_padded);
        let r = Helpers.bytes_to_uint256(32, input_padded + 32 * 2);
        let s = Helpers.bytes_to_uint256(32, input_padded + 32 * 3);

        // v - 27, see recover_public_key comment
        let (helpers_class) = Kakarot_cairo1_helpers_class_hash.read();
        let (success, recovered_address) = ICairo1Helpers.library_call_recover_eth_address(
            class_hash=helpers_class, msg_hash=msg_hash, r=r, s=s, y_parity=v - 27
        );

        if (success == 0) {
            let (output) = alloc();
            return (0, output, GAS_COST_EC_RECOVER, 0);
        }

        let (output) = alloc();
        memset(output, 0, 12);
        Helpers.split_word(recovered_address, 20, output + 12);

        return (32, output, GAS_COST_EC_RECOVER, 0);
    }
```

<https://github.com/kkrt-labs/kakarot/blob/7411a5520e8a00be6f5243a50c160e66ad285563/src/kakarot/precompiles/ec_recover.cairo#L40>

### PoC

In the following test, three different combinations of `(r, s, v)` are provided as parameters to the `ecrecover` function, and the result for all of them is the same.

To run the end-to-end tests correctly, the `make test-end-to-end14` command should be used, as defined in the `Makefile`.

```
    test-end-to-end14: deploy
    	uv run pytest tests/end_to_end/Simple/test_ecrecover_wrong.py -m "not slow" -s --seed 42
```

```python
import pytest
import pytest_asyncio

from kakarot_scripts.utils.kakarot import deploy


@pytest_asyncio.fixture(scope="package")
async def target():
    return await deploy(
        "Simple",
        "TestEcrecoverWrong",
    )
