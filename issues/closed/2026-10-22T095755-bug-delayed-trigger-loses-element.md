# Fix delayed triggers running against the wrong element

Created: 2026-10-22
Completed: 2026-10-22
Model: Claude Opus 5.5

## Summary

A trigger with `delay`, `throttle` or `debounce` executes its action against whatever element the event walk reached last, not the element that matched.

## Motivation

`Mhx::handle_event` in `src/core/mhx.mbt` walks from the event target to the root with `let mut current`. The callback passed to `@event.apply_timing_modifiers` closes over `current` itself, not its value at match time. By the time the timer fires, the walk has finished and `current` no longer points at the matched element, so `execute_action` collects form values and resolves `this`-relative targets from the wrong element.

Debounced search inputs are one of the main uses of timing modifiers, and they send requests without their value.

## Reproduction

```html
<form>
  <input name="q" mx-get="/search" mx-trigger="input delay:100ms" mx-target="#out">
</form>
<div id="out"></div>
<script src="dist/mhx.umd.js"></script>
<script>
  mhx.init_mhx();
  mhx.process(document.body);
</script>
```

Type `abc` into the input.

- Expected: `GET /search?q=abc`
- Actual: `GET /search`

Without `delay:100ms` the request includes `q=abc`.

## Acceptance criteria

- timed and immediate execution use the element that matched the trigger
- delayed GET requests include the matched element's form values

## 解決方法

`Mhx::handle_event` で trigger が match した時点の `current` を immutable な `element` に束縛し、timing modifier に渡す callback と即時実行の両方でそれを使うようにした。MoonBit の closure は `let mut` の変数そのものを capture するので、以前は delay 後の callback が DOM walk を終えた後の `current` を見ていた。

この経路は `Mhx::handle_event` の DOM walk 全体を通るため、browser app scaffolding なしの MoonBit test では再現できない。issue の HTML を build した `dist/mhx.umd.js` で開き、`GET /search?q=abc` が送られることを確認した。
