---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/insecure-direct-object-reference-idor
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Insecure Direct Object Reference (IDOR)"
enriched: true
date: 2019-12-11
submitted: 2019-04-11T00:14:26.525Z
bounty_usd: null
votes: 148
cve: "CVE-2019-5469"
program: "[[programs/gitlab|GitLab]]"
reporter: "ajxchapman"
source: "https://hackerone.com/reports/534794"
title: "Importing GitLab project archives can replace uploads of other users"
---
# Importing GitLab project archives can replace uploads of other users

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 148 | **Program:** GitLab | **Disclosed:** 2019-12-11

- Report: [https://hackerone.com/reports/534794](https://hackerone.com/reports/534794)
- CWE: Insecure Direct Object Reference (IDOR) | CVE: CVE-2019-5469
- Submitted: 2019-04-11T00:14:26.525Z

## Timeline

- **Report Filed**
- **2019-04-11** @gitlab-securitybot: Hi @ajxchapman,

Thank you for submitting this report. We will investigate the issue as soon as possible.
Due to our current workload, we will get back within 20 business days with an update.

Please refrain from submitting your report or inquiring about its status through
additional channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **2019-04-11** @ajxchapman: Hi Team,

I've done some further analysis on this issue. The root cause appears to be due to two specific bugs, one in `RecordsUploads::Concern` and one in `Projects::UploadsController`.

### Bug 1: GitLab Project Import upload overwrite

When importing uploads, the `RecordsUploads::Concern.record_upload` method first calls `RecordsUploads::Concern.readd_upload` to remove any existing uploads that match the upload `path`.

`/app/uploaders/records_uploads.rb`:
```rb
def record_upload(_tempfile = nil)
      return unless model
      return unless file && file.exists?

      # MySQL InnoDB may encounter a deadlock if a deletion and an
      # insert is in the same transaction due to its next-key locking
      # algorithm, so we need to skip the transaction.
      # https://gitlab.com/gitlab-org/gitlab-ce/issues/55161#note_131556351
      if Gitlab::Database.mysql?
        readd_upload
      else
        Upload.transaction { readd_upload }
      end
    end

    def readd_upload
      uploads.where(path: upload_path).delete_all
      upload.delete if upload

      self.upload = build_upload.tap(&:save!)
    end
```
The `readd_upload` method matches the upload to delete based only on the user controlled `path` field. At no point does the code perform a permission check or verify that the importing project matches the upload project for the upload to be deleted. Due to this, any project import can delete and overwrite upload entries in the GitLab database for other project uploads.

This can be observed in the GitLab database.
**Before import**
```sql
gitlabhq_production=# select id, path, secret, model_id from uploads where secret='ed5ab56bc85699117ba230eb799fd3bf';
 id |                   path                    |              secret              | model_id
----+-------------------------------------------+----------------------------------+----------
 40 | ed5ab56bc85699117ba230eb799fd3bf/indi.jpg | ed5ab56bc85699117ba230eb799fd3bf |       19
(1 row)
```

**After import**
```sql
gitlabhq_production=# select id, path, secret, model_id from uploads where secret='ed5ab56bc85699117ba230eb799fd3bf';
 id |                   path                    |              secret              | model_id
----+-------------------------------------------+----------------------------------+----------
 42 | ed5ab56bc85699117ba230eb799fd3bf/indi.jpg | ed5ab56bc85699117ba230eb799fd3bf |       20
(1 row)
```

You can see that the `id` and `model_id` fields have been modified by the import process.

### Bug 2: Upload path insufficient upload object matching

The `Projects::UploadsController` class uses insufficient upload object matching when retrieving upload details from the database.

`/app/controllers/concerns/uploads_actions.rb`:
```rb
  def build_uploader_from_upload
    return unless uploader = build_uploader

    upload_paths = uploader.upload_paths(params[:filename])
    upload = Upload.find_by(uploader: uploader_class.to_s, path: upload_paths)
    upload&.build_uploader
  end
```
The upload details are pulled from the database using `Upload.find_by` matching on only the `uploader` and `path` fields. At no point does the code check that the requested project matches the retrieved upload project. Due to this bug, uploads with matching `secret` and `path` parameters can be accessed through unmatching project links.

This can be observed by creating a new empty project, then viewing an existing upload from another project using only the target uploads `secret` and `path` parameters. For example, if an upload exists at `http://127.0.0.1/user/project/uploads/ed5ab56bc85699117ba230eb799fd3bf/indi.jpg` and as a new user `mallroy`  you create a project `malicious` the upload can be successfully accessed via
`http://127.0.0.1/mallroy/malicious/uploads/ed5ab56bc85699117ba230eb799fd3bf/indi.jpg`

### Summary
These two issues combined allow a malicious user to import a project which overwrites the uploads of other GitLab projects. Links to the old upload are hijacked and pointed at the new malicious upload.
- **Report Triaged**
- **2019-04-16** @gitlab-securitybot: ETA for fix:

Hi @ajxchapman,

The GitLab issue created from your report is currently scheduled for 2019-07-22.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2019-05-30** @gitlab-securitybot: ETA for fix:

Hi @ajxchapman,

The GitLab issue created from your report is currently scheduled for 2019-08-22.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2019-08-16** @hackerjuan: Hi,

Thank you again for the report! Your finding has been reviewed and we are awarding a $5000 bounty prior the release of a patch.

We will continue to keep you updated via HackerOne as a release fixing this issue is scheduled.

Best regards,
Security Team | GitLab Inc.
- **Bounty Awarded**
- **2019-12-11** @ajxchapman: Hi Team,

Did the fix for this issue ever get pushed? If so could we mark this report as closed and disclose please?

Thanks
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
