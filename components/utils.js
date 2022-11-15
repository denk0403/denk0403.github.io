// @ts-check

/**
 * Creates a new HTML element with the given attributes and children elements.
 * @template {keyof HTMLElementTagNameMap} K
 * @param {K} tag
 * @param {?Record<string, string>} [attributes]
 * @param {?Node[]} [children]
 * @returns {HTMLElementTagNameMap[K]}
 */
export function createElement(tag, attributes, children) {
	const elt = document.createElement(tag);
	if (!!attributes) {
		for (const [key, value] of Object.entries(attributes)) {
			elt.setAttribute(key, value);
		}
	}
	if (!!children) {
		elt.append(...children);
	}
	return elt;
}

/**
 * Queries the children of the given element for an element with the specified id.
 * @template {HTMLElement} K
 * @param {HTMLElement | DocumentFragment | InnerHTML | DocumentOrShadowRoot} elt
 * @param {string} id
 * @returns {K}
 */
export function id(elt, id) {
	// @ts-ignore
	return elt.querySelector("#" + id);
}

/**
 * Queries the children of the given element using the specified selector.
 * @template {HTMLElement} K
 * @param {HTMLElement | DocumentFragment | InnerHTML | DocumentOrShadowRoot} elt
 * @param {string} query
 * @returns {K}
 */
export function query(elt, query) {
	// @ts-ignore
	return elt.querySelector(query);
}

/**
 * Returns the specified attribute ("prop") on the given element.
 * @param {HTMLElement} elt
 * @param {string} name
 * @returns {?string}
 */
export function prop(elt, name) {
	return elt.getAttribute(name);
}

/**
 * Freezes the given object.
 * @template K
 * @param {K} obj
//  * @returns {Readonly<K>}
 */
export function fr(obj) {
	return Object.freeze(/** @type {const} */ obj);
}
