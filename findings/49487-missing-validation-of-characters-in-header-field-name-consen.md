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
# Missing Validation of Characters in header_field_name

- id: 49487
- impact: HIGH
- protocol: [[ZK Email Noir]]
- reporter: Heiko Fisch (ConsenSys)
- source: https://diligence.consensys.io/audits/2024/12/zk-email-noir/

## Summary


This bug report discusses two functions in the mod.nr code that are responsible for extracting header fields from a sequence. The problem is that these functions do not validate the header field name, which can lead to errors in the extracted data. The recommendation is to add a validation step to ensure that the header field name only contains allowed characters and does not include a colon. It is also recommended to add a static assertion to ensure that the header field name has a non-zero length.

## Details

#### Description

The `constrain_header_field` and `constrain_header_field_detect_last_angle_bracket` functions in `mod.nr` take as input the (signed) header, a sequence that is supposed to represent a complete header field (name, colon, and value), and the header field name of the header field we want to extract. The main task of these two functions is to make sure that the sequence doesn’t cover *less* than an entire header field, doesn’t cover *more* than one header field, and starts with `header_field_name`, followed by a colon.

These functions trust that `header_field_name` is indeed a valid header field name and don’t perform any kind of validation on it. However, if `header_field_name` contains, for example, CRLF, then the sequence can spread over more than one header field. If it contains a colon, then part of the actual header field body is attributed to the header field name. For example, if the “Subject” header field is `subject:foo:bar` (i.e., name is “subject” and value is “foo:bar”), then it would be possible to prove that there is a header field with name “subject:foo” and value “bar”.

#### Recommendation

Both functions have to verify that `header_field_name` contains only characters that are allowed in header field names, which is the range 0x21-0x7E (inclusive), but excluding the colon (0x3A).

Theoretically, it should be sufficient to assert that `header_field_name` doesn’t contain a colon. If we trust the signer to only sign RFC-compliant header fields, then any other character that is invalid in field names would have to come after the colon that marks the end of the field name. Hence, if `header_field_name` contains an invalid character at all, it also contains a colon. However, trying to be “too smart” with these things can be dangerous, and we actually recommend the more cautious approach from the previous paragraph.

It also makes sense to statically assert `HEADER_FIELD_NAME_LENGTH != 0`.
