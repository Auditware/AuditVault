---
tags:
  - lang/circom
  - sector/bridge
  - sector/zk
  - platform/trailofbits
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/locked-funds
protocol: "[[Succinct]]"
auditors:
  - "[[Joe Doyle]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/2023-02-succinct-securityreview.pdf"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[account-signer]]"
  - "[[bridge-message-validation]]"
  - "[[zk-soundness-bigint]]"
---
# Prover can lock user funds by supplying non-reduced Y values to G1BigIntToSignFlag

- id: 21283
- impact: HIGH
- protocol: [[Succinct Labs Telepathy]]
- reporter: Joe Doyle (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2023-02-succinct-securityreview.pdf

## Summary


This bug report is about a Data Validation issue in the circuits/circuits/rotate.circom template. It is a high difficulty issue that can be exploited by malicious provers to lock user funds. During the Rotate proof, the prover must supply a Y value with a sign corresponding to the sign bit of the compressed public key. This is done by passing the Y coordinate to the G1BigIntToSignFlag component, which determines the sign of Y by checking if 2*Y >= p. The problem is that the correctness of this calculation depends on the Y value being less than p; otherwise, a positive, non-reduced value such as p+1 will be incorrectly interpreted as negative. A malicious prover could use this to commit to a non-reduced form of Y that diﬀers in sign from the correct public key, preventing future provers from generating Step circuit proofs and thus halting the LightClient, trapping user funds in the Bridge.

To address this issue, it is recommended to constrain the pubkeysBigIntY values to be less than p using BigLessThan in the short term. In the long term, it is suggested to constrain all private witness values to be in canonical form before use, and consider adopting Circom signal tags to automate the checking of these assumptions.

## Details

## Diﬃculty: High

## Type: Data Validation

### Target: circuits/circuits/rotate.circom

## Description

The `G1BigIntToSignFlag` template does not check whether its input is a value properly reduced mod `p`. A malicious prover can lock user funds by carefully selecting malformed public keys and using the `Rotate` function, which will prevent future provers from using the default witness generator to make new proofs.

During the `Rotate` proof, when translating compressed public keys to full `(X, Y)` form, the prover must supply a `Y` value with a sign corresponding to the sign bit of the compressed public key. The circuit calculates the sign of `Y` by passing the `Y` coordinate (supplied by the prover and represented as a BigInt) to the `G1BigIntToSignFlag` component (figure 2.1). This component determines the sign of `Y` by checking if `2*Y >= p`. However, the correctness of this calculation depends on the `Y` value being less than `p`; otherwise, a positive, non-reduced value such as `p + 1` will be incorrectly interpreted as negative. A malicious prover could use this fact to commit to a non-reduced form of `Y` that differs in sign from the correct public key. This invalid commitment would prevent future provers from generating `Step` circuit proofs and thus halt the `LightClient`, trapping user funds in the `Bridge`.

```circom
template G1BigIntToSignFlag(N, K) {
  signal input in[K];
  signal output out;
  var P[K] = getBLS128381Prime();
  var LOG_K = log_ceil(K);
  component mul = BigMult(N, K);
  signal two[K];
  for (var i = 0; i < K; i++) {
      if (i == 0) {
          two[i] <== 2;
      } else {
          two[i] <== 0;
      }
  }
  for (var i = 0; i < K; i++) {
      mul.a[i] <== in[i];
      mul.b[i] <== two[i];
  }
  component lt = BigLessThan(N, K);
  for (var i = 0; i < K; i++) {
      lt.a[i] <== mul.out[i];
      lt.b[i] <== P[i];
  }
  out <== 1 - lt.out;
}
```

**Figure 2.1**: telepathy/circuits/circuits/bls.circom#197–226

## Exploit Scenario

Alice, a malicious prover, uses a valid block header containing a sync committee update to generate a `Rotate` proof. When one of the new sync committee members’ public key `Y` value has a negative sign, Alice substitutes it with `2P - Y`. This value is congruent to `-Y mod p`, and thus has positive sign; however, the `G1BigIntToSignFlag` component will determine that it has negative sign and validate the inclusion in the Poseidon commitment. Future provers will then be unable to generate proofs from this commitment since the committed public key set does not match the canonical sync committee.

## Recommendations

- **Short term:** Constrain the `pubkeysBigIntY` values to be less than `p` using `BigLessThan`.
- **Long term:** Constrain all private witness values to be in canonical form before use. Consider adopting Circom signal tags to automate the checking of these assumptions.
