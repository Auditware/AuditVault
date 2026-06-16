---
tags:
  - lang/move
  - platform/ottersec
  - severity/high
  - novelty/variant
  - sector/infra
protocol: "[[Sui]]"
auditors:
  - "[[Cauê Obici]]"
report: "https://mystenlabs.com/"
genome:
  - "[[wrong-condition]]"
  - "[[wrong-state]]"
  - "[[cross-contract-state-consistency]]"
  - "[[variant]]"
---
# Incorrect Value In Record Name

- id: 48093
- impact: HIGH
- protocol: [[Mysten Labs Sui]]
- reporter: Cauê Obici (OtterSec)
- source: https://mystenlabs.com/

## Summary


The function "registry::get_name_record_all_fields" is supposed to retrieve certain information from a given domain name. However, there are two situations where it returns incorrect values. Firstly, when the domain is a normal one, the function returns an empty string for the default domain name. Secondly, when the domain is a subdomain of "addr.reverse", the function returns the default domain name without checking for validity. To fix this, the code needs to be adjusted to handle these scenarios properly. Currently, this part of the code has been removed and will be rewritten in the future.

## Details

## Documentation for `get_name_record_all_fields`

`registry::get_name_record_all_fields` retrieves owner, linked address, TTL, and default domain name from a domain name.

## Source
```
source/tmp/registry.move RUST
```

## Function Signature
```rust
public fun get_name_record_all_fields(suins: &SuiNS, domain_name: vector<u8>)
    -> (address, address, u64, String) {
    let name_record = get_name_record(suins, utf8(domain_name));
    (
        name_record_owner(name_record),
        name_record_linked_addr(name_record),
        name_record_ttl(name_record),
        name_record_default_domain_name(name_record)
    )
}
```

## Description
This function returns erroneous values under two circumstances:
1. When the domain is a normal domain, the function returns an empty string for `default_domain_name`.
2. When the domain is a subdomain of `addr.reverse`, the function returns the default domain name without validation.

## Remediation
Handle the previous scenarios and return the correct value.

## Patch
This portion of the code has been temporarily removed and will be rewritten in the future.
