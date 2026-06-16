---
tags:
  - blockchain/evm
  - lang/noir
  - lang/rust
  - sector/privacy
  - platform/consensys
  - severity/high
  - vuln/dependency/unchecked-return-value
  - novelty/variant
  - misassumption/external-call-is-safe
  - fix/add-check
protocol: "[[ZK Email Noir]]"
auditors:
  - "[[Heiko Fisch]]"
report: "https://diligence.consensys.io/audits/2024/12/zk-email-noir/"
genome:
  - "[[unchecked-return-value]]"
  - "[[variant]]"
  - "[[role-bypass]]"
  - "[[extcall-return-validation]]"
  - "[[circuit-constraint-completeness]]"
---
# partial_sha256_var_interstitial May Give the Same Hash State h for Different Data Objects if They Are Smaller Than message_size

- id: 49490
- impact: HIGH
- protocol: [[ZK Email Noir]]
- reporter: Heiko Fisch (ConsenSys)
- source: https://diligence.consensys.io/audits/2024/12/zk-email-noir/

## Summary


The function `partial_sha256_var_interstitial` is not working properly when used with a partially computed sha256 hash and a partial message. This is because when the message's size is smaller than the message size parameter and not a multiple of 64 bytes, the last part of the message is not being hashed. This means that different data objects with the same initial bytes will return the same hash state. To fix this, a constraint should be added to ensure that the input message's size is equal to or greater than the message size parameter.

## Details

#### Description

`partial_sha256_var_interstitial` function is used with a partially computed sha256 hash created with `partial_sha256_var_start` and a partial message to generate an interstate hash. However, when the input message’s size (`N`) is less than the message size parameter (`message_size`) and the size is not a multiple of `BLOCK_SIZE` (64 bytes), the last unfilled block of the message would not be hashed. In other words, even though the expected amount of data to be hashed is `message_size`, only `BLOCK_SIZE*(N/BLOCK_SIZE)` amount of data will be hashed. Consequently, the remaining data is ignored, and the returned hash state `h` will be the same for different data objects as long as they share the initial `BLOCK_SIZE*(N/BLOCK_SIZE)` bytes.

In order to avoid this, the circuit does an assert on `message_size` being a multiple of `BLOCK_SIZE`:

**lib/src/partial\_hash.nr:L124**

```
assert(message_size % BLOCK_SIZE == 0, "Message size must be a multiple of the block size");

```

However, as mentioned above, when array size `N` is smaller than `message_size`, this doesn’t work as `N` would be different from `message_size` so it wouldn’t be bound by the same constraints.

The result is that different data objects that share some initial bytes would return the same hash state `h` when submitted to `partial_sha256_var_interstitial` if:

* they are smaller than `message_size`
* are not a multiple of `BLOCK_SIZE`
* and fill the same amount of `BLOCK_SIZE` byte blocks.

For example, the below code validates different data structure hashes:

```
fn test_partial_hash_interstitial_var_different_arrays() {
    let mut data0 = [0; 64]; ////keeping these two here to make the original hash
    let mut data2 = [0; 64]; 
    let mut data1_original = [0; 64]; // second block not used. but keeping array to <128
    let mut data1_custom = [0; 100]; // make array size less than 128
    for i in 0..data0.len() {
        data0[i] = DATA[i];
        data1_original[i] = DATA[64 + i];
        data1_custom[i] = DATA[64 + i];
        data2[i] = DATA[128 + i];
    }
    data1_custom[90]=123; // and also actually fill some data in the second block for the modified data
    let pre_hash = partial_sha256_var_start(data0);
    let interstitial_hash = partial_sha256_var_interstitial(pre_hash, data1_original, 128); // increasing message_size== 128 so the developer may expect that 128 bytes will be hashed
    let hash = partial_sha256_var_end(
        interstitial_hash,
        data2,
        data2.len() as u64,
        DATA.len() as u64,
    );
    //now do the second hash
    let custom_interstitial_hash = partial_sha256_var_interstitial(pre_hash, data1_custom, 192); // increasing message_size== 192 so the developer may expect that 192 bytes will be hashed
    let custom_hash = partial_sha256_var_end(
        custom_interstitial_hash,
        data2,
        data2.len() as u64,
        DATA.len() as u64,
    );
    let correct_hash = std::hash::sha256_var(DATA, DATA.len() as u64);
    assert_eq(hash, correct_hash);
    //assert equality
    assert_eq(hash, custom_hash);
}

```

Being able to validate the same hash state for different data objects with different intended message sizes to be hashed may cause significant soundness issues. This is especially significant for a more general-purpose library for partial hashing that may be utilized for more than just email bodies.

#### Examples

**lib/src/partial\_hash.nr:L123-L156**

```
pub fn partial_sha256_var_interstitial<let N: u32>(mut h: [u32; 8], msg: [u8; N], message_size: u32) -> [u32; 8] {
    assert(message_size % BLOCK_SIZE == 0, "Message size must be a multiple of the block size");
    let num_blocks = N / BLOCK_SIZE;
    let mut msg_block: [u8; BLOCK_SIZE] = [0; BLOCK_SIZE];
    let mut msg_byte_ptr = 0; // Pointer into msg_block
    for i in 0..num_blocks {
        let msg_start = BLOCK_SIZE * i;
        let (new_msg_block, new_msg_byte_ptr) = unsafe {
            build_msg_block_iter(msg, N, msg_start)
        };
        if msg_start < N {
            msg_block = new_msg_block;
        }
        if !is_unconstrained() {
            // Verify the block we are compressing was appropriately constructed
            let new_msg_byte_ptr = verify_msg_block(msg, N, msg_block, msg_start);
            if msg_start < N {
                msg_byte_ptr = new_msg_byte_ptr;
            }
        } else if msg_start < N {
            msg_byte_ptr = new_msg_byte_ptr;
        }
        // If the block is filled, compress it.
        // An un-filled block is handled after this loop.
        if (msg_start < N) & (msg_byte_ptr == BLOCK_SIZE) & (msg_start < message_size){
            h = sha256_compression(msg_u8_to_u32(msg_block), h);
        }
    }
    h
}

```

**examples/partial\_hash/src/main.nr:L44-L52**

```
let signed_body_hash = get_body_hash(header, dkim_header_sequence, body_hash_index);
// finish the partial hash
let computed_body_hash = partial_sha256_var_end(partial_body_hash, body.storage(), body.len() as u64, partial_body_real_length);   
// check the body hashes match
assert(
    signed_body_hash == computed_body_hash, "Sha256 hash computed over body does not match DKIM-signed header"
);

```
#### Recommendation

Add a constraint for the input message’s size `N` to be equal to or greater than `message_size`.
