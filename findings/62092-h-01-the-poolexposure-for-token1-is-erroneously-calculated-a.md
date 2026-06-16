---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/lending
  - sector/oracle
  - sector/perpetuals
protocol: "[[Panoptic]]"
auditors:
  - "[[0xAura]]"
report: "https://code4rena.com/reports/2025-06-panoptic-hypovault"
genome:
  - "[[stale-price]]"
  - "[[defi/price-manipulation]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# [H-01] The `poolExposure` for token1 is erroneously calculated as `shortPremium - longPremium;`

- id: 62092
- impact: HIGH
- protocol: [[Panoptic]]
- reporter: 0xAura (Code4rena)
- source: https://code4rena.com/reports/2025-06-panoptic-hypovault

## Summary


The bug report discusses an issue with the `computeNAV()` function in the PanopticVaultAccountant.sol file. This function is responsible for calculating the net asset value (NAV) of a vault by adding up the assets and subtracting the liabilities. The bug causes the `poolExposure1` to be calculated incorrectly, which results in the NAV being incorrect. This means that users may receive more or less shares and assets when deposits or withdrawals are fulfilled. The recommended solution is to fix the calculation of `poolExposure1` to match the calculation of `poolExposure0`. To demonstrate the issue, a test is included in the report that fails when using slightly different values for the premiums. After the suggested fix is implemented, the test passes.

## Details



<https://github.com/code-423n4/2025-06-panoptic/blob/8ef6d867a5fb6ffd1a6cc479a2380a611d452b4a/src/accountants/PanopticVaultAccountant.sol# L134-L136>

### Finding description and impact

`getAccumulatedFeesAndPositionsData` returns the total amount of premium `owed to the short legs` and the total amount of premium `owned by the long legs`. This means that the `shortPremium` is an asset for the Vault and the `longPremium` is a liability. The assets must be added to the NAV while the liabilities must be subtracted from the NAV.

The `poolExposure0` calculates correctly the exposure in token0 by subtracting the `longPremium` from the `shortPremium`. For the `poolExposure1` these 2 premiums are reversed: the `shortPremium` is wrongly subtracted from the `longPremium`:
```

    function computeNAV(
        address vault,
        address underlyingToken,
        bytes calldata managerInput
    ) external view returns (uint256 nav) {
...
            int256 poolExposure0;
            int256 poolExposure1;
            {
                LeftRightUnsigned shortPremium;
                LeftRightUnsigned longPremium;

                (shortPremium, longPremium, positionBalanceArray) = pools[i]
                    .pool
                    .getAccumulatedFeesAndPositionsData(_vault, true, tokenIds[i]);

                poolExposure0 =
                    int256(uint256(shortPremium.rightSlot())) -
                    int256(uint256(longPremium.rightSlot()));
                poolExposure1 =
@>                    int256(uint256(longPremium.leftSlot())) -
@>                    int256(uint256(shortPremium.leftSlot()));
            }
```

These 2 exposures are converted to the `underlying` token and summed to calculate the vault’s NAV.
The `computeNAV()` function will return a wrong value.

The `sharesReceived`, when deposits are fulfilled and the `assetsReceived` on fulfill withdrawals from the HypoVault, will have incorrect values. Users can receive more (or less) shares as well as getting back less (or more) assets.

### Recommended mitigation steps

Calculate the `poolExposure1` the same way `poolExposure0` is calculated:
```

            {
                LeftRightUnsigned shortPremium;
                LeftRightUnsigned longPremium;

                (shortPremium, longPremium, positionBalanceArray) = pools[i]
                    .pool
                    .getAccumulatedFeesAndPositionsData(_vault, true, tokenIds[i]);

                poolExposure0 =
                    int256(uint256(shortPremium.rightSlot())) -
                    int256(uint256(longPremium.rightSlot()));
                poolExposure1 =
-                    int256(uint256(longPremium.leftSlot())) -
-                    int256(uint256(shortPremium.leftSlot()));
+                    int256(uint256(shortPremium.leftSlot())) -
+                    int256(uint256(longPremium.leftSlot()));
            }
```

### Proof of Concept

The test `test_computeNAV_exactCalculation_withExactPremiums` fails to detect this issue because the tolerance used in assert is too high - 50% of the NAV.

To better show the issue, the following test uses slightly different values for premium. Add the following code to `PoC.t.sol file` and execute it with `forge test --mt test_submissionValidity -vvv`.

The test fails with `[FAIL: NAV should include underlying plus converted premiums: 1048995033790712343115 !~= 1250000000000000000000 (max delta: 10000000000000000000, real delta: 201004966209287656885)]` error message:
```

    function test_submissionValidity() public {
        // Create pools where token0 is underlying - only token1 needs conversion
        PanopticVaultAccountant.PoolInfo[] memory pools = new PanopticVaultAccountant.PoolInfo[](1);
        pools[0] = PanopticVaultAccountant.PoolInfo({
            pool: PanopticPool(address(mockPool)),
            token0: underlyingToken, // Same as underlying
            token1: token1,
            poolOracle: poolOracle,
            oracle0: oracle0,
            isUnderlyingToken0InOracle0: true,
            oracle1: oracle1,
            isUnderlyingToken0InOracle1: false,
            maxPriceDeviation: MAX_PRICE_DEVIATION,
            twapWindow: TWAP_WINDOW
        });
        address vault = address(vault);
        accountant.updatePoolsHash(vault, keccak256(abi.encode(pools)));

        // Setup scenario with no token balances, only collateral and premiums
        underlyingToken.setBalance(vault, 1000e18);
        token1.setBalance(vault, 0); // No token1 balance
        mockPool.collateralToken0().setBalance(vault, 0); // No collateral
        mockPool.collateralToken0().setPreviewRedeemReturn(0);
        mockPool.collateralToken1().setBalance(vault, 0);
        mockPool.collateralToken1().setPreviewRedeemReturn(0);

        uint256 shortPremiumRight = 200e18;
        uint256 shortPremiumLeft = 150e18;
        uint256 longPremiumRight = 50e18;
        uint256 longPremiumLeft = 50e18;
        uint256 net = (shortPremiumRight - longPremiumRight) + (shortPremiumLeft - longPremiumLeft);
        assertEq(net, 250e18, "Net premium should be 250 ether");
        mockPool.setMockPremiums(
            LeftRightUnsigned.wrap((shortPremiumLeft << 128) | shortPremiumRight),
            LeftRightUnsigned.wrap((longPremiumLeft << 128) | longPremiumRight)
        );

        // No positions
        mockPool.setNumberOfLegs(vault, 0);
        mockPool.setMockPositionBalanceArray(new uint256[2][](0));

        bytes memory managerInput = createManagerInput(pools, new TokenId[][](1));
        uint256 nav = accountant.computeNAV(vault, address(underlyingToken), managerInput);

        uint256 expectedNavBase = 1000e18 + net; // Conservative estimate
        uint256 tolerance = 10e18; // relatively small tolerance for premium conversion calculations
        assertApproxEqAbs(
            nav,
            expectedNavBase,
            tolerance,
            "NAV should include underlying plus converted premiums"
        );
    }

    // ===== helper functions =====

// copy-paste from PanopticVaultAccountant.t.sol
    function createManagerInput(
        PanopticVaultAccountant.PoolInfo[] memory pools,
        TokenId[][] memory tokenIds
    ) internal pure returns (bytes memory) {
        PanopticVaultAccountant.ManagerPrices[]
            memory managerPrices = new PanopticVaultAccountant.ManagerPrices[](pools.length);

        for (uint i = 0; i < pools.length; i++) {
            managerPrices[i] = PanopticVaultAccountant.ManagerPrices({
                poolPrice: TWAP_TICK,
                token0Price: TWAP_TICK,
                token1Price: TWAP_TICK
            });
        }

        return abi.encode(managerPrices, pools, tokenIds);
    }
```

After the suggested fix is implemented, the test passes.

---
