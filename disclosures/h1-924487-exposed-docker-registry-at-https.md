---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/cloud
  - stack/docker
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
body: true
date: 2020-07-30
submitted: 2020-07-15T15:32:02.067Z
bounty_usd: null
votes: 15
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "pdbx"
source: "https://hackerone.com/reports/924487"
title: "Exposed Docker Registry at https://████"
---
# Exposed Docker Registry at https://████

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 15 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2020-07-30

- Report: [https://hackerone.com/reports/924487](https://hackerone.com/reports/924487)
- CWE: Improper Authentication - Generic
- Submitted: 2020-07-15T15:32:02.067Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
The docker registry at https://██████ has no authentication in place and is therefore exposed to the public. This leads to full disclosure of all available docker containers, the possibility to upload docker container and manipulate and delete existing docker containers.

**Description:**
From https://www.acunetix.com/vulnerabilities/web/docker-registry-api-is-accessible-without-authentication/ :
The Docker Registry HTTP API is the protocol to facilitate the distribution of images to the docker engine. It interacts with instances of the docker registry, which is a service to manage information about docker images and enable their distribution.

This Docker Registry API is accessible without authentication. A properly secured registry should return 401 when the "/v2/" endpoint is hit without credentials. The response should include a WWW-Authenticate challenge, guiding how to authenticate, such as with basic auth or a token service.

## Impact
High. An attacker can view all available (deployed) docker containers and their containing information, patch the containers to transform the containers to malicious containers (backdoors, malfunction, authentication bypass, RCE, etc.) and upload new possibly malicious containers.  

## Step-by-step Reproduction Instructions
### Viewing and Downloading existing docker containers 
 1. We can examine the existing docker containers by visiting https://██████████/v2/_catalog. We can see that multiple "private" custom docker containers are available (refer to `docker_catalog.png`)
 2. We can download any of these containers with the following command `docker pull █████/<container>`. For example we can download the container `█████████` with `docker pull ███████/███` (refer to `shell_download_container.png`)
 3. At this point we can start the container with `docker run --rm -it █████████/█████ sh` and investigate what is inside the container, to look for credentials and other useful information, etc. (refer to `shell_inside_container.png`)

### Uploading containers
 1. We can not only view all the information in the existing containers, but we are also able to upload containers.
 2. As a proof of concept, I uploaded the default `hello-world` container

```
docker pull hello-world   # Get the hello-world docker
docker tag hello-world:latest ██████/chron0x/hello-world   # Set destination
docker push █████████/chron0x/hello-world   # Push 
```

 3. Carefully observing https://█████/v2/_catalog we can see that the container `chron0x/hello-world` is present (refer to `docker_catalog_chron0x.png`) . The uploaded container is succesfully uploaded and would now be executed server-side. 

### Manipulating existing dockers
Combining the two points above it is also possible to manipulate existing docker containers, by 
 1. Downloading an existing container
 2. Patching the container 
 3. Uploading the container again

With such manipulations backdoors can be planted, the server can be taken over completely, authentications can be bypassed, forced into malfunction etc.
I did not manipulate any of the existing containers since I did not want to mess with the system. I can of course present a manipulation, like planting a file into one of the containers on request.  

## Product, Version, and Configuration (If applicable)
Docker Registry v2

## Suggested Mitigation/Remediation Actions
Restrict access to the Docker Registry API. Except for registries running on secure local networks, registries should always implement access restrictions.

The simplest way to achieve access restriction is through basic authentication (this is very similar to other web servers basic authentication mechanism).

Check all existing docker containers for manipulations, or set them up again from scratch, since they have been potentially been tampered with. 

## Resources:
 * https://www.acunetix.com/vulnerabilities/web/docker-registry-api-is-accessible-without-authentication/
 * https://www.notsosecure.com/anatomy-of-a-hack-docker-registry/

## Impact

High. An attacker can view all available (deployed) docker containers and their containing information, patch the containers to transform the containers to malicious containers (backdoors, malfunction, authentication bypass, RCE, DDOS etc.) and upload new possibly malicious containers.

## Timeline

- **Report Filed**
- **2020-07-15** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **2020-07-21** @agent-l8: added to the queue. Thanks!
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
