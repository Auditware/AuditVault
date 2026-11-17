---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/stack-overflow
  - env/web
substate: "resolved"
weakness: "Stack Overflow"
enriched: true
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
