---
tags:
  - severity/high
  - lang/rust
  - sector/restaking
  - sector/staking-pool
  - platform/quantstamp
protocol: "[[Fragmetric Restaking Program]]"
auditors:
  - Michael Boyle
report: "https://certificate.quantstamp.com/full/fragmetric-restaking-program/79bdc5ab-27d1-480e-bc8a-cf883ed0bb83/index.html"
genome:
  - "[[dos-resistance]]"
  - "[[dos/lockup]]"
  - "[[dos/permanent]]"
  - "[[known-pattern]]"
  - "[[privileged-tx]]"
  - "[[redesign-logic]]"
  - "[[precondition/privileged-caller]]"
  - "[[blast-radius/single-pool]]"
---
# Closing a Rewardpool Will Block Deposits, Withdrawals, Updates, and Transfers

- id: 58734
- impact: HIGH
- protocol: Fragmetric Restaking Program
- reporter: Michael Boyle (Quantstamp)
- source: https://certificate.quantstamp.com/full/fragmetric-restaking-program/79bdc5ab-27d1-480e-bc8a-cf883ed0bb83/index.html

## Summary


The client has marked a bug as "Fixed" in the `modules/reward/update.rs` file with the code `d71f29ee6150349331749c6602e7ebc648467097`. The bug occurs when a `RewardAccount` contains multiple `RewardPools` and one of the pools is closed. This prevents the `update_reward_pools_token_allocation` function from properly updating all the reward pools, causing an error and halting the process. This can be exploited by closing a single `RewardPool` in any `RewardAccount` and attempting to update all the pools, resulting in a denial of service. The recommendation is to modify the `update()` function to return instead of throwing an error if the pool is closed.

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `d71f29ee6150349331749c6602e7ebc648467097`.

**File(s) affected:**`modules/reward/update.rs`

**Description:** A given `RewardAccount` can contain up to 4 pools of the type `RewardPool`. When `fragSol` moves from one user to another, or during minting and burning, the function `update_reward_pools_token_allocation` is invoked to update the reward pools in the given `rewardAccount`.

This happens in the following loop:

```
for reward_pool in self.get_related_pools(&from.user, receipt_token_mint)? {
...
reward_pool.update(effective_deltas, current_slot)?;
...
}
```

However, if a `RewardPool` is closed, the `update()` function will throw an error:

```
&nbsp;fn update(
&mut self,
deltas: Vec<TokenAllocatedAmountDelta>,
current_slot: u64,
 ) -> Result<Vec<TokenAllocatedAmountDelta>> {
if self.is_closed() {
err!(ErrorCode::RewardPoolClosedError)?
}
 ...
}
```

Thus, closing a single `RewardPool` in any `RewardAccount` will prevent updating all the reward pools. And also all user reward pools.

**Exploit Scenario:**

 The `RewardAccount` in this example has two `RewardPool`, and it closes the second one with ID `1` .

The `await restaking.runUserDepositSOL(user1, amount, null);` will fail, because it will attempt to update all the reward pools, and since one is closed, it will throw an error and will not continue the loop.

```
step("PoC for DoS", async function () {
await new Promise(resolve => setTimeout(resolve, 10000));
await Promise.all([
restaking.tryAirdrop(user1.publicKey, 100),
restaking.tryAirdrop(user2.publicKey, 100),
]);
await restaking.sleep(1);
const amount = new BN(10 * anchor.web3.LAMPORTS_PER_SOL);
let ix = await restaking.methods.fundManagerCloseRewardPool(1).accounts({
fundManager: user1.publicKey,
}).signers([user1]).rpc();
let tx = new anchor.web3.Transaction();
await restaking.runUserDepositSOL(user1, amount, null); // <- fails
});
```

**Recommendation:** Consider returning from the reward pool's `update()` function if it is closed instead of throwing an error.
