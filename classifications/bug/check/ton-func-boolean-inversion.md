---
tags:
  - check/ton-func-boolean-inversion
  - lang/func
  - blockchain/ton
---
Are FunC boolean variables consistently -1/0 (true/false)? Using 1/0 and inverting with ~ produces ~1 == -2, which is truthy - silently inverting logic.
