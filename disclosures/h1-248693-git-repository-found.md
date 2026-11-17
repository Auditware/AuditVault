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
█████+4wfMps2+OGjs
lO9QijlVf+duROmWInH+███
wuMLK0QtKHBcNn2BhTVfkYKv802jo8w+vtJ4LFFWaHp8XdMnvxeVUowDPQc3RAXs
RvgIGEDmQNv40zJHtU8ywcqTIJxPfNKeDLbkQmvTJr6xUpwRk9e1dujA16gcFBli
BnORTfydCnPS50pLJfjLn+tzN4TNyYw12+8IdfMAaZr7vvbeZDLYQjcpOgU0imTa
████/UC8zY3
jDEY9zizOseeOC648LOVWgSb61w96mWngrp6Xb5O/2KOrL+JwjHYpARmzooEoyD7
XaGYPnvd4i5blkN85kdLIhKfwtmSKrl2l2urB/m1QGQsWBRjAdSPzL7he/NmSUfj
X5XA/YX6/RRTiGr9Qi+4Yiv0pqMb+T7Ev6AXgbdqvBNZm3iaQVmhMnXt77TAgo3f
MPBu0Z3EHzAfw31oRzZZfpPeyULNf2cGHZP+HQWZ8ZmxHBN7pJiX+0ULYcP9BLct
S2zFJZ8ZeH4hu3tZESO9/SPUxK/qfEIkWS+ZYjhJc4VgnBpJPAJlFSyLpz4DbWr9
8kmFR/UCgYEA+gX/a5tra1fnsKmgDSbdXcInwWUL2lcccryk4aJCS8ld6mkQl2i+
dmulnOFt+ktAJA9aJ5qKHfOPZ4jdfpasZ/ocA4A/bVSX4UgeCEs6lSKX35P6z6X8
CFoPWzfIIPpAvJO/FOYeXpscOg37JZINMWM9jUhLA3MrJRIl29bMq/sCgYEA2/nl
ZzJ089ghNC+efnAS1E2RNkIeQcX80QN4E8QAv/fVZBNQjfs11dybwC1hjg5jB58d
suz/█████████
XOyQBKeSqnv0yflrdE4xbsy0qbxQdpTt6P0F3L8CgYEA5WZJY48XcUcXctU/37FQ
HK1+0ogG5w9UL8X8NnYtA+I/hEtgCLv3PSopqxZ/VM5kjHF1k67MmQyXADTonTRb
/Y7S0zeBeqvKKs6Dl7KGjr1NwbrBvnIaHAOd4WD+A5v5d8zL3r4BEWaZ8H5Rd7hY
2H6oxA+████/ei3K+54fhd5l8QMMa92UWQfI2qG
tfF0WRDWvnarZihGtCInDKCevgeb/NjLx+Mgy2wzjfEjeYbmNfM5tHXul5LdbwyL
lfYNU1JJ3q6SfZAFds20JFPNw+UMY42A/eQNRcTnN5Rw7+eM/WFNP6NsFt5n43kK
UipBiQKBgA76/9mO9P+rjdRzI0QS4VjuTC+Nh/cBoEyoBZ3gOTqWQXADavo7H+AL
nEjtBYZRoEdPx2RyDX0laC2xHvZvXa6xqxoBu0eUSHwYmL6wB+Ecy2p/u7wy7zPO
8Pbv2bUz7yevVjf9x9/9xVGdsulAV/█████████
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
