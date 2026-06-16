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
  - "[[access-roles]]"
---
# Header Field Extraction Can Be Fooled by Passing a Simple-Canonicalized Header

- id: 49485
- impact: HIGH
- protocol: [[ZK Email Noir]]
- reporter: Heiko Fisch (ConsenSys)
- source: https://diligence.consensys.io/audits/2024/12/zk-email-noir/

## Summary


This bug report discusses a problem with the codebase that only supports one type of canonicalization algorithm, which can lead to unexpected results when verifying email signatures. The report recommends making changes to the code to prevent this issue from occurring and suggests implementing stricter rules for reading header values in the future.

## Details

#### Description

Since emails are frequently modified in transit – in ways that are insignificant semantically but would impact signature verification – a canonicalization algorithm is applied to header and body (separately) before signing and, hence, signature verification. RFC 6376 defines two such algorithms: simple and relaxed. Currently, the codebase supports only the relaxed variant; for instance, extracting the DKIM signature header fails if the header field name after canonicalization is “DKIM-Signature” instead of “dkim-signature”, where the latter is what relaxed canonicalization invariably produces, while simple canonicalization lets the capital letters pass unmodified. While the restriction to relaxed canonicalization is not properly documented, we assume in this report that this is known and – at least for the time being – acceptable.

Nevertheless, it still shouldn’t be possible to prove something wrong when a simple-canonicalized and properly signed header is passed into the circuit. That is currently possible, though. Specifically, with relaxed header canonicalization, header fields are separated by CRLF, and CRLF can’t occur *within* a header field. In other words, if a sequence is directly preceded by CRLF (or starts at the very beginning of the entire header) and is directly followed by CRLF (or ends at the very end of the entire header) and doesn’t contain CRLF, then this sequence covers exactly one header field. That’s the algorithm for header field extraction implemented in `constrain_header_field` and `constrain_header_field_detect_last_angle_bracket`.

Simple canonicalization, on the other hand, allows the header field (body) to be split into multiple lines. Specifically, if a CRLF is followed by whitespace (space or horizontal tab), then the whitespace and what comes after it belong to the previous header field. In other words, a CRLF that’s followed by whitespace does not mark the end of a header field.

Hence, the current algorithm to extract a header field allows the following exploit: Provide a properly signed, simple-canonicalized header, so signature verification will pass. Then, by choosing a sequence that marks a header field up until the first CRLF+whitespace, extract only the start of the header field as the *entire* header field.

Extracting the end or a middle part of a header field as a full field is, in theory, possible too with this approach, but it might be more difficult to exploit it *meaningfully* because the extracted part would (1) start with whitespace, (2) have to contain a colon, and (3) all characters up to this colon, including the whitespace at the beginning, would become the header field name. While this is technically allowed at the moment (see [issue 5.3](#missing-validation-of-characters-in-header_field_name)​), the result is not a valid header field name because of the leading whitespace and possibly other characters before the colon that may not occur in header field names.

As a concrete exploit example, with the following occurring in a header that’s canonicalized with the “simple” algorithm and then signed, it would be possible to prove that this email was sent from `[email protected](/cdn-cgi/l/email-protection)`, instead of `[email protected](/cdn-cgi/l/email-protection)`:

```
from: ":[email protected](/cdn-cgi/l/email-protection)>"
 <bob.example.org>

```
#### Recommendation

First and foremost, `constrain_header_field` and `constrain_header_field_detect_last_angle_bracket` must not accept CRLF as a delimiter between header fields when it is followed by whitespace.

Regarding the example exploit above, it should be noted that a more stringent rule in `get_email_address` would’ve prevented that too: If no left angle bracket is present in the header field, the email sequence has to start right after the colon that follows the header field name and its end must also be the end of the header field. (And similarly, although that has nothing to do with the example above: If we do find a left angle bracket, we should not only verify that the email address sequence starts right after it but also that it is followed by a right angle bracket and the header field ends after that.) Likewise, in the event that other header value reading functions are introduced, such as for the “Subject” header, there should be similar constraints that ensure the header value begins right after the header name ends, and the header value ends when the header ends.
