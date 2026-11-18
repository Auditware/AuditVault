---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/uncontrolled-resource-consumption
  - env/web
  - stack/node
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
body: true
date: 2019-08-16
submitted: 2019-05-24T20:53:30.231Z
bounty_usd: null
votes: 9
cve: []
program: "[[programs/nodejs|Node.js]]"
reporter: "jasnell"
source: "https://hackerone.com/reports/589739"
title: "Multiple HTTP/2 DOS Issues"
---
# Multiple HTTP/2 DOS Issues

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 9 | **Program:** Node.js | **Disclosed:** 2019-08-16

- Report: [https://hackerone.com/reports/589739](https://hackerone.com/reports/589739)
- CWE: Uncontrolled Resource Consumption
- Submitted: 2019-05-24T20:53:30.231Z

## Report summary

A security researcher conducted a broad survey of HTTP/2 implementations to investigate common Denial of Service attack vectors. The Node.js implementation was been found to be subject to a number of these issues.

Specifically:

Data Dribble Attack: "This program will request 1MB of data from a specified resource. It will request this same resource over 100 streams (so, 100MB total). It manipulates window sizes and stream priority to force the server to queue the data in 1-byte chunks."

Ping Flood (nginx variant): "Nginx and libnghttp2 (used by Apache, Tomcat, node.js, and others) has a 10K-message limit on the number of control messages it will queue. Sending a controlled number of messages may enable an attacker to force the server to hold 10K messages in memory..."

Resource Loop: "(actually, it should be called “Priority Shuffling”): This program continually shuffles the priority of streams in a way which causes substantial churn to the priority tree. Node.js [is] particularly impacted."

Reset Flood: "This opens a number of streams and sends an invalid request over each stream. In some servers, this solicits a string of stream RSTs. In [Node.js] the servers may queue the RSTs internally until they run out of memory."

O-Length Headers Leak: "This sends a stream of headers with a 0-length header name and 0-length header value. [Node.js] allocates memory for these headers and keeps the allocation alive until the session dies. Because the names and values are 0 bytes long, the cumulative length never exceeds the header size limit."

Internal Data Buffering: "This opens the HTTP/2 window so the server can send without constraint; however, it leaves the TCP window closed so the server cannot actually write (many of) the bytes on the wire. Then, the client sends a stream of requests for a large response object which the target queues internally. This appears to work to create a long-ish standing queue in node.js"

Each is a distinct issue that will need to be looked at individually. I've edited the descriptions to remove references to vulnerabilities in other HTTP/2 implementations that have not yet been disclosed.

Additional details from the report:

“Data Dribble” on node.js: node.js seems to queue the data internally. For a 1MB output file
requested 100 times in parallel fast enough that node.js is constantly processing input,
node.js’s RSS rises by 808MB and then falls by 120MB (for an aggregate rise of 688MB).
(Actually, it looks like the numbers vary a bit across tests, but I think the end result is “a lot”.)
However, node.js does not have the excess CPU utilization which Nginx exhibits. If you
instead delay the sends considerably so that node.js has time to try to send in the meantime, it
looks like node.js will kill off the session before the input queue grows more than a few
hundred MB.

“Internal Data Buffering” on node.js: For a 1MB output file requested 100 times in parallel
(but sent with 24 requests per SSL frame), node.js behaves in an interesting way. It appears to
buffer some, but not all, data internally. It seems to continue reading (and processing requests
and queueing data to satisfy those requests) for as many streams as it can until it can’t read
any more. Once it can’t read anymore, it appears to try to write and realize the writing is
blocked. At that point, it seems to switch to reading frames from the wire and queuing the
requests internally (without processing them). (All of this is conjecture and is based on what
I’ve observed rather than a detailed analysis of the code.) So, if you pack the 100 requests
into a single SSL frame, node.js’s RSS increases by approximately 246MB. Or, if you send
585 requests in a single SSL frame, node.js’s RSS increases by approximately 1,296MB. For
reasons that are not entirely clear to me, if you send 100K requests each on three different
connections (approximately 2.8MB of request data per connection, node.js will run out of
memory and crash. The other interesting thing that happens is on the session ending. When
the session ends, it looks like node.js temporarily starts reading everything which is left in the
input queue, tries to process the requests, and store the request output in memory. So,
sending 100,000 requests (approximately 2.8MB of request data) and then closing the
connection can make node.js temporarily use 12GB of RSS.

Resource Loop on node.js: Over the loopback interface, node.js can handle roughly ~10 Mb/s
before the assigned thread uses 100% of its CPU core (on an m5.24xlarge). RSS rose from
50MB at the start of the test to 236MB by the end of test (~3 minutes). RSS rose another
156MB when a second stream was added. With two streams, serving of content to another
(non-attacking) connection was severely impacted.

Zero-length Headers on node.js: With truly 0-length headers (i.e. the payload is 0 bytes), the
server will accept and process an unlimited number; however, they don’t seem to create a
standing queue on the server side. The processing overhead is much lighter than the
“Resource Loop” test. (Roughly 25 Mb/s only produces a 75% CPU load on the server.) With
0-length headers which are Huffman encoded into 1-byte or greater headers, the server input
for that socket (and only that socket) seems to get blocked for ~ 2 minutes, until the
connection is killed off. It appears that the server will hold the connection open even if the
client goes away. That behavior allows a different kind of DoS attack (exhaust server file
descriptors or kernel receive buffers).

Reset Flood on node.js: The server queue grows without an obvious bound until the
connection dies or the server runs out of memory and dies. After the connection ends, the
server is unresponsive while GC runs

Impact:

Multiple denial of service vectors.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

A security researcher has conducted a broad survey of HTTP/2 implementations to investigate common Denial of Service attack vectors. The Node.js implementation has been found to be subject to a number of these issues. (On the plus side, we're not the only ones! ;-) ...)

This work is still under embargo and has not yet been disclosed. 

Specifically:

* Data Dribble Attack: "This program will request 1MB of data from a specified resource. It will request this same resource over 100 streams (so, 100MB total). It manipulates window sizes and stream priority to force the server to queue the data in 1-byte chunks."

* Ping Flood (nginx variant):  "Nginx and libnghttp2 (used by Apache, Tomcat, node.js, and others) has a 10K-message limit on the number of control messages it will queue. Sending a controlled number of messages may enable an attacker to force the server to hold 10K messages in memory..."

* Resource Loop: "(actually, it should be called “Priority Shuffling”): This program continually shuffles the priority of streams in a way which causes substantial churn to the priority tree. Node.js [is] particularly impacted."

* Reset Flood: "This opens a number of streams and sends an invalid request over each stream. In some servers, this solicits a string of stream RSTs. In [Node.js] the servers may queue the RSTs internally until they run out of memory."

* O-Length Headers Leak: "This sends a stream of headers with a 0-length header name and 0-length header value. [Node.js] allocates memory for these headers and keeps the allocation alive until the session dies. Because the names and values are 0 bytes long, the cumulative length never exceeds the header size limit."

* Internal Data Buffering: "This opens the HTTP/2 window so the server can send without constraint; however, it leaves the TCP window closed so the server cannot actually write (many of) the bytes on the wire. Then, the client sends a stream of requests for a large response object which the target queues internally. This appears to work to create a long-ish standing queue in node.js"

Each is a distinct issue that will need to be looked at individually. I've edited the descriptions to remove references to vulnerabilities in other HTTP/2 implementations that have not yet been disclosed.

---

Additional details from the report:

```
“Data Dribble” on node.js: node.js seems to queue the data internally. For a 1MB output file
requested 100 times in parallel fast enough that node.js is constantly processing input,
node.js’s RSS rises by 808MB and then falls by 120MB (for an aggregate rise of 688MB).
(Actually, it looks like the numbers vary a bit across tests, but I think the end result is “a lot”.)
However, node.js does not have the excess CPU utilization which Nginx exhibits. If you
instead delay the sends considerably so that node.js has time to try to send in the meantime, it
looks like node.js will kill off the session before the input queue grows more than a few
hundred MB.

“Internal Data Buffering” on node.js: For a 1MB output file requested 100 times in parallel
(but sent with 24 requests per SSL frame), node.js behaves in an interesting way. It appears to
buffer some, but not all, data internally. It seems to continue reading (and processing requests
and queueing data to satisfy those requests) for as many streams as it can until it can’t read
any more. Once it can’t read anymore, it appears to try to write and realize the writing is
blocked. At that point, it seems to switch to reading frames from the wire and queuing the
requests internally (without processing them). (All of this is conjecture and is based on what
I’ve observed rather than a detailed analysis of the code.) So, if you pack the 100 requests
into a single SSL frame, node.js’s RSS increases by approximately 246MB. Or, if you send
585 requests in a single SSL frame, node.js’s RSS increases by approximately 1,296MB. For
reasons that are not entirely clear to me, if you send 100K requests each on three different
connections (approximately 2.8MB of request data per connection, node.js will run out of
memory and crash. The other interesting thing that happens is on the session ending. When
the session ends, it looks like node.js temporarily starts reading everything which is left in the
input queue, tries to process the requests, and store the request output in memory. So,
sending 100,000 requests (approximately 2.8MB of request data) and then closing the
connection can make node.js temporarily use 12GB of RSS.

Resource Loop on node.js: Over the loopback interface, node.js can handle roughly ~10 Mb/s
before the assigned thread uses 100% of its CPU core (on an m5.24xlarge). RSS rose from
50MB at the start of the test to 236MB by the end of test (~3 minutes). RSS rose another
156MB when a second stream was added. With two streams, serving of content to another
(non-attacking) connection was severely impacted.

Zero-length Headers on node.js: With truly 0-length headers (i.e. the payload is 0 bytes), the
server will accept and process an unlimited number; however, they don’t seem to create a
standing queue on the server side. The processing overhead is much lighter than the
“Resource Loop” test. (Roughly 25 Mb/s only produces a 75% CPU load on the server.) With
0-length headers which are Huffman encoded into 1-byte or greater headers, the server input
for that socket (and only that socket) seems to get blocked for ~ 2 minutes, until the
connection is killed off. It appears that the server will hold the connection open even if the
client goes away. That behavior allows a different kind of DoS attack (exhaust server file
descriptors or kernel receive buffers).

Reset Flood on node.js: The server queue grows without an obvious bound until the
connection dies or the server runs out of memory and dies. After the connection ends, the
server is unresponsive while GC runs
```

## Impact

Multiple denial of service vectors.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2019-05-24** @jasnell: I have verified the vulnerabilities here. I am in contact with the reporter and will be coordinating the communication with them.
- **2019-05-24** @jasnell: Thinking about possible mitigations for each of the issues...

```
Data Dribble Attack: "This program will request 1MB of data from a specified
resource. It will request this same resource over 100 streams (so, 100MB total).
It manipulates window sizes and stream priority to force the server to queue
the data in 1-byte chunks."
```

We have partial mitigation for this one already with the limits on the amount of memory a session is permitted to hold. There is, however, more that can be done. It is perfectly legitimate to have a window size of 1-byte every now and then during the course of a session but sustained 1-byte sends are a red flag. To mitigate this attack, we can implement a minimum throughput per session. If a suspiciously low throughput is sustained over multiple write operations, the session can be torn down.

```
Ping Flood (nginx variant): "Nginx and libnghttp2 (used by Apache, Tomcat, node.js, and others)
has a 10K-message limit on the number of control messages it will queue. Sending a controlled
number of messages may enable an attacker to force the server to hold 10K messages in memory..."
```

Node.js already implements mitigations against ping flood attacks. It would appear that this particular variant does not trigger those because of an issue within nghttp2, but I could be wrong. This one will require more investigation but we may have to wait until the fix is available in nghttp2.

```
Resource Loop: "(actually, it should be called “Priority Shuffling”): This program continually
shuffles the priority of streams in a way which causes substantial churn to the priority tree.
Node.js [is] particularly impacted."
```

This one is going to require some thinking about. No mitigation yet.

```
Reset Flood: "This opens a number of streams and sends an invalid request over each
stream. In some servers, this solicits a string of stream RSTs. In [Node.js] the servers may
queue the RSTs internally until they run out of memory."
```

There are two possible mitigations here:

1. We try to send RST's faster without buffering them or
2. We automatically tear down sessions that have a high number of RSTs

(or both)

```
O-Length Headers Leak: "This sends a stream of headers with a 0-length header
name and 0-length header value. [Node.js] allocates memory for these headers
and keeps the allocation alive until the session dies. Because the names and
values are 0 bytes long, the cumulative length never exceeds the header size limit."
```

This one will be fairly easy to mitigate by making sure we are not allocating memory for 0-length headers.

```
Internal Data Buffering: "This opens the HTTP/2 window so the server can send
without constraint; however, it leaves the TCP window closed so the server cannot
actually write (many of) the bytes on the wire. Then, the client sends a stream of requests
for a large response object which the target queues internally. This appears to work to
create a long-ish standing queue in node.js"
```

This one just highlights what we've already known: the internal buffering in the HTTP/2 implementation needs to be iterated on and improved to avoid the backup. Essentially, we need to implement back-pressure from the TCP socket up.
- **2019-05-25** @mcollina: How do we plan to work on those? James, would you be able to tackle them or do you need some help? Have you got some repro scripts that we can use?

Are you in contact with the nghttp2 author regarding the disclosure & fix of that? I think it would be good to coordinate releases.
- **2019-05-25** @jasnell: Help is definitely appreciated. I'll do what I can tho.

I am in contact, yes. Coordinating the release is going to be complicated because the report was made to *many* implementations and the reporter is asking that none release before the others. To give you an idea of the scope, this impacts go, nginx, Apache, and others.
- **Not Eligible For Bounty**
- **2019-07-09** @jasnell: Just a reminder, this still needs to be worked on. I've been on PTO and otherwise largely unavailable. I wont be able to look at this in detail until next week. It would be great to have others helping so we can get these issues fixed before disclosure
- **2019-07-11** @trott: Is there enough information here for someone else to work on it? If someone steps up to work on it, can we put them in touch with the reporter or something in case they have questions or want exploit code so they can test their fixes etc.?

The zero-length header one seems like there's enough info already here for sure. But I'm less certain about the other ones.
- **2019-07-11** @addaleax: Hm yeah, I’ll assume that I’m one of the best people to look at this while James is unavailable (and tbh he also asked me to do that a while ago), so I’ll make this a priority for me and spend time on this tomorrow and on the weekend.

That being said – a lot of these revolve around low-level details of the protocol that I don’t fully grasp (yet). I do agree that the zero-length header one is well-defined enough to write a (simple) patch to address it.
- **2019-07-14** @addaleax: So far:

1. For most of these issues, it would be very very helpful to have reproduction code to work and test with. I haven’t done that yet, and it might not be easy to get this done with Node itself because of how much state nghttp2 manages for us.
2. A lot of this boils down to our memory tracking code not being very good. Improving both the way in which we track allocations and making it close to accurate, and improving the way with which we react to exceeding that limit, is probably the best solution here. This is not going to be trivial, esp. when it comes to making guesses about how it’s going to impact our users.
- **2019-07-31** @jasnell: @addaleax ... if you have keybase, I can add you the keybase chat for the larger vulnerability discussion
- **2019-07-31** @addaleax: @jasnell I do, same handle as everywhere and just followed you there. :)
- **2019-08-07** @addaleax: So, to give an update: I’m unfortunately lagging behind a bit with working on this. I’ve looked into all of the issues at least to some degree, but I won’t have much time until Friday to start working on actual patches, and I assume we’d want to discuss them in review before releasing them.

That makes the approaching current disclosure date of August 13th (Tuesday), which I don’t think has been mentioned here before, a bit close. I don’t think we’ve prepared anything in terms of security releases, so I’m not sure how that is going to go? Do we want that to be our own deadline?

I also unfortunately won’t be able to join the TSC meeting today.
- **2019-08-10** @addaleax: > If we ask for more time, it means delaying planned security releases in a number of other projects. That may be a hard sell, but I suppose we could ask. (James would have to say for sure, I think, as he's the one who has been in touch with the coordinators here. 

Yeah, I think that’s accurate.

> At least, I don't think anyone else on the Node.js side has.)

I have been added to the keybase chat mentioned above ~10 days ago. I don’t know who the reporter/person “in charge” of the deadline is, though.
- **2019-08-15** @octetcloud: Fixes for this have been released for almost all platforms (Linux ARMv6 for 8.x is still building): https://nodejs.org/en/blog/vulnerability/aug-2019-security-releases/
- **2019-08-16** @jasnell: Yes, this can be closed and made public.
- **Report Severity Updated**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
