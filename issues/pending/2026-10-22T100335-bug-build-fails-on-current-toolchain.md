# Fix the build on the current MoonBit toolchain

Created: 2026-10-22
Model: Claude Opus 5.5

## Summary

The current `moon` (`0.1.20261020`) no longer builds this repository, and CI installs the latest toolchain, so `main` and every pull request now fail at `moon check`.

## Motivation

`.github/workflows/ci.yaml` runs the install script without a version, so it ignores `.tool-versions`. `.tool-versions` pins `moonbit 0.1.20260409`, but `https://cli.moonbitlang.com/binaries/0.1.20260409/moonbit-darwin-aarch64.tar.gz` returns 403, so the pinned version cannot be installed locally either.

On `0.1.20261020`:

- `moon check` stops with "`moon.mod.json` ... is no longer supported. Run `moon fmt` to migrate to `moon.mod`."
- after `moon fmt`, the published `moonbitlang/async@0.16.6` and `f4ah6o/mhx-spec@0.1.1` packages are rejected for the same reason
- `try?` has been removed; `src/core/error_test.mbt` and `src/event/trigger_golden_test.mbt` use it
- the expectation in `src/event/trigger_golden_test.mbt:212` fails because the toolchain now prints strings and chars differently in `inspect` output
- with the migration and the `try?` sites fixed locally, `moon check --target js` reports 82 warnings in this repository, so `--deny-warn` fails

`moonbitlang/async@0.22.5` ships `moon.mod`. With it and a locally migrated `mhx-spec`, the current runtime builds, and its tests pass apart from the `inspect` expectation above. `f4ah6o/mhx-spec@0.1.1` is yanked ("保守してないので") and has no newer release, so the dependency on it cannot be resolved without a decision here. Every published version of `f4ah6o/mhx` and `f4ah6o/tmpx` is yanked with the same reason, so a new registry release may not be the intended direction.

## Options

- publish a new `f4ah6o/mhx-spec` release with `moon.mod` from `f4ah6o/mhx_spec.mbt`
- move the `mhx-spec` packages into this repository and drop the dependency

## Acceptance criteria

- `moon check --deny-warn --target js` and `moon test --target js` pass on the toolchain CI installs
- `.tool-versions` names an installable toolchain, or CI installs the version it names

## pending にした理由

`f4ah6o/mhx-spec` は yank されていて、新しい release を出すか、この repository に取り込むかの判断が必要なため。`docs/architecture.md` は `mhx-spec` を runtime とは別の層として扱っているので、取り込む場合は architecture の変更にもなる。
