---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - has/poc
  - severity/high
  - sector/nft
protocol: "[[Catalyst]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Catalyst-security-review.md"
genome:
  - "[[missing-modifier]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
  - "[[fee-accounting]]"
---
# [C-01] Attacker can drain all ETH from IPSeed due to re-configuring `tokenId`

- id: 31585
- impact: HIGH
- protocol: [[Catalyst]]
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Catalyst-security-review.md

## Summary


This bug report describes a high severity issue where an attacker can drain all ETH from IPSeed. This is likely to happen as there is nothing in place to prevent exploitation. The report explains that the metadata of `tokenId` can be partially configured, meaning that the creator can change the token parameters at any time. This allows an attacker to configure only the Curve address for a certain `tokenId`, mint an arbitrary amount of that `tokenId`, and then re-configure the `tokenId` with real values. The attacker can then sell all the minted tokens, draining the entire balance of IPSeed. A link to a proof of concept is also provided. The report recommends disallowing the re-configuration of `tokenId` by requiring a non-empty `string projectId` to be passed.

## Details

**Severity**

Impact: High. Attacker can drain all ETH from IPSeed.

Likelihood: High. Nothing prevents from exploiting.

**Description**

Metadata of `tokenId` can be partially configured. While `projectId` is empty string, the creator can change the token parameters anytime:

```solidity
  function spawn(
    uint256 tokenId,
    string calldata name,
    string calldata symbol,
    string calldata projectId,
    IIPSeedCurve curve,
    bytes32 curveParameters,
    address sourcer
  ) public {
    if (tokenId != computeTokenId(_msgSender(), projectId)) {
      revert InvalidTokenId();
    }

    // ERC1155's `exists` function checks for totalSupply > 0, which is not what we want here
    if (bytes(tokenMeta[tokenId].projectId).length > 0) {
      revert TokenAlreadyExists();
    }

    Metadata memory newMetadata =
      Metadata(sourcer, sourcer, name, symbol, projectId, curve, curveParameters);
    tokenMeta[tokenId] = newMetadata;

    emit Spawned(tokenId, sourcer, newMetadata);
  }
```

This behavior introduces following attack:

1. Attacker configures only Curve address for certain `tokenId`.
2. Attacker mints arbitrary amount of that `tokenId` because Curve parameters are 0, hence price is 0.
3. Attacker configures again that `tokenId`, but now with real values.
4. Attacker sells all minted tokens, draining whole balance of IPSeed.

Here is link to PoC: https://gist.github.com/T1MOH593/4c28ede6cdc6d183927bb7e14352ea73

**Recommendations**

Disallow re-configuring of `tokenId`, for example require to pass non-empty `string projectId`
