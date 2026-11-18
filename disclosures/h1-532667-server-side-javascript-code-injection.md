---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/code-injection
  - env/web
  - stack/node
substate: "resolved"
weakness: "Code Injection"
enriched: true
body: true
date: 2019-10-03
submitted: 2019-04-09T15:23:13.508Z
bounty_usd: null
votes: 10
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "phra"
source: "https://hackerone.com/reports/532667"
title: "Server Side JavaScript Code Injection"
---
# Server Side JavaScript Code Injection

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 10 | **Program:** Node.js third-party modules | **Disclosed:** 2019-10-03

- Report: [https://hackerone.com/reports/532667](https://hackerone.com/reports/532667)
- CWE: Code Injection
- Submitted: 2019-04-09T15:23:13.508Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report a Service Side JavaScript Code Injection in `fastify`.
It allows an attacker that can control a single property name in the serialization schema to achieve Remote Command Execution in the context of the web server.

# Module

**module name:** fastify
**version:** 2.2.0
**npm page:** `https://www.npmjs.com/package/fastify`

## Module Description

> An efficient server implies a lower cost of the infrastructure, a better responsiveness under load and happy users. How can you efficiently handle the resources of your server, knowing that you are serving the highest number of requests as possible, without sacrificing security validations and handy development? Enter Fastify. Fastify is a web framework highly focused on providing the best developer experience with the least overhead and a powerful plugin architecture. It is inspired by Hapi and Express and as far as we know, it is one of the fastest web frameworks in town.

## Module Stats

39,119 downloads in the last week

# Vulnerability

## Vulnerability Description

> Description about how the vulnerability was found and how it can be exploited, how it harms package users (data modification/lost, system access, other.

## Steps To Reproduce:

> Detailed steps to reproduce with all required references/steps/commands. If there is any exploit code or reference to the package source code this is the place where it should be put.

## Patch

Escape `"`, `'` and ``` ` ``` in properties names in schema definition.

## Supporting Material/References:

> State all technical information about the stack where the vulnerability was found

- **OS:** Kali Rolling
- **NodeJS:** 11.9
- **NPM:** 6.5.0
- **fast-json-stringify:** 1.14.0

# Wrap up

> Select Y or N for the following statements:

- I contacted the maintainer to let them know: Y (sent message to Matteo Collina)
- I opened an issue in the related repository: N

## Impact

If an attacker can control somehow the schema definition, he/she can achieve arbitrary code execution as the user running the web server.

## Timeline

- **Report Filed**
- **2019-04-09** @api_xmgchqhv69rw1zem6733xop0tz: Hello,
Thanks for reporting this to us. Someone will quickly look at this report and triage it.
- **2019-04-09** @phra: # Vulnerability

## Description
`fastify` is using `fast-json-stingify` to serialize data in the response. This library is vulnerable to Server Side Code Injection, as shown in the attached poc. The only constrain for the attacker is to be able to control a field name in the schema definition.

## Steps To Reproduce:
- Run the attached `vuln-server.js`
`nodepoc-fastify.js`

- Prepare netcat on port 1337:
`nc -lvvp 1337`

- Send GET request to the server:
`curl 127.0.0.1`
- **External User Joined**
- **2019-04-09** @vdeturckheim: I added @mcollina to the report.
- **2019-04-10** @phra: I tried to patch the vulnerable library `fast-json-stringify` but I had hard time with it due to the fact that is a single file of ~1K lines and multiple points have to be updated without breaking the intended functionality.
The input is reflected 4 times in the generated script, as shown in the attached screenshot.
It would be nice if someone could help with fixing the library.
- **2019-04-11** @mcollina: This is not a vulnerability, but just a "bad" bug. The scope of fast-json-stringify is to generate a new function that is extremely fast on rendering json. That's what the library is for. Feel free to recommend some more text to explain the functionality and relative danger if used with user-specified data.

In fastify, it is not possible to set the schema of a route dynamically without modifying the source code. As result, fastify is not vulnerable.

---

We are happy to land a PR that address this bad bug, if we get one.

An alternative approach can be to detect this type of patterns instead of sanitizing, and throwing an error in those cases.
- **2019-04-11** @phra: Hello Matteo,

I am happy to hear that _by default_ it's not possible to (re)define the schema with simple HTTP request.
However, at the moment nothing prevents a _bad_ developer to implement such code (_that should not be vulnerable to arbitrary code execution_) and effectively making the vulnerability exploitable from the network. The fact that some requirement has to be met in order to make the issue exploitable, just lowers the likelihood and risk associated with it, but it's doesn't deprecate the vulnerability to "bad bug". Additionally the issue is present in a library used by `fastify`, namely `json-fast-stringify`, that it can be used in other, unintended ways, compared to `fastify` use cases. The ideal solution will be making the issue not exploitable in all the possible scenarios, as marking it as `WONTFIX` will leave this bug dormant.

```javascript
const fastify = require('fastify')()

fastify.route({
  method: 'POST',
  url: '/create-vulnerable-route',
  schema: {
    body: {
      type: 'object',
      properties: {
        greeting: 'greetings#',
        timestamp: { type: 'number' }
      },
      patternProperties: {
        '.*vuln$': 'string'
      },
    }
  },
  handler: (request, reply) => {
      const random = Math.floor(Math.random() * 100)
      fastify.addSchema({
        $id: 'greetings',
        type: 'object',
        properties: {
            hello: { type: 'string' }
        }
    })

    fastify.route({
        method: 'POST',
        url: `/vulnerable-route${random}`,
        schema: JSON.parse(request.body),
        handler: () => {}
    })

    reply.send(`Route /vulnerable-route${random} was successfully created!`)
  }
})
```
- **2019-04-11** @mcollina: The code you provided crash at startup. The following code is closer to what you intended to do, but it crashes as well whenever `route` is called, no response is sent to the server, and fast-json-stringify is not colled.

```js
const fastify = require('fastify')()

fastify.route({
  method: 'POST',
  url: '/',
  handler: (request, reply) => {
    const random = Math.floor(Math.random() * 100)

    fastify.route({
        method: 'POST',
        url: `/vulnerable-route${random}`,
        schema: request.body,
        handler: () => {}
    })

    reply.send(`Route /vulnerable-route${random} was successfully created!`)
  }
})

fastify.listen(3000)
```
- **2019-04-11** @mcollina: Can you please check if the following solves all cases:

```js
diff --git a/index.js b/index.js
index b6bbe4f..c33b66e 100644
--- a/index.js
+++ b/index.js
@@ -119,6 +119,8 @@ function build (schema, options) {
   }
 
   dependenciesName.push(code)
+
+  console.log(code)
   return (Function.apply(null, dependenciesName).apply(null, dependencies))
 }
 
@@ -491,6 +493,10 @@ function refFinder (ref, schema, externalSchema) {
   return (new Function('schema', code))(schema)
 }
 
+function sanitizeKey (key) {
+  return key.replace(/([^\\])\'/g, '$1\\\'')
+}
+
 function buildCode (schema, code, laterCode, name, externalSchema, fullSchema) {
   Object.keys(schema.properties || {}).forEach((key, i, a) => {
     if (schema.properties[key]['$ref']) {
@@ -502,12 +508,13 @@ function buildCode (schema, code, laterCode, name, externalSchema, fullSchema) {
 
     var type = schema.properties[key].type
     var nullable = schema.properties[key].nullable
+    var sanitized = sanitizeKey(key)
 
     if (nullable) {
       code += `
-        if (obj['${key}'] === null) {
+        if (obj['${sanitized}'] === null) {
           ${addComma}
-          json += '${$asString(key)}:null'
+          json += '${$asString(sanitized)}:null'
           var rendered = true
         } else {
       `
@@ -515,10 +522,10 @@ function buildCode (schema, code, laterCode, name, externalSchema, fullSchema) {
 
     if (type === 'number') {
       code += `
-          var t = Number(obj['${key}'])
+          var t = Number(obj['${sanitized}'])
           if (!isNaN(t)) {
             ${addComma}
-            json += '${$asString(key)}:' + t
+            json += '${$asString(sanitized)}:' + t
       `
     } else if (type === 'integer') {
       code += `
@@ -526,25 +533,25 @@ function buildCode (schema, code, laterCode, name, externalSchema, fullSchema) {
       `
       if (isLong) {
         code += `
-            if (isLong(obj['${key}'])) {
+            if (isLong(obj['${sanitized}'])) {
               ${addComma}
-              json += '${$asString(key)}:' + obj['${key}'].toString()
+              json += '${$asString(sanitized)}:' + obj['${sanitized}'].toString()
               rendered = true
             } else {
-              var t = Number(obj['${key}'])
+              var t = Number(obj['${sanitized}'])
               if (!isNaN(t)) {
                 ${addComma}
-                json += '${$asString(key)}:' + t
+                json += '${$asString(sanitized)}:' + t
                 rendered = true
               }
             }
         `
       } else {
         code += `
-            var t = Number(obj['${key}'])
+            var t = Number(obj['${sanitized}'])
             if (!isNaN(t)) {
               ${addComma}
-              json += '${$asString(key)}:' + t
+              json += '${$asString(sanitized)}:' + t
               rendered = true
             }
         `
@@ -554,7 +561,7 @@ function buildCode (schema, code, laterCode, name, externalSchema, fullSchema) {
       `
     } else {
       code += `
-        if (obj['${key}'] !== undefined) {
+        if (obj['${sanitized}'] !== undefined) {
           ${addComma}
           json += '${$asString(key)}:'
         `
@@ -569,12 +576,12 @@ function buildCode (schema, code, laterCode, name, externalSchema, fullSchema) {
       code += `
       } else {
         ${addComma}
-        json += '${$asString(key)}:${JSON.stringify(defaultValue).replace(/'/g, '\'')}'
+        json += '${$asString(sanitized)}:${JSON.stringify(defaultValue).replace(/'/g, '\'')}'
       `
     } else if (schema.required && schema.required.indexOf(key) !== -1) {
       code += `
       } else {
-        throw new Error('${key} is required!')
+        throw new Error('${sanitized} is required!')
       `
     }
 ```
- **2019-04-12** @phra: I checked the proposed patch. We are on the right track, but I could identify some other edge cases: (not sure if these are all of them)

- default properties

```javascript
  properties: {
      phra: {
        type: 'string',
        default: 'a\'&&(console.log(\'w00tw00t\'))||\''
      },
  ...
```

- pattern properties

```javascript
  patternProperties: {
    'phra\'/ && console.log("w00tw00t") && /\'': {
      type: 'number'
    }
  },
````

For the rest, I am worried about arrays, nested fields and `if/then/else` jsonschema feature (and eventual combinations of these cases) but I don't have a working POC for them.
- **2019-04-12** @mcollina: Latest patch, let me know if you can find more.

```js
diff --git a/index.js b/index.js
index b6bbe4f..f9c9e30 100644
--- a/index.js
+++ b/index.js
@@ -119,6 +119,8 @@ function build (schema, options) {
   }
 
   dependenciesName.push(code)
+
+  console.log(code)
   return (Function.apply(null, dependenciesName).apply(null, dependencies))
 }
 
@@ -301,7 +303,7 @@ function addPatternProperties (schema, externalSchema, fullSchema) {
     }
     var type = pp[regex].type
     code += `
-        if (/${regex}/.test(keys[i])) {
+        if (/${regex.replace(/([^\\]+\/)/g, '\\/')}/.test(keys[i])) {
     `
     if (type === 'object') {
       code += buildObject(pp[regex], '', 'buildObjectPP' + index, externalSchema, fullSchema)
@@ -491,6 +493,10 @@ function refFinder (ref, schema, externalSchema) {
   return (new Function('schema', code))(schema)
 }
 
+function sanitizeKey (key) {
+  return key.replace(/([^\\])\'/g, '$1\\\'')
+}
+
 function buildCode (schema, code, laterCode, name, externalSchema, fullSchema) {
   Object.keys(schema.properties || {}).forEach((key, i, a) => {
     if (schema.properties[key]['$ref']) {
@@ -502,12 +508,13 @@ function buildCode (schema, code, laterCode, name, externalSchema, fullSchema) {
 
     var type = schema.properties[key].type
     var nullable = schema.properties[key].nullable
+    var sanitized = sanitizeKey(key)
 
     if (nullable) {
       code += `
-        if (obj['${key}'] === null) {
+        if (obj['${sanitized}'] === null) {
           ${addComma}
-          json += '${$asString(key)}:null'
+          json += '${$asString(sanitized)}:null'
           var rendered = true
         } else {
       `
@@ -515,10 +522,10 @@ function buildCode (schema, code, laterCode, name, externalSchema, fullSchema) {
 
     if (type === 'number') {
       code += `
-          var t = Number(obj['${key}'])
+          var t = Number(obj['${sanitized}'])
           if (!isNaN(t)) {
             ${addComma}
-            json += '${$asString(key)}:' + t
+            json += '${$asString(sanitized)}:' + t
       `
     } else if (type === 'integer') {
       code += `
@@ -526,25 +533,25 @@ function buildCode (schema, code, laterCode, name, externalSchema, fullSchema) {
       `
       if (isLong) {
         code += `
-            if (isLong(obj['${key}'])) {
+            if (isLong(obj['${sanitized}'])) {
               ${addComma}
-              json += '${$asString(key)}:' + obj['${key}'].toString()
+              json += '${$asString(sanitized)}:' + obj['${sanitized}'].toString()
               rendered = true
             } else {
-              var t = Number(obj['${key}'])
+              var t = Number(obj['${sanitized}'])
               if (!isNaN(t)) {
                 ${addComma}
-                json += '${$asString(key)}:' + t
+                json += '${$asString(sanitized)}:' + t
                 rendered = true
               }
             }
         `
       } else {
         code += `
-            var t = Number(obj['${key}'])
+            var t = Number(obj['${sanitized}'])
             if (!isNaN(t)) {
               ${addComma}
-              json += '${$asString(key)}:' + t
+              json += '${$asString(sanitized)}:' + t
               rendered = true
             }
         `
@@ -554,7 +561,7 @@ function buildCode (schema, code, laterCode, name, externalSchema, fullSchema) {
       `
     } else {
       code += `
-        if (obj['${key}'] !== undefined) {
+        if (obj['${sanitized}'] !== undefined) {
           ${addComma}
           json += '${$asString(key)}:'
         `
@@ -569,12 +576,12 @@ function buildCode (schema, code, laterCode, name, externalSchema, fullSchema) {
       code += `
       } else {
         ${addComma}
-        json += '${$asString(key)}:${JSON.stringify(defaultValue).replace(/'/g, '\'')}'
+        json += '${$asString(sanitized)}:${sanitizeKey(JSON.stringify(defaultValue)).replace(/'/g, '\'')}'
       `
     } else if (schema.required && schema.required.indexOf(key) !== -1) {
       code += `
       } else {
-        throw new Error('${key} is required!')
+        throw new Error('${sanitized} is required!')
       `
     }
 ```
- **2019-04-12** @phra: found another one array based.

schema:

```javascript
arr: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          'phra\' && console.log(42)//': {
            type: 'number'
          },
          str: {
            type: 'string'
          }
        }
      }
    }
```

object to be stringified:

```javascript
arr: [{'phra\' && console.log(42)//': 42}]
```
- **2019-04-12** @phra: also, it's better to sanitize line _566_ , _855_ and _903_ in the patched `index.js`.

regarding line _875_, i don't understand if it's exploitable (i keep getting syntax errors, but maybe it's possible to workaround that with [jsfuck](http://www.jsfuck.com/) or similar encoding scheme).
- **2019-04-12** @mcollina: Please check the following:

```
diff --git a/index.js b/index.js
index b6bbe4f..a0fbbaa 100644
--- a/index.js
+++ b/index.js
@@ -119,6 +119,7 @@ function build (schema, options) {
   }
 
   dependenciesName.push(code)
+
   return (Function.apply(null, dependenciesName).apply(null, dependencies))
 }
 
@@ -301,7 +302,7 @@ function addPatternProperties (schema, externalSchema, fullSchema) {
     }
     var type = pp[regex].type
     code += `
-        if (/${regex}/.test(keys[i])) {
+        if (/${regex.replace(/([^\\]+\/)/g, '\\/')}/.test(keys[i])) {
     `
     if (type === 'object') {
       code += buildObject(pp[regex], '', 'buildObjectPP' + index, externalSchema, fullSchema)
@@ -491,6 +492,10 @@ function refFinder (ref, schema, externalSchema) {
   return (new Function('schema', code))(schema)
 }
 
+function sanitizeKey (key) {
+  return key.replace(/([^\\])\'/g, '$1\\\'')
+}
+
 function buildCode (schema, code, laterCode, name, externalSchema, fullSchema) {
   Object.keys(schema.properties || {}).forEach((key, i, a) => {
     if (schema.properties[key]['$ref']) {
@@ -502,12 +507,14 @@ function buildCode (schema, code, laterCode, name, externalSchema, fullSchema) {
 
     var type = schema.properties[key].type
     var nullable = schema.properties[key].nullable
+    var sanitized = sanitizeKey(key)
+    var asString = sanitizeKey($asString(key))
 
     if (nullable) {
       code += `
-        if (obj['${key}'] === null) {
+        if (obj['${sanitized}'] === null) {
           ${addComma}
-          json += '${$asString(key)}:null'
+          json += '${asString}:null'
           var rendered = true
         } else {
       `
@@ -515,10 +522,10 @@ function buildCode (schema, code, laterCode, name, externalSchema, fullSchema) {
 
     if (type === 'number') {
       code += `
-          var t = Number(obj['${key}'])
+          var t = Number(obj['${sanitized}'])
           if (!isNaN(t)) {
             ${addComma}
-            json += '${$asString(key)}:' + t
+            json += '${asString}:' + t
       `
     } else if (type === 'integer') {
       code += `
@@ -526,25 +533,25 @@ function buildCode (schema, code, laterCode, name, externalSchema, fullSchema) {
       `
       if (isLong) {
         code += `
-            if (isLong(obj['${key}'])) {
+            if (isLong(obj['${sanitized}'])) {
               ${addComma}
-              json += '${$asString(key)}:' + obj['${key}'].toString()
+              json += '${asString}:' + obj['${sanitized}'].toString()
               rendered = true
             } else {
-              var t = Number(obj['${key}'])
+              var t = Number(obj['${sanitized}'])
               if (!isNaN(t)) {
                 ${addComma}
-                json += '${$asString(key)}:' + t
+                json += '${asString}:' + t
                 rendered = true
               }
             }
         `
       } else {
         code += `
-            var t = Number(obj['${key}'])
+            var t = Number(obj['${sanitized}'])
             if (!isNaN(t)) {
               ${addComma}
-              json += '${$asString(key)}:' + t
+              json += '${asString}:' + t
               rendered = true
             }
         `
@@ -554,9 +561,9 @@ function buildCode (schema, code, laterCode, name, externalSchema, fullSchema) {
       `
     } else {
       code += `
-        if (obj['${key}'] !== undefined) {
+        if (obj['${sanitized}'] !== undefined) {
           ${addComma}
-          json += '${$asString(key)}:'
+          json += '${asString}:'
         `
 
       var result = nested(laterCode, name, key, schema.properties[key], externalSchema, fullSchema)
@@ -569,12 +576,12 @@ function buildCode (schema, code, laterCode, name, externalSchema, fullSchema) {
       code += `
       } else {
         ${addComma}
-        json += '${$asString(key)}:${JSON.stringify(defaultValue).replace(/'/g, '\'')}'
+        json += '${asString}:${sanitizeKey(JSON.stringify(defaultValue)).replace(/'/g, '\'')}'
       `
     } else if (schema.required && schema.required.indexOf(key) !== -1) {
       code += `
       } else {
-        throw new Error('${key} is required!')
+        throw new Error('${sanitized} is required!')
       `
     }
 
@@ -845,7 +852,7 @@ function nested (laterCode, name, key, schema, externalSchema, fullSchema, subKe
   var type = schema.type
   var nullable = schema.nullable === true
 
-  var accessor = key.indexOf('[') === 0 ? key : `['${key}']`
+  var accessor = key.indexOf('[') === 0 ? sanitizeKey(key) : `['${sanitizeKey(key)}']`
   switch (type) {
     case 'null':
       code += `
```
- **2019-04-13** @phra: three things:

- maybe it's to sanitize line `490` in the patched `index.js`. i think it's the last user input left unsanitized.

- specifying a normal property like this:

```javascript
properties: {
    '"\'w00t': {
      type: 'string',
      default: '"\'w00t'
    },
}
```

will produce the following field in the JSON output:

```javascript
{""'w00t":""'w00t", ...}
```

- specifying a pattern properties like this:

```javascipt
  patternProperties: {
    '"\'w00t////': {
      type: 'number'
    }
  },
``` 

will remove the regex test from the generated code, instead with `"\'w00t` the generated check was:

```diff
- 104:        if (/"'w00t/.test(keys[i])) {
```
- **2019-04-13** @mcollina: Can you please recommend a fix for these last two problems? I'm not sure I understand, maybe a full example would help.
- **2019-04-14** @phra: - here it is a full example for point 2:

```javascript
'use strict'

const fastJson = require('.')
const stringify = fastJson({
  title: 'Example Schema',
  type: 'object',
  properties: {
    '"\'w00t': {
      type: 'string',
      default: '"\'w00t'
    }
  }
})

console.log(stringify({}))
```
if we execute the script, the following invalid JSON is returned, using the latest patched `index.js`:

`{""'w00t":""'w00t"}`

instead of the valid JSON:

``{"\"'w00t":"\"'w00t"}``

- regarding point 3, here it is a full example:

```javascript
'use strict'

const fastJson = require('.')
const stringify = fastJson({
  title: 'Example Schema',
  type: 'object',
  properties: {
    '"\'w00t': {
      type: 'string',
      default: '"\'w00t'
    },
 },
  patternProperties: {
    '"\'w00t.*////': {
      type: 'number'
    }
  }
})

console.log(stringify({
  '"\'phra////': 42,
  'asd': 42
}))
```

will produce the following JSON output, not compatible with the declared schema:

`{"\"'phra////":42,""'w00t":""'w00t"}`

notice that `additionalProperty` was omitted and `asd` won't appear. however, the property named `"\'phra////` will appear due to a wrong regex check in the generated code. here it is a diff of the two outputs:

```diff
--- 1	2019-04-14 12:49:15.879552362 +0200
+++ 2	2019-04-14 12:49:26.607563673 +0200
@@ -88,7 +88,7 @@
       for (var i = 0; i < keys.length; i++) {
         if (properties[keys[i]]) continue
   
-        if (/\//.test(keys[i])) {
+        if (/"'w00t.*/.test(keys[i])) {
     
           
   if (addComma) {
@@ -288,4 +288,4 @@
     ;
      return $main
   
-{"\"'phra////":42,""'w00t":""'w00t","now":"2019-04-14T10:49:15.884Z"}
+{""'w00t":""'w00t","now":"2019-04-14T10:49:26.612Z"}
```

instead the correct generated regex check should have been:

```javascript
if (/"'w00t.*\/\/\/\//.test(keys[i])) {
```
- **2019-04-14** @mcollina: Please try:

```
diff --git a/index.js b/index.js
index b6bbe4f..e7c603c 100644
--- a/index.js
+++ b/index.js
@@ -2,6 +2,7 @@
 
 var Ajv = require('ajv')
 var merge = require('deepmerge')
+var util = require('util')
 
 // This Ajv instance is used to validate that the passed schema
 // is valid json schema. We reuse the instance to avoid having to
@@ -301,7 +302,7 @@ function addPatternProperties (schema, externalSchema, fullSchema) {
     }
     var type = pp[regex].type
     code += `
-        if (/${regex}/.test(keys[i])) {
+        if (/${regex.replace(/\\*\//g, '\\/')}/.test(keys[i])) {
     `
     if (type === 'object') {
       code += buildObject(pp[regex], '', 'buildObjectPP' + index, externalSchema, fullSchema)
@@ -484,13 +485,17 @@ function refFinder (ref, schema, externalSchema) {
       return idFinder(schema, `#${ref[1]}`)
     } else {
       for (var i = 1; i < walk.length; i++) {
-        code += `['${walk[i]}']`
+        code += `['${sanitizeKey(walk[i])}']`
       }
     }
   }
   return (new Function('schema', code))(schema)
 }
 
+function sanitizeKey (key) {
+  return key.replace(/([^\\])\'/g, '$1\\\'') // eslint-disable-line
+}
+
 function buildCode (schema, code, laterCode, name, externalSchema, fullSchema) {
   Object.keys(schema.properties || {}).forEach((key, i, a) => {
     if (schema.properties[key]['$ref']) {
@@ -502,12 +507,14 @@ function buildCode (schema, code, laterCode, name, externalSchema, fullSchema) {
 
     var type = schema.properties[key].type
     var nullable = schema.properties[key].nullable
+    var sanitized = sanitizeKey(key)
+    var asString = sanitizeKey($asString(key).replace(/\\/g, '\\\\'))
 
     if (nullable) {
       code += `
-        if (obj['${key}'] === null) {
+        if (obj['${sanitized}'] === null) {
           ${addComma}
-          json += '${$asString(key)}:null'
+          json += '${asString}:null'
           var rendered = true
         } else {
       `
@@ -515,10 +522,10 @@ function buildCode (schema, code, laterCode, name, externalSchema, fullSchema) {
 
     if (type === 'number') {
       code += `
-          var t = Number(obj['${key}'])
+          var t = Number(obj['${sanitized}'])
           if (!isNaN(t)) {
             ${addComma}
-            json += '${$asString(key)}:' + t
+            json += '${asString}:' + t
       `
     } else if (type === 'integer') {
       code += `
@@ -526,25 +533,25 @@ function buildCode (schema, code, laterCode, name, externalSchema, fullSchema) {
       `
       if (isLong) {
         code += `
-            if (isLong(obj['${key}'])) {
+            if (isLong(obj['${sanitized}'])) {
               ${addComma}
-              json += '${$asString(key)}:' + obj['${key}'].toString()
+              json += '${asString}:' + obj['${sanitized}'].toString()
               rendered = true
             } else {
-              var t = Number(obj['${key}'])
+              var t = Number(obj['${sanitized}'])
               if (!isNaN(t)) {
                 ${addComma}
-                json += '${$asString(key)}:' + t
+                json += '${asString}:' + t
                 rendered = true
               }
             }
         `
       } else {
         code += `
-            var t = Number(obj['${key}'])
+            var t = Number(obj['${sanitized}'])
             if (!isNaN(t)) {
               ${addComma}
-              json += '${$asString(key)}:' + t
+              json += '${asString}:' + t
               rendered = true
             }
         `
@@ -554,9 +561,9 @@ function buildCode (schema, code, laterCode, name, externalSchema, fullSchema) {
       `
     } else {
       code += `
-        if (obj['${key}'] !== undefined) {
+        if (obj['${sanitized}'] !== undefined) {
           ${addComma}
-          json += '${$asString(key)}:'
+          json += '${asString}:'
         `
 
       var result = nested(laterCode, name, key, schema.properties[key], externalSchema, fullSchema)
@@ -569,12 +576,12 @@ function buildCode (schema, code, laterCode, name, externalSchema, fullSchema) {
       code += `
       } else {
         ${addComma}
-        json += '${$asString(key)}:${JSON.stringify(defaultValue).replace(/'/g, '\'')}'
+        json += '${asString}:${sanitizeKey(JSON.stringify(defaultValue).replace(/\\/g, '\\\\'))}'
       `
     } else if (schema.required && schema.required.indexOf(key) !== -1) {
       code += `
       } else {
-        throw new Error('${key} is required!')
+        throw new Error('${sanitized} is required!')
       `
     }
 
@@ -637,7 +644,7 @@ function addIfThenElse (schema, name, externalSchema, fullSchema) {
   var merged = merge(copy, then)
 
   code += `
-    valid = ajv.validate(${require('util').inspect(i, { depth: null })}, obj)
+    valid = ajv.validate(${util.inspect(i, { depth: null })}, obj)
     if (valid) {
   `
   if (merged.if && merged.then) {
@@ -835,6 +842,8 @@ function nested (laterCode, name, key, schema, externalSchema, fullSchema, subKe
   var code = ''
   var funcName
 
+  subKey = subKey || ''
+
   if (schema.type === undefined) {
     var inferedType = inferTypeByKeyword(schema)
     if (inferedType) {
@@ -845,7 +854,7 @@ function nested (laterCode, name, key, schema, externalSchema, fullSchema, subKe
   var type = schema.type
   var nullable = schema.nullable === true
 
-  var accessor = key.indexOf('[') === 0 ? key : `['${key}']`
+  var accessor = key.indexOf('[') === 0 ? sanitizeKey(key) : `['${sanitizeKey(key)}']`
   switch (type) {
     case 'null':
       code += `
@@ -881,7 +890,7 @@ function nested (laterCode, name, key, schema, externalSchema, fullSchema, subKe
     case undefined:
       if ('anyOf' in schema) {
         schema.anyOf.forEach((s, index) => {
-          var nestedResult = nested(laterCode, name, key, s, externalSchema, fullSchema, subKey !== undefined ? subKey : 'i' + index)
+          var nestedResult = nested(laterCode, name, key, s, externalSchema, fullSchema, subKey !== '' ? subKey : 'i' + index)
           code += `
             ${index === 0 ? 'if' : 'else if'}(ajv.validate(${require('util').inspect(s, { depth: null })}, obj${accessor}))
               ${nestedResult.code}
```
- **2019-04-18** @phra: i noticed that the current sanitize function can be bypassed with the following sequence: `\\\'`
here is it a full poc, that will print the number 42 and produce an invalid JSON at the same time:

```javascript
'use strict'

const fastJson = require('.')
const stringify = fastJson({
  title: 'Example Schema',
  type: 'object',
  properties: {
    "\"phra\\\'&&(console.log(42))//||'phra": {},
  },
})

console.log(stringify({
  '"phra\'&&(console.log(42))//||\'phra': 42
}))
```
- **2019-04-18** @mcollina: Here is another diff:

```
diff --git a/index.js b/index.js
index b6bbe4f..3f1f15c 100644
--- a/index.js
+++ b/index.js
@@ -2,6 +2,7 @@
 
 var Ajv = require('ajv')
 var merge = require('deepmerge')
+var util = require('util')
 
 // This Ajv instance is used to validate that the passed schema
 // is valid json schema. We reuse the instance to avoid having to
@@ -301,7 +302,7 @@ function addPatternProperties (schema, externalSchema, fullSchema) {
     }
     var type = pp[regex].type
     code += `
-        if (/${regex}/.test(keys[i])) {
+        if (/${regex.replace(/\\*\//g, '\\/')}/.test(keys[i])) {
     `
     if (type === 'object') {
       code += buildObject(pp[regex], '', 'buildObjectPP' + index, externalSchema, fullSchema)
@@ -484,13 +485,17 @@ function refFinder (ref, schema, externalSchema) {
       return idFinder(schema, `#${ref[1]}`)
     } else {
       for (var i = 1; i < walk.length; i++) {
-        code += `['${walk[i]}']`
+        code += `['${sanitizeKey(walk[i])}']`
       }
     }
   }
   return (new Function('schema', code))(schema)
 }
 
+function sanitizeKey (key) {
+  return key.replace(/\\*\'/g, '\\\'') // eslint-disable-line
+}
+
 function buildCode (schema, code, laterCode, name, externalSchema, fullSchema) {
   Object.keys(schema.properties || {}).forEach((key, i, a) => {
     if (schema.properties[key]['$ref']) {
@@ -502,12 +507,14 @@ function buildCode (schema, code, laterCode, name, externalSchema, fullSchema) {
 
     var type = schema.properties[key].type
     var nullable = schema.properties[key].nullable
+    var sanitized = sanitizeKey(key)
+    var asString = sanitizeKey($asString(key).replace(/\\/g, '\\\\'))
 
     if (nullable) {
       code += `
-        if (obj['${key}'] === null) {
+        if (obj['${sanitized}'] === null) {
           ${addComma}
-          json += '${$asString(key)}:null'
+          json += '${asString}:null'
           var rendered = true
         } else {
       `
@@ -515,10 +522,10 @@ function buildCode (schema, code, laterCode, name, externalSchema, fullSchema) {
 
     if (type === 'number') {
       code += `
-          var t = Number(obj['${key}'])
+          var t = Number(obj['${sanitized}'])
           if (!isNaN(t)) {
             ${addComma}
-            json += '${$asString(key)}:' + t
+            json += '${asString}:' + t
       `
     } else if (type === 'integer') {
       code += `
@@ -526,25 +533,25 @@ function buildCode (schema, code, laterCode, name, externalSchema, fullSchema) {
       `
       if (isLong) {
         code += `
-            if (isLong(obj['${key}'])) {
+            if (isLong(obj['${sanitized}'])) {
               ${addComma}
-              json += '${$asString(key)}:' + obj['${key}'].toString()
+              json += '${asString}:' + obj['${sanitized}'].toString()
               rendered = true
             } else {
-              var t = Number(obj['${key}'])
+              var t = Number(obj['${sanitized}'])
               if (!isNaN(t)) {
                 ${addComma}
-                json += '${$asString(key)}:' + t
+                json += '${asString}:' + t
                 rendered = true
               }
             }
         `
       } else {
         code += `
-            var t = Number(obj['${key}'])
+            var t = Number(obj['${sanitized}'])
             if (!isNaN(t)) {
               ${addComma}
-              json += '${$asString(key)}:' + t
+              json += '${asString}:' + t
               rendered = true
             }
         `
@@ -554,9 +561,9 @@ function buildCode (schema, code, laterCode, name, externalSchema, fullSchema) {
       `
     } else {
       code += `
-        if (obj['${key}'] !== undefined) {
+        if (obj['${sanitized}'] !== undefined) {
           ${addComma}
-          json += '${$asString(key)}:'
+          json += '${asString}:'
         `
 
       var result = nested(laterCode, name, key, schema.properties[key], externalSchema, fullSchema)
@@ -569,12 +576,12 @@ function buildCode (schema, code, laterCode, name, externalSchema, fullSchema) {
       code += `
       } else {
         ${addComma}
-        json += '${$asString(key)}:${JSON.stringify(defaultValue).replace(/'/g, '\'')}'
+        json += '${asString}:${sanitizeKey(JSON.stringify(defaultValue).replace(/\\/g, '\\\\'))}'
       `
     } else if (schema.required && schema.required.indexOf(key) !== -1) {
       code += `
       } else {
-        throw new Error('${key} is required!')
+        throw new Error('${sanitized} is required!')
       `
     }
 
@@ -637,7 +644,7 @@ function addIfThenElse (schema, name, externalSchema, fullSchema) {
   var merged = merge(copy, then)
 
   code += `
-    valid = ajv.validate(${require('util').inspect(i, { depth: null })}, obj)
+    valid = ajv.validate(${util.inspect(i, { depth: null })}, obj)
     if (valid) {
   `
   if (merged.if && merged.then) {
@@ -835,6 +842,8 @@ function nested (laterCode, name, key, schema, externalSchema, fullSchema, subKe
   var code = ''
   var funcName
 
+  subKey = subKey || ''
+
   if (schema.type === undefined) {
     var inferedType = inferTypeByKeyword(schema)
     if (inferedType) {
@@ -845,7 +854,7 @@ function nested (laterCode, name, key, schema, externalSchema, fullSchema, subKe
   var type = schema.type
   var nullable = schema.nullable === true
 
-  var accessor = key.indexOf('[') === 0 ? key : `['${key}']`
+  var accessor = key.indexOf('[') === 0 ? sanitizeKey(key) : `['${sanitizeKey(key)}']`
   switch (type) {
     case 'null':
       code += `
@@ -881,7 +890,7 @@ function nested (laterCode, name, key, schema, externalSchema, fullSchema, subKe
     case undefined:
       if ('anyOf' in schema) {
         schema.anyOf.forEach((s, index) => {
-          var nestedResult = nested(laterCode, name, key, s, externalSchema, fullSchema, subKey !== undefined ? subKey : 'i' + index)
+          var nestedResult = nested(laterCode, name, key, s, externalSchema, fullSchema, subKey !== '' ? subKey : 'i' + index)
           code += `
             ${index === 0 ? 'if' : 'else if'}(ajv.validate(${require('util').inspect(s, { depth: null })}, obj${accessor}))
               ${nestedResult.code}
```
- **2019-04-18** @phra: i think we are very close, i like this patch.
however there is still an edge case to manage:

```javascript
'use strict'

const fastJson = require('.')
const stringify = fastJson({
  title: 'Example Schema',
  type: 'object',
  properties: {
    '"\\\\\\\\\'w00t': {
      type: 'string',
      default: '"\'w00t'
    }
  }
})

console.log(stringify({}))
```

produces the following JSON:

`{"\"'w00t":"\"'w00t"}`

basically, all the backslashes are squashed into one.
- **2019-05-06** @mcollina: Can you recommend a change to the regular expression to address this? I'm low on time, and I would like to get this released asap.
- **2019-05-07** @phra: ```javascript
function sanitizeKey (key) {
  return key.replace(/\\*\'/g, '\\\'') // eslint-disable-line
}
```

this regex seems the cause of the bug:

```javascript
> "\\\\\\\\\\\\\\\'asd".replace(/\\*\'/g, '\\\'') // invalid output
=> "\'asd"
> "\\\\\\\\\\\\\\\'asd".replace(/\\\'/g, '\\\'') // no effects, valid output
=> "\\\\\\\'asd"
> "\\\\\\\\\\\\\\\\'asd".replace(/\\\'/g, '\\\'') // no effects, valid output
=> "\\\\\\\\'asd"
> "\\\\\\\\\\\\\\\\\'asd".replace(/\\\'/g, '\\\'') // no effects, valid output
=> "\\\\\\\\'asd"
> "\\\\\\\\\\\\\\\\\'asd" // no effects, valid output
=> "\\\\\\\\'asd"
```

the *bugged* version protects against escaping strings delimited by `'` but produces illegal output.
the *fixed* version produces valid JSON because it's not changing the input, but can be exploited to escape strings delimited by `'`.

i see two potential solutions:

1. don't escape `'` and build only strings delimited by `"`.
2. use a `function` to replace the backslashes to provide a powerful replace, eg:

```javascript
function sanitizeKey (key) {
  return key.replace(/\\*\'/g, (str) => void 'HIC SUNT LEONES') // eslint-disable-line
}
```
- **Report Triaged**
- **2019-05-14** @mcollina: 1. I think we would have the exact problem with `"`, so this is not feasible.
2. would you mind providing such a function?
- **2019-05-14** @mcollina: I do not see how to produce correct output and at the same time pass:

```
const stringify3 = build({
  title: 'Example Schema',
  type: 'object',
  properties: {
    "\"phra\\'&&(console.log(42))//||'phra": {}
  }
})

// this verifies the escaping
JSON.parse(stringify3({
  '"phra\'&&(console.log(42))//||\'phra': 42
}))
```
- **2019-05-14** @mcollina: Here is the latest patch, it fixes the last problem:


```
diff --git a/index.js b/index.js
index b6bbe4f..f5ce493 100644
--- a/index.js
+++ b/index.js
@@ -2,6 +2,7 @@
 
 var Ajv = require('ajv')
 var merge = require('deepmerge')
+var util = require('util')
 
 // This Ajv instance is used to validate that the passed schema
 // is valid json schema. We reuse the instance to avoid having to
@@ -301,7 +302,7 @@ function addPatternProperties (schema, externalSchema, fullSchema) {
     }
     var type = pp[regex].type
     code += `
-        if (/${regex}/.test(keys[i])) {
+        if (/${regex.replace(/\\*\//g, '\\/')}/.test(keys[i])) {
     `
     if (type === 'object') {
       code += buildObject(pp[regex], '', 'buildObjectPP' + index, externalSchema, fullSchema)
@@ -484,13 +485,27 @@ function refFinder (ref, schema, externalSchema) {
       return idFinder(schema, `#${ref[1]}`)
     } else {
       for (var i = 1; i < walk.length; i++) {
-        code += `['${walk[i]}']`
+        code += `['${sanitizeKey(walk[i])}']`
       }
     }
   }
   return (new Function('schema', code))(schema)
 }
 
+function sanitizeKey (key) {
+  const rep = key.replace(/(\\*)'/g, function (match, p1) {
+    var base = ''
+    if (p1.length % 2 === 1) {
+      base = p1.slice(2)
+    } else {
+      base = p1
+    }
+    var rep = base + '\\\''
+    return rep
+  })
+  return rep
+}
+
 function buildCode (schema, code, laterCode, name, externalSchema, fullSchema) {
   Object.keys(schema.properties || {}).forEach((key, i, a) => {
     if (schema.properties[key]['$ref']) {
@@ -502,12 +517,14 @@ function buildCode (schema, code, laterCode, name, externalSchema, fullSchema) {
 
     var type = schema.properties[key].type
     var nullable = schema.properties[key].nullable
+    var sanitized = sanitizeKey(key)
+    var asString = sanitizeKey($asString(key).replace(/\\/g, '\\\\'))
 
     if (nullable) {
       code += `
-        if (obj['${key}'] === null) {
+        if (obj['${sanitized}'] === null) {
           ${addComma}
-          json += '${$asString(key)}:null'
+          json += '${asString}:null'
           var rendered = true
         } else {
       `
@@ -515,10 +532,10 @@ function buildCode (schema, code, laterCode, name, externalSchema, fullSchema) {
 
     if (type === 'number') {
       code += `
-          var t = Number(obj['${key}'])
+          var t = Number(obj['${sanitized}'])
           if (!isNaN(t)) {
             ${addComma}
-            json += '${$asString(key)}:' + t
+            json += '${asString}:' + t
       `
     } else if (type === 'integer') {
       code += `
@@ -526,25 +543,25 @@ function buildCode (schema, code, laterCode, name, externalSchema, fullSchema) {
       `
       if (isLong) {
         code += `
-            if (isLong(obj['${key}'])) {
+            if (isLong(obj['${sanitized}'])) {
               ${addComma}
-              json += '${$asString(key)}:' + obj['${key}'].toString()
+              json += '${asString}:' + obj['${sanitized}'].toString()
               rendered = true
             } else {
-              var t = Number(obj['${key}'])
+              var t = Number(obj['${sanitized}'])
               if (!isNaN(t)) {
                 ${addComma}
-                json += '${$asString(key)}:' + t
+                json += '${asString}:' + t
                 rendered = true
               }
             }
         `
       } else {
         code += `
-            var t = Number(obj['${key}'])
+            var t = Number(obj['${sanitized}'])
             if (!isNaN(t)) {
               ${addComma}
-              json += '${$asString(key)}:' + t
+              json += '${asString}:' + t
               rendered = true
             }
         `
@@ -554,9 +571,9 @@ function buildCode (schema, code, laterCode, name, externalSchema, fullSchema) {
       `
     } else {
       code += `
-        if (obj['${key}'] !== undefined) {
+        if (obj['${sanitized}'] !== undefined) {
           ${addComma}
-          json += '${$asString(key)}:'
+          json += '${asString}:'
         `
 
       var result = nested(laterCode, name, key, schema.properties[key], externalSchema, fullSchema)
@@ -569,12 +586,12 @@ function buildCode (schema, code, laterCode, name, externalSchema, fullSchema) {
       code += `
       } else {
         ${addComma}
-        json += '${$asString(key)}:${JSON.stringify(defaultValue).replace(/'/g, '\'')}'
+        json += '${asString}:${sanitizeKey(JSON.stringify(defaultValue).replace(/\\/g, '\\\\'))}'
       `
     } else if (schema.required && schema.required.indexOf(key) !== -1) {
       code += `
       } else {
-        throw new Error('${key} is required!')
+        throw new Error('${sanitized} is required!')
       `
     }
 
@@ -637,7 +654,7 @@ function addIfThenElse (schema, name, externalSchema, fullSchema) {
   var merged = merge(copy, then)
 
   code += `
-    valid = ajv.validate(${require('util').inspect(i, { depth: null })}, obj)
+    valid = ajv.validate(${util.inspect(i, { depth: null })}, obj)
     if (valid) {
   `
   if (merged.if && merged.then) {
@@ -835,6 +852,8 @@ function nested (laterCode, name, key, schema, externalSchema, fullSchema, subKe
   var code = ''
   var funcName
 
+  subKey = subKey || ''
+
   if (schema.type === undefined) {
     var inferedType = inferTypeByKeyword(schema)
     if (inferedType) {
@@ -845,7 +864,7 @@ function nested (laterCode, name, key, schema, externalSchema, fullSchema, subKe
   var type = schema.type
   var nullable = schema.nullable === true
 
-  var accessor = key.indexOf('[') === 0 ? key : `['${key}']`
+  var accessor = key.indexOf('[') === 0 ? sanitizeKey(key) : `['${sanitizeKey(key)}']`
   switch (type) {
     case 'null':
       code += `
@@ -881,7 +900,7 @@ function nested (laterCode, name, key, schema, externalSchema, fullSchema, subKe
     case undefined:
       if ('anyOf' in schema) {
         schema.anyOf.forEach((s, index) => {
-          var nestedResult = nested(laterCode, name, key, s, externalSchema, fullSchema, subKey !== undefined ? subKey : 'i' + index)
+          var nestedResult = nested(laterCode, name, key, s, externalSchema, fullSchema, subKey !== '' ? subKey : 'i' + index)
           code += `
             ${index === 0 ? 'if' : 'else if'}(ajv.validate(${require('util').inspect(s, { depth: null })}, obj${accessor}))
               ${nestedResult.code}
diff --git a/test/anyof.test.js b/test/anyof.test.js
index afad34d..81ebdb9 100644
--- a/test/anyof.test.js
+++ b/test/anyof.test.js
@@ -1,6 +1,6 @@
 'use strict'
 
-const test = require('tap').test
+const { test } = require('tap')
 const build = require('..')
 
 test('object with multiple types field', (t) => {
diff --git a/test/sanitize.test.js b/test/sanitize.test.js
new file mode 100644
index 0000000..15cc039
--- /dev/null
+++ b/test/sanitize.test.js
@@ -0,0 +1,142 @@
+'use strict'
+
+const t = require('tap')
+const build = require('..')
+
+const stringify = build({
+  title: 'Example Schema',
+  type: 'object',
+  properties: {
+    firstName: {
+      type: 'string'
+    },
+    lastName: {
+      type: 'string'
+    },
+    age: {
+      description: 'Age in years"',
+      type: 'integer'
+    },
+    [(() => `phra'&& process.exit(1) ||'phra`)()]: {},
+    now: {
+      type: 'string'
+    },
+    reg: {
+      type: 'string',
+      default: 'a\'&& process.exit(1) ||\''
+    },
+    obj: {
+      type: 'object',
+      properties: {
+        bool: {
+          type: 'boolean'
+        }
+      }
+    },
+    '"\'w00t': {
+      type: 'string',
+      default: '"\'w00t'
+    },
+    arr: {
+      type: 'array',
+      items: {
+        type: 'object',
+        properties: {
+          'phra\' && process.exit(1)//': {
+            type: 'number'
+          },
+          str: {
+            type: 'string'
+          }
+        }
+      }
+    }
+  },
+  required: ['now'],
+  patternProperties: {
+    '.*foo$': {
+      type: 'string'
+    },
+    'test': {
+      type: 'number'
+    },
+    'phra\'/ && process.exit(1) && /\'': {
+      type: 'number'
+    },
+    '"\'w00t.*////': {
+      type: 'number'
+    }
+  },
+  additionalProperties: {
+    type: 'string'
+  }
+})
+
+const obj = {
+  firstName: 'Matteo',
+  lastName: 'Collina',
+  age: 32,
+  now: new Date(),
+  foo: 'hello"',
+  bar: "world'",
+  'fuzz"': 42,
+  "me'": 42,
+  numfoo: 42,
+  test: 42,
+  strtest: '23',
+  arr: [{ 'phra\' && process.exit(1)//': 42 }],
+  obj: { bool: true },
+  notmatch: 'valar morghulis',
+  notmatchobj: { a: true },
+  notmatchnum: 42
+}
+
+// pass if it does not crash
+const json = stringify(obj)
+JSON.parse(json)
+
+const stringify2 = build({
+  title: 'Example Schema',
+  type: 'object',
+  patternProperties: {
+    '"\'w00t.*////': {
+      type: 'number'
+    }
+  }
+})
+
+t.deepEqual(JSON.parse(stringify2({
+  '"\'phra////': 42,
+  'asd': 42
+})), {
+})
+
+const stringify3 = build({
+  title: 'Example Schema',
+  type: 'object',
+  properties: {
+    "\"phra\\'&&(console.log(42))//||'phra": {}
+  }
+})
+
+// this verifies the escaping
+JSON.parse(stringify3({
+  '"phra\'&&(console.log(42))//||\'phra': 42
+}))
+
+const stringify4 = build({
+  title: 'Example Schema',
+  type: 'object',
+  properties: {
+    '"\\\\\\\\\'w00t': {
+      type: 'string',
+      default: '"\'w00t'
+    }
+  }
+})
+
+t.deepEqual(JSON.parse(stringify4({})), {
+  '"\\\\\\\\\'w00t': '"\'w00t'
+})
+
+t.pass('no crashes')
```
- **2019-05-14** @phra: it looks fixed to me.
+1 to implement unit tests covering the cases reported in this thread in order to prevent any future regression and avoid breaking changes due to this patch.
- **2019-05-28** @mcollina: PR in https://github.com/fastify/fast-json-stringify/pull/168.
- **2019-05-28** @mcollina: Released as v1.15.3.
- **2019-05-30** @phra: can we mark this as _Resolved_ ?
- **2019-06-12** @phra: any update?
- **2019-06-12** @mcollina: I'm +1 in considering this resolved. I'm -1 on treating this as a vulnerability, mainly because we do not aim to guarantee that fast-json-stringify is safe to use with user data.
- **2019-06-16** @lirantal: Catching up on this now.

@mcollina it seems like `fast-json-stringify` is not going to guarantee security concerns due to the dynamic evaluation and serialization nature of how it works. So a developer directly choosing to use `fast-json-stringify` should be aware of it and read the docs which mention it. However, `fastify` makes use of this library "behind the scenes" and the user may not be aware that such security concerns are valid if they provide a schema. If to make the matter more confusing for developers, the framework states `Developer friendly: the framework is built to be very expressive and help the developer in their daily use, without sacrificing performance and security.` which may hint developers that they don't need to perform anything special in terms of security where-as it seems that the real advice from you is that developers should definitely be concerned as to the data they provide through the `schema` capability because that could turn into code injection.

Would that sum it up correctly?
If so, instead of this being a vulnerability in `fastify`, perhaps we should add a note to the project's page about the use of `schema` and its security concerns?
- **2019-06-17** @mcollina: @lirantal the security part of that statetment is based on the following threat model:

1. we provide one of the fastest data validator (Ajv) embedded in the framework. Validating your data is a must-have, and this does increase application security.
2. using fast-json-stringify improves unexpected data leaks, as only the properties in the schema are sent.
3. we do not allow routes to be defined at runtime (after listen). As a result it's not possible to exploit this from a route. Developers try to do this all the time, and we prevent them from it.
4. some other bits and bobs within the framework.

Data validation is application code. If you load application code from untrusted sources, you have to worry about a lot of things, and so is data validation. Note that the same reasoning applies to Ajv, see https://www.npmjs.com/package/ajv#security-considerations.

Note that there is _already_ a disclaimer for this, so I do not think there is anything more to add: https://github.com/fastify/fastify/blob/master/docs/Validation-and-Serialization.md#--security-notice. Let me know if you think that sentence is not enough, but it seems pretty clear to me.
- **2019-06-17** @lirantal: Completely agree, thanks for pointing out the details.
I missed that validation-specific doc at https://github.com/fastify/fastify/blob/master/docs/Validation-and-Serialization.md but now that you pointed it out I'm ok with this notice.

I'm ok to resolve as-is (no CVE and no PRing to the security-wg repo as this is not a security vulnerability).
- **2019-06-17** @lirantal: @phra any strong objections?
- **2019-06-17** @phra: Hi @lirantal , thanks for joining the conversation. I have some points that I would like to mention:

1. First of all, I want to point out that adding a *security disclaimer* to a README doesn't declass a code injection to something else. Instead, we worked together to patch the source code in order to prevent injections by design, effectively patching the reported vulnerability. Moreover, the *security disclaimer* was added _one week later_ this report was sent, proving the value of this responsible disclosure, as you can see from this commit https://github.com/fastify/fastify/commit/a387f0575bab4f3077c374faab680e30931e4036

2. The vulnerability itself lived in `fast-json-stringify` and `fastify` is just using that library. I agree that the issue cannot be exploited remotely against any `fastify` web server, but the problem here is that `fast-json-stringify` is a generic library and can be used in other ways compared to `fastify` use case.

3. I have read the Ajv security considerations but it only states about DoS-like attacks, such as slowing down the performance of the application if untrusted data is passed into the schema definition. They also implemented a *meta schema* (https://github.com/epoberezkin/ajv/blob/master/lib/refs/json-schema-secure.json) in order to validate it at runtime. Anyway I see that they use `new Function()` too, so I am going to play with it to understand it better.

Said that, IMHO I agree to change the asset of this report from `fastify` to `fast-json-stringify` (3rd party modules maybe?) but I don't agree on considering this **now patched** code injection as something different that a security risk.
- **2019-06-17** @mcollina: The following is the most important sentence of Ajv threat model:

> Ajv treats JSON schemas as trusted as your application code. 

Before this issue, this was not covered in Fastify docs, and in https://github.com/fastify/fastify/commit/a387f0575bab4f3077c374faab680e30931e4036 we fixed it. This was a direct result of this issue, and we are grateful.

We are happy to include this info in some other places in the docs.

---

The fastify team does not want to consider fast-json-stringify safe to use with untrusted data, nor it consider Ajv safe to use with untrusted data. It's a guarantee that is exceptionally hard to make and maintain, and there are unlimited amount of ways this could go wrong. Moreover, Ajv do not provide that guarantee, and we validate every schema coming in with the same meta model Ajv is using. Therefore, we never spent the time hardening against this, mainly because it was not supposed to be used that way. 
 
Considering it a vulnerability would essentially assume that the team consider it as such and offer such a guarantee. Simply we don't, and we do not plan to. As my experience with all security issues on the Node core team, it is way better to not declare a CVE for something that is just user misuse, because then you immediately become a target for security researcher that try to break escaping/etc. User misuse is just user misuse.

I think it's a good thing to patch, but using new Function with untrusted data is just _too risky_, as it could always be possible to break escaping.
- **2019-06-19** @lirantal: @phra it is easy to take reports like yours for granted so I want to take the opportunity to thank you for all the effort in putting this report up, working with Matteo and working with us to discuss the issue. Your involvement here doesn't go un-noticed and is immensely appreciated ❤️ and I have no doubt Matteo feels the same way.

I will clarify why I think the security issue here in itself is not a security issue for `fast-json-stringify` - this library may handle untrusted data and by consequence "bad things" can happen. For example, consider Node.js's child_process API - you could argue that it has some methods that are vulnerable to command injection but the purpose of the API is not to be ultimately secure but rather to provide access to OS process APIs and it is up to the developer using this API to use it wisely as much as they can. I see `fast-json-stringify` falling in this same spot and this is why I think that this report in first place is correctly geared towards `fastify` the framework and not that module specifically.

As to `fastify`, I can make similar arguments or comparison with say React's dangerouslySetInnerHTML API which may turn code injection into XSS if not used properly and there's no CVE or vulnerability in the React framework due to that. In the same way, I feel that `fastify` falls in this place as well. The project recognizes the fact that the schema you provide is entirely under your (the developer's) control and ownership and its their responsibility to clean/sanitize/validate/etc before using it.

I find triaging security vulnerabilities a tricky business and I understand how this topic can be very border line between vulnerability, bug, and project policies. Regardless I'm happy to continue discussing and learn if you still feel strongly about this being a security vulnerability.

Just to say again with all sincerity that your work is tremendously appreciated and has already contributed to many improvements in the projects we're discussing ❤️
- **2019-08-17** @phra: can you please mark this as _Resolved_ ?
- **2019-09-03** @lirantal: Sincere apologies for the late response, I'll resolve right away!
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
- **Bounty Awarded**
