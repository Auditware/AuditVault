---
tags:
  - lang/solidity
  - sector/dex
  - sector/nft
  - sector/nft-marketplace
  - platform/cyfrin
  - has/github
  - has/poc
  - severity/high
  - vuln/dos/frozen-funds
  - impact/loss-of-funds/locked-funds
  - novelty/variant
protocol: "[[Sudoswap]]"
auditors:
  - "[[Hans]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2023-06-01-Sudoswap.md"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
  - "[[fot-slippage]]"
  - "[[integer-bounds]]"
  - "[[royalty-edge-cases]]"
  - "[[timestamp-dependence]]"
---
# Specified `minOutput` will remain locked in `LSSVMRouter::swapNFTsForSpecificNFTsThroughETH`

- id: 18411
- impact: HIGH
- protocol: [[Sudoswap]]
- reporter: Hans (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2023-06-01-Sudoswap.md

## Summary


The Cyfrin team has identified a bug in the `LSSVMRouter` contract that is currently live on mainnet. This bug affects the functions `LSSVMRouter::swapNFTsForSpecificNFTsThroughETH` and `LSSVMRouter::swapNFTsForAnyNFTsThroughETH`, which are used to swap non-fungible tokens (NFTs) for ETH. If a user specifies a non-zero `minOutput` value, this amount will be deducted from the `inputAmount` sent on the second half of the swap, from ETH to NFTs. This means that the excess value represented by `minOutput` is not included in the refund calculation, and so will not be included in the subsequent ETH transfer. As a result, any excess ETH as specified by `minOutput` will remain locked in the router forever.

Fortunately, these functions have never actually been called on the mainnet deployment as they have not been connected to the Sudoswap front end. While Sudoswap doesn't use these functions on the client, contract-level integrators may find themselves with potentially lost funds, so the Sudorandom Labs team has attempted to reach out to those potentially affected.

This vulnerability has high impact and likelihood, but is not considered critical as the current integrations significantly reduce the likelihood. The recommended mitigation is to pass `minOutput` through to the internal functions to be used in refund calculations and correctly reflect the true contract balance. This way, the `outputAmount` return value will correctly reflect the excess ETH transferred to the caller.

## Details

**Description:**
The Cyfrin team understands that `LSSVMRouter` is slightly out of scope for this audit, given that it is intended to be deprecated and replaced by `VeryFastRouter`; however, a slightly modified version of this contract is currently deployed and [live on mainnet](https://etherscan.io/address/0x2b2e8cda09bba9660dca5cb6233787738ad68329#code). We have found a bug in [`LSSVMRouter::swapNFTsForSpecificNFTsThroughETH`](https://github.com/sudoswap/lssvm2/blob/78d38753b2042d7813132f26e5573c6699b605ef/src/LSSVMRouter.sol#L88) and `LSSVMRouter::swapNFTsForAnyNFTsThroughETH` which has been validated against a mainnet fork to lock user funds sent with the function call as specified by the [`minOutput`](https://github.com/sudoswap/lssvm2/blob/78d38753b2042d7813132f26e5573c6699b605ef/src/LSSVMRouter.sol#L90) parameter. In other words, users attempting to protect themselves from slippage will find that this causes their funds to become locked - the higher the minimum expected output specified, the higher value of funds locked.

Users specifying a non-zero `minOutput` value will have this amount [deducted](https://github.com/sudoswap/lssvm2/blob/78d38753b2042d7813132f26e5573c6699b605ef/src/LSSVMRouter.sol#L105) from the `inputAmount` sent on the second half of the swap, from ETH to NFTs, handled by the internal functions [`LSSVMRouter::_swapETHForSpecificNFTs`](https://github.com/sudoswap/lssvm2/blob/78d38753b2042d7813132f26e5573c6699b605ef/src/LSSVMRouter.sol#L560) and `LSSVMRouter::_swapETHForAnyNFTs`. Given that it is the responsibility of these internal functions to issue a refund of any unspent ETH based on this [`inputAmount`](https://github.com/sudoswap/lssvm2/blob/78d38753b2042d7813132f26e5573c6699b605ef/src/LSSVMRouter.sol#L562) parameter, the excess value represented by `minOutput` is not included in the [`remainingValue`](https://github.com/sudoswap/lssvm2/blob/78d38753b2042d7813132f26e5573c6699b605ef/src/LSSVMRouter.sol#L566) [calculation](https://github.com/sudoswap/lssvm2/blob/78d38753b2042d7813132f26e5573c6699b605ef/src/LSSVMRouter.sol#L582) and so will not be included in the subsequent [ETH transfer](https://github.com/sudoswap/lssvm2/blob/78d38753b2042d7813132f26e5573c6699b605ef/src/LSSVMRouter.sol#L591-L595). If there are no intermediate underflows (due to a sufficiently large value of `minOutput`) then any excess ETH as specified by `minOutput` will therefore remain locked in the router forever.

Fortunately, it appears these functions have never actually been called on the mainnet deployment as they have not been connected to the Sudoswap front end. While Sudoswap doesn't use these functions on the client, contract-level integrators may find themselves with potentially lost funds, so the Sudorandom Labs team has attempted to reach out to those potentially affected.

**Proof of Concept:**
Apply the following git diff:

```diff
diff --git a/src/test/interfaces/ILSSVMPairFactoryMainnet.sol b/src/test/interfaces/ILSSVMPairFactoryMainnet.sol
new file mode 100644
index 0000000..3cdea5b
--- /dev/null
+++ b/src/test/interfaces/ILSSVMPairFactoryMainnet.sol
@@ -0,0 +1,20 @@
+// SPDX-License-Identifier: MIT
+pragma solidity ^0.8.0;
+
+import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
+import {ICurve} from "../../bonding-curves/ICurve.sol";
+import {LSSVMPair} from "../../LSSVMPair.sol";
+import {LSSVMPairETH} from "../../LSSVMPairETH.sol";
+
+interface ILSSVMPairFactoryMainnet {
+    function createPairETH(
+        IERC721 _nft,
+        ICurve _bondingCurve,
+        address payable _assetRecipient,
+        LSSVMPair.PoolType _poolType,
+        uint128 _delta,
+        uint96 _fee,
+        uint128 _spotPrice,
+        uint256[] calldata _initialNFTIDs
+    ) external payable returns (LSSVMPairETH pair);
+}
diff --git a/src/test/mixins/UsingETH.sol b/src/test/mixins/UsingETH.sol
index 0e5cb40..8fecb1e 100644
--- a/src/test/mixins/UsingETH.sol
+++ b/src/test/mixins/UsingETH.sol
@@ -14,6 +14,8 @@ import {LSSVMPairFactory} from "../../LSSVMPairFactory.sol";
 import {LSSVMPairERC721} from "../../erc721/LSSVMPairERC721.sol";
 import {LSSVMPairERC1155} from "../../erc1155/LSSVMPairERC1155.sol";

+import {ILSSVMPairFactoryMainnet} from "../interfaces/ILSSVMPairFactoryMainnet.sol";
+
 abstract contract UsingETH is Configurable, RouterCaller {
     function modifyInputAmount(uint256 inputAmount) public pure override returns (uint256) {
         return inputAmount;
@@ -46,6 +48,25 @@ abstract contract UsingETH is Configurable, RouterCaller {
         return pair;
     }

+    function setupPairERC721Mainnet(
+        ILSSVMPairFactoryMainnet factory,
+        IERC721 nft,
+        ICurve bondingCurve,
+        address payable assetRecipient,
+        LSSVMPair.PoolType poolType,
+        uint128 delta,
+        uint96 fee,
+        uint128 spotPrice,
+        uint256[] memory _idList,
+        uint256,
+        address
+    ) public payable returns (LSSVMPair) {
+        LSSVMPairETH pair = factory.createPairETH{value: msg.value}(
+            nft, bondingCurve, assetRecipient, poolType, delta, fee, spotPrice, _idList
+        );
+        return pair;
+    }
+
     function setupPairERC1155(CreateERC1155PairParams memory params) public payable override returns (LSSVMPair) {
         LSSVMPairETH pair = params.factory.createPairERC1155ETH{value: msg.value}(
             params.nft,
diff --git a/src/test/single-test-cases/CyfrinLSSVMRouterPoC.t.sol b/src/test/single-test-cases/CyfrinLSSVMRouterPoC.t.sol
new file mode 100644
index 0000000..596da45
--- /dev/null
+++ b/src/test/single-test-cases/CyfrinLSSVMRouterPoC.t.sol
@@ -0,0 +1,114 @@
+// SPDX-License-Identifier: AGPL-3.0
+pragma solidity ^0.8.0;
+
+import "forge-std/Test.sol";
+
+import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
+import {Test721} from "../../mocks/Test721.sol";
+
+import {ICurve} from "../../bonding-curves/ICurve.sol";
+import {ILSSVMPairFactoryMainnet} from "../interfaces/ILSSVMPairFactoryMainnet.sol";
+
+import {UsingETH} from "../mixins/UsingETH.sol";
+import {ConfigurableWithRoyalties} from "../mixins/ConfigurableWithRoyalties.sol";
+import {LinearCurve, UsingLinearCurve} from "../../test/mixins/UsingLinearCurve.sol";
+
+import {LSSVMPair} from "../../LSSVMPair.sol";
+import {LSSVMPairETH} from "../../LSSVMPairETH.sol";
+import {LSSVMRouter} from "../../LSSVMRouter.sol";
+import {RoyaltyEngine} from "../../RoyaltyEngine.sol";
+import {LSSVMPairFactory} from "../../LSSVMPairFactory.sol";
+
+
+contract CyfrinLSSVMRouterPoC is Test, ConfigurableWithRoyalties, UsingLinearCurve, UsingETH {
+    IERC721 test721;
+    address payable alice;
+
+    LSSVMRouter constant LSSVM_ROUTER = LSSVMRouter(payable(address(0x2B2e8cDA09bBA9660dCA5cB6233787738Ad68329)));
+    LSSVMPairFactory constant LSSVM_PAIR_FACTORY = LSSVMPairFactory(payable(address(0xb16c1342E617A5B6E4b631EB114483FDB289c0A4)));
+    LinearCurve constant LINEAR_CURVE = LinearCurve(payable(address(0x5B6aC51d9B1CeDE0068a1B26533CAce807f883Ee)));
+
+    function setUp() public {
+        vm.createSelectFork(vm.envOr("MAINNET_RPC_URL", string.concat("https://rpc.ankr.com/eth")));
+
+        test721 = setup721();
+        alice = payable(makeAddr("alice"));
+        deal(alice, 1 ether);
+    }
+
+    function test_minOutputIsLockedInRouterWhenCallingswapNFTsForSpecificNFTsThroughETH() public {
+        Test721(address(test721)).mint(alice, 1);
+        uint256[] memory nftToTokenTradesIds = new uint256[](1);
+        nftToTokenTradesIds[0] = 1;
+        Test721(address(test721)).mint(address(this), 2);
+        Test721(address(test721)).mint(address(this), 3);
+        Test721(address(test721)).mint(address(this), 4);
+        uint256[] memory ids = new uint256[](3);
+        ids[0] = 2;
+        ids[1] = 3;
+        ids[2] = 4;
+        uint256[] memory tokenToNFTTradesIds = new uint256[](1);
+        tokenToNFTTradesIds[0] = ids[ids.length - 1];
+
+        test721.setApprovalForAll(address(LSSVM_PAIR_FACTORY), true);
+        LSSVMPair pair721 = this.setupPairERC721Mainnet{value: 10 ether}(
+            ILSSVMPairFactoryMainnet(address(LSSVM_PAIR_FACTORY)),
+            test721,
+            LINEAR_CURVE,
+            payable(address(0)),
+            LSSVMPair.PoolType.TRADE,
+            0.1 ether, // delta
+            0.1 ether, // 10% for trade fee
+            1 ether, // spot price
+            ids,
+            10 ether,
+            address(0)
+        );
+
+        uint256 pairETHBalanceBefore = address(pair721).balance;
+        uint256 aliceETHBalanceBefore = address(alice).balance;
+        uint256 routerETHBalanceBefore = address(LSSVM_ROUTER).balance;
+
+        emit log_named_uint("pairETHBalanceBefore", pairETHBalanceBefore);
+        emit log_named_uint("aliceETHBalanceBefore", aliceETHBalanceBefore);
+        emit log_named_uint("routerETHBalanceBefore", routerETHBalanceBefore);
+
+        uint256 minOutput;
+        {
+            LSSVMRouter.PairSwapSpecific[] memory nftToTokenTrades = new LSSVMRouter.PairSwapSpecific[](1);
+            nftToTokenTrades[0] = LSSVMRouter.PairSwapSpecific({
+                pair: pair721,
+                nftIds: nftToTokenTradesIds
+            });
+
+            LSSVMRouter.PairSwapSpecific[] memory tokenToNFTTrades = new LSSVMRouter.PairSwapSpecific[](1);
+            tokenToNFTTrades[0] = LSSVMRouter.PairSwapSpecific({
+                pair: pair721,
+                nftIds: tokenToNFTTradesIds
+            });
+
+            LSSVMRouter.NFTsForSpecificNFTsTrade memory trade = LSSVMRouter.NFTsForSpecificNFTsTrade({
+                nftToTokenTrades: nftToTokenTrades,
+                tokenToNFTTrades: tokenToNFTTrades
+            });
+
+
+            vm.startPrank(alice);
+            test721.setApprovalForAll(address(LSSVM_ROUTER), true);
+            minOutput = 0.79 ether;
+            LSSVM_ROUTER.swapNFTsForSpecificNFTsThroughETH{value: 1 ether}(trade, minOutput, alice, alice, block.timestamp + 10);
+        }
+
+        uint256 pairETHBalanceAfter = address(pair721).balance;
+        uint256 aliceETHBalanceAfter = address(alice).balance;
+        uint256 routerETHBalanceAfter = address(LSSVM_ROUTER).balance;
+
+        assertTrue(test721.ownerOf(tokenToNFTTradesIds[0]) == alice);
+        assertGt(pairETHBalanceAfter, pairETHBalanceBefore);
+        assertEq(routerETHBalanceAfter, minOutput);
+
+        emit log_named_uint("pairETHBalanceAfter", pairETHBalanceAfter);
+        emit log_named_uint("aliceETHBalanceAfter", aliceETHBalanceAfter);
+        emit log_named_uint("routerETHBalanceAfter", routerETHBalanceAfter);
+    }
+}
```

**Impact:**
This vulnerability results in the locking of user funds with high impact and likelihood. If the problematic functions were integrated into a UI, then this would be evaluated as CRITICAL, but given that the current integrations significantly reduce the likelihood, we evaluate the severity as HIGH.

**Recommended Mitigation:**
Pass `minOutput` through to the internal functions to be used in refund calculations and correctly reflect the true contract balance, validating that this amount is not exceeded. This way, the [`outputAmount`](https://github.com/sudoswap/lssvm2/blob/78d38753b2042d7813132f26e5573c6699b605ef/src/LSSVMRouter.sol#L94) [return value](https://github.com/sudoswap/lssvm2/blob/78d38753b2042d7813132f26e5573c6699b605ef/src/LSSVMRouter.sol#L104-L106) will correctly reflect the excess ETH transferred to the caller.

**Sudoswap:**
Acknowledged. This issue is present in current implementation of the Router, but no UIs are currently integrated to interact with this specific function. The contract is expected to be deprecated soon in favour of the VeryFastRouter.

**Cyfrin:**
Acknowledged.
