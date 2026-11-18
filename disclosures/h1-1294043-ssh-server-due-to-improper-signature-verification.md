---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
substate: "not-applicable"
weakness: null
enriched: true
body: true
date: 2021-08-30
submitted: 2021-08-06T17:07:57.559Z
bounty_usd: null
votes: 2
cve: "CVE-2020-9283"
program: "[[programs/sifchain|Sifchain]]"
reporter: "escanor56"
source: "https://hackerone.com/reports/1294043"
title: "SSH server due to Improper Signature Verification"
---
# SSH server due to Improper Signature Verification

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 2 | **Program:** Sifchain | **Disclosed:** 2021-08-30

- Report: [https://hackerone.com/reports/1294043](https://hackerone.com/reports/1294043)
- CWE: N/A | CVE: CVE-2020-9283
- Submitted: 2021-08-06T17:07:57.559Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I found that you are using golang.org/x/crypto@v0.0.0-20201016220609-9e8e0b390897 which has a vulnerability that was fixed in this version 
golang.org/x/crypto@0.0.0-20201203163018-be400aefbc4c but that vulnerability is:
golang.org/x/crypto/ssh is an SSH client and server
Version v0.0.0-20200220183623-bac4c82f6975 of golang.org/x/crypto fixes a vulnerability in the golang.org/x/crypto/ssh package which allowed peers to cause a panic in SSH servers that accept public keys and in any SSH client.
You can check all of the info here with this CVE: CVE-2020-9283.

## Impact

An attacker can craft an ssh-ed25519 or sk-ssh-...@openssh.com public key, such that the library will panic when trying to verify a signature with it. Clients can deliver such a public key and signature to any golang.org/x/crypto/ssh server with a PublicKeyCallback, and servers can deliver them to any golang.org/x/crypto/ssh client.

## Timeline

- **Report Filed**
- **Report Not Applicable**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2022-10-02** @escanor56: Saze
