---
tags:
  - blockchain/evm
  - lang/solidity
  - platform/pashov
  - severity/high
  - sector/infra
  - sector/liquid-staking
  - sector/oracle
protocol: "[[Lido]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[missing]]"
  - "[[wrong-state]]"
  - "[[dos-resistance]]"
---
[H-01] Underconstraint on reference_slot  Allows Arbitrary
Future Slot Proofs
Severity
Impact: High
Likelihood: High
Description
The contract and circuit logic imposes only minimal constraints on the reference_slot  parameter
when submitting a new report via submitReportData() . Specifically, if reference_slot  differs from
bc_slot , the logic merely checks that the reference_slot  itself does not have a block and that all
slots between it and bc_slot  do not have blocks. Beyond that, there is no upper bound or stricter limit
on reference_slot .
1. Exploitability for Future Slots
An attacker can set bc_slot  to the last valid past slot that is known to have a block. Then, for an
arbitrarily large future reference_slot , the contract’s _verify_reference_and_bc_slot()  will
loop backward, decrementing reference_slot  until it reaches bc_slot . Because future slots do
not exist yet (and thus the beacon roots precompile will revert internally for those timestamps),

_blockExists()  will always return false  for those slots. Hence, these future slots satisfy the
condition “if reference_slot != bc_slot , then the reference slot must not have a block.”
This attack can be performed repeatedly, letting the attacker claim “valid” data for any future
reference_slot , as long as they keep bc_slot  pointed to the same past slot that actually
contains a block.
The main practical constraint is how large reference_slot  can be before the gas limit is
reached (due to the backward iteration in _verify_reference_and_bc_slot() ).
2. Behavior of _blockExists()  With Future Slots
The function _blockExists(slot)  calls
_getBeaconBlockHashForTimestamp(_slotToTimestamp(slot)) .
For a future slot (one that has not actually occurred yet), the beacon roots precompile provides
no data and reverts internally. Consequently, _getBeaconBlockHashForTimestamp()  returns
(false, 0x0) , so _blockExists(slot)  evaluates to false && (0 != 0) → false .
This makes every future slot effectively “empty,” letting _verify_reference_and_bc_slot()
pass for any future reference_slot .
3. Inability to Override Attackers’ Reports
After an attacker successfully sets a report for a particular reference_slot , the function
checks report_at_slot.reference_slot == 0  before accepting any new report for that
same slot.
Consequently, once the attacker has submitted a “valid” proof referencing a large future slot, no
one else can override or update that slot. Any subsequent attempts to submit a new report for
the same reference_slot  will fail with “Report was already accepted.”
4. Impact of Projecting a Single bc_slot onto All Future Slots
By using the same bc_slot  (from a valid past block) and inflating reference_slot  to any
future value, an attacker can project the same (outdated) state onto multiple future slots.
Because this oracle is used as a “second opinion,” valid future reports from the main oracle
might be reverted, leading to a Denial-of-Service (DoS) scenario for legitimate updates that
require a second opinion. In other words, the outdated report from the attacker could cause valid
new reports to fail verification if they conflict with the outdated report.
5. Exploitability for Previous Slots That Do Not Have Blocks
Similarly, an attacker can target older reference_slot  values that never had blocks. By using
the same bc_slot  from a past slot with a block, they can set a report for an old reference slot
that is recorded as “empty” and thus pass the check since the loop won't execute.
While outdated slots are not frequently used, and thus this scenario may be less critical than
future-slot exploitation, it remains a potential avenue for abuse or confusion if older data is ever
referenced or needed.
Recommendations

Impose an upper bound on reference_slot  to ensure it cannot reference slots beyond the current on-
chain time (or a suitably safe margin). It is also recommended to add a check that require
reference_slot  greater than bc_slot .
