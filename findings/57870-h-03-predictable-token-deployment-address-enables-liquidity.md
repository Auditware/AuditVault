---
tags:
  - lang/solidity
  - sector/dex
  - platform/shieldify
  - has/github
  - has/poc
  - severity/high
protocol: "[[Daoslive]]"
auditors:
  - Shieldify Security
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/DaosLive-Security-Review.md"
genome:
  - "[[frontrun-exposure]]"
  - "[[mev/frontrun]]"
---
# [H-03] Predictable Token Deployment Address Enables Liquidity Pool Exploit in `finalize()` in `DaosLive`

- id: 57870
- impact: HIGH
- protocol: Daoslive
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/DaosLive-Security-Review.md

## Summary


This report describes a high-risk bug that allows an attacker to manipulate the deployment of a contract called `DaosToken` within the `DaosLive` contract. This predictability enables a front-running attack, which can result in a loss of protocol funds and a collapse in the token's value on Uniswap. The bug has been fixed by using a more secure method called `CREATE2` with a salt.

## Details

## Severity

High Risk

## Description

An attacker can exploit the deterministic nature of contract deployment using the `CREATE` opcode to precompute the address of the `DaosToken` deployed within the `DaosLive::finalize()` function. This predictability enables a front-running attack that severely impacts the liquidity and valuation of the token in Uniswap v3 pools.

The `DaosToken` is deployed via the `CREATE` opcode inside the `finalize()` function of the `DaosLive` contract. The use of `CREATE` makes the address of the deployed contract predictable using the sender address and nonce:

> **Source:** [evm.codes](https://www.evm.codes/#f0)  
> The destination address is calculated as the rightmost 20 bytes (160 bits) of the Keccak-256 hash of the RLP encoding of the sender address, followed by its nonce.  
> `address = keccak256(rlp([sender_address, sender_nonce]))[12:]`

By leveraging this predictability, an attacker can execute the following exploit sequence:

---

## Exploit Scenario

1. The attacker precomputes the future address of the `DaosToken` contract as it is deployed via the `CREATE` opcode using this: `keccak256(rlp([deployer_address, deployer_nonce]))[12:]`.

2. The attacker creates a Uniswap v3 liquidity pool between WETH and the precomputed `DaosToken` address using the same fee tier and tick range expected in the `finalize()` function.

3. The attacker adds liquidity to the newly created pool by supplying a very small amount of WETH and a large amount of spoofed `DaosToken`.

4. The spoofed token is accepted by Uniswap because the address exists even though the actual contract code is not yet deployed.

5. The attacker waits for the `DaosLive::finalize()` function to be executed by the protocol.

6. Upon execution, the `DaosToken` contract is deployed at the precomputed address, and the protocol adds a significant amount of real `DaosToken` and WETH as liquidity to the same pool.

7. The attacker removes their liquidity position from the pool, receiving a large share of the real `DaosToken` just added by the protocol.

8. The attacker then swaps all the extracted `DaosToken` for WETH in the same pool.

9. The swap operation drains a significant portion of WETH from the pool, resulting in a skewed token price.

10. The final state of the pool has almost no WETH and an imbalanced supply of `DaosToken`, severely devaluing the token and harming the protocol’s liquidity.

## Location of Affected Code

File: [contracts/DaosLive.sol](https://github.com/ED3N-Ventures/daoslive-sc/blob/9a1856db2060b609a17b24aa72ab35f2cdf09031/contracts/DaosLive.sol)

```solidity
function finalize(
  // code
  bytes memory data = abi.encodeWithSelector(
      IDaosToken.initialize.selector,
      address(_factory),
      name,
      symbol
  );
  BeaconProxy tokenBeacon = new BeaconProxy(_factory.tokenBeacon(), data);
  token = address(tokenBeacon);
  _factory.emitTokenCreated(token);

  // code
}
```

## Impact

- **Loss of Protocol Funds:** Protocol-owned WETH is extracted via manipulated liquidity removal.
- **Price Collapse:** The `DaosToken` becomes nearly worthless on Uniswap due to the attacker draining liquidity.

## Recommendation

To mitigate this issue:

**Use `CREATE2` with a salt:**

- This allows the `DaosLive` owner to control and obscure the final address more securely.

## Team Response

Fixed.
