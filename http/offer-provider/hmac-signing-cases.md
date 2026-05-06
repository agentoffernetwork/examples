# OfferProvider HMAC-SHA256 Signing Test Vectors

> Reference vectors for Partner implementations of AON → Partner request
> authentication. Every vector below was produced by the Node.js script shown
> in the appendix; Partners can reproduce them byte-for-byte to self-test
> their signature verifier.
>
> See [`protocol/specs/offer-provider-api.md`](../../../protocol/specs/offer-provider-api.md)
> for the normative signing rules.

## Common Inputs

| Field | Value |
|------:|:------|
| Signing algorithm | HMAC-SHA256, lowercase hex encoding |
| Secret | `aon-secret-demo-please-rotate` |
| HTTP method | `POST` |
| HTTP path | `/v1/offers/query` |
| Canonical body (exact bytes) | `{"context":{"user_profile":{"user_pseudo_id":"user_789012"}},"intent":{"content":[{"type":"input_text","text":"hello"}]}}` |

## Signing String Construction

The signing string is formed by joining five components with a single LF
(`\n`, U+000A) character, in this exact order:

```
METHOD       + "\n"
PATH         + "\n"
CANONICAL_BODY (for POST json: the raw UTF-8 body bytes; for GET: the
               RFC 3986-sorted percent-encoded query string) + "\n"
TIMESTAMP    + "\n"
NONCE
```

No trailing newline. No whitespace insertion. The body MUST be the exact
bytes AON transmitted on the wire — Partner MUST NOT re-serialize or
re-sort keys before hashing.

## Test Vectors

### Case 1 — Valid request (expected: `200 OK`)

| Header | Value |
|-------:|:------|
| `X-AON-Key` | `aon-key-demo` |
| `X-AON-Timestamp` | `1776450600` |
| `X-AON-Nonce` | `5f3e1b66-5fb2-4e7b-9f1a-0b8c1d2e3f4a` |
| `X-AON-Signature` | `b386c080e61c3c0fbd317cdb121e956a1cf3a8014c8bcbcce5f69ec123809cdf` |

Partner MUST accept this request and return a `200` success envelope when
the timestamp is within ±5 minutes of Partner server time and the nonce
has not been seen in the last 5 minutes.

### Case 2 — Tampered signature (expected: `401 UNAUTHORIZED`)

Same inputs as Case 1, but with a deliberately wrong signature:

| Header | Value |
|-------:|:------|
| `X-AON-Timestamp` | `1776450600` |
| `X-AON-Nonce` | `5f3e1b66-5fb2-4e7b-9f1a-0b8c1d2e3f4a` |
| `X-AON-Signature` | `deadbeef0badc0ffee0123456789abcdef0123456789abcdef0123456789abcd` |

Partner MUST compute the expected signature, compare in constant time, and
reject with:

```json
{ "code": "UNAUTHORIZED", "message": "invalid signature", "data": {}, "extra": {} }
```

### Case 3 — Expired timestamp (expected: `401 UNAUTHORIZED`)

The signature below is correctly computed for the inputs shown, but the
timestamp (`1776100000`, roughly 4 days before Case 1) falls outside the
mandatory ±5-minute window:

| Header | Value |
|-------:|:------|
| `X-AON-Timestamp` | `1776100000` |
| `X-AON-Nonce` | `5f3e1b66-5fb2-4e7b-9f1a-0b8c1d2e3f4a` |
| `X-AON-Signature` | `0ccf9d5f29d51e8f7d411c6aed8ec2ca2595b661cea4a72f6859d1cb05979fdb` |

Partner MUST reject before even attempting signature verification once the
timestamp falls outside the allowed skew. Recommended error body:

```json
{ "code": "UNAUTHORIZED", "message": "timestamp outside allowed skew", "data": {}, "extra": {} }
```

### Case 4 — Replayed nonce (expected: `401 UNAUTHORIZED` on the 2nd request)

First send Case 1 (accepted). Then, within 5 minutes, send the request
below which re-uses the same nonce with a fresh timestamp and a fresh
signature:

| Header | Value |
|-------:|:------|
| `X-AON-Timestamp` | `1776450800` |
| `X-AON-Nonce` | `5f3e1b66-5fb2-4e7b-9f1a-0b8c1d2e3f4a` |
| `X-AON-Signature` | `6aca456d38ba76e7b62a4778f1ffd8e84d6cdf71ac464507f26dd2c5e005ce8a` |

Partner SHOULD (see Level 1 requirements in the spec) reject the second
request because the nonce has been used within the 5-minute replay window:

```json
{ "code": "UNAUTHORIZED", "message": "nonce already used", "data": {}, "extra": {} }
```

> Partners that operate without a shared nonce store (strictly stateless
> deployments) MAY skip Case 4 enforcement; the `SHOULD`-level nonce
> requirement exists specifically to allow this pragmatic escape hatch for
> very small Partner deployments. Full details are in the spec's
> Authentication section.

## Sample Verify Implementations

> Minimal `verify(secret, signing_string, received_signature_hex) → bool`
> functions in five languages, each using only the standard library. Every
> snippet was test-run against all four Test Vectors above and produced the
> expected accept / reject decision (Case 1 / 3 / 4 → `true`,
> Case 2 → `false`).
>
> Each snippet covers **signature verification only**. A complete L1-conformant
> handler must additionally enforce the timestamp window (§4.3 of the spec)
> and nonce anti-replay (§4.4); see the **Next steps** note after each
> snippet.

### Node.js (built-in `crypto`)

```js
const crypto = require('crypto');

// Strict format check: 64 lowercase/uppercase hex chars.
// `Buffer.from(str, "hex")` silently truncates non-hex chars and odd nibbles,
// so without this guard a verifier would accept e.g. "<valid_sig>zz" or
// "<valid_sig>0" as valid.
const HEX_64 = /^[0-9a-f]{64}$/i;

function verify(secret, signingString, receivedSigHex) {
  if (!HEX_64.test(receivedSigHex)) return false;
  const expected = crypto
    .createHmac('sha256', secret)
    .update(signingString, 'utf8')
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(expected, 'hex'),
    Buffer.from(receivedSigHex, 'hex'),
  );
}
```

**Next steps**: a full handler must also (1) reject when
`|now − X-AON-Timestamp| > 300` seconds (spec §4.3), (2) reject when
`(appkey, X-AON-Nonce)` was seen in the last 5 minutes (spec §4.4), and
(3) return a `401 UNAUTHORIZED` response in the `ApiResponse` envelope
shown in Cases 2–4 above.

### Python 3.7+ (built-in `hmac` + `hashlib`)

```python
import hmac
import hashlib

def verify(secret: bytes, signing_string: bytes, received_sig_hex: str) -> bool:
    expected = hmac.new(secret, signing_string, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, received_sig_hex.lower())
```

`signing_string` is `bytes` — callers are responsible for UTF-8 encoding the
five components and joining them with `b"\n"`. `hmac.compare_digest` is the
constant-time comparison primitive shipped with the standard library.

**Next steps**: enforce the ±5 min timestamp window, dedupe nonces in a
short-TTL store (e.g. Redis `SETEX 300 NX`), and return the `ApiResponse`
JSON envelope on rejection. See spec §4.3–§4.5.

### Go 1.18+ (built-in `crypto/hmac` + `crypto/sha256`)

```go
package partner

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
)

// Verify returns true iff receivedSigHex equals HMAC-SHA256(secret, signingString)
// in lowercase hex, compared in constant time.
func Verify(secret, signingString []byte, receivedSigHex string) bool {
	mac := hmac.New(sha256.New, secret)
	mac.Write(signingString)
	expected := mac.Sum(nil)
	received, err := hex.DecodeString(receivedSigHex)
	if err != nil {
		return false
	}
	return hmac.Equal(expected, received) // constant-time compare
}
```

`hmac.Equal` is constant-time and accepts byte slices of unequal length
without panicking. Decode `receivedSigHex` first so a malformed (non-hex)
input is rejected cleanly rather than triggering a length-mismatch path.

**Next steps**: pair this with handler-level timestamp/nonce checks before
calling `Verify`; that way `Verify` only runs against well-formed,
fresh-window requests. Spec §4.3–§4.5.

### Java 8+ (built-in `javax.crypto.Mac` + `java.security.MessageDigest`)

```java
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.security.MessageDigest;

public final class AonHmac {

    public static boolean verify(byte[] secret, byte[] signingString, String receivedSigHex)
            throws Exception {
        byte[] received = hexDecode(receivedSigHex);
        if (received == null) return false;
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(secret, "HmacSHA256"));
        byte[] expected = mac.doFinal(signingString);
        return MessageDigest.isEqual(expected, received); // constant-time compare
    }

    // Strict hex decode: returns null on any malformed input (wrong length,
    // non-hex chars). `Character.digit` returns -1 for non-hex characters,
    // and naive `(hi << 4) + lo` arithmetic on -1 can decode to legitimate
    // bytes by coincidence — without the `< 0` guard a tampered signature
    // such as "ca" + "x3" + ... would decode to the same bytes as "f3" and
    // verify as valid.
    private static byte[] hexDecode(String s) {
        if (s == null || s.length() != 64) return null; // SHA-256 = 32 bytes = 64 hex chars
        byte[] out = new byte[32];
        for (int i = 0; i < 64; i += 2) {
            int hi = Character.digit(s.charAt(i),     16);
            int lo = Character.digit(s.charAt(i + 1), 16);
            if (hi < 0 || lo < 0) return null;
            out[i / 2] = (byte) ((hi << 4) + lo);
        }
        return out;
    }
}
```

Pass `signingString` as `byte[]` (UTF-8) — never construct it via
`String#getBytes()` without an explicit charset, since the platform default
silently varies between dev/prod environments and will desync the hash.

**Next steps**: same three (timestamp window, nonce dedup, `ApiResponse`
envelope on rejection). Spec §4.3–§4.5.

### PHP 7.2+ (built-in `hash_hmac` + `hash_equals`)

```php
<?php
function aon_verify(string $secret, string $signingString, string $receivedSigHex): bool {
    $expected = hash_hmac('sha256', $signingString, $secret); // lowercase hex by default
    return hash_equals($expected, strtolower($receivedSigHex));
}
```

`hash_hmac` returns lowercase hex by default (the fourth `raw_output`
parameter is `false` unless explicitly set), and `hash_equals` is
constant-time. The `strtolower` on the received value tolerates upstream
clients that uppercase hex.

**Next steps**: same three (timestamp window, nonce dedup, `ApiResponse`
envelope on rejection). Spec §4.3–§4.5.

### Verifying snippet correctness

To confirm any of the snippets above matches the published vectors, feed
each verifier the inputs from Test Vector Case 1 above:

- `secret = "aon-secret-demo-please-rotate"`
- `signing_string = "POST\n/v1/offers/query\n" + body + "\n1776450600\n5f3e1b66-5fb2-4e7b-9f1a-0b8c1d2e3f4a"` where `body` is the canonical body bytes shown under §Common Inputs.
- `received_sig_hex = "b386c080e61c3c0fbd317cdb121e956a1cf3a8014c8bcbcce5f69ec123809cdf"`

A correct verifier returns `true`. Repeat with Cases 2 (must return
`false`), 3, and 4 (both must return `true` for the signature alone — the
rejection in Cases 3/4 is driven by the timestamp/nonce checks that live
*outside* `verify`).

## Appendix — Reproducing the Vectors

```bash
node -e '
const c = require("crypto");
const secret = "aon-secret-demo-please-rotate";
const body = `{"context":{"user_profile":{"user_pseudo_id":"user_789012"}},"intent":{"content":[{"type":"input_text","text":"hello"}]}}`;
function sign(ts, nonce) {
  const s = `POST\n/v1/offers/query\n${body}\n${ts}\n${nonce}`;
  return c.createHmac("sha256", secret).update(s, "utf8").digest("hex");
}
console.log("Case 1:", sign("1776450600", "5f3e1b66-5fb2-4e7b-9f1a-0b8c1d2e3f4a"));
console.log("Case 3:", sign("1776100000", "5f3e1b66-5fb2-4e7b-9f1a-0b8c1d2e3f4a"));
console.log("Case 4:", sign("1776450800", "5f3e1b66-5fb2-4e7b-9f1a-0b8c1d2e3f4a"));
'
```

The same computation in pure shell, when `openssl` is available:

```bash
printf 'POST\n/v1/offers/query\n%s\n%s\n%s' \
  '{"context":{"user_profile":{"user_pseudo_id":"user_789012"}},"intent":{"content":[{"type":"input_text","text":"hello"}]}}' \
  1776450600 \
  5f3e1b66-5fb2-4e7b-9f1a-0b8c1d2e3f4a \
  | openssl dgst -sha256 -hmac "aon-secret-demo-please-rotate" -hex
```

Both commands yield `b386c080…3809cdf` for Case 1.
