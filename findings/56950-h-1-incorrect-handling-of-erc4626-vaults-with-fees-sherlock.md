---
tags:
  - lang/solidity
  - sector/token
  - sector/vault
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
protocol: "[[Burve]]"
auditors:
  - newspacexyz
report: "https://github.com/sherlock-audit/2025-04-burve-judging"
genome:
  - "[[fee-accounting]]"
  - "[[direct-drain]]"
  - "[[use-reentrancy-guard]]"
---
# H-1: Incorrect handling of ERC4626 vaults with fees

- id: 56950
- impact: HIGH
- protocol: Burve
- reporter: newspacexyz (Sherlock)
- source: N/A

## Summary


The bug report discusses an issue with the handling of ERC4626 vaults with fees in a multi-token pool. This bug allows users to avoid these fees and can be considered as stealing of tokens. The root cause is due to not transferring enough tokens to cover the fees, and the affected logic is in the ValueFacet and SwapFacet contracts. The bug can be exploited by depositing 100 value worth of tokens, but only 99 assets worth of shares are minted due to a 1% deposit fee. When the tokens are withdrawn, the 1 asset is not accounted for and is considered a loss. The impact of this bug is that users can avoid fees and the last users to withdraw their assets will suffer. The bug has been fixed by the protocol team in a recent PR. To mitigate this issue, the protocol should transfer more tokens from users to cover the fees when an ERC4626 vault with fees is used. 

## Details

Source: https://github.com/sherlock-audit/2025-04-burve-judging/issues/70 

## Found by 
0L5S6W, 0xNov1ce, CasinoCompiler, Drynooo, aman, bretzel, future, h2134, mstpr-brainbot, newspacexyz, shushu

### Summary

When users add liquidity to multi-token pool, the tokens users transfer are deposited to the underlying ERC4626 vaults.
These ERC4626 vaults might have deposit and/or withdrawal fees charged.

However, handling of these fees is incorrect in the current implementation and users can avoid these fees.
Let's take a look into `addValue` for example:

```solidity
    function addValue(
        address recipient,
        uint16 _closureId,
        uint128 value,
        uint128 bgtValue
    )
        external
        nonReentrant
        returns (uint256[MAX_TOKENS] memory requiredBalances)
    {
        if (value == 0) revert DeMinimisDeposit();
        require(bgtValue <= value, InsufficientValueForBgt(value, bgtValue));
        ClosureId cid = ClosureId.wrap(_closureId);
        Closure storage c = Store.closure(cid);
        uint256[MAX_TOKENS] memory requiredNominal = c.addValue(
            value,
            bgtValue
        );
        // Fetch balances
        TokenRegistry storage tokenReg = Store.tokenRegistry();
        for (uint8 i = 0; i < MAX_TOKENS; ++i) {
            if (!cid.contains(i)) continue; // Irrelevant token.
            address token = tokenReg.tokens[i];
            uint256 realNeeded = AdjustorLib.toReal(
                token,
                requiredNominal[i],
                true
            );
            requiredBalances[i] = realNeeded;
            TransferHelper.safeTransferFrom(
                token,
                msg.sender,
                address(this),
                realNeeded
            );
            Store.vertex(VertexLib.newId(i)).deposit(cid, realNeeded);
        }
        Store.assets().add(recipient, cid, value, bgtValue);
    }
```

Here, the `realNeeded` amount is the token amount that represents the given `value`, but when these tokens are deposited through `Store.vertex(VertexLib.newId(i)).deposit(cid, realNeeded);`, the fees will get charged that results in less shares being minted.
But these fees are not accounted and users' values are added to the pool without these fees.

### Root Cause

The root cause of the issue is because the protocol does not transfer enough tokens from users to cover the fees.
The affected logic is in [`ValueFacet`](https://github.com/sherlock-audit/2025-04-burve/blob/44cba36e2a0c3cd7b6999459bf7746db92f8cc0a/Burve/src/multi/facets/ValueFacet.sol#L26) contract where users add value to the pool by depositing tokens.
Also, it is affected in [`SwapFacet`](https://github.com/sherlock-audit/2025-04-burve/blob/44cba36e2a0c3cd7b6999459bf7746db92f8cc0a/Burve/src/multi/facets/SwapFacet.sol#L16) contract where users transfer tokens to swap into other tokens.

### Internal Pre-conditions

An ERC4626 vault with deposit and/or withdrawal fees is used as the underlying vault for the multi-token pool.

### External Pre-conditions

None

### Attack Path

- Assume there is 1000 assets that represents 1000 value in the multi-token pool.
- Alice deposits 100 value worth of tokens into the pool where she deposits 100 assets.
- As the ERC4626 vault has a 1% deposit fee, 100 assets will be deposited but 99 assets worth of shares will be minted.
- Alice withdraws 100 value worth of tokens from the pool, which returns 100 assets to her.
- The 1 asset is not accounted and is considered as a loss.

### Impact

- Users can avoid the fees charged by the ERC4626 vaults, which also can be considered as stealing of the tokens.
- As actual assets is less than the accounted assets, last users will suffer when they withdraw their assets.

### PoC

Put the PoC in the `test/facets/Audit.t.sol` file.

```solidity
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.27;

import {MultiSetupTest} from "./MultiSetup.u.sol";
import {console2 as console} from "forge-std/console2.sol";
import {ValueFacet} from "../../src/multi/facets/ValueFacet.sol";
import {ValueLib} from "../../src/multi/Value.sol";
import {AssetBookImpl} from "../../src/multi/Asset.sol";
import {MAX_TOKENS} from "../../src/multi/Token.sol";
import {MockERC20} from "../mocks/MockERC20.sol";
import {ERC20} from "openzeppelin-contracts/token/ERC20/ERC20.sol";

contract MultiTokenAuditTest is MultiSetupTest {

    function setUp() public {
        vm.startPrank(owner);

        _newDiamond();
        _newTokens(3);
        _fundAccount(alice);
        _fundAccount(bob);

        vm.startPrank(owner);
        _initializeClosure(0x03, 1e6 * 1e18); // 0, 1
        _initializeClosure(0x05, 1e6 * 1e18); // 0, 2
        simplexFacet.setClosureFees(0x03, 3 << 123, 0); // 0.3% fee
        simplexFacet.setClosureFees(0x05, 3 << 123, 0); // 0.3% fee

        vm.stopPrank();
    }

    function testAuditERC4626Fee() public {
        uint256 token0BalanceBefore = token0.balanceOf(alice);

        vm.startPrank(alice);
        valueFacet.addValue(alice, 0x03, 100e18, 0);
        valueFacet.removeValue(alice, 0x03, 100e18, 0);
        vm.stopPrank();

        uint256 token0BalanceAfter = token0.balanceOf(alice);

        assertApproxEqAbs(token0BalanceBefore, token0BalanceAfter, 1e3);
    }
}

```

Update `MockERC4626` to charge fees on deposit, as follows:

```solidity
contract MockERC4626 is ERC4626 {
    constructor(
        ERC20 asset,
        string memory name,
        string memory symbol
    ) ERC20(name, symbol) ERC4626(asset) {}

    function previewDeposit(uint256 assets) public override view returns (uint256) {
        uint256 fee = assets * 1 / 100;
        assets -= fee;
        return _convertToShares(assets, Math.Rounding.Floor);
    }

    function deposit(uint256 assets, address receiver) public override returns (uint256) {
        uint256 maxAssets = maxDeposit(receiver);
        if (assets > maxAssets) {
            revert ERC4626ExceededMaxDeposit(receiver, assets, maxAssets);
        }

        uint256 shares = previewDeposit(assets);
        _deposit(_msgSender(), receiver, assets, shares);

        uint256 fee = assets * 1 / 100;
        ERC20(asset()).transfer(address(0xdead), fee);

        return shares;
    }
}
```

### Mitigation

When the ERC4626 vault has deposit and/or withdrawal fees, the protocol should transfer more tokens from users to cover the fees.


## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/itos-finance/Burve/pull/71
