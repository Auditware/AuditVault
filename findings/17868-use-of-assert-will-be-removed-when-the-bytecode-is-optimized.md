---
tags:
  - lang/solidity
  - platform/trailofbits
  - has/github
  - has/poc
  - severity/high
  - sector/staking
protocol: "[[ETH2 Deposit CLI]]"
auditors:
  - "[[Jim Miller]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/ETH2DepositCLI.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[access-roles]]"
---
# Use of assert will be removed when the bytecode is optimized

- id: 17868
- impact: HIGH
- protocol: [[ETH2 Deposit CLI]]
- reporter: Jim Miller (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/ETH2DepositCLI.pdf

## Summary


This bug report is about an issue in the "eth2deposit/deposit.py" tool which uses the assert statement to ensure that the input for the tool is correct. However, when the bytecode is compiled with optimizations enabled, this code will be removed. This means that important verifications are not being performed and the tool will fail to run in the optimized mode. 

The short-term recommendation is to replace the use of assertion with proper input validation and not include assertions with side effects. This will enable the tool to run correctly even if the bytecode is optimized. 

The long-term recommendation is to review every feature of the Python language used in case it demonstrates different behavior when the bytecode is optimized. This will help mitigate the risk of the tool running incorrectly if the bytecode is optimized.

## Details

## Access Controls

**Type:** Access Controls  
**Target:** eth2deposit/deposit.py  

**Difficulty:** High  

## Description

The deposit tool uses `assert` to make sure the input for the tool is correct; however, such code will be removed when the bytecode is compiled with optimizations enabled. The deposit tool contains several places where important verifications are performed using the `assert` statement:

```python
@click.password_option(prompt='Type the password that secures your validator keystore(s)')
def main(num_validators: int, mnemonic_language: str, folder: str, chain: str, password: str) -> None:
    ...
    click.echo('Saving your keystore(s).')
    keystore_filefolders = credentials.export_keystores(password=password, folder=folder)
    click.echo('Creating your deposit(s).')
    deposits_file = credentials.export_deposit_data_json(folder=folder)
    click.echo('Verifying your keystore(s).')
    assert credentials.verify_keystores(keystore_filefolders=keystore_filefolders, password=password)
    click.echo('Verifying your deposit(s).')
    assert verify_deposit_data_json(deposits_file)
    click.echo('\nSuccess!\nYour keys can be found at: %s' % folder)
    click.pause('\n\nPress any key.')
```
*Figure 5.1: Part of the main function of the deposit tool.*

However, these checks will be removed if the bytecode is optimized using the `-O` flag, as indicated in the Python documentation:

```
-O       Remove assert statements and any code conditional on the value of
__debug__; augment the filename for compiled (bytecode) files by adding .opt-1 before
the .pyc extension.
```
*Figure 5.2: Part of a Python3 documentation.*

It is also worth mentioning that the tool will fail to run in the optimized mode because the asserts removed in the `path_to_nodes` function contain a side effect.

## Exploit Scenario

Alice compiles the deposit tool with optimizations enabled. Later, she uses the tool, but the lack of validation produces invalid results without any visible fail.

## Recommendation

**Short term:** Replace the use of assertion for proper input validation and do not include assertions with side effects. This will enable the tool to run correctly even if the bytecode is optimized.

**Long term:** Review every feature of the Python language you use in case it demonstrates different behavior when the bytecode is optimized. This will mitigate the risk of the tool running incorrectly if the bytecode is optimized.
