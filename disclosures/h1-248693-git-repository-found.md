---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2017-08-13
submitted: 2017-07-12T12:46:57.897Z
bounty_usd: null
votes: 43
cve: []
program: "[[programs/grab|Grab]]"
reporter: "linkks"
source: "https://hackerone.com/reports/248693"
title: "Git repository found"
---
# Git repository found

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 43 | **Program:** Grab | **Disclosed:** 2017-08-13

- Report: [https://hackerone.com/reports/248693](https://hackerone.com/reports/248693)
- CWE: Information Disclosure
- Submitted: 2017-07-12T12:46:57.897Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Git metadata directory (.git) was found in this folder. An attacker can extract sensitive information by requesting the hidden metadata directory that version control tool Git creates. The metadata directories are used for development purposes to keep track of development changes to a set of source code before it is committed back to a central repository (and vice-versa). When code is rolled to a live server from a repository, it is supposed to be done as an export rather than as a local working copy, and hence this problem.

Repository files/directories: 
.gitignore
README.md
ansible/Vagrantfile
ansible/development
ansible/host_vars/development
ansible/host_vars/production
ansible/production
ansible/provision.yml
ansible/roles/common/files/id_rsa
ansible/roles/common/tasks/main.yml

GET /wp-content/themes/.git/config HTTP/1.1
Host: 54.255.134.3:443
Connection: Keep-alive
Accept-Encoding: gzip,deflate
User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.21 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.21
Accept: */*

These files may expose sensitive information that may help an malicious user to prepare more advanced attacks.


Remove these files from production systems or restrict access to the .git directory. To deny access to all the .git folders you need to add the following lines in the appropriate context (either global config, or vhost/directory, or from .htaccess):
<Directory ~ "\.git">
Order allow,deny
Deny from all
</Directory>

## Timeline

- **Report Filed**
- **2017-07-12** @linkks: http://54.255.134.3:443/wp-content/themes/.git/config

[core]
	repositoryformatversion = 0
	filemode = true
	bare = false
	logallrefupdates = true
[remote "origin"]
	url = git@github.com:myteksi/recruitment.git
	fetch = +refs/heads/*:refs/remotes/origin/*
[branch "master"]
	remote = origin
	merge = refs/heads/master
- **Report Severity Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2017-07-12** @linkks: This repository reveals the data, see pic
me need make new report for file or this report?
__________

http://54.255.134.3:443/wp-content/themes/.gitignore

*.log
.htaccess
sitemap.xml
sitemap.xml.gz
wp-config.php
wp-content/advanced-cache.php
wp-content/backup-db/
wp-content/backups/
wp-content/blogs.dir/
wp-content/cache/
wp-content/upgrade/
wp-content/uploads/
wp-content/wp-cache-config.php
twentyfifteen/
twentyfourteen/
twentythirteen/
.vagrant

----



http://54.255.134.3:443/wp-content/themes/ansible/host_vars/development
http://54.255.134.3:443/wp-content/themes/ansible/host_vars/production
http://54.255.134.3:443/wp-content/themes/ansible/roles/common/files/id_rsa
http://54.255.134.3:443/wp-content/themes/ansible/roles/common/tasks/main.yml
http://54.255.134.3:443/wp-content/themes/ansible/roles/nginx/tasks/main.yml
http://54.255.134.3:443/wp-content/themes/ansible/roles/nginx/templates/conf.j2
http://54.255.134.3:443/wp-content/themes/ansible/roles/php/tasks/main.yml
http://54.255.134.3:443/wp-content/themes/ansible/roles/wordpress/tasks/main.yml
http://54.255.134.3:443/wp-content/themes/ansible/development
http://54.255.134.3:443/wp-content/themes/ansible/production
http://54.255.134.3:443/wp-content/themes/ansible/provision.yml
http://54.255.134.3:443/wp-content/themes/ansible/setup.yml
http://54.255.134.3:443/wp-content/themes/ansible/Vagrantfile

and more.... see pic...
- **2017-07-12** @linkks: This is a critical vulnerability, it reveals source files including rca keys, source files and file code, as well as configuration files
- **2017-07-12** @linkks: Example private key!

http://54.255.134.3:443/wp-content/themes/ansible/roles/common/files/id_rsa



-----BEGIN RSA PRIVATE KEY-----
[REDACTED KEY BODY - see source report]
-----END RSA PRIVATE KEY-----
- **Report Severity Updated**
- **Report Severity Updated**
- **2017-07-12** @grabsecurity: Hi @linkks,

Can you verify if this issue has been fixed?
- **2017-07-12** @linkks: @grabsecurity Yes fix. Bounty? Swag?
- **Report Resolved**
- **2017-07-13** @linkks: @grabsecurity swag? disclosure limit?
- **2017-07-14** @linkks: @grabsecurity reward?
- **Agreed On Going Public**
- **2017-07-15** @linkks: @grab
- **Bounty Awarded**
- **2017-07-16** @linkks: Hi @ditesh Why such a small award after all, so I read your key and there were other source files visible
- **Report Became Public**
