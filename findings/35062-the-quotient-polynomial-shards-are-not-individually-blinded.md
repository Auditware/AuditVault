---
tags:
  - lang/solidity
  - platform/openzeppelin
  - has/github
  - severity/high
  - sector/options
  - sector/privacy
  - sector/zk
protocol: "[[Linea]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/linea-prover-audit"
genome:
  - "[[wrong-condition]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[zk-statistical-zero-knowledge]]"
---
# The Quotient Polynomial Shards Are Not Individually Blinded

- id: 35062
- impact: HIGH
- protocol: [[Linea]] Plonk Prover (Backend) and Plonk Verifier Audit
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/linea-prover-audit

## Summary

The bug report discusses an issue with the blinding of shards in the Plonk proof construction process. The current code does not blind the shards of the quotient polynomial, which means they do not provide the statistical zero-knowledge property as required by the latest Plonk specification. This issue has been resolved in a recent pull request by implementing the blinding of the shards according to the latest version of the PLONK paper. However, this new blinding increases the memory consumption of the prover, so a global option has been introduced to control all blindings and improve memory usage. The Linea team also suggested further improvements to the fix, such as making the `h3` polynomial the same size as the other shards and making the `StatisticalZK` switch control all blindings. 

## Details

After [constructing the shards](https://github.com/Consensys/gnark/blob/e2040836eb41a40df04a4a3648764b07a0fa12a2/backend/plonk/bn254/prove.go#L612-L625) of the quotient polynomial h(X) their KZG commitments are [added to the proof](https://github.com/Consensys/gnark/blob/e2040836eb41a40df04a4a3648764b07a0fa12a2/backend/plonk/bn254/prove.go#L538) without blinding, as required by the [latest Plonk specification](https://eprint.iacr.org/2019/953.pdf). As noted by [Sefranek](https://eprint.iacr.org/2024/848.pdf), this means they do not provide the statistical zero\-knowledge property.


Consider blinding the individual shards in the proof.


***Update:** Resolved in [pull request \#14](https://github.com/ThomasPiellard/gnark-oz/pull/14).*


*The issue was fixed by applying the blinding of the `h` shards (`h1,h2,h3`) according to the latest version of the PLONK paper (February 23, 2024\). In addition, a global `StatisticalZK` option was introduced which, when turned off, switches back to the previous version of the code (i.e., the one that does not blind the shards).*


*This is desirable since the new blinding increases the memory consumption of the prover due to the necessity to reserve three additional arrays of size `n` (where `n` is the size of the circuit) to store the three blinded polynomials. Previously, they were just sliced from the (already allocated) `h` polynomial.*


*Some recommendations to further improve the fix:*


* *Make the `StatisticalZK` switch to control all blindings (i.e., also of the `a,b,c,z` polynomials) and not just of the `t` shards. This will further ease the memory requirements on the prover when blinding is not desirable and will also simplify the implementation and improve consistency.*
* *Make the `h3` polynomial the same size as the `h1,h2` shards by setting its top coefficients to zero. This will remove the conditional logic in the `innerComputeLinearizedPoly` function (which is a bit unnatural, anyway), since all the `hx[i]` values will be valid, and will improve code readability.*


*The Linea team stated:*



> *We made it an option to achieve zero knowledge\-ness (see `backend.WithStatisticalZeroKnowledge()`) because it uses more memory. In cases where it is not needed, it is better to avoid it.*
