---
tags:
  - lang/rust
  - platform/pashov
  - severity/high
  - sector/token
protocol: "[[Hydration]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[unbounded-loop]]"
  - "[[temporary]]"
  - "[[extcall-return-validation]]"
---
[H-01]
TransferFrom is incorrectly treated as
a view function
High
Resolved
[M-01]
Unbounded storage iteration in EVM
address registration migration
Medium
Acknowledged
[M-02]
Failure to verify ERC20 function
return values in handle_result()
Medium
Resolved
[M-03]
Unbounded memory growth via EVM
Error message allocations
Medium
Acknowledged
[L-01]
EIP-2 signature malleability in Permit
validation
Low
Acknowledged
[L-02]
Missing logging in runtime upgrade
implementation
Low
Acknowledged
[L-03]
EVM exit status misclassification in
handle_result()
Low
Acknowledged
[L-04]
Oversized EVM error messages due
to full value encoding
Low
Acknowledged
[L-05]
Unchecked message size in call()
Low
Acknowledged
6

8. Findings
8.1. High Findings
[H-01] TransferFrom is incorrectly treated as
a view function
Severity
Impact: High
Likelihood: Medium
Description
In the execute  function of the MultiCurrencyPrecompile  module, the
check_function_modifier  is intended to ensure that function calls are
compatible with the execution context, particularly regarding whether they are
payable or non-payable functions. However, the Function::TransferFrom  case
is missing from the match statement:
handle.check_function_modifier(match selector {
    Function::Transfer => FunctionModifier::NonPayable,
    // Function::TransferFrom is not included here
    _ => FunctionModifier::View,
})?;
As a result, TransferFrom  defaults to FunctionModifier::View , which is
incorrect because TransferFrom  is a state-changing function that should be
marked as non-payable. Treating it as a view function can lead to unexpected
errors or failures when it's invoked, as the execution environment might
restrict state changes in contexts meant for view-only operations.
Recommendations
Include Function::TransferFrom  in the check_function_modifier  match
statement and assign it FunctionModifier::NonPayable , similar to the
7

Transfer  function:
handle.check_function_modifier(match selector {
    Function::Transfer => FunctionModifier::NonPayable,
    Function::TransferFrom => FunctionModifier::NonPayable, // Add this line
    _ => FunctionModifier::View,
})?;
This adjustment ensures that TransferFrom  is correctly recognized as a state-
changing function, preventing it from being erroneously treated as a view
function and maintaining the integrity of execution contexts.
8

8.2. Medium Findings
[M-01] Unbounded storage iteration in
EVM address registration migration
Severity
Impact: Medium
Likelihood: Medium
Description
SetCodeForErc20Precompile::on_runtime_upgrade()  performs an unbounded
iteration over all assets in the registry to register their EVM addresses. This
approach poses several risks:
Block Space Exhaustion: with a large number of assets (>1000), the
migration could exceed block weight limits, causing the upgrade to fail.
Network Disruption: A failed upgrade due to exceeded block limits
would require network coordination to resolve, potentially leading to
downtime.
