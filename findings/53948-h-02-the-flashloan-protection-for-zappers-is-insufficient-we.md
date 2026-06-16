---
tags:
  - lang/solidity
  - sector/cdp
  - sector/dex
  - sector/governance
  - sector/lending
  - platform/recon-audits
  - has/github
  - severity/high
  - vuln/logic/fee-calculation
  - impact/loss-of-funds/direct-drain
  - trigger/flash-loan
  - precondition/flash-loan-available
  - fix/use-reentrancy-guard
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Bold]]"
auditors:
  - "[[Alex The Entreprenerd]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Recon Audits/2025-03-23-bold-report.md"
genome:
  - "[[fee-calculation]]"
  - "[[direct-drain]]"
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[use-reentrancy-guard]]"
  - "[[variant]]"
  - "[[fee-accounting]]"
  - "[[flashloan-callback-auth]]"
  - "[[reentrancy-guard]]"
---
# [H-02] The flashloan protection for Zappers is insufficient - We can operate on Troves we don't own

- id: 53948
- impact: HIGH
- protocol: [[Bold]] Report
- reporter: Alex The Entreprenerd (Recon Audits)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Recon Audits/2025-03-23-bold-report.md

## Summary


This bug report highlights a potential issue with the code for the Balancer Vault Flashloan. The code allows anyone to call it and set the Balancer Flashloan as the recipient, which can be exploited to manipulate user positions and potentially steal funds. The report suggests enforcing that all calls are started by trusted contracts to mitigate this issue.

## Details

**Impact**
The code for the Balancer Vault Flashloan is as follows:

https://etherscan.io/address/0xba12222222228d8ba445958a75a0704d566bf2c8#code

```solidity
   function flashLoan(
        IFlashLoanRecipient recipient,
        IERC20[] memory tokens,
        uint256[] memory amounts,
        bytes memory userData
    ) external override nonReentrant whenNotPaused {
        InputHelpers.ensureInputLengthMatch(tokens.length, amounts.length);

        uint256[] memory feeAmounts = new uint256[](tokens.length);
        uint256[] memory preLoanBalances = new uint256[](tokens.length);

        // Used to ensure `tokens` is sorted in ascending order, which ensures token uniqueness.
        IERC20 previousToken = IERC20(0);

        for (uint256 i = 0; i < tokens.length; ++i) {
            IERC20 token = tokens[i];
            uint256 amount = amounts[i];

            _require(token > previousToken, token == IERC20(0) ? Errors.ZERO_TOKEN : Errors.UNSORTED_TOKENS);
            previousToken = token;

            preLoanBalances[i] = token.balanceOf(address(this));
            feeAmounts[i] = _calculateFlashLoanFeeAmount(amount);

            _require(preLoanBalances[i] >= amount, Errors.INSUFFICIENT_FLASH_LOAN_BALANCE);
            token.safeTransfer(address(recipient), amount);
        }

        recipient.receiveFlashLoan(tokens, amounts, feeAmounts, userData);
```

Meaning anyone can call this and set the `BalancerFlashloan` as the recipient

This only check done in the Zappers looks as follows:

https://github.com/liquity/bold/blob/57c2f13fe78f914cab3d9736f73b4e0ffc58e022/contracts/src/Zappers/LeverageWETHZapper.sol#L165-L168

```solidity
    function receiveFlashLoanOnLeverDownTrove(LeverDownTroveParams calldata _params, uint256 _effectiveFlashLoanAmount)
        external
    {
        require(msg.sender == address(flashLoanProvider), "LZ: Caller not FlashLoan provider");
```

Which means that any arbitrary flashloan can be made to trigger the callbacks specified in `receiveFlashLoan`

This opens up to the following:

**We can do the FL on behalf of other people and cause them to unwind or take on more debt**

Since balancer removed the flashloan fee


This can be abused to alter a user position:
- Force them to take leverage or to unwind their position

And can also be used to steal funds from the user by:
- Imbalancing swap pool
- Having user alter their position and take a loss / more debt than intended

The loss will be taken by the victim in the form of a "imbalanced" leverage

Whereas the attacker will skim the sandwhiched funds to themselves



**Proof Of Code**

- Call `flashLoanProvider.makeFlashLoan` with malicious inputs
OR
- Call Vault.flashloan with malicious inputs

<img width="886" alt="Screenshot 2024-09-03 at 15 23 41" src="https://github.com/user-attachments/assets/0cc97368-bd41-427c-8b85-2b50ba9bb151">

<img width="1270" alt="Screenshot 2024-09-03 at 15 23 52" src="https://github.com/user-attachments/assets/0e940408-2fde-4ece-91d7-cb8d720b0850">

<img width="1178" alt="Screenshot 2024-09-03 at 15 24 01" src="https://github.com/user-attachments/assets/7ac7a8e0-3e93-4d86-94f5-19099a9f7f95">


<img width="1334" alt="Screenshot 2024-09-03 at 15 24 10" src="https://github.com/user-attachments/assets/824207da-8c9c-400b-a0f9-8bc1b3ae6595">


**Mitigation**

Enforce that all calls are started by the Zaps (trusted contracts)

You could generate a transient id for the operation, and verify that the only accepted callback is the trusted one

**Pseudocode**

```solidity
    function receiveFlashLoanOnOpenLeveragedTrove(
        OpenLeveragedTroveParams calldata _params,
        uint256 _effectiveFlashLoanAmount
    ) external {
        require(msg.sender == address(flashLoanProvider), "LZ: Caller not FlashLoan provider");
        require(decodeParams(_params) == currentOperationId, "callback was started by this contract");
        currentOperationId = UNSET_OPERATION_ID; // bytes32(0)
```

---

## Artifacts

- Raw capture: /Users/user/Desktop/crawlee-run/pages_capture.har
- Pages snapshot: /Users/user/Desktop/crawlee-run/all_findings_full.json
