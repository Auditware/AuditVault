---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - severity/high
  - sector/dex
protocol: "[[Catalyst]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Catalyst-security-review.md"
genome:
  - "[[missing-modifier]]"
  - "[[direct-drain]]"
  - "[[fee-accounting]]"
  - "[[fot-slippage]]"
---
# [C-02] Attacker can drain all ETH from IPSeed due to malicious `IIPSeedCurve` implementation

- id: 31586
- impact: HIGH
- protocol: [[Catalyst]]
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Catalyst-security-review.md

## Summary


The bug report states that there is a high severity bug in the code that allows an attacker to drain all ETH from the system. This is because the code allows for the use of arbitrary implementations of the `IIPSeedCurve` function, which can be malicious and return incorrect prices for tokens. This can result in the draining of ETH when tokens are bought or sold. To fix this bug, the report recommends only allowing the use of whitelisted implementations of the `IIPSeedCurve` function.

## Details

**Severity**

Impact: High. Attacker can drain all ETH.

Likelihood: High. Nothing prevents from exploiting.

**Description**

Currently user can specify arbitrary implementation of `IIPSeedCurve`:

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
    ...

    Metadata memory newMetadata =
@>    Metadata(sourcer, sourcer, name, symbol, projectId, curve, curveParameters);
    tokenMeta[tokenId] = newMetadata;

    emit Spawned(tokenId, sourcer, newMetadata);
  }
```

However Curve implementation can be malicious: for example return 0 price on buy and arbitrary price on sell. On burning and minting IPSeed quotes it from Curve implementation:

```solidity
  function getBuyPrice(uint256 tokenId, uint256 want)
    public
    view
    returns (uint256 gross, uint256 net, uint256 protocolFee, uint256 sourcerFee)
  {
    net = tokenMeta[tokenId].priceCurve.getBuyPrice(
      totalSupply(tokenId), want, tokenMeta[tokenId].curveParameters
    );
    (protocolFee, sourcerFee) = computeFees(net);
    gross = net + protocolFee + sourcerFee;
  }

  function getSellPrice(uint256 tokenId, uint256 sell)
    public
    view
    returns (uint256 gross, uint256 net, uint256 protocolFee, uint256 sourcerFee)
  {
    gross = tokenMeta[tokenId].priceCurve.getSellPrice(
      totalSupply(tokenId), sell, tokenMeta[tokenId].curveParameters
    );
    (protocolFee, sourcerFee) = computeFees(gross);
    net = gross - protocolFee - sourcerFee;
  }
```

Malicious Curve implementation can incorrectly price tokens and therefore drain ETH on selling.

**Recommendations**

Allow using only whitelisted implementation of `IIPSeedCurve`
