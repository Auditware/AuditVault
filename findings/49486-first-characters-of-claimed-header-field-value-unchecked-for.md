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
# First Characters of Claimed Header Field Value Unchecked for CRLF

- id: 49486
- impact: HIGH
- protocol: [[ZK Email Noir]]
- reporter: Heiko Fisch (ConsenSys)
- source: https://diligence.consensys.io/audits/2024/12/zk-email-noir/

## Summary


The bug report describes an issue with the code that checks the header field value in a program. The code is supposed to verify that the header field value does not contain certain characters, but due to a mistake in the code, some positions are not being checked. This could potentially be exploited by an attacker to manipulate the header fields. The report recommends a simple fix to initialize a variable differently to avoid this issue.

## Details

#### Description

A header field consists of the header field name, followed by a colon, and then the header field value, also called header field body. For a header that has been canonicalized with the “relaxed” algorithm, the header fields are separated by CRLF, and header fields themselves cannot contain CR or LF.

The following piece of code from the function `constrain_header_field` is supposed to verify that the claimed header field value contains no CR.

**lib/src/headers/mod.nr:L62-L73**

```
// check the header field is uninterrupted
let start_index = header_field_sequence.index + HEADER_FIELD_NAME_LENGTH + 1;
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

However, as `start_index` is initialized to `header_field_sequence.index + HEADER_FIELD_NAME_LENGTH + 1` and the loop index `i` starts at `HEADER_FIELD_NAME_LENGTH + 1`, the first `index` we actually check to be unequal to CR is `header_field_sequence.index + 2 * HEADER_FIELD_NAME_LENGTH + 2` – whereas it *should* be `header_field_sequence.index + HEADER_FIELD_NAME_LENGTH + 1`. In other words, some indices remain unchecked.

The same problem occurs in `constrain_header_field_detect_last_angle_bracket`:

**lib/src/headers/mod.nr:L123-L139**

```
// check the header field is uninterrupted
let mut last_angle_bracket = 0;
let start_index = header_field_sequence.index + HEADER_FIELD_NAME_LENGTH + 1;
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
}

```

An attacker could use this to join two header fields and claim that it is one. While there are limitations to exploiting this in practice because the number of unchecked positions is typically small, there is still enough room for attacks. Consider, for example, the following excerpt from a relaxed-canonicalized header:

```
subject:yes
to:[email protected](/cdn-cgi/l/email-protection)

```

Due to the bug we described, it is possible to prove that the subject of this email contains or even starts with “no”, which could clearly have severe implications.

#### Recommendation

In both functions, initialize `start_index` to `header_field_sequence.index`. This avoids the “double addition” of `HEADER_FIELD_NAME_LENGTH + 1`.
