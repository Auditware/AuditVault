---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
  - stack/php
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2019-07-27
submitted: 2019-04-03T04:34:03.056Z
bounty_usd: null
votes: 11
cve: []
program: "[[programs/nextcloud|Nextcloud]]"
reporter: "theguynamedguy86"
source: "https://hackerone.com/reports/522876"
title: "In Dockerized Environments, Failing to Read config.php Grants Any Anonymous User Full Admin Access"
---
# In Dockerized Environments, Failing to Read config.php Grants Any Anonymous User Full Admin Access

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 11 | **Program:** Nextcloud | **Disclosed:** 2019-07-27

- Report: [https://hackerone.com/reports/522876](https://hackerone.com/reports/522876)
- CWE: Improper Access Control - Generic
- Submitted: 2019-04-03T04:34:03.056Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Consider this deployment:
- Nextcloud is already installed in a Dockerized environment.
- There are two Nextcloud containers running in the environment.
- Both containers share the same MySQL database.
- Both containers share the same data (`/var/www/html/data`) and config (`/var/www/html/config`) via NFS-mounted or SMB-mounted Docker volumes.
- All of the values Nextcloud needs to complete first-run setup (database name and credentials, admin credentials, etc) are provided to both containers via environment variables (`NEXTCLOUD_ADMIN_USER`, `NEXTCLOUD_ADMIN_PASSWORD`, `MYSQL_HOST`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`).

Now, consider that one or both of the containers encounter an issue reading `/var/www/html/config/config.php`. This could be caused by an of the following:
- Transient failure connecting to the NFS/SMB server at the time either container is launching or restarting (especially in response to a failed Liveness check).
- Timeout or other transient failure in communication with the NFS/SMB server while the container is already running.
- One container attempting to read `config.php` while the other container is writing to the file, causing an incomplete read (possibly making the file look empty).

In this situation, Nextcloud will assume that it is NOT installed (since the config seems empty). As a result, Nextcloud will launch the installer the next time ANY user requests a page from _the container that temporarily cannot read the `config.php` file_.  This causes that instance of Nextcloud to overwrite the `config.php` with a new file that has the same database credentials as the old file (populating the credentials from the environment variables), but the new config flags Nextcloud as not yet being installed (i.e. `installed` is set to `FALSE`). Some time later, assuming that NFS/SMB services have been restored to normal (e.g. the transient issue has disappeared), ALL containers will now happily serve up the Nextcloud installer to ANY user because the container that failed to read the configuration file wrote a new one with a newer timestamp that indicates Nextcloud is not installed.

From here, ANY user who stumbles upon the installer page can provide ANY username and password and end up with a new admin account with full access to the existing Nextcloud installation.

Nextcloud should NOT allow the installer to be run if ANY database tables already exist in the target database. If this is not possible, Nextcloud should at least not allow the installer to be run if any `admin` users exist in the target database.

## Impact

An attacker interested in taking over an existing installation of Nextcloud could write a script to frequently monitor that installation until such a time as that installation suffers a temporary issue reading `config.php` and starts serving up the installer. At that point, the attacker can hop over to the installation, finish the setup process, and create a username and password of their choice to gain full admin access to the entire Nextcloud installation.

With admin access, the attacker can lock out all of the existing users of the system, change system settings, and download or erase all of the files on the Nextcloud installation.

## Timeline

- **Report Filed**
- **2019-04-03** @Nextcloud: Thanks a lot for reporting this potential issue back to us!

Our security team will take a look at this issue as soon as possible. We will reply to your report within 72 hours, usually much faster. For obvious reasons we'd like to ask you to not disclose this issue to any other party.
- **2019-04-03** @theguynamedguy86: BTW During a transient NFS/SMB issue, the error that appears in the Nextcloud log when the configuration file cannot be read is:

```
fopen(/var/www/html/config/config.php): failed to open stream: Transport endpoint is not connected at /var/www/html/lib/private/Config.php#241
```
- **2019-04-04** @rullzer: Hi @theguynamedguy86,

Thanks for  your report.
However the situation you describe is not really supported. Config.php should be mounted read only in case of multiple cotainers. (blocking an install from writing the file in any case).

Cheers,
--Roeland
- **Report Informative**
- **2019-04-04** @theguynamedguy86: I think that it is very foolish not to consider this a security issue, for the following reasons:
- One of the selling points of Nextcloud is supposedly security (from the homepage: "Ensure compliance, security and flexibility"). Why be on Hackerone if you are not actually interested in making the product more secure?
- The repro steps I provided -- of there being several instances in the same Dockerized environment -- isn't a pre-requisite to trigger the vulnerability. I think that you are focusing too much on multiple containers and not enough on the fact that _any issue that causes `config.php` to be unreadable causes Nextcloud to provide the option to create a new admin user._
- This vulnerability doesn't take much to trigger. We've seen it _twice_ on our installation in the last two weeks, but were only able to figure out what's happening the second time it happened; if it was that easy for us to fall into this trap, what about others?
- The vulnerability triggers full admin access on the installation. Enough said.
- Nothing in the documentation ever says that `config.php` should be read-only. This is *not even mentioned in the [security hardening section](https://docs.nextcloud.com/server/15/admin_manual/installation/harden_server.html)* -- trust me, I've re-read it *five* times.
- Nothing in Nextcloud's security checks indicate that `config.php` should be read-only.
- Other security-focused, PHP-based products like WordPress and Drupal do not allow re-installation on an existing database without use of a different prefix. Nextcloud's approach is not very secure here when compared to others on the same stack.

Given all of the above, if you still feel that this highly critical vulnerability is not something that you would like to fix in the product, I can proceed with public disclosure.
- **Report Reopened**
- **2019-04-04** @theguynamedguy86: @nickvergessen I'm totally not opposed to mounting the volume read-only in order to support multiple container instances. My understanding from the documentation is that Nextcloud can be deployed for high availability, so your final statement that "...I would propose to switch the multiple container approach off." is confusing to me. Are you saying that: 1) in general Nextcloud only supports running as a single instance, or that 2) given that the configuration data is writable by multiple instances in our initial deployment, we shouldn't be running multiple instances? I would like to assume you meant the latter; rather than implying Nextcloud cannot support HA in containers.

Regardless, I must again reiterate that the vulnerability I am reporting here is **not** that Nextcloud is inherently insecure when running in a high-availability setup with a writable configuration folder (although, IMHO, docs should point out this limitation if this common deployment poses a security risk). The vulnerability is that: 1) deploying Nextcloud in a container, and 2) leveraging auto-setup via environment variables, leads Nextcloud to re-run its installer and grant admin access to any anonymous user if the Docker volume containing the `config.php` file. The reason for the file being unreadable can be any of the reasons I spelled out in the OP -- transient failure, issue mounting the volume, etc. 

_Ignore_ for a moment that one possible reason is that another instance is writing the file while the other is reading; I provided that because that's the easiest way we've been able to demonstrate the vulnerability. But, regardless of deployment, if `config.php` becomes inaccessible but has the correct permissions and you are running Nextcloud in a Docker container with auto setup environment variables, Nextcloud has this vulnerability.

I suppose you could say next that Nextcloud should not be run in Docker or that it is a bad idea to use auto-setup. Again I would ask that if these deployments are inherently insecure, documentation needs to indicate this; otherwise, docs encourage these methods of deployment.
- **2019-04-09** @rullzer: Hi @theguynamedguy86 ,

Ah that explains a bit more. Yeah with autosetup in docker this can happen. Now I see the issue a bit more clear. (Because when thinking about it when traveling I was wondering how your install got your DB credentials).

We are in the progress with a PR at https://github.com/nextcloud/server/pull/14965 that should prevent reinstalling

Cheers,
--Roeland
- **Report Triaged**
- **2019-04-11** @theguynamedguy86: Awesome; thank you, guys!
- **2019-04-15** @rullzer: https://github.com/nextcloud/server/pull/14965 has been merged and is in master and stable16
The backport to stable15 is pending.
- **2019-04-15** @theguynamedguy86: Thanks, again!
- **Report Resolved**
- **Swag Awarded**
- **Not Eligible For Bounty**
- **Agreed On Going Public**
- **Report Became Public**
