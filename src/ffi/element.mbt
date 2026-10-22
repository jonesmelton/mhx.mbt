///|
/// FFI bindings for DOM Element type
/// Provides zero-copy access to DOM elements via externref

///|
/// Opaque type representing a DOM Element
#external
pub type Element

///|
/// Get an attribute value from the element (returns empty string if not present)
/// Use has_attribute to check existence
pub fn Element::get_attribute(self : Element, name : String) -> String = "mhx_ffi" "element_get_attribute"

///|
/// Set an attribute value on the element
pub fn Element::set_attribute(
  self : Element,
  name : String,
  value : String,
) -> Unit = "mhx_ffi" "element_set_attribute"

///|
/// Remove an attribute from the element
pub fn Element::remove_attribute(self : Element, name : String) -> Unit = "mhx_ffi" "element_remove_attribute"

///|
/// Check if the element has an attribute
pub fn Element::has_attribute(self : Element, name : String) -> Bool = "mhx_ffi" "element_has_attribute"

///|
/// Add a CSS class to the element
pub fn Element::add_class(self : Element, class_name : String) -> Unit = "mhx_ffi" "element_add_class"

///|
/// Remove a CSS class from the element
pub fn Element::remove_class(self : Element, class_name : String) -> Unit = "mhx_ffi" "element_remove_class"

///|
/// Toggle a CSS class on the element
pub fn Element::toggle_class(self : Element, class_name : String) -> Bool = "mhx_ffi" "element_toggle_class"

///|
/// Check if the element has a CSS class
pub fn Element::has_class(self : Element, class_name : String) -> Bool = "mhx_ffi" "element_has_class"

///|
/// Query for a single descendant element matching the selector
/// Returns the element or a null reference
pub fn Element::query_selector_ffi(
  self : Element,
  selector : String,
) -> Element = "mhx_ffi" "element_query_selector"

///|
/// Check if query_selector found an element
pub fn Element::query_selector_exists(
  self : Element,
  selector : String,
) -> Bool = "mhx_ffi" "element_query_selector_exists"

///|
/// Find the closest ancestor (or self) matching the selector
pub fn Element::closest_ffi(self : Element, selector : String) -> Element = "mhx_ffi" "element_closest"

///|
/// Check if closest found an element
pub fn Element::closest_exists(self : Element, selector : String) -> Bool = "mhx_ffi" "element_closest_exists"

///|
/// Check if the element matches a selector
pub fn Element::matches(self : Element, selector : String) -> Bool = "mhx_ffi" "element_matches"

///|
/// Get the parent element (may be null)
pub fn Element::parent_element_ffi(self : Element) -> Element = "mhx_ffi" "element_parent_element"

///|
/// Check if the element has a parent
pub fn Element::has_parent(self : Element) -> Bool = "mhx_ffi" "element_has_parent"

///|
/// Check if two elements are the same reference
pub fn Element::same(self : Element, other : Element) -> Bool = "mhx_ffi" "element_same"

///|
/// Get a key that stays stable for this element reference
pub fn Element::key(self : Element) -> Int = "mhx_ffi" "element_key"

///|
/// Get the tag name (uppercase)
pub fn Element::tag_name(self : Element) -> String = "mhx_ffi" "element_tag_name"

///|
/// Get the element's id
pub fn Element::id(self : Element) -> String = "mhx_ffi" "element_id"

///|
/// Set the element's id
pub fn Element::set_id(self : Element, id : String) -> Unit = "mhx_ffi" "element_set_id"

///|
/// Get the innerHTML of the element
pub fn Element::inner_html(self : Element) -> String = "mhx_ffi" "element_inner_html"

///|
/// Set the innerHTML of the element
pub fn Element::set_inner_html(self : Element, html : String) -> Unit = "mhx_ffi" "element_set_inner_html"

///|
/// Get the outerHTML of the element
pub fn Element::outer_html(self : Element) -> String = "mhx_ffi" "element_outer_html"

///|
/// Set the outerHTML of the element (replaces the element)
pub fn Element::set_outer_html(self : Element, html : String) -> Unit = "mhx_ffi" "element_set_outer_html"

///|
/// Get the text content of the element (empty string if none)
pub fn Element::text_content(self : Element) -> String = "mhx_ffi" "element_text_content"

///|
/// Set the text content of the element
pub fn Element::set_text_content(self : Element, text : String) -> Unit = "mhx_ffi" "element_set_text_content"

///|
/// Insert HTML adjacent to the element
/// position: "beforebegin", "afterbegin", "beforeend", "afterend"
pub fn Element::insert_adjacent_html(
  self : Element,
  position : String,
  html : String,
) -> Unit = "mhx_ffi" "element_insert_adjacent_html"

///|
/// Remove the element from the DOM
pub fn Element::remove(self : Element) -> Unit = "mhx_ffi" "element_remove"

///|
/// Focus the element
pub fn Element::focus(self : Element) -> Unit = "mhx_ffi" "element_focus"

///|
/// Blur the element
pub fn Element::blur(self : Element) -> Unit = "mhx_ffi" "element_blur"

///|
/// Check if this element is null/undefined
pub fn Element::is_null(self : Element) -> Bool = "mhx_ffi" "element_is_null"

///|
/// Get the number of children
pub fn Element::child_count(self : Element) -> Int = "mhx_ffi" "element_child_count"

///|
/// Get child element at index
pub fn Element::child_at(self : Element, index : Int) -> Element = "mhx_ffi" "element_child_at"

///|
/// Get the value (for form elements)
pub fn Element::value(self : Element) -> String = "mhx_ffi" "element_value"

///|
/// Set the value (for form elements)
pub fn Element::set_value(self : Element, value : String) -> Unit = "mhx_ffi" "element_set_value"

///|
/// Dispatch an `mhx:*` CustomEvent with a JSON detail payload.
/// Returns an empty string on success or an error message on failure.
pub fn Element::dispatch_mhx_event(
  self : Element,
  event_name : String,
  detail_json : String,
) -> String = "mhx_ffi" "element_dispatch_mhx_event"

///|
/// Dispatch a request lifecycle event by building the detail object directly in JS.
/// Avoids the JSON.stringify round-trip for high-frequency request events.
/// Pass empty strings for status/error JSON when not applicable.
pub fn Element::dispatch_request_event(
  self : Element,
  phase : String,
  url : String,
  http_method : String,
  trigger : String,
  source_element : String,
  status : String,
  error_json : String,
) -> String = "mhx_ffi" "element_dispatch_request_event"

///|
/// Dispatch a swap lifecycle event by building the detail object directly in JS.
/// Avoids the JSON.stringify round-trip for high-frequency swap events.
pub fn Element::dispatch_swap_event(
  self : Element,
  phase : String,
  trigger : String,
  strategy : String,
  source_element : String,
  target : String,
) -> String = "mhx_ffi" "element_dispatch_swap_event"
