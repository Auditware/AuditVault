---
tags:
  - blockchain/evm
  - lang/noir
  - platform/consensys
  - severity/high
  - sector/privacy
protocol: "[[ZK Email Noir]]"
auditors:
  - "[[Heiko Fisch]]"
report: "https://diligence.consensys.io/audits/2024/12/zk-email-noir/"
genome:
  - "[[wrong-condition]]"
  - "[[role-bypass]]"
  - "[[circuit-constraint-completeness]]"
---
# partial_sha256_var_start With Message Sizes Not Multiple of BLOCK_SIZE Gives Same h State for Different Data

- id: 49489
- impact: HIGH
- protocol: [[ZK Email Noir]]
- reporter: Heiko Fisch (ConsenSys)
- source: https://diligence.consensys.io/audits/2024/12/zk-email-noir/

## Summary


The partial_sha256_var_start function is used to hash a part of a message and return a hash state. However, if the size of the hashed part is not a multiple of BLOCK_SIZE, the function will not hash the remaining data, resulting in an incorrect hash. This can lead to an incorrect final hash and cause circuit validation to fail. Additionally, different messages with the same data in the first part that fits into multiples of BLOCK_SIZE will produce the same hash. To fix this, the size of the message should be constrained to be a multiple of BLOCK_SIZE in the partial_sha256_var_start function.

## Details

#### Description

The `partial_sha256_var_start` function is designed to hash the initial part of a message and return a hash state `h`. This hash state can then be used with `partial_sha256_var_interstitial` to hash additional parts of the message or with `partial_sha256_var_end` to complete the hash of the entire message.

However, if the size of the hashed part of the message given to `partial_sha256_var_start` is not a multiple of `BLOCK_SIZE` (64 bytes in the provided circuits), the function will not hash the remaining data of the message that is less than the block size, resulting in an incorrect hash for this data. This incorrect hash may then be used with `partial_sha256_var_interstitial` and `partial_sha256_var_end,` leading to an incorrect final hash that will not match the signed body hash found in the DKIM header, causing the circuit validation to fail.

Moreover, any other message that has the same data in the fist part that fits into multiples of `BLOCK_SIZE`, and has remaining different data that is less than but fits in one block of `BLOCK_SIZE` will also produce the same hash. This will happen regardless of what other data is in the remaining part. In other words, providing some message that is 64 bytes called `data1` and another message `data2=data1+"previous content is false"` to `partial_sha256_var_start` will give the same hash state.

In summary, by not enforcing the size of hashed data to be a multiple of `BLOCK_SIZE`, the circuits may not only produce a wrong hash state for the data but can even end up falsely verifying that different message data produce the same hash state.

#### Examples

**lib/src/partial\_hash.nr:L105-L110**

```
    if (msg_start < N) & (msg_byte_ptr == BLOCK_SIZE) {
        h = sha256_compression(msg_u8_to_u32(msg_block), h);
    }
}
h

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

Constrain the size of the message to be the multiple of `BLOCK_SIZE` in the `partial_sha256_var_start` function.
