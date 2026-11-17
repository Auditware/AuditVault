---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/os-command-injection
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "OS Command Injection"
enriched: true
date: 2022-11-16
submitted: 2022-08-17T12:18:56.726Z
bounty_usd: null
votes: 271
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "yvvdwf"
source: "https://hackerone.com/reports/1672388"
title: "RCE via github import"
---
# RCE via github import

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 271 | **Program:** GitLab | **Disclosed:** 2022-11-16

- Report: [https://hackerone.com/reports/1672388](https://hackerone.com/reports/1672388)
- CWE: OS Command Injection
- Submitted: 2022-08-17T12:18:56.726Z

## Timeline

- **Report Filed**
- **2022-08-17** @h1_analyst_kenny: Hi @yvvdwf,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@long_cat
- **Report Needs More Info**
- **Report New**
- **2022-08-18** @nmalcolm_gitlab: @yvvdwf if it helps, here is the error from my omnibus install of GitLab when the import is attempted:

```
==> /var/log/gitlab/gitlab-rails/production.log <==
Started POST "/api/v4/import/github" for REDACTED at 2022-08-17 23:55:05 +0000

==> /var/log/gitlab/gitlab-rails/exceptions_json.log <==
{"severity":"ERROR","time":"2022-08-17T23:55:05.368Z","correlation_id":"01GAQ3PT6KHK32N2PEJ213N9AY","exception.class":"NoMethodError","exception.message":"undefined method `description' for []:Array","exception.backtrace":["lib/gitlab/legacy_github_import/project_creator.rb:21:in `execute'","app/services/import/github_service.rb:45:in `create_project'","app/services/import/github_service.rb:24:in `execute'","lib/api/import_github.rb:48:in `block in \u003cclass:ImportGithub\u003e'","ee/lib/gitlab/middleware/ip_restrictor.rb:14:in `block in call'","ee/lib/gitlab/ip_address_state.rb:10:in `with'","ee/lib/gitlab/middleware/ip_restrictor.rb:13:in `call'","lib/api/api_guard.rb:213:in `call'","lib/gitlab/metrics/elasticsearch_rack_middleware.rb:16:in `call'","lib/gitlab/middleware/memory_report.rb:13:in `call'","lib/gitlab/middleware/speedscope.rb:13:in `call'","lib/gitlab/database/load_balancing/rack_middleware.rb:23:in `call'","lib/gitlab/middleware/rails_queue_duration.rb:33:in `call'","lib/gitlab/metrics/rack_middleware.rb:16:in `block in call'","lib/gitlab/metrics/web_transaction.rb:46:in `run'","lib/gitlab/metrics/rack_middleware.rb:16:in `call'","lib/gitlab/jira/middleware.rb:19:in `call'","lib/gitlab/middleware/go.rb:20:in `call'","lib/gitlab/etag_caching/middleware.rb:21:in `call'","lib/gitlab/middleware/query_analyzer.rb:11:in `block in call'","lib/gitlab/database/query_analyzer.rb:37:in `within'","lib/gitlab/middleware/query_analyzer.rb:11:in `call'","lib/gitlab/middleware/multipart.rb:173:in `call'","lib/gitlab/middleware/read_only/controller.rb:50:in `call'","lib/gitlab/middleware/read_only.rb:18:in `call'","lib/gitlab/middleware/same_site_cookies.rb:27:in `call'","lib/gitlab/middleware/handle_malformed_strings.rb:21:in `call'","lib/gitlab/middleware/basic_health_check.rb:25:in `call'","lib/gitlab/middleware/handle_ip_spoof_attack_error.rb:25:in `call'","lib/gitlab/middleware/request_context.rb:21:in `call'","lib/gitlab/middleware/webhook_recursion_detection.rb:15:in `call'","config/initializers/fix_local_cache_middleware.rb:11:in `call'","lib/gitlab/middleware/compressed_json.rb:26:in `call'","lib/gitlab/middleware/rack_multipart_tempfile_factory.rb:19:in `call'","lib/gitlab/middleware/sidekiq_web_static.rb:20:in `call'","lib/gitlab/metrics/requests_rack_middleware.rb:77:in `call'","lib/gitlab/middleware/release_env.rb:13:in `call'"],"user.username":"yvvdwf","tags.program":"web","tags.locale":"en","tags.feature_category":"importers","tags.correlation_id":"01GAQ3PT6KHK32N2PEJ213N9AY"}

==> /var/log/gitlab/gitlab-rails/production.log <==

NoMethodError (undefined method `description' for []:Array):
  /opt/gitlab/embedded/service/gitlab-rails/lib/gitlab/legacy_github_import/project_creator.rb:21:in `execute'
  /opt/gitlab/embedded/service/gitlab-rails/app/services/import/github_service.rb:45:in `create_project'
  /opt/gitlab/embedded/service/gitlab-rails/app/services/import/github_service.rb:24:in `execute'
  /opt/gitlab/embedded/service/gitlab-rails/lib/api/import_github.rb:48:in `block in <class:ImportGithub>'
...
```

I'll keep trying different things and attempting to reproduce, but again any updated instructions / fake server / video would be much appreciated!


Cheers,
Nick Malcolm
GitLab Security Team
- **Report Severity Updated**
- **Report Triaged**
- **2022-08-18** @yvvdwf: Hi @nmalcolm_gitlab, I'm glad to hear that you were able to valid the finding. Thanks!
- **2022-08-18** @dcouture: Hi @yvvdwf,

We would like to make sure that you are not testing this anymore. The test entries in Redis are causing issues in other places. Also in the future it would be preferred if such issues were tested on a local GitLab instance to avoid any impact to the production environment.

Thank you,
Dominic
GitLab Security Team
- **2022-08-18** @yvvdwf: Hi @dcouture ,

I acknowledge receipt of the warning. Otherwise, I hope that the tests do not violate to the *Rules of Engagement, Testing, and Proof-of-concepts* policy as I intended to use and effect only my account `yvvdwf` and my private repository `yvvdwf/xss`.

Best regards,
- **2022-08-18** @dcouture: Thank you @yvvdwf. It's all good, I'm sure there were no intentional violation of the rules of engagement, but the testing did cause some stability issues in areas outside of your own repository. We're going to add some more specific wording in our policy to outline how RCE should be tested in the future.

Best regards,
Dominic
GitLab Security Team
- **2022-08-24** @gitlab-securitybot: ETA for fix:

Hi @yvvdwf,

The issue you reported is currently scheduled to be fixed by 2022-09-30.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **Bounty Awarded**
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
