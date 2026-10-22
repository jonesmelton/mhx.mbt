# Fix element cache key collision between id-less elements

Created: 2026-10-22
Model: Claude Opus 5.5

## Summary

Elements without an `id` that share a tag name share one cached config, so a trigger on one of them issues another element's request.

## Motivation

`hash_element` in `src/core/mhx.mbt` derives the cache key from `tagName + "#" + id`. Every id-less `<a>` hashes to the same value, so `ConfigCache::get_element_id` returns the same element id for all of them, and `Mhx::load_config` returns the config parsed for whichever was seen first. The same key also shares timing state and `changed` values across those elements.

`docs/ffi-boundary.md` lists element identity as a stable DOM-read responsibility of the FFI, and `ConfigCache::get_element_id` documents itself as using JS-side element tracking. The current key is neither.

Id-less links and inputs are the common case in server-rendered pages, so this breaks ordinary markup.

## Reproduction

```html
<a mx-get="/a" mx-target="#out">a</a>
<a mx-get="/b" mx-target="#out">b</a>
<div id="out"></div>
<script src="dist/mhx.umd.js"></script>
<script>
  mhx.init_mhx();
  mhx.process(document.body);
</script>
```

Click `b`.

- Expected: `GET /b`
- Actual: `GET /a`

## Acceptance criteria

- distinct elements get distinct cache keys regardless of `id`
- the same element keeps the same key across events
- the key does not depend on mutable DOM state such as `id`
- element identity is covered by a smoke test
