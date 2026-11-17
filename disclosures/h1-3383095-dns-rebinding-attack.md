---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/server-side-request-forgery-ssrf
  - env/network
substate: "informative"
weakness: "Server-Side Request Forgery (SSRF)"
enriched: true
date: 2025-10-19
submitted: 2025-10-14T16:25:30.902Z
bounty_usd: null
votes: 42
cve: []
program: "[[programs/arkadiyt-projects|arkadiyt-projects]]"
reporter: "newby99"
source: "https://hackerone.com/reports/3383095"
title: "DNS Rebinding Attack"
---
# DNS Rebinding Attack

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 42 | **Program:** arkadiyt-projects | **Disclosed:** 2025-10-19

- Report: [https://hackerone.com/reports/3383095](https://hackerone.com/reports/3383095)
- CWE: Server-Side Request Forgery (SSRF)
- Submitted: 2025-10-14T16:25:30.902Z

## Timeline

- **Report Filed**
- **2025-10-14** @arkadiyt: This is handled by the `ipaddr=` option: https://github.com/arkadiyt/ssrf_filter/pull/73/files#diff-95bca3ab492cb05975c93fdbbd14a18288350481b2f06307f2699fdd3fdb17d6R187

Were you able to reproduce this? Otherwise I'm inclined to close as N/A
- **2025-10-14** @newby99: Hi,

v1.1.2 (the gem on RubyGems) is secure, but not because of `ipaddr:`.

It's secure because of line 178:
```
uri.hostname = ip
```

This line **modifies the URI object** before passing it to Net::HTTP, so even though the code says `Net::HTTP.start(uri.hostname, ...)`, it actually uses the IP.

**However, v1.3.0 (current main) has a regression bug.**

When PR #73 added the `ipaddr:` option, it also **removed** the `uri.hostname = ip` line. Now Net::HTTP receives the hostname directly, which allows DNS rebinding.

I've verified locally that `ipaddr:` doesn't prevent DNS resolution:
```
Net::HTTP.start('google.com', 80, ipaddr: '8.8.8.8') { |h| h.get('/') }
# This SUCCEEDS and returns Google's homepage
# Proving it connected to google.com's real IP, not 8.8.8.8
```

**The fix:** Restore line 178 from v1.1.2:
```
hostname = uri.hostname
uri.hostname = ip  # <= This line was removed, needs to be restored
```

v1.1.2 already had it right. The `ipaddr:` option can stay, but `uri.hostname = ip` is what actually prevents the attack.


You can test with this script
```
#!/usr/bin/env ruby
require 'ssrf_filter'
require 'net/http'
require 'ipaddr'

puts "="*80
puts "SSRF_FILTER: DNS REBINDING VULNERABILITY DEMONSTRATION"
puts "Testing v1.1.2 Security vs Current Main Branch Regression"
puts "="*80

# ============================================================================
# PART 1: Test v1.1.2 (SAFE)
# ============================================================================

puts "\n" + "="*80
puts "PART 1: Testing v1.1.2"
puts "="*80

puts "\nInstalled version: #{SsrfFilter::VERSION}"

# Simulate DNS rebinding attack
class EvilDNS
  def initialize
    @call_count = 0
  end
  
  def resolve(hostname)
    @call_count += 1
    
    if @call_count == 1
      ip = '8.8.8.8'
      puts "[DNS Query ##{@call_count}] #{hostname} -> #{ip} (public, validation passes)"
      [IPAddr.new(ip)]
    else
      ip = '127.0.0.1'
      puts "[DNS Query ##{@call_count}] #{hostname} -> #{ip} (localhost, should fail)"
      [IPAddr.new(ip)]
    end
  end
end

# Intercept to see what Net::HTTP receives
module NetHTTPMonitor
  def start(address, port, *args, &block)
    puts "\n[NET::HTTP RECEIVES]"
    puts "  address: #{address.inspect}"
    puts "  port: #{port}"
    
    if address =~ /^\d+\.\d+\.\d+\.\d+$/
      puts "  SAFE: Received IP address directly"
      puts "  DNS rebinding PREVENTED (no hostname to re-resolve)"
    else
      puts "  VULNERABLE: Received hostname"
      puts "  Can trigger new DNS lookup -> DNS rebinding possible"
    end
    
    raise "[Test Complete] Would connect to #{address}:#{port}"
  end
end

Net::HTTP.singleton_class.prepend(NetHTTPMonitor)

puts "\n" + "-"*80
puts "Test: Making request to 'evil.com' with DNS rebinding simulator"
puts "-"*80

dns = EvilDNS.new

begin
  SsrfFilter.get('http://evil.com:6379', resolver: dns.method(:resolve))
rescue => e
  puts "\nResult: #{e.message}"
end

puts "\n" + "="*80
puts "CONCLUSION FOR v1.1.2:"
puts "="*80
puts "Net::HTTP received '8.8.8.8' (the validated IP)"
puts "The library does: uri.hostname = ip (line 178)"
puts "This prevents DNS rebinding attacks"
puts "Version 1.1.2 is SECURE"

# ============================================================================
# PART 2: Simulate current main branch (VULNERABLE)
# ============================================================================

puts "\n\n" + "="*80
puts "PART 2: Simulating Current Main Branch Behavior"
puts "="*80

puts "\nCurrent main branch removed the 'uri.hostname = ip' line"
puts "and only added 'ipaddr: ip' to options."

# Reset Net::HTTP monitoring
Net::HTTP.singleton_class.class_eval do
  undef start if method_defined?(:start)
end

class << Net::HTTP
  def start(address, port, *args, &block)
    opts = args[0] || {}
    
    puts "\n[NET::HTTP RECEIVES - Current Main Behavior]"
    puts "  address: #{address.inspect}"
    puts "  port: #{port}"
    puts "  options[:ipaddr]: #{opts[:ipaddr].inspect}"
    
    if address =~ /^\d+\.\d+\.\d+\.\d+$/
      puts "  SAFE: IP address"
    else
      puts "  VULNERABLE: Hostname '#{address}'"
      puts "  Even with ipaddr='#{opts[:ipaddr]}', Net::HTTP will resolve '#{address}'"
      puts "  DNS rebinding attack possible"
    end
    
    raise "[Test Complete] Would connect to #{address}:#{port}"
  end
end

# Simulate current main branch behavior
def simulate_current_main_fetch(uri, validated_ip)
  puts "\n" + "-"*80
  puts "Simulating: Current main branch fetch_once()"
  puts "-"*80
  
  puts "\nCode in current main:"
  puts "  http_options = {use_ssl: ..., ipaddr: validated_ip}"
  puts "  Net::HTTP.start(uri.hostname, uri.port, **http_options)"
  puts ""
  puts "Notice: uri.hostname is NOT replaced with validated_ip"
  
  http_options = {
    use_ssl: uri.scheme == 'https',
    ipaddr: validated_ip
  }
  
  puts "\nCalling Net::HTTP.start with:"
  puts "  uri.hostname = #{uri.hostname.inspect}"
  puts "  validated_ip = #{validated_ip.inspect}"
  
  Net::HTTP.start(uri.hostname, uri.port, **http_options)
end

uri = URI('http://evil.com:6379')
validated_ip = '8.8.8.8'

begin
  simulate_current_main_fetch(uri, validated_ip)
rescue => e
  puts "\nResult: #{e.message}"
end

puts "\n" + "="*80
puts "CONCLUSION FOR CURRENT MAIN:"
puts "="*80
puts "Net::HTTP received 'evil.com' (the hostname, not IP)"
puts "The library removed: uri.hostname = ip"
puts "Only added: ipaddr: ip (which doesn't prevent DNS resolution)"
puts "Current main branch has REGRESSION - DNS rebinding possible"

# ============================================================================
# PART 3: Proof that ipaddr doesn't prevent DNS resolution
# ============================================================================

puts "\n\n" + "="*80
puts "PART 3: Proof that 'ipaddr:' Option Doesn't Prevent DNS Resolution"
puts "="*80

# Remove monitoring
Net::HTTP.singleton_class.class_eval do
  undef start if method_defined?(:start)
end

require 'net/http'

puts "\nReal test with actual Net::HTTP:"
puts "-"*80

puts "\nTest: Connect to google.com with ipaddr='8.8.8.8'"
puts "  If ipaddr worked: timeout (8.8.8.8 doesn't serve HTTP)"
puts "  If it doesn't work: connects to google.com's real IP"

begin
  result = Net::HTTP.start('google.com', 80, 
                           ipaddr: '8.8.8.8',
                           open_timeout: 3,
                           read_timeout: 3) do |http|
    response = http.get('/')
    response.code
  end
  
  puts "\n  Result: HTTP #{result}"
  puts "  CONNECTED SUCCESSFULLY"
  puts "  This proves ipaddr was IGNORED"
  puts "  Net::HTTP resolved 'google.com' despite ipaddr='8.8.8.8'"
  
rescue Net::OpenTimeout, Errno::ETIMEDOUT
  puts "\n  Result: Timeout"
  puts "  This would mean ipaddr worked (but it doesn't)"
rescue => e
  puts "\n  Result: #{e.class}"
  puts "  Error: #{e.message[0..80]}"
end

puts "\n" + "="*80
puts "FINAL SUMMARY"
puts "="*80

puts "\nVERSION COMPARISON:"
puts ""
puts "v1.1.2 (Installed):"
puts "  SECURE - Uses 'uri.hostname = ip' trick"
puts "  Net::HTTP receives validated IP directly"
puts "  No DNS rebinding possible"
puts ""
puts "Current Main Branch:"
puts "  VULNERABLE - Removed 'uri.hostname = ip'"
puts "  Net::HTTP receives hostname"
puts "  DNS rebinding attack possible"
puts "  'ipaddr:' option doesn't prevent DNS resolution"

puts "\n" + "="*80
puts "Test complete"
puts "="*80
```

PS: Part 3 of the test script demonstrates the behavior conceptually. 
The key evidence is in Part 1 vs Part 2, even with ipaddr: set, Net::HTTP's first parameter determines what gets  resolved. Passing 'evil.com' allows DNS rebinding regardless of the ipaddr option.

hope it helps.
- **2025-10-15** @arkadiyt: ```
Net::HTTP.start('google.com', 80, ipaddr: '8.8.8.8') { |h| h.get('/') }
```
^ that just times out for me.

If I try this:
```
Net::HTTP.start('https://google.com', 443, ipaddr: '8.8.8.8', use_ssl: true) { |h| h.get('/') }
```
then it gets a certificate error because 8.8.8.8 doesn't have a cert for google.com:
{F4893785}
- **2025-10-15** @arkadiyt: You're probably testing against an old version of ruby. `ipaddr=` was added in ruby 2.7 which is the minimum supported version of the gem. When I still supported ruby 2.6 I had some other protections for this, as you saw
- **2025-10-15** @newby99: Hi @arkadiyt 
Thanks for the response. I've done some thorough testing with both Ruby 2.6.10 and Ruby 3.3.0 to verify the behavior across versions.

In Ruby 2.6.10, the ipaddr parameter is completely ignored - I confirmed that Net::HTTP.start('google.com', 80, ipaddr: '8.8.8.8') successfully connects to google.com's real IP instead of timing out on 8.8.8.8. However, v1.1.2 is still secure on Ruby 2.6 because it uses the uri.hostname = ip approach before passing to Net::HTTP.

I then tested with Ruby 3.3.0 and v1.3.0 from the main branch. Good news: the ipaddr parameter works correctly in Ruby 3.3.0 and does prevent DNS resolution. However, my testing shows that v1.3.0 passes the original hostname (like "evil.com") to Net::HTTP rather than the validated IP, relying entirely on the ipaddr parameter for protection. I verified this by intercepting the Net::HTTP.start call and confirming it receives the hostname as the address parameter.

So you're right that v1.3.0 is secure, and I see you've bumped the minimum Ruby version to 2.7.0 in the gemspec, which addresses the Ruby 2.6 vulnerability. That said, I'd recommend considering a defense-in-depth approach by restoring the uri.hostname = ip line from v1.1.2 alongside the ipaddr parameter. This would provide two independent layers of protection - even if there's ever a bug in Ruby's ipaddr implementation or someone uses a different HTTP client, the hostname replacement would still prevent DNS rebinding. It's a minimal code change that significantly strengthens the security posture.

Thank you, and feel free to close this report!
- **Report Informative**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
