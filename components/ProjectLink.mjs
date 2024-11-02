---
---

// @ts-check
	import { id, prop, template } from "./utils.mjs";

const ICON_TYPE_DATA_MAP = /** @type {const} */ ({
	github: /** @type {const} */ ({ classes: ["fa-brands", "fa-github"], tooltip: "Github" }),
	twitter: /** @type {const} */ ({ classes: ["fa-brands", "fa-twitter"], tooltip: "Twitter" }),
	facebook: /** @type {const} */ ({ classes: ["fa-brands", "fa-facebook"], tooltip: "Facebook" }),
	website: /** @type {const} */ ({ classes: ["fa-solid", "fa-link"], tooltip: "Website" }),
	devpost: /** @type {const} */ ({ classes: ["fa-brands", "fa-dev"], tooltip: "Devpost" }),
	devto: /** @type {const} */ ({ classes: ["fa-brands", "fa-dev"], tooltip: "Dev.to" }),
	api: /** @type {const} */ ({ classes: ["fa-solid", "fa-cloud"], tooltip: "API Docs" }),
	info: /** @type {const} */ ({ classes: ["fa-solid", "fa-circle-info"], tooltip: "Info" }),
	store: /** @type {const} */ ({ classes: ["fa-solid", "fa-store"], tooltip: "Store Page" }),
	download: /** @type {const} */ ({ classes: ["fa-solid", "fa-download"], tooltip: "Download" }),
});

/** @typedef {keyof ICON_TYPE_DATA_MAP} IconType*/

export class ProjectLink extends HTMLElement {
	static #TEMPLATE = template`
		<style>{% include styles/components/ProjectLink.styles.css %}</style>
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/fontawesome.min.css"
    		crossorigin="anonymous" referrerpolicy="no-referrer" media="print" onload="this.media='all'" />
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/brands.min.css"
    		crossorigin="anonymous" referrerpolicy="no-referrer" media="print" onload="this.media='all'" />
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/solid.min.css"
    		crossorigin="anonymous" referrerpolicy="no-referrer" media="print" onload="this.media='all'" />
		<a id="link" target="_blank"><i id="icon" class="fa-inverse fa-lg" aria-hidden="true"></i></a>
	`;

	static get observedAttributes() {
		return ["href", "type", "tooltip"];
	}

	/** @type {?string} */
	#href = null;
	/** @type {?string} */
	#tooltip = null;
	/** @type {?string} */
	#type = null;
	/** @type {boolean} */
	#replace = false;

	/** @type {ShadowRoot} */
	#r;
	/** @type {HTMLAnchorElement} */
	#link;
	/** @type {HTMLElement} */
	#icon;

	get href() {
		return this.#href;
	}

	get tooltip() {
		return this.#tooltip;
	}

	get type() {
		return this.#type;
	}

	set href(value) {
		if (value) {
			this.#href = value;
			this.#link.href = value;
		} else {
			this.#href = null;
			this.#link.removeAttribute("href");
		}
	}

	set tooltip(value) {
		this.#tooltip = value;
		this.#link.title = value ?? "";
	}

	set type(value) {
		if (value === this.#type) {
			return;
		}

		const icon = this.#icon;

		/** @type {ICON_TYPE_DATA_MAP[IconType] | undefined} */
		if (this.#type) {
			const oldIconData = ICON_TYPE_DATA_MAP[this.#type];
			this.#icon.classList.remove(...oldIconData.classes);
		}

		this.#link.title = "";

		this.#type = value;
		if (value && value in ICON_TYPE_DATA_MAP) {
			/** @type {ICON_TYPE_DATA_MAP[IconType]} */
			const iconData = ICON_TYPE_DATA_MAP[this.#type];
			icon.classList.add(...iconData.classes);

			this.#link.title = this.#tooltip || iconData.tooltip;
		}
	}

	constructor() {
		super();

		this.#r = this.attachShadow({ mode: "open" });
		this.#r.appendChild(ProjectLink.#TEMPLATE.content.cloneNode(true));

		this.#link = id(this.#r, "link");
		this.#icon = id(this.#r, "icon");
	}

	connectedCallback() {
		this.#href = prop(this, "href");
		this.#tooltip = prop(this, "tooltip");
		this.#type = prop(this, "type");
		this.#replace = prop(this, "replace") !== null;

		if (this.#type) {
			this.type = this.#type;
		}

		if (this.#tooltip) {
			this.#tooltip = this.#tooltip;
		}

		if (this.#href) {
			this.href = this.#href;
		}

		if (this.#replace) {
			this.#link.removeAttribute("target");
		}
	}

	/**
	 *
	 * @param {string} name
	 * @param {?string} _
	 * @param {?string} newValue
	 */
	attributeChangedCallback(name, _, newValue) {
		if (name === "href") {
			this.href = newValue;
		} else if (name === "tooltip") {
			this.tooltip = newValue;
		} else if (name === "type") {
			this.type = newValue;
		}
	}
}

customElements.define("project-link", ProjectLink);
