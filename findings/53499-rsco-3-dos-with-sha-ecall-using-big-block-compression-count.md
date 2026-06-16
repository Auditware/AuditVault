---
tags:
  - lang/rust
  - sector/zk
  - platform/hexens
  - has/github
  - severity/high
  - novelty/known-pattern
protocol: "[[Risc Zero]]"
auditors:
  - "[[Hexens]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Hexens/2023-10-31-Risc Zero.md"
genome:
  - "[[frozen-funds]]"
  - "[[known-pattern]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
  - "[[integer-bounds]]"
---
# [RSCO-3] DoS with SHA ECALL using big block compression count

- id: 53499
- impact: HIGH
- protocol: [[Risc Zero]]
- reporter: Hexens
- source: https://github.com/solodit/solodit_content/blob/main/reports/Hexens/2023-10-31-Risc Zero.md

## Summary


A high severity bug has been found in the executor.rs file of the zkvm project. This bug affects the SYSCALL(3) function, which is used for implementing the SHA256 hash function. The function takes in various arguments, including a count of block compressions. However, if the SYSCALL(3) is called directly through the ELF assembly, the function fails to check the count value, leading to a Denial of Service attack. This can cause the executor system to exhaust CPU and memory resources. A proof of concept has been created, which can cause a DoS with a count as low as 10000. This bug is crucial for proving ecosystems like Bonsai and can even affect future systems. The recommended solution is to add a check in the ecall_sha() function to prevent counts larger than the set limit. The bug has been fixed.

## Details

**Severity:** High

**Path:** zkvm/src/exec/executor.rs

**Description:**

In the executor.rs the function ecall_sha() implements the SYSCALL(3), which is meant to be the SHA256 hash function's implementation. It takes as arguments the out-state, in-state, blocks' pointers, and the count of the block compressions. 

In case the syscall is being called indirectly through library functions provided by Risc0, there is a check to ensure that the count is no bigger than `MAX_SHA_COMPRESS_BLOCKS` (1000).

```
// Limit syscall buffers so that the Executor doesn't get into an infinite
// split situation.
pub const MAX_BUF_BYTES: usize = 4 * 1024;
pub const MAX_BUF_WORDS: usize = MAX_BUF_BYTES / WORD_SIZE;
pub const MAX_SHA_COMPRESS_BLOCKS: usize = 1000;

...

pub unsafe extern "C" fn sys_sha_buffer(
    out_state: *mut [u32; DIGEST_WORDS],
    in_state: *const [u32; DIGEST_WORDS],
    buf: *const u8,
    count: u32,
) {
...
    while count_remain > 0 {
        let count = min(count_remain, MAX_SHA_COMPRESS_BLOCKS as u32);
        ecall_4(
            ecall::SHA,
            out_state as u32,
            in_state as u32,
            ptr as u32,
            ptr.add(DIGEST_BYTES) as u32,
            count,
        );
...
    }
}
```
The SYSCALL(3) can also be called directly through the ELF’s assembly, passing the count parameter (A4 register) as a bigger number, and the ecall_sha() function will fail to do the sanity check on the count’s value. 

This leads to a Denial of Service of the executor system, with the CPU and Memory resources being exhausted. We have created a Proof of Concept, which uses a count value as low as 10000 and overflows the Memory with more than 130GB as well as overloading the CPU, keeping in mind that the count can be set up to a maximum value of 2^32 -1. 

It is important to note that this attack vector is crucial for proving ecosystems such as Bonsai or any other systems that users might want to create in future. E.g. Bonsai’s single server can be DoS’ed with only one proving request transaction.

```
    fn ecall_sha(&mut self) -> Result<OpCodeResult> {
        let out_state_ptr = self.monitor.load_register(REG_A0);
        let in_state_ptr = self.monitor.load_register(REG_A1);
        let mut block1_ptr = self.monitor.load_register(REG_A2);
        let mut block2_ptr = self.monitor.load_register(REG_A3);
        let count = self.monitor.load_register(REG_A4);

        let in_state: [u8; DIGEST_BYTES] = self.monitor.load_array(in_state_ptr)?;
        let mut state: [u32; DIGEST_WORDS] = bytemuck::cast_slice(&in_state).try_into().unwrap();
        for word in &mut state {
            *word = word.to_be();
        }

        log::debug!("Initial sha state: {state:08x?}");
        for _ in 0..count {
          ...
        }
```

**Remediation:**  Add a check in executor’s ecall_sha() function to panic or bail in case the the count is bigger than `MAX_SHA_COMPRESS_BLOCKS`.

**Status:**  Fixed


- - -
