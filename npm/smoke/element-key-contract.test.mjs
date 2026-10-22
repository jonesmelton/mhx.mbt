import assert from "node:assert/strict";
import test from "node:test";
import { element_key } from "../../src/ffi/mhx_ffi.js";

class FixtureElement {
  constructor(tagName, id = "") {
    this.tagName = tagName;
    this.id = id;
  }
}

test("element keys distinguish id-less elements with the same tag", () => {
  const first = new FixtureElement("A");
  const second = new FixtureElement("A");

  assert.notEqual(element_key(first), element_key(second));
});

test("element keys are stable for the same element", () => {
  const element = new FixtureElement("INPUT");
  const key = element_key(element);

  assert.equal(element_key(element), key);
  element.id = "renamed";
  assert.equal(element_key(element), key);
});
