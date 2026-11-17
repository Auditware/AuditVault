---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/os-command-injection
  - env/web
substate: "informative"
weakness: "OS Command Injection"
enriched: true
date: 2025-06-28
submitted: 2025-06-26T21:10:59.650Z
bounty_usd: null
votes: 12
cve: []
program: "[[programs/curl|curl]]"
reporter: "behindtheblackwall"
source: "https://hackerone.com/reports/3225565"
title: " OS Command Injection in scripts/firefox-db2pem.sh via untrusted certificate nicknames"
---
#  OS Command Injection in scripts/firefox-db2pem.sh via untrusted certificate nicknames

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 12 | **Program:** curl | **Disclosed:** 2025-06-28

- Report: [https://hackerone.com/reports/3225565](https://hackerone.com/reports/3225565)
- CWE: OS Command Injection
- Submitted: 2025-06-26T21:10:59.650Z

## Timeline

- **Report Filed**
- **2025-06-26** @behindtheblackwall: As for a fix, the problematic logic being
```
54  certutil -L -h 'Builtin Object Token' -d "$db" | \
55  grep ' *[CcGTPpu]*,[CcGTPpu]*,[CcGTPpu]* *$' | \
56  sed -e 's/ *[CcGTPpu]*,[CcGTPpu]*,[CcGTPpu]* *$//' -e 's/\(.*\)/\"\\1\"/' | \
57  sort | \
58  while read -r nickname; \
59   do echo "$nickname" | sed -e "s/Builtin Object Token://g"; \
60  eval certutil -d "$db" -L -n "$nickname" -a ; \
61  done >> "$out"
```

The eval in line 60-re-interprets the entire line as a shell command, so any metacharacters in a nickname become executable. Removing eval and using read would be a safer option:

```
certutil -L -h 'Builtin Object Token' -d "$db" |
grep ' *[CcGTPpu]*,[CcGTPpu]*,[CcGTPpu]* *$' |
sed -e 's/ *[CcGTPpu]*,[CcGTPpu]*,[CcGTPpu]* *$//' |
sort |
while IFS= read -r nickname; do
  echo "$nickname" | sed -e "s/Builtin Object Token://g"
  certutil -d "$db" -L -n "$nickname" -a
done >> "$out"
```

Looks like things have been done like this since the first commit, so this seemingly affects all versions--

┌──(kali㉿kali)-[/home/kali/curl]
└─$ git log --follow --oneline -- scripts/firefox-db2pem.sh
```
40017fb32 firefox-db2pem: mention what "certutil" the script uses
fa69b41c7 GHA: add shellcheck job and fix warnings, shell tidy-ups
2bc1d775f copyright: update all copyright lines and remove year ranges
ad9bc5976 copyright: make repository REUSE compliant
a04f0b961 Makefile: fix "make ca-firefox"
8e22fc68e scripts: move three scripts from lib/ to scripts/
98b40c61b firefox-db2pem.sh: make the shell script safer
4d2f80067 curl.se: new home
9a8b3b3e1 copyright: fix out-of-date copyright ranges and missing headers
b801b453a whitespace fixes
4af40b364 URLs: change all http:// URLs to https://
7fe172d3b firefox-db2pem: fix wildcard to find Firefox default profile
2309b4e33 remove the CVSish $Id$ lines
a07bc7911 removed trailing whitespace
1c04aa54a - Running 'make ca-firefox' in the root build dir will now run the new   firefox-db2pem.sh conversion script that converts a local Firefox db of ca   certs into PEM format, suitable for use with a OpenSSL or GnuTLS built   libcurl.
```
                                                                                                                                                          
git show 1c04aa54a:lib/firefox-db2pem.sh | nl -ba | sed -n '46,54p'
```
   46	
   47	certutil -L -h 'Builtin Object Token' -d $db | \
  48	grep ' *[CcGTPpu]*,[CcGTPpu]*,[CcGTPpu]* *$' | \
   49	sed -e 's/ *[CcGTPpu]*,[CcGTPpu]*,[CcGTPpu]* *$//' -e 's/\(.*\)/"\1"/' | \
   50	sort | \
   51	while read nickname; \
   52	 do echo $nickname | sed -e "s/Builtin Object Token://g"; \
   53	eval certutil -d $db -L -n "$nickname" -a ; \
   54	done >> $out
```
- **2025-06-26** @bagder: if you can run the script, you can of course inject anything you like. Even rewrite the script completely. I don't see how this is a security problem.
- **2025-06-26** @bagder: Besides, this script is not really a part of curl and is not installed with make install etc. It's just a little script we offer to those who find it useful.
- **2025-06-26** @behindtheblackwall: I'm thinking from a downstream perspective here, I've worked in environments where admins run curl's own build system which exposes the target make ca-firefox as root to refresh /etc/ssl/certs/ca-bundle.crt on servers or CI images.

The Firefox DB it consumes often sits in an unprivileged user's $HOME so any user on the box can plant a malicious nickname and get code exec next time ops run the refresh.

Then considering it's supported tooling I just wanted to report it. The ability for untrusted nickname data to cause shell execution seems like a command‑injection risk that might not need to be there. If the team feel's the risk is out-of-scope and I'll redirect the report to downstream distros that package the script as root-capable tooling. Just didn’t want to skip upstream if the fix is one or two lines since I'm pretty sure what I mentioned will stop anything like that from happening. The impact may be too speculative for a bounty, but it caught my eye.
- **2025-06-27** @dfandrich: It looks like the eval is only there to handle the quoted string. Here's a patch that does that in a safer way.
```sh
--- a/scripts/firefox-db2pem.sh
+++ b/scripts/firefox-db2pem.sh
@@ -57,5 +57,5 @@ sed -e 's/ *[CcGTPpu]*,[CcGTPpu]*,[CcGTPpu]* *$//' -e 's/\(.*\)/"\1"/' | \
 sort | \
 while read -r nickname; \
  do echo "$nickname" | sed -e "s/Builtin Object Token://g"; \
-eval certutil -d "$db" -L -n "$nickname" -a ; \
+ echo "$nickname" | xargs -I{} certutil -d "$db" -L -a -n {} ; \
 done >> "$out"
```
- **2025-06-27** @bagder: I think this weakness in the script can be improved, but I don't want to call it a curl security vulnerability.

If someone runs this script (as root?) and allows external input as to which name to use I think that sounds like a vulnerability for said use case and not strictly for this script. This script is not designed for not intended to be run like that. Can we do better to signal the intent and expectations for this script?

Since this script just blindly create the  target it is told to write, it could do all sorts of damage without very strict filtering. Thus, this mentioned issue is stupid, but it is not the only problem you get if you decide to run this script with untrusted external input.
- **2025-06-27** @behindtheblackwall: Quick clarifying point: in multiple downstream build-pipelines (Fuchsia, Cmake's Docker build, openSUSE OBS), this script is run as root against unprivileged Firefox profiles, so malicious nickname does become a real privilege escalation vector. Maybe not the most common, but it’s a concrete, local privilege-escalation in real-world CI and packaging workflows.
- **2025-06-27** @jimfuller2024: Unsurprisingly I agree with my other colleagues - we can improve the script but there is not much we can do to generally protect against 'run script as root'  requirement ... not a security issue (we can completely protect users from) and the burden is on the user.
- **2025-06-27** @dgustafsson: The obvious question is why anyone would run a build pipeline, or any part of it, as root. Second though, for that to be vulnerable the attacker would first need to compromise the build infrastructure for the project. I think we should improve the script, but we can't really protect anyone running code as root with unverified external input and then blindly trusting the result.
- **Report Informative**
- **Agreed On Going Public**
- **2025-06-27** @dfandrich: The fix is made in https://github.com/curl/curl/pull/17766
- **2025-06-27** @behindtheblackwall: Fair enough, I can see how it might seem a stretch. Happy to see this cleaned up though, cheers.
- **Manually Disclosed**
