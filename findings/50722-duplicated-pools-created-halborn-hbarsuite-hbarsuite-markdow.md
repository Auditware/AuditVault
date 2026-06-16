---
tags:
  - lang/solidity
  - severity/high
  - platform/halborn
  - sector/dex
protocol: "[[HbarSuite]]"
auditors:
  - "[[Halborn]]"
report: "https://www.halborn.com/audits/hbarsuite/hbarsuite-backend-pentest"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[commitment-uniqueness]]"
---
# DUPLICATED POOLS CREATED

- id: 50722
- impact: HIGH
- protocol: [[HbarSuite]]
- reporter: Halborn
- source: https://www.halborn.com/audits/hbarsuite/hbarsuite-backend-pentest

## Summary


The report describes a bug found in the `/pools/create` API endpoint on four smart nodes. By sending a specific payload to all four nodes at the same time, it was possible to create duplicated pools. This caused issues with opening positions in the duplicated pools. A fix was implemented by the HbarSuite team after the issue was raised to them. Retesting showed that the method used to create the duplicated pools no longer works.

## Details

##### Description

It was found that by sending a valid `pool create` payload to the `/pools/create` API endpoint on all the smart nodes at the same, duplicated pools could be created.

This resulted in no positions being able to be opened in those duplicated pools.

A script was created to send a payload to the `/pools/create` API endpoint of `testnet-sn1`, `testnet-sn2`, `testnet-sn3` and `testnet-sn4` at virtually the same time.

This resulted in the pool being created through at least more than one of the nodes because it was observed that duplicated pools were created.

An example of the payload:

```
{"baseToken":{"id":"0.0.34332104"},"swapToken":{"id":"HBAR"}}

```

![Duplicated pools showing on frontend](https://halbornmainframe.com/proxy/audits/images/659ea033a1aa3698c0eb65cf){width=384 height=458}

##### Score

Impact: 3  
Likelihood: 5

##### Recommendation

**SOLVED**: While testing was ongoing, this issue was raised with the `HbarSuite team`. A fix was implemented and after retesting, it was noted that the same method could no longer be used to create a duplicated pool.
