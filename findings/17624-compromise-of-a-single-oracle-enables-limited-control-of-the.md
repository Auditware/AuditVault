---
tags:
  - lang/solidity
  - sector/oracle
  - platform/trailofbits
  - has/github
  - has/poc
  - severity/high
  - vuln/oracle/single-source
  - novelty/variant
  - misassumption/oracle-is-reliable
  - fix/use-multi-oracle
protocol: "[[API3]]"
auditors:
  - "[[Simone Monica]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/API3.pdf"
genome:
  - "[[single-source]]"
  - "[[variant]]"
  - "[[direct-drain]]"
  - "[[oracle-manipulation-resistance]]"
---
# Compromise of a single oracle enables limited control of the dAPI value

- id: 17624
- impact: HIGH
- protocol: [[API3]]
- reporter: Simone Monica (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/API3.pdf

## Summary


A vulnerability has been discovered in the airnode-protocol-v1/contracts/dapis/DapiServer.sol. An attacker could gain control of the median price of a dAPI by compromising only one oracle, setting the median price to any value between the lowest and highest values submitted by the oracles. This could allow the attacker to turn a profit by adjusting the rate when buying and selling assets. 

To mitigate this risk in the short term, it is recommended to implement off-chain monitoring of the DapiServer contracts to detect any suspicious activity. In the long term, it is important to ensure that dAPI value computations are robust and can withstand partial compromises.

## Details

## Security Assessment Report

### Difficulty: 
Undetermined

### Type: 
Patching

### Target: 
`airnode-protocol-v1/contracts/dapis/DapiServer.sol`

### Description
By compromising only one oracle, an attacker could gain control of the median price of a dAPI and set it to a value within a certain range. The dAPI value is the median of all values provided by the oracles. If the number of oracles is odd (i.e., the median is the value in the center of the ordered list of values), an attacker could skew the median, setting it to a value between the lowest and highest values submitted by the oracles.

### Exploit Scenario
There are three available oracles: O0, with a price of 603; O1, with a price of 598; and O2, which has been compromised by Eve. Eve is able to set the median price to any value in the range [598, 603]. Eve can then turn a profit by adjusting the rate when buying and selling assets.

### Recommendations
**Short term:** Be mindful of the fact that there is no simple fix for this issue; regardless, we recommend implementing off-chain monitoring of the `DapiServer` contracts to detect any suspicious activity.

**Long term:** Assume that an attacker may be able to compromise some of the oracles. To mitigate a partial compromise, ensure that dAPI value computations are robust.

---

*Trail of Bits*  
API3 Security Assessment  
PUBLIC
