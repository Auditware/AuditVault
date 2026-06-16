---
tags:
  - platform/halborn
  - has/github
  - lang/solidity
  - severity/high
  - sector/infra
protocol: "[[Consortium]]"
auditors:
  - "[[Halborn]]"
report: "https://www.halborn.com/audits/lombard/consortium"
genome:
  - "[[wrong-condition]]"
  - "[[wrong-state]]"
  - "[[bridge-message-validation]]"
---
# Node Allows To Notarize Reverted Transactions

- id: 52077
- impact: HIGH
- protocol: [[Consortium]]
- reporter: Halborn
- source: https://www.halborn.com/audits/lombard/consortium

## Summary


The `notarizeTransactionController` class is responsible for validating transactions and ensuring they are correctly stored on the blockchain. However, there is a bug where the system does not prevent processing of reverted transactions. This means that any user can make a consensus to process a transaction that has been reverted, even though it will not have any impact on the targeted chain. The bug can be found in the `preHandle` function of the `VerifyTransaction` class, which does not have any action to prevent processing of reverted transactions. The recommendation is to filter out these transactions and either panic or return an error to prevent processing. The Lombard team has solved this issue by adding a check to ensure that only successful transactions are processed.

## Details

##### Description

During the `notarizeTransactionController` class execution, there are several checks run in the `preHandle` function in order to validate whether a transaction is correct or not, taking into account several situations such as if the transactions have been mined, it has the enough amount of confirmations to guarantee it won’t be removed from the chain, if the transaction resulted in a revert…

Most of these checks are implemented to make sure the transaction, which is requested to be notarized, was mined and properly store in the chain.

However, although the function in charge of running all these verifications, named `VerifyTransaction`, queries the status of the transaction’s receipt in order to check whether the transaction was revert and sets accordingly the `NotarizedTransaction` object. There is no further action to prevent from processing reverted transactions, therefore, any user could be able to make the consensus to process a reverted transaction, even taking into account that this transaction won’t have any impact in the targeted chain.

  

<https://github.com/lombard-finance/consortium-node/blob/ffed9c2720d84da657d91d2288d166d7b781a8a0/shared/consensus/internal/controller/notarizetransaction.go#L56-L64>

```
tk = c.databaseService.GetThresholdKeyOrNil(uuid.MustParse(req2.ThresholdKey))
if tk == nil {
	err = fmt.Errorf("there is no threshold key with id (%s)", req2.ThresholdKey)
	return
}
tx, err = c.blockchainService.VerifyTransaction(context.TODO(), req2.ChainId, req2.TransactionHash)
if err != nil {
	return
}
```

  

<https://github.com/lombard-finance/consortium-node/blob/7658f25e5dcc600a70c75a7b1a7240da63c14968/shared/blockchain/service.go#L68-L78>

```
func (s *Service) VerifyTransaction(ctx context.Context, chainId uint64, hash []byte) (tx *types.NotarizedTransaction, err error) {
	var nm nodeManager
	if nm, err = s.nodeManager(chainId); err != nil {
		return nil, err
	}
	tx, err = nm.verifyTransaction(ctx, hash)
	if err != nil {
		return nil, errors.Wrapf(err, "failed to verify transaction for blockchain (%d)", chainId)
	}
	return tx, nil
}
```

  

<https://github.com/lombard-finance/consortium-node/blob/892060a7055ddf41d8c4628b7d236ca7b62c2bec/shared/blockchain/web3.go#L69-L103>

```
var status types.NotarizedTransactionStatus
if receipt.Status == types2.ReceiptStatusSuccessful {
	status = types.NotarizedTransactionStatus_NOTARIZED_TRANSACTION_STATUS_CONFIRMED
} else {
	status = types.NotarizedTransactionStatus_NOTARIZED_TRANSACTION_STATUS_REVERTED
}
	
// ...
// if everything is fine return tx object
result := &types.NotarizedTransaction{
	Status:            status,
	Blockchain:        nm.config.Blockchain,
	TransactionHash:   hash,
	BlockNumber:       receipt.BlockNumber.Uint64(),
	BlockHash:         receipt.BlockHash.Bytes(),
	TransactionIndex:  uint64(receipt.TransactionIndex),
	ReceiptHash:       crypto.Keccak256(rawReceiptForStorage),
	TransferredAmount: tx.Value().String(),
	ChainId:           nm.config.ChainID.Uint64(),
}
```

##### BVSS

[AO:A/AC:L/AX:L/R:N/S:U/C:N/A:C/I:C/D:C/Y:N (10.0)](/bvss?q=AO:A/AC:L/AX:L/R:N/S:U/C:N/A:C/I:C/D:C/Y:N)

##### Recommendation

It is recommended to filter which `NotarizedTransaction` object has been set with a `NotarizedTransactionStatus_NOTARIZED_TRANSACTION_STATUS_REVERTED` status, and panic or return an error in that case to prevent from processing these kinds of transactions.

### Remediation Plan

**SOLVED:** The **Lombard team** solved this issue by adding the following check:

```
if receipt.Status != ethtypes.ReceiptStatusSuccessful {
	return nil, ErrReverted
}
```

##### Remediation Hash

<https://github.com/lombard-finance/consortium-node/commit/9f4e65cb4d773f670747c177dbe1a4bcdf276fd6>
