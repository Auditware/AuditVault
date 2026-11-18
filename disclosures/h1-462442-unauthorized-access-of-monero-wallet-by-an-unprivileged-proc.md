---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
  - vuln/broken-access-control
  - vuln/privilege-escalation
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2019-04-03
submitted: 2018-12-14T13:45:15.815Z
bounty_usd: null
votes: 10
cve: []
program: "[[programs/monero|Monero]]"
reporter: "thanhb"
source: "https://hackerone.com/reports/462442"
title: "Unauthorized access of Monero wallet by an unprivileged process"
---
# Unauthorized access of Monero wallet by an unprivileged process

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 10 | **Program:** Monero | **Disclosed:** 2019-04-03

- Report: [https://hackerone.com/reports/462442](https://hackerone.com/reports/462442)
- CWE: Improper Access Control - Generic
- Submitted: 2018-12-14T13:45:15.815Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Description:
As per our understanding, Monero wallet app provides a separate executable for the user to enable the RPC interface (monero-wallet-rpc). When the user runs the executable, the RPC server will start on a port number that is specified by the user. The RPC server authenticates the client with the HTTP digest access authentication scheme, which is based on a simple challenge-response paradigm. Basically, the client receives a nonce from the server and then replies with a MD5 hash value of the username, the password, the nonce, the HTTP method, and the URI. 

An attacker is a non-privileged user, who can sign in to the victim’s computer with his own credentials or guest account. The attacker first needs to run a process in the background when the victim is using the computer. On Linux and macOS, the attacker only needs to log in, run the process, and leave it running when he logs out. On Windows, user processes are killed at the end of the login session, and thus the attacker needs to do fast user switching to leave his session in the background. The attacker can also remotely run his malicious process if SSH or remote desktop is enabled on the target computer.

With the malicious process running in the background, it is possible to perform server impersonation on the Monero wallet by hijacking the port number before the victim starts the RPC server. The digest access authentication mechanism does not help here because it only authenticates the client. However, the RPC executable will fail to start if the port that it uses has already been taken. While this allows the victim to detect the attack, it does not free him from risks. For example, an aggressively-caching user may attach the RPC executable to the operating system's startup to launch it automatically after login for convenience. In that case, since the RPC server process does not have a GUI to notify the victim that it has failed, the victim will not notice the failure and thus assume that the RPC server is running. Hence, the attacker's malicious server captures commands from the benign client. An example of such commands is “create_wallet”, which tells the server to create a new wallet account. This allows the attacker to have access to the new account because it is created by the attacker instead of the real wallet application.

The attack is straightforward, and no privilege escalation is needed. Also, there are many potential attackers who can perform the attack. For example, in enterprise environments that employ centralized access control mechanisms and allow login by multiple users to the same computer, anyone is a potential attacker. Any computer with guest account enabled is similarly vulnerable.

## Releases Affected:
Tested on Monero wallet 0.12.3

## How to fix:
We found similar issues on other cryptocurrencies’ wallet applications and are working with them to address the issues. There are various ways to prevent the attack, some of which are as follows:
- Mandate the use of TLS on the RPC interface.
- The RPC server accepts only RPC clients that are owned by users belonging to Administrators or a special group.

## Supporting Material/References:
Recently, we have shown similar critical vulnerabilities in many well-known password managers, hardware tokens, and other security-critical applications at Usenix Security and DefCon: 
https://www.usenix.org/conference/usenixsecurity18/presentation/bui

## Impact

Access to the victim's wallet without knowing authentication credentials.

## Timeline

- **Report Filed**
- **2018-12-21** @moneromooo: Unless I'm missing something, your report is essentially "the attacker runs a fake server on the right port on the server that's supposed to run monero-wallet-rpc, and just captures the data from clients", right ? If so, OK, that works, but that's not a monero vuln. If it is, then any server can be said to have that vuln.
Did I miss a subtlety here ?
- **Report Needs More Info**
- **Report New**
- **2019-01-03** @moneromooo: OK, so I didn't miss anything, thanks.

I made a patch to add TLS on connections a while ago, along with whitelisting of peer certs, but it was rejected. See https://github.com/monero-project/monero/pull/4054, and https://github.com/monero-project/monero/pull/4852. Another contributor recently added the ability to listen via a Tor hidden service. See https://github.com/monero-project/monero/pull/4988. This is being improved so that a RPC server will be able to run as a hidden service (currently it's P2P only), which should make this vector moot when used (since the fake server would have to know the secret key used to host the hidden service). 

Mandating Tor use for RPC servers might prove too much of an obstacle though. Feel free to comment on 4852 about this. I'd be happy to update my SSL patch if objections were reconsidered, as the technical comments were trivial to address.
- **2019-01-04** @anonimal: >OK, so I didn't miss anything, thanks.

Yes. @thanhb thanks for the report but basically you've described a feature of the network stack in all modern computing. Anything that isn't authenticated is... well... not authenticated.

>Web servers, for example, are usually protected with TLS.

This is assuming they aren't using self-signed certificates, of which a malicious local user (or any intermediary) could generate. The use of TLS may also be useless for applications that aren't bound to privileged ports (such as Monero), unless there is a CA mechanism in place (please correct me if I'm wrong).

As @moneromooo suggested, the most effective solution may be key-derived public destinations as provided by Tor/Kovri/I2P/Sekreta.

In the interim, how should we proceed? Should we merge the TLS pull request?
- **Report Needs More Info**
- **Report New**
- **2019-01-07** @moneromooo: For the record, my patch does not need a CA. You specify which certs you allow. If the other side has another cert, it will fail the connection.

Also, if you run the wallet on the same host as the daemon, and you allow third parties access... you're really asking for trouble :) And if you don't but that host was broken into, chances are that TLS on the wallet/daemon comms won't protect you.
- **2019-01-07** @thanhb: > For the record, my patch does not need a CA. You specify which certs you allow. If the other side has another cert, it will fail the connection.

It's similar to using self-signed CA. Anyway, I have no comment about how TLS should be configured, as long as it's mandated.

> Also, if you run the wallet on the same host as the daemon, and you allow third parties access... you're really asking for trouble :) And if you don't but that host was broken into, chances are that TLS on the wallet/daemon comms won't protect you.

If you're talking about malware and the like, then you're right. I agree that TLS doesn't help in such cases. However, there are many cases where having third-party access is unavoidable. For example, in enterprise environments that employ centralized access control mechanisms and allow login by multiple users to the same computer, anyone is a potential attacker. Any computer with guest account enabled is similarly vulnerable.

We should conclude this thread. All I want here is to report what I see as a security problem. I've  reported similar problems to Bitcoin Core and Parity teams, and they are now in the process of fixing them. It's up to you guys to decide whether it's a problem that should be addressed.
- **Report Triaged**
- **2019-01-15** @moneromooo: Well, I want to get that SSL patch in for other reasons anyway, so we'll see whether opposition recedes. Thanks.
- **2019-01-15** @thanhb: You might want to mark this as Resolved or something like that because it's still "Open".
- **2019-01-17** @moneromooo: I'm going to wait till I know whether the SSL patch is accepted.
- **2019-02-11** @moneromooo: FYI: due to a threat of one party having > 50% of the network hash rate, we're forking soon with very little changes, and will release a "full" version at some yet undetermined time later. The SSL patch will be in that later version, but not in the early fork.
- **Report Resolved**
- **Agreed On Going Public**
- **2019-03-05** @thanhb: @anonimal Here is my XMR address: 4GdoN7NCTi8a5gZug7PrwZNKjvHFmKeV11L6pNJPgj5QNEHsN6eeX3DaAQFwZ1ufD4LYCZKArktt113W7QjWvQ7CWBuf7rcEjqhB3yE1uz

Thanks!
- **2019-03-11** @luigi1111w: Sent 2 XMR: <71fd52f5cd08e457638ebc6416707c59da9ecd5626f22ff65d7672accd88a0b6>
- **2019-03-12** @thanhb: Thank you!
- **Swag Awarded**
- **Report Became Public**
