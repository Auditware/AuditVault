---
tags:
  - lang/solidity
  - sector/lending
  - sector/staking
  - platform/cyfrin
  - has/github
  - severity/high
protocol: "[[Suzaku Core]]"
auditors:
  - 0kage
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-07-07-cyfrin-suzaku-core-v2.0.md"
genome:
  - "[[upgrade-safety]]"
  - "[[missing-seeds-check]]"
  - "[[variant]]"
  - "[[add-check]]"
---
# Blacklisted implementation versions are accessible through migrations

- id: 61231
- impact: HIGH
- protocol: Suzaku Core
- reporter: 0kage (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-07-07-cyfrin-suzaku-core-v2.0.md

## Summary


The `VaultFactory` contract has a bug where the blacklisting check is not applied when migrating existing vaults to new versions. This means that even if a version is blacklisted due to security vulnerabilities, vault owners can still migrate to it and expose themselves to those vulnerabilities. A proof of concept has been provided to show how this bug can be exploited. The recommended mitigation is to add a blacklist check to the migrate function to ensure consistency with the create function. The bug has been fixed in a recent update and verified by Cyfrin.

## Details

**Description:** The `VaultFactory` contract implements a blacklisting mechanism to prevent the use of vulnerable or deprecated contract versions. However, the blacklisting check is only applied when creating new vaults through the create function, but is entirely absent from the migrate function.

This allows vault owners to bypass the blacklist restriction by migrating their existing vaults to versions that have been explicitly blacklisted, potentially due to security vulnerabilities or other critical issues.

Consider following scenario:
- A vault is created with version 1
- Version 2 is blacklisted in the factory
- Despite being blacklisted, the vault can successfully migrate to version 2
- The migrated vault fully inherits the functionality of the blacklisted implementation

The intended security barrier provided by blacklisting can be completely bypassed, opening potential attack vectors even after vulnerabilities have been identified.

**Impact:** If an implementation is blacklisted due to a security vulnerability, vault owners can still expose themselves to those vulnerabilities by migrating to the blacklisted version.

**Proof of Concept:** Note: For running this test, we created a `MockVaultTokenizedV3.sol` with a `_migrate` function with lesser constraints (as shown below)

```solidity
  // MockTokenizedVaultV3.sol
  function _migrate(uint64 oldVersion, uint64 newVersion, bytes calldata data) internal virtual onlyInitializing {
        // if (newVersion - oldVersion > 1) {
        //    revert();
        // }
        uint256 b_ = abi.decode(data, (uint256));
        b = b_;
    }

```

```solidity
    function testBlacklistDoesNotBlockMigration() public {
        // First, create a vault with version 1
        vault1 = vaultFactory.create(
            1, // version
            alice,
            abi.encode(
                IVaultTokenized.InitParams({
                    collateral: address(collateral),
                    burner: address(0xdEaD),
                    epochDuration: 7 days,
                    depositWhitelist: false,
                    isDepositLimit: false,
                    depositLimit: 0,
                    defaultAdminRoleHolder: alice,
                    depositWhitelistSetRoleHolder: alice,
                    depositorWhitelistRoleHolder: alice,
                    isDepositLimitSetRoleHolder: alice,
                    depositLimitSetRoleHolder: alice,
                    name: "Test",
                    symbol: "TEST"
                })
            ),
            address(delegatorFactory),
            address(slasherFactory)

        );

        // Verify initial version
        assertEq(IVaultTokenized(vault1).version(), 1);

        // Blacklist version 2
        vaultFactory.blacklist(2);

        // Despite version 2 being blacklisted, we can still migrate to it!
        vm.prank(alice);
        // This should revert if blacklist was properly enforced, but it won't
        vaultFactory.migrate(vault1, 2, abi.encode(20));

        // Verify the vault is now at version 2, despite it being blacklisted
        assertEq(IVaultTokenized(vault1).version(), 2);

        // set the value of b inside MockVaultTokenizedV3 as 20
        assertEq(
            MockVaultTokenizedV3(vault1).version2State(),
            20);
    }
```

**Recommended Mitigation:** Consider adding a blacklist check to the migrate function to ensure consistency with the `create` function.

```diff solidity
function migrate(address entity_, uint64 newVersion, bytes calldata data) external checkEntity(entity_) {
    if (msg.sender != Ownable(entity_).owner()) {
        revert MigratableFactory__NotOwner();
    }

    if (newVersion <= IVaultTokenized(entity_).version()) {
        revert MigratableFactory__OldVersion();
    }

++    // Add this missing check
++    if (blacklisted[newVersion]) {
++       revert MigratableFactory__VersionBlacklisted();
++    }

    IMigratableEntityProxy(entity_).upgradeToAndCall(
        implementation(newVersion),
        abi.encodeCall(IVaultTokenized.migrate, (newVersion, data))
    );

    emit Migrate(entity_, newVersion);
}
```

**Suzaku:**
Fixed in [d3f98b8](https://github.com/suzaku-network/suzaku-core/pull/155/commits/d3f98b82653ec3fa1f6f4b26049e9508cd9cda07).

**Cyfrin:** Verified.
