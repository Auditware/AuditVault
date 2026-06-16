---
tags:
  - lang/anchor
  - lang/rust
  - sector/bridge
  - platform/cantina
  - severity/high
protocol: "[[Layer N]]"
auditors:
  - Mario Poneder
report: "https://cdn.cantina.xyz/reports/cantina_n1_march2025.pdf"
genome:
  - "[[bridge-merkle-proof]]"
  - "[[unchecked-return-value]]"
  - "[[variant]]"
  - "[[external-call-is-safe]]"
  - "[[add-check]]"
---
# Withdrawal roots can be speciﬁcally crafted such that multiple withdrawals are possible 

- id: 52883
- impact: HIGH
- protocol: Layer N
- reporter: Mario Poneder (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_n1_march2025.pdf

## Summary


Summary:

The report discusses a bug in the code related to withdrawing funds. The bug allows an operator to set the withdrawal root to just the digest of the leaf, bypassing the root check and allowing for multiple withdrawals. The recommendation is to incorporate the leaf index into the root computation and to assert that the leaves length is greater than the leaf index, even in the case of an empty proof. The bug has been fixed in the latest commit.

## Details

## Analysis of Vulnerability in Merkle Root Calculation

## Context
- `withdraw.rs#L23-L30`, `withdraw.rs#L46-L67`, `merkle.rs#L40-L66`

## Description
The `root_from_proof` function below will successfully skip the for-loop's body in case `leaves_len == 1` and an empty proof, i.e., `proof.len() == 0`.

```rust
pub fn root_from_proof<L>(
    leaf: L,
    leaf_idx: LeafIdx,
    leaves_len: LeafIdx,
    proof: &[[u8; 32]],
    digest_cb: impl Fn(L, &mut sha2::Sha256),
) -> [u8; 32] {
    let ceil_log2_n: u8 = leaves_len.checked_next_power_of_two().unwrap().ilog2() as u8;
    let mut root = hash_leaf(leaf, &digest_cb);
    let mut i: Height = 0;
    for h in 0..ceil_log2_n { // @audit skipped if leaves_len == 1
        let begin = subtree_ofs(leaf_idx, h);
        if begin >= leaves_len {
            continue;
        }
        let is_leaf_left = leaf_idx & (1 << h) == 0;
        root = if is_leaf_left {
            hash_pair(root, proof[i as usize])
        } else {
            hash_pair(proof[i as usize], root)
        };
        i += 1;
    }
    assert_eq!(i as usize, proof.len()); // @audit passes if proof.len() == 0
    root // @audit returns hash_leaf(leaf, &digest_cb) if loop is skipped
}
```

In this case, the `leaf_idx` parameter is ignored, and the return value is just the digest of the leaf.

## Attack Vector
The operator who proposes a block can arbitrarily set the `withdrawal_root`, allowing it to be just the digest of the `leaf_to_prove`. In this case, it suffices to invoke the `withdraw` instruction below with `claim.leaves_count == 1` and an empty `claim.proof` to pass the root check and proceed with the withdrawal.

```rust
pub fn withdraw(ctx: Context<Withdraw>, claim: WithdrawalClaim) -> Result<()> {
    let root = ctx.accounts.state_update.facts.withdrawal_root;
    let leaf_to_prove = TransferParams {
        user: claim.user,
        mint: ctx.accounts.to_account.mint,
        amount: claim.amount,
    };
    let computed_root = crate::merkle::root_from_proof(
        &leaf_to_prove,
        claim.leaf_index,
        claim.leaves_count,
        &claim.proof,
        TransferParams::digest,
    );
    if root != computed_root { // @audit will pass if withdrawal_root is digest of leaf_to_prove
        return err!(BridgeError::InvalidWithdrawalProof);
    }
    // ...
}
```

In order to avoid multiple withdrawals reusing the same block, the Withdraw context implements the `withdrawal_nullifier` below.

## Withdrawal Nullifier
**[derive(Accounts)]:**
```rust
#[instruction(claim: WithdrawalClaim)]
pub struct Withdraw<'info> {
    // ...
    #[account(
        init,
        payer = payer,
        space = 8,
        seeds = [WITHDRAWAL_NULLIFIER_SEED, &claim.block_id.to_le_bytes(), &claim.leaf_index.to_le_bytes()],
        bump,
    )]
    pub withdrawal_nullifier: Account<'info, WithdrawalNullifier>,
    // ...
}
```

However, in case of an empty proof, as discussed above, the `claim.leaf_index` is ignored in the root computation and therefore can be set to arbitrary values to bypass the `withdrawal_nullifier`, allowing multiple withdrawals.

## Recommendation
It is recommended to incorporate the `leaf_idx` into the root computation in any case and assert that `leaves_len > leaf_idx` to also evaluate the `leaf_idx` in case of an empty proof.

## Layer N
We now commit to the leaf index as of commit `7dba5a0a`.

## Cantina Managed
Fix verified.
