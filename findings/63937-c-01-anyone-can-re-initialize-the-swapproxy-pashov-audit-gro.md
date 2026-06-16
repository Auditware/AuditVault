---
tags:
  - lang/solidity
  - sector/dex
  - sector/nft
  - sector/nft-marketplace
  - sector/stable
  - platform/pashov
  - has/github
  - severity/high
  - vuln/pda/reinitialization
  - impact/loss-of-funds/direct-drain
  - fix/use-reentrancy-guard
  - novelty/variant
  - misassumption/proxy-is-initialized
  - fix/initialize-proxy
protocol: "[[WishWish]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/WishWish-security-review_2025-11-04.md"
genome:
  - "[[reinitialization]]"
  - "[[direct-drain]]"
  - "[[use-reentrancy-guard]]"
  - "[[variant]]"
  - "[[access-roles]]"
  - "[[fot-slippage]]"
  - "[[initializer-auth]]"
  - "[[pda-derivation]]"
  - "[[reentrancy-guard]]"
  - "[[royalty-edge-cases]]"
  - "[[timestamp-dependence]]"
---
# [C-01] Anyone can re-initialize the `swapProxy`

- id: 63937
- impact: HIGH
- protocol: WishWish_2025-11-04
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[WishWish]]-security-review_2025-11-04.md

## Summary


This bug report addresses a high severity issue in the `SwapImpl::initialize` function, which lacks access control and can be called multiple times. This allows an attacker to update critical state variables and potentially steal all `ETH` and `WETH` sent to the `RoyaltyManager`. The attacker can exploit this by reinitializing the `SwapProxy` contract and specifying a custom contract as the `router` and `permit2` addresses. This allows the malicious contract to handle all of the `WETH` tokens from the `SwapProxy`, resulting in a potential loss of funds. The report recommends preventing the `initialize` function from being called more than once by following a similar pattern seen in other protocol contracts.

## Details


_Resolved_

## Severity

**Impact:** High

**Likelihood:** High

## Description
The `SwapImpl::initialize` function lacks access control and can be successfully invoked more than once, allowing arbitrary reinitialization of the proxy. This enables an attacker to update critical state variables, such as the `router` and `permit2` addresses, with custom malicious contracts. Doing so can allow an attacker to steal all `ETH` and `WETH` that gets sent to the `RoyaltyManager`. 

After the `SwapImpl` and `SwapProxy` are deployed, an attacker can call `SwapProxy::initialize` again and specify a custom contract as the `router` and `permit2`:

```solidity
    function initialize(
        address _universalRouter,
        address _permit2,
        address _weth,
        address _usdc,
        address _feedETH,
        address _feedUSDC,
        uint24 _feeTier,
        uint16 _slippageBps,
        uint32 _maxAgeSec
    ) external {
    ...
        $.router = IUniversalRouter(_universalRouter);
        $.permit2 = _permit2;
        $.WETH = IWETH9(_weth);
        $.USDC = IERC20(_usdc);
        $.FEED_ETH = AggregatorV3Interface(_feedETH);
        $.FEED_USDC = AggregatorV3Interface(_feedUSDC);
        $.FEE_TIER = _feeTier;
        $.SLIPPAGE_BPS = _slippageBps;
        $.MAX_AGE_SEC = _maxAgeSec;
...
        $.WETH.safeApprove(_permit2, type(uint256).max);
        IPermit2(_permit2).approve(address($.WETH), _universalRouter, type(uint160).max, type(uint48).max);
    }
```

As we can see above, after this reinitialization, the `SwapProxy` contract will approve the attacker's malicious contract to handle any of its `WETH` tokens. 

After royalties (which can be denominated in `ETH`, `WETH`, or `USDC`) are sent to the `RoyaltyManager`, any entity can call `RoyaltyManager::distribute` to swap any available `ETH`/`WETH` into `USDC`:

```solidity
    function distribute() external nonReentrant {
        // 1. Swap ETH to USDC if any ETH balance
        uint256 ethBalance = address(this).balance;
        if (ethBalance > 0) {
            swapProxy.swapETHToUSDC{ value: ethBalance }();
        }

        // 2. Swap WETH to USDC if any WETH balance
        uint256 wethBalance = WETH.balanceOf(address(this));
        if (wethBalance > 0) {
            swapProxy.swapWETHToUSDC(wethBalance);
        }

        // 3. Distribute USDC if any balance
        uint256 usdcBalance = USDC.balanceOf(address(this));
        if (usdcBalance >= 2e6) {
            USDC.approve(address(manager), usdcBalance);
            manager.distributeRoyalty(usdcBalance);
        }
    }
```

The `RoyaltyManager` will then transfer its entire `ETH` balance to the `SwapProxy` via the `swapETHToUSDC` function call, and this function will in turn transfer all of the `ETH` to attacker's malicious contract via `router::execute`:

```solidity
    function swapETHToUSDC() external payable nonReentrant returns (uint256 amountOut) {
        SwapImplStateStorage storage $ = _getStorage();

        uint256 amountIn = msg.value;
        if (amountIn == 0) revert AmountZero();
...
        $.router.execute{ value: amountIn }(commands, inputs, block.timestamp);
...
    }
```

Similarly, the `RoyaltyManager` will invoke the `swapWETHToUSDC` function, which will lead to the `SwapProxy` pulling the manager's entire `WETH` balance, and then the function will call into the attacker's malicious `router` contract:

```solidity
    function swapWETHToUSDC(uint256 amountIn) external nonReentrant returns (uint256 amountOut) {
        SwapImplStateStorage storage $ = _getStorage();

        if (amountIn == 0) revert AmountZero();

        $.WETH.safeTransferFrom(msg.sender, address(this), amountIn);
...
        $.router.execute(commands, inputs, block.timestamp);
...
    }
```

Since the reinitialization resulted in the `SwapProxy` approving the malicious contract to handle all of its `WETH` tokens, the contract can now simply pull all of the `WETH` tokens from the `SwapProxy`. 

## Recommendations
Prevent the `initialize` function from being called more than once. This can be accomplished by following the same pattern seen in other protocol contracts, such as `WishWishToken`:

```solidity
    function init(address _usdc, address _usdcReceiver, address _redemptionSigner, address _owner) external {
        if (owner() != address(0)) revert AlreadyInitialized();
    ...
        _initializeOwner(_owner);
    }
```

Similar to the code above, the `SwapImpl::initialize` function should revert if the owner has already been initialized and initialize the owner at the end of the function call. 
