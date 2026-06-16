---
tags:
  - lang/solidity
  - platform/spearbit
  - has/github
  - severity/high
  - sector/token
protocol: "[[Astera]]"
auditors:
  - "[[Saw-mon and Natalie]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Astera-Spearbit-Security-Review-December-2024.pdf"
genome:
  - "[[decimal-mismatch]]"
  - "[[fee-theft]]"
  - "[[token-decimal-normalization]]"
---
# Mix of scaled and non-scaled parameters in _afterTokenTransfer

- id: 62281
- impact: HIGH
- protocol: [[Astera]]
- reporter: Saw-mon and Natalie (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Astera-Spearbit-Security-Review-December-2024.pdf

## Summary


The bug report discusses a high-risk issue in the code of ATokenERC6909, specifically in the `_afterTokenTransfer` function. The code mixes scaled and unscaled parameters in arithmetic operations, which can lead to incorrect calculations. This function is used to update incentives for token transfers, but it does not properly handle the scaling of certain parameters. The report recommends fixing this issue by ensuring that all units/amounts are scaled properly when calling the `INCENTIVES_CONTROLLER.handleAction` function. It also suggests moving this function to the `IncentivizedERC6909` contract for consistency. The bug has been fixed in a recent commit by the Astera team and verified by Spearbit.

## Details

## Severity: High Risk

## Context
ATokenERC6909.sol#L396-L432.

## Description
Mixing of scaled and unscaled parameters in arithmetic (addition/subtraction) operations has been used in `_afterTokenTransfer`. The amount input to `_afterTokenTransfer` comes from `super.{transfer, transferFrom, _mint, _burn}` of ERC6909, which is a scaled down amount (scaled down by the corresponding index, `x.rayDiv(i)`).

However, the following parameters are **not scaled down** and include the indices:

- `uint256 oldSupply = totalSupply(id); // not scaled` (only at this line later when `_decrementTotalSupply` or `_incrementTotalSupply` is called it would be scaled)
- `uint256 oldFromBalance = balanceOf(from, id); // not scaled`
- `uint256 oldToBalance = balanceOf(to, id); // not scaled`

Here is the summary line by line:

```solidity
function _afterTokenTransfer(
    address from,
    address to,
    uint256 id,
    uint256 amount // scaled
)
internal
override
{
    uint256 oldSupply = totalSupply(id); // not scaled
    uint256 oldFromBalance = balanceOf(from, id); // not scaled
    uint256 oldToBalance = balanceOf(to, id); // not scaled
    if (from == address(0) && to != address(0)) {
        oldSupply = _incrementTotalSupply(id, amount); // scaled
        oldToBalance = oldToBalance - amount; // mix: (not scaled) - (scaled)
        oldFromBalance = 0;
        if (address(INCENTIVES_CONTROLLER) != address(0)) {
            INCENTIVES_CONTROLLER.handleAction(id, to,
                oldSupply, // scaled
                oldToBalance // mix: (not scaled) - (scaled)
            );
        }
    } else if (to == address(0) && from != address(0)) {
        oldSupply = _decrementTotalSupply(id, amount); // scaled
        oldFromBalance = oldFromBalance + amount; // mix: (not scaled) + (scaled)
        oldToBalance = 0;
        if (address(INCENTIVES_CONTROLLER) != address(0)) {
            INCENTIVES_CONTROLLER.handleAction(id, from,
                oldSupply, // scaled
                oldFromBalance // mix: (not scaled) + (scaled)
            );
        }
    } else {
        oldFromBalance = oldFromBalance + amount; // mix: (not scaled) + (scaled)
        oldToBalance = oldToBalance - amount; // mix: (not scaled) - (scaled)
        if (address(INCENTIVES_CONTROLLER) != address(0)) {
            INCENTIVES_CONTROLLER.handleAction(id, from,
                oldSupply, // not scaled
                oldFromBalance // mix: (not scaled) + (scaled)
            );
            if (from != to) {
                INCENTIVES_CONTROLLER.handleAction(id, to,
                    oldSupply, // not scaled
                    oldToBalance // mix: (not scaled) - (scaled)
                );
            }
        }
    }
}
```

For the ATokens in `IncentivizedERC20`, the `_transfer`, `_mint`, and `_burn` functions supply the scaled total supply and balances to the incentives controller, which means the units of the non-rebasing aToken are used there.

## Recommendation
Make sure scaled units/amounts are supplied to `INCENTIVES_CONTROLLER.handleAction`:

```diff
diff --git a/contracts/protocol/tokenization/ERC6909/ATokenERC6909.sol b/contracts/protocol/tokenization/ERC6909/ATokenERC6909.sol
index 2de411d..fc521b0 100644
--- a/contracts/protocol/tokenization/ERC6909/ATokenERC6909.sol
+++ b/contracts/protocol/tokenization/ERC6909/ATokenERC6909.sol
@@ -390,21 +390,21 @@ contract ATokenERC6909 is IncentivizedERC6909, VersionedInitializable {
 * @param from The address tokens are transferred from.
 * @param to The address tokens are transferred to.
 * @param id The token ID being transferred.
- * @param amount The amount being transferred.
+ * @param amount The amount being transferred in shares.
 * @dev Updates incentives based on transfer type (mint/burn/transfer).
+ * @dev this hook gets called from solday 's `ERC6909` which only deals with shares
 */
function _afterTokenTransfer(address from, address to, uint256 id, uint256 amount)
internal
override
{
- uint256 oldSupply = totalSupply(id);
- uint256 oldFromBalance = balanceOf(from, id);
- uint256 oldToBalance = balanceOf(to, id);
+ uint256 oldSupply = super.totalSupply(id);
+ uint256 oldFromBalance = super.balanceOf(from, id);
+ uint256 oldToBalance = super.balanceOf(to, id);
 // If the token was minted.
 if (from == address(0) && to != address(0)) {
    oldSupply = _incrementTotalSupply(id, amount);
    oldToBalance = oldToBalance - amount;
-   oldFromBalance = 0;
    if (address(INCENTIVES_CONTROLLER) != address(0)) {
        INCENTIVES_CONTROLLER.handleAction(id, to, oldSupply, oldToBalance);
    }
@@ -412,7 +412,6 @@ contract ATokenERC6909 is IncentivizedERC6909, VersionedInitializable {
} else if (to == address(0) && from != address(0)) {
    oldSupply = _decrementTotalSupply(id, amount);
    oldFromBalance = oldFromBalance + amount;
-   oldToBalance = 0;
    if (address(INCENTIVES_CONTROLLER) != address(0)) {
        INCENTIVES_CONTROLLER.handleAction(id, from, oldSupply, oldFromBalance);
    }
```

Moreover, this hook can be moved to `IncentivizedERC6909` to mimic the pattern from the `IncentivizedERC20` counterpart. In general, it might make sense to use Solidity's type system and override arithmetic operations to guarantee type safety during compilation and avoid mistakes like the above.

**Astera**: Fixed in commit 92f8ffaf.  
**Spearbit**: Fix verified.
