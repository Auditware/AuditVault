---
tags:
  - blockchain/evm
  - lang/solidity
  - sector/dex
  - sector/governance
  - sector/multisig
  - sector/token
  - platform/auditware
  - severity/high
  - vuln/pda/reinitialization
  - novelty/variant
  - misassumption/proxy-is-initialized
  - fix/initialize-proxy
protocol: "[[Apps.Fun]]"
auditors:
  - "[[Auditware]]"
genome:
  - "[[reinitialization]]"
  - "[[temporary]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
  - "[[initializer-auth]]"
  - "[[pda-derivation]]"
  - "[[timelock-timestamp-bypass]]"
---
# **AW-H-01: Poisoned Position Denial of Service** {#aw-h-01:-poisoned-position-denial-of-service}

**Severity:** High									**Status:**Unmitigated

**Locations:**

* [**contracts/evm/src/FeeHolder.sol\#L174-L178**](https://github.com/numbergroup/app.fun/blob/535d2c84513b869a1964d8fca6d1cfce0b658042/contracts/evm/src/FeeHolder.sol#L174-L178)

**Description:**

The \`claimLPFees()\` function loops through all positions for a token and attempts to claim fees from each. If \`\_claimLPFees()\` reverts for any position, the entire function reverts, blocking fee claims for all positions of that token.

A poisoned position can be created through several scenarios:

\* Token with malicious transfer logic that reverts    
\* Uniswap V4 position that's been closed or modified externally    
\* Token that doesn't implement ERC20 correctly    
\* Position that requires special handling that fails

This creates a denial-of-service attack vector where one bad position can prevent all creators from claiming fees from valid positions for that token.

**Recommendation:**

* Add error handling in the loop to continue processing other positions even if one fails:

  for (uint256 i \= 0; i \< positions.length; i++) {

        uint256 positionId \= positions\[i\];

        if (positionCreator\[positionId\] \!= msg.sender) continue;

        try this.\_claimLPFees(positionId) {} catch {

            // Log error but continue

            emit FeeClaimFailed(positionId);

        }

    }

# **AW-M-01: Owner Centralization Risk** {#aw-m-01:-owner-centralization-risk}

**Severity:** Medium								**Status:**Unmitigated

**Locations:**

* [**contracts/evm/src/AppsFun.sol\#L78-L105**](https://github.com/numbergroup/app.fun/blob/535d2c84513b869a1964d8fca6d1cfce0b658042/contracts/evm/src/AppsFun.sol#L78-L105)

**Description:**

The owner has significant control over the protocol. Without timelock or multi-sig protection, the owner can:

* Change \`virtualBaseReserve\` (affects new pools)  
* Change \`graduationThreshold\`  
* Change \`feeHolder\`, \`positionManager\`, \`platformFeeAddress\`  
* Change \`owner\` itself  
* Withdraw all liquidity from any pool via \`withdrawalLiquidity()\`

While fee percentages are constants and cannot be changed, the owner can redirect platform fees to their own address, prevent graduation by setting a very high threshold, or break the system by changing critical addresses to malicious contracts.

**Recommendation:**

* Implement a transparent timelock for critical owner functions  
* Use multi-sig for owner  
* Consider making some parameters immutable after deployment  
* Document owner powers clearly to users

# **AW-M-02: Curve Re-initialization** {#aw-m-02:-curve-re-initialization}

**Severity:** Medium								**Status:**Unmitigated

**Locations:**

* [**contracts/evm/src/Curve.sol\#L56-L69**](https://github.com/numbergroup/app.fun/blob/535d2c84513b869a1964d8fca6d1cfce0b658042/contracts/evm/src/Curve.sol#L56-L69)

**Description:**

The \`Curve.initialize()\` function can be called multiple times because there's no initialization guard. The factory (AppsFun owner) can reset \`token0\`, \`token1\`, \`virtualReserve0\`, and \`virtualReserve1\` at any time.

While the creator mapping in \`getPair\[token\]\` cannot be changed, reinitializing a curve could reset virtual reserves, affecting pricing calculations for existing pools. The owner could deploy a contract that calls \`Curve.initialize()\` with new parameters, potentially manipulating pool behavior.

**Recommendation:**

* Add an initialization guard to prevent re-initialization:


    bool private initialized;

    function initialize(...) external {

        require(msg.sender \== factory, "AppsFun: FORBIDDEN");

        require(\!initialized, "AppsFun: ALREADY\_INITIALIZED");

        initialized \= true;

        // ... rest

    }
