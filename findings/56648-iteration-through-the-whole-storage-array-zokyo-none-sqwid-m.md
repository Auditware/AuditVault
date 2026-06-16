---
tags:
  - lang/solidity
  - has/github
  - platform/zokyo
  - severity/high
  - sector/governance
protocol: "[[Sqwid]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-06-16-Sqwid.md"
genome:
  - "[[unbounded-loop]]"
  - "[[permanent]]"
  - "[[proposal-state-check]]"
---
# Iteration through the whole storage array.

- id: 56648
- impact: HIGH
- protocol: [[Sqwid]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-06-16-Sqwid.md

## Summary


The report highlights two bugs in the Governance and SqwidERC1155Wrapper contracts. The first bug is in the function _resetProposals() in the Governance contract, which can cause issues with updating the list of owners and minimum confirmation value due to excessive gas consumption during iteration. The second bug is in the function _getWrappedTokenId() in the SqwidERC1155Wrapper contract, which can prevent new tokens from being wrapped due to gas limits. 

The report recommends two solutions for the first bug: removing executed proposals from arrays or splitting the reset process into multiple transactions. For the second bug, the report suggests creating a mapping instead of using iteration to link external tokens with wrapped tokens. 

The Sqwid team has already implemented changes to address these bugs, including using mappings to track proposals and adding a limit on active proposals per owner. They have also changed the way external tokens are linked with wrapped tokens, from using an array to a mapping. 

## Details

**Description**

 Governance.sol: function _resetProposals(), lines 422, 428, 432.Iteration is performed 
through several arrays with proposals, including the executed one. In case, there are a lot 
of elements in arrays, iteration might consume more gas than allowed per transaction, 
rejecting the whole transaction. Issue is marked as high, since it might prevent protocol 
from updating list of owners and minimum confirmation value
 SqwidERC1155Wrapper.sol: function _getWrappedTokenId(), line 77.Iteration through all 
wrapped tokens. In case there are a lot of tokens wrapped, function would prevent from 
wrapping new tokens due gas limit per one transaction.
 
 **Recommendation**:
 
 Consider removing executed proposals from arrays to decrease the number of elements. 
In case, proposals should not be removed, consider to split the reset process in several 
transactions to ensure its correct execution
 Consider creating additional mapping for linking the token of external contract to 
wrapped token id instead of iteration.
 
 **Recommendation**:
 
 The Sqwid team has changed the structure of the Governance. Now the mappings are 
used to track proposals and arrays to store the active ones. Also, a limit of active 
proposals per owner has been added
 The way of linking external tokens with wrapped tokens has been changed as well, from 
using an array to a mapping
