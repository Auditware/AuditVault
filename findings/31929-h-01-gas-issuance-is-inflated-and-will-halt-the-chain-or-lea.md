---
tags:
  - lang/solidity
  - sector/dex
  - sector/launchpad
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - vuln/dos/frozen-funds
  - vuln/logic/fee-calculation
  - impact/loss-of-funds/direct-drain
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Taiko]]"
auditors:
  - "[[monrel]]"
report: "https://code4rena.com/reports/2024-03-taiko"
genome:
  - "[[frozen-funds]]"
  - "[[fee-calculation]]"
  - "[[direct-drain]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
  - "[[fee-accounting]]"
---
# [H-01] Gas issuance is inflated and will halt the chain or lead to incorrect base fee

- id: 31929
- impact: HIGH
- protocol: [[Taiko]]
- reporter: monrel (Code4rena)
- source: https://code4rena.com/reports/2024-03-taiko

## Summary


Summary:

The bug report highlights an issue with the base fee calculation in the `anchor()` function of the TaikoL2 contract. This results in incorrect issuance and can either lead to the chain halting or a severely deflated base fee. The report provides a proof of concept and suggests issuing exactly `config.gasTargetPerL1Block` for each L1 block as a mitigation step. The severity of the bug is debated among the team, with some suggesting a Medium (M) severity due to no direct loss of funds, while others argue for a High (H) severity as the halted chain can lead to frozen funds and contract upgradability should not be used as a severity mitigation. In the end, the bug is awarded a High severity and is confirmed and commented by the Taiko team. 

## Details


<https://github.com/code-423n4/2024-03-taiko/blob/f58384f44dbf4c6535264a472322322705133b11/packages/protocol/contracts/L2/TaikoL2.sol#L140-L143> 

<https://github.com/code-423n4/2024-03-taiko/blob/f58384f44dbf4c6535264a472322322705133b11/packages/protocol/contracts/L2/TaikoL2.sol#L262-L293> 

<https://github.com/code-423n4/2024-03-taiko/blob/f58384f44dbf4c6535264a472322322705133b11/packages/protocol/contracts/L2/TaikoL2.sol#L145-L152> 

<https://github.com/code-423n4/2024-03-taiko/blob/f58384f44dbf4c6535264a472322322705133b11/packages/protocol/contracts/L2/TaikoL2.sol#L140-L143>

The base fee calculation in the `anchor()` function is incorrect. Issuance is over inflated and will either lead to the chain halting or a severely deflated base fee.

### Proof of Concept

We calculate the 1559 base fee and compare it to `block.basefee` <br><https://github.com/code-423n4/2024-03-taiko/blob/f58384f44dbf4c6535264a472322322705133b11/packages/protocol/contracts/L2/TaikoL2.sol#L140-L143>

```solidity
        (basefee, gasExcess) = _calc1559BaseFee(config, _l1BlockId, _parentGasUsed);
        if (!skipFeeCheck() && block.basefee != basefee) {
            revert L2_BASEFEE_MISMATCH();
        
```

But the calculation is incorrect:

<https://github.com/code-423n4/2024-03-taiko/blob/f58384f44dbf4c6535264a472322322705133b11/packages/protocol/contracts/L2/TaikoL2.sol#L262-L293>

```solidity
        if (gasExcess > 0) {
            // We always add the gas used by parent block to the gas excess
            // value as this has already happened
            uint256 excess = uint256(gasExcess) + _parentGasUsed;

            // Calculate how much more gas to issue to offset gas excess.
            // after each L1 block time, config.gasTarget more gas is issued,
            // the gas excess will be reduced accordingly.
            // Note that when lastSyncedBlock is zero, we skip this step
            // because that means this is the first time calculating the basefee
            // and the difference between the L1 height would be extremely big,
            // reverting the initial gas excess value back to 0.
            uint256 numL1Blocks;
            if (lastSyncedBlock > 0 && _l1BlockId > lastSyncedBlock) {
                numL1Blocks = _l1BlockId - lastSyncedBlock;
            }

            if (numL1Blocks > 0) {
                uint256 issuance = numL1Blocks * _config.gasTargetPerL1Block;
                excess = excess > issuance ? excess - issuance : 1;
            }

            gasExcess_ = uint64(excess.min(type(uint64).max));

            // The base fee per gas used by this block is the spot price at the
            // bonding curve, regardless the actual amount of gas used by this
            // block, however, this block's gas used will affect the next
            // block's base fee.
            basefee_ = Lib1559Math.basefee(
                gasExcess_, uint256(_config.basefeeAdjustmentQuotient) * _config.gasTargetPerL1Block
            );
        }
```

Instead of issuing `_config.gasTargetPerL1Block` for each L1 block we end up issuing `uint256 issuance = (_l1BlockOd - lastSyncedBlock) * _config.gasTargetPerL1Block`.

`lastSyncedBlock` is only updated every 5 blocks.

<https://github.com/code-423n4/2024-03-taiko/blob/f58384f44dbf4c6535264a472322322705133b11/packages/protocol/contracts/L2/TaikoL2.sol#L145-L152>

```solidity
        if (_l1BlockId > lastSyncedBlock + BLOCK_SYNC_THRESHOLD) {
            // Store the L1's state root as a signal to the local signal service to
            // allow for multi-hop bridging.
            ISignalService(resolve("signal_service", false)).syncChainData(
                ownerChainId, LibSignals.STATE_ROOT, _l1BlockId, _l1StateRoot
            );
            lastSyncedBlock = _l1BlockId;
        }
```

If `anchor()` is called on 5 consecutive blocks we end up issuing
in total `15 * _config.gasTargetPerL1Block` instead of `5 * _config.gasTargetPerL1Block`.

When the calculated base fee is compared to the `block.basefee` the following happens:

*   If `block.basefee`reports the correct base fee this will end up halting the chain since they will not match.

*   If `block.basefee` is using the same flawed calculation the chain continues but with a severely reduced and incorrect base fee.

Here is a simple POC showing the actual issuance compared to the expected issuance. Paste the code into TaikoL1LibProvingWithTiers.t.sol and run `forge test --match-test testIssuance -vv`.

<details>

```solidity
    struct Config {
        uint32 gasTargetPerL1Block;
        uint8 basefeeAdjustmentQuotient;
    }

    function getConfig() public view virtual returns (Config memory config_) {
        config_.gasTargetPerL1Block = 15 * 1e6 * 4;
        config_.basefeeAdjustmentQuotient = 8;
    }

    uint256 lastSyncedBlock = 1;
    uint256 gasExcess = 10;
    function _calc1559BaseFee(
        Config memory _config,
        uint64 _l1BlockId,
        uint32 _parentGasUsed
    )
        private
        view
        returns (uint256 issuance, uint64 gasExcess_)
    {
        if (gasExcess > 0) {
            uint256 excess = uint256(gasExcess) + _parentGasUsed;

            uint256 numL1Blocks;
            if (lastSyncedBlock > 0 && _l1BlockId > lastSyncedBlock) {
                numL1Blocks = _l1BlockId - lastSyncedBlock;
            }

            if (numL1Blocks > 0) {
                issuance = numL1Blocks * _config.gasTargetPerL1Block;
                excess = excess > issuance ? excess - issuance : 1;
            }
			// I have commented out the below basefee calculation
			// and return issuance instead to show the actual
			// accumulated issuance over 5 L1 blocks.
			// nothing else is changed
		
            //gasExcess_ = uint64(excess.min(type(uint64).max));
			
            //basefee_ = Lib1559Math.basefee(
            //    gasExcess_, uint256(_config.basefeeAdjustmentQuotient) * _config.gasTargetPerL1Block
            //);
        }

        //if (basefee_ == 0) basefee_ = 1;
    }
        
    function testIssuance() external {
        uint256 issuance;
        uint256 issuanceAdded;
        Config memory config = getConfig();
        for (uint64 x=2; x <= 6 ;x++){
            
            (issuanceAdded ,) = _calc1559BaseFee(config, x, 0);
            issuance += issuanceAdded;
            console2.log("added", issuanceAdded);
        }

        uint256 expectedIssuance = config.gasTargetPerL1Block*5;
        console2.log("Issuance", issuance);
        console2.log("Expected Issuance", expectedIssuance);
        
        assertEq(expectedIssuance*3, issuance);

```

</details>

### Tools Used

Foundry, VScode

### Recommended Mitigation Steps

Issue exactly `config.gasTargetPerL1Block` for each L1 block.

**[dantaik (Taiko) confirmed and commented](https://github.com/code-423n4/2024-03-taiko-findings/issues/276#issuecomment-2031033625):**
 > This is a valid bug report. Fixed in this PR: https://github.com/taikoxyz/taiko-mono/pull/16543

**[0xean (Judge) commented](https://github.com/code-423n4/2024-03-taiko-findings/issues/276#issuecomment-2045139998):**
 > I don't see a direct loss of funds here and believe M is the correct severity.
> > 2 - Med: Assets not at direct risk, but the function of the protocol or its availability could be impacted, or leak value with a hypothetical attack path with stated assumptions, but external requirements.
> 
> > 3 - High: Assets can be stolen/lost/compromised directly (or indirectly if there is a valid attack path that does not have hand-wavy hypotheticals).

**[0xmonrel (Warden) commented](https://github.com/code-423n4/2024-03-taiko-findings/issues/276#issuecomment-2049465072):**
 > A halted chain leads to frozen funds. The chain will progress for a minimum of 2 blocks since the calculation is correct when `lastSyncedBlock =0` and when `_l1BlockID-lastSyncedBlock=1`
> 
> After the second block the base fee will still be correct as long as `excess < issuance` for both the inflated and correct calculating since both result in `excess=1`
> https://github.com/code-423n4/2024-03-taiko/blob/f58384f44dbf4c6535264a472322322705133b11/packages/protocol/contracts/L2/TaikoL2.sol#L279-L282
> 
> ```solidity
>             if (numL1Blocks > 0) {
>                 uint256 issuance = numL1Blocks * _config.gasTargetPerL1Block;
>                 excess = excess > issuance ? excess - issuance : 1;
>             }
> ```
> 
> At the block where the base fee is incorrect the chain is halted and funds are locked since the anchor now reverts in perpetuity.
> 
> In practice Taiko can easily release all funds by upgrading the contracts but I believe such an intervention should not be considered when evaluating the severity of an issue. From [C4 Supreme Court session, Fall 2023](https://docs.code4rena.com/awarding/judging-criteria/supreme-court-decisions-fall-2023)
> 
> >Contract upgradability should never be used as a severity mitigation, i.e. we assume contracts are non-upgradable.
> 
> I therefore believe a High is fair here.


**[0xean (Judge) commented](https://github.com/code-423n4/2024-03-taiko-findings/issues/276#issuecomment-2049679633):**
 > I don't entirely agree since the chain would be halted so soon in its existence, that being said, some amount of funds, albeit small, would likely be lost.  @dantaik / @adaki2004 any last comments before leaving as H severity?

**[adaki2004 (Taiko) commented](https://github.com/code-423n4/2024-03-taiko-findings/issues/276#issuecomment-2049949706):**
> Agreed, can do!

**[0xean (Judge) commented](https://github.com/code-423n4/2024-03-taiko-findings/issues/276#issuecomment-2051543094):**
 > Awarding as H, final decision. 
***
