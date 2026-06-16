---
tags:
  - lang/solidity
  - platform/cyfrin
  - has/github
  - has/poc
  - severity/high
  - sector/oracle
protocol: "[[Beanstalk]]"
auditors:
  - "[[Dacian]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2023-12-05-cyfrin-beanstalk-bip-39.md"
genome:
  - "[[decimal-mismatch]]"
  - "[[direct-drain]]"
  - "[[nft-metadata-mutability]]"
---
# The previous milestone stem should be scaled for use with the new gauge point system which uses untruncated values moving forward

- id: 31276
- impact: HIGH
- protocol: [[Beanstalk]] Bip
- reporter: Dacian (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2023-12-05-cyfrin-beanstalk-bip-39.md

## Summary


The report describes a bug in the Beanstalk Silo, where the milestone stem for a token is not being stored correctly. This results in a loss of grown stalk for depositors. The bug can be fixed by scaling up the existing milestone stem for each token. This bug affects critical parts of the protocol and can lead to further issues if not addressed. 

## Details

**Description:** Within the Beanstalk Silo, the milestone stem for a given token is the cumulative amount of grown stalk per BDV for this token at the last `stalkEarnedPerSeason` update. Previously, the milestone stem was stored in its truncated representation; however, the seed gauge system now stores the value in its untruncated form due to the new granularity of grown stalk and the frequency with which these values are updated.

At the time of upgrade, the previous (truncated) milestone stem for each token should be scaled for use with the gauge point system by multiplying up by a factor of `1e6`. Otherwise, there will be a mismatch in decimals when [calculating the stem tip](https://github.com/BeanstalkFarms/Beanstalk/blob/dfb418d185cd93eef08168ccaffe9de86bc1f062/protocol/contracts/libraries/Silo/LibTokenSilo.sol#L388-L391).

```solidity
_stemTipForToken = s.ss[token].milestoneStem +
    int96(s.ss[token].stalkEarnedPerSeason).mul(
        int96(s.season.current).sub(int96(s.ss[token].milestoneSeason))
    );
```

**Impact:** The mixing of decimals between the old milestone stem (truncated) and the new milestone stem (untruncated, after the first `gm` call following the BIP-39 upgrade) breaks the existing grown stalk accounting, resulting in a loss of grown stalk for depositors.

**Proof of Concept:** The [previous implementation](https://github.com/BeanstalkFarms/Beanstalk/blob/7606673/protocol/contracts/libraries/Silo/LibTokenSilo.sol#L376-L391) returns the cumulative stalk per BDV with 4 decimals:
```solidity
    function stemTipForToken(address token)
        internal
        view
        returns (int96 _stemTipForToken)
    {
        AppStorage storage s = LibAppStorage.diamondStorage();

        // SafeCast unnecessary because all casted variables are types smaller that int96.
        _stemTipForToken = s.ss[token].milestoneStem +
        int96(s.ss[token].stalkEarnedPerSeason).mul(
            int96(s.season.current).sub(int96(s.ss[token].milestoneSeason))
        ).div(1e6); //round here
    }
```

Which can be mathematically abstracted to:
$$StemTip(token) = getMilestonStem(token) + (current \ season - getMilestonStemSeason(token)) \times \frac{stalkEarnedPerSeason(token)}{10^{6}}$$

This division by $10^{6}$ happens because the stem tip previously had just 4 decimals. This division allows backward compatibility by not considering the final 6 decimals. Therefore, the stem tip **MUST ALWAYS** have 4 decimals.

The milestone stem is now [updated in each `gm` call](https://github.com/BeanstalkFarms/Beanstalk/blob/dfb418d185cd93eef08168ccaffe9de86bc1f062/protocol/contracts/libraries/LibGauge.sol#L265-L268) so long as all [LP price oracles pass their respective checks](https://github.com/BeanstalkFarms/Beanstalk/blob/dfb418d185cd93eef08168ccaffe9de86bc1f062/protocol/contracts/libraries/LibGauge.sol#L65-L67). Notably, the milestone stem is now stored with 10 decimals (untruncated), hence why the second term of the abstraction has omitted the `10^{6}` division in `LibTokenSilo::stemTipForTokenUntruncated`.

However, if the existing milestone stem is not escalated by $10^{6}$ then the addition performed during the upgrade and in subsequent `gm` calls makes no sense. This is mandatory to be handled within the upgrade otherwise every part of the protocol which calls `LibTokenSilo.stemTipForToken` will receive an incorrect value, except for BEAN:ETH Well LP (given it was created after the Silo v3 upgrade).

Some instances where this function is used include:
* [`EnrootFacet::enrootDeposit`](https://github.com/BeanstalkFarms/Beanstalk/blob/dfb418d185cd93eef08168ccaffe9de86bc1f062/protocol/contracts/beanstalk/silo/EnrootFacet.sol#L91)
* [`EnrootFacet::enrootDeposits`](https://github.com/BeanstalkFarms/Beanstalk/blob/dfb418d185cd93eef08168ccaffe9de86bc1f062/protocol/contracts/beanstalk/silo/EnrootFacet.sol#L131)
* [`MetaFacet::uri`](https://github.com/BeanstalkFarms/Beanstalk/blob/dfb418d185cd93eef08168ccaffe9de86bc1f062/protocol/contracts/beanstalk/metadata/MetadataFacet.sol#L36)
* [`ConvertFacet::_withdrawTokens`](https://github.com/BeanstalkFarms/Beanstalk/blob/dfb418d185cd93eef08168ccaffe9de86bc1f062/protocol/contracts/beanstalk/silo/ConvertFacet.sol#L129-148)
* [`LibSilo::__mow`](https://github.com/BeanstalkFarms/Beanstalk/blob/dfb418d185cd93eef08168ccaffe9de86bc1f062/protocol/contracts/libraries/Silo/LibSilo.sol#L382)
* [`LibSilo::_removeDepositFromAccount`](https://github.com/BeanstalkFarms/Beanstalk/blob/dfb418d185cd93eef08168ccaffe9de86bc1f062/protocol/contracts/libraries/Silo/LibSilo.sol#L545)
* [`LibSilo::_removeDepositsFromAccount`](https://github.com/BeanstalkFarms/Beanstalk/blob/dfb418d185cd93eef08168ccaffe9de86bc1f062/protocol/contracts/libraries/Silo/LibSilo.sol#L604)
* [`Silo::_plant`](https://github.com/BeanstalkFarms/Beanstalk/blob/dfb418d185cd93eef08168ccaffe9de86bc1f062/protocol/contracts/beanstalk/silo/SiloFacet/Silo.sol#L110)
* [`TokenSilo::_deposit`](https://github.com/BeanstalkFarms/Beanstalk/blob/dfb418d185cd93eef08168ccaffe9de86bc1f062/protocol/contracts/beanstalk/silo/SiloFacet/TokenSilo.sol#L173)
* [`TokenSilo::_transferDeposits`](https://github.com/BeanstalkFarms/Beanstalk/blob/dfb418d185cd93eef08168ccaffe9de86bc1f062/protocol/contracts/beanstalk/silo/SiloFacet/TokenSilo.sol#L367)
* [`LibLegacyTokenSilo::_mowAndMigrate`](https://github.com/BeanstalkFarms/Beanstalk/blob/dfb418d185cd93eef08168ccaffe9de86bc1f062/protocol/contracts/libraries/Silo/LibLegacyTokenSilo.sol#L306)
* [`LibTokenSilo::_mowAndMigrate`](https://github.com/BeanstalkFarms/Beanstalk/blob/dfb418d185cd93eef08168ccaffe9de86bc1f062/protocol/contracts/libraries/Silo/LibLegacyTokenSilo.sol#L306)

As can be observed, critical parts of the protocol are compromised, leading to further cascading issues.

**Recommended Mitigation:** Scale up the existing milestone stem for each token:
```diff
for (uint i = 0; i < siloTokens.length; i++) {
+   s.ss[siloTokens[i]].milestoneStem = int96(s.ss[siloTokens[i]].milestoneStem.mul(1e6));
```

\clearpage
