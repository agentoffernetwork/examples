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
| Canonical body (exact bytes) | `{"context":{"user_profile":{"viewer_id":"user_789012"}},"intent":{"content":[{"type":"input_text","text":"hello"}]}}` |

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

### Case 1 — Valid request (expected: `200 SUCCESS`)

| Header | Value |
|-------:|:------|
| `X-AON-Key` | `aon-key-demo` |
| `X-AON-Timestamp` | `1776450600` |
| `X-AON-Nonce` | `5f3e1b66-5fb2-4e7b-9f1a-0b8c1d2e3f4a` |
| `X-AON-Signature` | `caf3750cd62371a5d95e1ef781a63e0ef808c979734c7c34e0f407bf8835c5d9` |

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
| `X-AON-Signature` | `959ba6059028a74de775b6711a4a441d6ada5b1436aff9b891a07e0d9b4d6211` |

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
| `X-AON-Signature` | `2d4b02c639df4fbca383240f4f21835852d86c2eac1e69052aa263bd4180779c` |

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

## Appendix — Reproducing the Vectors

```bash
node -e '
const c = require("crypto");
const secret = "aon-secret-demo-please-rotate";
const body = `{"context":{"user_profile":{"viewer_id":"user_789012"}},"intent":{"content":[{"type":"input_text","text":"hello"}]}}`;
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
  '{"context":{"user_profile":{"viewer_id":"user_789012"}},"intent":{"content":[{"type":"input_text","text":"hello"}]}}' \
  1776450600 \
  5f3e1b66-5fb2-4e7b-9f1a-0b8c1d2e3f4a \
  | openssl dgst -sha256 -hmac "aon-secret-demo-please-rotate" -hex
```

Both commands yield `caf3750c…35c5d9` for Case 1.
