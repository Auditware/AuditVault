---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
substate: "informative"
weakness: "Information Disclosure"
enriched: true
date: 2021-02-08
submitted: 2020-01-08T11:29:41.917Z
bounty_usd: null
votes: 1
cve: []
program: "[[programs/curl|curl]]"
reporter: "nyymi"
source: "https://hackerone.com/reports/770190"
title: "Unexpected access to process open files via file:///proc/self/fd/n"
---
# Unexpected access to process open files via file:///proc/self/fd/n

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 1 | **Program:** curl | **Disclosed:** 2021-02-08

- Report: [https://hackerone.com/reports/770190](https://hackerone.com/reports/770190)
- CWE: Information Disclosure
- Submitted: 2020-01-08T11:29:41.917Z

## Timeline

- **Report Filed**
- **2020-01-08** @bagder: Good  thinking. I'll need to ponder on this a bit but I agree that it seems like a problem...
- **2020-01-08** @bagder: Those security considerations are documented in the separate `libcurl-security(3)` man page, found online here: https://curl.haxx.se/libcurl/security.html

But maybe they should be duplicated/emphasized/pointed to to aid users better.

(eek, I commented to a team-only comment so this reply looks rather random to you @nyymi, but never mind)
- **2020-01-08** @nyymi: Just randomly commenting on that page anyway: "By default, libcurl prohibits redirects to file:// URLs." definitely limits the impact of this vulnerability at least. So in order for the attack to work the file:// URLs need to be specifically enabled.

Also, the section about opening user specified URLs is very nice, too.
- **2020-01-08** @nyymi: Looking a bit more closely I realized that the authorization bypass as described isn't possible since the /proc/*/fd are actually softlinks. Thus authorization occurs normally when the files are open, and once the privileges are dropped the open will fail.
- **2020-01-08** @nyymi: Thinking a bit more this still is an infoleak due to /proc/self/maps (defeating ASLR) /proc/self/environ (possibly gaining privileged info from the env variables) etc. Want me to create a new issue?
- **2020-01-08** @nyymi: Another issue that actually exists:

1. as root:
mkdir -m 0700 /testdir
echo "notforyou" > /testdir/secret.txt
chmod 644 /testdir/secret.txt

2. Have setuid app that opens /testdir/secret.txt
3. Drop privileges
4. Open & output user provided URL, file:///proc/self/fd/<n> in this case

This will allow the file to be read even though direct access to /testdir/secret.txt is not possible for the user.
- **2020-01-09** @nyymi: Another issue I can think of:

If arbitrary URLs are possible to be given it's possible to enumerate all pids in the system and read file:///proc/$pid/cmdline files for sensitive information given on command line (for example passwords when using mysql command line tool with --password -- bad habit for sure but I've seen this being used by sloppy admins). Note that even processes ran by other user (such as root) have the /proc/$pid/cmdline visible.

If the user is local this of course would be no different than taking a process listing, but this is an issue if some daemon or web app processes URLs provided by remote attacker and returns the result(s).

The more I think about this /proc/self/* and /proc/<number>/* might not be a good idea to allow at all. Yet, it seems a bit arbitrary to ban it outright. Not sure what would be a good way to handle this.
- **2020-01-09** @nyymi: Proposal: Ban /proc/ and /sys/ by default for file:// and add some option to enable "insecure mode".
- **2020-01-09** @nyymi: Please note that /dev/fd is softlink to /proc/self/fd, so it needs to be banned as well if /proc/ is.

Similarly /dev/core is a softlink to /proc/core but this likely isn't a problem as the file is root owned and u+r only.
- **2020-01-09** @bagder: Thanks @nyymi, I think you've proven with enough evidence that allowing `/proc` and `/sys` accesses for FILE: in a random Linux application could be a really bad idea (if you accept user-provided URLs for example).

I think the only remaining question is if this is actually a *curl* security problem or just a problem in general that people might not think about. It's not really an unexpected or surprising functionality of curl's FILE: access that it can read local files and after all that's exactly what the /proc files are: local files...
- **2020-01-09** @nyymi: Indeed. I'm more inclined to think that this is a generic issue, rather than curl one. Yet, it might still be sensible to prevent such access in curl, even though it might not be curl issue per se.  Of course if such preventive actions are taken and something depends on such access that usage would then break. It definitely isn't obvious what to do here.
- **2020-01-09** @dgustafsson: If we are to handle this in curl, and claim it fixed, then we'd have to cover all the major operating environments where curl is used and that seems like quite the maintenance headache. I would argue that expanding documentation for best practices is a better path forward.
- **2020-01-09** @kdudka: I fail to see how this is a security issue.  If you allow unprivileged users to pass arbitrary URLs to curl, they can access anything that the curl process can access.  This is completely expected in my opinion. There are curl-independent ways to avoid it: SELinux, sandbox, chroot, unshare, systemd-run, systemd-nspawn, podman, etc.  Moreover, I do not think that the file:// protocol is anyhow special in this.  One could use other protocols to bypass firewall, proxy, or VPN this way.
- **2020-01-09** @nyymi: I tend to agree with the latest.

However this raises the question why CVE-2019-15601 get special handling then? Isn't that pretty much similar case?
- **2020-01-09** @bagder: To me, the major difference lies in the fact that CVE-2019-15601 makes a remote access to the specific machine, thus no longer making it the local file access FILE: is documented and assumed to be.
- **2020-01-09** @bagder: Going back to https://curl.haxx.se/libcurl/security.html#file and the following section, "What if the user can set the URL", we already highlight in that document the risk of letting users specify the URL and by allowing FILE:.

Would explicitly mention `/proc` etc there improve the document?
- **2020-01-09** @nyymi: > Would explicitly mention /proc etc there improve the document?

Even though the document is quite thorough already, that would likely be sensible thing to do.

I think this issue doesn't warrant other actions and can be closed.
- **2020-01-09** @bagder: Thanks. We can bikeshed the exact wording over in the PR I just filed for this: https://github.com/curl/curl/pull/4802. Closing this.
- **Report Informative**
- **Agreed On Going Public**
- **Manually Disclosed**
