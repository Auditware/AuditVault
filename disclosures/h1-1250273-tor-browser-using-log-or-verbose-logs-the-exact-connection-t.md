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
date: 2021-09-27
submitted: 2021-07-02T20:37:16.712Z
bounty_usd: null
votes: 4
cve: []
program: "[[programs/torproject|Tor]]"
reporter: "sickcodes"
source: "https://hackerone.com/reports/1250273"
title: "Tor Browser using --log or --verbose logs the exact connection time a client connects to any v2 domains."
---
# Tor Browser using --log or --verbose logs the exact connection time a client connects to any v2 domains.

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 4 | **Program:** Tor | **Disclosed:** 2021-09-27

- Report: [https://hackerone.com/reports/1250273](https://hackerone.com/reports/1250273)
- CWE: Information Disclosure
- Submitted: 2021-07-02T20:37:16.712Z

## Report summary

NOTE: This is a correlation attack and requires a sophisticated attacker to perform. A complicated attack would require physical access to the device running tor browser, as well as either operating rogue/bad exit nodes, or a compromised/fake hidden service, or combination of that.

NOTE2: Title is incorrect. The logs are always stored and can be viewed with or without flags.

### Title
CVE-2021-39246 - Tor Browser through 10.5.6 and 11.x through 11.0a4 allows a correlation attack excessive verbose logging - Windows, macOS, Linux

### CVE ID
CVE-2021-39246

### CVSS Score
Pending

### Internal ID
SICK-2021-111

# Vendor
Tor 

### Product
Tor Browser on Windows, macOS, Linux

### Product Versions
10.5.6 and 11.x through 11.0a4

### Vulnerability Details

Tor Browser through 10.5.6 and 11.x through 11.0a4 allows a correlation attack that can compromise the privacy of visits to v2 onion addresses. Exact timestamps of these onion-service visits are logged locally, and an attacker might be able to compare them to timestamp data collected by the destination server (or collected by a rogue site within the Tor network). This occurs by default, with or without verbose.

### Vendor Response
Open pull request in relation to timestamp logging as v2 will be deprecated soon:

[https://gitlab.torproject.org/tpo/core/tor/-/merge_requests/434](https://gitlab.torproject.org/tpo/core/tor/-/merge_requests/434).

### Proof of Concept

`Tor Browser` latest `10.5.6` is affected.

`Tor Browser` alpha `11.0a4` is affected.

This is because `Tor 0.4.6` introduced a warning every time a client connects to a v2 domain.

See: [https://gitlab.torproject.org/tpo/core/tor/-/commit/5e836eb80c31b97f87b152351b6a7a932aeffaed](https://gitlab.torproject.org/tpo/core/tor/-/commit/5e836eb80c31b97f87b152351b6a7a932aeffaed)

Also see "Log warning when connecting to soon-to-be-deprecated v2 onions."

https://gitlab.torproject.org/tpo/core/tor/-/commit/80c404c4b79f3bcba3fc4585d4c62a62a04f3ed9


```bash

cd /tmp

wget https://www.torproject.org/dist/torbrowser/10.5.6/tor-browser-linux64-10.5.6_en-US.tar.xz

tar -xzvf tor-browser-linux64-10.5.6_en-US.tar.xz

cd /tmp/tor-browser_en-US/

./start-tor-browser.desktop --verbose

# Launching './Browser/start-tor-browser --detach --verbose'...

```

Visit any v2 onion site, connection timestamps are logged at the exact moment the server responds.

```console
Sep 24 16:28:52.000 [warn] Warning! You've just connected to a v2 onion address. These addresses are deprecated for security reasons, and are no longer supported in Tor. Please encourage the site operator to upgrade. For more information see https://blog.torproject.org/v2-deprecation-timeline

Sep 24 16:28:52.000 [warn] Warning! You've just connected to a v2 onion address. These addresses are deprecated for security reasons, and are no longer supported in Tor. Please encourage the site operator to upgrade. For more information see https://blog.torproject.org/v2-deprecation-timeline

Sep 24 16:28:52.000 [warn] Warning! You've just connected to a v2 onion address. These addresses are deprecated for security reasons, and are no longer supported in Tor. Please encourage the site operator to upgrade. For more information see https://blog.torproject.org/v2-deprecation-timeline

Sep 24 16:29:02.000 [warn] Warning! You've just connected to a v2 onion address. These addresses are deprecated for security reasons, and are no longer supported in Tor. Please encourage the site operator to upgrade. For more information see https://blog.torproject.org/v2-deprecation-timeline

```

#### Disclosure Timeline
* **2021-07-02** - Researcher discovers vulnerability on bounty platform
* **2021-07-07** - Report closed as informative
* **2021-08-17** - Researcher requests CVE
* **2021-08-17** - Vendor re-notified via sec mailing list, and on bounty platform chat.
* **2021-09-10** - No response: researcher opens Pull Request to remove timestamps.
* **2021-09-24** - CVE published

### Links

[https://github.com/sickcodes/security/blob/master/advisories/SICK-2021-111.md](https://github.com/sickcodes/security/blob/master/advisories/SICK-2021-111.md)

[https://sick.codes/sick-2021-111](https://sick.codes/sick-2021-111)

[https://www.privacyaffairs.com/cve-2021-39246-tor-vulnerability/](https://www.privacyaffairs.com/cve-2021-39246-tor-vulnerability/)

[https://gitlab.torproject.org/tpo/core/tor/-/commit/80c404c4b79f3bcba3fc4585d4c62a62a04f3ed9](https://gitlab.torproject.org/tpo/core/tor/-/commit/80c404c4b79f3bcba3fc4585d4c62a62a04f3ed9)

[https://gitlab.torproject.org/tpo/core/tor/-/merge_requests/434](https://gitlab.torproject.org/tpo/core/tor/-/merge_requests/434)

[https://hackerone.com/reports/1250273](https://hackerone.com/reports/1250273)

### Researchers
- *Sick Codes* [https://github.com/sickcodes](https://github.com/sickcodes) || [https://twitter.com/sickcodes](https://twitter.com/sickcodes)

- *Miklos Zoltan* [https://twitter.com/mzb4455](https://twitter.com/mzb4455) || [https://www.privacyaffairs.com/authors/miklos/](https://www.privacyaffairs.com/authors/miklos/)

#### CVE Links

[https://sick.codes/sick-2021-111](https://sick.codes/sick-2021-111)

[https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-39246](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-39246)

[https://nvd.nist.gov/view/vuln/detail?vulnId=CVE-2021-39246](https://nvd.nist.gov/view/vuln/detail?vulnId=CVE-2021-39246)

## Timeline

- **Report Filed**
- **2021-07-02** @sysrqb: Logging is not the default. I do not consider this a vulnerability. Are you suggesting `--log` and `--verbose` should not log the timestamps, or they should be less granular, or they should provide fuzzy timestamps? The purpose of outputting log entries is for debugging, and correct timestamps are important for achieving that goal.
- **Report Needs More Info**
- **Report New**
- **Report Informative**
- **2021-07-07** @sickcodes: Thank you for clearing that up, do you mind if we make this public if it's not a security issue?
- **Agreed On Going Public**
- **2021-07-10** @sickcodes: Can you please assign a CVE for this or shall I submit one to mitre?
- **2021-08-16** @sickcodes: @asn here is the reason why I wrote the report, the Brave browser was logging those timestamps to file, permanently: https://hackerone.com/reports/1249056
- **2021-08-17** @sickcodes: Hi @asn/@sysrqb this was assigned CVE-2021-39246 and the suggested description was sent back from MITRE:

`[Suggested description]`
```
Tor Browser through 10.5.4 and 11.x through 11.0a4 allows a correlation
attack that can compromise the privacy of visits to v2 onion addresses.
If --log or --verbose is used, exact timestamps of these onion-service
visits are logged locally, and an attacker might be able to compare
them to timestamp data collected by the destination server (or collected
by a rogue site within the Tor network).
```
I assume MITRE contacted you today to verify the affected version numbers, or do you want me to confirm also?

Do you want me to open a public issue the git or resolve privately?
- **Cancelled Disclosure Request**
- **2021-08-19** @sickcodes: Since this CVE was issued out of band with MITRE as the CNA I will contact the vendor via the official channel as this discussion seems to have ceased and this report is closed
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2021-09-27** @sickcodes: Hi @geko, I just validated that this happens without any flags, please see attached.
- **2021-10-16** @sickcodes: Thanks for fixing this folks in TROVE-2021-008!

May I kindly suggest changing the impact to low or medium to better reflect the outcome of this report? The TROVE score was low and the CVE-2021-22929 was medium.

Another researcher named Kubeworm noted the tainted logs impact in a private discussion we had after the CVE was public and I’d just like to thank kubeworm for reaching out.

For completeness of this report and anyone else reading, just adding the most notable screenshot from the issue discussed on the tor gitlab, which demonstrates a low complexity but very high difficulty to pull-off attack, that requires both physical access of the device coupled with control of the end server.

Once again, thank you for taking care of this out of band ❤️
