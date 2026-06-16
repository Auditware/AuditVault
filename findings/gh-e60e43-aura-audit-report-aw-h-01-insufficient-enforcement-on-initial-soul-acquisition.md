---
tags:
  - blockchain/evm
  - lang/solidity
  - platform/openzeppelin
  - severity/high
  - vuln/reentrancy/single-function
  - impact/mev/frontrun
  - fix/use-reentrancy-guard
  - novelty/known-pattern
  - misassumption/external-call-is-safe
  - trigger/reentrancy-callback
  - sector/staking
protocol: "[[Aura]]"
auditors:
  - "[[Auditware]]"
genome:
  - "[[single-function]]"
  - "[[frontrun]]"
  - "[[use-reentrancy-guard]]"
  - "[[known-pattern]]"
  - "[[access-roles]]"
  - "[[frontrun-exposure]]"
  - "[[reentrancy-guard]]"
---
# **AW-H-01: Insufficient Enforcement on Initial Soul Acquisition**

**Severity:** *High*								**Status:** *Unmitigated*

**Locations:**

* [https://github.com/Auditware/AuraSoulsV1Foundry/blob/main/src/AuraSoulsV1.sol\#L112](https://github.com/Auditware/AuraSoulsV1Foundry/blob/main/src/AuraSoulsV1.sol#L112)

**Description:**

The **buySouls** function lacks sufficient access control to ensure that only the intended soul subject can purchase the first soul. This creates an opportunity for malicious actors to front-run the transaction and claim the first soul for themselves, bypassing the intended exclusivity.

   function buySouls(address soulsSubject, uint256 amount)  
       public  
       payable  
       nonReentrant  
   {  
       uint256 price \= getPrice(soulsSupply\[soulsSubject\], amount);  
       uint256 totalPrice \= applyFees(price, true);  
       require(msg.value \== totalPrice, "Incorrect payment amount");

       // Update state  
       soulsBalance\[soulsSubject\]\[msg.sender\] \+= amount;  
       soulsSupply\[soulsSubject\] \+= amount;  
       creatorEarnings\[soulsSubject\] \+= (price \* subjectFeePercent) / 1 ether;

In order to abuse this issue, a potential threat actor might follow these steps:

* The attacker monitors the blockchain for transactions or events indicating the potential initialization of a soul subject.  
* The attacker sends a transaction to the **buySouls** function with the required **soulsSubject** and amount (likely 1\) to claim the free soul before the rightful owner does.  
* This exploit denies the soul subject their intended first soul and potentially **disrupts further interactions or creates financial opportunities for resale.**

The absence of a mechanism to restrict initial purchases to the soul subject allows unauthorized users to exploit this function.

**Recommendation:**

* Implement an access control check to ensure that only the **soulsSubject** can purchase the first soul. For example:  
  * **require(msg.sender \== soulsSubject, “Only the soul subject can buy the first soul”);**

# **AW-M-01: Lack of Fee Destination Update Functionality** {#aw-m-01:-lack-of-fee-destination-update-functionality}

**Severity:** *Medium*							**Status:** *Unmitigated*

**Locations:**

* [https://github.com/Auditware/AuraSoulsV1Foundry/blob/main/src/AuraSoulsV1.sol\#L41](https://github.com/Auditware/AuraSoulsV1Foundry/blob/main/src/AuraSoulsV1.sol#L41)  
* [https://github.com/Auditware/AuraSoulsV1Foundry/blob/main/src/AuraSoulsV1.sol\#L42](https://github.com/Auditware/AuraSoulsV1Foundry/blob/main/src/AuraSoulsV1.sol#L42) 

**Description:**

During the assessment we discovered that the contract lacks functionality to allow the owner to update the protocolFeeDestination and lpBucketFeeDestination addresses after initialization.  
   constructor(  
       address \_owner,  
       address \_protocolFeeDestination,  
       address \_lpBucketFeeDestination  
   ) Ownable(\_owner) ReentrancyGuard() {  
       protocolFeeDestination \= \_protocolFeeDestination;  
       lpBucketFeeDestination \= \_lpBucketFeeDestination;  
   }

If either of these addresses becomes compromised or inaccessible, the contract's fee mechanism may be exploited or rendered ineffective, leading to financial loss or an operational bottleneck.

**Recommendation:**

* Add onlyOwner functions to update the **protocolFeeDestination** and **lpBucketFeeDestination** addresses. [For further information](https://docs.openzeppelin.com/contracts/2.x/access-control).

# **AW-M-02: Insufficient Enforcement on Final Soul Sale** {#aw-m-02:-insufficient-enforcement-on-final-soul-sale}

**Severity:** *Medium*							**Status:** *Unmitigated*

**Locations:**

* [https://github.com/Auditware/AuraSoulsV1Foundry/blob/main/src/AuraSoulsV1.sol\#L147](https://github.com/Auditware/AuraSoulsV1Foundry/blob/main/src/AuraSoulsV1.sol#L147)


**Description:**

During the assessment we discovered that a subject's **soulSupply** can be reduced back to 0, after their souls are put on the market.

When a soul subject (creator) buys their own, first, free soul they put their souls on the open market. The decision for a subject (creator) to sell their souls is irreversible, and sale of their souls should never be refused in the future.
