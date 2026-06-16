---
tags:
  - lang/solidity
  - platform/quantstamp
  - has/github
  - severity/high
  - sector/oracle
protocol: "[[Sperax Farms]]"
auditors:
  - "[[Gereon Mendler]]"
report: "https://certificate.quantstamp.com/full/sperax-farms/e6f8e3b1-d55d-4c05-91da-30d4a4bb7633/index.html"
genome:
  - "[[stale-price]]"
  - "[[defi/price-manipulation]]"
  - "[[oracle-freshness]]"
---
# Oracles Are Not Checked for Validity or Staleness

- id: 59250
- impact: HIGH
- protocol: Sperax - Farms
- reporter: Gereon Mendler (Quantstamp)
- source: https://certificate.quantstamp.com/full/sperax-farms/e6f8e3b1-d55d-4c05-91da-30d4a4bb7633/index.html

## Summary


The client has reported a bug in the file "Rewarder.sol" of the project. They have marked it as "Acknowledged" and provided an explanation for the bug. The bug is related to the use of an Oracle contract and its timestamp. If the timestamp is too old or the price returned is 0, the data from the Oracle should not be trusted. The client has recommended validating the Oracle output properly to fix this bug.

## Details

**Update**
Marked as "Acknowledged" by the client. The client provided the following explanation:

> *   We are going to use USDs Master Oracle contract which is already audited.
> *   Deployed contract: https://arbiscan.io/address/0x14D99412dAB1878dC01Fe7a1664cdE85896e8E50#readContract
> *   Audit report: https://github.com/Sperax/USDs-v2/blob/main/audit/Quantstamp-USDsV2-Audit.pdf
> *   We will ensure all the future price feeds that are integrated on the masterOracle have a staleness proof.

**File(s) affected:**`Rewarder.sol`

**Description:** Oracles usually include a timestamp of the last update. If this timestamp is too old, the retrieved data is considered stale and should not be relied upon. Additionally, if the price returned is 0, the Oracle data should not be trusted.

**Recommendation:** Sufficiently validate oracle output.
