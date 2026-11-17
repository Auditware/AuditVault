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
date: 2024-06-25
submitted: 2024-01-08T14:54:36.153Z
bounty_usd: null
votes: 24
cve: []
program: "[[programs/rails|Ruby on Rails]]"
reporter: "ooooooo_q"
source: "https://hackerone.com/reports/2307813"
title: "DoS with crafted 'Range' header"
---
# DoS with crafted "Range" header

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 24 | **Program:** Ruby on Rails | **Disclosed:** 2024-06-25

- Report: [https://hackerone.com/reports/2307813](https://hackerone.com/reports/2307813)
- CWE: N/A
- Submitted: 2024-01-08T14:54:36.153Z

## Timeline

- **Report Filed**
- **2024-01-13** @ooooooo_q: I have confirmed that `ActiveStorage::DiskController` is affected the same because it uses `Rack::Files`.
This can be reproduced by changing the url set in `range_request.rb`.

https://github.com/rails/rails/blob/v7.1.2/activestorage/app/controllers/active_storage/disk_controller.rb#L7

```ruby
class ActiveStorage::DiskController < ActiveStorage::BaseController
  include ActiveStorage::FileServer
```

https://github.com/rails/rails/blob/v7.1.2/activestorage/app/controllers/concerns/active_storage/file_server.rb#L5

```ruby
module ActiveStorage::FileServer # :nodoc:
  private
    def serve_file(path, content_type:, disposition:)
      ::Rack::Files.new(nil).serving(request, path).tap do |(status, headers, body)|
```  


However, the load seems to be a fraction of the same file compared to proxy, perhaps due to differences in implementation.

access `/rails/active_storage/disk/xxx`

```
❯ /usr/bin/time -l bundle exec rails s
...
           217710592  maximum resident set size
                      ...
           191448960  peak memory footprint
```           

access `/rails/active_storage/blobs/proxy/xxx`

```
❯ /usr/bin/time -l bundle exec rails s
...
          1055211520  maximum resident set size
                      ...
           935448192  peak memory footprint
```
- **2024-01-14** @ooooooo_q: I created the patch.

Since range was supported from Rails7.0 ( https://github.com/rails/rails/commit/fe4ec2ac0c131013090d9f36bceb3ce4a084af82 ), it did not affect 6.1.

{F2980169}
{F2980168}
- **2024-01-20** @ooooooo_q: The patch above was not formatted well enough for `git format-patch`, so a corrected version is attached.
{F2992862}
{F2992861}
- **2024-01-20** @ooooooo_q: I also created a patch for rack.

{F2992906}
{F2992905}
- **Report Triaged**
- **2024-02-13** @tenderlove: @ooooooo_q I modified the patch a bit so that we only have to patch Rack (instead of patching both Rack and Rails). Do you mind taking a look?

Thanks

{F3048313}
- **2024-02-14** @ooooooo_q: @tenderlove It looks good.
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
