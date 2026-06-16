---
tags:
  - lang/move
  - sector/infra
  - sector/nft
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - impact/dos/permanent
protocol: "[[Initia]]"
auditors:
  - "[[0xluk3]]"
report: "https://code4rena.com/reports/2025-01-initia-move"
genome:
  - "[[frozen-funds]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
---
# [H-02] NFT Token ID contains forbidden character by design which prevents any domain from being issued at all

- id: 55275
- impact: HIGH
- protocol: [[Initia]]
- reporter: 0xluk3 (Code4rena)
- source: https://code4rena.com/reports/2025-01-initia-move

## Summary


The `usernames` module has a bug that prevents the registration of a domain. This is because the NFTs that are supposed to be minted during registration have a forbidden character, `:`, which causes the original unit tests to fail. This bug makes it impossible to use the protocol as no NFTs can be created, resulting in a permanent denial of service. The bug can be reproduced by running the original unit tests and adding a debug print in line 362. The error call stack shows that the bug occurs in the `mint_nft_object` function, which requires the token ID to not have the `:` character. A simple proof of concept has been provided to demonstrate the bug. The recommended mitigation step is to change the `:` character to another separator. The bug has been confirmed and fixed by the team.

## Details



The `usernames` module allows for registering a domain. This happens in function `register_domain`. On registration, a NFT is minted to the buyer, with field `Token ID` in format `domain:timestamp`. However the `:` character is forbidden by underlying `nft.move` module which is also the reason why original unit tests fail.

Due to this, the protocol cannot be used in its current state, because no NFTs can be currently minted, thus, no domains can be claimed. Hence, this is equivalent to a permanent DoS.

### Proof of Concept

In `register_domain`, the `name` string is being appended *`.init:timestamp`* in line [358-360](https://github.com/code-423n4/2025-01-initia-move/blob/main/usernames-module/sources/name_service.move# L358-L360).

Running original unit tests, e.g., `initiad move test --log_level trace --path ./usernames-module -f end_to_end`. a debug print was added in line 362: `std::debug::print(&name);`
```

BUILDING Usernames
Running Move unit tests
[debug] "abc.init:100"
[ FAIL    ] 0x42cd8467b1c86e59bf319e5664a09b6b5840bb3fac64f5ce690b5041c530565a::usernames::end_to_end

Test failures:

Failures in 0x42cd8467b1c86e59bf319e5664a09b6b5840bb3fac64f5ce690b5041c530565a::usernames:

┌── end_to_end ──────
│ error[E11001]: test failure
│    ┌─ /home/move/.move/https___github_com_initia-labs_movevm_git_b6320db6def0aa9438abdb0e7f3f5bda711c8081/precompile/modules/initia_stdlib/sources/token/nft.move:94:37
│    │
│ 86 │     fun assert_token_id(token_id: &String) {
│    │         --------------- In this function in 0x1::nft
│    ·
│ 94 │             error::invalid_argument(EINVALID_TOKEN_ID)
│    │                                     ^^^^^^^^^^^^^^^^^ Test was not expected to error, but it aborted with code 65545 originating in the module 0000000000000000000000000000000000000000000000000000000000000001::nft rooted here
│
│
│ stack trace
│ 	nft::create(/home/move/.move/https___github_com_initia-labs_movevm_git_b6320db6def0aa9438abdb0e7f3f5bda711c8081/precompile/modules/initia_stdlib/sources/token/nft.move:112)
│ 	initia_nft::mint_internal(/home/move/.move/https___github_com_initia-labs_movevm_git_b6320db6def0aa9438abdb0e7f3f5bda711c8081/precompile/modules/initia_stdlib/sources/token/initia_nft.move:212-219)
│ 	initia_nft::mint_nft_object(/home/move/.move/https___github_com_initia-labs_movevm_git_b6320db6def0aa9438abdb0e7f3f5bda711c8081/precompile/modules/initia_stdlib/sources/token/initia_nft.move:189-196)
│ 	usernames::register_domain(./sources/name_service.move:365-372)
│ 	usernames::end_to_end(./sources/name_service.move:753)
│
└──────────────────
```

Tracking back the error call stack:

* It fails in [`mint_nft_object`](https://github.com/code-423n4/2025-01-initia-move/blob/main/usernames-module/sources/name_service.move# L364-L371)

  + Then in [`initia_nft.move# L189-L196`](https://github.com/initia-labs/movevm/blob/main/precompile/modules/initia_stdlib/sources/token/initia_nft.move# L189-L196)
  + Then in the same file [`212-219`](https://github.com/initia-labs/movevm/blob/main/precompile/modules/initia_stdlib/sources/token/initia_nft.move# L212-L219)
  + Then in [`nft.move# 112`](https://github.com/initia-labs/movevm/blob/main/precompile/modules/initia_stdlib/sources/token/nft.move# L112) on call to `assert_token_id(&token_id);`.

This [function](https://github.com/initia-labs/movevm/blob/main/precompile/modules/initia_stdlib/sources/token/nft.move# L86-L96) is provided below:
```

    fun assert_token_id(token_id: &String) {
        let len = string::length(token_id);
        assert!(
            len <= MAX_NFT_TOKEN_ID_LENGTH,
            error::out_of_range(ENFT_TOKEN_ID_TOO_LONG)
        );
        assert!(
            string::index_of(token_id, &string::utf8(b":")) == len,
            error::invalid_argument(EINVALID_TOKEN_ID)
        );
    }
```

In the second assertion it requires `:` to be NOT present in the `token_id`. `index_of` will be equal to `len` only if the searched character will not be present in the string.

Since the name is passed as 4th argument to `mint_nft_object`, which is [defined](https://github.com/initia-labs/movevm/blob/main/precompile/modules/initia_stdlib/sources/token/initia_nft.move# L180) as:
```

    public fun mint_nft_object(
        creator: &signer,
        collection: String,
        description: String,
        token_id: String,
        uri: String,
        can_burn: bool
    )
```

Then, using a `:` by default causes the NFT to be not issued and function reverts.

Using a simple PoC:
```

#[test(chain = @0x1, source = @usernames, user1 = @0x2, user2 = @0x3, lp_publisher = @0x3)]
fun my_poc_just_register(
    chain: signer,
    source: signer,
    user1: signer,
    user2: signer,
    lp_publisher: signer,
) acquires CoinCapsInit, ModuleStore {
    // Setup environment
    deploy_dex(&chain, &lp_publisher);
    let chain_addr = signer::address_of(&chain);
    let addr1 = signer::address_of(&user1);

    // Give tokens to users for registration
    init_mint_to(chain_addr, &user1, 100);
    init_mint_to(chain_addr, &user2, 100);

    // Initialize the name service with short durations for testing
    initialize(
        &source,
        100,  // price for 3 char
        50,   // price for 4 char
        10,   // default price
        1000, // min duration
        1000, // grace period
        string::utf8(b"https://test.com/"),
        string::utf8(b"https://test.com/"),
    );

    // Set initial block time
    std::block::set_block_info(100, 1000);

    // Step 1: Register all domains
    let domain_name1 = string::utf8(b"abc");
    let domain_name2 = string::utf8(b"def");
    let domain_name3 = string::utf8(b"ghi");

    std::debug::print(&string::utf8(b"\n=== Registering all domains ==="));
    register_domain(&user1, domain_name1, 1000);
    register_domain(&user1, domain_name2, 1000);
    register_domain(&user1, domain_name3, 1000);
}
```

`initiad move test --log_level trace --path ./usernames-module -f my_poc_just_register`

Line 359 is changed:
```

string::append_utf8(&mut name, b"-");//@audit was ":"
```

Result:
```

Running Move unit tests
[debug] "
=== Registering all domains ==="
[debug] "abc.init-1000"
[debug] "def.init-1000"
[debug] "ghi.init-1000"
[ PASS    ] 0x42cd8467b1c86e59bf319e5664a09b6b5840bb3fac64f5ce690b5041c530565a::usernames::my_poc_just_register
```

### Recommended mitigation steps

Change the colon `:` to other separator.

**[andrew (Initia) confirmed and commented](https://code4rena.com/audits/2025-01-initia-move/submissions/F-5?commentParent=dvoXEdfFBhn):**

> Fixed this in [this commit](https://github.com/code-423n4/2025-01-initia-move/commit/744914fb5a6334e097c6c49d8366c4920d306bc9).

---
