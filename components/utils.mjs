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
 * @param {TemplateStringsArray} innerHTML
 * @param {...any} rest
 * @return {HTMLTemplateElement}
 */
export function template(innerHTML, ...rest) {
	const templElt = createElement("template");

	let parsedHTML = "";
	let i = 0;
	while (i < rest.length) {
		parsedHTML += innerHTML[i] + String(rest[i]);
		i++;
	}
	parsedHTML += innerHTML[i];

	templElt.innerHTML = parsedHTML;
	return templElt;
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
 * Queries the given element for the first child matching the specified selector.
 * @template {HTMLElement} K
 * @param {HTMLElement | DocumentFragment} elt
 * @param {string} query
 * @returns {?K}
 */
export function query(elt, query) {
	return elt.querySelector(query);
}

/**
 * Queries the given element for all the children matching the specified selector.
 * @param {HTMLElement | DocumentFragment} elt
 * @param {string} query
 * @returns {NodeListOf<Element>}
 */
export function queryAll(elt, query) {
	return elt.querySelectorAll(query);
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
 * Memoizes the result of the given parameter-less function.
 * @template K
 * @param {() => K} func
 * @returns {() => K}
 */
export function memo(func) {
	let isStored = false;
	let store;
	return () => {
		if (!isStored) {
			store = func();
			isStored = true;
			return store;
		} else {
			return store;
		}
	};
}
