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
body: true
date: 2023-03-15
submitted: 2023-02-21T11:13:54.342Z
bounty_usd: null
votes: 30
cve: []
program: "[[programs/torproject|Tor]]"
reporter: "hazae41"
source: "https://hackerone.com/reports/1880610"
title: "Snowflake server: Leak of TLS packets from other clients"
---
# Snowflake server: Leak of TLS packets from other clients

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 30 | **Program:** Tor | **Disclosed:** 2023-03-15

- Report: [https://hackerone.com/reports/1880610](https://hackerone.com/reports/1880610)
- CWE: Information Disclosure
- Submitted: 2023-02-21T11:13:54.342Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
This issue is related to the Snowflake pluggable transport server. 
It seems Snowflake clients receive "ghost" packets at the KCP layer, that encapsulate TLS packets unrelated to the current session.
Those TLS packets are from other clients, and contain handshake record, application data, or other TLS stuff.

## Steps To Reproduce:
Just run a Snowflake client and it will start receiving ghost packets.

## Setting up KCP logging:

1. Git clone the Snowflake client
2. Open VSCode or similar editor
3. In the `torrc` file,  setup logging with `ClientTransportPlugin snowflake exec ./client -log snowflake.log`
4. Open `./lib/snowflake.go`, search `kcp.NewConn2`, right click then `Go to definition`
5. Search `readLoop`, right click then `Go to definition`
6. Right click on `defaultReadLoop` then `Go to definition`
7. Now just under the line where it says `s.conn.ReadFrom(buf)`, add the line `log.Println("kcp <-", buf)`
8. Now start Tor with Snowflake using `tor -f ./torrc`
9. Open `./snowflake.log`

## Inspecting

Notice that the KCP layer receive bytes not starting with the regular KCP header:

{F2187164}

`X X X X 81 0 255 255 ...`

4 little-endian bytes for the conversation ID, then 81/82 for the command, then 0, then 255 255 (little-endian) for the window size.

This is an issue because KCP packets, just like TCP packets, are segments, and are never segmented themselves.

So, KCP doesn't recognize those ghost packets and discard them.

In `Input`

{F2187165}

In `kcpInput`, which calls `Input`

{F2187166}

They are completely discarded and never reach the upper layer, that's why this has never been noticed.

So, what are those packets? 

Some look like SMUX packets: 

{F2187167}
 
`2 2 L L S 0 0 0`

2 for the SMUX version, 2 for the psh command, 2 little-endian bytes for the length, and 4 little-endian bytes for the stream.

By the way, the stream ID is always set to 3, which is a proof that those packets are from other clients, as if you change the default SMUX stream ID to something else (in the SMUX code), you will still receive those packets from stream 3.

 Some other look like KCP packets, but the conversation ID is not the same as other KCP packets:

{F2187168}

If you Cmd+F these bytes, you will not find any other occurence, so you never had this conversation ID, which is another proof that those packets are from other clients, and not from a previous connection.

Those KCP packets also contains a SMUX packet:

{F2187169}

Now, the creepy part is that both those packets contain TLS packets:

{F2187171}

{F2187172}

{F2187173}

20/21/22/23 for the record type (handshake, application data, ...), then 3 3 (big-endian) for the TLS version (which is 1.2), then the TLS fragment (encrypted if type 23)

{F2187174}

Notice that in the following screenshot, we have a ghost packet containing TLS application data (23) before our normal packets containing TLS handshake data (22)

{F2187175}

This is another proof that the ghost packets are from another TLS connection, as it would be impossible to get TLS application data before handshake data (except if renegociation, which is not the case here as it's a fresh new connection)

## Conclusion

All this leads to the conclusion that the Snowflake server is leaking TLS packets to clients from other clients.

This would still need further investigation: 
- Why is this occuring?
- Is the Snowflake client leaking too?
- Can we exploit this? To deanonymize people?

While we don't know those answers, this issue must be considered with high severity.

## Impact

Even if it seems we can't modify those packets or exploit the TLS protocol, this issue still needs further investigation in order to show its real impact, as it could possibly deanonymize users.

## Timeline

- **Report Filed**
- **2023-02-21** @hazae41: When setting up logging, just before step 8, you need to recompile using `go build`.
- **2023-03-10** @geko: Sorry for the delay. The comment posted below got added as an internal comment only, which we just realized:

Hi @hazae41 thanks for filing this.

Before I go into a bit more details, hackerone bounties are pretty strictly limited to core tor and tor browser code and don't include pluggable transports like snowflake. Your post was however very helpful to us for reasons I'll discuss.

### Segmentation of KCP

> This is an issue because KCP packets, just like TCP packets, are segments, and are never segmented themselves.

This should generally be true, and the KCP state machine relies on it. However, in our case it is not true and that looks to be the cause of a lot of the anomalies you're seeing here. I have some theories about why this is happening. Despite the fact that we use `net.PacketConn` at the server and client to send and receive data, the proxy in the middle does not make use of this interface when dealing with proxied network traffic. Instead, both the standalone and browser proxy is reading data from both directions into the application and then writing it back out again using connection stream logic which erases the strict packet boundaries we need in order for a reliability protocol like KCP to work.

I'm going to create an issue for this in our gitlab repo to investigate this further and address it. Do you have a Gitlab account that I can tag to give you credit? Or otherwise a name/nickname that you prefer used?

### Other anomalies

Some of your other findings aren't fully explained by the segmentation issue. Particularly:

- KCP packets that begin with what looks like a KCP header but an unknown conv ID
- Stream ID of 3

There's not enough information here for the findings to be definitive and I'm curious to learn more. Running snowflake with your patch to the KCP library myself I was able to reproduce the segmentation issues and I saw multiple KCP conv IDs, however, these conv IDs all belonged to my client and corresponded to the multiple KCP sessions that were opened due to the torrc file containing multiple bridge lines.

It's up to you whether you want to pursue this further knowing that this doesn't qualify for the bounty program. 

The missing information here includes the full snowflake log (not just partial screenshots of it) and the torrc file and tor log. 

For the Stream ID, I'm curious about what the patch you used looks like and whether your log still has messages of the form:

`2023/03/08 18:49:38 ---- SnowflakeConn: begin stream 3 ---`

I'm also curious about how often this occurs. Is it basically every time you run snowflake you get a conv ID you don't recognize (from a KCP packet that starts with what actually looks like a KCP header)? Or did it take a lot of trials to end up with this?

I'll continue looking into this to see if I can reproduce it as well.

Again, I'm appreciative of the attention you've called to this. If we're able to fix the KCP segmentation issue it could improve the performance of Snowflake.
- **2023-03-10** @hazae41: By the way, my GitLab id is @hazae41  

## KCP

As you said, some KCP bytes seem to be segments of segments, and I think it's another issue, maybe it's unrelated to the current issue of leaking TLS.

For the actual KCP segments, some may be from previous sessions, but most of them are from other clients. For me I receive those ghost packet quite often, but maybe it depends from the time of the day and the number of clients connected? 

Try to repeat the following multiple times to be sure you get enough ghost packets:
- Start Tor with Snowflake and logging
- Make a request (e.g. with curl --socks5)
- Kill Tor

## SMUX

For changing the SMUX stream ID, you have to open `smux/session.go` then inside `newSession` modify the starting stream ID to an odd number, 5 should be good:

```
if client {
		s.nextStreamID = 5
```

This will give you an actual stream ID of 7 since SMUX does `id = nextStreamID + 2` in `OpenStream()`

If you did it correctly, you will see the log

`2023/03/08 18:49:38 ---- SnowflakeConn: begin stream 7 ---`

Then in the logs you will still start seeing packets with your stream ID of 7, the SMUX packet looks like `2 2 X X 7 0 0 0` (try to Cmd+F it).

{F2219667}

And you will still see other packets with stream ID of 3

{F2219668}

If you didn't make any traffic with stream ID 3 before, this would prove it's from other clients.

## Logs

Here is the full snowflake.log 

{F2219673}

torrc (it's the default torrc from git clone)

{F2219675}

tor.log

{F2219677}
- **2023-03-10** @cohosh: @hazae41 thanks! I've made a confidential issue in gitlab and am working on this. I really appreciate your help here!
- **Report Triaged**
- **Report Resolved**
- **Swag Awarded**
- **2023-03-14** @hazae41: No problem, can we make this issue public now?
- **2023-03-14** @cohosh: The issue on gitlab is public now. We're in the process of writing a security advisory for the Tor forum.
- **Agreed On Going Public**
- **Manually Disclosed**
- **Not Eligible For Bounty**
