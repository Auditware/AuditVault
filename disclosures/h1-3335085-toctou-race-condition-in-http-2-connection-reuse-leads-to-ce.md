---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/time-of-check-time-of-use-toctou-race-condition
  - env/web
substate: "not-applicable"
weakness: "Time-of-check Time-of-use (TOCTOU) Race Condition"
enriched: true
date: 2025-09-11
submitted: 2025-09-11T15:02:43.015Z
bounty_usd: null
votes: 23
cve: []
program: "[[programs/curl|curl]]"
reporter: "0xrey"
source: "https://hackerone.com/reports/3335085"
title: "TOCTOU Race Condition in HTTP/2 Connection Reuse Leads to Certificate Validation Bypass"
---
# TOCTOU Race Condition in HTTP/2 Connection Reuse Leads to Certificate Validation Bypass

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 23 | **Program:** curl | **Disclosed:** 2025-09-11

- Report: [https://hackerone.com/reports/3335085](https://hackerone.com/reports/3335085)
- CWE: Time-of-check Time-of-use (TOCTOU) Race Condition
- Submitted: 2025-09-11T15:02:43.015Z

## Timeline

- **Report Filed**
- **2025-09-11** @bagder: Thank you for your report!

We will take some time and investigate your reports and get back to you with details and possible follow-up questions as soon as we can! Most likely within the next 24 hours.

We always strive to fix reported problems as fast as possible. Issues with severity Low or Medium we merge into the next release in the ordinary release cycle. Only for more serious problems we might  release fix early.
- **2025-09-11** @bagder: This is curl working as intended. We can possibly consider improving the documentation to make this more obvious to users.

Also, this is not HTTP/2 specific. curl works the same for all TLS-using protocols it supports and will reuse an existing connection if one exists - without verifying the certificate again.
- **2025-09-11** @0xrey: Hi Daniel,,
Thank you for the quick response and clarification.

I understand this is the current intended design. However, I believe this design creates a security vulnerability by violating the user's trust model. It's a classic TOCTOU race condition: the check on the --cacert file happens at a different time than its subsequent use via the reused connection.

This could be mitigated with a low-cost stat() check on the CA file before reusing a connection. If the file has changed, the connection should be dropped. This would be far more secure than a documentation update.

The risk of this escalating into a full Man-in-the-Middle attack in common scenarios (like shared hosting) is significant. I would ask you to please reconsider classifying this as a security issue that warrants a code fix.

Thanks for your time and consideration.

Best regards,
0xrey
- **2025-09-11** @bagder: There are many ways a CA store can be used, one external file is just one way so that would not cover all the cases. An application that is worried about this property can itself easily take counter-measures similar to this for example.

> The risk of this escalating into a full Man-in-the-Middle attack

Please elaborate exactly how this can be used to do a MITM attack.
- **2025-09-11** @icing: Not to mention the Denial-of-Service attack vector by someone being able to touch that file every second...

This is a question of security requirements outside of curl/libcurl. If you want to design a service/system using libcurl that drops all connections on some external event, like a change ca file, you are free to do so.
- **2025-09-11** @bagder: > This breaks the trust model of TLS and enables Man-in-the-Middle (MitM) attacks

This claim is false. It does not *break the trust model*. This behavior is on the contrary standard among TLS-using clients. Including browsers.
- **2025-09-11** @0xrey: Hi Daniel,

You've got a good point that a `stat()` on just `CURLOPT_CAINFO` wouldn't be a silver bullet for every possible trust store setup. I see that. Still, it would lock down what is probably the most common way people use it, which feels like a big win for security.

And while it's true that a determined developer could add these checks themselves, I feel like that's asking a lot. Most of us using `libcurl` just assume that if a connection is verified once, it's good to go. The current behavior is surprising, and when security behaviors are surprising, people make mistakes. Making `libcurl` safe by default here seems like the right path.

> Please elaborate exactly how this can be used to do a MITM attack.

Absolutely. The clearest way to see the danger is as a **persistence attack that sets up a future hijack.**

Imagine a long-running daemon that uses `libcurl` with HTTP/2. It's been running for days, happily reusing a perfectly valid connection to `api.example.com`.

Here's how the attack plays out:

1.  **The Breach:** An attacker finds some other minor bug that gives them temporary write access to the directory where the app's `ca.crt` symlink lives.
2.  **The Plant:** The attacker doesn't need to do much. They just atomically swap the `ca.crt` symlink to point to their own malicious CA file. Their job is done in a split second, and they might lose their access right after.
3.  **The Trap is Set:** The running daemon is completely unaware. It continues to reuse its old, valid connection, and everything looks fine.
4.  **The Hijack:** Days or weeks later, a network glitch happens, the server restarts, or anything forces the daemon to drop its connection. It naturally tries to reconnect to `api.example.com`.
    *   This time, when `libcurl` goes to validate the new connection, it follows the symlink and reads the **attacker's fake CA**.
    *   The attacker, who has been patiently waiting and poisoning DNS, presents their own server.
    *   `libcurl` sees a certificate signed by a CA it now trusts. The connection succeeds.

From that moment on, the daemon has a persistent, MitM'd connection to the attacker, and all its data is compromised until the next restart.

The core problem is that an attacker can silently poison the application's trust anchor, and `libcurl` has no idea. A quick, low-cost `stat()` check would spot the tampering and prevent this entire scenario.
- **2025-09-11** @dfandrich: See also the related issue https://hackerone.com/reports/2369299 on connection use after certificate expiry.
- **2025-09-11** @bagder: > The attacker doesn't need to do much. They just atomically swap the ca.crt symlink to point to their own malicious CA file

This assumes you have a local attacker with file system access to private or system files. That's already game over and such an attacker can do much worse attacks than this. This is not a threat vector curl can protect itself against.

Also, if the attacker can replace the CA store then the problem is not really related to persistent connections. The problem is that there is a malicious CA store in place because there is a local attacker in the system.

This is not a curl security problem.
- **2025-09-11** @bagder: > A quick, low-cost stat() check would spot the tampering and prevent this entire scenario.

No it wouldn't. In your described scenario the attacker has planted a malicious CA store, so when the client retries the connection with the new CA certs that were updated, the connection will succeed - because it then uses the malicious CA bundle.

Let's stop this boring game now. This is not a curl problem.
- **Report Not Applicable**
- **2025-09-11** @0xrey: Hi Daniel,

You're right about the `stat()` mitigation's flaw. Thank you for that insight.

Let's set aside the specific MitM scenario for a moment and focus on the core behavior, because that's where the bug lies.

Right now, `curl` allows this to happen:
1.  An application sends a request at T=1. It successfully connects to **Server A (the real server)**.
2.  The CA file is swapped on disk.
3.  The same application sends another request at T=2 using a reused connection. It still successfully talks to **Server A**.
4.  The connection drops. The application sends a third request at T=3. It now successfully connects to **Server B (the attacker's server)**.

From the application's perspective, it performed three identical operations but was connected to **two completely different endpoints**. `libcurl`, as the transport layer, silently allowed the application's fundamental trust anchor to be pulled from under it without any warning, error, or notification.

This profound behavioral inconsistency, connecting to different destinations based on hidden, internal caching states—is the security vulnerability. It violates the principle of least surprise and breaks the implicit trust contract between the application and the library.

This isn't about whether an attacker is "game over"; it's about whether `libcurl` behaves predictably and safely. In this case, it does not.

Best regards,
0xrey
- **2025-09-11** @bagder: This user is completely in the hands of the attacker. Since the CA bundle can be changed at will, that attacker can MITM every TLS using tool on that machine. For added fun the attacker would also updated /etc/hosts. This is completely unrelated to reused connections.

Again, not a curl security problem. This discussion is over. Further: I strongly suspect you're using AI to keep this nonsense going and that just adds injury to this case.
- **Agreed On Going Public**
- **Manually Disclosed**
- **2025-09-12** @0xrey: Hi team,

I noticed commit c184f46 was recently pushed, which changes the default connection lifetime to 24 hours. The commit message explicitly states, 'This makes the TLS certificate check get redone for the new connection.'

This change directly mitigates the core issue raised in this report. While I understand your classification of the report, I'm glad to see that the underlying risk was addressed. Thank you for making curl more secure.

Best regards,
0xrey
- **2025-09-12** @bagder: You consistently insisted the attacker can replace the CA cert bundle and **THAT** is then the issue in your report. You never spoke about or mentioned a problem with a TLS connection going on for longer than the CA cert would allow it. That idea came back to me because I reread the *other* report linked to above.

So no, my fix did nothing to address anything in your report. Your report was pure rubbish. If you comment again in this report I will ban you from this project.
- **Comments Closed**
