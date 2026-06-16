---
tags:
  - lang/solidity
  - sector/governance
  - sector/lending
  - sector/options
  - platform/sigmaprime
  - has/github
  - severity/high
  - vuln/reentrancy/single-function
  - impact/loss-of-funds/direct-drain
  - novelty/known-pattern
  - misassumption/external-call-is-safe
  - fix/use-reentrancy-guard
  - trigger/reentrancy-callback
protocol: "[[Lyra Finance]]"
auditors:
  - "[[Sigma Prime]]"
report: "https://github.com/sigp/public-audits/blob/master/lyra-finance/review.pdf"
genome:
  - "[[single-function]]"
  - "[[direct-drain]]"
  - "[[known-pattern]]"
  - "[[account-ownership]]"
  - "[[liquidation-underwater]]"
  - "[[reentrancy-guard]]"
---
# Funds can be Drained from the Protocol by Liquidating an Account During an Asset Transfer

- id: 26267
- impact: HIGH
- protocol: [[Lyra Finance]]
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/lyra-finance/review.pdf

## Summary


A bug was identified in the Lyra Protocol which allowed a single attacker to exploit a reentrancy vulnerability and liquidate an account before an asset transfer was fully resolved. The attack involved Alice setting up a transaction which granted a profit to Bob and left Alice insolvent. This could be done by issuing Bob with an expired option or by transferring out all the cash asset from an account with a significant existing option liability. The transaction included a managerData argument which called an attack contract which then started a liquidation auction on Alice. The attack contract controlled a third account, Cynthia, which liquidated Alice by calling dutchAuction.bid() for 100% of Alice’s account. As the liquidation had a stepInsolvent value of zero, the full liability of Alice’s account was transferred to Cynthia without a risk check. The attack contract then returned control flow to StandardManager, allowing Alice to pass her risk check. Bob then settled his option and withdrew all his cash profit.

To address this issue, the development team has added a check to the BaseManager._processManagerData() function call which prevents hijacking program control flow during asset transfer by non-whitelisted managers. However, this attack can still be performed by whitelisted accounts. Lyra manages whitelisted callees through their business governance processes.

## Details

Description
During an asset transfer which would leave an account insolvent, it is possible to execute a reentrancy attack and
liquidate that account before the transfer is fully resolved. This renders the insolvent account solvent and thus means
that the transfer goes through when it should not. The insolvent account(s) can be abandoned and the positive recipient
of assets can withdraw their ﬁctitious proﬁt.
In the following attack scenario, all accounts (Alice, Bob, Cynthia) are owned by a single attacker.
1.Alice sets up a transaction which grants proﬁt to Bob and leaves Alice insolvent. One way of doing this is for
Alice to issue Bob with an option which is already expired and which grants Bob signiﬁcant value, such as a put
option at a much higher price than the asset’s price at the expiry time. This can be done on an empty account
without requiring any assets to be deposited into the protocol.
However, the eﬀect could also be achieved by transferring out all of the cash asset from an account with a
signiﬁcant existing option liability.
2.This transaction includes a managerData argument which calls an attack contract. This argument can be sup-
plied to subAccounts.submitTransfer() . This function calls _submitTransfer() which transfers all assets with-
out any risk check before calling _managerHook() , which in turn calls StandardManager.handleAdjustment() to
perform the risk check. Before the risk check, on line [ 266], this function calls _processManagerData() with the
managerData which Alice submitted. This causes StandardManager to call the function acceptData() on the
attack contract.
3.The attack contract starts a liquidation auction on Alice. The attack contract calls dutchAuction.startAuction()
to start an auction to liquidate Alice. Alice is insolvent, so an insolvent auction is immediately started.
4.Cynthia bids on Alice’s liquidation auction, and fully liquidates her. The attack contract controls a third account,
which we will call Cynthia. Cynthia liquidates Alice by calling dutchAuction.bid() for 100% of Alice’s account.
As we are still within the same single transaction, the liquidation will have a stepInsolvent value of zero, and so
the full liability of Alice’s account will be transferred to Cynthia.
Critically, however, there is no risk check on Cynthia during this process. All of Alice’s liabilities have been trans-
ferred to Cynthia before Alice has been risk checked, but Cynthia does not need to pass a risk check to execute
a liquidation.
5.The attack contract returns control ﬂow to StandardManager , allowing Alice to pass her risk check. StandardManager
now performs a risk check on Alice. As Alice no longer has any assets or liabilities, the risk check quickly passes
and the attack transaction ends.
6.Bob settles his option and withdraws all his cash proﬁt. Alice is now an empty account. Cynthia is insolvent with
no positive assets, but Bob received the proﬁtable side of the option. He can now settle it and withdraw its value
in the cash asset.
Note that none of Alice, Bob or Cynthia has ever deposited any tokens into the protocol.
Page | 6
Lyra V2 Detailed Findings
Recommendations
There are two factors that enable this attack: the reentrancy vulnerability and the ability for liquidators to become
insolvent. Whilst ﬁxing either of these would prevent this particular attack, the testing team recommends that both be
ﬁxed as they are both signiﬁcant sources of potential security risk.
1.Make all the managerData external calls as the last step of any transaction, after all checks and eﬀects have
been performed. This signiﬁcantly reduces reentrancy risk.
2.Do not allow users to submit managerData which causes the protocol to call out to unknown contracts without
a reentrancy guard. Given the large number of contracts within the Lyra protocol, a standard, single contract
reentrancy guard might not oﬀer suﬃcient protection. One approach would be a system wide reentrancy ﬂag
which would prevent all calls into the protocol during transactions. Alternatively, consider a whitelist system for
the targets of managerData and carefully check the whitelisted contracts.
3.Consider risk checks after liquidation bids are executed. It is not clear that it is desirable to allow liquidators to
make themselves insolvent. As in the case above, this can be used to bypass risk checks and could lead to future
security vulnerabilities.
Resolution
The issue has been addressed in pull request #273.
The development team has added the following check to the BaseManager._processManagerData() function call, which
prevents hijacking program control ﬂow during asset transfer by non-whitelisted managers:
if (!whitelistedCallee[managerDatas[i].receiver]) revert BM_UnauthorizedCall()
Note, this attack can still be performed by whitelisted accounts. Whitelisted callees are set via onlyOwner() function
and Lyra appears to manage this function through their business governance processes.
Page | 7
Lyra V2 Detailed Findings
LYRA-02 Bids Can Be Blocked By Sending Option To Liquidator
