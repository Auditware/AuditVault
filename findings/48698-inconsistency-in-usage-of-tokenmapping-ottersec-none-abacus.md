---
tags:
  - lang/solidity
  - platform/ottersec
  - has/poc
  - severity/high
  - sector/farm
  - sector/lending
  - sector/nft
  - sector/nft-lending
  - sector/vault
protocol: "[[Abacus]]"
auditors:
  - "[[Robert Chen]]"
report: "https://abacus.wtf/"
genome:
  - "[[frozen-funds]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
  - "[[liquidation-underwater]]"
---
# Inconsistency in Usage of tokenMapping . . . . . . . . . . .

- id: 48698
- impact: HIGH
- protocol: [[Abacus]]
- reporter: Robert Chen (OtterSec)
- source: https://abacus.wtf/

## Summary


The report discusses a bug in the vault contract that is used to store and verify the existence of NFTs in a pool. The bug is caused by inconsistent key calculation in different functions, which allows an attacker to sign for an already-removed NFT and manipulate the pool's closure. This can lead to a Denial of Service in the vault and affect the liquidation process in the Lend contract. To fix this, the key calculation method should be made consistent and the tokenMapping value should be updated after calling a specific function. The bug has been patched in the latest version of the contract. 

## Details

## Vault Contract Vulnerability

The vault contract uses `mapping(uint256 => bool) tokenMapping` for storing and verifying the existence of an NFT in the pool/vault. The key for `tokenMapping` is an encoding of the NFT address and token ID.

## Modifications to tokenMapping

There are four places this `tokenMapping` is modified:

1. **includeNft**: while inserting an NFT into the vault.
2. **remove**: while removing an NFT from the vault.
3. **closeNft**: closing the NFT in exchange for the `payoutPerRes` of the current epoch.
4. **getHeldTokenExistence**: a function used to check the existence of an NFT.
5. **encodeCompressedValue**: a helper getter function in the Factory contract.

## Inconsistency in Key Calculation

Below are the details on the inconsistency in key calculation for `tokenMapping`:

1. `id << 160 | nft` - used by the `includeNft`, `getHeldTokenExistence`, and `encodeCompressedValue` functions.
2. `nft << 160 | id` - used by the `remove` and `closeNft` functions.

Even after an NFT was removed, due to the invalid key calculation in the `remove` function, `getHeldTokenExistence` returns true. This allows a user to sign the NFT for an already-removed NFT.

An attacker can abuse this by alternately calling `remove` and `sign-nft`, which increases the `nftRemoved` value and leads to closing of the pool.

```solidity
contracts/Factory.sol
SOLIDITY
mav.nftRemoved++;
IVault(mav.pool).toggleEmissions(nftToRemove, idToRemove, false);
emit EmissionsStopped(mav.pool);
if (mav.nftRemoved == mav.nftsInPool) {
    IVault(mav.pool).closePool();
    emit PoolClosed(mav.pool);
}
```

Additionally, in the `remove` and `closeNFT` functions, `tokenMapping` is updated before calling the `updateNftInUse` function of the Factory contract. `updateNftInUse` checks `tokenMapping` internally for the value true, which is possible because the value was already modified.

```solidity
contracts/Vault.sol
SOLIDITY
tokenMapping[tempStorage] = false;
factory.updateNftInUse(nft, id, MAPoolNonce);
```

This will lead to a Denial of Service in the vault, as the `remove` and `closeNFT` functions won’t work. The Lend contract will also be affected.

## Proof of Concept

To reproduce the exploit, follow the steps below:

1. Attacker’s NFT is added to the pool by the creator.
2. Attacker signs the NFT with the `signMultiAssetVault` function in the Factory contract.
3. Attacker removes the NFT with the `remove` function in the Vault contract.
4. Repeat steps 2 and 3 until `nftRemoved` has incremented to be equal to `nftsInPool`.
5. As `mav.nftRemoved == mav.nftsInPool`, the vault closes, halting all the functionalities of the vault.

This will ultimately affect the Lend contract’s liquidation process for NFTs in that pool.

## Remediation

Use a consistent method (for example, key encoding) to store and access the `tokenMapping`. In addition, update the `tokenMapping` value after calling the `updateNftInUse` function.

## Patch

Used `(nft << 95 | id)` encoding in all places. Fixed in `c48c3cb`.
