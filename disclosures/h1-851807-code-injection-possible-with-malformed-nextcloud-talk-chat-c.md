---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/code-injection
  - env/web
substate: "resolved"
weakness: "Code Injection"
enriched: true
date: 2020-06-02
submitted: 2020-04-16T20:44:33.101Z
bounty_usd: null
votes: 317
cve: "CVE-2020-8180"
program: "[[programs/nextcloud|Nextcloud]]"
reporter: "covert-spectre"
source: "https://hackerone.com/reports/851807"
title: "Code injection possible with malformed Nextcloud Talk chat commands"
---
# Code injection possible with malformed Nextcloud Talk chat commands

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 317 | **Program:** Nextcloud | **Disclosed:** 2020-06-02

- Report: [https://hackerone.com/reports/851807](https://hackerone.com/reports/851807)
- CWE: Code Injection | CVE: CVE-2020-8180
- Submitted: 2020-04-16T20:44:33.101Z

## Report summary

The Nextcloud Talk app allows system administrators to setup chat commands that can be executed in Talk using the "/command" syntax. Users can provide additional arguments to the commands, such as "/calc 1+1" or "/wiki Hello", which are passed to the underlying script using @exec. If arguments are accepted, it is possible to trigger arbitrary code by wrapping the code in bash subcommand syntax /wiki test $(mycommand). This allows for arbitrary code execution, which an actor can use to spawn a reverse shell back from the remote machine.

## Timeline

- **Report Filed**
- **2020-04-16** @Nextcloud: Thanks a lot for reporting this potential issue back to us!

Our security team will take a look at this issue as soon as possible. We will reply to your report within 72 hours, usually much faster. For obvious reasons we'd like to ask you to not disclose this issue to any other party.
- **2020-04-16** @covert-spectre: Reposting commands with correct markdown formatting.
Once shell.sh is uploaded via alice, run the following commands in a Talk Conversation:
```
/wiki test $(chmod +x /var/snap/nextcloud/common/nextcloud/data/alice/files/shell.sh) 
/wiki test $(bash /var/snap/nextcloud/common/nextcloud/data/alice/files/shell.sh) 
```
- **2020-04-17** @nickvergessen: Can you confirm that the following patch is enough:

```diff
diff --git a/lib/Chat/Command/ShellExecutor.php b/lib/Chat/Command/ShellExecutor.php
index 6c99aa89..e21210db 100644
--- a/lib/Chat/Command/ShellExecutor.php
+++ b/lib/Chat/Command/ShellExecutor.php
@@ -48,7 +48,7 @@ class ShellExecutor {
                        escapeshellarg($room),
                        escapeshellarg($user),
                        $this->escapeArguments($arguments),
-                       str_replace('"', '\\"', $arguments),
+                       str_replace(['$', '"'], ['\\$', '\\"'], $arguments),
                ], $cmd);
 
                return $this->wrapExec($cmd);
```
- **Report Severity Updated**
- **Report Triaged**
- **2020-04-17** @nickvergessen: Seemed to not be enough, so we decided to go for a more generic approach for the moment.
Can you give the following patch a try?

```diff
diff --git a/lib/Chat/Command/ShellExecutor.php b/lib/Chat/Command/ShellExecutor.php
index 6c99aa89..40515c70 100644
--- a/lib/Chat/Command/ShellExecutor.php
+++ b/lib/Chat/Command/ShellExecutor.php
@@ -28,6 +28,8 @@ class ShellExecutor {
 	public const PLACEHOLDER_ROOM = '{ROOM}';
 	public const PLACEHOLDER_USER = '{USER}';
 	public const PLACEHOLDER_ARGUMENTS = '{ARGUMENTS}';
+
+	// Legacy placeholder just returning the --help nowadays
 	public const PLACEHOLDER_ARGUMENTS_DOUBLEQUOTE_ESCAPED = '{ARGUMENTS_DOUBLEQUOTE_ESCAPED}';
 
 	/**
@@ -39,59 +41,23 @@ class ShellExecutor {
 	 * @throws \InvalidArgumentException
 	 */
 	public function execShell(string $cmd, string $arguments, string $room = '', string $user = ''): string {
+		if (strpos($cmd, self::PLACEHOLDER_ARGUMENTS_DOUBLEQUOTE_ESCAPED) !== false) {
+			throw new \InvalidArgumentException('Talk commands using the {ARGUMENTS_DOUBLEQUOTE_ESCAPED} are not supported anymore.');
+		}
+
 		$cmd = str_replace([
 			self::PLACEHOLDER_ROOM,
 			self::PLACEHOLDER_USER,
 			self::PLACEHOLDER_ARGUMENTS,
-			self::PLACEHOLDER_ARGUMENTS_DOUBLEQUOTE_ESCAPED,
 		], [
 			escapeshellarg($room),
 			escapeshellarg($user),
-			$this->escapeArguments($arguments),
-			str_replace('"', '\\"', $arguments),
+			escapeshellarg($arguments),
 		], $cmd);
 
 		return $this->wrapExec($cmd);
 	}
 
-	protected function escapeArguments(string $argumentString): string {
-		$arguments = explode(' ', $argumentString);
-
-		$result = [];
-		$buffer = [];
-		$quote = '';
-		foreach ($arguments as $argument) {
-			if ($quote === '') {
-				if (ltrim($argument, '"\'') === $argument) {
-					$result[] = escapeshellarg($argument);
-				} else {
-					$quote = $argument[0];
-					$temp = substr($argument, 1);
-					if (rtrim($temp, $quote) === $temp) {
-						$buffer[] = $temp;
-					} else {
-						$result[] = $quote . str_replace($quote, '\\'. $quote, substr($temp, 0, -1)) . $quote;
-						$quote = '';
-					}
-				}
-			} else if (rtrim($argument, $quote) === $argument) {
-				$buffer[] = $argument;
-			} else {
-				$buffer[] = substr($argument, 0, -1);
-
-				$result[] = $quote . str_replace($quote, '\\'. $quote, implode(' ', $buffer)) . $quote;
-				$quote = '';
-				$buffer = [];
-			}
-		}
-
-		if ($quote !== '') {
-			$result[] = escapeshellarg($quote . implode(' ', $buffer));
-		}
-
-		return implode(' ', $result);
-	}
-
 	/**
 	 * @param string $cmd
 	 * @return string
diff --git a/lib/Command/Command/AddSamples.php b/lib/Command/Command/AddSamples.php
index dde16db5..6e601ac3 100644
--- a/lib/Command/Command/AddSamples.php
+++ b/lib/Command/Command/AddSamples.php
@@ -67,7 +67,7 @@ protected function execute(InputInterface $input, OutputInterface $output) {
 			$output,
 			'wiki',
 			'Wikipedia',
-			'php ' . $appPath . '/sample-commands/wikipedia.php "{ARGUMENTS_DOUBLEQUOTE_ESCAPED}"'
+			'php ' . $appPath . '/sample-commands/wikipedia.php {ARGUMENTS}'
 		);
 
 		$chmod = fileperms($appPath . '/sample-commands/calc.sh');
@@ -80,7 +80,7 @@ protected function execute(InputInterface $input, OutputInterface $output) {
 				$output,
 				'calculator',
 				'Calculator',
-				$appPath . '/sample-commands/calc.sh "{ARGUMENTS_DOUBLEQUOTE_ESCAPED}"',
+				$appPath . '/sample-commands/calc.sh {ARGUMENTS}',
 				Command::RESPONSE_USER
 			);
 
@@ -97,7 +97,7 @@ protected function execute(InputInterface $input, OutputInterface $output) {
 			$output,
 			'hackernews',
 			'Hacker News',
-			'php ' . $appPath . '/sample-commands/hackernews.php "{ARGUMENTS_DOUBLEQUOTE_ESCAPED}"'
+			'php ' . $appPath . '/sample-commands/hackernews.php {ARGUMENTS}'
 		);
 
 		if (empty($this->commands)) {
```
- **2020-04-17** @covert-spectre: I deployed the code changes as described but it does not look like the changes fixed the issue - I am still able to execute $(subcommands) - please see attached screenshots. 

I am not a PHP developer, however, the documentation for `escapeshellarg` suggests that it will not fix this issue as it is only concerned with adding quotes for escaping. I believe it is nessesary to run the resulting `cmd` string through `escapeshellcmd` which precedes `$` with a backslash, though please note the document states `are escaped only if they are not paired` and it is not clear what "not paired" means. 

[escapeshellarg](https://www.php.net/manual/en/function.escapeshellarg.php)
> escapeshellarg() adds single quotes around a string and quotes/escapes any existing single quotes allowing you to pass a string directly to a shell function and having it be treated as a single safe argument. This function should be used to escape individual arguments to shell functions coming from user input. The shell functions include exec(), system() and the backtick operator. On Windows, escapeshellarg() instead replaces percent signs, exclamation marks (delayed variable substitution) and double quotes with spaces and adds double quotes around the string. 

[escapeshellcmd](https://www.php.net/manual/en/function.escapeshellcmd.php)
> escapeshellcmd() escapes any characters in a string that might be used to trick a shell command into executing arbitrary commands. This function should be used to make sure that any data coming from user input is escaped before this data is passed to the exec() or system() functions, or to the backtick operator.  Following characters are preceded by a backslash: &#;`|*?~<>^()[]{}$\, \x0A and \xFF. ' and " are escaped only if they are not paired. In Windows, all these characters plus % and ! are replaced by a space instead. 

Possible Fix
Possible fix, by adding `escapeshellcmd`. I've attempted to deploy this myself, however the change causes the /wiki command to hang indefinitely. This may be the fix but requires additional engineering and testing to ensure the commands work correctly. 
```
public function execShell(string $cmd, string $arguments, string $room = '', string $user = ''): string {

	if (strpos($cmd, self::PLACEHOLDER_ARGUMENTS_DOUBLEQUOTE_ESCAPED) !== false) {
		throw new \InvalidArgumentException('Talk commands using the {ARGUMENTS_DOUBLEQUOTE_ESCAPED} are not supported anymore.');
	}

	$cmd = str_replace([
		self::PLACEHOLDER_ROOM,
		self::PLACEHOLDER_USER,
		self::PLACEHOLDER_ARGUMENTS,
	], [
		escapeshellarg($room),
		escapeshellarg($user),
		escapeshellarg($arguments),
	], $cmd);
		
	$cmd = escapeshellcmd($cmd); //<-------possible fix-------
	return $this->wrapExec($cmd);
}
```
- **2020-04-20** @nickvergessen: The commands in your database are not correct, they should be:
```
php /var/snap/nextcloud/current/nextcloud/extra-apps/spreed/sample-commands/wikipedia.php {ARGUMENTS}
```
now. so `{ARGUMENTS}` is not in quotes anymore
- **2020-04-20** @covert-spectre: Thanks for catching that, missed it in my edits. I've reinstall and redeployed your modifications. I can verify that I am no longer able to reproduce the issue. Screenshot attached of fix working as intended.
- **2020-04-20** @nickvergessen: I added one more commit to prevent the escaped parameters from being used inside single quotes ' , double quotes " and backticks `
- **Report Resolved**
- **2020-04-21** @covert-spectre: Please credit me as Spectre, no other details necessary. 
Thank you.
- **Report Severity Updated**
- **Report Severity Updated**
- **Report Title Updated**
- **2020-04-29** @covert-spectre: Hello. Is there a status update on this issue? I've been watching the [Advisories Page](https://nextcloud.com/security/advisories/) and have not seen anything related to this yet. Additionally, I wanted to inquire to see if this RCE bug will have a bounty payout.
- **2020-04-30** @nickvergessen: Hello,

> Is there a status update on this issue? I've been watching the Advisories Page and have not seen anything related to this yet. 

the SA will be published 4 weeks after the release and is currently scheduled for 18th of May.

> Additionally, I wanted to inquire to see if this RCE bug will have a bounty payout. 

Yes it is applicable for a bounty and we will set it later today.

cheers
- **2020-04-30** @nickvergessen: The advisory link will be https://nextcloud.com/security/advisory/?id=NC-SA-2020-020 and a CVE will be requested when this source is made public.
- **Bounty Awarded**
- **2020-04-30** @covert-spectre: Thank you for the update and the bounty. 
Looking forward to the final advisory release.
- **Agreed On Going Public**
- **2020-06-02** @nickvergessen: Sorry about the mix up its 2020-021 (as per last link) not 2020-020 like I stated end of april.
- **Manually Disclosed**
