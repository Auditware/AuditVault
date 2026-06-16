---
tags:
  - blockchain/evm
  - lang/noir
  - sector/privacy
  - platform/consensys
  - severity/high
  - novelty/variant
protocol: "[[ZK Email Noir]]"
auditors:
  - "[[Heiko Fisch]]"
report: "https://diligence.consensys.io/audits/2024/12/zk-email-noir/"
genome:
  - "[[wrong-condition]]"
  - "[[variant]]"
  - "[[role-bypass]]"
  - "[[access-roles]]"
---
# Missing Validation of Header Field Sequence Length

- id: 49488
- impact: HIGH
- protocol: [[ZK Email Noir]]
- reporter: Heiko Fisch (ConsenSys)
- source: https://diligence.consensys.io/audits/2024/12/zk-email-noir/

## Summary


The `constrain_header_field` function in the code is missing some checks that could lead to incorrect header fields being verified. Specifically, there is no check for the header field name and colon fitting into the sequence, and no check for the sequence length being within the maximum length allowed. This could result in a shorter header field being accepted and could cause issues with finding the last left angle bracket in the `constrain_header_field_detect_last_angle_bracket` function. To fix this, it is recommended to add two assertions to both functions that check for the length of the header field sequence.

## Details

#### Description

The `constrain_header_field` function verifies that the claimed header field sequence is completely contained in the header:

**lib/src/headers/mod.nr:L93-L95**

```
// check the range of the sequence is within the header (so we can use get_unchecked)
let end_index = header_field_sequence.index + header_field_sequence.length;
assert(end_index <= header.len(), "Header field out of bounds of header");

```

There is, however, no check that the header field name and the following colon fit into the sequence. Nor is there a check that the sequence length is at most `MAX_HEADER_FIELD_LENGTH`, which is a generic parameter for the maximum length of the header field.

Regarding the first missing check, it would be possible to prove a header field that is shorter than `header_field_name`. (See also [issue 5.3](#missing-validation-of-characters-in-header_field_name) in this context.)

The second missing check means that the part of a sequence that extends beyond `MAX_HEADER_FIELD_LENGTH` won’t be verified to not contain CR, so the sequence could span more than one actual header field.

**lib/src/headers/mod.nr:L64-L73**

```
for i in (HEADER_FIELD_NAME_LENGTH + 1)..MAX_HEADER_FIELD_LENGTH {
    // is it safe enough to cut this constraint cost in half by not checking lf? i think so
    let index = start_index + i;
    if (index < header_field_sequence.index + header_field_sequence.length) {
        assert(
            header.get_unchecked(index) != CR,
            "Header field must not contain newlines"
        );
    }
}

```

The same checks are also missing from the function `constrain_header_field_detect_last_angle_bracket`. Here, the part of a sequence after `MAX_HEADER_FIELD_LENGTH` remains not only unchecked for CR, but also for “<”, so the function might not actually find the last left angle bracket. This means that it could be possible in such a case to prove a wrong email address.

**lib/src/headers/mod.nr:L126-L138**

```
for i in (HEADER_FIELD_NAME_LENGTH + 1)..MAX_HEADER_FIELD_LENGTH {
    // is it safe enough to cut this constraint cost in half by not checking lf? i think so
    let index = start_index + i;
    if (index < header_field_sequence.index + header_field_sequence.length) {
        let byte = header.get_unchecked(index);
        assert(
            byte != CR,
            "Header field must not contain newlines"
        );
        if byte == 0x3c {
            last_angle_bracket = index;
        }
    }

```
#### Recommendation

To both functions, add the following two assertions:

```
    assert(
        HEADER_FIELD_NAME_LENGTH < header_field_sequence.length,
        "Header field sequence too short to contain name and colon"
    );
    assert(
        header_field_sequence.length <= MAX_HEADER_FIELD_LENGTH,
        "Header field sequence longer than maximum length"
    );

```
