# FFI boundary

`mhx` runs across MoonBit code and a JavaScript glue layer in `src/ffi/mhx_ffi.js`.
This document defines the browser runtime boundary. Anything not listed as a stable npm/browser export is implementation detail, even when it is present in repo-local source files for MoonBit FFI linking or tests.

## Stable browser-package exports

The npm/browser package contract exposes only:

- `init_mhx`
- `process`
- `handle_event`
- `version`
- `default`, a namespace object containing the same stable members

For UMD, the global `mhx` object exposes those same stable members. `mhx.default` is the default namespace object and contains `init_mhx`, `process`, `handle_event`, and `version`.

The package `exports` map exposes only `"."`. Published ESM and UMD bundles must not provide subpath access to `src/ffi/mhx_ffi.js`, callback registries, generated MoonBit symbols, or internal callback hooks such as `on_fetch_success`, `on_fetch_error`, and `on_mutation_observed`.

## Stable runtime FFI responsibilities

These function groups are stable as responsibilities of the runtime boundary. Their individual JavaScript names are not npm public API unless they appear in the browser-package exports above.

| Area | Stable responsibility | Failure behavior |
| --- | --- | --- |
| DOM reads | read attributes, selector matches, form values, element identity, children, and document/window state needed by runtime parsing and target resolution | selector/config failures are reported as structured `MhxError` values before DOM mutation |
| DOM writes | set attributes/classes/text/value and perform swap primitives (`innerHTML`, `outerHTML`, `insertAdjacentHTML`, `remove`) | swap target failures become structured selector/swap errors |
| Event bridge | register document/window/element listeners, inspect event fields, evaluate trigger filters, and dispatch `mhx:*` lifecycle events | dispatch failures return an error string to MoonBit and are converted to `MHX_FFI_ERROR` |
| Fetch bridge | start async fetch requests, attach abort signals, cancel by callback id, and normalize success/error callbacks | network failures become `MHX_NETWORK_ERROR`; aborts become `MHX_ABORT_ERROR` |
| MutationObserver bridge | observe runtime roots and notify MoonBit when new matching elements may need processing | callback ids and mutation record queues remain internal |
| Timer bridge | provide timeout/interval/animation-frame handles used by trigger timing | scheduling details remain internal to the runtime |
| Logging bridge | write diagnostic messages to `console` | diagnostics do not change public event payload shape |

## Internal-only FFI responsibilities

Internal-only glue includes:

- `fetchCallbacks`, `mutationCallbacks`, and mutation record queues
- `initMhxFfi`, `register_exports`, and `mhx_register_exports`
- callback hooks from MoonBit to JavaScript glue: `on_fetch_success`, `on_fetch_error`, and `on_mutation_observed`
- generated MoonBit function names copied into `dist/index.mjs` during `npm/postbuild.mjs`
- build-time bootstrap and retry wiring used to connect the compiled MoonBit module to `globalThis.mhx`
- repo-local `src/ffi/mhx_ffi.js` named exports used by MoonBit FFI declarations and smoke tests

## Failure mapping

All observable runtime failures should be handled through `MhxError` and lifecycle event details rather than raw JavaScript exceptions.

| Source | Public shape |
| --- | --- |
| malformed config or trigger DSL crossing into runtime setup | `ConfigError` with a stable `MHX_VALIDATE_*` or `MHX_PARSE_*` code |
| missing swap target or invalid extended selector | selector error with stable code and `sourceElement` when available |
| fetch rejection | `NetworkError` with `MHX_NETWORK_ERROR` |
| fetch abort | `AbortError` with `MHX_ABORT_ERROR` |
| lifecycle `CustomEvent` construction/dispatch failure | `FfiError` with `MHX_FFI_ERROR` |

`mhx:error` detail has the form:

```json
{
  "error": {
    "category": "FfiError",
    "code": "MHX_FFI_ERROR",
    "message": "FFI operation `element.dispatch_mhx_event` failed: ...",
    "attribute": null,
    "sourceElement": null,
    "position": null,
    "recoverable": true
  },
  "sourceElement": "button#save"
}
```

Request failure events use `mhx:afterRequest` and carry the same structured error object in `detail.error`. The stable error fields are documented in `docs/error-model.md`.

## Verification contract

Package and boundary checks live in:

- `npm/smoke/package-contract.test.mjs` for ESM/UMD exports, `package.json` exports, and published file surface
- `npm/smoke/swap-contract.test.mjs` for DOM swap primitives, lifecycle event details, and representative FFI dispatch failure behavior
- `npm/smoke/element-key-contract.test.mjs` for element identity keys used by the runtime config cache
- `src/core/error_test.mbt` for stable `MhxError` JSON fields, including `MHX_FFI_ERROR`
