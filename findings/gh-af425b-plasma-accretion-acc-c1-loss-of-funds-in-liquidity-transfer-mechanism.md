---
tags:
  - blockchain/solana
  - lang/rust
  - platform/accretion-labs
  - severity/high
  - impact/loss-of-funds/direct-drain
  - sector/dex
  - check/token-dust-handling
protocol: "[[Plasma Accretion]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[frozen-funds]]"
  - "[[direct-drain]]"
  - "[[dos-resistance]]"
  - "[[reward-accounting]]"
  - "[[token-dust-handling]]"
---
ACC-C1
Loss of Funds in Liquidity Transfer Mechanism
critical
fixed
ACC-M1
When Selling with Exact out, A Larger Amount Can be
Swapped Through The Limit Order than It Holds
medium
fixed
ACC-M2
Incorrect calculation of vesting time passage
medium
fixed
ACC-L1
Broken invariant when force vesting shares
low
fixed
ACC-L2
Fully re-vested shares become unvested again when
transfering LP positions
low
accepted
ACC-L3
Unauthorized Liquidity Transfer Can Cause DoS for Liquidity
Addition
low
fixed
ACC-L4
Value truncation on pool creation leads to incorrect event
reporting
low
fixed
ACC-I1
AMM operations are Asymmetric
info
accepted

3
© 2025 Accretion Labs Pte. Ltd. All Rights Reserved.
DETAILED ISSUES
ID
ACC-C1
Title
Loss of Funds in Liquidity Transfer Mechanism
Severity
critical
Status
fixed
Description
The transfer_liquidity function in `crates/plasma_state/src/lp.rs` doesn't preprocess the destination LP
position before the transfer, leading to loss of funds and reward factor manipulation.
The fee collection mechanism works like this:
• each LP position has 3 relevant variables. • LP shares which is how many shares it owns • Reward Factor
Snapshot which is the last used Reward Factor • uncollected fees, which is the amount of fees we can withdraw
Whenever we call preprocess_lp_position, the uncollected fees is updated with all the fees that have been
accumulated in the time since the last call to this function. For this, we take the current reward factor from the AMM,
and subtract the reward factor snapshot in the LP position from it. The difference represents the newly accumulated
fees per share for that pool since the last update. We then calculate our uncollected fees by multiplying the reward
factor difference with the number of LP shares of the position. The reward factor snapshot is updated to the latest
reward factor from the AMM.
This function has to be called whenever new lp_shares are added to a position, otherwise we can inflate our
withdrawable fees by initializing a position with no shares, wait a long time until the reward factor diff is high, and
then add a lot of shares to the position and withdraw fees as if these shares were locked in the position for the
whole time.
However, the transfer_liquidity function does not call `preprocess_lp_position` on the destination LP
position, which means we can add LP shares to a position in exactly this malicious way.
An attacker can create multiple empty LP positions, wait for an extended time period, and then create a very large
LP position. From this, they withdraw fees, transfer to one of their old empty LP positions, withdraw fees from this,
transfer to the next one, withdraw fees, and so on, fully draining a pool.
Location
https://github.com/Ellipsis-Labs/plasma/blob/b371a6cebece41d9fac476e22392f3ab381750e7/crates/plasma_state/
src/lp.rs#L176-L183
Relevant Code
/// plasma_state/src/lp.rs L176-L183
    pub fn transfer_liquidity(
        &mut self,
        slot: SlotWindow,
        amm: &Amm,
        dst: &mut LpPosition,
    ) -> Result<u64, PlasmaStateError> {
        self.preprocess_lp_position(slot, amm)?;
Mitigation Suggestion

4
© 2025 Accretion Labs Pte. Ltd. All Rights Reserved.
Add dst.preprocess_lp_position(slot, amm)?; before adding shares to the destination position, to also
preprocess and accumulate fees for it.
Remediation
Fixed in commit 92d02bdd3c0063ec653dafa347ff6736fd26fc04.

5
© 2025 Accretion Labs Pte. Ltd. All Rights Reserved.
ID
ACC-M1
Title
When Selling with Exact out, A Larger Amount Can be Swapped Through The Limit Order than It
Holds
Severity
medium
Status
