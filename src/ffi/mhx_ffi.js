/**
 * mhx_ffi.js - JavaScript FFI glue code for MoonBit Hypermedia X
 * 
 * This file provides the JavaScript implementations for all FFI functions
 * declared in the MoonBit FFI bindings.
 */

// Callback registries for async operations
const fetchCallbacks = new Map();
const mutationCallbacks = new Map();
const mutationRecordsMap = new Map();

// Stable keys for element references, used by the runtime config cache
const elementKeys = new WeakMap();
let nextElementKey = 1;

// Reference to the MoonBit module (set during initialization)
let mbtModule = null;

/**
 * Initialize the FFI with the MoonBit module reference
 * @param {object} module - The MoonBit WASM module exports
 */
export function initMhxFfi(module) {
  mbtModule = module;
}

// Register public exports and callback hooks from MoonBit runtime
export function register_exports(
  init_mhx,
  process,
  handle_event,
  version,
  on_fetch_success,
  on_fetch_error,
  on_mutation_observed
) {
  globalThis.mhx = {
    init_mhx,
    process,
    handle_event,
    version,
  };
  mbtModule = {
    on_fetch_success,
    on_fetch_error,
    on_mutation_observed,
  };
}

// Internal: allow MoonBit code to register exports via FFI
export function mhx_register_exports(
  initMhx,
  processFn,
  handleEvent,
  versionStr,
  onFetchSuccess,
  onFetchError,
  onMutationObserved
) {
  register_exports(
    initMhx,
    processFn,
    handleEvent,
    versionStr,
    onFetchSuccess,
    onFetchError,
    onMutationObserved
  );
}

// ============================================================================
// Document and Window
// ============================================================================

export function get_document() {
  return document;
}

export function get_window() {
  return window;
}

export function document_body(doc) {
  return doc.body;
}

export function document_head(doc) {
  return doc.head;
}

export function document_document_element(doc) {
  return doc.documentElement;
}

export function document_query_selector(doc, selector) {
  return doc.querySelector(selector);
}

export function document_query_selector_exists(doc, selector) {
  return doc.querySelector(selector) !== null;
}

export function document_query_selector_all_count(doc, selector) {
  return doc.querySelectorAll(selector).length;
}

export function document_query_selector_all_at(doc, selector, index) {
  return doc.querySelectorAll(selector)[index];
}

export function document_get_element_by_id(doc, id) {
  return doc.getElementById(id);
}

export function document_element_exists(doc, id) {
  return doc.getElementById(id) !== null;
}

export function document_create_element(doc, tag) {
  return doc.createElement(tag);
}

export function document_url(doc) {
  return doc.URL;
}

export function document_title(doc) {
  return doc.title;
}

export function document_set_title(doc, title) {
  doc.title = title;
}

export function document_active_element(doc) {
  return doc.activeElement;
}

export function document_has_active_element(doc) {
  return doc.activeElement !== null;
}

export function document_add_event_listener(doc, eventType, handler) {
  doc.addEventListener(eventType, handler);
}

export function window_add_event_listener(win, eventType, handler) {
  win.addEventListener(eventType, handler);
}

export function window_location_href(win) {
  return win.location.href;
}

export function window_set_location_href(win, href) {
  win.location.href = href;
}

export function window_history_push_state(win, url, title) {
  win.history.pushState({}, title, url);
}

export function window_history_replace_state(win, url, title) {
  win.history.replaceState({}, title, url);
}

export function window_history_back(win) {
  win.history.back();
}

export function window_history_forward(win) {
  win.history.forward();
}

export function window_set_timeout(win, handler, delayMs) {
  return win.setTimeout(handler, delayMs);
}

export function window_clear_timeout(win, id) {
  win.clearTimeout(id);
}

export function window_set_interval(win, handler, intervalMs) {
  return win.setInterval(handler, intervalMs);
}

export function window_clear_interval(win, id) {
  win.clearInterval(id);
}

export function window_request_animation_frame(win, handler) {
  return win.requestAnimationFrame(handler);
}

export function window_cancel_animation_frame(win, id) {
  win.cancelAnimationFrame(id);
}

// ============================================================================
// Element
// ============================================================================

export function element_get_attribute(elem, name) {
  return elem.getAttribute(name) ?? "";
}

export function element_set_attribute(elem, name, value) {
  elem.setAttribute(name, value);
}

export function element_remove_attribute(elem, name) {
  elem.removeAttribute(name);
}

export function element_has_attribute(elem, name) {
  return !!(elem && elem.hasAttribute && elem.hasAttribute(name));
}

export function element_add_class(elem, className) {
  elem.classList.add(className);
}

export function element_remove_class(elem, className) {
  elem.classList.remove(className);
}

export function element_toggle_class(elem, className) {
  return elem.classList.toggle(className);
}

export function element_has_class(elem, className) {
  return elem.classList.contains(className);
}

export function element_query_selector(elem, selector) {
  return elem.querySelector(selector);
}

export function element_query_selector_exists(elem, selector) {
  return elem.querySelector(selector) !== null;
}

export function element_closest(elem, selector) {
  return elem.closest(selector);
}

export function element_closest_exists(elem, selector) {
  return elem.closest(selector) !== null;
}

export function element_matches(elem, selector) {
  return elem.matches(selector);
}

export function element_same(a, b) {
  return a === b;
}

export function element_key(elem) {
  let key = elementKeys.get(elem);
  if (key === undefined) {
    key = nextElementKey++;
    elementKeys.set(elem, key);
  }
  return key;
}

export function element_parent_element(elem) {
  return elem.parentElement;
}

export function element_has_parent(elem) {
  return elem.parentElement !== null;
}

export function element_tag_name(elem) {
  return elem.tagName;
}

export function element_id(elem) {
  return elem.id ?? "";
}

export function element_set_id(elem, id) {
  elem.id = id;
}

export function element_inner_html(elem) {
  return elem.innerHTML;
}

export function element_set_inner_html(elem, html) {
  elem.innerHTML = html;
}

export function element_outer_html(elem) {
  return elem.outerHTML;
}

export function element_set_outer_html(elem, html) {
  elem.outerHTML = html;
}

export function element_text_content(elem) {
  return elem.textContent ?? "";
}

export function element_set_text_content(elem, text) {
  elem.textContent = text;
}

export function element_insert_adjacent_html(elem, position, html) {
  elem.insertAdjacentHTML(position, html);
}

export function element_remove(elem) {
  elem.remove();
}

export function element_focus(elem) {
  elem.focus();
}

export function element_blur(elem) {
  elem.blur();
}

export function element_is_null(elem) {
  return elem == null;
}

export function element_child_count(elem) {
  return elem.children.length;
}

export function element_child_at(elem, index) {
  return elem.children[index];
}

export function element_value(elem) {
  return elem.value ?? "";
}

export function element_set_value(elem, value) {
  elem.value = value;
}

export function element_dispatch_mhx_event(elem, eventName, detailJson) {
  try {
    const detail = detailJson ? JSON.parse(detailJson) : null;
    elem.dispatchEvent(
      new CustomEvent(eventName, {
        bubbles: true,
        cancelable: false,
        detail,
      }),
    );
    return "";
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }
}

/**
 * Dispatch a mhx:request event by building the detail object directly.
 * Avoids the JSON.stringify -> JSON.parse round-trip for high-frequency request lifecycle events.
 * Empty strings for status/errorJson mean null/absent.
 */
export function element_dispatch_request_event(elem, phase, url, httpMethod, trigger, sourceElement, status, errorJson) {
  try {
    const detail = {
      phase,
      url,
      method: httpMethod,
      trigger,
      sourceElement,
      status: status !== "" ? Number(status) : null,
      error: errorJson !== "" ? JSON.parse(errorJson) : null,
    };
    const eventName = phase === "in_flight" ? "mhx:beforeRequest" : "mhx:afterRequest";
    elem.dispatchEvent(
      new CustomEvent(eventName, {
        bubbles: true,
        cancelable: false,
        detail,
      }),
    );
    return "";
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }
}

/**
 * Dispatch a mhx:swap or mhx:error event by building the detail object directly.
 * Avoids the JSON.stringify -> JSON.parse round-trip for high-frequency swap lifecycle events.
 */
export function element_dispatch_swap_event(elem, phase, trigger, strategy, sourceElement, target) {
  try {
    const detail = {
      phase,
      trigger,
      strategy,
      sourceElement,
      target: target || null,
    };
    const eventName = phase === "swapping" ? "mhx:beforeSwap" :
                      phase === "completed" ? "mhx:afterSwap" :
                      "mhx:error";
    elem.dispatchEvent(
      new CustomEvent(eventName, {
        bubbles: true,
        cancelable: false,
        detail,
      }),
    );
    return "";
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }
}

// ============================================================================
// Event
// ============================================================================

export function event_type(event) {
  return event.type;
}

export function event_target(event) {
  return event.target;
}

export function event_current_target(event) {
  return event.currentTarget;
}

export function event_has_target(event) {
  return event.target !== null;
}

export function event_prevent_default(event) {
  event.preventDefault();
}

export function event_stop_propagation(event) {
  event.stopPropagation();
}

export function event_stop_immediate_propagation(event) {
  event.stopImmediatePropagation();
}

export function event_is_trusted(event) {
  return event.isTrusted;
}

export function event_default_prevented(event) {
  return event.defaultPrevented;
}

export function event_cancel_bubble(event) {
  return event.cancelBubble;
}

export function event_time_stamp(event) {
  return event.timeStamp;
}

export function event_eval_filter(event, expr) {
  try {
    const fn = new Function('event', `with (event) { return !!(${expr}); }`);
    return fn(event);
  } catch (_) {
    return false;
  }
}

// Mouse Event
export function event_as_mouse_event(event) {
  return event;
}

export function mouse_event_client_x(event) {
  return event.clientX;
}

export function mouse_event_client_y(event) {
  return event.clientY;
}

export function mouse_event_ctrl_key(event) {
  return event.ctrlKey;
}

export function mouse_event_shift_key(event) {
  return event.shiftKey;
}

export function mouse_event_alt_key(event) {
  return event.altKey;
}

export function mouse_event_meta_key(event) {
  return event.metaKey;
}

export function mouse_event_button(event) {
  return event.button;
}

// Keyboard Event
export function event_as_keyboard_event(event) {
  return event;
}

export function keyboard_event_key(event) {
  return event.key;
}

export function keyboard_event_code(event) {
  return event.code;
}

export function keyboard_event_ctrl_key(event) {
  return event.ctrlKey;
}

export function keyboard_event_shift_key(event) {
  return event.shiftKey;
}

export function keyboard_event_alt_key(event) {
  return event.altKey;
}

export function keyboard_event_meta_key(event) {
  return event.metaKey;
}

export function keyboard_event_repeat(event) {
  return event.repeat;
}

// Input Event
export function event_as_input_event(event) {
  return event;
}

export function input_event_data(event) {
  return event.data ?? "";
}

export function input_event_input_type(event) {
  return event.inputType ?? "";
}

// Submit Event
export function event_as_submit_event(event) {
  return event;
}

export function submit_event_submitter(event) {
  return event.submitter;
}

export function submit_event_has_submitter(event) {
  return event.submitter !== null;
}

// ============================================================================
// Fetch API
// ============================================================================

export function fetch(url, optionsJson) {
  const options =
    typeof optionsJson === "string" ? JSON.parse(optionsJson) : optionsJson;
  return window.fetch(url, options);
}

export function response_status(response) {
  return response.status;
}

export function response_status_text(response) {
  return response.statusText;
}

export function response_ok(response) {
  return response.ok;
}

export function response_headers(response) {
  return response.headers;
}

export function response_url(response) {
  return response.url;
}

export function response_redirected(response) {
  return response.redirected;
}

export function response_text(response) {
  return response.text();
}

export function response_json(response) {
  return response.json();
}

export function headers_get(headers, name) {
  return headers.get(name) ?? "";
}

export function headers_has(headers, name) {
  return headers.has(name);
}

export function abort_controller_new() {
  return new AbortController();
}

export function abort_controller_signal(controller) {
  return controller.signal;
}

export function abort_controller_abort(controller) {
  controller.abort();
}

export function abort_signal_aborted(signal) {
  return signal.aborted;
}

export function form_data_new() {
  return new FormData();
}

export function form_data_from_element(element) {
  return new FormData(element);
}

export function form_data_append(formData, name, value) {
  formData.append(name, value);
}

export function form_data_get(formData, name) {
  return formData.get(name) ?? "";
}

export function form_data_has(formData, name) {
  return formData.has(name);
}

export function form_data_to_url_encoded(formData) {
  return new URLSearchParams(formData).toString();
}

// ============================================================================
// Async Fetch with Callbacks
// ============================================================================

/**
 * Initiate a fetch request with callback support
 * @param {string} url - The URL to fetch
 * @param {string} optionsJson - JSON-encoded fetch options
 * @param {number} callbackId - The callback ID for response handling
 */
export function initiate_fetch(url, optionsJson, callbackId) {
  const options = JSON.parse(optionsJson);
  const controller = new AbortController();
  
  fetchCallbacks.set(callbackId, { controller });
  
  window.fetch(url, { ...options, signal: controller.signal })
    .then(async (response) => {
      const text = await response.text();
      const callbacks = mbtModule || globalThis.mhx_callbacks;
      if (callbacks && fetchCallbacks.has(callbackId)) {
        callbacks.on_fetch_success(callbackId, text);
      }
    })
    .catch((error) => {
      const errorType = (error instanceof DOMException && error.name === "AbortError") ? "abort" : "network";
      const callbacks = mbtModule || globalThis.mhx_callbacks;
      if (callbacks && fetchCallbacks.has(callbackId)) {
        callbacks.on_fetch_error(callbackId, errorType, error instanceof Error ? error.message : String(error));
      }
    })
    .finally(() => {
      fetchCallbacks.delete(callbackId);
    });
}

/**
 * Cancel a pending fetch request
 * @param {number} callbackId - The callback ID to cancel
 */
export function cancel_fetch(callbackId) {
  const entry = fetchCallbacks.get(callbackId);
  if (entry) {
    entry.controller.abort();
    fetchCallbacks.delete(callbackId);
  }
}

/**
 * Create a dummy response for testing
 */
export function create_dummy_response() {
  return new Response("", { status: 200 });
}

// ============================================================================
// MutationObserver
// ============================================================================

/**
 * Create a new MutationObserver
 * @param {number} callbackId - The callback ID for mutation notifications
 */
export function mutation_observer_new(callbackId) {
  const observer = new MutationObserver((mutations) => {
    // Store mutations for retrieval
    mutationRecordsMap.set(callbackId, mutations);
    // Notify MoonBit
    const callbacks = mbtModule || globalThis.mhx_callbacks;
    if (callbacks) {
      callbacks.on_mutation_observed(callbackId);
    }
  });
  mutationCallbacks.set(callbackId, observer);
  return observer;
}

/**
 * Start observing a target element
 */
export function mutation_observer_observe(observer, target, subtree, childList, attributes) {
  observer.observe(target, {
    subtree,
    childList,
    attributes,
    attributeOldValue: true,
  });
}

/**
 * Stop observing
 */
export function mutation_observer_disconnect(observer) {
  observer.disconnect();
}

/**
 * Get the number of pending mutation records
 */
export function mutation_observer_records_count(observer) {
  // Find the callback ID for this observer
  for (const [callbackId, obs] of mutationCallbacks) {
    if (obs === observer) {
      const records = mutationRecordsMap.get(callbackId);
      return records ? records.length : 0;
    }
  }
  return 0;
}

/**
 * Get mutation record at index
 */
export function mutation_observer_record_at(observer, index) {
  for (const [callbackId, obs] of mutationCallbacks) {
    if (obs === observer) {
      const records = mutationRecordsMap.get(callbackId);
      return records ? records[index] : null;
    }
  }
  return null;
}

/**
 * Clear the records queue
 */
export function mutation_observer_clear_records(observer) {
  for (const [callbackId, obs] of mutationCallbacks) {
    if (obs === observer) {
      mutationRecordsMap.delete(callbackId);
      break;
    }
  }
}

// MutationRecord accessors
export function mutation_record_type(record) {
  return record.type;
}

export function mutation_record_target(record) {
  return record.target;
}

export function mutation_record_added_nodes_count(record) {
  return record.addedNodes.length;
}

export function mutation_record_added_node_at(record, index) {
  return record.addedNodes[index];
}

export function mutation_record_removed_nodes_count(record) {
  return record.removedNodes.length;
}

export function mutation_record_removed_node_at(record, index) {
  return record.removedNodes[index];
}

export function mutation_record_attribute_name(record) {
  return record.attributeName ?? "";
}

export function mutation_record_has_attribute_name(record) {
  return record.attributeName !== null;
}

export function mutation_record_old_value(record) {
  return record.oldValue ?? "";
}

export function mutation_record_has_old_value(record) {
  return record.oldValue !== null;
}

// Node accessors
export function node_is_element(node) {
  return node.nodeType === Node.ELEMENT_NODE;
}

export function node_as_element(node) {
  return node;
}

export function node_node_type(node) {
  return node.nodeType;
}

export function node_node_name(node) {
  return node.nodeName;
}

// ============================================================================
// Console
// ============================================================================

export function console_log(message) {
  console.log(message);
}

export function console_error(message) {
  console.error(message);
}

export function console_warn(message) {
  console.warn(message);
}

export function console_info(message) {
  console.info(message);
}

// ============================================================================
// Timing
// ============================================================================

/**
 * Get current time in milliseconds
 * Uses performance.now() if available, falls back to Date.now()
 */
export function current_time() {
  return typeof performance !== 'undefined' 
    ? performance.now() 
    : Date.now();
}

// ============================================================================
// Export all FFI functions as a module
// ============================================================================

const mhx_ffi = {
  initMhxFfi,
  // Document/Window
  get_document,
  get_window,
  document_body,
  document_head,
  document_document_element,
  document_query_selector,
  document_query_selector_exists,
  document_query_selector_all_count,
  document_query_selector_all_at,
  document_get_element_by_id,
  document_element_exists,
  document_create_element,
  document_url,
  document_title,
  document_set_title,
  document_active_element,
  document_has_active_element,
  document_add_event_listener,
  window_add_event_listener,
  window_location_href,
  window_set_location_href,
  window_history_push_state,
  window_history_replace_state,
  window_history_back,
  window_history_forward,
  window_set_timeout,
  window_clear_timeout,
  window_set_interval,
  window_clear_interval,
  window_request_animation_frame,
  window_cancel_animation_frame,
  // Element
  element_get_attribute,
  element_set_attribute,
  element_remove_attribute,
  element_has_attribute,
  element_add_class,
  element_remove_class,
  element_toggle_class,
  element_has_class,
  element_query_selector,
  element_query_selector_exists,
  element_closest,
  element_closest_exists,
  element_matches,
  element_same,
  element_key,
  element_parent_element,
  element_has_parent,
  element_tag_name,
  element_id,
  element_set_id,
  element_inner_html,
  element_set_inner_html,
  element_outer_html,
  element_set_outer_html,
  element_text_content,
  element_set_text_content,
  element_insert_adjacent_html,
  element_remove,
  element_focus,
  element_blur,
  element_is_null,
  element_child_count,
  element_child_at,
  element_value,
  element_set_value,
  element_dispatch_mhx_event,
  element_dispatch_request_event,
  element_dispatch_swap_event,
  // Event
  event_type,
  event_target,
  event_current_target,
  event_has_target,
  event_prevent_default,
  event_stop_propagation,
  event_stop_immediate_propagation,
  event_is_trusted,
  event_default_prevented,
  event_cancel_bubble,
  event_time_stamp,
  event_eval_filter,
  event_as_mouse_event,
  mouse_event_client_x,
  mouse_event_client_y,
  mouse_event_ctrl_key,
  mouse_event_shift_key,
  mouse_event_alt_key,
  mouse_event_meta_key,
  mouse_event_button,
  event_as_keyboard_event,
  keyboard_event_key,
  keyboard_event_code,
  keyboard_event_ctrl_key,
  keyboard_event_shift_key,
  keyboard_event_alt_key,
  keyboard_event_meta_key,
  keyboard_event_repeat,
  event_as_input_event,
  input_event_data,
  input_event_input_type,
  event_as_submit_event,
  submit_event_submitter,
  submit_event_has_submitter,
  // Fetch
  fetch,
  response_status,
  response_status_text,
  response_ok,
  response_headers,
  response_url,
  response_redirected,
  response_text,
  response_json,
  headers_get,
  headers_has,
  abort_controller_new,
  abort_controller_signal,
  abort_controller_abort,
  abort_signal_aborted,
  form_data_new,
  form_data_from_element,
  form_data_append,
  form_data_get,
  form_data_has,
  form_data_to_url_encoded,
  // Async Fetch
  initiate_fetch,
  cancel_fetch,
  create_dummy_response,
  // MutationObserver
  mutation_observer_new,
  mutation_observer_observe,
  mutation_observer_disconnect,
  mutation_observer_records_count,
  mutation_observer_record_at,
  mutation_observer_clear_records,
  mutation_record_type,
  mutation_record_target,
  mutation_record_added_nodes_count,
  mutation_record_added_node_at,
  mutation_record_removed_nodes_count,
  mutation_record_removed_node_at,
  mutation_record_attribute_name,
  mutation_record_has_attribute_name,
  mutation_record_old_value,
  mutation_record_has_old_value,
  node_is_element,
  node_as_element,
  node_node_type,
  node_node_name,
  // Console
  console_log,
  console_error,
  console_warn,
  console_info,
  // Timing
  current_time,
};

export default mhx_ffi;

if (typeof globalThis !== "undefined" && !globalThis.mhx_ffi) {
  globalThis.mhx_ffi = mhx_ffi;
}

function build_process_from_global(g) {
  if (g.f4ah6o$mhx$core$$process) {
    return g.f4ah6o$mhx$core$$process;
  }
  if (g.f4ah6o$mhx$core$$Mhx$process_tree && g.f4ah6o$mhx$core$$global_mhx) {
    return (root) =>
      g.f4ah6o$mhx$core$$Mhx$process_tree(g.f4ah6o$mhx$core$$global_mhx, root);
  }
  return null;
}

function try_register_from_global() {
  if (mbtModule !== null && globalThis.mhx) {
    return true;
  }
  const g = globalThis;
  const init = g.f4ah6o$mhx$core$$init_mhx;
  const handle = g.f4ah6o$mhx$core$$handle_event;
  const onFetchOk = g.f4ah6o$mhx$network$$on_fetch_success;
  const onFetchErr = g.f4ah6o$mhx$network$$on_fetch_error;
  const onMutation = g.f4ah6o$mhx$core$$on_mutation_observed;
  const process = build_process_from_global(g);
  if (init && handle && onFetchOk && onFetchErr && onMutation && process) {
    const version =
      g.f4ah6o$mhx$$version || g.f4ah6o$mhx$core$$version || "unknown";
    register_exports(
      init,
      process,
      handle,
      version,
      onFetchOk,
      onFetchErr,
      onMutation
    );
    return true;
  }
  return false;
}

function auto_register_exports() {
  if (try_register_from_global()) {
    return;
  }
  if (typeof setTimeout !== "function") {
    return;
  }
  let attempts = 0;
  const maxAttempts = 50;
  const retry = () => {
    attempts += 1;
    if (try_register_from_global() || attempts >= maxAttempts) {
      return;
    }
    setTimeout(retry, 0);
  };
  setTimeout(retry, 0);
}

auto_register_exports();
