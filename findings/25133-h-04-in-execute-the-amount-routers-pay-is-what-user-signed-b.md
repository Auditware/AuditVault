---
tags:
  - lang/solidity
  - sector/bridge
  - sector/lending
  - sector/options
  - sector/token
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - precondition/specific-token-type
  - fix/use-reentrancy-guard
protocol: "[[Connext]]"
auditors:
  - "[[Code4rena]]"
report: "https://code4rena.com/reports/2022-06-connext"
genome:
  - "[[wrong-condition]]"
  - "[[specific-token-type]]"
  - "[[use-reentrancy-guard]]"
  - "[[direct-drain]]"
  - "[[fot-slippage]]"
  - "[[reentrancy-guard]]"
---
# [H-04] In `execute()` the amount routers pay is what user signed, but in `_reconcile()` the amount routers get is what nomad sends and these two amounts are not necessary equal because of slippage in original domain

- id: 25133
- impact: HIGH
- protocol: [[Connext]]
- reporter: Code4rena (Code4rena)
- source: https://code4rena.com/reports/2022-06-connext

## Summary


This bug report is about a potential issue with the BridgeFacet.sol contract code, which is part of the Connext protocol. The code is responsible for transferring funds between different domains. The issue is that it is possible for routers to lose funds if some slippage happens in the swap of the asset from the user's domain to the local asset.

The code for the `xcall` function includes a swap of the asset from the user's domain to the local asset, which can cause a difference between the amount the user signed and the amount that is sent to the contract. This difference can be caused by deflationary tokens or slippage in the swap.

The code for the `_reconcile` function uses the amount in the message to calculate what the router should receive. The code for the `_handleExecuteLiquidity` function, which is used in the `execute` function, also uses the amount defined in the `ExecuteArgs` to determine how much the router should pay.

This issue can be mitigated by updating the spending amount to account for deflationary tokens and swap slippage.

## Details

_Submitted by unforgiven_

[BridgeFacet.sol#L526-L616](https://github.com/code-423n4/2022-06-connext/blob/b4532655071566b33c41eac46e75be29b4a381ed/contracts/contracts/core/connext/facets/BridgeFacet.sol#L526-L616)<br>
[BridgeFacet.sol#L753-L803](https://github.com/code-423n4/2022-06-connext/blob/b4532655071566b33c41eac46e75be29b4a381ed/contracts/contracts/core/connext/facets/BridgeFacet.sol#L753-L803)<br>
[BridgeFacet.sol#L398-L428](https://github.com/code-423n4/2022-06-connext/blob/b4532655071566b33c41eac46e75be29b4a381ed/contracts/contracts/core/connext/facets/BridgeFacet.sol#L398-L428)<br>
[BridgeFacet.sol#L345-L351](https://github.com/code-423n4/2022-06-connext/blob/b4532655071566b33c41eac46e75be29b4a381ed/contracts/contracts/core/connext/facets/BridgeFacet.sol#L345-L351)<br>

Routers pay for transaction in destination domain then nomad messages come and routers get paid again. but the amount routers pay in `execute()` are what transaction sender signed and the amount routers receive is what nomad sends and handles in `_reconcile()` but this two amount can be different because of slippage and swap that happens in `xcall()` because the amount sent in nomad message is the result of `swapToLocalAssetIfNeeded()`.<br>
So it's possible for routers to lose funds if some slippage happens in that swap.

### Proof of Concept

This is `xcall()` code:

      function xcall(XCallArgs calldata _args) external payable whenNotPaused nonReentrant returns (bytes32) {
        // Sanity checks.
        {
          // Correct origin domain.
          if (_args.params.originDomain != s.domain) {
            revert BridgeFacet__xcall_wrongDomain();
          }

          // Recipient is defined.
          if (_args.params.to == address(0)) {
            revert BridgeFacet__xcall_emptyTo();
          }

          // If callback address is not set, callback fee should be 0.
          if (_args.params.callback == address(0) && _args.params.callbackFee > 0) {
            revert BridgeFacet__xcall_nonZeroCallbackFeeForCallback();
          }

          // Callback is contract if supplied.
          if (_args.params.callback != address(0) && !Address.isContract(_args.params.callback)) {
            revert BridgeFacet__xcall_callbackNotAContract();
          }
        }

        bytes32 transferId;
        bytes memory message;
        XCalledEventArgs memory eventArgs;
        {
          // Get the remote BridgeRouter address; revert if not found.
          bytes32 remote = _mustHaveRemote(_args.params.destinationDomain);

          // Get the true transacting asset ID (using wrapper instead of native, if applicable).
          address transactingAssetId = _args.transactingAssetId == address(0)
            ? address(s.wrapper)
            : _args.transactingAssetId;

          // Check that the asset is supported -- can be either adopted or local.
          ConnextMessage.TokenId memory canonical = s.adoptedToCanonical[transactingAssetId];
          if (canonical.id == bytes32(0)) {
            // Here, the asset is *not* the adopted asset. The only other valid option
            // is for this asset to be the local asset (i.e. transferring madEth on optimism)
            // NOTE: it *cannot* be the canonical asset. the canonical asset is only used on
            // the canonical domain, where it is *also* the adopted asset.
            if (s.tokenRegistry.isLocalOrigin(transactingAssetId)) {
              // revert, using a token of local origin that is not registered as adopted
              revert BridgeFacet__xcall_notSupportedAsset();
            }

            (uint32 canonicalDomain, bytes32 canonicalId) = s.tokenRegistry.getTokenId(transactingAssetId);
            canonical = ConnextMessage.TokenId(canonicalDomain, canonicalId);
          }

          transferId = _getTransferId(_args, canonical);
          s.nonce += 1;

          // Store the relayer fee
          s.relayerFees[transferId] = _args.params.relayerFee;

          // Transfer funds of transacting asset to the contract from the user.
          // NOTE: Will wrap any native asset transferred to wrapped-native automatically.
          (, uint256 amount) = AssetLogic.handleIncomingAsset(
            _args.transactingAssetId,
            _args.amount,
            _args.params.relayerFee + _args.params.callbackFee
          );

          // Swap to the local asset from adopted if applicable.
          (uint256 bridgedAmt, address bridged) = AssetLogic.swapToLocalAssetIfNeeded(
            canonical,
            transactingAssetId,
            amount,
            _args.params.slippageTol
          );

          // Transfer callback fee to PromiseRouter if set
          if (_args.params.callbackFee != 0) {
            s.promiseRouter.initCallbackFee{value: _args.params.callbackFee}(transferId);
          }

          message = _formatMessage(_args, bridged, transferId, bridgedAmt);
          s.xAppConnectionManager.home().dispatch(_args.params.destinationDomain, remote, message);

          // Format arguments for XCalled event that will be emitted below.
          eventArgs = XCalledEventArgs({
            transactingAssetId: transactingAssetId,
            amount: amount,
            bridgedAmt: bridgedAmt,
            bridged: bridged
          });
        }

        // emit event
        emit XCalled(transferId, _args, eventArgs, s.nonce - 1, message, msg.sender);

        return transferId;
      }

As you can see it swaps what user sent to `LoccalAsset` which the amount is `bridgedAmt` and then send value of `bridgedAmt` to nomad bridge `message = _formatMessage(_args, bridged, transferId, bridgedAmt)`.<br>
But the amount user signed in `_args.amount` is different and that what user sends to contract.<br>
The reasons that `bridgedAmt` could be different than `_args.amount` is:<br>
1- deflationary tokens in transferring from user.<br>
2- slippage in swap to local token.<br>
This is `_reconcile()` code:

      function _reconcile(uint32 _origin, bytes memory _message) internal {
        // Parse tokenId and action from the message.
        bytes29 msg_ = _message.ref(0).mustBeMessage();
        bytes29 tokenId = msg_.tokenId();
        bytes29 action = msg_.action();

        // Assert that the action is valid.
        if (!action.isTransfer()) {
          revert BridgeFacet__reconcile_invalidAction();
        }

        // Load the transferId.
        bytes32 transferId = action.transferId();

        // Ensure the transaction has not already been handled (i.e. previously reconciled).
        if (s.reconciledTransfers[transferId]) {
          revert BridgeFacet__reconcile_alreadyReconciled();
        }

        // NOTE: `tokenId` and `amount` must be in plaintext in the message so funds can *only* be minted by
        // `handle`. They are both used in the generation of the `transferId` so routers must provide them
        // correctly to be reimbursed.

        // Get the appropriate local token contract for the given tokenId on this chain.
        // NOTE: If the token is of remote origin and there is no existing representation token contract,
        // the TokenRegistry will deploy a new one.
        address token = s.tokenRegistry.ensureLocalToken(tokenId.domain(), tokenId.id());

        // Load amount once.
        uint256 amount = action.amnt();

        // Mint tokens if the asset is of remote origin (i.e. is representational).
        // NOTE: If the asset IS of local origin (meaning it's canonical), then the tokens will already be held
        // in escrow in this contract (from previous `xcall`s).
        if (!s.tokenRegistry.isLocalOrigin(token)) {
          IBridgeToken(token).mint(address(this), amount);

          // Update the recorded `detailsHash` for the token (name, symbol, decimals).
          // TODO: do we need to keep this
          bytes32 details = action.detailsHash();
          IBridgeToken(token).setDetailsHash(details);
        }

        // Mark the transfer as reconciled.
        s.reconciledTransfers[transferId] = true;

        // If the transfer was executed using fast-liquidity provided by routers, then this value would be set
        // to the participating routers.
        // NOTE: If the transfer was not executed using fast-liquidity, then the funds will be reserved for
        // execution (i.e. funds will be delivered to the transfer's recipient in a subsequent `execute` call).
        address[] memory routers = s.routedTransfers[transferId];

        // If fast transfer was made using portal liquidity, we need to repay
        // FIXME: routers can repay any-amount out-of-band using the `repayAavePortal` method
        // or by interacting with the aave contracts directly
        uint256 portalTransferAmount = s.portalDebt[transferId] + s.portalFeeDebt[transferId];

        uint256 toDistribute = amount;
        uint256 pathLen = routers.length;
        if (portalTransferAmount != 0) {
          // ensure a router took on credit risk
          if (pathLen != 1) revert BridgeFacet__reconcile_noPortalRouter();
          toDistribute = _reconcileProcessPortal(amount, token, routers[0], transferId);
        }

        if (pathLen != 0) {
          // fast liquidity path
          // Credit each router that provided liquidity their due 'share' of the asset.
          uint256 routerAmt = toDistribute / pathLen;
          for (uint256 i; i < pathLen; ) {
            s.routerBalances[routers[i]][token] += routerAmt;
            unchecked {
              i++;
            }
          }
        }

        emit Reconciled(transferId, _origin, routers, token, amount, msg.sender);
      }

As you can see it uses amount in message to calculate what router should receive.<br>
This is `_handleExecuteLiquidity()` code which is used in `execute()`:

      function _handleExecuteLiquidity(
        bytes32 _transferId,
        bool _isFast,
        ExecuteArgs calldata _args
      ) private returns (uint256, address) {
        uint256 toSwap = _args.amount;

        // If this is a fast liquidity path, we should handle deducting from applicable routers' liquidity.
        // If this is a slow liquidity path, the transfer must have been reconciled (if we've reached this point),
        // and the funds would have been custodied in this contract. The exact custodied amount is untracked in state
        // (since the amount is hashed in the transfer ID itself) - thus, no updates are required.
        if (_isFast) {
          uint256 pathLen = _args.routers.length;

          // Calculate amount that routers will provide with the fast-liquidity fee deducted.
          toSwap = _getFastTransferAmount(_args.amount, s.LIQUIDITY_FEE_NUMERATOR, s.LIQUIDITY_FEE_DENOMINATOR);

          // Save the addressess of all routers providing liquidity for this transfer.
          s.routedTransfers[_transferId] = _args.routers;

          // If router does not have enough liquidity, try to use Aave Portals.
          // only one router should be responsible for taking on this credit risk, and it should only
          // deal with transfers expecting adopted assets (to avoid introducing runtime slippage)
          if (
            !_args.params.receiveLocal &&
            pathLen == 1 &&
            s.routerBalances[_args.routers[0]][_args.local] < toSwap &&
            s.aavePool != address(0)
          ) {
            if (!s.routerPermissionInfo.approvedForPortalRouters[_args.routers[0]])
              revert BridgeFacet__execute_notApprovedForPortals();

            // Portal provides the adopted asset so we early return here
            return _executePortalTransfer(_transferId, toSwap, _args.local, _args.routers[0]);
          } else {
            // for each router, assert they are approved, and deduct liquidity
            uint256 routerAmount = toSwap / pathLen;
            for (uint256 i; i < pathLen; ) {
              // decrement routers liquidity
              s.routerBalances[_args.routers[i]][_args.local] -= routerAmount;

              unchecked {
                i++;
              }
            }
          }
        }

As you can see it uses the amount defined in `ExecuteArgs` to see how much routers should pay.

Because of these two issues (deflationary tokens and swap slippage) attacker could fool protocol to spend more than what he transferred to protocol. This could be seen as two bugs.

### Tools Used

VIM

### Recommended Mitigation Steps

Update spending amount based on  (deflationary tokens and swap slippage).

**[LayneHaber (Connext) disputed and commented](https://github.com/code-423n4/2022-06-connext-findings/issues/222#issuecomment-1166334184):**
 > I think there is a misunderstanding here -- the user takes on the slippage risk both into and out of the local assets, and the router has consistent returns on what was bridged.
> 
> On `xcall`, the user swaps the amount put in for the local asset. This incurs some slippage, and only the amount of the local asset is bridged directly. It is the bridged amount that the router should supply liquidity for, and take fees on. Once the router supplies liquidity in `execute` (bridged amount minus the fees), then it is swapped for the local asset and sent to the user. The user may get some different amount here, but it is the user who is impacted by this slippage. On handle, the router is credited the bridged amount.
> 
> However, there was a separate bug where the `transferId` was generated with the wrong `amount` on execute, so that could be where the confusion is coming from.

**[0xleastwood (judge) commented](https://github.com/code-423n4/2022-06-connext-findings/issues/222#issuecomment-1214224150):**
 > I actually agree with the warden here, it seems that they're right about the issue but they just failed to mention the main reason why its an issue is because `transferId` is calculated using `_args.amount` which does not necessarily equal `bridgedAmt` due to slippage. Therefore, routers may end up fronting too much liquidity and receive considerably less when the bridge transfer is eventually reconciled. This seems rather severe as the user will receive the full transfer amount without slippage. This could be abused to drain routers on low liquidity tokens.

**[LayneHaber (Connext) commented](https://github.com/code-423n4/2022-06-connext-findings/issues/222#issuecomment-1218136485):**
 > Right -- I agree that the problems outlined here would be the true consequences for a mismatched `transferId`. If the question is to take the action outlined [here](https://github.com/code-423n4/2022-06-connext-findings/issues/227#issuecomment-1214224706) -- specifically to keep this open and downgrade #227 as a QA -- that would work with me.

**[LayneHaber (Connext) resolved](https://github.com/code-423n4/2022-06-connext-findings/issues/222):**
 > [connext/nxtp@f41a156](https://github.com/connext/nxtp/commit/f41a156b55a01837c8f57a77e52781f74406e1cd)



***
