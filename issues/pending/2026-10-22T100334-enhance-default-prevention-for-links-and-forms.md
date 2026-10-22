# Decide default prevention for link clicks and form submits

Created: 2026-10-22
Model: Claude Opus 5.5

## Summary

An `<a href>` or `<form>` with `mx-*` attributes issues its mhx request and then also performs the browser default (navigation or submit) unless its trigger has `prevent`.

## Motivation

Putting both `href` and `mx-get` on a link, or both `action` and `mx-*` on a form, is the usual way to keep a page working without JavaScript. In mhx every such element currently needs an explicit `mx-trigger="click prevent"` or `mx-trigger="submit prevent"`. If it is missing, the request runs and the page then navigates away, which looks like mhx not working at all.

htmx cancels these defaults without a modifier. In htmx 2.0.11, `shouldCancel` in `src/htmx.js` returns true for:

- `submit` on a `FORM`
- `click` inside a submit button that belongs to a form
- `click` inside an `<a>` with an `href`, except same-page `#fragment` anchors

`docs/trigger-spec.md` documents `prevent` as the way to call `preventDefault()`, so changing this is a contract decision rather than a bug fix.

## Reproduction

```html
<a href="/full" mx-get="/fragment" mx-target="#out">nav</a>
<div id="out"></div>
<script src="dist/mhx.umd.js"></script>
<script>
  mhx.init_mhx();
  mhx.process(document.body);
</script>
```

Click `nav`. mhx sends `GET /fragment`, then the browser navigates to `/full`.

## Options

- keep the current contract and document in `docs/trigger-spec.md` and the README that links and forms need `prevent`
- prevent the default for the htmx cases above whenever an mhx request runs, and keep `prevent` for other elements

## Acceptance criteria

- the chosen behavior for `<a href>` click and `<form>` submit is written in `docs/trigger-spec.md`
- if defaults are prevented automatically, same-page `#fragment` anchors still navigate

## pending にした理由

`docs/trigger-spec.md` で `prevent` modifier が `preventDefault()` を呼ぶ手段として定義されており、自動で default を止めるかどうかは trigger contract の設計判断になるため。
