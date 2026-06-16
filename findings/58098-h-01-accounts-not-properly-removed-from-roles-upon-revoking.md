---
tags:
  - severity/high
  - has/github
  - has/poc
  - lang/solidity
  - sector/bridge
protocol: "[[Astrolab]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Astrolab-security-review.md"
genome:
  - "[[access-roles]]"
  - "[[access-control/broken-logic]]"
  - "[[privilege-escalation/role-bypass]]"
  - "[[known-pattern]]"
  - "[[single-tx]]"
  - "[[redesign-logic]]"
  - "[[blast-radius/single-user]]"
---
# [H-01] Accounts not properly removed from roles upon revoking

- id: 58098
- impact: HIGH
- protocol: Astrolab
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Astrolab-security-review.md

## Summary


This bug report discusses an issue where accounts that are removed from a role still retain access to the role's privileges, which poses a significant security risk. This occurs consistently every time the `revokeRole` function is called. The report identifies the root cause as an error in the `remove` function in the `AsSequentialSet.sol` library, which does not reset the `index` of the removed account. The report includes a proof of concept file and recommends modifying the `remove` function to reset the `index` of the removed account. 

## Details

## Severity

**Impact:** High - Accounts that are removed from a role, particularly critical roles like the default admin, retain access to the role's privileges. This poses significant security risks.

**Likelihood:** Medium - The issue occurs consistently every time the `revokeRole` function is called.

## Description

When an account is revoked from a role, `_revokeRole` function removes account from the members set.

        function _revokeRole(bytes32 role, address account) internal virtual {
            if (hasRole(role, account)) {
                _roles[role].members.remove(account.toBytes32());
                emit RoleRevoked(role, account, msg.sender);
            }
        }

In the `AsSequentialSet.sol` library, roles are stored in the `Set` struct, which contains an array `data` and a mapping `index` from bytes32 to uint32.

        struct Set {
            bytes32[] data;
            mapping(bytes32 => uint32) index;
        }

The `remove` function in the library is supposed to handle the removal of elements but calls `removeAt` which only removes the account from the `Set.data` array and does not reset the `Set.index`.

        function remove(Set storage q, bytes32 o) internal {
            uint32 i = q.index[o];
            require(i > 0, "Element not found");
            removeAt(q, i - 1);
        }

        function removeAt(Set storage q, uint256 i) internal {
            require(i < q.data.length, "Index out of bounds");
            if (i < q.data.length - 1) {
                delete q.data[i];
                q.data[i] = q.data[q.data.length - 1];
            }
            q.data.pop();
        }

Therefore, when the hasRole function checks if a user has a role by using the `has` function.

        function hasRole(bytes32 role, address account) public view virtual returns (bool) {
            return _roles[role].members.has(account.toBytes32());
        }

And the `has` function only checks the index of that account, and the index still exists. It means after the user is removed from the role, it still has the role.

        function has(Set storage q, bytes32 o) internal view returns (bool) {
            return q.index[o] > 0 && q.index[o] <= q.data.length;
        }

## POC

Put the file in test/POC.t.sol

https://gist.github.com/thangtranth/685dd8fa7faae141cdd2b1d0061b16f5

## Recommendations

The `remove` function in `AsSequentialSet.sol` should be modified to reset the `index` of the removed account

```diff
    function remove(Set storage q, bytes32 o) internal {
        uint32 i = q.index[o];
+       q.index[o] = 0;
        require(i > 0, "Element not found");
        removeAt(q, i - 1);
    }
```
