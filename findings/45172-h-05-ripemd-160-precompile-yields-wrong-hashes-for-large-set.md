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
  - "[[gumgumzum]]"
report: "https://code4rena.com/reports/2024-09-kakarot"
genome:
  - "[[wrong-condition]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[access-roles]]"
  - "[[account-discriminator-check]]"
---
# [H-05] `RIPEMD-160` precompile yields wrong hashes for large set of inputs due to off-by-one error

- id: 45172
- impact: HIGH
- protocol: [[Kakarot]]
- reporter: gumgumzum (Code4rena)
- source: https://code4rena.com/reports/2024-09-kakarot

## Summary


The bug report discusses an issue with the `RIPEMD-160` digest in the Cairo code. It is found that the code has a check that executes different blocks of code depending on the length of the input data. However, this check is different from the one used in the equivalent implementation in Go, which can lead to different results for inputs of length 55. This can result in incorrect outputs for cryptographic hash functions, which can have serious implications for EVM applications that use this precompile for access control on funds. A proof of concept test is provided to demonstrate this issue. The recommended mitigation step is to change the check at line 455 to `is_nn_le(56, len)`. The bug has been confirmed and mitigated by Kakarot. 

## Details


The `RIPEMD-160` digest integrates the input data with one additional block including the message length.

If we look at the Cairo code that achieves this:

```cairo
File: ripemd160.cairo
455:     let next_block = is_nn_le(55, len);
456:     if (next_block == FALSE) {
457:         dict_write{dict_ptr=x}(14, val);
458:         dict_write{dict_ptr=x}(15, val_15);
459: 
460:         let (local arr_x: felt*) = alloc();
461:         dict_to_array{dict_ptr=x}(arr_x, 16);
462:         default_dict_finalize(start, x, 0);
463:         let (res, rsize) = compress(buf, bufsize, arr_x, 16);
464:         return (res=res, rsize=rsize);
465:     }
466:     let (local arr_x: felt*) = alloc();
467:     dict_to_array{dict_ptr=x}(arr_x, 16);
468:     let (buf, bufsize) = compress(buf, bufsize, arr_x, 16);
```

... we see that the `if (next_block == false)` executes one block of code in case `len >= 55`, and the other otherwise.

If we compare this check with the [equivalent implementation in Go (used by Geth)](https://github.com/golang/crypto/blob/7cfb9161e8d828fd6d9f34560e78460435b63503/ripemd160/ripemd160.go#L98), for example:

```go
	if tc%64 < 56 {
		d.Write(tmp[0 : 56-tc%64])
	} else {
		d.Write(tmp[0 : 64+56-tc%64])
	}
```

We see that this time, the selection is made with `len < 56` as discriminator; if we imagine swapping the `if` and the `else` blocks of the Go implementation, the condition becomes `len >= 56`.

So for the edge case of `len == 55`, Kakarot and Geth will take different actions, which, as shown in the PoC, results in differing hashes. `len` here represents the length of the input modulo 64, hence the `RIPEMD-160` precompile will yield wrong outputs for inputs of length `55 + k*64`.

Because this precompile is a cryptographic hash function, it can be used in many ways by EVM applications, including access control on funds.

### Proof of Concept

To prove the point, the following test can be added to the `test_ripemd160.py` unit test suite:

```python
    async def test_ripemd160_on_55_length_input(self, cairo_run):
        msg_bytes = bytes("abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmomnopnopq", "ascii")
        precompile_hash = cairo_run("test__ripemd160", msg=list(msg_bytes))

        # Hash with RIPEMD-160 to compare with precompile result
        ripemd160_crypto = RIPEMD160.new()
        ripemd160_crypto.update(msg_bytes)
        expected_hash = ripemd160_crypto.hexdigest()

        assert expected_hash.rjust(64, "0") == bytes(precompile_hash).hex()
```

... which yields the following output:

```
    >       assert expected_hash.rjust(64, "0") == bytes(precompile_hash).hex()
    E       AssertionError: assert '000000000000...65c8fd54fbafd' == '000000000000...169718d24abaf'
    E         
    E         - 000000000000000000000000578b4715e07320701e0715dc640169718d24abaf
    E         + 000000000000000000000000df3166bed54ffac595c474af28465c8fd54fbafd

    tests/src/kakarot/precompiles/test_ripemd160.py:19: AssertionError
```

### Recommended Mitigation Steps

Change the check at L455 to `is_nn_le(56, len)`.

**[ClementWalter (Kakarot) confirmed and commented](https://github.com/code-423n4/2024-09-kakarot-findings/issues/50#issuecomment-2451963341):**
 > Severity: High

**Kakarot mitigated:**
> [This PR](https://github.com/kkrt-labs/kakarot/pull/1575) fixes off by one error `ripemd-160`.

**Status:** Mitigation confirmed.

***
