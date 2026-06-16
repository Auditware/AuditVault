---
tags:
  - lang/circom
  - platform/trailofbits
  - has/github
  - has/poc
  - severity/high
  - sector/zk
protocol: "[[Succinct]]"
auditors:
  - "[[Joe Doyle]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/2023-02-succinct-securityreview.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[account-signer]]"
  - "[[circuit-constraint-completeness]]"
  - "[[merkle-tree-overflow]]"
  - "[[ec-point-doubling]]"
---
# Incorrect handling of point doubling can allow signature forgery

- id: 21284
- impact: HIGH
- protocol: [[Succinct Labs Telepathy]]
- reporter: Joe Doyle (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2023-02-succinct-securityreview.pdf

## Summary


This bug report is about a data validation issue with the telepathy/circuits/circuits/bls.circom code. When verifying the sync committee signature, individual public keys are aggregated into an overall public key by repeatedly calling G1Add in a tree structure. Unfortunately, due to the mishandling of elliptic curve point doublings, a minority of carefully selected public keys can cause the aggregation to result in an arbitrary, maliciously chosen public key, allowing signature forgeries and thus malicious light client updates.

The results of EllipticCurveAddUnequal are constrained by equations that reduce to 0=0 if a and b are equal. If any inputs to G1Add are equal, a malicious prover can choose outputs to trigger this bug repeatedly and cause the signature to be checked with a public key of their choice.

Exploit Scenario: Alice, a malicious prover, registers public keys A = aG, B = bG and C = (a+b)G. She waits for a sync committee selection in which A, B and C are all present and located in the same subtree of the sync committee participation array. By setting all other participation bits in that subtree to zero, Alice can force EllipticCurveAddUnequal to be called on A+B and C. Using the underconstrained point addition formula, she can prove that the sum of these points is equal to the next subtree root, and repeat until she has arbitrarily selected the aggregated public key. Alice can then forge a signature for an arbitrary block header and steal all user funds.

The recommendations to solve this issue are to first change G1Add to use EllipticCurveAdd, which correctly handles equal inputs. Long term, review all uses of EllipticCurveAddUnequal to ensure that the inputs have different X components.

## Details

## Security Assessment

**Diﬃculty:** High  
**Type:** Data Validation  
**Target:** telepathy/circuits/circuits/bls.circom  

## Description

When verifying the sync committee signature, individual public keys are aggregated into an overall public key by repeatedly calling `G1Add` in a tree structure. Due to the mishandling of elliptic curve point doublings, a minority of carefully selected public keys can cause the aggregation to result in an arbitrary, maliciously chosen public key, allowing signature forgeries and thus malicious light client updates.

When `bit1` and `bit2` of `G1Add` are both set, `G1Add` computes `out` by calling `EllipticCurveAddUnequal`:

```circom
template parallel G1Add(N, K) {
    var P[7] = getBLS128381Prime();
    signal input pubkey1[2][K];
    signal input pubkey2[2][K];
    signal input bit1;
    signal input bit2;

    /* COMPUTE BLS ADDITION */
    signal output out[2][K];
    signal output out_bit;
    out_bit <== bit1 + bit2 - bit1 * bit2;
    
    component adder = EllipticCurveAddUnequal(55, 7, P);
    
    for (var i = 0; i < 2; i++) {
        for (var j = 0; j < K; j++) {
            adder.a[i][j] <== pubkey1[i][j];
            adder.b[i][j] <== pubkey2[i][j];
        }
    }
}
```

![Figure 3.1: telepathy/circuits/circuits/bls.circom#82–101](figure_link_here)

The results of `EllipticCurveAddUnequal` are constrained by equations that reduce to `0 = 0` if `a` and `b` are equal:

```circom
// constrain x_3 by CUBIC (x_1 + x_2 + x_3) * (x_2 - x_1)^2 - (y_2 - y_1)^2 = 0 mod p
component dx_sq = BigMultShortLong(n, k, 2 * n + LOGK + 2);  // 2k-1 registers abs val < k*2^{2n}
component dy_sq = BigMultShortLong(n, k, 2 * n + LOGK + 2);  // 2k-1 registers < k*2^{2n}

for (var i = 0; i < k; i++) {
    dx_sq.a[i] <== b[0][i] - a[0][i];
    dx_sq.b[i] <== b[0][i] - a[0][i];
    dy_sq.a[i] <== b[1][i] - a[1][i];
    dy_sq.b[i] <== b[1][i] - a[1][i];
}
```

```circom
[...]
component cubic_mod = SignedCheckCarryModToZero(n, k, 4 * n + LOGK3, p);
for (var i = 0; i < k; i++)
    cubic_mod.in[i] <== cubic_red.out[i];
// END OF CONSTRAINING x3

// constrain y_3 by (y_1 + y_3) * (x_2 - x_1) = (y_2 - y_1)*(x_1 - x_3) mod p
component y_constraint = PointOnLine(n, k, p);  // 2k-1 registers in [0, k*2^{2n+1})

for (var i = 0; i < k; i++) {
    for (var j = 0; j < 2; j++) {
        y_constraint.in[0][j][i] <== a[j][i];
        y_constraint.in[1][j][i] <== b[j][i];
        y_constraint.in[2][j][i] <== out[j][i];
    }
}
// END OF CONSTRAINING y3
```

![Figure 3.2: telepathy/circuits/circuits/pairing/curve.circom#182–221](figure_link_here)

If any inputs to `G1Add` are equal, a malicious prover can choose outputs to trigger this bug repeatedly and cause the signature to be checked with a public key of their choice. Each input to `G1Add` can be either a committee member public key or an intermediate aggregate key.

## Exploit Scenario

Alice, a malicious prover, registers public keys `A = aG`, `B = bG` and `C = (a+b)G`. She waits for a sync committee selection in which `A`, `B`, and `C` are all present and located in the same subtree of the sync committee participation array. By setting all other participation bits in that subtree to zero, Alice can force `EllipticCurveAddUnequal` to be called on `A+B` and `C`. Using the underconstrained point addition formula, she can prove that the sum of these points is equal to the next subtree root, and repeat until she has arbitrarily selected the aggregated public key. Alice can then forge a signature for an arbitrary block header and steal all user funds.

## Recommendations

- **Short term:** Change `G1Add` to use `EllipticCurveAdd`, which correctly handles equal inputs.
- **Long term:** Review all uses of `EllipticCurveAddUnequal` to ensure that the inputs have different X components.
