---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - severity/high
  - sector/infra
  - sector/lending
  - sector/oracle
  - sector/perpetuals
  - sector/stable
  - sector/staking
protocol: "[[Blueberry]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Blueberry-security-review_2025-03-12.md"
genome:
  - "[[frozen-funds]]"
  - "[[direct-drain]]"
  - "[[vote-delegation-loop]]"
---
# [H-02] Withdraw check can be bypassed

- id: 61455
- impact: HIGH
- protocol: Blueberry_2025-03-12
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[Blueberry]]-security-review_2025-03-12.md

## Summary


This bug report describes an issue in the VaultEscrow system where a security check can be bypassed, allowing users to withdraw more assets than they have deposited in the vault. This is because the system relies on a precompile contract to determine the vault's equity, but this data can become outdated if there are multiple transactions in the same block. This can lead to incorrect withdrawals and cause transactions to fail on the L1 chain. The report recommends adding internal accounting to keep track of the latest vault equity and using this instead of relying solely on the precompile contract. 

## Details


## Severity

**Impact:** High

**Likelihood:** Medium

## Description

In VaultEscrow, we will withdraw assets from the Vault in the core chain via function withdraw(). In withdraw() function, we have one security sanity check. This will make sure that we will not withdraw more asset than what we deposit in the vault.

But this security check can be bypassed. We get the vault's equity based on the `VAULT_EQUITY_PRECOMPILE_ADDRESS`.

Based on the [HyperLiquid doc](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/interacting-with-hypercore), the testnet EVM provides precompiles that allows querying HyperCore information. The precompile addresses start at  0x0000000000000000000000000000000000000800 and have methods for querying perps positions, spot balances, vault equity, staking delegations, oracle prices, and the L1 block number.

The values are guaranteed to match the latest HyperCore state at the time the EVM block is constructed.`

So when we start to create one new EVM block, we will sync the Core Chain's latest states to EVM chain's precompile contracts, including `VAULT_EQUITY_PRECOMPILE_ADDRESS`. In the same EVM block, Core Chain will not sync data per transaction. So it's quite possible that the data read from the `VAULT_EQUITY_PRECOMPILE_ADDRESS` is staled.

For example:
1. Alice deposit 1000 USDC via vault escrow 1.
2. Bob deposits 1000 USDC via vault escrow 2.
3. When the system constructs EVM block 100, we will sync the vault's equity to `VAULT_EQUITY_PRECOMPILE_ADDRESS`, escrow 1(1000), escrow 2(1000).
4. Bob requests withdraw from vault escrow 2 in block 1000.
5. Alice requests withdraw from vault escrow 2 in block 1000, this security check will be passed because the vault equity for escrow 2 will keep 1000. Alice's EVM transaction can pass. But this operation will fail in L1 chain.
6. Alice withdraws to get 1000 USDC.
7. Bob tries to withdraw, but Bob's transaction will be reverted because there are not enough assets in escrow 2.


```solidity
    address public constant VAULT_EQUITY_PRECOMPILE_ADDRESS = 0x0000000000000000000000000000000000000802;

    function withdraw(uint64 assets_) external override onlyVaultWrapper {
@>        require(assets_ <= _vaultEquity(), Errors.INSUFFICIENT_VAULT_EQUITY());
        uint256 amountPerp = (_perpDecimals > _evmSpotDecimals)
            ? assets_ * (10 ** (_perpDecimals - _evmSpotDecimals))
            : assets_ / (10 ** (_evmSpotDecimals - _perpDecimals));

        L1_WRITE_PRECOMPILE.sendVaultTransfer(_vault, false, uint64(amountPerp));
        L1_WRITE_PRECOMPILE.sendUsdClassTransfer(uint64(amountPerp), false);
        L1_WRITE_PRECOMPILE.sendSpot(HYPERLIQUID_SPOT_BRIDGE, _assetIndex, assets_);
    }
```
```solidity
    function _vaultEquity() internal view returns (uint256) {
        (bool success, bytes memory result) =
            VAULT_EQUITY_PRECOMPILE_ADDRESS.staticcall(abi.encode(address(this), _vault));
        require(success, "VaultEquity precompile call failed");

        UserVaultEquity memory userVaultEquity = abi.decode(result, (UserVaultEquity));

        uint256 equityInSpot = (_perpDecimals > _evmSpotDecimals)
            ? userVaultEquity.equity / (10 ** (_perpDecimals - _evmSpotDecimals))
            : userVaultEquity.equity * (10 ** (_evmSpotDecimals - _perpDecimals));

        return equityInSpot;
    }
```

## Recommendations

We need to add one internal accounting to record the latest vault equity. If this is the first transaction in this block, read from the precompile contract and store the vault equity. If this is the next transaction on this block, read the vault equity from the internal accounting.
